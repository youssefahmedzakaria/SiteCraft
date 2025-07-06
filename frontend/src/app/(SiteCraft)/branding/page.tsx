"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/SiteCraft/ui/button";
import { Input } from "@/components/SiteCraft/ui/input";
import { Card, CardContent } from "@/components/SiteCraft/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { getStoreSettings, updateStoreInfo } from "@/lib/store-info";
import { useRouter } from "next/navigation";
import { RefreshCw, AlertCircle } from "lucide-react";
import { siteCraftCache } from "@/lib/cache";

interface StoreData {
  id: number;
  storeName: string;
  storeType: string;
  description?: string;
  logo?: string;
  phoneNumber?: string;
  emailAddress?: string;
  address?: string;
  addressLink?: string;
  openingHours?: string;
  subdomain?: string;
}

function rgbToHex([r, g, b]: number[]): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

// Color extraction using canvas (improved for 3 colors)
function extractColorsFromImage(img: HTMLImageElement): {
  primary: string;
  secondary: string;
  accent: string;
} {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx)
    return { primary: "#000000", secondary: "#ffffff", accent: "#ff6b6b" };

  // Resize image for better performance and consistency
  const maxSize = 200;
  const scale = Math.min(maxSize / img.width, maxSize / img.height);
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Sample pixels to get dominant colors with better clustering
  const colors: {
    [key: string]: { count: number; r: number; g: number; b: number };
  } = {};
  const step = Math.max(1, Math.floor(data.length / 4 / 1000)); // Sample every 1000th pixel

  for (let i = 0; i < data.length; i += step * 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip transparent or very light pixels
    if (a < 128 || (r > 240 && g > 240 && b > 240)) continue;

    // Group similar colors together for better clustering (more aggressive grouping)
    const rGrouped = Math.floor(r / 32) * 32;
    const gGrouped = Math.floor(g / 32) * 32;
    const bGrouped = Math.floor(b / 32) * 32;

    const key = `${rGrouped},${gGrouped},${bGrouped}`;

    if (!colors[key]) {
      colors[key] = { count: 0, r: 0, g: 0, b: 0 };
    }

    colors[key].count++;
    colors[key].r += r;
    colors[key].g += g;
    colors[key].b += b;
  }

  // Calculate average colors for each cluster
  const colorClusters = Object.entries(colors).map(([key, cluster]) => {
    const avgR = Math.round(cluster.r / cluster.count);
    const avgG = Math.round(cluster.g / cluster.count);
    const avgB = Math.round(cluster.b / cluster.count);
    return {
      color: [avgR, avgG, avgB],
      count: cluster.count,
      brightness: (avgR * 299 + avgG * 587 + avgB * 114) / 1000, // Perceived brightness
      saturation: getSaturation(avgR, avgG, avgB),
    };
  });

  // Sort by count (dominance) and filter out very similar colors
  colorClusters.sort((a, b) => b.count - a.count);

  // Filter out colors that are too similar to already selected ones
  const selectedColors: typeof colorClusters = [];
  for (const cluster of colorClusters) {
    const isTooSimilar = selectedColors.some(
      (selected) => colorDistance(cluster.color, selected.color) < 80 // Increased threshold for better separation
    );

    if (!isTooSimilar) {
      selectedColors.push(cluster);
      if (selectedColors.length >= 3) break;
    }
  }

  // Ensure we have at least 3 colors by adding fallbacks
  while (selectedColors.length < 3) {
    if (selectedColors.length === 0) {
      selectedColors.push({
        color: [0, 0, 0],
        count: 0,
        brightness: 0,
        saturation: 0,
      });
    } else if (selectedColors.length === 1) {
      // Add a contrasting color
      const firstColor = selectedColors[0].color;
      const contrastingColor = [
        Math.min(255, firstColor[0] + 100),
        Math.min(255, firstColor[1] + 100),
        Math.min(255, firstColor[2] + 100),
      ];
      selectedColors.push({
        color: contrastingColor,
        count: 0,
        brightness:
          (contrastingColor[0] * 299 +
            contrastingColor[1] * 587 +
            contrastingColor[2] * 114) /
          1000,
        saturation: getSaturation(
          contrastingColor[0],
          contrastingColor[1],
          contrastingColor[2]
        ),
      });
    } else {
      // Add a third distinct color
      const color1 = selectedColors[0].color;
      const color2 = selectedColors[1].color;
      const thirdColor = [
        Math.abs(255 - (color1[0] + color2[0]) / 2),
        Math.abs(255 - (color1[1] + color2[1]) / 2),
        Math.abs(255 - (color1[2] + color2[2]) / 2),
      ];
      selectedColors.push({
        color: thirdColor,
        count: 0,
        brightness:
          (thirdColor[0] * 299 + thirdColor[1] * 587 + thirdColor[2] * 114) /
          1000,
        saturation: getSaturation(thirdColor[0], thirdColor[1], thirdColor[2]),
      });
    }
  }

  // Ensure the three colors are different by creating variations if needed
  let primary, secondary, accent;

  // Sort by saturation for primary selection
  const sortedBySaturation = [...selectedColors].sort(
    (a, b) => b.saturation - a.saturation
  );
  primary = rgbToHex(sortedBySaturation[0].color);

  // Sort by brightness for secondary selection
  const sortedByBrightness = [...selectedColors].sort(
    (a, b) => b.brightness - a.brightness
  );
  secondary = rgbToHex(sortedByBrightness[0].color);

  // For accent, choose the most different color from primary and secondary
  const primaryRgb = sortedBySaturation[0].color;
  const secondaryRgb = sortedByBrightness[0].color;

  let accentRgb = sortedBySaturation[1]?.color || sortedByBrightness[1]?.color;

  // If accent is too similar to primary or secondary, create a variation
  if (accentRgb) {
    const distanceToPrimary = colorDistance(accentRgb, primaryRgb);
    const distanceToSecondary = colorDistance(accentRgb, secondaryRgb);

    if (distanceToPrimary < 100 || distanceToSecondary < 100) {
      // Create a complementary color variation
      accentRgb = [
        Math.min(255, Math.max(0, 255 - primaryRgb[0])),
        Math.min(255, Math.max(0, 255 - primaryRgb[1])),
        Math.min(255, Math.max(0, 255 - primaryRgb[2])),
      ];
    }
  } else {
    // Fallback accent color
    accentRgb = [255, 107, 107];
  }

  accent = rgbToHex(accentRgb);

  // Final check: ensure all three colors are different
  if (primary === secondary) {
    // Make secondary lighter
    const secondaryRgb = sortedByBrightness[0].color;
    const lighterSecondary = [
      Math.min(255, secondaryRgb[0] + 50),
      Math.min(255, secondaryRgb[1] + 50),
      Math.min(255, secondaryRgb[2] + 50),
    ];
    secondary = rgbToHex(lighterSecondary);
  }

  if (primary === accent || secondary === accent) {
    // Create a new accent color
    const primaryRgb = sortedBySaturation[0].color;
    accent = rgbToHex([
      Math.min(255, Math.max(0, 255 - primaryRgb[0])),
      Math.min(255, Math.max(0, 255 - primaryRgb[1])),
      Math.min(255, Math.max(0, 255 - primaryRgb[2])),
    ]);
  }

  return { primary, secondary, accent };
}

