/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Input } from "@/components/SiteCraft/ui/input";
import { Textarea } from "@/components/SiteCraft/ui/textarea";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  ImageIcon,
  Plus,
} from "lucide-react";
import { useState, useRef, DragEvent } from "react";
import Image from "next/image";
import { AboutLayoutItems } from "./aboutLayoutItems";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/SiteCraft/ui/dropdown-menu";
import { Button } from "@/components/SiteCraft/ui/button";
import { AboutCustomizationAttributes } from "@/lib/customization";

type DesignSectionName = "image" | "title" | "description" | "background";

interface RenderAboutSectionProps {
  detailedSectionTab: string;
  aboutAttributes: AboutCustomizationAttributes;
  updateAboutAttributes: (
    updates: Partial<AboutCustomizationAttributes>
  ) => void;
}

export function RenderAboutSection({
  detailedSectionTab,
  aboutAttributes,
  updateAboutAttributes,
}: RenderAboutSectionProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<DesignSectionName, boolean>
  >({
    image: false,
    title: false,
    description: false,
    background: false,
  });

  const toggleSection = (section: DesignSectionName) => {
    setExpandedSections((prev) => {
      const isCurrentlyOpen = prev[section];

      if (isCurrentlyOpen) {
        return {
          image: false,
          title: false,
          description: false,
          background: false,
        };
      }

      return {
        image: false,
        title: false,
        description: false,
        background: false,
        [section]: true,
      };
    });
  };

  // Handle layout selection and update template
  const handleLayoutSelection = (layoutId: number) => {
    const templateNames = [
      "TopImageAbout",
      "CenteredAbout",
      "RightAlignedAbout",
      "LeftAlignedAbout",
    ];
    const templateName = templateNames[layoutId - 1] || "TopImageAbout";
    updateAboutAttributes({ template: templateName });
  };

  {
    /* For image selection in content */
  }
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAboutAttributes({ image: reader.result as string });
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
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAboutAttributes({ image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {detailedSectionTab === "content" ? (
        <div className="p-4 space-y-5">
          {/* About Us Image Section */}
          <div>
            <h3 className="font-medium mb-2">About Us Image</h3>
            <div
              className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
              onDragOver={handleDragOverImage}
              onDrop={handleDropImage}
            >
              <div
                className={`relative w-16 h-16 rounded ${
                  aboutAttributes.image ? "" : "bg-gray-100"
                }  overflow-hidden`}
              >
                {aboutAttributes.image ? (
                  <Image
                    src={aboutAttributes.image}
                    alt="Image preview"
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
                {aboutAttributes.image ? (
                  <p className="text-xs">
                    Drag and drop your image here to change image, or{" "}
                    <span
                      className="cursor-pointer underline"
                      onClick={handleBrowseClick}
                    >
                      browse
                    </span>
                  </p>
                ) : (
                  <p className="text-xs">
                    Drag and drop your image here, or{" "}
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
          {/* Image Alt */}
          <div className="flex-1 space-y-2">
            <label
              htmlFor="imageAlt"
              className="block text-sm font-medium text-gray-700"
            >
              Image Alt
            </label>
            <Input
              id="imageAlt"
              name="imageAlt"
              placeholder="About us image alt text"
              value={aboutAttributes.imageAlt || ""}
              className="w-full bg-background"
              onChange={(e) =>
                updateAboutAttributes({ imageAlt: e.target.value })
              }
            />
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-6">
          <AboutLayoutItems
            selectedLayout={
              [
                "TopImageAbout",
                "CenteredAbout",
                "RightAlignedAbout",
                "LeftAlignedAbout",
              ].indexOf(aboutAttributes.template) + 1
            }
            onLayoutSelect={handleLayoutSelection}
          />

          {/* Image Section */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleSection("image")}
            >
              <span className="font-medium">Image</span>
              {expandedSections.image ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedSections.image && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Object Fit</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="hover:bg-gray-100 border-gray-300 w-full flex items-center justify-between"
                    >
                      <span className="ml-2">
                        {aboutAttributes.imageObjectFit === "cover"
                          ? "Cover"
                          : aboutAttributes.imageObjectFit === "fill"
                          ? "Fill"
                          : "Contain"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ imageObjectFit: "cover" })
                      }
                    >
                      Cover
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ imageObjectFit: "fill" })
                      }
                    >
                      Fill
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ imageObjectFit: "contain" })
                      }
                    >
                      Contain
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          {/* Title Section */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleSection("title")}
            >
              <span className="font-medium">Title</span>
              {expandedSections.title ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedSections.title && (
            <div className="space-y-4">
              {/* font family */}
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
                        {
                          aboutAttributes.titleFont === "font-inter"
                            ? "Inter"
                            : aboutAttributes.titleFont === "font-roboto"
                            ? "Roboto"
                            : aboutAttributes.titleFont === "font-open-sans"
                            ? "Open Sans"
                            : aboutAttributes.titleFont === "font-poppins"
                            ? "Poppins"
                            : "Lato" // default
                        }
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ titleFont: "font-inter" })
                      }
                    >
                      Inter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ titleFont: "font-roboto" })
                      }
                    >
                      Roboto
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({
                          titleFont: "font-open-sans",
                        })
                      }
                    >
                      Open Sans
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ titleFont: "font-poppins" })
                      }
                    >
                      Poppins
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ titleFont: "font-lato" })
                      }
                    >
                      Lato
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* color */}
              <div className="space-y-2">
                <label className="block text-sm mb-2">Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={aboutAttributes.titleColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updateAboutAttributes({
                        titleColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={aboutAttributes.titleColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updateAboutAttributes({
                        titleColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                </div>
              </div>
              {/* font size */}
              <div>
                <label className="block text-sm mb-2">Font Size</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="hover:bg-gray-100 border-gray-300 w-full flex items-center justify-between"
                    >
                      <span className="ml-2">
                        {aboutAttributes.titleSize === "text-sm"
                          ? "Small"
                          : aboutAttributes.titleSize === "text-base"
                          ? "Medium"
                          : aboutAttributes.titleSize === "text-lg"
                          ? "Large"
                          : aboutAttributes.titleSize === "text-xl"
                          ? "XL"
                          : aboutAttributes.titleSize === "text-2xl"
                          ? "2XL"
                          : aboutAttributes.titleSize === "text-3xl"
                          ? "3XL"
                          : "4XL"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ titleSize: "text-sm" })
                      }
                    >
                      Small
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ titleSize: "text-base" })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ titleSize: "text-lg" })
                      }
                    >
                      Large
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ titleSize: "text-xl" })
                      }
                    >
                      XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ titleSize: "text-2xl" })
                      }
                    >
                      2XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ titleSize: "text-3xl" })
                      }
                    >
                      3XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ titleSize: "text-4xl" })
                      }
                    >
                      4XL
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* font weight */}
              <div>
                <label className="block text-sm mb-2">Font Weight</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="hover:bg-gray-100 border-gray-300 w-full flex items-center justify-between"
                    >
                      <span className="ml-2">
                        {aboutAttributes.titleFontWeight === "font-normal"
                          ? "Normal"
                          : aboutAttributes.titleFontWeight === "font-medium"
                          ? "Medium"
                          : aboutAttributes.titleFontWeight === "font-semibold"
                          ? "Semibold"
                          : "Bold"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({
                          titleFontWeight: "font-normal",
                        })
                      }
                    >
                      Normal
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({
                          titleFontWeight: "font-medium",
                        })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({
                          titleFontWeight: "font-semibold",
                        })
                      }
                    >
                      Semibold
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ titleFontWeight: "font-bold" })
                      }
                    >
                      Bold
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          {/* Description Section - Similar structure to Title */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleSection("description")}
            >
              <span className="font-medium">Description</span>
              {expandedSections.description ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedSections.description && (
            <div className="space-y-4">
              {/* font family */}
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
                        {
                          aboutAttributes.descriptionFont === "font-inter"
                            ? "Inter"
                            : aboutAttributes.descriptionFont === "font-roboto"
                            ? "Roboto"
                            : aboutAttributes.descriptionFont ===
                              "font-open-sans"
                            ? "Open Sans"
                            : aboutAttributes.descriptionFont === "font-poppins"
                            ? "Poppins"
                            : "Lato" // default
                        }
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ descriptionFont: "font-inter" })
                      }
                    >
                      Inter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({
                          descriptionFont: "font-roboto",
                        })
                      }
                    >
                      Roboto
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({
                          descriptionFont: "font-open-sans",
                        })
                      }
                    >
                      Open Sans
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({
                          descriptionFont: "font-poppins",
                        })
                      }
                    >
                      Poppins
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ descriptionFont: "font-lato" })
                      }
                    >
                      Lato
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* color */}
              <div className="space-y-2">
                <label className="block text-sm mb-2">Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={aboutAttributes.descriptionColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updateAboutAttributes({
                        descriptionColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={aboutAttributes.descriptionColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updateAboutAttributes({
                        descriptionColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                </div>
              </div>

              {/* font size */}
              <div>
                <label className="block text-sm mb-2">Font Size</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="hover:bg-gray-100 border-gray-300 w-full flex items-center justify-between"
                    >
                      <span className="ml-2">
                        {aboutAttributes.descriptionSize === "text-sm"
                          ? "Small"
                          : aboutAttributes.descriptionSize === "text-base"
                          ? "Medium"
                          : aboutAttributes.descriptionSize === "text-lg"
                          ? "Large"
                          : aboutAttributes.descriptionSize === "text-xl"
                          ? "XL"
                          : aboutAttributes.descriptionSize === "text-2xl"
                          ? "2XL"
                          : aboutAttributes.descriptionSize === "text-3xl"
                          ? "3XL"
                          : "4XL"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ descriptionSize: "text-sm" })
                      }
                    >
                      Small
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ descriptionSize: "text-base" })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ descriptionSize: "text-lg" })
                      }
                    >
                      Large
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ descriptionSize: "text-xl" })
                      }
                    >
                      XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ descriptionSize: "text-2xl" })
                      }
                    >
                      2XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ descriptionSize: "text-3xl" })
                      }
                    >
                      3XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateAboutAttributes({ descriptionSize: "text-4xl" })
                      }
                    >
                      4XL
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          {/* Background Section */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleSection("background")}
            >
              <span className="font-medium">Background</span>
              {expandedSections.background ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedSections.background && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm mb-2">Background Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={aboutAttributes.backgroundColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updateAboutAttributes({
                        backgroundColor: `bg-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={aboutAttributes.backgroundColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updateAboutAttributes({
                        backgroundColor: `bg-[${e.target.value}]`,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
