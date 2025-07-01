"use client";
import { Input } from "@/components/SiteCraft/ui/input";
import { CategoryLayoutItems } from "./categoryLayoutItems";
import { CategoryCustomizationAttributes } from "@/lib/customization";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/SiteCraft/ui/dropdown-menu";
import { Button } from "../../ui/button";

type SectionName = "general" | "title" | "categoryCard";

interface RenderCategorySectionProps {
  detailedSectionTab: string;
  categoryAttributes: CategoryCustomizationAttributes;
  updateCategoryAttributes: (
    updates: Partial<CategoryCustomizationAttributes>
  ) => void;
  onDeleteSection?: () => void;
}

export function RenderCategorySection({
  detailedSectionTab,
  categoryAttributes,
  updateCategoryAttributes,
  onDeleteSection,
}: RenderCategorySectionProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<SectionName, boolean>
  >({
    general: false,
    title: false,
    categoryCard: false,
  });

  const toggleSection = (section: SectionName) => {
    setExpandedSections((prev) => {
      const isCurrentlyOpen = prev[section];

      if (isCurrentlyOpen) {
        return {
          general: false,
          title: false,
          categoryCard: false,
        };
      }

      return {
        general: false,
        title: false,
        categoryCard: false,
        [section]: true,
      };
    });
  };
  const handleTitleChange = (newTitle: string) => {
    updateCategoryAttributes({ title: newTitle });
  };

  // Handle layout selection and update template
  const handleLayoutSelection = (layoutId: number) => {
    const templateNames = [
      "Grid",
      "FeaturedGrid",
      "HorizontalScroll",
    ];
    const templateName = templateNames[layoutId - 1] || "Grid";
    updateCategoryAttributes({ template: templateName });
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
                value={categoryAttributes.title}
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
                Delete Section
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-6 flex-1 min-h-0 overflow-y-auto">
          <CategoryLayoutItems
            selectedLayout={
              [
                "grid-template",
                "list-view-template",
                "featured-grid-template",
                "horizontal-scroll-template",
              ].indexOf(categoryAttributes.template) + 1
            }
            onLayoutSelect={handleLayoutSelection}
          />

          {/* General */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleSection("general")}
            >
              <span className="font-medium">General</span>
              {expandedSections.general ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedSections.general && (
            <div className="space-y-4">
              {/* Background color */}
              <div className="space-y-2">
                <label className="block text-sm mb-2">Background Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={categoryAttributes.bgColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updateCategoryAttributes({
                        bgColor: `bg-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={categoryAttributes.bgColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updateCategoryAttributes({
                        bgColor: `bg-[${e.target.value}]`,
                      });
                    }}
                  />
                </div>
              </div>

              {/* show more button */}
              <div className="flex items-center justify-between">
                <span>Show More Button</span>
                <Button
                  variant={
                    categoryAttributes.showMoreButton ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    updateCategoryAttributes({
                      showMoreButton: !categoryAttributes.showMoreButton,
                    })
                  }
                >
                  {categoryAttributes.showMoreButton ? "Enabled" : "Disabled"}
                </Button>
              </div>

              {/* show more button text */}
              {categoryAttributes.showMoreButton && (
                <div>
                  <label className="block text-sm mb-2">Button Text</label>
                  <Input
                    value={categoryAttributes.showMoreText}
                    onChange={(e) =>
                      updateCategoryAttributes({
                        showMoreText: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              {/* show morebutton background color */}
              {categoryAttributes.showMoreButton && (
                <div className="space-y-2">
                  <label className="block text-sm mb-2">Button Color</label>
                  <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                    <input
                      type="color"
                      value={categoryAttributes.showMorebuttonBgColor
                        .split("-[")[1]
                        .slice(0, -1)}
                      className="w-8 h-8 cursor-pointer bg-transparent"
                      onChange={(e) => {
                        updateCategoryAttributes({
                          showMorebuttonBgColor: `bg-[${e.target.value}]`,
                        });
                      }}
                    />
                    <input
                      type="text"
                      value={categoryAttributes.showMorebuttonBgColor
                        .split("-[")[1]
                        .slice(0, -1)}
                      className="flex-1 border-none bg-transparent focus:outline-none"
                      onChange={(e) => {
                        updateCategoryAttributes({
                          showMorebuttonBgColor: `bg-[${e.target.value}]`,
                        });
                      }}
                    />
                  </div>
                </div>
              )}

              {/* show morebutton text color */}
              {categoryAttributes.showMoreButton && (
                <div className="space-y-2">
                  <label className="block text-sm mb-2">
                    Button Text Color
                  </label>
                  <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                    <input
                      type="color"
                      value={categoryAttributes.showMorebuttonTextColor
                        .split("-[")[1]
                        .slice(0, -1)}
                      className="w-8 h-8 cursor-pointer bg-transparent"
                      onChange={(e) => {
                        updateCategoryAttributes({
                          showMorebuttonTextColor: `text-[${e.target.value}]`,
                        });
                      }}
                    />
                    <input
                      type="text"
                      value={categoryAttributes.showMorebuttonTextColor
                        .split("-[")[1]
                        .slice(0, -1)}
                      className="flex-1 border-none bg-transparent focus:outline-none"
                      onChange={(e) => {
                        updateCategoryAttributes({
                          showMorebuttonTextColor: `text-[${e.target.value}]`,
                        });
                      }}
                    />
                  </div>
                </div>
              )}
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
                          categoryAttributes.titleFont === "font-inter"
                            ? "Inter"
                            : categoryAttributes.titleFont === "font-roboto"
                            ? "Roboto"
                            : categoryAttributes.titleFont === "font-open-sans"
                            ? "Open Sans"
                            : categoryAttributes.titleFont === "font-poppins"
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
                        updateCategoryAttributes({ titleFont: "font-inter" })
                      }
                    >
                      Inter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({ titleFont: "font-roboto" })
                      }
                    >
                      Roboto
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({
                          titleFont: "font-open-sans",
                        })
                      }
                    >
                      Open Sans
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({ titleFont: "font-poppins" })
                      }
                    >
                      Poppins
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({ titleFont: "font-lato" })
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
                    value={categoryAttributes.titleColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updateCategoryAttributes({
                        titleColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={categoryAttributes.titleColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updateCategoryAttributes({
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
                        {categoryAttributes.titleFontSize === "text-sm"
                          ? "Small"
                          : categoryAttributes.titleFontSize === "text-base"
                          ? "Medium"
                          : categoryAttributes.titleFontSize === "text-lg"
                          ? "Large"
                          : categoryAttributes.titleFontSize === "text-xl"
                          ? "XL"
                          : categoryAttributes.titleFontSize === "text-2xl"
                          ? "2XL"
                          : categoryAttributes.titleFontSize === "text-3xl"
                          ? "3XL"
                          : "4XL"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({ titleFontSize: "text-sm" })
                      }
                    >
                      Small
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({ titleFontSize: "text-base" })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({ titleFontSize: "text-lg" })
                      }
                    >
                      Large
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({ titleFontSize: "text-xl" })
                      }
                    >
                      XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({ titleFontSize: "text-2xl" })
                      }
                    >
                      2XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({ titleFontSize: "text-3xl" })
                      }
                    >
                      3XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({ titleFontSize: "text-4xl" })
                      }
                    >
                      4XL
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* show title */}
              <div className="flex items-center justify-between">
                <span>Show Title</span>
                <Button
                  variant={
                    categoryAttributes.showCategoryTitle ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    updateCategoryAttributes({
                      showCategoryTitle: !categoryAttributes.showCategoryTitle,
                    })
                  }
                >
                  {categoryAttributes.showCategoryTitle
                    ? "Enabled"
                    : "Disabled"}
                </Button>
              </div>
            </div>
          )}

          {/* Category Card */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleSection("categoryCard")}
            >
              <span className="font-medium">Category Card</span>
              {expandedSections.categoryCard ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedSections.categoryCard && (
            <div className="space-y-4">
              {/* Card Variant */}
              <div>
                <label className="block text-sm mb-2">Card Variant</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="lg"
                      className="hover:bg-gray-100 border-gray-300 w-full flex items-center justify-between"
                    >
                      <span className="ml-2">
                        {
                          categoryAttributes.cardVariant === "default"
                            ? "Default"
                            : categoryAttributes.cardVariant === "overlay"
                            ? "Overlay"
                            : categoryAttributes.cardVariant === "minimal"
                            ? "Minimal"
                            : categoryAttributes.cardVariant === "hover"
                            ? "Hover"
                            : "Featured" // default
                        }
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({ cardVariant: "default" })
                      }
                    >
                      Default
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({ cardVariant: "overlay" })
                      }
                    >
                      Overlay
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({
                          cardVariant: "minimal",
                        })
                      }
                    >
                      Minimal
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({ cardVariant: "hover" })
                      }
                    >
                      Hover
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({ cardVariant: "featured" })
                      }
                    >
                      Featured
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Category title font size */}
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
                        {categoryAttributes.categoryTitleFontSize === "text-sm"
                          ? "Small"
                          : categoryAttributes.categoryTitleFontSize ===
                            "text-base"
                          ? "Medium"
                          : categoryAttributes.categoryTitleFontSize ===
                            "text-lg"
                          ? "Large"
                          : categoryAttributes.categoryTitleFontSize ===
                            "text-xl"
                          ? "XL"
                          : categoryAttributes.categoryTitleFontSize ===
                            "text-2xl"
                          ? "2XL"
                          : categoryAttributes.categoryTitleFontSize ===
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
                        updateCategoryAttributes({
                          categoryTitleFontSize: "text-sm",
                        })
                      }
                    >
                      Small
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({
                          categoryTitleFontSize: "text-base",
                        })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({
                          categoryTitleFontSize: "text-lg",
                        })
                      }
                    >
                      Large
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({
                          categoryTitleFontSize: "text-xl",
                        })
                      }
                    >
                      XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({
                          categoryTitleFontSize: "text-2xl",
                        })
                      }
                    >
                      2XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({ titleFontSize: "text-3xl" })
                      }
                    >
                      3XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateCategoryAttributes({
                          categoryTitleFontSize: "text-4xl",
                        })
                      }
                    >
                      4XL
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/*Show Description */}
              <div className="flex items-center justify-between">
                <span>Category Description</span>
                <Button
                  variant={
                    categoryAttributes.showSubtitle ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    updateCategoryAttributes({
                      showSubtitle: !categoryAttributes.showSubtitle,
                    })
                  }
                >
                  {categoryAttributes.showSubtitle ? "Enabled" : "Disabled"}
                </Button>
              </div>

              {/*Show Title */}
              <div className="flex items-center justify-between">
                <span>Category Title</span>
                <Button
                  variant={
                    categoryAttributes.showCategoryTitle ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    updateCategoryAttributes({
                      showCategoryTitle: !categoryAttributes.showCategoryTitle,
                    })
                  }
                >
                  {categoryAttributes.showCategoryTitle
                    ? "Enabled"
                    : "Disabled"}
                </Button>
              </div>

              {/* Show cta*/}
              <div className="flex items-center justify-between">
                <span>Shop Now</span>
                <Button
                  variant={categoryAttributes.showCta ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    updateCategoryAttributes({
                      showCta: !categoryAttributes.showCta,
                    })
                  }
                >
                  {categoryAttributes.showCta ? "Enabled" : "Disabled"}
                </Button>
              </div>

              {/* Cta Text*/}
              {categoryAttributes.showCta && (
                <div>
                  <label className="block text-sm mb-2">Button Text</label>
                  <Input
                    value={categoryAttributes.ctaText}
                    onChange={(e) =>
                      updateCategoryAttributes({
                        ctaText: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
