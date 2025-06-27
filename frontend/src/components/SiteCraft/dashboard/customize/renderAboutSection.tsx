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

type DesignSectionName = "image" | "title" | "description" | "background";

interface AboutUsSettings {
  titleFont: string;
  titleColor: string;
  titleSize: string;
  descriptionFont: string;
  descriptionColor: string;
  descriptionSize: string;
  backgroundColor: string;
  imageObjectFit: "Cover" | "Fill" | "Contain";
}

interface RenderAboutSectionProps {
  detailedSectionTab: string;
}

export function RenderAboutSection({
  detailedSectionTab,
}: RenderAboutSectionProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<DesignSectionName, boolean>
  >({
    image: false,
    title: false,
    description: false,
    background: false,
  });

  const [aboutUsSettings, setPromoSettings] = useState<AboutUsSettings>({
    titleFont: "inter",
    titleColor: "#000000",
    titleSize: "16px",
    descriptionFont: "inter",
    descriptionColor: "#666666",
    descriptionSize: "14px",
    backgroundColor: "#ffffff",
    imageObjectFit: "Cover",
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
                  imagePreview ? "" : "bg-gray-100"
                }  overflow-hidden`}
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
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
                {imagePreview ? (
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
          {/* Title */}
          <div className="flex-1 space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <Input
              id="title"
              name="title"
              placeholder="About us title"
              className="w-full bg-background"
            />
          </div>
          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describle what this section is about"
              rows={4}
              className="w-full"
            />
          </div>
          {/* Secondary Description */}
          <div className="space-y-2">
            <label
              htmlFor="secondaryDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Secondary Description
            </label>
            <Textarea
              id="secondaryDescription"
              name="secondaryDescription"
              placeholder="Describle what this section is about"
              rows={4}
              className="w-full"
            />
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-6">
          <AboutLayoutItems />

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
                      className="w-full justify-between"
                    >
                      {aboutUsSettings.imageObjectFit}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["Cover", "Fill", "Contain"].map((fit) => (
                      <DropdownMenuItem
                        key={fit}
                        onSelect={() =>
                          setPromoSettings((s) => ({
                            ...s,
                            imageObjectFit: fit as any,
                          }))
                        }
                      >
                        {fit}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <label className="block text-sm mb-2">Background Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={aboutUsSettings.backgroundColor}
                    onChange={(e) =>
                      setPromoSettings((s) => ({
                        ...s,
                        backgroundColor: e.target.value,
                      }))
                    }
                    className="w-8 h-8 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={aboutUsSettings.backgroundColor}
                    onChange={(e) =>
                      setPromoSettings((s) => ({
                        ...s,
                        backgroundColor: e.target.value,
                      }))
                    }
                    className="flex-1 border-none bg-transparent focus:outline-none text-sm"
                  />
                </div>
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
              <div>
                <label className="block text-sm mb-2">Font Family</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {aboutUsSettings.titleFont}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["inter", "roboto", "open-sans", "poppins", "lato"].map(
                      (font) => (
                        <DropdownMenuItem
                          key={font}
                          onSelect={() =>
                            setPromoSettings((s) => ({ ...s, titleFont: font }))
                          }
                        >
                          {font}
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <label className="block text-sm mb-2">Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={aboutUsSettings.titleColor}
                    onChange={(e) =>
                      setPromoSettings((s) => ({
                        ...s,
                        titleColor: e.target.value,
                      }))
                    }
                    className="w-8 h-8 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={aboutUsSettings.titleColor}
                    onChange={(e) =>
                      setPromoSettings((s) => ({
                        ...s,
                        titleColor: e.target.value,
                      }))
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
                    value={parseInt(aboutUsSettings.titleSize) || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPromoSettings((s) => ({
                        ...s,
                        titleSize: value ? `${value}px` : "0px",
                      }));
                    }}
                    className="flex-1 border-none bg-transparent focus:outline-none text-sm"
                    placeholder="16"
                    min="0"
                  />
                  <span className="text-sm text-gray-500">px</span>
                </div>
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
              <div>
                <label className="block text-sm mb-2">Font Family</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {aboutUsSettings.descriptionFont}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["inter", "roboto", "open-sans", "poppins", "lato"].map(
                      (font) => (
                        <DropdownMenuItem
                          key={font}
                          onSelect={() =>
                            setPromoSettings((s) => ({
                              ...s,
                              descriptionFont: font,
                            }))
                          }
                        >
                          {font}
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <label className="block text-sm mb-2">Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={aboutUsSettings.descriptionColor}
                    onChange={(e) =>
                      setPromoSettings((s) => ({
                        ...s,
                        descriptionColor: e.target.value,
                      }))
                    }
                    className="w-8 h-8 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={aboutUsSettings.descriptionColor}
                    onChange={(e) =>
                      setPromoSettings((s) => ({
                        ...s,
                        descriptionColor: e.target.value,
                      }))
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
                    value={parseInt(aboutUsSettings.descriptionSize) || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPromoSettings((s) => ({
                        ...s,
                        descriptionSize: value ? `${value}px` : "0px",
                      }));
                    }}
                    className="flex-1 border-none bg-transparent focus:outline-none text-sm"
                    placeholder="14"
                    min="0"
                  />
                  <span className="text-sm text-gray-500">px</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
