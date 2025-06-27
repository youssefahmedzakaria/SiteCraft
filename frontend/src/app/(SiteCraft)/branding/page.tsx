"use client";

import { useState } from "react";
import { Button } from "@/components/SiteCraft/ui/button";
import { Input } from "@/components/SiteCraft/ui/input";
import { Card, CardContent } from "@/components/SiteCraft/ui/card";

export default function BrandingPage() {
  const [storeName, setStoreName] = useState("My Store");
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#ffffff");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [storeType, setStoreType] = useState("");

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSaveChanges = () => {
    console.log({
      storeName,
      primaryColor,
      secondaryColor,
      logoFile,
      storeType,
    });
    // Save colors to localStorage for the color-palette page
    localStorage.setItem("primaryColor", primaryColor);
    localStorage.setItem("secondaryColor", secondaryColor);
    // go to the color-palette page
    window.location.href = "/branding/color-palette";
  };
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
          Customize Your Branding
        </h1>
        <p className="text-gray-500 mt-2 mb-6">
          Personalize your store's appearance with your brand colors and
          information
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
                          {logoFile ? logoFile.name : "No file chosen"}
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
                      Store Name
                    </label>
                    <Input
                      id="storeName"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Your Store Name"
                      className="w-full"
                    />
                  </div>

                  {/* Store Type */}
                  <div>
                    <label
                      htmlFor="storeType"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Store Type
                    </label>
                    <div className="relative">
                      <select
                        id="storeType"
                        value={storeType}
                        onChange={(e) => setStoreType(e.target.value)}
                        className="block w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] appearance-none"
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
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-32"
                      />
                      <Input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
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
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-32"
                      />
                      <Input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
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
            className="bg-black text-white hover:bg-gray-800"
          >
            Save Changes
          </Button>
        </div>
      </main>
    </div>
  );
}
