/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import FlexibleCard from "@/components/e-commerce/card/card-templates";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface FeaturedGridProductTemplateProps {
  isClickable?: boolean;
  products: any[];
  bgColor?: string;
  textColor?: string;
  overlayColor?: string;
  borderRadius?: string;
  showTitle?: boolean;
  showProductTitle?: boolean;
  showCta?: boolean;
  ctaText?: string;
  gap?: string;
  fontFamily?: string;
  hoverEffect?: boolean;
  // Card related props
  cardVariant?: "default" | "minimal" | "hover" | "overlay" | "featured";
  showSubtitle?: boolean;
  cornerRadius?: "none" | "small" | "medium" | "large";
  cardShadow?: string;
  accentColor?: string;
  borderColor?: string;
  titleColor?: string;
  titleFontSize?: string;
  title?: string;
  titleFont?: string;
  // Show more button props
  showMoreButton?: boolean;
  showMoreText?: string;
  showMorebuttonBgColor?: string;
  showMorebuttonTextColor?: string;
  // Product specific props
  onAddToCart?: (product: any) => void;
  onAddToFavorite?: (product: any) => void;
  cardTextColor?: string;
}
const getFontSize = (fontSize: string) => {
  const sizeMap: Record<string, string> = {
    "text-xs": "0.75rem",
    "text-sm": "0.875rem",
    "text-base": "1rem",
    "text-lg": "1.125rem",
    "text-xl": "1.25rem",
    "text-2xl": "1.5rem",
    "text-3xl": "1.875rem",
    "text-4xl": "2.25rem",
    "text-5xl": "3rem",
    "text-6xl": "3.75rem",
  };
  return sizeMap[fontSize] || "1rem";
};
const getFontFamily = (fontFamily: string) => {
  switch (fontFamily) {
    case "font-inter":
      return "Inter, sans-serif";
    case "font-roboto":
      return "Roboto, sans-serif";
    case "font-open-sans":
      return "Open Sans, sans-serif";
    case "font-poppins":
      return "Poppins, sans-serif";
    case "font-lato":
      return "Lato, sans-serif";
    case "font-serif":
      return "serif";
    default:
      return "system-ui, sans-serif";
  }
};

// Helper to render out of stock badge
const OutOfStockBadge = (product: any) => {
  if (product.currentTotalStock === 0) {
    return (
      <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded-md align-middle">
        Out of Stock
      </span>
    );
  }
  return null;
};

