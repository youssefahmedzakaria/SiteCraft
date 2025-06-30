/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Input } from "@/components/SiteCraft/ui/input";
import { Textarea } from "@/components/SiteCraft/ui/textarea";
import {
  ChevronDown,
  ChevronRight,
  ImageIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { useState, useRef, DragEvent } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/SiteCraft/ui/dropdown-menu";
import { Button } from "@/components/SiteCraft/ui/button";
import { ContactLayoutItems } from "./contactLayoutItems";
import { ContactCustomizationAttributes } from "@/lib/customization";

// design sections
type DesignSectionName = "background" | "title" | "content";

interface RenderContactSectionProps {
  detailedSectionTab: string;
  contactAttributes: ContactCustomizationAttributes;
  updateContactAttributes: (
    updates: Partial<ContactCustomizationAttributes>
  ) => void;
  onDeleteSection?: () => void;
}

export function RenderContactSection({
  detailedSectionTab,
  contactAttributes,
  updateContactAttributes,
  onDeleteSection,
}: RenderContactSectionProps) {
  {
    /* For image selection in content */
  }
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateContactAttributes({ imageUrl: reader.result as string });
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
        updateContactAttributes({ imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle layout selection and update template
  const handleLayoutSelection = (layoutId: number) => {
    const templateNames = [
      "RightAlignedContact",
      "LeftAlignedContact",
      "MinimalLeftContact",
      "MinimalRightContact",
      "CenteredContact",
    ];
    const templateName = templateNames[layoutId - 1] || "RightAlignedContact";
    updateContactAttributes({ template: templateName });
  };

  {
    /* design sections */
  }
  const [expandedDesignSections, setExpandedDesignSections] = useState<
    Record<DesignSectionName, boolean>
  >({
    background: false,
    title: false,
    content: false,
  });

  const toggleDesignSection = (section: DesignSectionName) => {
    setExpandedDesignSections((prev) => {
      const isCurrentlyOpen = prev[section];

      if (isCurrentlyOpen) {
        return {
          background: false,
          title: false,
          content: false,
        };
      }

      return {
        background: false,
        title: false,
        content: false,
        [section]: true,
      };
    });
  };

  return (
    <div className="flex flex-col h-full w-full min-h-0">
      {detailedSectionTab === "content" ? (
        <div className="flex flex-col flex-1 min-h-0 p-4">
          {/* Image or Map */}
          <div className="space-y-8 flex-1 min-h-0 overflow-y-auto">
            <div className="space-y-1">
              <h1 className="text-lg font-semibold tracking-tight">
                Image or Map
              </h1>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant={contactAttributes.showMap ? "default" : "outline"}
                    onClick={() =>
                      updateContactAttributes({
                        showMap: true,
                      })
                    }
                    className="flex-1"
                  >
                    Map View
                  </Button>
                  <Button
                    variant={!contactAttributes.showMap ? "default" : "outline"}
                    onClick={() =>
                      updateContactAttributes({
                        showMap: false,
                      })
                    }
                    className="flex-1"
                  >
                    Image View
                  </Button>
                </div>

                {contactAttributes.showMap ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <Input
                        id="address"
                        name="address"
                        value={contactAttributes.address}
                        onChange={(e) =>
                          updateContactAttributes({
                            address: e.target.value,
                          })
                        }
                        placeholder="Enter address"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Address Link
                      </label>
                      <Input
                        id="addressLink"
                        name="addressLink"
                        value={contactAttributes.addressUrl}
                        onChange={(e) =>
                          updateContactAttributes({
                            addressUrl: e.target.value,
                          })
                        }
                        placeholder="Enter Google Maps link"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Opening Hours
                      </label>
                      <Input
                        id="openHours"
                        name="openHours"
                        value={contactAttributes.openHours}
                        onChange={(e) =>
                          updateContactAttributes({
                            openHours: e.target.value,
                          })
                        }
                        placeholder="Enter opening hours"
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onDragOver={handleDragOverImage}
                    onDrop={handleDropImage}
                    onClick={handleBrowseClick}
                  >
                    {contactAttributes.imageUrl ? (
                      <div className="relative w-full h-48">
                        <Image
                          src={contactAttributes.imageUrl}
                          alt="Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Drag and drop an image here, or click to browse
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-8 flex justify-start">
            {onDeleteSection && (
              <button
                className="flex justify-start items-center w-full gap-2 px-4 py-2 text-[#FF0000] border-t border-t-[#FF0000] hover:bg-red-100 transition"
                onClick={onDeleteSection}
              >
                <Trash2 size={16} />
                Delete Section
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-6 flex-1 min-h-0 overflow-y-auto">
          {/* Layout */}
          <ContactLayoutItems
            selectedLayout={
              [
                "RightAlignedContact",
                "LeftAlignedContact",
                "MinimalLeftContact",
                "MinimalRightContact",
                "CenteredContact",
              ].indexOf(contactAttributes.template) + 1
            }
            onLayoutSelect={handleLayoutSelection}
          />

          {/* Background */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleDesignSection("background")}
            >
              <span className="font-medium">Background</span>
              {expandedDesignSections.background ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedDesignSections.background && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm mb-2">Background Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={contactAttributes.backgroundColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updateContactAttributes({
                        backgroundColor: `bg-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={contactAttributes.backgroundColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updateContactAttributes({
                        backgroundColor: `bg-[${e.target.value}]`,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleDesignSection("title")}
            >
              <span className="font-medium">Title</span>
              {expandedDesignSections.title ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedDesignSections.title && (
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
                          contactAttributes.titleFont === "font-inter"
                            ? "Inter"
                            : contactAttributes.titleFont === "font-roboto"
                            ? "Roboto"
                            : contactAttributes.titleFont === "font-open-sans"
                            ? "Open Sans"
                            : contactAttributes.titleFont === "font-poppins"
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
                        updateContactAttributes({ titleFont: "font-inter" })
                      }
                    >
                      Inter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ titleFont: "font-roboto" })
                      }
                    >
                      Roboto
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({
                          titleFont: "font-open-sans",
                        })
                      }
                    >
                      Open Sans
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ titleFont: "font-poppins" })
                      }
                    >
                      Poppins
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ titleFont: "font-lato" })
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
                    value={contactAttributes.titleColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updateContactAttributes({
                        titleColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={contactAttributes.titleColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updateContactAttributes({
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
                        {contactAttributes.titleSize === "text-sm"
                          ? "Small"
                          : contactAttributes.titleSize === "text-base"
                          ? "Medium"
                          : contactAttributes.titleSize === "text-lg"
                          ? "Large"
                          : contactAttributes.titleSize === "text-xl"
                          ? "XL"
                          : contactAttributes.titleSize === "text-2xl"
                          ? "2XL"
                          : contactAttributes.titleSize === "text-3xl"
                          ? "3XL"
                          : "4XL"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ titleSize: "text-sm" })
                      }
                    >
                      Small
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ titleSize: "text-base" })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ titleSize: "text-lg" })
                      }
                    >
                      Large
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ titleSize: "text-xl" })
                      }
                    >
                      XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ titleSize: "text-2xl" })
                      }
                    >
                      2XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ titleSize: "text-3xl" })
                      }
                    >
                      3XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ titleSize: "text-4xl" })
                      }
                    >
                      4XL
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleDesignSection("content")}
            >
              <span className="font-medium">Content</span>
              {expandedDesignSections.content ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedDesignSections.content && (
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
                          contactAttributes.contentFont === "font-inter"
                            ? "Inter"
                            : contactAttributes.contentFont === "font-roboto"
                            ? "Roboto"
                            : contactAttributes.contentFont === "font-open-sans"
                            ? "Open Sans"
                            : contactAttributes.contentFont === "font-poppins"
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
                        updateContactAttributes({ contentFont: "font-inter" })
                      }
                    >
                      Inter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ contentFont: "font-roboto" })
                      }
                    >
                      Roboto
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({
                          contentFont: "font-open-sans",
                        })
                      }
                    >
                      Open Sans
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ contentFont: "font-poppins" })
                      }
                    >
                      Poppins
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ contentFont: "font-lato" })
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
                    value={contactAttributes.contentColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updateContactAttributes({
                        contentColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={contactAttributes.contentColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updateContactAttributes({
                        contentColor: `text-[${e.target.value}]`,
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
                        {contactAttributes.contentSize === "text-sm"
                          ? "Small"
                          : contactAttributes.contentSize === "text-base"
                          ? "Medium"
                          : contactAttributes.contentSize === "text-lg"
                          ? "Large"
                          : contactAttributes.contentSize === "text-xl"
                          ? "XL"
                          : contactAttributes.contentSize === "text-2xl"
                          ? "2XL"
                          : contactAttributes.contentSize === "text-3xl"
                          ? "3XL"
                          : "4XL"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ contentSize: "text-sm" })
                      }
                    >
                      Small
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ contentSize: "text-base" })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ contentSize: "text-lg" })
                      }
                    >
                      Large
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ contentSize: "text-xl" })
                      }
                    >
                      XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ contentSize: "text-2xl" })
                      }
                    >
                      2XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ contentSize: "text-3xl" })
                      }
                    >
                      3XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateContactAttributes({ contentSize: "text-4xl" })
                      }
                    >
                      4XL
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
