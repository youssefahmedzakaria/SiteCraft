/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { FooterCustomizationAttributes } from "@/lib/customization";
import { form } from "@heroui/theme";

// content sections
type ContentSectionName = "logo" | "copyright" | "socialMedia" | "aboutLinks";

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
  title?: string;
  link?: string;
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
  const [expandedContentSections, setExpandedContentSections] = useState<
    Record<ContentSectionName, boolean>
  >({
    logo: false,
    copyright: false,
    socialMedia: false,
    aboutLinks: false,
  });

  const toggleContentSection = (section: ContentSectionName) => {
    setExpandedContentSections((prev) => {
      const isCurrentlyOpen = prev[section];

      if (isCurrentlyOpen) {
        return {
          logo: false,
          copyright: false,
          socialMedia: false,
          aboutLinks: false,
        };
      }

      return {
        logo: false,
        copyright: false,
        socialMedia: false,
        aboutLinks: false,
        [section]: true,
      };
    });
  };

  {
    /* For About Links in content */
  }
  const [contentLinks, setContentLink] = useState<AboutLink[]>(
    footerAttributes.aboutLinks?.map((link, index) => ({
      id: (index + 1).toString(),
      title: link.label,
      link: link.href,
    })) || [
      {
        id: "1",
        title: undefined,
        link: undefined,
      },
    ]
  );

  const handleTitleChange = (linkId: string, newTitle: string) => {
    setContentLink((prevLinks) =>
      prevLinks.map((link) =>
        link.id === linkId ? { ...link, title: newTitle } : link
      )
    );

    // Update footer attributes
    const updatedLinks = contentLinks.map((link) =>
      link.id === linkId ? { ...link, title: newTitle } : link
    );
    updateFooterAttributes({
      aboutLinks: updatedLinks.map((link) => ({
        label: link.title || "",
        href: link.link || "",
        font: "font-serif",
        fontSize: "text-lg",
        fontColor: "text-black",
      })),
    });
  };

  const handleLinkChange = (linkId: string, newLink: string) => {
    setContentLink((prevLinks) =>
      prevLinks.map((link) =>
        link.id === linkId ? { ...link, link: newLink } : link
      )
    );

    // Update footer attributes
    const updatedLinks = contentLinks.map((link) =>
      link.id === linkId ? { ...link, link: newLink } : link
    );
    updateFooterAttributes({
      aboutLinks: updatedLinks.map((link) => ({
        label: link.title || "",
        href: link.link || "",
        font: "font-serif",
        fontSize: "text-lg",
        fontColor: "text-black",
      })),
    });
  };

  {
    /* add and delete links */
  }
  const handleAddContentLink = () => {
    const newLinkId = parseInt(contentLinks[contentLinks.length - 1].id) + 1;
    const newLink: AboutLink = {
      id: newLinkId.toString(),
      title: undefined,
      link: undefined,
    };
    setContentLink((prevLinks) => [...prevLinks, newLink]);

    // Update footer attributes
    const updatedLinks = [...contentLinks, newLink];
    updateFooterAttributes({
      aboutLinks: updatedLinks.map((link) => ({
        label: link.title || "",
        href: link.link || "",
        font: "font-serif",
        fontSize: "text-lg",
        fontColor: "text-black",
      })),
    });
  };

  const handleDeleteContentLink = (linkId: string) => {
    setContentLink((prevLinks) =>
      prevLinks.filter((link) => link.id !== linkId)
    );

    // Update footer attributes
    const updatedLinks = contentLinks.filter((link) => link.id !== linkId);
    updateFooterAttributes({
      aboutLinks: updatedLinks.map((link) => ({
        label: link.title || "",
        href: link.link || "",
        font: "font-serif",
        fontSize: "text-lg",
        fontColor: "text-black",
      })),
    });
  };

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

  return (
    <div>
      {detailedSectionTab === "content" ? (
        <div className="p-4 space-y-5">
          {/* Copyright Section */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleContentSection("copyright")}
            >
              <span className="font-medium">Copyright</span>
              {expandedContentSections.copyright ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedContentSections.copyright && (
            <div className="space-y-4">
              <Textarea
                id="copyright"
                name="copyright"
                placeholder="Write what is your copyright..."
                rows={4}
                className="w-full"
              />
            </div>
          )}

          {/* About Links Section */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleContentSection("aboutLinks")}
            >
              <span className="font-medium">About Links</span>
              {expandedContentSections.aboutLinks ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedContentSections.aboutLinks && (
            <div className="space-y-4">
              {contentLinks.map((link, index) => (
                <div key={link.id} className="space-y-2">
                  <div className="space-y-1">
                    <label
                      htmlFor={`linkText-${link.id}`}
                      className="block text-sm font-medium text-gray-700"
                      id={`linkText-${link.id}`}
                    >
                      Link Text
                    </label>
                    <Input
                      id={`linkText-${link.id}`}
                      name={`linkText-${link.id}`}
                      placeholder="Your link text..."
                      defaultValue={link.title}
                      className="w-full bg-background"
                      onChange={(e) =>
                        handleTitleChange(link.id, e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor={`link-${link.id}`}
                      className="block text-sm font-medium text-gray-700"
                      id={`link-${link.id}`}
                    >
                      Link
                    </label>
                    <Input
                      id={`link-${link.id}`}
                      name={`link-${link.id}`}
                      placeholder="Your link..."
                      defaultValue={link.link}
                      className="w-full bg-background"
                      onChange={(e) =>
                        handleLinkChange(link.id, e.target.value)
                      }
                    />
                  </div>
                  <div className="flex justify-end mt-1">
                    <button
                      onClick={() => handleDeleteContentLink(link.id)}
                      className="pr-2 text-[0.6rem] text-red-500 hover:text-red-700 focus:outline-none underline"
                      title="Delete Promo"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={handleAddContentLink}
                className="flex items-center justify-center gap-2 bg-gray-100 border border-gray-400 rounded-md w-full h-10"
              >
                <Plus size={18} />
                Add Link
              </button>
            </div>
          )}
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

          {/* About Link */}
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