export function FeaturedGridProductTemplate({
  isClickable = true,
  products,
  bgColor = "bg-white",
  textColor = "text-gray-800",
  overlayColor = "bg-black/30",
  borderRadius = "rounded-lg",
  showTitle = true,
  showProductTitle = true,
  showCta = false,
  ctaText = "Add to Cart",
  gap = "gap-4",
  fontFamily = "",
  hoverEffect = true,
  // Card related props
  cardVariant = "default",
  showSubtitle = false,
  cornerRadius = "medium",
  cardShadow = "",
  accentColor = "bg-blue-600",
  borderColor = "border-gray-200",
  titleColor,
  titleFontSize,
  title = "Featured Products",
  titleFont,
  // Show more button props
  showMoreButton = true,
  showMoreText = "Show More",
  showMorebuttonBgColor = "bg-slate-100",
  showMorebuttonTextColor = "text-gray-800",
  // Product specific props
  onAddToCart,
  onAddToFavorite,
  cardTextColor,
}: FeaturedGridProductTemplateProps) {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];

  // Split products into featured and regular
  const featuredProduct = products[0];
  const regularProducts = products.slice(1);

  return (
    <div
      className={cn("w-full flex-shrink-0")}
      style={{
        backgroundColor: bgColor.includes("[")
          ? bgColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
          : bgColor,
      }}
    >
      <div
        className={cn(" mx-auto px-16 py-8 md:py-16")}
        style={{
          color: textColor?.includes("[")
            ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
            : textColor,
          fontFamily: getFontFamily(fontFamily),
        }}
      >
        {showTitle && (
          <h2
            className={cn(
              "text-4xl md:text-4xl font-bold text-center pb-4 mb-6"
            )}
            style={{
              color: titleColor?.includes("[")
                ? titleColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
                : titleColor,
              fontSize: getFontSize(titleFontSize ?? ""),
              fontFamily: getFontFamily(fontFamily),
            }}
          >
            {title}
          </h2>
        )}

        <div className={cn("grid grid-cols-1 md:grid-cols-3 w-full", gap)}>
          {/* Featured Product */}
          {featuredProduct && (
            <div className="md:col-span-2 md:row-span-2 group w-full">
              <Link
                href={isClickable ? `/e-commerce/${subdomain}/product/${featuredProduct.id}` : "#"}
                className="block w-full h-full"
              >
                <div
                  className={cn(
                    "relative h-96 md:h-full bg-slate-100 overflow-hidden w-full",
                    borderRadius
                  )}
                >
                  <Image
                    src={
                      featuredProduct.images[0]?.url ||
                      "/placeholder.png?height=600&width=800"
                    }
                    alt={featuredProduct.images[0]?.alt || ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 66vw"
                    className={cn(
                      "object-cover",
                      hoverEffect &&
                        "transition-transform duration-500 group-hover:scale-105"
                    )}
                  />
                  <div
                    className={cn(
                      "absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent"
                    )}
                  >
                    <div className="p-6">
                      <h3 className={cn(cardTextColor, "text-2xl font-bold flex items-center gap-2")}>{featuredProduct.name}
                        {/* Discount badge */}
                        {(() => {
                          const originalPrice = featuredProduct.price;
                          let currentPrice = originalPrice;
                          let discountPercent = null;
                          if (featuredProduct.discountType && typeof featuredProduct.discountValue === 'number') {
                            if (featuredProduct.discountType === 'percentage') {
                              currentPrice = originalPrice - (originalPrice * featuredProduct.discountValue) / 100;
                              discountPercent = featuredProduct.discountValue;
                            } else if (featuredProduct.discountType === 'fixed amount') {
                              currentPrice = originalPrice - featuredProduct.discountValue;
                              discountPercent = Math.round((featuredProduct.discountValue / originalPrice) * 100);
                            }
                          }
                          const isDiscounted = currentPrice < originalPrice;
                          return isDiscounted && discountPercent ? (
                            <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 rounded-md align-middle">
                              {discountPercent}% OFF
                            </span>
                          ) : null;
                        })()}
                        {OutOfStockBadge(featuredProduct)}
                      </h3>
                      {/* Subtitle */}
                      {showSubtitle && featuredProduct.description && (
                        <p className={cn(cardTextColor, "opacity-80 mt-1 text-base")}>{featuredProduct.description}</p>
                      )}
                      {/* Price display */}
                      {(() => {
                        const originalPrice = featuredProduct.price;
                        let currentPrice = originalPrice;
                        if (featuredProduct.discountType && typeof featuredProduct.discountValue === 'number') {
                          if (featuredProduct.discountType === 'percentage') {
                            currentPrice = originalPrice - (originalPrice * featuredProduct.discountValue) / 100;
                          } else if (featuredProduct.discountType === 'fixed amount') {
                            currentPrice = originalPrice - featuredProduct.discountValue;
                          }
                        }
                        const isDiscounted = currentPrice < originalPrice;
                        return (
                          <>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={cn("font-semibold", cardTextColor)}>
                                ${currentPrice.toFixed(2)}
                              </span>
                              {isDiscounted && (
                                <span className="text-sm line-through text-gray-200">${originalPrice.toFixed(2)}</span>
                              )}
                            </div>
                          </>
                        );
                      })()}
                      {showCta && <p className={cn(cardTextColor, "mt-2")}>{ctaText}</p>}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Regular Products */}
          {regularProducts.map((product) => (
            <div className="group w-full" key={product.id}>
              <Link
                href={isClickable ? `/e-commerce/${subdomain}/product/${product.id}` : "#"}
                className="block w-full h-full"
              >
                <div
                  className={cn(
                    "relative h-64 bg-slate-100 overflow-hidden w-full",
                    borderRadius
                  )}
                >
                  <Image
                    src={
                      product.images[0]?.url ||
                      "/placeholder.png"
                    }
                    alt={product.images[0]?.alt || ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={cn(
                      "object-cover",
                      hoverEffect &&
                        "transition-transform duration-500 group-hover:scale-105"
                    )}
                  />
                  <div
                    className={cn(
                      "absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent"
                    )}
                  >
                    <div className="p-4">
                      <h3 className={cn(cardTextColor, "text-lg font-medium flex items-center gap-2")}>{product.name}
                        {/* Discount badge */}
                        {product.discountType && typeof product.discountValue === 'number' && (() => {
                          let currentPrice = product.price;
                          let discountPercent = null;
                          if (product.discountType === 'percentage') {
                            currentPrice = product.price - (product.price * product.discountValue) / 100;
                            discountPercent = product.discountValue;
                          } else if (product.discountType === 'fixed amount') {
                            currentPrice = product.price - product.discountValue;
                            discountPercent = Math.round((product.discountValue / product.price) * 100);
                          }
                          const isDiscounted = currentPrice < product.price;
                          return isDiscounted && discountPercent ? (
                            <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 rounded-md align-middle">
                              {discountPercent}% OFF
                            </span>
                          ) : null;
                        })()}
                        {OutOfStockBadge(product)}
                      </h3>
                      {/* Subtitle */}
                      {showSubtitle && product.description && (
                        <p className={cn(cardTextColor, "opacity-80 text-sm mt-1")}>{product.description}</p>
                      )}
                      {/* Price display */}
                      {(() => {
                        const originalPrice = product.price;
                        let currentPrice = originalPrice;
                        if (product.discountType && typeof product.discountValue === 'number') {
                          if (product.discountType === 'percentage') {
                            currentPrice = originalPrice - (originalPrice * product.discountValue) / 100;
                          } else if (product.discountType === 'fixed amount') {
                            currentPrice = originalPrice - product.discountValue;
                          }
                        }
                        const isDiscounted = currentPrice < originalPrice;
                        return (
                          <>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={cn("font-semibold", cardTextColor)}>
                                ${currentPrice.toFixed(2)}
                              </span>
                              {isDiscounted && (
                                <>
                                  <span className="text-xs line-through text-gray-200">${originalPrice.toFixed(2)}</span>
                                  <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 rounded-md align-middle">
                                    {product.discountType === 'percentage' ? product.discountValue : Math.round((product.discountValue / product.price) * 100)}% OFF
                                  </span>
                                </>
                              )}
                            </div>
                          </>
                        );
                      })()}
                      {showCta && (
                        <p className={cn(cardTextColor, "text-sm mt-1")}>{ctaText}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        {/* Show More Button */}
        {showMoreButton && (
          <div className="flex justify-end mt-6">
            <Link
              href={isClickable ? `/e-commerce/${subdomain}/products` : "#"}
              className={cn(
                "inline-flex items-center px-6 py-2",
                "hover:bg-opacity-80 transition-colors duration-300",
                "rounded-lg text-sm font-medium"
              )}
              style={{
                backgroundColor: showMorebuttonBgColor.includes("[")
                  ? showMorebuttonBgColor.split("-[")[1]?.slice(0, -1) ||
                    "#ffffff"
                  : showMorebuttonBgColor,
                color: showMorebuttonTextColor.includes("[")
                  ? showMorebuttonTextColor.split("-[")[1]?.slice(0, -1) ||
                    "#ffffff"
                  : showMorebuttonTextColor,
              }}
            >
              {showMoreText}
              <svg
                className="ml-2 w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
