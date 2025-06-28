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

// content sections
type ContentSectionName = "logo" | "copyright" | "socialMedia" | "aboutLinks";

// content sections
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
}

export function RenderFooterSection({
  detailedSectionTab,
}: RenderFooterSectionProps) {
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
  const [contentLinks, setContentLink] = useState<AboutLink[]>([
    {
      id: "1",
      title: undefined,
      link: undefined,
    },
  ]);

  const handleTitleChange = (linkId: string, newTitle: string) => {
    setContentLink((prevLinks) =>
      prevLinks.map((link) =>
        link.id === linkId ? { ...link, title: newTitle } : link
      )
    );
  };

  const handleLinkChange = (linkId: string, newLink: string) => {
    setContentLink((prevLinks) =>
      prevLinks.map((link) =>
        link.id === linkId ? { ...link, link: newLink } : link
      )
    );
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
    console.log(contentLinks);
  };

  const handleDeleteContentLink = (linkId: string) => {
    setContentLink((prevLinks) =>
      prevLinks.filter((link) => link.id !== linkId)
    );
    console.log(contentLinks);
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

  {
    /* For design settings */
  }
  const [footerSettings, setFooterSettings] = useState({
    background: "#ffffff",
    generalText: "#000000",
    logoWidth: "50px",
    logoHeight: "50px",
    aboutLinkFontFamily: "Arial",
    aboutLinkFontSize: "14px",
    aboutLinkFontWeight: "normal",
    aboutLinkColor: "#000000",
    socialMediaIconColor: "#000000",
    socialMediaIconHoverColor: "#000000",
    socialMediaIconSize: "20px",
    copyrightFontFamily: "Arial",
    copyrightFontSize: "14px",
    copyrightFontWeight: "normal",
    copyrightColor: "#000000",
  });

  const [aboutLinksFontFamily, setAboutLinksFontFamily] = useState<
    "inter" | "roboto" | "open-sans" | "poppins" | "lato"
  >("inter");

  const handleAboutLinksFontFamilyChange = (
    type: "inter" | "roboto" | "open-sans" | "poppins" | "lato"
  ) => {
    setAboutLinksFontFamily(type);
    setFooterSettings((s) => ({
      ...s,
      aboutLinkFontFamily: type ? `${type}px` : "0px",
    }));
  };

  const [copyrightFontFamily, setCopyrightFontFamily] = useState<
    "inter" | "roboto" | "open-sans" | "poppins" | "lato"
  >("inter");

  const handleCopyrightFontFamilyChange = (
    type: "inter" | "roboto" | "open-sans" | "poppins" | "lato"
  ) => {
    setCopyrightFontFamily(type);
    setFooterSettings((s) => ({
      ...s,
      copyrightFontFamily: type ? `${type}px` : "0px",
    }));
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
              <div className="color-picker-container">
                <label className="block text-sm mb-2">Background Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={footerSettings.background}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      setFooterSettings((prev) => ({
                        ...prev,
                        background: e.target.value,
                      }));
                    }}
                  />
                  <input
                    type="text"
                    value={footerSettings.background}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      setFooterSettings((prev) => ({
                        ...prev,
                        background: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="color-picker-container">
                <label className="block text-sm mb-2">Text Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={footerSettings.generalText}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      setFooterSettings((prev) => ({
                        ...prev,
                        generalText: e.target.value,
                      }));
                    }}
                  />
                  <input
                    type="text"
                    value={footerSettings.generalText}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      setFooterSettings((prev) => ({
                        ...prev,
                        generalText: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
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
                    value={parseInt(footerSettings.logoHeight) || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFooterSettings((s) => ({
                        ...s,
                        logoHeight: value ? `${value}px` : "0px",
                      }));
                    }}
                    className="flex-1 h-7 border-none bg-transparent focus:outline-none text-sm"
                    placeholder="16"
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
                        {copyrightFontFamily === "inter"
                          ? "Inter"
                          : copyrightFontFamily === "roboto"
                          ? "Roboto"
                          : copyrightFontFamily === "open-sans"
                          ? "Open Sans"
                          : copyrightFontFamily === "poppins"
                          ? "Poppins"
                          : "Lato"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleCopyrightFontFamilyChange("inter")}
                    >
                      Inter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleCopyrightFontFamilyChange("roboto")}
                    >
                      Roboto
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleCopyrightFontFamilyChange("open-sans")
                      }
                    >
                      Open Sans
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleCopyrightFontFamilyChange("poppins")}
                    >
                      Poppins
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleCopyrightFontFamilyChange("lato")}
                    >
                      Lato
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* font size */}
              <div className="space-y-2">
                <label className="block text-sm mb-2">Font Size</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="number"
                    value={parseInt(footerSettings.copyrightFontSize) || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFooterSettings((s) => ({
                        ...s,
                        copyrightFontSize: value ? `${value}px` : "0px",
                      }));
                    }}
                    className="flex-1 h-7 border-none bg-transparent focus:outline-none text-sm"
                    placeholder="16"
                    min="0"
                  />
                  <span className="text-sm text-gray-500">px</span>
                </div>
              </div>

              {/* font weight */}

              {/* font color */}
              <div className="color-picker-container">
                <label className="block text-sm mb-2">Text Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={footerSettings.copyrightColor}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      setFooterSettings((prev) => ({
                        ...prev,
                        copyrightColor: e.target.value,
                      }));
                    }}
                  />
                  <input
                    type="text"
                    value={footerSettings.copyrightColor}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      setFooterSettings((prev) => ({
                        ...prev,
                        copyrightColor: e.target.value,
                      }));
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
                    value={parseInt(footerSettings.socialMediaIconSize) || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFooterSettings((s) => ({
                        ...s,
                        socialMediaIconSize: value ? `${value}px` : "0px",
                      }));
                    }}
                    className="flex-1 h-7 border-none bg-transparent focus:outline-none text-sm"
                    placeholder="16"
                    min="0"
                  />
                  <span className="text-sm text-gray-500">px</span>
                </div>
              </div>

              {/* icon color */}
              <div className="color-picker-container">
                <label className="block text-sm mb-2">Icons Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={footerSettings.socialMediaIconColor}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      setFooterSettings((prev) => ({
                        ...prev,
                        socialMediaIconColor: e.target.value,
                      }));
                    }}
                  />
                  <input
                    type="text"
                    value={footerSettings.socialMediaIconColor}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      setFooterSettings((prev) => ({
                        ...prev,
                        socialMediaIconColor: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>

              {/* icon hover color */}
              <div className="color-picker-container">
                <label className="block text-sm mb-2">Icons Hover Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={footerSettings.socialMediaIconHoverColor}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      setFooterSettings((prev) => ({
                        ...prev,
                        socialMediaIconHoverColor: e.target.value,
                      }));
                    }}
                  />
                  <input
                    type="text"
                    value={footerSettings.socialMediaIconHoverColor}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      setFooterSettings((prev) => ({
                        ...prev,
                        socialMediaIconHoverColor: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* About Link */}
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
                        {aboutLinksFontFamily === "inter"
                          ? "Inter"
                          : aboutLinksFontFamily === "roboto"
                          ? "Roboto"
                          : aboutLinksFontFamily === "open-sans"
                          ? "Open Sans"
                          : aboutLinksFontFamily === "poppins"
                          ? "Poppins"
                          : "Lato"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleAboutLinksFontFamilyChange("inter")}
                    >
                      Inter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAboutLinksFontFamilyChange("roboto")}
                    >
                      Roboto
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleAboutLinksFontFamilyChange("open-sans")
                      }
                    >
                      Open Sans
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleAboutLinksFontFamilyChange("poppins")
                      }
                    >
                      Poppins
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAboutLinksFontFamilyChange("lato")}
                    >
                      Lato
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* font size */}
              <div className="space-y-2">
                <label className="block text-sm mb-2">Font Size</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="number"
                    value={parseInt(footerSettings.aboutLinkFontSize) || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFooterSettings((s) => ({
                        ...s,
                        aboutLinkFontSize: value ? `${value}px` : "0px",
                      }));
                    }}
                    className="flex-1 h-7 border-none bg-transparent focus:outline-none text-sm"
                    placeholder="16"
                    min="0"
                  />
                  <span className="text-sm text-gray-500">px</span>
                </div>
              </div>

              {/* font weight */}

              {/* font color */}
              <div className="color-picker-container">
                <label className="block text-sm mb-2">Text Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={footerSettings.aboutLinkColor}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      setFooterSettings((prev) => ({
                        ...prev,
                        aboutLinkColor: e.target.value,
                      }));
                    }}
                  />
                  <input
                    type="text"
                    value={footerSettings.aboutLinkColor}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      setFooterSettings((prev) => ({
                        ...prev,
                        aboutLinkColor: e.target.value,
                      }));
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
