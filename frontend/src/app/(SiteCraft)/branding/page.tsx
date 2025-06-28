"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/SiteCraft/ui/button";
import { Input } from "@/components/SiteCraft/ui/input";
import { Card, CardContent } from "@/components/SiteCraft/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { createStore } from "@/lib/auth";
import { getStoreSettings, updateStoreInfo } from "@/lib/store-info";
import { useRouter } from "next/navigation";
import { RefreshCw, AlertCircle } from "lucide-react";

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
}

function rgbToHex([r, g, b]: number[]): string {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

// Color extraction using canvas (improved for 3 colors)
function extractColorsFromImage(img: HTMLImageElement): { primary: string; secondary: string; accent: string } {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return { primary: "#000000", secondary: "#ffffff", accent: "#ff6b6b" };

  // Resize image for better performance and consistency
  const maxSize = 200;
  const scale = Math.min(maxSize / img.width, maxSize / img.height);
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;
  
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Sample pixels to get dominant colors with better clustering
  const colors: { [key: string]: { count: number; r: number; g: number; b: number } } = {};
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
      saturation: getSaturation(avgR, avgG, avgB)
    };
  });

  // Sort by count (dominance) and filter out very similar colors
  colorClusters.sort((a, b) => b.count - a.count);
  
  // Filter out colors that are too similar to already selected ones
  const selectedColors: typeof colorClusters = [];
  for (const cluster of colorClusters) {
    const isTooSimilar = selectedColors.some(selected => 
      colorDistance(cluster.color, selected.color) < 50
    );
    
    if (!isTooSimilar) {
      selectedColors.push(cluster);
      if (selectedColors.length >= 3) break;
    }
  }

  // Ensure we have at least 3 colors
  while (selectedColors.length < 3) {
    selectedColors.push({
      color: [0, 0, 0],
      count: 0,
      brightness: 0,
      saturation: 0
    });
  }

  // Assign colors based on brightness and saturation
  const sortedByBrightness = [...selectedColors].sort((a, b) => b.brightness - a.brightness);
  const sortedBySaturation = [...selectedColors].sort((a, b) => b.saturation - a.saturation);

  // Primary: Most saturated color
  const primary = rgbToHex(sortedBySaturation[0].color);
  
  // Secondary: Lightest color (good for backgrounds)
  const secondary = rgbToHex(sortedByBrightness[0].color);
  
  // Accent: Most contrasting color to primary
  const accent = rgbToHex(sortedBySaturation[1]?.color || sortedByBrightness[1]?.color || [255, 107, 107]);

  return { primary, secondary, accent };
}

// Helper function to calculate color distance
function colorDistance(color1: number[], color2: number[]): number {
  const [r1, g1, b1] = color1;
  const [r2, g2, b2] = color2;
  return Math.sqrt(Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2));
}

// Helper function to calculate saturation
function getSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  return max === 0 ? 0 : delta / max;
}

