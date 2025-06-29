/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Image as ImageIcon,
  SearchIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import React, { useState, useRef, DragEvent, useEffect } from "react";
import Image from "next/image";
import { HeaderLayoutItems } from "./headerLayoutItems";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/SiteCraft/ui/dropdown-menu";
import { Button } from "@/components/SiteCraft/ui/button";
import {
  DropResult,
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import { HeaderCustomizationAttributes } from "@/lib/customization";

type SectionName = "logo" | "background" | "menuAndIcons";

interface RenderHeaderSectionProps {
  detailedSectionTab: string;
  headerAttributes: HeaderCustomizationAttributes;
  updateHeaderAttributes: (
    updates: Partial<HeaderCustomizationAttributes>
  ) => void;
}

interface Section {
  id: string;
  title: string;
  selected: boolean;
  visible: boolean;
}

export function RenderHeaderSection({
  detailedSectionTab,
  headerAttributes,
  updateHeaderAttributes,
}: RenderHeaderSectionProps) {
  {
    /* For image selection in content */
  }
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  {
    /* For expandable sections in design */
  }
  const [expandedSections, setExpandedSections] = useState<
    Record<SectionName, boolean>
  >({ logo: false, background: false, menuAndIcons: false });

  const toggleSection = (section: SectionName) => {
    setExpandedSections((prev) => {
      const isCurrentlyOpen = prev[section];

      // If it's already open, close all
      if (isCurrentlyOpen) {
        return {
          logo: false,
          background: false,
          menuAndIcons: false,
        };
      }

      // Otherwise, open the clicked section and close others
      return {
        logo: false,
        background: false,
        menuAndIcons: false,
        [section]: true,
      };
    });
  };

  {
    /* for sections reorder and management */
  }
  const [sections, setSections] = useState<Section[]>([]);

  // Initialize sections from headerAttributes only once
  useEffect(() => {
    const menuSections =
      headerAttributes.menuItems?.map((item, index) => ({
        id: item.label.toLowerCase().replace(/\s+/g, "-"),
        title: item.label,
        selected: true,
        visible: item.isShown,
      })) || [];
    setSections(menuSections);
  }, []); // Empty dependency array to run only once

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);

    // Update header attributes with reordered menu items
    const updatedMenuItems = items.map((section) => ({
      label: section.title,
      isShown: section.visible,
    }));
    updateHeaderAttributes({ menuItems: updatedMenuItems });
  };

  const updateSection = (
    id: string,
    field: keyof Section,
    value: string | boolean
  ) => {
    const updatedSections = sections.map((section) =>
      section.id === id ? { ...section, [field]: value } : section
    );
    setSections(updatedSections);

    // Update header attributes when section changes
    const updatedMenuItems = updatedSections.map((section) => ({
      label: section.title,
      isShown: section.visible,
    }));
    updateHeaderAttributes({ menuItems: updatedMenuItems });
  };

  const toggleSectionVisibility = (id: string) => {
    updateSection(id, "visible", !sections.find((s) => s.id === id)?.visible);
  };

  // Handle layout selection and update template
  const handleLayoutSelection = (layoutId: number) => {
    const templateName = `template${layoutId}` as
      | "template1"
      | "template2"
      | "template3"
      | "template4"
      | "template5"
      | "template6"
      | "template7"
      | "template8";
    updateHeaderAttributes({ template: templateName });
  };

  return (
    <div>
      {detailedSectionTab === "content" ? (
        <div className="p-4 space-y-6">
          {/* Navigation Menu Section */}
          <div>
            <h3 className="font-medium mb-4">Menu Items</h3>
            <div className="space-y-2">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {sections.map((section, index) => (
                        <Draggable
                          key={section.id}
                          draggableId={section.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center p-2 border border-gray-200 rounded relative ${
                                !section.visible ? "opacity-50 bg-gray-50" : ""
                              } ${snapshot.isDragging ? "shadow-lg" : ""}`}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab flex items-center text-gray-400 hover:text-gray-600"
                                title="Drag to reorder"
                              >
                                <GripVertical size={18} />
                              </div>
                              <div className="flex-1 relative pl-2">
                                <input
                                  type="text"
                                  value={section.title}
                                  className="w-full border-none bg-transparent focus:outline-none pr-8"
                                  onChange={(e) =>
                                    updateSection(
                                      section.id,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                />
                                <button
                                  onClick={() =>
                                    toggleSectionVisibility(section.id)
                                  }
                                  className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                                  title={
                                    section.visible ? "Hide item" : "Show item"
                                  }
                                >
                                  {section.visible ? (
                                    <Eye size={16} className="text-gray-600" />
                                  ) : (
                                    <EyeOff
                                      size={16}
                                      className="text-gray-400"
                                    />
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-6">
          {/* Layout Section */}
          <HeaderLayoutItems
            selectedLayout={
              parseInt(headerAttributes.template.replace("template", "")) || 1
            }
            onLayoutSelect={handleLayoutSelection}
          />

          {/* Logo Section */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleSection("logo")}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">Logo</span>
              </div>
              {expandedSections["logo"] ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedSections["logo"] && (
            <div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm mb-2">Logo Size</label>
                  <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                    <input
                      type="number"
                      value={headerAttributes.logo.width || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Update header attributes
                        updateHeaderAttributes({
                          logo: {
                            ...headerAttributes.logo,
                            width: parseInt(value) || 50,
                            height: parseInt(value) || 50,
                          },
                        });
                      }}
                      className="flex-1 h-7 border-none bg-transparent focus:outline-none text-sm"
                      placeholder="16"
                      min="0"
                    />
                    <span className="text-sm text-gray-500">px</span>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                {/* <div>
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
                </div> */}

                {/* Color picker for Grayscale transparent and Solid color options */}
                <div className="color-picker-container">
                  <label className="block text-sm mb-2">Color</label>
                  <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                    <input
                      type="color"
                      value={headerAttributes.backgroundColor
                        .split("-[")[1]
                        .slice(0, -1)}
                      className="w-8 h-8 cursor-pointer bg-transparent"
                      onChange={(e) => {
                        // Update header attributes
                        updateHeaderAttributes({
                          backgroundColor: `bg-[${e.target.value}]`,
                        });
                      }}
                    />
                    <input
                      type="text"
                      value={headerAttributes.backgroundColor
                        .split("-[")[1]
                        .slice(0, -1)}
                      className="flex-1 border-none bg-transparent focus:outline-none"
                      onChange={(e) => {
                        // Update header attributes
                        updateHeaderAttributes({
                          backgroundColor: `bg-[${e.target.value}]`,
                        });
                      }}
                    />
                  </div>
                </div>

                {/* Color picker for Grayscale transparent and Solid color options */}
                <div className="color-picker-container">
                  <label className="block text-sm mb-2">Divider Color</label>
                  <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                    <input
                      type="color"
                      value={headerAttributes.dividerColor
                        .split("-[")[1]
                        .slice(0, -1)}
                      className="w-8 h-8 cursor-pointer bg-transparent"
                      onChange={(e) => {
                        // Update header attributes
                        updateHeaderAttributes({
                          dividerColor: `border-[${e.target.value}]`,
                        });
                      }}
                    />
                    <input
                      type="text"
                      value={headerAttributes.dividerColor
                        .split("-[")[1]
                        .slice(0, -1)}
                      className="flex-1 border-none bg-transparent focus:outline-none"
                      onChange={(e) => {
                        // Update header attributes
                        updateHeaderAttributes({
                          dividerColor: `border-[${e.target.value}]`,
                        });
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
                          {
                            headerAttributes.fontFamily === "font-inter"
                              ? "Inter"
                              : headerAttributes.fontFamily === "font-roboto"
                              ? "Roboto"
                              : headerAttributes.fontFamily === "font-open-sans"
                              ? "Open Sans"
                              : headerAttributes.fontFamily === "font-poppins"
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
                          updateHeaderAttributes({ fontFamily: "font-inter" })
                        }
                      >
                        Inter
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateHeaderAttributes({ fontFamily: "font-roboto" })
                        }
                      >
                        Roboto
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateHeaderAttributes({
                            fontFamily: "font-open-sans",
                          })
                        }
                      >
                        Open Sans
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateHeaderAttributes({ fontFamily: "font-poppins" })
                        }
                      >
                        Poppins
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateHeaderAttributes({ fontFamily: "font-lato" })
                        }
                      >
                        Lato
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="color-picker-container">
                  <label className="block text-sm mb-2">Menu Items Color</label>
                  <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                    <input
                      type="color"
                      value={headerAttributes.textColor
                        .split("-[")[1]
                        .slice(0, -1)}
                      className="w-8 h-8 cursor-pointer bg-transparent"
                      onChange={(e) => {
                        // Update header attributes
                        updateHeaderAttributes({
                          textColor: `text-[${e.target.value}]`,
                        });
                      }}
                    />
                    <input
                      type="text"
                      value={headerAttributes.textColor
                        .split("-[")[1]
                        .slice(0, -1)}
                      className="flex-1 border-none bg-transparent focus:outline-none"
                      onChange={(e) => {
                        // Update header attributes
                        updateHeaderAttributes({
                          textColor: `text-[${e.target.value}]`,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="color-picker-container">
                  <label className="block text-sm mb-2">Icon Color</label>
                  <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                    <input
                      type="color"
                      value={headerAttributes.iconColor
                        .split("-[")[1]
                        .slice(0, -1)}
                      className="w-8 h-8 cursor-pointer bg-transparent"
                      onChange={(e) => {
                        // Update header attributes
                        updateHeaderAttributes({
                          iconColor: `text-[${e.target.value}]`,
                        });
                      }}
                    />
                    <input
                      type="text"
                      value={headerAttributes.iconColor
                        .split("-[")[1]
                        .slice(0, -1)}
                      className="flex-1 border-none bg-transparent focus:outline-none"
                      onChange={(e) => {
                        // Update header attributes
                        updateHeaderAttributes({
                          iconColor: `text-[${e.target.value}]`,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="color-picker-container">
                  <label className="block text-sm mb-2">
                    Search Icon Color
                  </label>
                  <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                    <input
                      type="color"
                      value={headerAttributes.searchIconColor
                        .split("-[")[1]
                        .slice(0, -1)}
                      className="w-8 h-8 cursor-pointer bg-transparent"
                      onChange={(e) => {
                        // Update header attributes
                        updateHeaderAttributes({
                          searchIconColor: `text-[${e.target.value}]`,
                        });
                      }}
                    />
                    <input
                      type="text"
                      value={headerAttributes.searchIconColor
                        .split("-[")[1]
                        .slice(0, -1)}
                      className="flex-1 border-none bg-transparent focus:outline-none"
                      onChange={(e) => {
                        // Update header attributes
                        updateHeaderAttributes({
                          searchIconColor: `text-[${e.target.value}]`,
                        });
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
