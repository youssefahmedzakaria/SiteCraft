/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/SiteCraft/ui/button";
import { Input } from "@/components/SiteCraft/ui/input";
import { Label } from "@/components/SiteCraft/ui/label";
import { Textarea } from "@/components/SiteCraft/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/SiteCraft/ui/select";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
} from "@hello-pangea/dnd";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { PoliciesLayoutItems } from "./policiesLayoutItems";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/SiteCraft/ui/dropdown-menu";
import { PoliciesCustomizationAttributes } from "@/lib/customization";

type DesignSectionName = "background" | "title" | "policySection";

interface Policy {
  id: string;
  title: string;
  content: string;
}

interface RenderPoliciesSectionProps {
  detailedSectionTab: string;
  policiesAttributes: PoliciesCustomizationAttributes;
  updatePoliciesAttributes: (
    updates: Partial<PoliciesCustomizationAttributes>
  ) => void;
  onDeleteSection?: () => void;
  policiesImage: File | undefined;
  setPoliciesImage: React.Dispatch<React.SetStateAction<File | undefined>>;
}

export function RenderPoliciesSection({
  detailedSectionTab,
  policiesAttributes,
  updatePoliciesAttributes,
  onDeleteSection,
  policiesImage,
  setPoliciesImage,
}: RenderPoliciesSectionProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<DesignSectionName, boolean>
  >({
    background: false,
    title: false,
    policySection: false,
  });

  const toggleSection = (section: DesignSectionName) => {
    setExpandedSections((prev) => {
      const isCurrentlyOpen = prev[section];

      if (isCurrentlyOpen) {
        return {
          background: false,
          title: false,
          policySection: false,
        };
      }

      return {
        background: false,
        title: false,
        policySection: false,
        [section]: true,
      };
    });
  };

  // Handle layout selection and update template
  const handleLayoutSelection = (layoutId: number) => {
    const templateNames = [
      "CenteredPolicies",
      "LeftPolicies",
      "TitleLeftContentCenterPolicies",
      "DefaultPolicies",
    ];
    const templateName =
      templateNames[layoutId - 1] || "TitleLeftContentCenterPolicies";
    updatePoliciesAttributes({ template: templateName });
  };

  const handleTitleChange = (newTitle: string) => {
    updatePoliciesAttributes({ title: newTitle });
  };

  return (
    <div className="flex flex-col h-full w-full min-h-0">
      {detailedSectionTab === "content" ? (
        <div className="flex flex-col flex-1 min-h-0 p-4">
          {/* Title */}
          <div className="space-y-8 flex-1 min-h-0 overflow-y-auto">
            <div className="space-y-1">
              <h1 className="text-lg font-semibold tracking-tight">Title</h1>
              <Input
                value={policiesAttributes.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter section title"
              />
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
          {/* Layout Selection */}
          <PoliciesLayoutItems
            selectedLayout={
              [
                "CenteredPolicies",
                "LeftPolicies",
                "TitleLeftContentCenterPolicies",
                "DefaultPolicies",
              ].indexOf(policiesAttributes.template) + 1
            }
            onLayoutSelect={handleLayoutSelection}
          />

          {/* Background */}
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
                <label className="block text-sm mb-2">Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={policiesAttributes.backgroundColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updatePoliciesAttributes({
                        backgroundColor: `bg-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={policiesAttributes.backgroundColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updatePoliciesAttributes({
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
                          policiesAttributes.titleFont === "font-inter"
                            ? "Inter"
                            : policiesAttributes.titleFont === "font-roboto"
                            ? "Roboto"
                            : policiesAttributes.titleFont === "font-open-sans"
                            ? "Open Sans"
                            : policiesAttributes.titleFont === "font-poppins"
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
                        updatePoliciesAttributes({ titleFont: "font-inter" })
                      }
                    >
                      Inter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({ titleFont: "font-roboto" })
                      }
                    >
                      Roboto
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          titleFont: "font-open-sans",
                        })
                      }
                    >
                      Open Sans
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({ titleFont: "font-poppins" })
                      }
                    >
                      Poppins
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({ titleFont: "font-lato" })
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
                    value={policiesAttributes.titleColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updatePoliciesAttributes({
                        titleColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={policiesAttributes.titleColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updatePoliciesAttributes({
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
                        {policiesAttributes.titleSize === "text-sm"
                          ? "Small"
                          : policiesAttributes.titleSize === "text-base"
                          ? "Medium"
                          : policiesAttributes.titleSize === "text-lg"
                          ? "Large"
                          : policiesAttributes.titleSize === "text-xl"
                          ? "XL"
                          : policiesAttributes.titleSize === "text-2xl"
                          ? "2XL"
                          : policiesAttributes.titleSize === "text-3xl"
                          ? "3XL"
                          : "4XL"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({ titleSize: "text-sm" })
                      }
                    >
                      Small
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({ titleSize: "text-base" })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({ titleSize: "text-lg" })
                      }
                    >
                      Large
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({ titleSize: "text-xl" })
                      }
                    >
                      XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({ titleSize: "text-2xl" })
                      }
                    >
                      2XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({ titleSize: "text-3xl" })
                      }
                    >
                      3XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({ titleSize: "text-4xl" })
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
                        {policiesAttributes.titleFontWeight === "font-normal"
                          ? "Normal"
                          : policiesAttributes.titleFontWeight === "font-medium"
                          ? "Medium"
                          : policiesAttributes.titleFontWeight ===
                            "font-semibold"
                          ? "Semibold"
                          : "Bold"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          titleFontWeight: "font-normal",
                        })
                      }
                    >
                      Normal
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          titleFontWeight: "font-medium",
                        })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          titleFontWeight: "font-semibold",
                        })
                      }
                    >
                      Semibold
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          titleFontWeight: "font-bold",
                        })
                      }
                    >
                      Bold
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          {/* Policy Sections */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleSection("policySection")}
            >
              <span className="font-medium">Policy Sections</span>
              {expandedSections.policySection ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedSections.policySection && (
            <div className="space-y-4">
              {/* Section Title */}
              <div className="space-y-2">
                <label className="block text-sm mb-2">Title Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={policiesAttributes.sectionTitleColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updatePoliciesAttributes({
                        sectionTitleColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={policiesAttributes.sectionTitleColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updatePoliciesAttributes({
                        sectionTitleColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                </div>
              </div>

              {/* Section Title Font Size */}
              <div>
                <label className="block text-sm mb-2">Title Font Size</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="hover:bg-gray-100 border-gray-300 w-full flex items-center justify-between"
                    >
                      <span className="ml-2">
                        {policiesAttributes.sectionTitleSize === "text-sm"
                          ? "Small"
                          : policiesAttributes.sectionTitleSize === "text-base"
                          ? "Medium"
                          : policiesAttributes.sectionTitleSize === "text-lg"
                          ? "Large"
                          : policiesAttributes.sectionTitleSize === "text-xl"
                          ? "XL"
                          : policiesAttributes.sectionTitleSize === "text-2xl"
                          ? "2XL"
                          : policiesAttributes.sectionTitleSize === "text-3xl"
                          ? "3XL"
                          : "4XL"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionTitleSize: "text-sm",
                        })
                      }
                    >
                      Small
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionTitleSize: "text-base",
                        })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionTitleSize: "text-lg",
                        })
                      }
                    >
                      Large
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionTitleSize: "text-xl",
                        })
                      }
                    >
                      XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionTitleSize: "text-2xl",
                        })
                      }
                    >
                      2XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionTitleSize: "text-3xl",
                        })
                      }
                    >
                      3XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionTitleSize: "text-4xl",
                        })
                      }
                    >
                      4XL
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Section Title Font Family */}
              <div>
                <label className="block text-sm mb-2">Title Font Family</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="hover:bg-gray-100 border-gray-300 w-full flex items-center justify-between"
                    >
                      <span className="ml-2">
                        {
                          policiesAttributes.sectionTitleFont === "font-inter"
                            ? "Inter"
                            : policiesAttributes.sectionTitleFont ===
                              "font-roboto"
                            ? "Roboto"
                            : policiesAttributes.sectionTitleFont ===
                              "font-open-sans"
                            ? "Open Sans"
                            : policiesAttributes.sectionTitleFont ===
                              "font-poppins"
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
                        updatePoliciesAttributes({
                          sectionTitleFont: "font-inter",
                        })
                      }
                    >
                      Inter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionTitleFont: "font-roboto",
                        })
                      }
                    >
                      Roboto
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionTitleFont: "font-open-sans",
                        })
                      }
                    >
                      Open Sans
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionTitleFont: "font-poppins",
                        })
                      }
                    >
                      Poppins
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionTitleFont: "font-lato",
                        })
                      }
                    >
                      Lato
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Section Title Font Weight */}
              <div>
                <label className="block text-sm mb-2">Title Font Weight</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="hover:bg-gray-100 border-gray-300 w-full flex items-center justify-between"
                    >
                      <span className="ml-2">
                        {policiesAttributes.sectionTitleFontWeight ===
                        "font-normal"
                          ? "Normal"
                          : policiesAttributes.sectionTitleFontWeight ===
                            "font-medium"
                          ? "Medium"
                          : policiesAttributes.sectionTitleFontWeight ===
                            "font-semibold"
                          ? "Semibold"
                          : "Bold"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionTitleFontWeight: "font-normal",
                        })
                      }
                    >
                      Normal
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionTitleFontWeight: "font-medium",
                        })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionTitleFontWeight: "font-semibold",
                        })
                      }
                    >
                      Semibold
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionTitleFontWeight: "font-bold",
                        })
                      }
                    >
                      Bold
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Section Content */}
              <div className="space-y-2">
                <label className="block text-sm mb-2">Content Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={policiesAttributes.sectionContentColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updatePoliciesAttributes({
                        sectionContentColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={policiesAttributes.sectionContentColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updatePoliciesAttributes({
                        sectionContentColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                </div>
              </div>

              {/* Section Content Font Size */}
              <div>
                <label className="block text-sm mb-2">Content Font Size</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="hover:bg-gray-100 border-gray-300 w-full flex items-center justify-between"
                    >
                      <span className="ml-2">
                        {policiesAttributes.sectionContentSize === "text-sm"
                          ? "Small"
                          : policiesAttributes.sectionContentSize ===
                            "text-base"
                          ? "Medium"
                          : policiesAttributes.sectionContentSize === "text-lg"
                          ? "Large"
                          : policiesAttributes.sectionContentSize === "text-xl"
                          ? "XL"
                          : policiesAttributes.sectionContentSize === "text-2xl"
                          ? "2XL"
                          : policiesAttributes.sectionContentSize === "text-3xl"
                          ? "3XL"
                          : "4XL"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionContentSize: "text-sm",
                        })
                      }
                    >
                      Small
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionContentSize: "text-base",
                        })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionContentSize: "text-lg",
                        })
                      }
                    >
                      Large
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionContentSize: "text-xl",
                        })
                      }
                    >
                      XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionContentSize: "text-2xl",
                        })
                      }
                    >
                      2XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionContentSize: "text-3xl",
                        })
                      }
                    >
                      3XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionContentSize: "text-4xl",
                        })
                      }
                    >
                      4XL
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Section Content Font Family */}
              <div>
                <label className="block text-sm mb-2">
                  Content Font Family
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="hover:bg-gray-100 border-gray-300 w-full flex items-center justify-between"
                    >
                      <span className="ml-2">
                        {
                          policiesAttributes.sectionContentFont === "font-inter"
                            ? "Inter"
                            : policiesAttributes.sectionContentFont ===
                              "font-roboto"
                            ? "Roboto"
                            : policiesAttributes.sectionContentFont ===
                              "font-open-sans"
                            ? "Open Sans"
                            : policiesAttributes.sectionContentFont ===
                              "font-poppins"
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
                        updatePoliciesAttributes({
                          sectionContentFont: "font-inter",
                        })
                      }
                    >
                      Inter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionContentFont: "font-roboto",
                        })
                      }
                    >
                      Roboto
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionContentFont: "font-open-sans",
                        })
                      }
                    >
                      Open Sans
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionContentFont: "font-poppins",
                        })
                      }
                    >
                      Poppins
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionContentFont: "font-lato",
                        })
                      }
                    >
                      Lato
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Section Content Font Weight */}
              <div>
                <label className="block text-sm mb-2">
                  Content Font Weight
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="hover:bg-gray-100 border-gray-300 w-full flex items-center justify-between"
                    >
                      <span className="ml-2">
                        {policiesAttributes.sectionContentFontWeight ===
                        "font-normal"
                          ? "Normal"
                          : policiesAttributes.sectionContentFontWeight ===
                            "font-medium"
                          ? "Medium"
                          : policiesAttributes.sectionContentFontWeight ===
                            "font-semibold"
                          ? "Semibold"
                          : "Bold"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionContentFontWeight: "font-normal",
                        })
                      }
                    >
                      Normal
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionContentFontWeight: "font-medium",
                        })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionContentFontWeight: "font-semibold",
                        })
                      }
                    >
                      Semibold
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePoliciesAttributes({
                          sectionContentFontWeight: "font-bold",
                        })
                      }
                    >
                      Bold
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
