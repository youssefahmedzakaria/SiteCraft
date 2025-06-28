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

type DesignSectionName = "background" | "title" | "policySection";

interface Policy {
  id: string;
  title: string;
  content: string;
}

interface RenderPoliciesSectionProps {
  detailedSectionTab: string;
}

interface PoliciesSettings {
  layout?: string;
  backgroundColor?: string;
  titleColor?: string;
  titleSize?: string;
  titleFont?: "inter" | "roboto" | "open-sans" | "poppins" | "lato";
  titleFontWeight?: string;
  sectionTitleColor?: string;
  sectionTitleSize?: string;
  sectionTitleFont?: "inter" | "roboto" | "open-sans" | "poppins" | "lato";
  sectionTitleFontWeight?: string;
  sectionContentColor?: string;
  sectionContentFont?: "inter" | "roboto" | "open-sans" | "poppins" | "lato";
  sectionContentFontSize?: string;
  sectionContentFontWeight?: string;
}

export function RenderPoliciesSection({
  detailedSectionTab,
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

  // Content State
  const [title, setTitle] = useState("Policies");

  // Design State
  const [policiesSettings, setPoliciesSettings] = useState<PoliciesSettings>({
    layout: "1",
    backgroundColor: "#ffffff",
    titleColor: "#ffffff",
    titleSize: "18",
    titleFont: "inter",
    titleFontWeight: "normal",
    sectionTitleColor: "#ffffff",
    sectionTitleSize: "18",
    sectionTitleFont: "inter",
    sectionTitleFontWeight: "normal",
    sectionContentColor: "#ffffff",
    sectionContentFont: "inter",
    sectionContentFontSize: "18",
    sectionContentFontWeight: "normal",
  });

  const updateSettings = (field: keyof PoliciesSettings, value: string) => {
    setPoliciesSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div>
      {detailedSectionTab === "content" ? (
        <div className="p-4 space-y-6">
          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-lg font-semibold tracking-tight">Title</h1>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter section title"
            />
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-6">
          {/* Layout Selection */}
          <PoliciesLayoutItems />

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
                    value={policiesSettings.backgroundColor}
                    onChange={(e) =>
                      updateSettings("backgroundColor", e.target.value)
                    }
                    className="w-8 h-8 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={policiesSettings.backgroundColor}
                    onChange={(e) =>
                      updateSettings("backgroundColor", e.target.value)
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
              <div className="space-y-2">
                <label className="block text-sm mb-2">Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={policiesSettings.titleColor}
                    onChange={(e) =>
                      updateSettings("titleColor", e.target.value)
                    }
                    className="w-8 h-8 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={policiesSettings.titleColor}
                    onChange={(e) =>
                      updateSettings("titleColor", e.target.value)
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
                    value={parseInt(policiesSettings.titleSize!) || ""}
                    onChange={(e) =>
                      updateSettings(
                        "titleSize",
                        e.target.value ? `${e.target.value}px` : "0px"
                      )
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
                      {policiesSettings.titleFont}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["inter", "roboto", "open-sans", "poppins", "lato"].map(
                      (font) => (
                        <DropdownMenuItem
                          key={font}
                          onSelect={(e) => {
                            const value = font;
                            if (
                              value === "inter" ||
                              value === "roboto" ||
                              value === "open-sans" ||
                              value === "poppins" ||
                              value === "lato"
                            ) {
                              updateSettings("titleFont", value);
                            }
                          }}
                        >
                          {font}
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <label className="block text-sm mb-2">Font Weight</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {policiesSettings.titleFontWeight}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["normal", "medium", "semibold", "bold"].map((weight) => (
                      <DropdownMenuItem
                        key={weight}
                        onSelect={(e) => {
                          const value = weight;
                          if (
                            value === "normal" ||
                            value === "medium" ||
                            value === "semibold" ||
                            value === "bold"
                          ) {
                            updateSettings("titleFontWeight", value);
                          }
                        }}
                      >
                        {weight}
                      </DropdownMenuItem>
                    ))}
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
                    value={policiesSettings.sectionTitleColor}
                    onChange={(e) =>
                      updateSettings("sectionTitleColor", e.target.value)
                    }
                    className="w-8 h-8 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={policiesSettings.sectionTitleColor}
                    onChange={(e) =>
                      updateSettings("sectionTitleColor", e.target.value)
                    }
                    className="flex-1 border-none bg-transparent focus:outline-none text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm mb-2">
                  Title Font Size (px)
                </label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="number"
                    value={parseInt(policiesSettings.sectionTitleSize!) || ""}
                    onChange={(e) =>
                      updateSettings(
                        "sectionTitleSize",
                        e.target.value ? `${e.target.value}px` : "0px"
                      )
                    }
                    className="flex-1 border-none bg-transparent focus:outline-none text-sm"
                    placeholder="16"
                    min="0"
                  />
                  <span className="text-sm text-gray-500">px</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm mb-2">Title Font Family</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {policiesSettings.sectionTitleFont}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["inter", "roboto", "open-sans", "poppins", "lato"].map(
                      (font) => (
                        <DropdownMenuItem
                          key={font}
                          onSelect={(e) => {
                            const value = font;
                            if (
                              value === "inter" ||
                              value === "roboto" ||
                              value === "open-sans" ||
                              value === "poppins" ||
                              value === "lato"
                            ) {
                              updateSettings("sectionTitleFont", value);
                            }
                          }}
                        >
                          {font}
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <label className="block text-sm mb-2">Title Font Weight</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {policiesSettings.sectionTitleFontWeight}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["normal", "medium", "semibold", "bold"].map((weight) => (
                      <DropdownMenuItem
                        key={weight}
                        onSelect={(e) => {
                          const value = weight;
                          if (
                            value === "normal" ||
                            value === "medium" ||
                            value === "semibold" ||
                            value === "bold"
                          ) {
                            updateSettings("sectionTitleFontWeight", value);
                          }
                        }}
                      >
                        {weight}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Section Content */}
              <div className="space-y-2">
                <label className="block text-sm mb-2">Content Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={policiesSettings.sectionContentColor}
                    onChange={(e) =>
                      updateSettings("sectionContentColor", e.target.value)
                    }
                    className="w-8 h-8 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={policiesSettings.sectionContentColor}
                    onChange={(e) =>
                      updateSettings("sectionContentColor", e.target.value)
                    }
                    className="flex-1 border-none bg-transparent focus:outline-none text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm mb-2">
                  Content Font Size (px)
                </label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="number"
                    value={
                      parseInt(policiesSettings.sectionContentFontSize!) || ""
                    }
                    onChange={(e) =>
                      updateSettings(
                        "sectionContentFontSize",
                        e.target.value ? `${e.target.value}px` : "0px"
                      )
                    }
                    className="flex-1 border-none bg-transparent focus:outline-none text-sm"
                    placeholder="16"
                    min="0"
                  />
                  <span className="text-sm text-gray-500">px</span>
                </div>
              </div>

              {/* Font Settings */}
              <div className="space-y-2">
                <label className="block text-sm mb-2">
                  Content Font Family
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {policiesSettings.sectionContentFont}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["inter", "roboto", "open-sans", "poppins", "lato"].map(
                      (font) => (
                        <DropdownMenuItem
                          key={font}
                          onSelect={(e) => {
                            const value = font;
                            if (
                              value === "inter" ||
                              value === "roboto" ||
                              value === "open-sans" ||
                              value === "poppins" ||
                              value === "lato"
                            ) {
                              updateSettings("sectionContentFont", value);
                            }
                          }}
                        >
                          {font}
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <label className="block text-sm mb-2">
                  Content Font Weight
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {policiesSettings.sectionContentFontWeight}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["normal", "medium", "semibold", "bold"].map((font) => (
                      <DropdownMenuItem
                        key={font}
                        onSelect={(e) => {
                          const value = font;
                          if (
                            value === "normal" ||
                            value === "medium" ||
                            value === "semibold" ||
                            value === "bold"
                          ) {
                            updateSettings("sectionContentFontWeight", value);
                          }
                        }}
                      >
                        {font}
                      </DropdownMenuItem>
                    ))}
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
