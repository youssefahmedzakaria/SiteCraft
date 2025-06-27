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
  Trash,
  Upload,
} from "lucide-react";
import { useState, useRef, DragEvent } from "react";
import Image from "next/image";
import { PromoLayoutItems } from "./promoLayoutItems";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/SiteCraft/ui/dropdown-menu";
import { Button } from "@/components/SiteCraft/ui/button";

type SectionName = "image" | "title" | "description" | "button" | "arrows";

interface PromoImage {
  id: string;
  title?: string;
  description?: string;
  image?: File | null;
  imagePreview?: string | null;
}

interface PromoSettings {
  showArrows: boolean;
  titleFont: string;
  titleColor: string;
  titleSize: string;
  descriptionFont: string;
  descriptionColor: string;
  descriptionSize: string;
  buttonFont: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonSize: string;
  buttonRadius: string;
  backgroundColor: string;
  imageObjectFit: "Cover" | "Fill" | "Contain";
  autoplay: boolean;
}

interface RenderPromoSectionProps {
  detailedSectionTab: string;
}

export function RenderPromoSection({
  detailedSectionTab,
}: RenderPromoSectionProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<SectionName, boolean>
  >({
    image: false,
    title: false,
    description: false,
    button: false,
    arrows: false,
  });

  const [promoSettings, setPromoSettings] = useState<PromoSettings>({
    showArrows: true,
    titleFont: "inter",
    titleColor: "#000000",
    titleSize: "16px",
    descriptionFont: "inter",
    descriptionColor: "#666666",
    descriptionSize: "14px",
    buttonFont: "inter",
    buttonColor: "#000000",
    buttonTextColor: "#ffffff",
    buttonSize: "14px",
    buttonRadius: "4px",
    backgroundColor: "#ffffff",
    imageObjectFit: "Contain",
    autoplay: false,
  });

  const toggleSection = (section: SectionName) => {
    setExpandedSections((prev) => {
      const isCurrentlyOpen = prev[section];

      if (isCurrentlyOpen) {
        return {
          image: false,
          title: false,
          description: false,
          button: false,
          arrows: false,
        };
      }

      return {
        image: false,
        title: false,
        description: false,
        button: false,
        arrows: false,
        [section]: true,
      };
    });
  };

  {
    /* for promos expand */
  }
  const [expandedPromos, setExpandedPromos] = useState<Record<string, boolean>>(
    {}
  );

  const togglePromoSection = (id: string) => {
    setExpandedPromos((prev) => {
      const isCurrentlyOpen = !!prev[id];

      // Close all if already open
      if (isCurrentlyOpen) {
        return {};
      }

      // Open the clicked promo, close others
      return { [id]: true };
    });
  };

  {
    /* for promo images */
  }
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleImageChange = (
    promoId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    setPromos((prevPromos) =>
      prevPromos.map((promo) =>
        promo.id === promoId
          ? {
              ...promo,
              image: file,
              imagePreview: file ? URL.createObjectURL(file) : null,
            }
          : promo
      )
    );
  };

  const handleBrowseClick = (promoId: string) => {
    fileInputRefs.current[promoId]?.click();
  };

  const handleDragOverImage = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropImage = (promoId: string, e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      setPromos((prevPromos) =>
        prevPromos.map((promo) =>
          promo.id === promoId
            ? {
                ...promo,
                image: file,
                imagePreview: URL.createObjectURL(file),
              }
            : promo
        )
      );
    }
  };

  {
    /* for promos reorder and management */
  }
  const [promos, setPromos] = useState<PromoImage[]>([
    {
      id: "1",
      title: "First Promo",
      description: undefined,
      image: null,
      imagePreview: null,
    },
    {
      id: "2",
      title: "Second Promo",
      description: undefined,
      image: null,
      imagePreview: null,
    },
  ]);

  const [draggedPromoIndex, setDraggedPromoIndex] = useState<number | null>(
    null
  );
  // Reference for promo DOM elements
  const promoRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Drag and drop handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedPromoIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    if (
      draggedPromoIndex !== null &&
      promoRefs.current[promos[draggedPromoIndex].id]
    ) {
      const el = promoRefs.current[promos[draggedPromoIndex].id];
      if (el) {
        el.classList.remove("opacity-50");
      }
    }
    setDraggedPromoIndex(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    return false;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();

    if (draggedPromoIndex === null) return;
    if (draggedPromoIndex === dropIndex) return;

    const newPromos = [...promos]; // Create a new array
    const draggedPromo = newPromos[draggedPromoIndex];

    newPromos.splice(draggedPromoIndex, 1);
    newPromos.splice(dropIndex, 0, draggedPromo);

    setPromos(newPromos); // Set the *new* array as state
    setDraggedPromoIndex(null);
  };

  {
    /* add and delete promo */
  }
  const handleAddPromo = () => {
    const newPromoId = parseInt(promos[promos.length - 1].id) + 1;
    const newPromo: PromoImage = {
      id: newPromoId.toString(),
      title: "New Promo",
      description: undefined,
      image: null,
      imagePreview: null,
    };
    setPromos((prevPromos) => [...prevPromos, newPromo]);
    // Optionally expand the new promo
    setExpandedPromos((prevExpanded) => ({
      ...prevExpanded,
      [newPromoId]: false,
    }));
  };

  const handleDeletePromo = (promoId: string) => {
    setPromos((prevPromos) =>
      prevPromos.filter((promo) => promo.id !== promoId)
    );
    // Optionally close the deleted promo's section
    setExpandedPromos((prevExpanded) => {
      const { [promoId]: _, ...rest } = prevExpanded;
      return rest;
    });
  };

  {
    /* change promo title */
  }
  const handleTitleChange = (promoId: string, newTitle: string) => {
    setPromos((prevPromos) =>
      prevPromos.map((promo) =>
        promo.id === promoId ? { ...promo, title: newTitle } : promo
      )
    );
  };

  return (
    <div>
      {detailedSectionTab === "content" ? (
        <div className="p-4 space-y-8">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold tracking-tight">Slides</h1>
            <div className="space-y-2">
              {promos.map((promo, index) => (
                <div key={promo.id} className="justify-end">
                  <div
                    className={` bg-gray-100 rounded space-y-2 ${
                      expandedPromos[promo.id] ? "px-2 pt-2 pb-4" : "p-2"
                    }`}
                  >
                    {/* Promo Card header */}
                    <div
                      ref={(el) => {
                        promoRefs.current[promo.id] = el;
                      }}
                      className={`flex items-center justify-between  ${
                        draggedPromoIndex === index ? "opacity-50" : ""
                      }`}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onClick={() => togglePromoSection(promo.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="cursor-grab text-gray-400 hover:text-gray-600"
                          title="Drag to reorder"
                        >
                          <GripVertical size={18} />
                        </div>
                        <span>{promo.title}</span>
                      </div>
                      {expandedPromos[promo.id] ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </div>
                    {/* Promo Card content */}
                    {expandedPromos[promo.id] && (
                      <div className="flex-col px-2 bg-gray-100 rounded space-y-2">
                        {/* Promo Card image */}
                        <div className="flex-1 space-y-2">
                          <label
                            htmlFor="image"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Image
                          </label>
                          <div
                            className="flex flex-col items-center gap-2 bg-background border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
                            onDragOver={handleDragOverImage}
                            onDrop={(e) => handleDropImage(promo.id, e)}
                          >
                            <div
                              className={`relative w-24 h-24 rounded ${
                                promo.imagePreview ? "" : "bg-gray-100"
                              } overflow-hidden`}
                            >
                              {promo.imagePreview ? (
                                <Image
                                  src={promo.imagePreview}
                                  alt="Promo preview"
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
                              {promo.imagePreview ? (
                                <p className="text-xs">
                                  Drag and drop image here to change, or{" "}
                                  <span
                                    className="cursor-pointer underline"
                                    onClick={() => handleBrowseClick(promo.id)}
                                  >
                                    browse
                                  </span>
                                </p>
                              ) : (
                                <p className="text-xs">
                                  Drag and drop image here, or{" "}
                                  <span
                                    className="cursor-pointer underline"
                                    onClick={() => handleBrowseClick(promo.id)}
                                  >
                                    browse
                                  </span>
                                </p>
                              )}
                            </div>
                            <input
                              ref={(el) => {
                                fileInputRefs.current[promo.id] = el;
                              }}
                              id={`image-${promo.id}`}
                              name="image"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageChange(promo.id, e)}
                            />
                          </div>
                        </div>
                        {/* Title */}
                        <div className="flex-1 space-y-2">
                          <label
                            htmlFor={`title-${promo.id}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Title
                          </label>
                          <Input
                            id={`title-${promo.id}`}
                            name="title"
                            placeholder="Promo title"
                            defaultValue={promo.title}
                            className="w-full bg-background"
                            onChange={(e) =>
                              handleTitleChange(promo.id, e.target.value)
                            }
                          />
                        </div>
                        {/* Description */}
                        <div className="space-y-2">
                          <label
                            htmlFor={`description-${promo.id}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Description
                          </label>
                          <Textarea
                            id={`description-${promo.id}`}
                            name="description"
                            placeholder="Attractive description that matches the title"
                            rows={4}
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end mt-1">
                    <button
                      onClick={() => handleDeletePromo(promo.id)}
                      className="pr-2 text-[0.6rem] text-red-500 hover:text-red-700 focus:outline-none underline"
                      title="Delete Promo"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddPromo}
            className="flex items-center justify-center gap-2 bg-gray-100 border border-gray-400 rounded-md w-full h-10"
          >
            <Plus size={18} />
            Add Promo
          </button>
        </div>
      ) : (
        <div className="p-4 space-y-6">
          <PromoLayoutItems />

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
                      {promoSettings.titleFont}
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
                    value={promoSettings.titleColor}
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
                    value={promoSettings.titleColor}
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
                    value={parseInt(promoSettings.titleSize) || ""}
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
                      {promoSettings.descriptionFont}
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
                    value={promoSettings.descriptionColor}
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
                    value={promoSettings.descriptionColor}
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
                    value={parseInt(promoSettings.descriptionSize) || ""}
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

          {/* Button Section */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleSection("button")}
            >
              <span className="font-medium">Button</span>
              {expandedSections.button ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedSections.button && (
            <div className="space-y-4">
              {/* Font Family Dropdown */}
              <div>
                <label className="block text-sm mb-2">Font Family</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {promoSettings.buttonFont}
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
                              buttonFont: font,
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

              {/* Text Color Picker */}
              <div className="space-y-2">
                <label className="block text-sm mb-2">Text Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={promoSettings.buttonTextColor}
                    onChange={(e) =>
                      setPromoSettings((s) => ({
                        ...s,
                        buttonTextColor: e.target.value,
                      }))
                    }
                    className="w-8 h-8 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={promoSettings.buttonTextColor}
                    onChange={(e) =>
                      setPromoSettings((s) => ({
                        ...s,
                        buttonTextColor: e.target.value,
                      }))
                    }
                    className="flex-1 border-none bg-transparent focus:outline-none text-sm"
                  />
                </div>
              </div>

              {/* Font Size Input */}
              <div className="space-y-2">
                <label className="block text-sm mb-2">Font Size (px)</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="number"
                    value={parseInt(promoSettings.buttonSize) || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPromoSettings((s) => ({
                        ...s,
                        buttonSize: value ? `${value}px` : "0px",
                      }));
                    }}
                    className="flex-1 border-none bg-transparent focus:outline-none text-sm"
                    placeholder="14"
                    min="0"
                  />
                  <span className="text-sm text-gray-500">px</span>
                </div>
              </div>

              {/* Border Radius Input */}
              <div className="space-y-2">
                <label className="block text-sm mb-2">Border Radius (px)</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="number"
                    value={parseInt(promoSettings.buttonRadius) || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPromoSettings((s) => ({
                        ...s,
                        buttonRadius: value ? `${value}px` : "0px",
                      }));
                    }}
                    className="flex-1 border-none bg-transparent focus:outline-none text-sm"
                    placeholder="4"
                    min="0"
                  />
                  <span className="text-sm text-gray-500">px</span>
                </div>
              </div>
            </div>
          )}

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
                      {promoSettings.imageObjectFit}
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
                    value={promoSettings.backgroundColor}
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
                    value={promoSettings.backgroundColor}
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

          {/* Arrows & Autoplay Section */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleSection("arrows")}
            >
              <span className="font-medium">Controls</span>
              {expandedSections.arrows ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedSections.arrows && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Show Arrows</span>
                <Button
                  variant={promoSettings.showArrows ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setPromoSettings((s) => ({
                      ...s,
                      showArrows: !s.showArrows,
                    }))
                  }
                >
                  {promoSettings.showArrows ? "Enabled" : "Disabled"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Autoplay</span>
                <Button
                  variant={promoSettings.autoplay ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setPromoSettings((s) => ({ ...s, autoplay: !s.autoplay }))
                  }
                >
                  {promoSettings.autoplay ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
