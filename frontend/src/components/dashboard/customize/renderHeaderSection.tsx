"use client";
import { ChevronDown, ChevronRight, GripVertical, Upload } from "lucide-react";
import { useState } from "react";

type SectionName = "background" | "menuAndIcons";

interface RenderHeaderSectionProps {
  detailedSectionTab: string;
}

export function RenderHeaderSection({
  detailedSectionTab,
}: RenderHeaderSectionProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<SectionName, boolean>
  >({
    background: false,
    menuAndIcons: false,
  });

  const toggleSection = (section: SectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div>
      {detailedSectionTab === "content" ? (
        <div className="p-4 space-y-6">
          {/* Site Logo Section */}
          <div>
            <h3 className="font-medium mb-2">Site Logo</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 border border-dashed border-gray-300 rounded flex items-center justify-center">
                {/* Logo preview will go here */}
              </div>
              <label className="cursor-pointer">
                <div className="flex h-16 items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm">
                  <Upload size={16} />
                  <span>Choose Logo</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Handle logo upload here
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          // Set logo preview
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Navigation Menu Section */}
          <div>
            <h3 className="font-medium mb-2">Menu Items</h3>
            <div className="space-y-2">
              {["Home", "Products", "Categories", "About Us", "Contact Us"].map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 border border-gray-200 rounded"
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("text/plain", index.toString())
                    }
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const draggedIndex = parseInt(
                        e.dataTransfer.getData("text/plain")
                      );
                      // Handle menu item reordering here
                    }}
                  >
                    <GripVertical
                      size={16}
                      className="text-gray-400 cursor-grab"
                    />
                    <input
                      type="text"
                      defaultValue={item}
                      className="flex-1 border-none bg-transparent focus:outline-none"
                      onChange={(e) => {
                        // Handle menu item text change here
                      }}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-6">
          {/* Layout Section */}
          <div>
            <h3 className="font-medium mb-2">Layout</h3>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((layoutId) => (
                <button
                  key={layoutId}
                  className={`aspect-square p-2 rounded border border-gray-200 hover:border-blue-500 transition-colors ${
                    layoutId === 1 ? "bg-gray-900 border-blue-500" : "bg-white"
                  }`}
                  onClick={() => {
                    // Handle layout selection
                  }}
                >
                  {layoutId === 1 && (
                    <div className="w-full h-1.5 bg-gray-300 rounded mb-1" />
                  )}
                  {layoutId === 2 && (
                    <div className="w-full h-1.5 bg-gray-300 rounded mt-2" />
                  )}
                  {layoutId === 3 && (
                    <div className="flex justify-between">
                      <div className="w-1/3 h-1.5 bg-gray-300 rounded" />
                      <div className="w-1/3 h-1.5 bg-gray-300 rounded" />
                    </div>
                  )}
                  {layoutId === 4 && (
                    <div className="flex justify-between">
                      <div className="w-1/4 h-1.5 bg-gray-300 rounded" />
                      <div className="w-1/4 h-1.5 bg-gray-300 rounded" />
                      <div className="w-1/4 h-1.5 bg-gray-300 rounded" />
                    </div>
                  )}
                  {layoutId === 5 && (
                    <div className="w-full flex justify-center">
                      <div className="w-3/4 h-1.5 bg-gray-300 rounded" />
                    </div>
                  )}
                  {layoutId === 6 && (
                    <div className="flex items-center justify-between">
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    </div>
                  )}
                  {layoutId === 7 && (
                    <div className="flex items-center justify-between">
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    </div>
                  )}
                  {layoutId === 8 && (
                    <div className="w-full h-1.5 bg-gray-300 rounded" />
                  )}
                </button>
              ))}
            </div>
          </div>
          {/* Background Section */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left pr-4"
              onClick={() => toggleSection("background")}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">Background</span>
              </div>
              {expandedSections["background"] ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedSections["background"] && (
            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Style</label>
                  <select
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      // Handle background style change
                    }}
                  >
                    <option value="default">Default</option>
                    <option value="transparent">Transparent</option>
                    <option value="grayscale-transparent">
                      Grayscale transparent
                    </option>
                    <option value="solid-color">Solid color</option>
                  </select>
                </div>

                {/* Color picker for Grayscale transparent and Solid color options */}
                <div className="color-picker-container">
                  <label className="block text-sm mb-2">Color</label>
                  <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                    <input
                      type="color"
                      className="w-8 h-8 cursor-pointer bg-transparent"
                      onChange={(e) => {
                        // Handle menu color change
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Menu & Icons Section */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left pr-4"
              onClick={() => toggleSection("menuAndIcons")}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">Menu & Icons</span>
              </div>
              {expandedSections["menuAndIcons"] ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedSections["menuAndIcons"] && (
            <div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Font Family</label>
                  <select
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      // Handle font change
                    }}
                  >
                    <option value="inter">Inter</option>
                    <option value="roboto">Roboto</option>
                    <option value="open-sans">Open Sans</option>
                    <option value="poppins">Poppins</option>
                    <option value="lato">Lato</option>
                  </select>
                </div>

                <div className="color-picker-container">
                  <label className="block text-sm mb-2">Color</label>
                  <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                    <input
                      type="color"
                      className="w-8 h-8 cursor-pointer bg-transparent"
                      onChange={(e) => {
                        // Handle menu color change
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
