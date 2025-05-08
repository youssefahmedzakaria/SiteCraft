"use client";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { HeaderLayoutItems } from "./headerLayoutItems";

type SectionName = "background" | "menuAndIcons";

interface RenderHeaderSectionProps {
  detailedSectionTab: string;
}

export function RenderHeaderSection({
  detailedSectionTab,
}: RenderHeaderSectionProps) {
  {
    /* For image selection in content */
  }
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  {
    /* For expandable sections in design */
  }
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
            <div
              className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div
                className={`relative w-16 h-16 rounded ${
                  imagePreview ? "" : "bg-gray-100"
                }  overflow-hidden`}
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Logo preview"
                    fill
                    className="object-contain rounded-md"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <ImageIcon />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 rounded">
                {imagePreview ? (
                  <p className="text-xs">
                    Drag and drop your image here to change logo, or{" "}
                    <span
                      className="cursor-pointer underline"
                      onClick={handleBrowseClick}
                    >
                      browse
                    </span>
                  </p>
                ) : (
                  <p className="text-xs">
                    Drag and drop your logo here, or{" "}
                    <span
                      className="cursor-pointer underline"
                      onClick={handleBrowseClick}
                    >
                      browse
                    </span>
                  </p>
                )}
              </div>
              <input
                ref={fileInputRef}
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
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
          <HeaderLayoutItems />

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
