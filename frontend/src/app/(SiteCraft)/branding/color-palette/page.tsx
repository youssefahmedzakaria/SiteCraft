"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/SiteCraft/ui/button";
import { Card, CardContent } from "@/components/SiteCraft/ui/card";
import { Input } from "@/components/SiteCraft/ui/input";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { siteCraftCache } from "@/lib/cache";
import { fetchPixabayImages } from "@/lib/pixabay";
import { templates as initialTemplates } from "@/lib/templates";

// Color theory utility functions
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

const rgbToHex = (r: number, g: number, b: number): string => {
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

// Color palette generation algorithms
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
      result.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
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
  const complementaryColor = rgbToHex(
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
    result.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
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
    result.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
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
    result.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
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
    result.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
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
    result.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
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
    result.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
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
    result.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
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
    result.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
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
    result.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  }

  return result;
};

interface ColorPalette {
  name: string;
  colors: string[];
}

// Map store type to search queries for different sections
const storeTypeToQueries = (storeType: string) => {
  switch (storeType.toLowerCase()) {
    case "jewelry":
      return {
        promo: "jewelry showcase",
        categories: "jewelry category",
        products: "jewelry product",
        about: "jewelry store",
        contact: "jewelry shop exterior",
      };
    case "fashion & apparel":
      return {
        promo: "fashion model",
        categories: "fashion category",
        products: "fashion product",
        about: "fashion boutique",
        contact: "fashion store exterior",
      };
    case "electronics":
      return {
        promo: "tech gadgets",
        categories: "tech category",
        products: "tech product",
        about: "tech store",
        contact: "tech shop exterior",
      };
    case "home & furniture":
      return {
        promo: "home decor",
        categories: "home decor category",
        products: "home decor product",
        about: "home decor shop",
        contact: "home decor store exterior",
      };
    default:
      return {
        promo: storeType,
        categories: storeType,
        products: storeType,
        about: storeType,
        contact: storeType,
      };
  }
};

