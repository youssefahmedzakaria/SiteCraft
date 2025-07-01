/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Input } from "@/components/SiteCraft/ui/input";
import { Textarea } from "@/components/SiteCraft/ui/textarea";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  GripVertical,
  ImageIcon,
  Plus,
} from "lucide-react";
import { useState, useRef, DragEvent, useEffect } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/SiteCraft/ui/dropdown-menu";
import { Button } from "@/components/SiteCraft/ui/button";
import { FooterCustomizationAttributes } from "@/lib/customization";
import { form } from "@heroui/theme";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";

// design sections
type DesignSectionName =
  | "general"
  | "branding"
  | "copyright"
  | "socialMedia"
  | "aboutLinks";

// about link data
interface AboutLink {
  id: string;
  title: string;
  selected: boolean;
  visible: boolean;
}

interface RenderFooterSectionProps {
  detailedSectionTab: string;
  footerAttributes: FooterCustomizationAttributes;
  updateFooterAttributes: (
    updates: Partial<FooterCustomizationAttributes>
  ) => void;
}

export function RenderFooterSection({
  detailedSectionTab,
  footerAttributes,
  updateFooterAttributes,
}: RenderFooterSectionProps) {
  const [copyrightFontWeight, setCopyrightFontWeight] =
    useState<string>("normal");
  {
    /* content sections */
  }

  // -----------------------------------------------------------------------------------------------------------------------------

  {
    /* design sections */
  }
  const [expandedDesignSections, setExpandedDesignSections] = useState<
    Record<DesignSectionName, boolean>
  >({
    general: false,
    branding: false,
    copyright: false,
    socialMedia: false,
    aboutLinks: false,
  });

  const toggleDesignSection = (section: DesignSectionName) => {
    setExpandedDesignSections((prev) => {
      const isCurrentlyOpen = prev[section];

      if (isCurrentlyOpen) {
        return {
          general: false,
          branding: false,
          copyright: false,
          socialMedia: false,
          aboutLinks: false,
        };
      }

      return {
        general: false,
        branding: false,
        copyright: false,
        socialMedia: false,
        aboutLinks: false,
        [section]: true,
      };
    });
  };

  // -----------------------------------------------------------------------------------------------------------------------------

  const [sections, setSections] = useState<AboutLink[]>([]);

  // Initialize sections from headerAttributes only once
    useEffect(() => {
      const menuSections =
        footerAttributes.aboutLinks?.map((item, index) => ({
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
    const updatedMenuItems = items.map((section, idx) => ({
      label: section.title,
      href: footerAttributes.aboutLinks[idx]?.href || "#",
      font: footerAttributes.aboutLinks[idx]?.font || "font-inter",
      fontSize: footerAttributes.aboutLinks[idx]?.fontSize || "text-base",
      fontColor:
        footerAttributes.aboutLinks[idx]?.fontColor || "text-[#000000]",
      isShown: section.visible,
    }));
    updateFooterAttributes({ aboutLinks: updatedMenuItems });
  };

  const updateSection = (
    id: string,
    field: keyof AboutLink,
    value: string | boolean
  ) => {
    const updatedSections = sections.map((section) =>
      section.id === id ? { ...section, [field]: value } : section
    );
    setSections(updatedSections);

    // Update header attributes when section changes
    const updatedMenuItems = updatedSections.map((section, idx) => ({
      label: section.title,
      href: footerAttributes.aboutLinks[idx]?.href || "#",
      font: footerAttributes.aboutLinks[idx]?.font || "font-inter",
      fontSize: footerAttributes.aboutLinks[idx]?.fontSize || "text-base",
      fontColor:
        footerAttributes.aboutLinks[idx]?.fontColor || "text-[#000000]",
      isShown: section.visible,
    }));
    console.log("updated footer",updatedMenuItems);
    updateFooterAttributes({ aboutLinks: updatedMenuItems });
  };

  const toggleSectionVisibility = (id: string) => {
    updateSection(id, "visible", !sections.find((s) => s.id === id)?.visible);
  };

  return (
    <div>
      {detailedSectionTab === "content" ? (
        <div className="p-4 space-y-5">
          {/* About Links Section */}
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
                                  <EyeOff size={16} className="text-gray-400" />
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
          {/* )} */}
        </div>
      ) : (
        <div className="p-4 space-y-6">
          {/* General */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleDesignSection("general")}
            >
              <span className="font-medium">General</span>
              {expandedDesignSections.general ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedDesignSections.general && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm mb-2">Background Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={footerAttributes.backgroundColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updateFooterAttributes({
                        backgroundColor: `bg-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={footerAttributes.backgroundColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updateFooterAttributes({
                        backgroundColor: `bg-[${e.target.value}]`,
                      });
                    }}
                  />
                </div>
              </div>
              {/* <div className="space-y-2">
                <label className="block text-sm mb-2">Text Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={footerAttributes.textColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updateFooterAttributes({
                        textColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={footerAttributes.textColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updateFooterAttributes({
                        textColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                </div>
              </div> */}
            </div>
          )}

          {/* Branding */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleDesignSection("branding")}
            >
              <span className="font-medium">Branding</span>
              {expandedDesignSections.branding ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedDesignSections.branding && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm mb-2">Logo Size</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="number"
                    value={footerAttributes.logo.size || 50}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateFooterAttributes({
                        logo: { ...footerAttributes.logo, size: value || "50" },
                      });
                    }}
                    className="flex-1 h-7 border-none bg-transparent focus:outline-none text-sm"
                    placeholder="50"
                    min="0"
                  />
                  <span className="text-sm text-gray-500">px</span>
                </div>
              </div>
            </div>
          )}

          {/* Copyright */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleDesignSection("copyright")}
            >
              <span className="font-medium">Copyright</span>
              {expandedDesignSections.copyright ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedDesignSections.copyright && (
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
                        {footerAttributes.copyrightStyles?.font === "font-inter"
                          ? "Inter"
                          : footerAttributes.copyrightStyles?.font ===
                            "font-roboto"
                          ? "Roboto"
                          : footerAttributes.copyrightStyles?.font ===
                            "font-open-sans"
                          ? "Open Sans"
                          : footerAttributes.copyrightStyles?.font ===
                            "font-poppins"
                          ? "Poppins"
                          : "Lato"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updateFooterAttributes({
                          copyrightStyles: {
                            ...footerAttributes.copyrightStyles,
                            font: "font-inter",
                          },
                        })
                      }
                    >
                      Inter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateFooterAttributes({
                          copyrightStyles: {
                            ...footerAttributes.copyrightStyles,
                            font: "font-roboto",
                          },
                        })
                      }
                    >
                      Roboto
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateFooterAttributes({
                          copyrightStyles: {
                            ...footerAttributes.copyrightStyles,
                            font: "font-open-sans",
                          },
                        })
                      }
                    >
                      Open Sans
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateFooterAttributes({
                          copyrightStyles: {
                            ...footerAttributes.copyrightStyles,
                            font: "font-poppins",
                          },
                        })
                      }
                    >
                      Poppins
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateFooterAttributes({
                          copyrightStyles: {
                            ...footerAttributes.copyrightStyles,
                            font: "font-lato",
                          },
                        })
                      }
                    >
                      Lato
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                        {footerAttributes.copyrightStyles?.fontSize ===
                        "text-sm"
                          ? "Small"
                          : footerAttributes.copyrightStyles?.fontSize ===
                            "text-base"
                          ? "Medium"
                          : footerAttributes.copyrightStyles?.fontSize ===
                            "text-lg"
                          ? "Large"
                          : footerAttributes.copyrightStyles?.fontSize ===
                            "text-xl"
                          ? "XL"
                          : footerAttributes.copyrightStyles?.fontSize ===
                            "text-2xl"
                          ? "2XL"
                          : footerAttributes.copyrightStyles?.fontSize ===
                            "text-3xl"
                          ? "3XL"
                          : "4XL"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updateFooterAttributes({
                          copyrightStyles: {
                            ...footerAttributes.copyrightStyles,
                            fontSize: "text-sm",
                          },
                        })
                      }
                    >
                      Small
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateFooterAttributes({
                          copyrightStyles: {
                            ...footerAttributes.copyrightStyles,
                            fontSize: "text-base",
                          },
                        })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateFooterAttributes({
                          copyrightStyles: {
                            ...footerAttributes.copyrightStyles,
                            fontSize: "text-lg",
                          },
                        })
                      }
                    >
                      Large
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateFooterAttributes({
                          copyrightStyles: {
                            ...footerAttributes.copyrightStyles,
                            fontSize: "text-xl",
                          },
                        })
                      }
                    >
                      XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateFooterAttributes({
                          copyrightStyles: {
                            ...footerAttributes.copyrightStyles,
                            fontSize: "text-2xl",
                          },
                        })
                      }
                    >
                      2XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateFooterAttributes({
                          copyrightStyles: {
                            ...footerAttributes.copyrightStyles,
                            fontSize: "text-3xl",
                          },
                        })
                      }
                    >
                      3XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateFooterAttributes({
                          copyrightStyles: {
                            ...footerAttributes.copyrightStyles,
                            fontSize: "text-4xl",
                          },
                        })
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
                        {footerAttributes.copyrightStyles?.fontWeight ===
                        "font-normal"
                          ? "Normal"
                          : footerAttributes.copyrightStyles?.fontWeight ===
                            "font-medium"
                          ? "Medium"
                          : footerAttributes.copyrightStyles?.fontWeight ===
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
                        updateFooterAttributes({
                          copyrightStyles: {
                            ...footerAttributes.copyrightStyles,
                            fontWeight: "font-normal",
                          },
                        })
                      }
                    >
                      Normal
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateFooterAttributes({
                          copyrightStyles: {
                            ...footerAttributes.copyrightStyles,
                            fontWeight: "font-medium",
                          },
                        })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateFooterAttributes({
                          copyrightStyles: {
                            ...footerAttributes.copyrightStyles,
                            fontWeight: "font-semibold",
                          },
                        })
                      }
                    >
                      Semibold
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateFooterAttributes({
                          copyrightStyles: {
                            ...footerAttributes.copyrightStyles,
                            fontWeight: "font-bold",
                          },
                        })
                      }
                    >
                      Bold
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* font color */}
              <div className="space-y-2">
                <label className="block text-sm mb-2">Text Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={footerAttributes.copyrightStyles?.fontColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updateFooterAttributes({
                        copyrightStyles: {
                          ...footerAttributes.copyrightStyles,
                          fontColor: `text-[${e.target.value}]`,
                        },
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={footerAttributes.copyrightStyles?.fontColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updateFooterAttributes({
                        copyrightStyles: {
                          ...footerAttributes.copyrightStyles,
                          fontColor: `text-[${e.target.value}]`,
                        },
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Media */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleDesignSection("socialMedia")}
            >
              <span className="font-medium">Social Media</span>
              {expandedDesignSections.socialMedia ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedDesignSections.socialMedia && (
            <div className="space-y-4">
              {/* icon size */}
              <div className="space-y-2">
                <label className="block text-sm mb-2">Icons Size</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="number"
                    value={footerAttributes.socialMediaStyles?.iconSize || 20}
                    onChange={(e) => {
                      const value = e.target.value;
                      updateFooterAttributes({
                        socialMediaStyles: {
                          ...footerAttributes.socialMediaStyles,
                          iconSize: parseInt(value) || 20,
                        },
                      });
                    }}
                    className="flex-1 h-7 border-none bg-transparent focus:outline-none text-sm"
                    placeholder="20"
                    min="0"
                  />
                  <span className="text-sm text-gray-500">px</span>
                </div>
              </div>

              {/* icon color */}
              <div className="space-y-2">
                <label className="block text-sm mb-2">Icons Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={footerAttributes.socialMediaStyles?.iconColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updateFooterAttributes({
                        socialMediaStyles: {
                          ...footerAttributes.socialMediaStyles,
                          iconColor: `text-[${e.target.value}]`,
                        },
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={footerAttributes.socialMediaStyles?.iconColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updateFooterAttributes({
                        socialMediaStyles: {
                          ...footerAttributes.socialMediaStyles,
                          iconColor: `text-[${e.target.value}]`,
                        },
                      });
                    }}
                  />
                </div>
              </div>

              {/* icon hover color */}
              <div className="space-y-2">
                <label className="block text-sm mb-2">Icons Hover Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={footerAttributes.socialMediaStyles?.hoverColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updateFooterAttributes({
                        socialMediaStyles: {
                          ...footerAttributes.socialMediaStyles,
                          hoverColor: `text-[${e.target.value}]`,
                        },
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={footerAttributes.socialMediaStyles?.hoverColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updateFooterAttributes({
                        socialMediaStyles: {
                          ...footerAttributes.socialMediaStyles,
                          hoverColor: `text-[${e.target.value}]`,
                        },
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* About Link Design */}
          {footerAttributes.aboutLinks.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center">
                <button
                  className="flex-1 flex items-center justify-between text-left"
                  onClick={() => toggleDesignSection("aboutLinks")}
                >
                  <span className="font-medium">About Links</span>
                  {expandedDesignSections.aboutLinks ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>
              </div>
              {expandedDesignSections.aboutLinks && (
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
                            {footerAttributes.aboutLinks[0].font ===
                            "font-inter"
                              ? "Inter"
                              : footerAttributes.aboutLinks[0].font ===
                                "font-roboto"
                              ? "Roboto"
                              : footerAttributes.aboutLinks[0].font ===
                                "font-open-sans"
                              ? "Open Sans"
                              : footerAttributes.aboutLinks[0].font ===
                                "font-poppins"
                              ? "Poppins"
                              : "Lato"}
                          </span>
                          <ChevronDown />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            const updatedLinks =
                              footerAttributes.aboutLinks.map((link) => ({
                                ...link,
                                font: "font-inter",
                              }));

                            updateFooterAttributes({
                              aboutLinks: updatedLinks,
                            });
                          }}
                        >
                          Inter
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const updatedLinks =
                              footerAttributes.aboutLinks.map((link) => ({
                                ...link,
                                font: "font-roboto",
                              }));

                            updateFooterAttributes({
                              aboutLinks: updatedLinks,
                            });
                          }}
                        >
                          Roboto
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const updatedLinks =
                              footerAttributes.aboutLinks.map((link) => ({
                                ...link,
                                font: "font-open-sans",
                              }));

                            updateFooterAttributes({
                              aboutLinks: updatedLinks,
                            });
                          }}
                        >
                          Open Sans
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const updatedLinks =
                              footerAttributes.aboutLinks.map((link) => ({
                                ...link,
                                font: "font-poppins",
                              }));

                            updateFooterAttributes({
                              aboutLinks: updatedLinks,
                            });
                          }}
                        >
                          Poppins
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const updatedLinks =
                              footerAttributes.aboutLinks.map((link) => ({
                                ...link,
                                font: "font-lato",
                              }));

                            updateFooterAttributes({
                              aboutLinks: updatedLinks,
                            });
                          }}
                        >
                          Lato
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                            {footerAttributes.aboutLinks[0].fontSize ===
                            "text-sm"
                              ? "Small"
                              : footerAttributes.aboutLinks[0].fontSize ===
                                "text-base"
                              ? "Medium"
                              : footerAttributes.aboutLinks[0].fontSize ===
                                "text-lg"
                              ? "Large"
                              : footerAttributes.aboutLinks[0].fontSize ===
                                "text-xl"
                              ? "XL"
                              : footerAttributes.aboutLinks[0].fontSize ===
                                "text-2xl"
                              ? "2XL"
                              : footerAttributes.aboutLinks[0].fontSize ===
                                "text-3xl"
                              ? "3XL"
                              : "4XL"}
                          </span>
                          <ChevronDown />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            const updatedLinks =
                              footerAttributes.aboutLinks.map((link) => ({
                                ...link,
                                fontSize: "text-sm",
                              }));

                            updateFooterAttributes({
                              aboutLinks: updatedLinks,
                            });
                          }}
                        >
                          Small
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const updatedLinks =
                              footerAttributes.aboutLinks.map((link) => ({
                                ...link,
                                fontSize: "text-base",
                              }));

                            updateFooterAttributes({
                              aboutLinks: updatedLinks,
                            });
                          }}
                        >
                          Medium
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const updatedLinks =
                              footerAttributes.aboutLinks.map((link) => ({
                                ...link,
                                fontSize: "text-lg",
                              }));

                            updateFooterAttributes({
                              aboutLinks: updatedLinks,
                            });
                          }}
                        >
                          Large
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const updatedLinks =
                              footerAttributes.aboutLinks.map((link) => ({
                                ...link,
                                fontSize: "text-xl",
                              }));

                            updateFooterAttributes({
                              aboutLinks: updatedLinks,
                            });
                          }}
                        >
                          XL
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const updatedLinks =
                              footerAttributes.aboutLinks.map((link) => ({
                                ...link,
                                fontSize: "text-2xl",
                              }));

                            updateFooterAttributes({
                              aboutLinks: updatedLinks,
                            });
                          }}
                        >
                          2XL
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const updatedLinks =
                              footerAttributes.aboutLinks.map((link) => ({
                                ...link,
                                fontSize: "text-3xl",
                              }));

                            updateFooterAttributes({
                              aboutLinks: updatedLinks,
                            });
                          }}
                        >
                          3XL
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const updatedLinks =
                              footerAttributes.aboutLinks.map((link) => ({
                                ...link,
                                fontSize: "text-4xl",
                              }));

                            updateFooterAttributes({
                              aboutLinks: updatedLinks,
                            });
                          }}
                        >
                          4XL
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* font color */}
                  <div className="space-y-2">
                    <label className="block text-sm mb-2">Text Color</label>
                    <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                      <input
                        type="color"
                        value={footerAttributes.aboutLinks[0].fontColor
                          .split("-[")[1]
                          .slice(0, -1)}
                        className="w-8 h-8 cursor-pointer bg-transparent"
                        onChange={(e) => {
                          const updatedLinks = footerAttributes.aboutLinks.map(
                            (link) => ({
                              ...link,
                              fontColor: `text-[${e.target.value}]`,
                            })
                          );
                          updateFooterAttributes({
                            aboutLinks: updatedLinks,
                          });
                        }}
                      />
                      <input
                        type="text"
                        value={footerAttributes.aboutLinks[0].fontColor
                          .split("-[")[1]
                          .slice(0, -1)}
                        className="flex-1 border-none bg-transparent focus:outline-none"
                        onChange={(e) => {
                          const updatedLinks = footerAttributes.aboutLinks.map(
                            (link) => ({
                              ...link,
                              fontColor: `text-[${e.target.value}]`,
                            })
                          );
                          updateFooterAttributes({
                            aboutLinks: updatedLinks,
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
      )}
    </div>
  );
}
