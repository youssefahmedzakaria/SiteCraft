"use client";
import React, { useState } from "react";
import { Input } from "@/components/SiteCraft/ui/input";
import { ProductLayoutItems } from "./productLayoutItems";
import { ProductCustomizationAttributes } from "@/lib/customization";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/SiteCraft/ui/dropdown-menu";
import { Button } from "../../ui/button";

type SectionName = "general" | "title" | "productCard";

interface RenderProductSectionProps {
  detailedSectionTab: string;
  productAttributes: ProductCustomizationAttributes;
  updateProductAttributes: (
    updates: Partial<ProductCustomizationAttributes>
  ) => void;
  onDeleteSection?: () => void;
}

export function RenderProductSection({
  detailedSectionTab,
  productAttributes,
  updateProductAttributes,
  onDeleteSection,
}: RenderProductSectionProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<SectionName, boolean>
  >({
    general: false,
    title: false,
    productCard: false,
  });

  const toggleSection = (section: SectionName) => {
    setExpandedSections((prev) => {
      const isCurrentlyOpen = prev[section];

      if (isCurrentlyOpen) {
        return {
          general: false,
          title: false,
          productCard: false,
        };
      }

      return {
        general: false,
        title: false,
        productCard: false,
        [section]: true,
      };
    });
  };
  const handleTitleChange = (newTitle: string) => {
    updateProductAttributes({ title: newTitle });
  };

  // Handle layout selection and update template
  const handleLayoutSelection = (layoutId: number) => {
    const templateNames = ["Grid", "FeaturedGrid", "HorizontalScroll"];
    const templateName = templateNames[layoutId - 1] || "Grid";
    updateProductAttributes({
      template: templateName as "Grid" | "FeaturedGrid" | "HorizontalScroll",
    });
    updateProductAttributes({ cardVariant: "default" });
  };

  // Auto-switch to Grid if Featured Grid is selected but less than 3 products
  React.useEffect(() => {
    if (
      productAttributes.template === "FeaturedGrid" &&
      (productAttributes.products?.length || 0) < 3
    ) {
      updateProductAttributes({ template: "Grid" });
    }
  }, [
    productAttributes.products?.length,
    productAttributes.template,
    updateProductAttributes,
  ]);

  return (
    <div className="flex flex-col h-full w-full min-h-0">
      {detailedSectionTab === "content" ? (
        <div className="flex flex-col flex-1 min-h-0 p-4">
          {/* Title */}
          <div className="space-y-8 flex-1 min-h-0 overflow-y-auto">
            <div className="space-y-1">
              <h1 className="text-lg font-semibold tracking-tight">Title</h1>
              <Input
                value={productAttributes.title}
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
          <ProductLayoutItems
            selectedLayout={
              [
                "grid-template",
                "list-view-template",
                "featured-grid-template",
                "horizontal-scroll-template",
              ].indexOf(productAttributes.template) + 1
            }
            onLayoutSelect={handleLayoutSelection}
            itemCount={productAttributes.products?.length || 0}
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
                    value={productAttributes.bgColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updateProductAttributes({
                        bgColor: `bg-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={productAttributes.bgColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updateProductAttributes({
                        bgColor: `bg-[${e.target.value}]`,
                      });
                    }}
                  />
                </div>
              </div>

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
                          productAttributes.fontFamily === "font-inter"
                            ? "Inter"
                            : productAttributes.fontFamily === "font-roboto"
                            ? "Roboto"
                            : productAttributes.fontFamily === "font-open-sans"
                            ? "Open Sans"
                            : productAttributes.fontFamily === "font-poppins"
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
                        updateProductAttributes({ fontFamily: "font-inter" })
                      }
                    >
                      Inter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateProductAttributes({ fontFamily: "font-roboto" })
                      }
                    >
                      Roboto
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateProductAttributes({
                          fontFamily: "font-open-sans",
                        })
                      }
                    >
                      Open Sans
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateProductAttributes({ fontFamily: "font-poppins" })
                      }
                    >
                      Poppins
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateProductAttributes({ fontFamily: "font-lato" })
                      }
                    >
                      Lato
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* show more button */}
              <div className="flex items-center justify-between">
                <span>Show More Button</span>
                <Button
                  variant={
                    productAttributes.showMoreButton ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    updateProductAttributes({
                      showMoreButton: !productAttributes.showMoreButton,
                    })
                  }
                >
                  {productAttributes.showMoreButton ? "Enabled" : "Disabled"}
                </Button>
              </div>

              {/* show more button text */}
              {productAttributes.showMoreButton && (
                <div>
                  <label className="block text-sm mb-2">Button Text</label>
                  <Input
                    value={productAttributes.showMoreText}
                    onChange={(e) =>
                      updateProductAttributes({
                        showMoreText: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              {/* show morebutton background color */}
              {productAttributes.showMoreButton && (
                <div className="space-y-2">
                  <label className="block text-sm mb-2">Button Color</label>
                  <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                    <input
                      type="color"
                      value={productAttributes.showMorebuttonBgColor
                        .split("-[")[1]
                        .slice(0, -1)}
                      className="w-8 h-8 cursor-pointer bg-transparent"
                      onChange={(e) => {
                        updateProductAttributes({
                          showMorebuttonBgColor: `bg-[${e.target.value}]`,
                        });
                      }}
                    />
                    <input
                      type="text"
                      value={productAttributes.showMorebuttonBgColor
                        .split("-[")[1]
                        .slice(0, -1)}
                      className="flex-1 border-none bg-transparent focus:outline-none"
                      onChange={(e) => {
                        updateProductAttributes({
                          showMorebuttonBgColor: `bg-[${e.target.value}]`,
                        });
                      }}
                    />
                  </div>
                </div>
              )}

              {/* show morebutton text color */}
              {productAttributes.showMoreButton && (
                <div className="space-y-2">
                  <label className="block text-sm mb-2">
                    Button Text Color
                  </label>
                  <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                    <input
                      type="color"
                      value={productAttributes.showMorebuttonTextColor
                        .split("-[")[1]
                        .slice(0, -1)}
                      className="w-8 h-8 cursor-pointer bg-transparent"
                      onChange={(e) => {
                        updateProductAttributes({
                          showMorebuttonTextColor: `text-[${e.target.value}]`,
                        });
                      }}
                    />
                    <input
                      type="text"
                      value={productAttributes.showMorebuttonTextColor
                        .split("-[")[1]
                        .slice(0, -1)}
                      className="flex-1 border-none bg-transparent focus:outline-none"
                      onChange={(e) => {
                        updateProductAttributes({
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
              {/* color */}
              <div className="space-y-2">
                <label className="block text-sm mb-2">Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={productAttributes.titleColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updateProductAttributes({
                        titleColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={productAttributes.titleColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updateProductAttributes({
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
                        {productAttributes.titleFontSize === "text-sm"
                          ? "Small"
                          : productAttributes.titleFontSize === "text-base"
                          ? "Medium"
                          : productAttributes.titleFontSize === "text-lg"
                          ? "Large"
                          : productAttributes.titleFontSize === "text-xl"
                          ? "XL"
                          : productAttributes.titleFontSize === "text-2xl"
                          ? "2XL"
                          : productAttributes.titleFontSize === "text-3xl"
                          ? "3XL"
                          : "4XL"}
                      </span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        updateProductAttributes({ titleFontSize: "text-sm" })
                      }
                    >
                      Small
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateProductAttributes({ titleFontSize: "text-base" })
                      }
                    >
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateProductAttributes({ titleFontSize: "text-lg" })
                      }
                    >
                      Large
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateProductAttributes({ titleFontSize: "text-xl" })
                      }
                    >
                      XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateProductAttributes({ titleFontSize: "text-2xl" })
                      }
                    >
                      2XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateProductAttributes({ titleFontSize: "text-3xl" })
                      }
                    >
                      3XL
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        updateProductAttributes({ titleFontSize: "text-4xl" })
                      }
                    >
                      4XL
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}

          {/* Category Card */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleSection("productCard")}
            >
              <span className="font-medium">Category Card</span>
              {expandedSections.productCard ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          </div>
          {expandedSections.productCard && (
            <div className="space-y-4">
              {/* Card Variant */}
              {productAttributes.template != "FeaturedGrid" && (
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
                            productAttributes.cardVariant === "default"
                              ? "Default"
                              : productAttributes.cardVariant === "overlay"
                              ? "Overlay"
                              : productAttributes.cardVariant === "minimal"
                              ? "Minimal"
                              : productAttributes.cardVariant === "hover"
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
                          updateProductAttributes({ cardVariant: "default" })
                        }
                      >
                        Default
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateProductAttributes({ cardVariant: "overlay" })
                        }
                      >
                        Overlay
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateProductAttributes({
                            cardVariant: "minimal",
                          })
                        }
                      >
                        Minimal
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateProductAttributes({ cardVariant: "hover" })
                        }
                      >
                        Hover
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateProductAttributes({ cardVariant: "featured" })
                        }
                      >
                        Featured
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/*Show Description */}
              {productAttributes.template != "FeaturedGrid" &&
                productAttributes.cardVariant !== "overlay" &&
                productAttributes.cardVariant !== "minimal" &&
                productAttributes.cardVariant !== "featured" && (
                  <div className="flex items-center justify-between">
                    <span>Category Description</span>
                    <Button
                      variant={
                        productAttributes.showSubtitle ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        updateProductAttributes({
                          showSubtitle: !productAttributes.showSubtitle,
                        })
                      }
                    >
                      {productAttributes.showSubtitle ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                )}

              {/*Card Radius*/}
              {productAttributes.template != "FeaturedGrid" && (
                <div>
                  <label className="block text-sm mb-2">Card Radius</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="lg"
                        className="hover:bg-gray-100 border-gray-300 w-full flex items-center justify-between"
                      >
                        <span className="ml-2">
                          {productAttributes.cornerRadius === "none"
                            ? "None"
                            : productAttributes.cornerRadius === "small"
                            ? "Small"
                            : productAttributes.cornerRadius === "medium"
                            ? "Medium"
                            : "Large"}
                        </span>
                        <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() =>
                          updateProductAttributes({ cornerRadius: "none" })
                        }
                      >
                        None
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateProductAttributes({ cornerRadius: "small" })
                        }
                      >
                        Small
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateProductAttributes({ cornerRadius: "medium" })
                        }
                      >
                        Medium
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateProductAttributes({ cornerRadius: "large" })
                        }
                      >
                        Large
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/*Text Color*/}
              <div className="space-y-2">
                <label className="block text-sm mb-2">Text Color</label>
                <div className="flex items-center gap-2 rounded w-full border border-gray-200 p-1">
                  <input
                    type="color"
                    value={productAttributes.textColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="w-8 h-8 cursor-pointer bg-transparent"
                    onChange={(e) => {
                      updateProductAttributes({
                        textColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                  <input
                    type="text"
                    value={productAttributes.textColor
                      .split("-[")[1]
                      .slice(0, -1)}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      updateProductAttributes({
                        textColor: `text-[${e.target.value}]`,
                      });
                    }}
                  />
                </div>
              </div>

              {/* Show cta*/}
              {productAttributes.cardVariant !== "minimal" &&
                productAttributes.cardVariant !== "hover" && (
                  <div className="flex items-center justify-between">
                    <span>Shop Now</span>
                    <Button
                      variant={
                        productAttributes.showCta ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        updateProductAttributes({
                          showCta: !productAttributes.showCta,
                        })
                      }
                    >
                      {productAttributes.showCta ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                )}

              {/* Cta Text*/}
              {productAttributes.showCta &&
                productAttributes.cardVariant !== "minimal" &&
                productAttributes.cardVariant !== "hover" && (
                  <div>
                    <label className="block text-sm mb-2">Button Text</label>
                    <Input
                      value={productAttributes.ctaText}
                      onChange={(e) =>
                        updateProductAttributes({
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
