"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
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

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
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
    const complementaryColor = rgbToHex(complementaryRgb.r, complementaryRgb.g, complementaryRgb.b);

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
        const newLightness = 0.1 + (i * 0.2); // From 0.1 to 0.9
        const newRgb = hslToRgb(hsl.h, hsl.s, newLightness);
        result.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }

    return result;
};

interface ColorPalette {
    name: string;
    colors: string[];
}

export default function ColorPalettePage() {
    const [primaryColor, setPrimaryColor] = useState("#000000");
    const [secondaryColor, setSecondaryColor] = useState("#ffffff");
    const [accentColor, setAccentColor] = useState("#3498db");
    const [presetPalettes, setPresetPalettes] = useState<ColorPalette[]>([]);
    const [selectedPaletteName, setSelectedPaletteName] = useState<string>("");

    // Load colors from previous page
    useEffect(() => {
        // In a real app, you would use a state management solution like Redux or Context API
        // For this example, we'll simulate getting the colors from localStorage or URL params
        const storedPrimaryColor = localStorage.getItem("primaryColor") || "#000000";
        const storedSecondaryColor = localStorage.getItem("secondaryColor") || "#ffffff";

        setPrimaryColor(storedPrimaryColor);
        setSecondaryColor(storedSecondaryColor);

        // Generate accent color as a complementary color to primary
        const rgb = hexToRgb(storedPrimaryColor);
        if (rgb) {
            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
            const complementaryHue = (hsl.h + 0.5) % 1;
            const complementaryRgb = hslToRgb(complementaryHue, hsl.s, hsl.l);
            setAccentColor(rgbToHex(complementaryRgb.r, complementaryRgb.g, complementaryRgb.b));
        }
    }, []);

    // Generate palette suggestions based on primary color
    useEffect(() => {
        const palettes: ColorPalette[] = [
            {
                name: "Modern Minimalist",
                colors: [primaryColor, "#e0e0e0", accentColor],
            },
            {
                name: "Bold and Vibrant",
                colors: generateTriadicPalette(primaryColor),
            },
            {
                name: "Earthy Tones",
                colors: [
                    primaryColor,
                    "#8D6E63", // Brown
                    "#43A047", // Green
                ],
            },
            {
                name: "Pastel Dream",
                colors: [
                    "#FFB6C1", // Light pink
                    "#FFDAB9", // Peach
                    "#B0E0E6", // Light blue
                ],
            },
            {
                name: "Dark Mode",
                colors: [
                    "#121212", // Dark background
                    "#e0e0e0", // Light text
                    "#FF5252", // Accent red
                ],
            },
            {
                name: "Ocean Breeze",
                colors: [
                    "#4FC3F7", // Light blue
                    "#FFFDE7", // Light yellow
                    "#00ACC1", // Teal
                ],
            },
            {
                name: "Sunset Glow",
                colors: [
                    "#FF7043", // Coral
                    "#FFEB3B", // Yellow
                    "#FF4081", // Pink
                ],
            },
            {
                name: "Forest Retreat",
                colors: [
                    "#388E3C", // Green
                    "#A5D6A7", // Light green
                    "#FFEB3B", // Yellow
                ],
            },
            {
                name: "Urban Chic",
                colors: [
                    "#424242", // Dark gray
                    "#BDBDBD", // Light gray
                    "#FF9800", // Orange
                ],
            },
            {
                name: "Royal Elegance",
                colors: [
                    "#673AB7", // Purple
                    "#FFEB3B", // Yellow
                    "#FF4081", // Pink
                ],
            },
        ];

        setPresetPalettes(palettes);
    }, [primaryColor, accentColor]);

    const handleSaveChanges = () => {
        // Save the selected colors
        localStorage.setItem("primaryColor", primaryColor);
        localStorage.setItem("secondaryColor", secondaryColor);
        localStorage.setItem("accentColor", accentColor);

        // Navigate back to the dashboard or next step
        window.location.href = "/templates";
    };

    const handleSelectPalette = (palette: ColorPalette) => {
        setPrimaryColor(palette.colors[0]);
        setSecondaryColor(palette.colors[1]);
        if (palette.colors[2]) {
            setAccentColor(palette.colors[2]);
        }
        setSelectedPaletteName(palette.name);
    };

    const handleBackClick = () => {
        // Navigate back to the branding page
        window.location.href = "/branding";
    };

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
                <h1 className="text-2xl md:text-3xl font-bold mt-2">Choose Your Color Palette</h1>
                <p className="text-gray-500 mt-2 mb-6">
                    Select from our presets or create your own custom colors.
                </p>

                <Card className="bg-white shadow-md">
                    <CardContent className="pt-2 pb-2">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column: Preset Palettes */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Preset Color Palettes</h2>
                                <p className="text-sm text-gray-500 mb-4">Choose from our professionally designed color schemes</p>                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">                                    {presetPalettes.map((palette, index) => (
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
                                                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex justify-center space-x-2">
                                                {palette.colors.map((color, colorIndex) => (
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
                                    <p className="text-sm text-gray-500 mb-4">Customize your store's color scheme</p>

                                    <div className="space-y-4">
                                        <div className="p-3 border border-gray-200 rounded-lg">
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: primaryColor }}></div>
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
                                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                                    className="w-32 border-gray-300"
                                                />
                                                <Input
                                                    type="color"
                                                    value={primaryColor}
                                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                                    className="w-12 h-9 p-1 ml-2 cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        {/* Secondary Color */}
                                        <div className="p-3 border border-gray-200 rounded-lg">
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: secondaryColor }}></div>
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
                                                    onChange={(e) => setSecondaryColor(e.target.value)}
                                                    className="w-32 border-gray-300"
                                                />
                                                <Input
                                                    type="color"
                                                    value={secondaryColor}
                                                    onChange={(e) => setSecondaryColor(e.target.value)}
                                                    className="w-12 h-9 p-1 ml-2 cursor-pointer"
                                                />
                                            </div>
                                        </div>

                                        {/* Accent Color */}
                                        <div className="p-3 border border-gray-200 rounded-lg">
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: accentColor }}></div>
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
                                                    onChange={(e) => setAccentColor(e.target.value)}
                                                    className="w-32 border-gray-300"
                                                />
                                                <Input
                                                    type="color"
                                                    value={accentColor}
                                                    onChange={(e) => setAccentColor(e.target.value)}
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
                                            <h3 className="text-lg font-semibold" style={{ color: secondaryColor }}>
                                                Primary Color
                                            </h3>
                                            <p style={{ color: secondaryColor }}>
                                                This shows how your primary color will look with text.
                                            </p>
                                            <Button
                                                className="mt-3"
                                                style={{
                                                    backgroundColor: accentColor,
                                                    color: "white"
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
                                                <h3 className="text-lg font-semibold" style={{ color: primaryColor }}>
                                                    Secondary Color
                                                </h3>
                                                <p style={{ color: primaryColor }}>
                                                    Secondary color text preview.
                                                </p>
                                            </div>

                                            <div
                                                className="p-5"
                                                style={{ backgroundColor: accentColor }}
                                            >
                                                <h3 className="text-lg font-semibold text-white">
                                                    Accent Color
                                                </h3>
                                                <p className="text-white">
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
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Back
                    </Button>
                    <Button
                        onClick={handleSaveChanges}
                        className="bg-black text-white hover:bg-gray-800"
                    >
                        Save Changes
                    </Button>
                </div>
            </main>
        </div>
    );
}