// Helper function to calculate color distance
function colorDistance(color1: number[], color2: number[]): number {
  const [r1, g1, b1] = color1;
  const [r2, g2, b2] = color2;
  return Math.sqrt(
    Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
  );
}

// Helper function to calculate saturation
function getSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  return max === 0 ? 0 : delta / max;
}

// Color palette generation functions
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHexPalette = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

const hslToRgb = (
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

const rgbToHsl = (
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return { h, s, l };
};

const generateAnalogousPalette = (color: string): string[] => {
  const rgb = hexToRgb(color);
  if (!rgb) return [];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const result = [];

  // Generate colors at -30°, -15°, original, +15°, and +30°
  for (let i = -2; i <= 2; i++) {
    if (i === 0) {
      result.push(color); // Original color
    } else {
      let newHue = hsl.h + (i * 15) / 360;
      if (newHue < 0) newHue += 1;
      if (newHue > 1) newHue -= 1;

      const newRgb = hslToRgb(newHue, hsl.s, hsl.l);
      result.push(rgbToHexPalette(newRgb.r, newRgb.g, newRgb.b));
    }
  }

  return result;
};

const generateComplementaryPalette = (color: string): string[] => {
  const rgb = hexToRgb(color);
  if (!rgb) return [];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Complementary color (opposite on the color wheel)
  let complementaryHue = (hsl.h + 0.5) % 1;
  const complementaryRgb = hslToRgb(complementaryHue, hsl.s, hsl.l);
  const complementaryColor = rgbToHexPalette(
    complementaryRgb.r,
    complementaryRgb.g,
    complementaryRgb.b
  );

  return [color, complementaryColor];
};

const generateTriadicPalette = (color: string): string[] => {
  const rgb = hexToRgb(color);
  if (!rgb) return [];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const result = [color];

  // Generate colors at +120° and +240°
  for (let i = 1; i <= 2; i++) {
    let newHue = (hsl.h + (i * 120) / 360) % 1;
    const newRgb = hslToRgb(newHue, hsl.s, hsl.l);
    result.push(rgbToHexPalette(newRgb.r, newRgb.g, newRgb.b));
  }

  return result;
};

const generateMonochromaticPalette = (color: string): string[] => {
  const rgb = hexToRgb(color);
  if (!rgb) return [];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const result = [];

  // Generate 5 shades with varying lightness
  for (let i = 0; i < 5; i++) {
    const newLightness = 0.1 + i * 0.2; // From 0.1 to 0.9
    const newRgb = hslToRgb(hsl.h, hsl.s, newLightness);
    result.push(rgbToHexPalette(newRgb.r, newRgb.g, newRgb.b));
  }

  return result;
};

const generateSplitComplementaryPalette = (color: string): string[] => {
  const rgb = hexToRgb(color);
  if (!rgb) return [];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const result = [color];

  // Generate colors at +150° and +210° (split complementary)
  for (let i = 1; i <= 2; i++) {
    let newHue = (hsl.h + (150 + (i - 1) * 60) / 360) % 1;
    const newRgb = hslToRgb(newHue, hsl.s, hsl.l);
    result.push(rgbToHexPalette(newRgb.r, newRgb.g, newRgb.b));
  }

  return result;
};

const generateTetradicPalette = (color: string): string[] => {
  const rgb = hexToRgb(color);
  if (!rgb) return [];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const result = [color];

  // Generate colors at +90°, +180°, and +270°
  for (let i = 1; i <= 3; i++) {
    let newHue = (hsl.h + (i * 90) / 360) % 1;
    const newRgb = hslToRgb(newHue, hsl.s, hsl.l);
    result.push(rgbToHexPalette(newRgb.r, newRgb.g, newRgb.b));
  }

  return result;
};

const generateWarmPalette = (color: string): string[] => {
  const rgb = hexToRgb(color);
  if (!rgb) return [];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const result = [color];

  // Generate warm variations (reds, oranges, yellows)
  const warmHues = [0, 0.08, 0.17]; // Red, orange, yellow
  for (let i = 1; i < warmHues.length; i++) {
    const newRgb = hslToRgb(warmHues[i], hsl.s, hsl.l);
    result.push(rgbToHexPalette(newRgb.r, newRgb.g, newRgb.b));
  }

  return result;
};

const generateCoolPalette = (color: string): string[] => {
  const rgb = hexToRgb(color);
  if (!rgb) return [];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const result = [color];

  // Generate cool variations (greens, blues, purples)
  const coolHues = [0.33, 0.67, 0.83]; // Green, blue, purple
  for (let i = 1; i < coolHues.length; i++) {
    const newRgb = hslToRgb(coolHues[i], hsl.s, hsl.l);
    result.push(rgbToHexPalette(newRgb.r, newRgb.g, newRgb.b));
  }

  return result;
};

const generateHighContrastPalette = (color: string): string[] => {
  const rgb = hexToRgb(color);
  if (!rgb) return [];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const result = [color];

  // High contrast variations
  const highContrastColors = [
    { h: (hsl.h + 0.5) % 1, s: hsl.s, l: 0.1 }, // Dark complementary
    { h: hsl.h, s: hsl.s, l: 0.9 }, // Light version
  ];

  for (const colorConfig of highContrastColors) {
    const newRgb = hslToRgb(colorConfig.h, colorConfig.s, colorConfig.l);
    result.push(rgbToHexPalette(newRgb.r, newRgb.g, newRgb.b));
  }

  return result;
};

const generateSoftPastelPalette = (color: string): string[] => {
  const rgb = hexToRgb(color);
  if (!rgb) return [];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const result = [color];

  // Soft pastel variations
  const pastelVariations = [
    { h: hsl.h, s: Math.max(0.1, hsl.s * 0.5), l: 0.8 }, // Light pastel
    { h: (hsl.h + 0.1) % 1, s: Math.max(0.1, hsl.s * 0.6), l: 0.75 }, // Slightly different hue
  ];

  for (const colorConfig of pastelVariations) {
    const newRgb = hslToRgb(colorConfig.h, colorConfig.s, colorConfig.l);
    result.push(rgbToHexPalette(newRgb.r, newRgb.g, newRgb.b));
  }

  return result;
};

const generateDeepRichPalette = (color: string): string[] => {
  const rgb = hexToRgb(color);
  if (!rgb) return [];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const result = [color];

  // Deep and rich variations
  const deepVariations = [
    { h: hsl.h, s: Math.min(1, hsl.s * 1.2), l: 0.3 }, // Darker, more saturated
    { h: (hsl.h + 0.05) % 1, s: Math.min(1, hsl.s * 1.1), l: 0.25 }, // Very dark
  ];

  for (const colorConfig of deepVariations) {
    const newRgb = hslToRgb(colorConfig.h, colorConfig.s, colorConfig.l);
    result.push(rgbToHexPalette(newRgb.r, newRgb.g, newRgb.b));
  }

  return result;
};

// Function to generate and save all color palettes
const generateAndSaveColorPalettes = (
  primaryColor: string,
  secondaryColor: string,
  accentColor: string
) => {
  const palettes = [
    {
      name: "Logo Inspired",
      colors: [primaryColor, secondaryColor, accentColor],
    },
    {
      name: "Analogous Harmony",
      colors: generateAnalogousPalette(primaryColor).slice(0, 3),
    },
    {
      name: "Complementary Contrast",
      colors: generateComplementaryPalette(primaryColor).concat([
        secondaryColor,
      ]),
    },
    {
      name: "Triadic Balance",
      colors: generateTriadicPalette(primaryColor),
    },
    {
      name: "Monochromatic Shades",
      colors: generateMonochromaticPalette(primaryColor).slice(0, 3),
    },
    {
      name: "Split Complementary",
      colors: generateSplitComplementaryPalette(primaryColor),
    },
    {
      name: "Tetradic Harmony",
      colors: generateTetradicPalette(primaryColor),
    },
    {
      name: "Warm Variations",
      colors: generateWarmPalette(primaryColor),
    },
    {
      name: "Cool Variations",
      colors: generateCoolPalette(primaryColor),
    },
    {
      name: "High Contrast",
      colors: generateHighContrastPalette(primaryColor),
    },
    {
      name: "Soft Pastels",
      colors: generateSoftPastelPalette(primaryColor),
    },
    {
      name: "Deep & Rich",
      colors: generateDeepRichPalette(primaryColor),
    },
  ];

  // Save palettes to localStorage
  localStorage.setItem("colorPalettes", JSON.stringify(palettes));
  console.log("🎨 Color palettes generated and saved:", palettes);
};

// Helper to convert File to Data URL
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function resizeImage(file: Blob, maxWidth = 300, maxHeight = 300) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target || typeof e.target.result !== "string") {
        reject(new Error("Failed to read image file."));
        return;
      }
      img.src = e.target.result;
    };
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height *= maxWidth / width));
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width *= maxHeight / height));
        height = maxHeight;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context."));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob from canvas."));
          }
        },
        "image/jpeg",
        0.7 // quality
      );
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function BrandingPage() {
  const [storeName, setStoreName] = useState(
    siteCraftCache.getStoreData()?.storeName || ""
  );
  const [primaryColor, setPrimaryColor] = useState(
    siteCraftCache.getStoreData()?.colors?.primary || "#000000"
  );
  const [secondaryColor, setSecondaryColor] = useState(
    siteCraftCache.getStoreData()?.colors?.secondary || "#ffffff"
  );
  const [accentColor, setAccentColor] = useState(
    siteCraftCache.getStoreData()?.colors?.accent || "#ff6b6b"
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(
    siteCraftCache.getData()?.logo || null
  );
  const [storeType, setStoreType] = useState(
    siteCraftCache.getStoreData()?.storeType || ""
  );
  const [isCreating, setIsCreating] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const [existingStore, setExistingStore] = useState<StoreData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isClient) return;
    if (e.target.files && e.target.files[0]) {
      let file = e.target.files[0];
      // Resize/compress before storing
      let resizedBlob: Blob;
      try {
        resizedBlob = (await resizeImage(file, 300, 300)) as Blob;
      } catch (err) {
        console.error("Image resize failed:", err);
        setError("Failed to process image. Please try a different file.");
        return;
      }
      if (!(resizedBlob instanceof Blob)) {
        setError("Failed to process image. Please try a different file.");
        return;
      }
      const resizedFile = new File([resizedBlob as BlobPart], file.name, {
        type: "image/jpeg",
      });
      const dataUrl = await fileToDataUrl(resizedFile);
      setLogoDataUrl(dataUrl);
      siteCraftCache.setData({ ...siteCraftCache.getData(), logo: dataUrl });

      // Clear errors when a new logo is selected
      if (error) {
        setError(null);
      }

      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.src = URL.createObjectURL(resizedFile);
      img.onload = () => {
        try {
          console.log("Extracting colors from uploaded logo...");
          const colors = extractColorsFromImage(img);
          setPrimaryColor(colors.primary);
          setSecondaryColor(colors.secondary);
          setAccentColor(colors.accent);

          // Generate and save color palettes immediately after color extraction
          generateAndSaveColorPalettes(
            colors.primary,
            colors.secondary,
            colors.accent
          );

          console.log("✅ Colors extracted successfully:", colors);
        } catch (err) {
          console.error("Color extraction failed:", err);
          // Set default colors if extraction fails
          setPrimaryColor("#000000");
          setSecondaryColor("#ffffff");
          setAccentColor("#ff6b6b");
        }
      };
      img.onerror = () => {
        console.error("Failed to load uploaded logo image");
        // Set default colors if image loading fails
        setPrimaryColor("#000000");
        setSecondaryColor("#ffffff");
        setAccentColor("#ff6b6b");
      };
    }
  };

  // Extract colors from existing logo on load
  useEffect(() => {
    if (!isClient || !existingStore?.logo) return;

    const logoUrl = getLogoUrl(existingStore.logo);
    console.log("Loading existing logo from:", logoUrl);

    loadImageWithCors(logoUrl)
      .then((img) => {
        console.log("Extracting colors from existing logo...");
        const colors = extractColorsFromImage(img);
        setPrimaryColor(colors.primary);
        setSecondaryColor(colors.secondary);
        setAccentColor(colors.accent);

        // Generate and save color palettes for existing logo
        generateAndSaveColorPalettes(
          colors.primary,
          colors.secondary,
          colors.accent
        );

        console.log("✅ Colors extracted from existing logo:", colors);
      })
      .catch((err) => {
        console.error("Failed to load existing logo image:", err);
        // Set default colors if image loading fails
        setPrimaryColor("#000000");
        setSecondaryColor("#ffffff");
        setAccentColor("#ff6b6b");
      });
  }, [existingStore?.logo, isClient]);

  const handleStoreNameChange = (value: string) => {
    setStoreName(value);
    // Clear errors when user starts typing
    if (errors.storeName) {
      setErrors((prev) => ({ ...prev, storeName: "" }));
    }
    if (error) {
      setError(null);
    }
  };

  const handleSaveChanges = async () => {
    if (!isClient) {
      alert("Please wait for page to load");
      return;
    }

    if (!storeName.trim() || !storeType) {
      setError("Please fill in store name and store type.");
      return;
    }

    // Clear any existing errors
    setError(null);
    setErrors({});

    // Validate colors before saving
    const validPrimaryColor = validateHexColor(primaryColor)
      ? primaryColor
      : "#000000";
    const validSecondaryColor = validateHexColor(secondaryColor)
      ? secondaryColor
      : "#ffffff";
    const validAccentColor = validateHexColor(accentColor)
      ? accentColor
      : "#ff6b6b";

    console.log("🚀 Primary color", primaryColor);
    console.log("🚀 Secondary color", secondaryColor);
    console.log("🚀 Accent color", accentColor);
    console.log("🚀 Valid primary color", validPrimaryColor);
    console.log("🚀 Valid secondary color", validSecondaryColor);
    console.log("🚀 Valid accent color", validAccentColor);

    setIsCreating(true);
    try {
      // Save store data to cache instead of creating in database
      console.log("🏪 Saving store data to cache:", {
        storeName,
        storeType,
        logoFile: logoFile?.name,
      });

      siteCraftCache.saveStoreData({
        store: {
          storeName: storeName.trim(),
          storeType: storeType,
          description: `Store created for ${storeName}`,
          phoneNumber: "",
          emailAddress: "",
          address: "",
          addressLink: "",
          openingHours: "",
          colors: {
            primary: validPrimaryColor,
            secondary: validSecondaryColor,
            accent: validAccentColor,
          },
        },
        logo: logoDataUrl,
      });
      console.log("💾 Store data saved to cache:", {
        validPrimaryColor,
        validSecondaryColor,
        validAccentColor,
      });

      // Navigate to the color-palette page
      router.push("/branding/color-palette");
    } catch (error) {
      console.error("💥 Error saving store:", error);

      // Handle different types of errors
      if (error instanceof Error) {
        if (
          error.message.includes("File size too large") ||
          error.message.includes("image is too large")
        ) {
          setError(
            "The logo image you uploaded is too large. Please choose a smaller image (under 5MB) and try again."
          );
        } else if (
          error.message.includes("subdomain") ||
          error.message.includes("unique constraint") ||
          error.message.includes("already taken")
        ) {
          setErrors({
            storeName:
              "A store with this name already exists. Please choose a different store name.",
          });
        } else if (error.message.includes("duplicate key")) {
          setErrors({
            storeName:
              "This store name is already taken. Please choose a different name.",
          });
        } else {
          setError(error.message);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Validate hex color format
  const validateHexColor = (color: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  };

  // Handle color input changes with validation
  const handleColorChange = (
    colorType: "primary" | "secondary" | "accent",
    value: string
  ) => {
    if (!isClient) return;

    const cleanValue = value.startsWith("#") ? value : `#${value}`;

    if (validateHexColor(cleanValue)) {
      switch (colorType) {
        case "primary":
          setPrimaryColor(cleanValue);
          break;
        case "secondary":
          setSecondaryColor(cleanValue);
          break;
        case "accent":
          setAccentColor(cleanValue);
          break;
      }
    }
  };

  // Helper to get full logo URL
  function getLogoUrl(logo: string | undefined): string {
    if (!logo) return "";
    if (logo.startsWith("http://") || logo.startsWith("https://")) return logo;
    return `http://localhost:8080/${logo.replace(/^\//, "")}`;
  }

  // Helper to load image with CORS handling
  function loadImageWithCors(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn("Failed to load image with CORS, trying without CORS...");
        // Try without CORS as fallback
        const imgWithoutCors = new Image();
        imgWithoutCors.onload = () => resolve(imgWithoutCors);
        imgWithoutCors.onerror = () =>
          reject(new Error("Failed to load image"));
        imgWithoutCors.src = src;
      };

      img.src = src;
    });
  }

  // Don't render until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto p-4 md:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600">Loading...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6">
        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white">
                1
              </div>
              <div className="ml-2 font-medium">Branding</div>
            </div>
            <div className="w-12 h-1 mx-4 bg-black"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-700">
                2
              </div>
              <div className="ml-2 text-gray-500">Color Palette</div>
            </div>
            <div className="w-12 h-1 mx-4 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-700">
                3
              </div>
              <div className="ml-2 text-gray-500">Templates</div>
            </div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mt-2">
          {existingStore
            ? "Edit Your Store Branding"
            : "Customize Your Branding"}
        </h1>
        <p className="text-gray-500 mt-2 mb-6">
          {existingStore
            ? "Update your store's appearance and information"
            : "Personalize your store's appearance with your brand colors and information"}
        </p>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 border border-red-300 rounded-md bg-red-50">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <Card className="bg-white">
          <CardContent className="pt-2 pb-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Store Information Section */}
              <div className="lg:border-r lg:pr-8 border-gray-200">
                <h2 className="text-xl font-semibold mb-4">
                  Store Information
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Set your store name and logo
                </p>

                <div className="space-y-6">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo
                    </label>
                    <div className="flex items-center">
                      <div className="w-16 h-16 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden mr-4">
                        {logoFile instanceof File ? (
                          <img
                            src={URL.createObjectURL(logoFile)}
                            alt="Logo Preview"
                            className="w-full h-full object-contain"
                          />
                        ) : logoDataUrl ? (
                          <img
                            src={logoDataUrl}
                            alt="Logo Preview"
                            className="w-full h-full object-contain"
                          />
                        ) : existingStore?.logo ? (
                          <img
                            src={getLogoUrl(existingStore.logo)}
                            alt="Current Logo"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            ></path>
                          </svg>
                        )}
                      </div>
                      <div>
                        <Button
                          variant="outline"
                          onClick={() =>
                            document.getElementById("logo-upload")?.click()
                          }
                          className="mb-1"
                        >
                          Choose File
                        </Button>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                        <p className="text-xs text-gray-400">
                          {logoFile
                            ? logoFile.name
                            : logoDataUrl
                            ? "Current logo"
                            : existingStore?.logo
                            ? "Current logo"
                            : "No file chosen"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Store Name */}
                  <div>
                    <label
                      htmlFor="storeName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Store Name *
                    </label>
                    <Input
                      id="storeName"
                      value={storeName}
                      onChange={(e) => handleStoreNameChange(e.target.value)}
                      placeholder="Your Store Name"
                      className={`w-full ${
                        errors.storeName ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {errors.storeName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.storeName}
                      </p>
                    )}
                  </div>

                  {/* Store Type */}
                  <div>
                    <label
                      htmlFor="storeType"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Store Type *
                    </label>
                    <div className="relative">
                      <select
                        id="storeType"
                        value={storeType}
                        onChange={(e) => {
                          setStoreType(e.target.value);
                          // Clear errors when user makes a selection
                          if (error) {
                            setError(null);
                          }
                        }}
                        className="block w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] appearance-none"
                        required
                      >
                        <option value="" disabled>
                          Select your store type
                        </option>
                        <option value="fashion">Fashion & Apparel</option>
                        <option value="electronics">Electronics</option>
                        <option value="home">Home & Furniture</option>
                        <option value="beauty">Beauty & Personal Care</option>
                        <option value="food">Food & Grocery</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Scheme Section */}
              <div className="lg:pl-8">
                <h2 className="text-xl font-semibold mb-4">Color Scheme</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Choose your store's colors
                </p>

                <div className="space-y-6">
                  {/* Primary Color */}
                  <div>
                    <label
                      htmlFor="primaryColor"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Primary Color
                    </label>
                    <div className="flex items-center">
                      <div
                        className="w-10 h-10 rounded-md mr-3 border border-gray-300"
                        style={{ backgroundColor: primaryColor }}
                      ></div>
                      <Input
                        id="primaryColor"
                        type="text"
                        value={primaryColor}
                        onChange={(e) =>
                          handleColorChange("primary", e.target.value)
                        }
                        className="w-32"
                      />
                      <Input
                        type="color"
                        value={primaryColor}
                        onChange={(e) =>
                          handleColorChange("primary", e.target.value)
                        }
                        className="w-12 h-9 p-1 ml-2"
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div>
                    <label
                      htmlFor="secondaryColor"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Secondary Color
                    </label>
                    <div className="flex items-center">
                      <div
                        className="w-10 h-10 rounded-md mr-3 border border-gray-300"
                        style={{ backgroundColor: secondaryColor }}
                      ></div>
                      <Input
                        id="secondaryColor"
                        type="text"
                        value={secondaryColor}
                        onChange={(e) =>
                          handleColorChange("secondary", e.target.value)
                        }
                        className="w-32"
                      />
                      <Input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) =>
                          handleColorChange("secondary", e.target.value)
                        }
                        className="w-12 h-9 p-1 ml-2"
                      />
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div>
                    <label
                      htmlFor="accentColor"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Accent Color
                    </label>
                    <div className="flex items-center">
                      <div
                        className="w-10 h-10 rounded-md mr-3 border border-gray-300"
                        style={{ backgroundColor: accentColor }}
                      ></div>
                      <Input
                        id="accentColor"
                        type="text"
                        value={accentColor}
                        onChange={(e) =>
                          handleColorChange("accent", e.target.value)
                        }
                        className="w-32"
                      />
                      <Input
                        type="color"
                        value={accentColor}
                        onChange={(e) =>
                          handleColorChange("accent", e.target.value)
                        }
                        className="w-12 h-9 p-1 ml-2"
                      />
                    </div>
                  </div>

                  {/* Color Preview */}
                  <div className="mt-8">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Preview
                    </h3>
                    <div className="border border-gray-300 rounded-md overflow-hidden">
                      <div className="flex flex-col items-center">
                        <div
                          className="w-full h-16 flex items-center justify-center border-b border-gray-300"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <span className="text-white font-bold">
                            Primary Color
                          </span>
                        </div>
                        <div
                          className="w-full h-16 flex items-center justify-center"
                          style={{ backgroundColor: secondaryColor }}
                        >
                          <span
                            className="font-bold"
                            style={{ color: primaryColor }}
                          >
                            Secondary Color
                          </span>
                        </div>
                        <div
                          className="w-full h-16 flex items-center justify-center"
                          style={{ backgroundColor: accentColor }}
                        >
                          <span
                            className="font-bold"
                            style={{ color: primaryColor }}
                          >
                            Accent Color
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSaveChanges}
            disabled={isCreating || !storeName.trim() || !storeType}
            className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
          >
            {isCreating
              ? "Saving Changes..."
              : existingStore
              ? "Update Store"
              : "Create Store"}
          </Button>
        </div>
      </main>
    </div>
  );
}
