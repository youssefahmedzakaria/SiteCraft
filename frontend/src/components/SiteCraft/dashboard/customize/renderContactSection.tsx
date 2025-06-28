/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Input } from "@/components/SiteCraft/ui/input";
import { Textarea } from "@/components/SiteCraft/ui/textarea";
import { ChevronDown, ChevronRight, ImageIcon, Plus } from "lucide-react";
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

// design sections
type DesignSectionName = "background" | "title" | "content";

interface ContactSettings {
  title?: string;
  address?: string;
  addressLink?: string;
  openHours?: string;
  phone?: string;
  email?: string;
  layout?: string;
  backgroundColor?: string;
  titleFont?: "inter" | "roboto" | "open-sans" | "poppins" | "lato";
  titleColor?: string;
  titleSize?: string;
  contentFont?: "inter" | "roboto" | "open-sans" | "poppins" | "lato";
  contentColor?: string;
  contentFontSize?: string;
  showMap?: boolean;
}

// social media link data
interface SocialMediaLinks {
  id: string;
  title?: string;
  link?: string;
}

interface RenderContactSectionProps {
  detailedSectionTab: string;
}

export function RenderContactSection({
  detailedSectionTab,
}: RenderContactSectionProps) {
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
    /* For About Links in content */
  }
  const [contentLinks, setContentLink] = useState<SocialMediaLinks[]>([
    {
      id: "1",
      title: "Facebook",
      link: undefined,
    },
    {
      id: "2",
      title: "Instagram",
      link: undefined,
    },
    {
      id: "3",
      title: "Twitter",
      link: undefined,
    },
  ]);

  // -----------------------------------------------------------------------------------------------------------------------------

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

  {
    /* For design settings */
  }
  const [contactSettings, setContactSettings] = useState<ContactSettings>({
    title: "Contact Us",
    address: undefined,
    addressLink: undefined,
    openHours: undefined,
    phone: undefined,
    email: undefined,
    layout: "1",
    backgroundColor: "#ffffff",
    titleFont: "inter",
    titleColor: "#000000",
    titleSize: "18px",
    contentFont: "inter",
    contentColor: "#000000",
    contentFontSize: "16px",
    showMap: true,
  });

  return (
    <div>
      {detailedSectionTab === "content" ? (
        <div className="p-4 space-y-5">
          {/* Image or Map */}
          <div className="space-y-3">
            <h1 className="text-lg font-semibold tracking-tight">
              Image or Map
            </h1>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  variant={contactSettings.showMap ? "default" : "outline"}
                  onClick={() =>
                    setContactSettings({ ...contactSettings, showMap: true })
                  }
                  className="flex-1"
                >
                  Map View
                </Button>
                <Button
                  variant={!contactSettings.showMap ? "default" : "outline"}
                  onClick={() =>
                    setContactSettings({ ...contactSettings, showMap: false })
                  }
                  className="flex-1"
                >
                  Image View
                </Button>
              </div>

              {contactSettings.showMap ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <Input
                      id="address"
                      name="address"
                      value={contactSettings.address}
                      onChange={(e) =>
                        setContactSettings({
                          ...contactSettings,
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
                      value={contactSettings.addressLink}
                      onChange={(e) =>
                        setContactSettings({
                          ...contactSettings,
                          addressLink: e.target.value,
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
                      value={contactSettings.openHours}
                      onChange={(e) =>
                        setContactSettings({
                          ...contactSettings,
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
                  {imagePreview ? (
                    <div className="relative w-full h-48">
                      <Image
                        src={imagePreview}
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
      ) : (
        <div className="p-4 space-y-6">
          {/* Layout */}
          <ContactLayoutItems />

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
                <label className="block text-sm mb-2">Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={contactSettings.backgroundColor}
                    onChange={(e) =>
                      setContactSettings({
                        ...contactSettings,
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-8 h-8 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={contactSettings.backgroundColor}
                    onChange={(e) =>
                      setContactSettings({
                        ...contactSettings,
                        backgroundColor: e.target.value,
                      })
                    }
                    className="flex-1 border-none bg-transparent focus:outline-none text-sm"
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
              <div className="space-y-2">
                <label className="block text-sm mb-2">Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={contactSettings.titleColor}
                    onChange={(e) =>
                      setContactSettings({
                        ...contactSettings,
                        titleColor: e.target.value,
                      })
                    }
                    className="w-8 h-8 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={contactSettings.titleColor}
                    onChange={(e) =>
                      setContactSettings({
                        ...contactSettings,
                        titleColor: e.target.value,
                      })
                    }
                    className="flex-1 border-none bg-transparent focus:outline-none text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm mb-2">Font Size (px)</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="number"
                    value={parseInt(contactSettings.titleSize!) || ""}
                    onChange={(e) =>
                      setContactSettings({
                        ...contactSettings,
                        titleSize: e.target.value
                          ? `${e.target.value}px`
                          : "0px",
                      })
                    }
                    className="flex-1 border-none bg-transparent focus:outline-none text-sm"
                    placeholder="16"
                    min="0"
                  />
                  <span className="text-sm text-gray-500">px</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm mb-2">Font Family</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {contactSettings.titleFont}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["inter", "roboto", "open-sans", "poppins", "lato"].map(
                      (font) => (
                        <DropdownMenuItem
                          key={font}
                          onSelect={() =>
                            setContactSettings({
                              ...contactSettings,
                              titleFont: font as ContactSettings["titleFont"],
                            })
                          }
                        >
                          {font}
                        </DropdownMenuItem>
                      )
                    )}
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
              <div className="space-y-2">
                <label className="block text-sm mb-2">Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={contactSettings.contentColor}
                    onChange={(e) =>
                      setContactSettings({
                        ...contactSettings,
                        contentColor: e.target.value,
                      })
                    }
                    className="w-8 h-8 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={contactSettings.contentColor}
                    onChange={(e) =>
                      setContactSettings({
                        ...contactSettings,
                        contentColor: e.target.value,
                      })
                    }
                    className="flex-1 border-none bg-transparent focus:outline-none text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm mb-2">Font Size (px)</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="number"
                    value={parseInt(contactSettings.contentFontSize!) || ""}
                    onChange={(e) =>
                      setContactSettings({
                        ...contactSettings,
                        contentFontSize: e.target.value
                          ? `${e.target.value}px`
                          : "0px",
                      })
                    }
                    className="flex-1 border-none bg-transparent focus:outline-none text-sm"
                    placeholder="16"
                    min="0"
                  />
                  <span className="text-sm text-gray-500">px</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm mb-2">Font Family</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {contactSettings.contentFont}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["inter", "roboto", "open-sans", "poppins", "lato"].map(
                      (font) => (
                        <DropdownMenuItem
                          key={font}
                          onSelect={() =>
                            setContactSettings({
                              ...contactSettings,
                              contentFont:
                                font as ContactSettings["contentFont"],
                            })
                          }
                        >
                          {font}
                        </DropdownMenuItem>
                      )
                    )}
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
