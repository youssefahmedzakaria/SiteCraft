/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Trash2,
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
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { PromoCustomizationAttributes } from "@/lib/customization";

type SectionName = "image" | "title" | "description" | "button" | "arrows";

interface RenderPromoSectionProps {
  detailedSectionTab: string;
  promoAttributes: PromoCustomizationAttributes;
  updatePromoAttributes: (
    updates: Partial<PromoCustomizationAttributes>
  ) => void;
  onDeleteSection?: () => void;
  promoImages: File[] | undefined;
  setPromoImages: React.Dispatch<React.SetStateAction<File[] | undefined>>;
}

export function RenderPromoSection({
  detailedSectionTab,
  promoAttributes,
  updatePromoAttributes,
  onDeleteSection,
  promoImages,
  setPromoImages,
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

  // Handle layout selection and update template
  const handleLayoutSelection = (layoutId: number) => {
    const templateNames = [
      "CenteredPromo",
      "OverlayPromo",
      "MinimalRightPromo",
      "MinimalLeftPromo",
      "SplitPromo",
      "RightAlignedPromo",
      "LeftAlignedPromo",
    ];
    const templateName = templateNames[layoutId - 1] || "CenteredPromo";
    updatePromoAttributes({ template: templateName });
  };

  {
    /* for promos expand */
  }
  const [expandedPromos, setExpandedPromos] = useState<Record<number, boolean>>(
    {}
  );

  const togglePromoSection = (index: number) => {
    setExpandedPromos((prev) => {
      const isCurrentlyOpen = !!prev[index];

      // Close all if already open
      if (isCurrentlyOpen) {
        return {};
      }

      // Open the clicked promo, close others
      return { [index]: true };
    });
  };

  {
    /* for promo images */
  }
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleImageChange = (
    indexStr: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const index = parseInt(indexStr);
    const file = e.target.files?.[0] || null;
    if (file) {
      // Update promoImages
      const updatedPromoImages = promoImages ? [...promoImages] : [];
      updatedPromoImages[index] = file;
      setPromoImages(updatedPromoImages);
      // Update preview
      const updatedSlides = [...promoAttributes.slides];
      updatedSlides[index] = {
        ...updatedSlides[index],
        image: URL.createObjectURL(file),
      };
      updatePromoAttributes({ slides: updatedSlides });
    }
  };

  const handleBrowseClick = (indexStr: string) => {
    fileInputRefs.current[indexStr]?.click();
  };

  const handleDragOverImage = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropImage = (indexStr: string, e: React.DragEvent) => {
    e.preventDefault();
    const index = parseInt(indexStr);
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      const updatedPromoImages = promoImages ? [...promoImages] : [];
      updatedPromoImages[index] = file;
      setPromoImages(updatedPromoImages);
      const updatedSlides = [...promoAttributes.slides];
      updatedSlides[index] = {
        ...updatedSlides[index],
        image: URL.createObjectURL(file),
      };
      updatePromoAttributes({ slides: updatedSlides });
    }
  };

  {
    /* for promos reorder and management */
  }
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(promoAttributes.slides);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updatePromoAttributes({ slides: items });
    // Reorder promoImages
    if (promoImages) {
      const images = Array.from(promoImages);
      const [reorderedImage] = images.splice(result.source.index, 1);
      images.splice(result.destination.index, 0, reorderedImage);
      setPromoImages(images);
    }
  };

  {
    /* add and delete promo */
  }
  const handleAddPromo = () => {
    const newPromo = {
      title: "New Promo",
      description: "Add your description here",
      buttonText: "Shop Now",
      buttonLink: "#new-collection",
      image: "/placeholder.png",
      imageAlt: "New promo image",
    };
    updatePromoAttributes({
      slides: [...promoAttributes.slides, newPromo],
    });
    // setPromoImages([...(promoImages || []), undefined]);
  };

  const handleDeletePromo = (index: number) => {
    const updatedSlides = promoAttributes.slides.filter((_, i) => i !== index);
    updatePromoAttributes({ slides: updatedSlides });
    if (promoImages) {
      const updatedPromoImages = promoImages.filter((_, i) => i !== index);
      setPromoImages(updatedPromoImages);
    }
  };

  {
    /* change promo title */
  }
  const handleTitleChange = (index: number, newTitle: string) => {
    const updatedSlides = [...promoAttributes.slides];
    updatedSlides[index] = { ...updatedSlides[index], title: newTitle };
    updatePromoAttributes({ slides: updatedSlides });
  };

  // change promo image alt
  const handleImageAltChange = (index: number, newImageAlt: string) => {
    const updatedSlides = [...promoAttributes.slides];
    updatedSlides[index] = { ...updatedSlides[index], imageAlt: newImageAlt };
    updatePromoAttributes({ slides: updatedSlides });
  };

  // change promo button text
  const handleButtonTextChange = (index: number, newButtonText: string) => {
    const updatedSlides = [...promoAttributes.slides];
    updatedSlides[index] = {
      ...updatedSlides[index],
      buttonText: newButtonText,
    };
    updatePromoAttributes({ slides: updatedSlides });
  };

  // change promo button link
  const handleButtonLinkChange = (index: number, newButtonLink: string) => {
    const updatedSlides = [...promoAttributes.slides];
    updatedSlides[index] = {
      ...updatedSlides[index],
      buttonLink: newButtonLink,
    };
    updatePromoAttributes({ slides: updatedSlides });
  };

  // change promo description
  const handleDescriptionChange = (index: number, newDescription: string) => {
    const updatedSlides = [...promoAttributes.slides];
    updatedSlides[index] = {
      ...updatedSlides[index],
      description: newDescription,
    };
    updatePromoAttributes({ slides: updatedSlides });
  };

  return (
    <div className="flex flex-col h-full w-full min-h-0">
      {detailedSectionTab === "content" ? (
        <div className="flex flex-col flex-1 min-h-0 p-4">
          <div className="space-y-8 flex-1 min-h-0 overflow-y-auto">
            <div className="space-y-1">
              <h1 className="text-lg font-semibold tracking-tight">Slides</h1>
              <div className="space-y-2">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="promos">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {promoAttributes.slides.map((promo, index) => (
                          <Draggable
                            key={index}
                            draggableId={index.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div>
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`bg-gray-100 rounded space-y-2 ${
                                    expandedPromos[index]
                                      ? "px-2 pt-2 pb-4"
                                      : "p-2"
                                  } ${snapshot.isDragging ? "shadow-lg" : ""}`}
                                >
                                  {/* Promo Card header */}
                                  <div
                                    className="flex items-center justify-between"
                                    onClick={() => togglePromoSection(index)}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        {...provided.dragHandleProps}
                                        className="cursor-grab text-gray-400 hover:text-gray-600"
                                        title="Drag to reorder"
                                      >
                                        <GripVertical size={18} />
                                      </div>
                                      <span>{promo.title}</span>
                                    </div>
                                    {expandedPromos[index] ? (
                                      <ChevronDown size={18} />
                                    ) : (
                                      <ChevronRight size={18} />
                                    )}
                                  </div>
                                  {/* Promo Card content */}
                                  {expandedPromos[index] && (
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
                                          onDrop={(e) =>
                                            handleDropImage(index.toString(), e)
                                          }
                                        >
                                          <div
                                            className={`relative w-24 h-24 rounded ${
                                              promo.image ? "" : "bg-gray-100"
                                            } overflow-hidden`}
                                          >
                                            {promo.image ? (
                                              <Image
                                                src={promo.image}
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
                                            {promo.image ? (
                                              <p className="text-xs">
                                                Drag and drop image here to
                                                change, or{" "}
                                                <span
                                                  className="cursor-pointer underline"
                                                  onClick={() =>
                                                    handleBrowseClick(
                                                      index.toString()
                                                    )
                                                  }
                                                >
                                                  browse
                                                </span>
                                              </p>
                                            ) : (
                                              <p className="text-xs">
                                                Drag and drop image here, or{" "}
                                                <span
                                                  className="cursor-pointer underline"
                                                  onClick={() =>
                                                    handleBrowseClick(
                                                      index.toString()
                                                    )
                                                  }
                                                >
                                                  browse
                                                </span>
                                              </p>
                                            )}
                                          </div>
                                          <input
                                            ref={(el) => {
                                              fileInputRefs.current[
                                                index.toString()
                                              ] = el;
                                            }}
                                            id={`image-${index}`}
                                            name="image"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                              handleImageChange(
                                                index.toString(),
                                                e
                                              )
                                            }
                                          />
                                        </div>
                                      </div>

                                      {/* Image Alt */}
                                      <div className="space-y-2">
                                        <label
                                          htmlFor={`imageAlt-${index}`}
                                          className="block text-sm font-medium text-gray-700"
                                        >
                                          Image Alt Text
                                        </label>
                                        <Input
                                          id={`imageAlt-${index}`}
                                          name="imageAlt"
                                          placeholder="Describe the image for accessibility"
                                          value={promo.imageAlt || ""}
                                          className="w-full bg-background"
                                          onChange={(e) =>
                                            handleImageAltChange(
                                              index,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>

                                      {/* Title */}
                                      <div className="flex-1 space-y-2">
                                        <label
                                          htmlFor={`title-${index}`}
                                          className="block text-sm font-medium text-gray-700"
                                        >
                                          Title
                                        </label>
                                        <Input
                                          id={`title-${index}`}
                                          name="title"
                                          placeholder="Promo title"
                                          value={promo.title || ""}
                                          className="w-full bg-background"
                                          onChange={(e) =>
                                            handleTitleChange(
                                              index,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                      {/* Description */}
                                      <div className="space-y-2">
                                        <label
                                          htmlFor={`description-${index}`}
                                          className="block text-sm font-medium text-gray-700"
                                        >
                                          Description
                                        </label>
                                        <Textarea
                                          id={`description-${index}`}
                                          name="description"
                                          placeholder="Attractive description that matches the title"
                                          rows={4}
                                          className="w-full"
                                          value={promo.description || ""}
                                          onChange={(e) =>
                                            handleDescriptionChange(
                                              index,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>

                                      {/* Button Text */}
                                      <div className="space-y-2">
                                        <label
                                          htmlFor={`buttonText-${index}`}
                                          className="block text-sm font-medium text-gray-700"
                                        >
                                          Button Text
                                        </label>
                                        <Input
                                          id={`buttonText-${index}`}
                                          name="buttonText"
                                          placeholder="Shop Now"
                                          value={promo.buttonText || ""}
                                          className="w-full bg-background"
                                          onChange={(e) =>
                                            handleButtonTextChange(
                                              index,
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>

                                      {/* Button Link */}
                                      <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                          Button Link
                                        </label>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button
                                              variant="outline"
                                              className="w-full justify-between"
                                            >
                                              {promo.buttonLink ===
                                                "#new-collection" &&
                                                "New Collection"}
                                              {promo.buttonLink ===
                                                "#best-seller" && "Best Seller"}
                                              {promo.buttonLink ===
                                                "#discount" && "Discount"}
                                              <ChevronDown className="ml-2 h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent>
                                            <DropdownMenuItem
                                              onSelect={() =>
                                                handleButtonLinkChange(
                                                  index,
                                                  "#new-collection"
                                                )
                                              }
                                            >
                                              New Collection
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onSelect={() =>
                                                handleButtonLinkChange(
                                                  index,
                                                  "#best-seller"
                                                )
                                              }
                                            >
                                              Best Seller
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onSelect={() =>
                                                handleButtonLinkChange(
                                                  index,
                                                  "#discount"
                                                )
                                              }
                                            >
                                              Discount
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {/* Delete button */}
                                {promoAttributes.slides.length <= 2 ? (
                                  <div className="flex justify-end mt-1">
                                    <div className="pr-2 text-[0.6rem] text-[#FFFFFF] focus:outline-none underline">
                                      .
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex justify-end mt-1">
                                    <button
                                      onClick={() => handleDeletePromo(index)}
                                      className="pr-2 text-[0.6rem] text-red-500 hover:text-red-700 focus:outline-none underline"
                                      title="Delete Promo"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
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

            {promoAttributes.template === "SplitPromo" &&
            promoAttributes.slides.length >= 2 ? null : (
              <button
                onClick={handleAddPromo}
                className="flex items-center justify-center gap-2 bg-gray-100 border border-gray-400 rounded-md w-full h-10"
              >
                <Plus size={18} />
                Add Promo
              </button>
            )}
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
          <PromoLayoutItems
            selectedLayout={
              [
                "CenteredPromo",
                "OverlayPromo",
                "MinimalRightPromo",
                "MinimalLeftPromo",
                "SplitPromo",
                "RightAlignedPromo",
                "LeftAlignedPromo",
              ].indexOf(promoAttributes.template) + 1
            }
            onLayoutSelect={handleLayoutSelection}
          />

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
                          promoAttributes.titleFont === "font-inter"
                            ? "Inter"
                            : promoAttributes.titleFont === "font-roboto"
                            ? "Roboto"
                            : promoAttributes.titleFont === "font-open-sans"
                            ? "Open Sans"
                            : promoAttributes.titleFont === "font-poppins"
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
                        updatePromoAttributes({ titleFont: "font-inter" })
                      }
                    >
                      Inter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ titleFont: "font-roboto" })
                      }
                    >
                      Roboto
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({
                          titleFont: "font-open-sans",
                        })
                      }
                    >
                      Open Sans
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ titleFont: "font-poppins" })
                      }
                    >
                      Poppins
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ titleFont: "font-lato" })
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
                    value={promoAttributes.titleColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      // Update header attributes
                      updatePromoAttributes({
                        titleColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={promoAttributes.titleColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      // Update header attributes
                      updatePromoAttributes({
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
                        {promoAttributes.titleSize === "text-sm"
                          ? "Small"
                          : promoAttributes.titleSize === "text-base"
                          ? "Meduim"
                          : promoAttributes.titleSize === "text-lg"
                          ? "Large"
                          : promoAttributes.titleSize === "text-xl"
                          ? "XL"
                          : promoAttributes.titleSize === "text-2xl"
                          ? "2XL"
                          : promoAttributes.titleSize === "text-3xl"
                          ? "3XL"
                          : "4XL"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ titleSize: "text-sm" })
                      }
                    >
                      Small
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ titleSize: "text-base" })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ titleSize: "text-lg" })
                      }
                    >
                      Large
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ titleSize: "text-xl" })
                      }
                    >
                      XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ titleSize: "text-2xl" })
                      }
                    >
                      2XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ titleSize: "text-3xl" })
                      }
                    >
                      3XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ titleSize: "text-4xl" })
                      }
                    >
                      4XL
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                          promoAttributes.descriptionFont === "font-inter"
                            ? "Inter"
                            : promoAttributes.descriptionFont === "font-roboto"
                            ? "Roboto"
                            : promoAttributes.descriptionFont ===
                              "font-open-sans"
                            ? "Open Sans"
                            : promoAttributes.descriptionFont === "font-poppins"
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
                        updatePromoAttributes({ descriptionFont: "font-inter" })
                      }
                    >
                      Inter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({
                          descriptionFont: "font-roboto",
                        })
                      }
                    >
                      Roboto
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({
                          descriptionFont: "font-open-sans",
                        })
                      }
                    >
                      Open Sans
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({
                          descriptionFont: "font-poppins",
                        })
                      }
                    >
                      Poppins
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ descriptionFont: "font-lato" })
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
                    value={promoAttributes.descriptionColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      // Update header attributes
                      updatePromoAttributes({
                        descriptionColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={promoAttributes.descriptionColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      // Update header attributes
                      updatePromoAttributes({
                        descriptionColor: `text-[${e.target.value}]`,
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
                        {promoAttributes.descriptionSize === "text-sm"
                          ? "Small"
                          : promoAttributes.descriptionSize === "text-base"
                          ? "Meduim"
                          : promoAttributes.descriptionSize === "text-lg"
                          ? "Large"
                          : promoAttributes.descriptionSize === "text-xl"
                          ? "XL"
                          : promoAttributes.descriptionSize === "text-2xl"
                          ? "2XL"
                          : promoAttributes.descriptionSize === "text-3xl"
                          ? "3XL"
                          : "4XL"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ descriptionSize: "text-sm" })
                      }
                    >
                      Small
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ descriptionSize: "text-base" })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ descriptionSize: "text-lg" })
                      }
                    >
                      Large
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ descriptionSize: "text-xl" })
                      }
                    >
                      XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ descriptionSize: "text-2xl" })
                      }
                    >
                      2XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ descriptionSize: "text-3xl" })
                      }
                    >
                      3XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ descriptionSize: "text-4xl" })
                      }
                    >
                      4XL
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                          promoAttributes.buttonFont === "font-inter"
                            ? "Inter"
                            : promoAttributes.buttonFont === "font-roboto"
                            ? "Roboto"
                            : promoAttributes.buttonFont === "font-open-sans"
                            ? "Open Sans"
                            : promoAttributes.buttonFont === "font-poppins"
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
                        updatePromoAttributes({ buttonFont: "font-inter" })
                      }
                    >
                      Inter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({
                          buttonFont: "font-roboto",
                        })
                      }
                    >
                      Roboto
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({
                          buttonFont: "font-open-sans",
                        })
                      }
                    >
                      Open Sans
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({
                          buttonFont: "font-poppins",
                        })
                      }
                    >
                      Poppins
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ buttonFont: "font-lato" })
                      }
                    >
                      Lato
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* text color */}
              <div className="space-y-2">
                <label className="block text-sm mb-2">Text Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={promoAttributes.buttonTextColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      // Update header attributes
                      updatePromoAttributes({
                        buttonTextColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={promoAttributes.buttonTextColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      // Update header attributes
                      updatePromoAttributes({
                        buttonTextColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                </div>
              </div>

              {/* Button Color Picker */}
              <div className="space-y-2">
                <label className="block text-sm mb-2">Button Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={promoAttributes.buttonColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      // Update header attributes
                      updatePromoAttributes({
                        buttonColor: `bg-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={promoAttributes.buttonColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      // Update header attributes
                      updatePromoAttributes({
                        buttonColor: `bg-[${e.target.value}]`,
                      });
                    }}
                  />
                </div>
              </div>

              {/* Font Size Input */}
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
                        {promoAttributes.buttonSize === "text-sm"
                          ? "Small"
                          : promoAttributes.buttonSize === "text-base"
                          ? "Meduim"
                          : promoAttributes.buttonSize === "text-lg"
                          ? "Large"
                          : promoAttributes.buttonSize === "text-xl"
                          ? "XL"
                          : promoAttributes.buttonSize === "text-2xl"
                          ? "2XL"
                          : promoAttributes.buttonSize === "text-3xl"
                          ? "3XL"
                          : "4XL"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ buttonSize: "text-sm" })
                      }
                    >
                      Small
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ buttonSize: "text-base" })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ buttonSize: "text-lg" })
                      }
                    >
                      Large
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ buttonSize: "text-xl" })
                      }
                    >
                      XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ buttonSize: "text-2xl" })
                      }
                    >
                      2XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ buttonSize: "text-3xl" })
                      }
                    >
                      3XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ buttonSize: "text-4xl" })
                      }
                    >
                      4XL
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Border Radius Input */}
              <div>
                <label className="block text-sm mb-2">Button Radius</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="hover:bg-gray-100 border-gray-300 w-full flex items-center justify-between"
                    >
                      <span className="ml-2">
                        {promoAttributes.buttonRadius === "rounded-none"
                          ? "None"
                          : promoAttributes.buttonRadius === "rounded-sm"
                          ? "Small"
                          : promoAttributes.buttonRadius === "rounded-md"
                          ? "Medium"
                          : promoAttributes.buttonRadius === "rounded-lg"
                          ? "Large"
                          : promoAttributes.buttonRadius === "rounded-xl"
                          ? "XL"
                          : promoAttributes.buttonRadius === "text-2xl"
                          ? "2XL"
                          : "3XL"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ buttonRadius: "rounded-none" })
                      }
                    >
                      None
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ buttonRadius: "rounded-sm" })
                      }
                    >
                      Small
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ buttonRadius: "rounded-md" })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ buttonRadius: "rounded-lg" })
                      }
                    >
                      Large
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ buttonRadius: "rounded-xl" })
                      }
                    >
                      XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ buttonRadius: "rounded-2xl" })
                      }
                    >
                      2XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ buttonRadius: "rounded-3xl" })
                      }
                    >
                      3XL
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                      size="lg"
                      className="hover:bg-gray-100 border-gray-300 w-full flex items-center justify-between"
                    >
                      <span className="ml-2">
                        {promoAttributes.imageObjectFit === "cover"
                          ? "Cover"
                          : promoAttributes.imageObjectFit === "fill"
                          ? "Fill"
                          : "Contain"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ imageObjectFit: "cover" })
                      }
                    >
                      Cover
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ imageObjectFit: "fill" })
                      }
                    >
                      Fill
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updatePromoAttributes({ imageObjectFit: "contain" })
                      }
                    >
                      Contain
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <label className="block text-sm mb-2">Background Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={promoAttributes.backgroundColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      // Update header attributes
                      updatePromoAttributes({
                        backgroundColor: `bg-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={promoAttributes.backgroundColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      // Update header attributes
                      updatePromoAttributes({
                        backgroundColor: `bg-[${e.target.value}]`,
                      });
                    }}
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
                  variant={promoAttributes.showArrows ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    updatePromoAttributes({
                      showArrows: !promoAttributes.showArrows,
                    })
                  }
                >
                  {promoAttributes.showArrows ? "Enabled" : "Disabled"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Autoplay</span>
                <Button
                  variant={promoAttributes.autoPlay ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    updatePromoAttributes({
                      autoPlay: !promoAttributes.autoPlay,
                    })
                  }
                >
                  {promoAttributes.autoPlay ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