export default function BrandingPage() {
  const [storeName, setStoreName] = useState("My Store");
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [accentColor, setAccentColor] = useState("#ff6b6b");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [storeType, setStoreType] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingStore, setExistingStore] = useState<StoreData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { user, updateSessionAfterStoreCreation } = useAuth();
  const router = useRouter();

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load existing store data if user has a store
  useEffect(() => {
    if (!isClient || !user?.userId) {
      setIsLoading(false);
      return;
    }

    const loadStoreData = async () => {
      try {
        // If user has a storeId, try to load existing store data
        if (user.storeId) {
          const storeData = await getStoreSettings();
          setExistingStore(storeData);
          
          // Pre-fill form with existing data
          setStoreName(storeData.storeName || "My Store");
          setStoreType(storeData.storeType || "");
          
          console.log('✅ Existing store data loaded:', storeData);
        }
      } catch (err) {
        console.log('ℹ️ No existing store found or error loading store data');
        // This is expected for new users who don't have a store yet
      } finally {
        setIsLoading(false);
      }
    };

    loadStoreData();
  }, [user, isClient]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isClient) return;
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);

      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        try {
          console.log('Extracting colors from uploaded logo...');
          const colors = extractColorsFromImage(img);
          setPrimaryColor(colors.primary);
          setSecondaryColor(colors.secondary);
          setAccentColor(colors.accent);
          console.log('✅ Colors extracted successfully:', colors);
        } catch (err) {
          console.error('Color extraction failed:', err);
          // Set default colors if extraction fails
          setPrimaryColor("#000000");
          setSecondaryColor("#ffffff");
          setAccentColor("#ff6b6b");
        }
      };
      img.onerror = () => {
        console.error('Failed to load uploaded logo image');
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
    console.log('Loading existing logo from:', logoUrl);
    
    loadImageWithCors(logoUrl)
      .then((img) => {
        console.log('Extracting colors from existing logo...');
        const colors = extractColorsFromImage(img);
        setPrimaryColor(colors.primary);
        setSecondaryColor(colors.secondary);
        setAccentColor(colors.accent);
        console.log('✅ Colors extracted from existing logo:', colors);
      })
      .catch((err) => {
        console.error('Failed to load existing logo image:', err);
        // Set default colors if image loading fails
        setPrimaryColor("#000000");
        setSecondaryColor("#ffffff");
        setAccentColor("#ff6b6b");
      });
  }, [existingStore?.logo, isClient]);

  const handleSaveChanges = async () => {
    if (!isClient || !user?.userId) {
      alert('User not authenticated');
      return;
    }

    if (!storeName.trim() || !storeType) {
      alert('Please fill in store name and store type');
      return;
    }

    // Validate colors before saving
    const validPrimaryColor = validateHexColor(primaryColor) ? primaryColor : "#000000";
    const validSecondaryColor = validateHexColor(secondaryColor) ? secondaryColor : "#ffffff";
    const validAccentColor = validateHexColor(accentColor) ? accentColor : "#ff6b6b";

    setIsCreating(true);
    try {
      if (existingStore) {
        // Update existing store
        console.log('🏪 Updating existing store with data:', {
          storeName,
          storeType,
          logoFile: logoFile?.name
        });

        const storeData = {
          storeName: storeName.trim(),
          storeType: storeType,
          description: existingStore.description || `Store updated for ${storeName}`
        };

        const result = await updateStoreInfo(storeData, logoFile || undefined);
        console.log('✅ Store updated successfully:', result);
        
        // Show success message and redirect to color palette
        alert('Store updated successfully!');
        router.push('/branding/color-palette');
      } else {
        // Create new store
        console.log('🏪 Creating new store with data:', {
          storeName,
          storeType,
          logoFile: logoFile?.name
        });

        const storeData = {
          storeName: storeName.trim(),
          storeType: storeType,
          description: `Store created for ${storeName}`,
          logo: logoFile || undefined
        };

        const result = await createStore(storeData, user.userId);
        console.log('✅ Store created successfully:', result);

        // Update session with store information
        if (result.store && result.store.id) {
          await updateSessionAfterStoreCreation(result.store.id, 'owner');
          console.log('✅ Session updated with store information');
        }
      }

      // Save validated colors to localStorage for the color-palette page
      localStorage.setItem("primaryColor", validPrimaryColor);
      localStorage.setItem("secondaryColor", validSecondaryColor);
      localStorage.setItem("accentColor", validAccentColor);
      
      console.log('💾 Colors saved to localStorage:', { validPrimaryColor, validSecondaryColor, validAccentColor });
      
      // Navigate to the color-palette page
      router.push('/branding/color-palette');
    } catch (error) {
      console.error('💥 Error saving store:', error);
      alert(`Failed to save store: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCreating(false);
    }
  };

  // Validate hex color format
  const validateHexColor = (color: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  };

  // Handle color input changes with validation
  const handleColorChange = (colorType: 'primary' | 'secondary' | 'accent', value: string) => {
    if (!isClient) return;
    
    const cleanValue = value.startsWith('#') ? value : `#${value}`;
    
    if (validateHexColor(cleanValue)) {
      switch (colorType) {
        case 'primary':
          setPrimaryColor(cleanValue);
          break;
        case 'secondary':
          setSecondaryColor(cleanValue);
          break;
        case 'accent':
          setAccentColor(cleanValue);
          break;
      }
    }
  };

  // Helper to get full logo URL
  function getLogoUrl(logo: string | undefined): string {
    if (!logo) return '';
    if (logo.startsWith('http://') || logo.startsWith('https://')) return logo;
    return `http://localhost:8080/${logo.replace(/^\//, '')}`;
  }

  // Helper to load image with CORS handling
  function loadImageWithCors(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn('Failed to load image with CORS, trying without CORS...');
        // Try without CORS as fallback
        const imgWithoutCors = new Image();
        imgWithoutCors.onload = () => resolve(imgWithoutCors);
        imgWithoutCors.onerror = () => reject(new Error('Failed to load image'));
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto p-4 md:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600">Loading store data...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto p-4 md:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Store</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
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
          {existingStore ? 'Edit Your Store Branding' : 'Customize Your Branding'}
        </h1>
        <p className="text-gray-500 mt-2 mb-6">
          {existingStore 
            ? 'Update your store\'s appearance and information'
            : 'Personalize your store\'s appearance with your brand colors and information'
          }
        </p>

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
                        {logoFile ? (
                          <img
                            src={URL.createObjectURL(logoFile)}
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
                          {logoFile ? logoFile.name : existingStore?.logo ? "Current logo" : "No file chosen"}
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
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Your Store Name"
                      className="w-full"
                      required
                    />
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
                        onChange={(e) => setStoreType(e.target.value)}
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
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="w-32"
                      />
                      <Input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
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
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        className="w-32"
                      />
                      <Input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
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
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        className="w-32"
                      />
                      <Input
                        type="color"
                        value={accentColor}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
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
            {isCreating ? 'Saving Changes...' : existingStore ? 'Update Store' : 'Create Store'}
          </Button>
        </div>
      </main>
    </div>
  );
}