export default function ColorPalettePage() {
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [accentColor, setAccentColor] = useState("#ff6b6b");
  const [suggestedPalettes, setSuggestedPalettes] = useState<ColorPalette[]>(
    []
  );
  const [selectedPaletteName, setSelectedPaletteName] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [brandingPalette, setBrandingPalette] = useState<ColorPalette | null>(
    null
  );

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load colors from cache/branding first, then localStorage, then defaults
  useEffect(() => {
    if (!isClient) return;
    const cachedData = siteCraftCache.getData();
    if (cachedData.store?.colors) {
      setPrimaryColor(cachedData.store.colors.primary);
      setSecondaryColor(cachedData.store.colors.secondary);
      setAccentColor(cachedData.store.colors.accent);
      setBrandingPalette({
        name: "Logo Inspired",
        colors: [
          cachedData.store.colors.primary,
          cachedData.store.colors.secondary,
          cachedData.store.colors.accent,
        ],
      });
      return;
    }
    // Fallback to localStorage (set by branding page)
    const storedPrimaryColor =
      localStorage.getItem("primaryColor") || "#000000";
    const storedSecondaryColor =
      localStorage.getItem("secondaryColor") || "#ffffff";
    const storedAccentColor = localStorage.getItem("accentColor") || "#ff6b6b";
    setPrimaryColor(storedPrimaryColor);
    setSecondaryColor(storedSecondaryColor);
    setAccentColor(storedAccentColor);
    setBrandingPalette({
      name: "Branding Colors",
      colors: [storedPrimaryColor, storedSecondaryColor, storedAccentColor],
    });
  }, [isClient]);

  // Generate suggested palettes based on the current primary color
  useEffect(() => {
    if (!isClient) return;
    const palettes: ColorPalette[] = [
      {
        name: "Analogous Harmony",
        colors: generateAnalogousPalette(primaryColor),
      },
      {
        name: "Complementary Contrast",
        colors: generateComplementaryPalette(primaryColor),
      },
      { name: "Triadic Balance", colors: generateTriadicPalette(primaryColor) },
      {
        name: "Monochromatic Shades",
        colors: generateMonochromaticPalette(primaryColor),
      },
      {
        name: "Split Complementary",
        colors: generateSplitComplementaryPalette(primaryColor),
      },
      {
        name: "Tetradic Harmony",
        colors: generateTetradicPalette(primaryColor),
      },
      { name: "Warm Variations", colors: generateWarmPalette(primaryColor) },
      { name: "Cool Variations", colors: generateCoolPalette(primaryColor) },
      {
        name: "High Contrast",
        colors: generateHighContrastPalette(primaryColor),
      },
      { name: "Soft Pastels", colors: generateSoftPastelPalette(primaryColor) },
      { name: "Deep & Rich", colors: generateDeepRichPalette(primaryColor) },
    ];
    setSuggestedPalettes(palettes);
  }, [primaryColor, isClient]);

  // Validate hex color format
  const validateHexColor = (color: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  };

  // Ensure color contrast for accessibility
  const ensureContrast = (
    backgroundColor: string,
    textColor: string
  ): string => {
    const bgRgb = hexToRgb(backgroundColor);
    const textRgb = hexToRgb(textColor);

    if (!bgRgb || !textRgb) return textColor;

    const bgBrightness = (bgRgb.r * 299 + bgRgb.g * 587 + bgRgb.b * 114) / 1000;
    const textBrightness =
      (textRgb.r * 299 + textRgb.g * 587 + textRgb.b * 114) / 1000;

    const contrast = Math.abs(bgBrightness - textBrightness);

    // If contrast is too low, return a contrasting color
    if (contrast < 128) {
      return bgBrightness > 128 ? "#000000" : "#ffffff";
    }

    return textColor;
  };

  const handleSaveChanges = async () => {
    if (!isClient) return;

    setIsLoading(true);

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

    try {
      console.log("🚀 Starting image fetch process...");

      // Save colors to cache instead of database
      const cachedData = siteCraftCache.getData();
      if (cachedData.store) {
        cachedData.store.colors = {
          primary: validPrimaryColor,
          secondary: validSecondaryColor,
          accent: validAccentColor,
        };

        // Get store type and logo
        const storeType = cachedData.store.storeType || "store";
        const storeName = cachedData.store.storeName || "My Store";
        const logoUrl = cachedData.logo;

        console.log(`🏪 Logo Url: ${logoUrl}`);
        console.log(`🏪 Store type: ${storeType}`);

        // Map store type to queries
        const queries = storeTypeToQueries(storeType);
        console.log("🔍 Search queries:", queries);

        // Fetch images for each section with individual error handling
        console.log("📡 Fetching images from Pixabay...");

        const imagePromises = [
          fetchPixabayImages(queries.promo, 3).catch((err) => {
            console.warn("⚠️ Failed to fetch promo images:", err);
            return [];
          }),
          fetchPixabayImages(queries.categories, 6).catch((err) => {
            console.warn("⚠️ Failed to fetch category images:", err);
            return [];
          }),
          fetchPixabayImages(queries.products, 8).catch((err) => {
            console.warn("⚠️ Failed to fetch product images:", err);
            return [];
          }),
          fetchPixabayImages(queries.about, 3).catch((err) => {
            console.warn("⚠️ Failed to fetch about images:", err);
            return [];
          }),
          fetchPixabayImages(queries.contact, 3).catch((err) => {
            console.warn("⚠️ Failed to fetch contact images:", err);
            return [];
          }),
        ];

        const [
          promoImages,
          categoryImages,
          productImages,
          aboutImages,
          contactImages,
        ] = await Promise.all(imagePromises);

        console.log("📊 Image fetch results:", {
          promo: promoImages.length,
          categories: categoryImages.length,
          products: productImages.length,
          about: aboutImages.length,
          contact: contactImages.length,
        });

        // Update all templates with new images (except header/footer logos)
        console.log("🔄 Updating templates with fetched images...");
        const updatedTemplates = initialTemplates.map(
          (template, templateIndex) => {
            console.log(`📝 Updating template ${templateIndex + 1}...`);

            // Header logo
            if (template.header) {
              template.header.logo = {
                ...template.header.logo,
                src: logoUrl || '/placeholder.png',
                alt: "Brand Logo",
              };
              template.header.brandName = storeName;
            }

            // Footer logo
            if (template.footer) {
              template.footer.logo = {
                ...template.footer.logo,
                src: logoUrl || '/placeholder.png',
                alt: "Brand Logo",
              };
              template.footer.brandName = storeName;
            }

            // PromoSlider images
            if (template.PromoSlider && promoImages.length > 0) {
              template.PromoSlider.slides = template.PromoSlider.slides.map(
                (slide, idx) => ({
                  ...slide,
                  image: promoImages[idx % promoImages.length].url,
                  imageAlt: promoImages[idx % promoImages.length].alt,
                })
              );
            }

            // Categories images
            if (template.Categories && categoryImages.length > 0) {
              template.Categories.categories =
                template.Categories.categories.map((cat, idx) => ({
                  ...cat,
                  images: [
                    {
                      id: 1,
                      url: categoryImages[idx % categoryImages.length].url,
                      alt: categoryImages[idx % categoryImages.length].alt,
                    },
                  ],
                }));
            }

            // Products images
            if (template.Products && productImages.length > 0) {
              template.Products.products = template.Products.products.map(
                (prod, idx) => ({
                  ...prod,
                  images: [
                    {
                      id: 1,
                      url: productImages[idx % productImages.length].url,
                      alt: productImages[idx % productImages.length].alt,
                    },
                  ],
                })
              );
            }

            // AboutUs image
            if (template.AboutUs && aboutImages.length > 0) {
              template.AboutUs.image = aboutImages[0].url;
              template.AboutUs.imageAlt = aboutImages[0].alt;
            }

            // ContactUs image
            if (template.ContactUs && contactImages.length > 0) {
              template.ContactUs.image = contactImages[0].url;
            }

            console.log(`📝 Updated template ${templateIndex + 1}:`, template);
            return template;
          }
        );

        // Save updated templates to cache
        console.log("💾 Saving updated templates to cache...");
        siteCraftCache.setData({
          ...cachedData,
          store: cachedData.store,
          templates: updatedTemplates,
        });

        console.log("✅ Successfully saved colors and images to cache");
      }

      // Also save to localStorage for backward compatibility
      localStorage.setItem("primaryColor", validPrimaryColor);
      localStorage.setItem("secondaryColor", validSecondaryColor);
      localStorage.setItem("accentColor", validAccentColor);

      console.log("✅ Colors updated in cache and localStorage");

      // Navigate to templates page
      router.push("/branding/templates");
    } catch (error) {
      console.error("💥 Error saving colors/images to cache:", error);
      alert("Failed to save colors or images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPalette = (palette: ColorPalette) => {
    if (!isClient) return;

    // Validate palette colors before setting
    const validColors = palette.colors.map((color) =>
      validateHexColor(color) ? color : "#000000"
    );

    setPrimaryColor(validColors[0] || "#000000");
    setSecondaryColor(validColors[1] || "#ffffff");
    if (validColors[2]) {
      setAccentColor(validColors[2]);
    }
    setSelectedPaletteName(palette.name);

    console.log("🎨 Palette selected:", palette.name, validColors);
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

  const handleBackClick = () => {
    if (!isClient) return;
    // Navigate back to the branding page
    router.push("/branding");
  };

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
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white">
                2
              </div>
              <div className="ml-2 font-medium">Color Palette</div>
            </div>
            <div className="w-12 h-1 mx-4 bg-black"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-700">
                3
              </div>
              <div className="ml-2 text-gray-500">Templates</div>
            </div>
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mt-2">
          Choose Your Color Palette
        </h1>
        <p className="text-gray-500 mt-2 mb-6">
          Select from our presets or create your own custom colors.
        </p>

        <Card className="bg-white shadow-md">
          <CardContent className="pt-2 pb-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Preset Palettes */}
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Preset Color Palettes
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Choose from our professionally designed color schemes
                </p>{" "}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  {brandingPalette && (
                    <div
                      className={`border rounded-lg p-3 cursor-pointer transition-all transform hover:scale-105 ${
                        brandingPalette.name === selectedPaletteName
                          ? "border-black bg-gray-50"
                          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                      onClick={() => handleSelectPalette(brandingPalette)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium">{brandingPalette.name}</p>
                        {brandingPalette.name === selectedPaletteName && (
                          <svg
                            className="w-5 h-5 text-black"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        )}
                      </div>
                      <div className="flex justify-center space-x-2">
                        {brandingPalette.colors
                          .slice(0, 3)
                          .map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="w-8 h-8 rounded-full border border-gray-200"
                              style={{ backgroundColor: color }}
                            ></div>
                          ))}
                      </div>
                    </div>
                  )}
                  {suggestedPalettes.map((palette, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-3 cursor-pointer transition-all transform hover:scale-105 ${
                        palette.name === selectedPaletteName
                          ? "border-black bg-gray-50"
                          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                      onClick={() => handleSelectPalette(palette)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium">{palette.name}</p>
                        {palette.name === selectedPaletteName && (
                          <svg
                            className="w-5 h-5 text-black"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        )}
                      </div>
                      <div className="flex justify-center space-x-2">
                        {palette.colors.slice(0, 3).map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="w-8 h-8 rounded-full border border-gray-200"
                            style={{ backgroundColor: color }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:border-l lg:pl-8 border-gray-200 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Custom Colors</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Customize your store's color scheme
                  </p>

                  <div className="space-y-4">
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: primaryColor }}
                        ></div>
                        Primary Color
                      </label>
                      <div className="flex items-center">
                        <div
                          className="w-12 h-12 rounded-md mr-3 border border-gray-300 shadow-sm"
                          style={{ backgroundColor: primaryColor }}
                        />
                        <Input
                          type="text"
                          value={primaryColor}
                          onChange={(e) =>
                            handleColorChange("primary", e.target.value)
                          }
                          className="w-32 border-gray-300"
                        />
                        <Input
                          type="color"
                          value={primaryColor}
                          onChange={(e) =>
                            handleColorChange("primary", e.target.value)
                          }
                          className="w-12 h-9 p-1 ml-2 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Secondary Color */}
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: secondaryColor }}
                        ></div>
                        Secondary Color
                      </label>
                      <div className="flex items-center">
                        <div
                          className="w-12 h-12 rounded-md mr-3 border border-gray-300 shadow-sm"
                          style={{ backgroundColor: secondaryColor }}
                        />
                        <Input
                          type="text"
                          value={secondaryColor}
                          onChange={(e) =>
                            handleColorChange("secondary", e.target.value)
                          }
                          className="w-32 border-gray-300"
                        />
                        <Input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) =>
                            handleColorChange("secondary", e.target.value)
                          }
                          className="w-12 h-9 p-1 ml-2 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div className="p-3 border border-gray-200 rounded-lg">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: accentColor }}
                        ></div>
                        Accent Color
                      </label>
                      <div className="flex items-center">
                        <div
                          className="w-12 h-12 rounded-md mr-3 border border-gray-300 shadow-sm"
                          style={{ backgroundColor: accentColor }}
                        />
                        <Input
                          type="text"
                          value={accentColor}
                          onChange={(e) =>
                            handleColorChange("accent", e.target.value)
                          }
                          className="w-32 border-gray-300"
                        />
                        <Input
                          type="color"
                          value={accentColor}
                          onChange={(e) =>
                            handleColorChange("accent", e.target.value)
                          }
                          className="w-12 h-9 p-1 ml-2 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 mb-2">
                  <h2 className="text-xl font-semibold mb-3">Live Preview</h2>
                  <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md">
                    <div
                      className="p-5 border-b border-gray-300"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <h3
                        className="text-lg font-semibold"
                        style={{
                          color: ensureContrast(primaryColor, secondaryColor),
                        }}
                      >
                        Primary Color
                      </h3>
                      <p
                        style={{
                          color: ensureContrast(primaryColor, secondaryColor),
                        }}
                      >
                        This shows how your primary color will look with text.
                      </p>
                      <Button
                        className="mt-3"
                        style={{
                          backgroundColor: accentColor,
                          color: ensureContrast(accentColor, "#ffffff"),
                        }}
                      >
                        Sample Button
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                      <div
                        className="p-5 border-r border-gray-300"
                        style={{ backgroundColor: secondaryColor }}
                      >
                        <h3
                          className="text-lg font-semibold"
                          style={{
                            color: ensureContrast(secondaryColor, primaryColor),
                          }}
                        >
                          Secondary Color
                        </h3>
                        <p
                          style={{
                            color: ensureContrast(secondaryColor, primaryColor),
                          }}
                        >
                          Secondary color text preview.
                        </p>
                      </div>

                      <div
                        className="p-5"
                        style={{ backgroundColor: accentColor }}
                      >
                        <h3
                          className="text-lg font-semibold"
                          style={{
                            color: ensureContrast(accentColor, "#ffffff"),
                          }}
                        >
                          Accent Color
                        </h3>
                        <p
                          style={{
                            color: ensureContrast(accentColor, "#ffffff"),
                          }}
                        >
                          Accent color text preview.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <Button
            onClick={handleBackClick}
            variant="outline"
            className="border-gray-300 hover:bg-gray-100"
            disabled={isLoading}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back
          </Button>
          <Button
            onClick={handleSaveChanges}
            className="bg-black text-white hover:bg-gray-800"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
