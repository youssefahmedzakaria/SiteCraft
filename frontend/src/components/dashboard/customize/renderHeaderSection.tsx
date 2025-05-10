/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Image as ImageIcon,
} from "lucide-react";
import React, { useState, useRef, DragEvent } from "react";
import Image from "next/image";
import { HeaderLayoutItems } from "./headerLayoutItems";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type SectionName = "background" | "menuAndIcons";

interface RenderHeaderSectionProps {
  detailedSectionTab: string;
}
interface Section {
  id: string;
  title: string;
  selected: boolean;
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

  const handleDragOverImage = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropImage = (e: React.DragEvent) => {
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
    setExpandedSections((prev) => {
      const isCurrentlyOpen = prev[section];

      // If it's already open, close all
      if (isCurrentlyOpen) {
        return {
          background: false,
          menuAndIcons: false,
        };
      }

      // Otherwise, open the clicked section and close others
      return {
        background: false,
        menuAndIcons: false,
        [section]: true,
      };
    });
  };

  {
    /* For color selection in design */
  }
  const [colors, setColors] = useState({
    background: "#ffffff",
    menuAndIcons: "#000000",
  });

  {
    /* for dropdownds in design */
  }
  const [style, setStyle] = useState<
    "default" | "transparent" | "grayscale-transparent" | "solid-color"
  >("default");

  const handleStyleChange = (
    type: "default" | "transparent" | "grayscale-transparent" | "solid-color"
  ) => {
    setStyle(type);
  };

  const [fontFamily, setFontFamily] = useState<
    "inter" | "roboto" | "open-sans" | "poppins" | "lato"
  >("inter");

  const handleFontFamilyChange = (
    type: "inter" | "roboto" | "open-sans" | "poppins" | "lato"
  ) => {
    setFontFamily(type);
  };

  {
    /* for sections reorder and management */
  }
  const [sections, setSections] = useState<Section[]>([
    {
      id: "home",
      title: "Home",
      selected: true,
    },
    {
      id: "products",
      title: "Products",
      selected: true,
    },
    {
      id: "categories",
      title: "Categories",
      selected: true,
    },
    {
      id: "about",
      title: "About Us",
      selected: true,
    },
    {
      id: "contact",
      title: "Contact Us",
      selected: true,
    },
  ]);

  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(
    null
  );
  // Reference for section DOM elements
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Drag and drop handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedSectionIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    if (
      draggedSectionIndex !== null &&
      sectionRefs.current[sections[draggedSectionIndex].id]
    ) {
      const el = sectionRefs.current[sections[draggedSectionIndex].id];
      if (el) {
        el.classList.remove("opacity-50");
      }
    }
    setDraggedSectionIndex(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    return false;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();

    if (draggedSectionIndex === null) return;
    if (draggedSectionIndex === dropIndex) return;

    const newSections = [...sections]; // Create a new array
    const draggedSection = newSections[draggedSectionIndex];

    newSections.splice(draggedSectionIndex, 1);
    newSections.splice(dropIndex, 0, draggedSection);

    setSections(newSections); // Set the *new* array as state
    setDraggedSectionIndex(null);
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
              onDragOver={handleDragOverImage}
              onDrop={handleDropImage}
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
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  ref={(el) => {
                    sectionRefs.current[section.id] = el;
                  }}
                  className={`flex items-center gap-2 p-2 border border-gray-200 rounded ${
                    draggedSectionIndex === index ? "opacity-50" : ""
                  }`}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div
                    className="cursor-grab flex items-center text-gray-400 hover:text-gray-600"
                    title="Drag to reorder"
                  >
                    <GripVertical size={18} />
                  </div>
                  <input
                    type="text"
                    defaultValue={section.title}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      // Handle menu item text change here
                    }}
                  />
                </div>
              ))}
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
              className="flex-1 flex items-center justify-between text-left"
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

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="lg"
                        className="hover:bg-gray-100 border-gray-300 w-full flex items-center justify-between"
                      >
                        <span className="ml-2">
                          {style === "default"
                            ? "Default"
                            : style === "transparent"
                            ? "Transparent"
                            : style === "grayscale-transparent"
                            ? "Grayscale transparent"
                            : "Solid color"}
                        </span>
                        <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleStyleChange("default")}
                      >
                        Default
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStyleChange("transparent")}
                      >
                        Transparent
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleStyleChange("grayscale-transparent")
                        }
                      >
                        Grayscale transparent
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStyleChange("solid-color")}
                      >
                        Solid color
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Color picker for Grayscale transparent and Solid color options */}
                <div className="color-picker-container">
                  <label className="block text-sm mb-2">Color</label>
                  <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                    <input
                      type="color"
                      value={colors.background}
                      className="w-8 h-8 cursor-pointer bg-transparent"
                      onChange={(e) => {
                        setColors((prev) => ({
                          ...prev,
                          background: e.target.value,
                        }));
                      }}
                    />
                    <input
                      type="text"
                      value={colors.background}
                      className="flex-1 border-none bg-transparent focus:outline-none"
                      onChange={(e) => {
                        setColors((prev) => ({
                          ...prev,
                          background: e.target.value,
                        }));
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
              className="flex-1 flex items-center justify-between text-left"
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="lg"
                        className="hover:bg-gray-100 border-gray-300 w-full flex items-center justify-between"
                      >
                        <span className="ml-2">
                          {fontFamily === "inter"
                            ? "Inter"
                            : fontFamily === "roboto"
                            ? "Roboto"
                            : fontFamily === "open-sans"
                            ? "Open Sans"
                            : fontFamily === "poppins"
                            ? "Poppins"
                            : "Lato"}
                        </span>
                        <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleFontFamilyChange("inter")}
                      >
                        Inter
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleFontFamilyChange("roboto")}
                      >
                        Roboto
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleFontFamilyChange("open-sans")}
                      >
                        Open Sans
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleFontFamilyChange("poppins")}
                      >
                        Poppins
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleFontFamilyChange("lato")}
                      >
                        Lato
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="color-picker-container">
                  <label className="block text-sm mb-2">Color</label>
                  <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                    <input
                      type="color"
                      value={colors.menuAndIcons}
                      className="w-8 h-8 cursor-pointer bg-transparent"
                      onChange={(e) => {
                        setColors((prev) => ({
                          ...prev,
                          menuAndIcons: e.target.value,
                        }));
                      }}
                    />
                    <input
                      type="text"
                      value={colors.menuAndIcons}
                      className="flex-1 border-none bg-transparent focus:outline-none"
                      onChange={(e) => {
                        setColors((prev) => ({
                          ...prev,
                          menuAndIcons: e.target.value,
                        }));
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
