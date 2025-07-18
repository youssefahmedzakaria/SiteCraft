/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import FlexibleCard from "@/components/e-commerce/card/card-templates";
import { usePathname } from "next/navigation";

interface HorizontalScrollProductTemplateProps {
  isClickable?: boolean;
  products: any[];
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  borderRadius?: string;
  showTitle?: boolean;
  showControls?: boolean;
  imageHeight?: string;
  cardWidth?: string;
  fontFamily?: string;
  hoverEffect?: boolean;
  scrollBarSliderColor?: string;
  scrollBarBgColor?: string;
  showScrollbar?: boolean;
  // Card related props
  cardVariant?:
    | "default"
    | "minimal"
    | "hover"
    | "overlay"
    | "featured";
  showCardTitle?: boolean;
  showSubtitle?: boolean;
  showCta?: boolean;
  ctaText?: string;
  cornerRadius?: "none" | "small" | "medium" | "large";
  cardShadow?: string;
  borderColor?: string;
  overlayColor?: string;
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
  }};

export function HorizontalScrollProductTemplate({
  isClickable,
  products,
  bgColor = "bg-white",
  textColor = "text-gray-800",
  accentColor = "bg-blue-600",
  borderRadius = "rounded-lg",
  showTitle = true,
  showControls = true,
  imageHeight = "h-80",
  cardWidth = "w-60",
  fontFamily = "",
  hoverEffect = true,
  scrollBarSliderColor = "bg-gray-300",
  scrollBarBgColor = "bg-gray-200",
  showScrollbar = true,
  // Card related props
  cardVariant = "default",
  showCardTitle = true,
  showSubtitle = false,
  showCta = false,
  ctaText = "Add to Cart",
  cornerRadius = "medium",
  cardShadow = "",
  borderColor = "border-gray-200",
  overlayColor = "bg-black/30",
  titleColor,
  titleFontSize,
  title = "Featured Products",
  titleFont,
  // Show more button props
  showMoreButton = true,
  showMoreText = "Show More",
  showMorebuttonBgColor = "bg-slate-100 hover:bg-slate-200",
  showMorebuttonTextColor = "text-gray-800",
  // Product specific props
  onAddToCart,
  onAddToFavorite,
}: HorizontalScrollProductTemplateProps) {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState({ left: 0, width: 0, scrollWidth: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setScroll({
          left: scrollRef.current.scrollLeft,
          width: scrollRef.current.clientWidth,
          scrollWidth: scrollRef.current.scrollWidth,
        });
      }
    };
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => {
      if (ref) ref.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollBy = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className={cn("w-full flex-shrink-0",)}
    style={{backgroundColor: bgColor.includes("[")
            ? bgColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
            : bgColor,}}>
      <div
        className={cn(" mx-auto px-16 py-8 md:py-16",)}
         style={{color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor,
         fontFamily: getFontFamily(fontFamily),          
        }}
      >
        {showTitle && (
          <div className="flex items-center mb-6 justify-center">
            <h2
              className={cn(
                "text-4xl md:text-6xl font-bold text-center",
              )}
              style={{
                color: titleColor?.includes("[")
                  ? titleColor.split("-[")[1]?.slice(0, -1) || "#000000"
                  : titleColor,
                fontSize: getFontSize(titleFontSize ?? ""),
                fontFamily: getFontFamily(fontFamily),
              }}
            >
              {title}
            </h2>
          </div>
        )}
        <div className="relative">
          {/* Overlay Arrows */}
          {showControls && (
            <>
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-black rounded-full p-2 shadow-md"
                style={{ display: scroll.left > 0 ? "block" : "none" }}
                onClick={() => scrollBy(-300)}
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-black rounded-full p-2 shadow-md"
                style={{
                  display:
                    scroll.left + scroll.width < scroll.scrollWidth
                      ? "block"
                      : "none",
                }}
                onClick={() => scrollBy(300)}
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          <div
            ref={scrollRef}
            className="overflow-x-auto"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style jsx>{`
              div[ref]::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="flex gap-4 md:gap-6 pb-4">
              {products.map((product) => (
                <div
                  key={product._id || product.id}
                  className={cn("flex-shrink-0", cardWidth)}
                >
                  <FlexibleCard
                    isClickable={isClickable}
                    item={product}
                    type="product"
                    variant={cardVariant}
                    imageRatio={
                      imageHeight.includes("h-") ? "portrait" : "square"
                    }
                    cornerRadius={cornerRadius}
                    showTitle={showCardTitle}
                    showSubtitle={showSubtitle}
                    showCta={showCta}
                    ctaText={ctaText}
                    bgColor="bg-transparent"
                    textColor={textColor}
                    accentColor={accentColor}
                    borderColor={borderColor}
                    overlayColor={overlayColor}
                    fontFamily={fontFamily}
                    cardShadow={cardShadow}
                    hoverEffect={hoverEffect}
                    onAddToCart={
                      onAddToCart ? () => onAddToCart(product) : undefined
                    }
                    onAddToFavorite={
                      onAddToFavorite
                        ? () => onAddToFavorite(product)
                        : undefined
                    }
                    linkPath={`/e-commerce/${subdomain}/product/${product.id}`}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Custom minimal scrollbar */}
          {showScrollbar && (
            <div
              className={`w-full h-1 mt-2 ${scrollBarBgColor} overflow-hidden`}
            >
              <div
                className={`h-full ${scrollBarSliderColor} transition-all`}
                style={{
                  width:
                    scroll.scrollWidth > 0
                      ? `${(scroll.width / scroll.scrollWidth) * 100}%`
                      : "0%",
                  marginLeft:
                    scroll.scrollWidth > 0
                      ? `${(scroll.left / scroll.scrollWidth) * 100}%`
                      : "0%",
                }}
              />
            </div>
          )}
        </div>
        {/* Show More Button */}
        {showMoreButton && (
          <div className="flex justify-end mt-6">
            <Link
              href={isClickable ? `/e-commerce/${subdomain}/products` : "#"}
              className={cn(
                "inline-flex items-center px-6 py-2",
                "hover:bg-opacity-80 transition-colors duration-300",
                "rounded-lg text-sm font-medium",
              )}
              style={{
                backgroundColor: showMorebuttonBgColor.includes("[")
                  ? showMorebuttonBgColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
                  : showMorebuttonBgColor,
                color: showMorebuttonTextColor.includes("[")
                  ? showMorebuttonTextColor.split("-[")[1]?.slice(0, -1) || "#000000"
                  : showMorebuttonTextColor,
              }}
            >
              {showMoreText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
