/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronRight, ImageIcon, Plus } from "lucide-react";
import { useState, useRef, DragEvent } from "react";
import Image from "next/image";

// content sections
type ContentSectionName = "logo" | "copyright" | "socialMedia" | "aboutLinks";

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

  const toggleSection = (section: ContentSectionName) => {
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

  return (
    <div>
      {detailedSectionTab === "content" ? (
        <div className="p-4 space-y-5">
          {/* Image Section */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleSection("logo")}
            >
              <span className="font-medium">Branding</span>
              {expandedContentSections.logo ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedContentSections.logo && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="business_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business Name
                </label>
                <Input
                  id="business_name"
                  name="business_name"
                  placeholder="Your Business Name..."
                  className="w-full bg-background"
                />
              </div>

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
              <div className="space-y-1">
                <label
                  htmlFor="logo_alt"
                  className="block text-sm font-medium text-gray-700"
                >
                  Logo Alt
                </label>
                <Input
                  id="logo_alt"
                  name="logo_alt"
                  placeholder="Logo alt text..."
                  className="w-full bg-background"
                />
              </div>
            </div>
          )}

          {/* Copyright Section */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleSection("copyright")}
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

          {/* Social Media Section */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleSection("socialMedia")}
            >
              <span className="font-medium">Social Media</span>
              {expandedContentSections.socialMedia ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedContentSections.socialMedia && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="facebook"
                  className="block text-sm font-medium text-gray-700"
                >
                  Facebook
                </label>
                <Input
                  id="facebook"
                  name="facebook"
                  placeholder="Your facebook link..."
                  className="w-full bg-background"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="instagram"
                  className="block text-sm font-medium text-gray-700"
                >
                  Instagram
                </label>
                <Input
                  id="instagram"
                  name="instagram"
                  placeholder="Your instagram link..."
                  className="w-full bg-background"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="youtube"
                  className="block text-sm font-medium text-gray-700"
                >
                  Youtube
                </label>
                <Input
                  id="youtube"
                  name="youtube"
                  placeholder="Your youtube link..."
                  className="w-full bg-background"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="pinterest"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pinterest
                </label>
                <Input
                  id="pinterest"
                  name="pinterest"
                  placeholder="Your pinterest link..."
                  className="w-full bg-background"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="twitter"
                  className="block text-sm font-medium text-gray-700"
                >
                  Twitter
                </label>
                <Input
                  id="twitter"
                  name="twitter"
                  placeholder="Your twitter link..."
                  className="w-full bg-background"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Your email address..."
                  className="w-full bg-background"
                />
              </div>
            </div>
          )}

          {/* About Links Section */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleSection("aboutLinks")}
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
        <div className="p-4 space-y-6"></div>
      )}
    </div>
  );
}
