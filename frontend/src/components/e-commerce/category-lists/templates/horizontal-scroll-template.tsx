/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import FlexibleCard from "@/components/e-commerce/card/card-templates"
import { usePathname, useRouter } from "next/navigation"

interface HorizontalScrollCategoryTemplateProps {
  isClickable?: boolean
  categories: any[]
  bgColor?: string
  textColor?: string
  accentColor?: string
  borderRadius?: string
  showTitle?: boolean
  showControls?: boolean
  imageHeight?: string
  cardWidth?: string
  fontFamily?: string
  hoverEffect?: boolean
  scrollBarSliderColor?: string
  scrollBarBgColor?: string
  showScrollbar?: boolean
  // Card related props
  cardVariant?: "default" | "minimal" | "hover" | "overlay" | "featured"
  showCardTitle?: boolean
  showSubtitle?: boolean
  showCta?: boolean
  ctaText?: string
  cornerRadius?: "none" | "small" | "medium" | "large"
  cardShadow?: string
  borderColor?: string
  overlayColor?: string
  titleColor?: string
  titleFontSize?: string
  title?: string
  titleFont?: string
  showMoreButton?: boolean
  showMoreText?: string
  showMorebuttonBgColor?: string
  showMorebuttonTextColor?: string
  categoryTitleFontSize?: string
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
export function HorizontalScrollCategoryTemplate({
  isClickable = true,
  categories,
  bgColor = "bg-white",
  textColor = "text-gray-800",
  accentColor = "bg-slate-100",
  borderRadius = "rounded-lg",
  showTitle = true,
  showControls = false,
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
  ctaText = "Shop Now",
  cornerRadius = "medium",
  cardShadow = "",
  borderColor = "border-gray-200",
  overlayColor = "bg-black/30",
  titleColor = "text-gray-800",
  titleFontSize = "text-2xl",
  title = "Shop by Category",
  titleFont = "font-bold",
  // Show more button props
  showMoreButton = true,
  showMoreText = "Show More",
  showMorebuttonBgColor = "bg-slate-100",
  showMorebuttonTextColor = "text-gray-800",
  categoryTitleFontSize = "text-lg",
}: HorizontalScrollCategoryTemplateProps) {
  const path = usePathname()
  const pathSegments = path.split("/")
  const subdomain = pathSegments[2]
  const router = useRouter()

  const scrollRef = useRef<HTMLDivElement>(null)
  const [scroll, setScroll] = useState({ left: 0, width: 0, scrollWidth: 0 })

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setScroll({
          left: scrollRef.current.scrollLeft,
          width: scrollRef.current.clientWidth,
          scrollWidth: scrollRef.current.scrollWidth,
        })
      }
    }
    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener("scroll", handleScroll)
      handleScroll()
    }
    return () => {
      if (ref) ref.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollBy = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
    }
  }

  const handleCategoryClick = (categoryName: string) => {
    if (isClickable && subdomain) {
      const url = `/e-commerce/${subdomain}/products?category=${encodeURIComponent(categoryName)}`;
      router.push(url);
    }
  };

  // Convert image height to proper ratio
  const imageRatio = imageHeight.includes("h-") ? "portrait" : "square"

  return (
    <div className={cn("w-full flex-shrink-0")}style={{backgroundColor: bgColor.includes("[")
            ? bgColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
            : bgColor,}}>
      <div className={cn("mx-auto px-16 py-8 md:py-16")}style={{
        color: textColor.includes("[")? textColor.split("-[")[1]?.slice(0, -1) || "#000000" : textColor,
          fontFamily: getFontFamily(fontFamily),
        }}>
        {showTitle && (
                  <h2
                    className={cn(
                      "text-4xl md:text-6xl font-bold text-center mb-6"
                    )}style={{
                      color: titleColor.includes("[")? titleColor.split("-[")[1]?.slice(0, -1) || "#000000" : titleColor,
                      fontSize: getFontSize(titleFontSize),
                      fontFamily: getFontFamily(fontFamily),
                    }}
                  >
                    {title}
                  </h2>
                )}
        {/* Overlay Arrows */}
        {showControls && (
          <>
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 shadow-md"
              style={{ display: scroll.left > 0 ? "block" : "none" }}
              onClick={() => scrollBy(-300)}
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 shadow-md"
              style={{
                display: scroll.left + scroll.width < scroll.scrollWidth ? "block" : "none",
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
            scrollbarWidth: showScrollbar ? "auto" : "none",
            msOverflowStyle: showScrollbar ? "auto" : "none",
          }}
        >
          <div className={cn("flex gap-4 pb-4")}>
            {categories.map((category) => (
              <div key={category._id || category.id} className={cn("flex-shrink-0", cardWidth)}>
                <div
                  className="cursor-pointer"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <FlexibleCard
                    isClickable={false}
                    item={category}
                    type="category"
                    variant={cardVariant}
                    imageRatio={imageRatio}
                    cornerRadius={cornerRadius}
                    showTitle={showCardTitle}
                    showSubtitle={showSubtitle}
                    showCta={showCta}
                    ctaText={ctaText}
                    bgColor={bgColor}
                    textColor={textColor}
                    accentColor={accentColor}
                    borderColor={borderColor}
                    overlayColor={overlayColor}
                    fontFamily={fontFamily}
                    cardShadow={cardShadow}
                    hoverEffect={hoverEffect}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Custom minimal scrollbar */}
        {showScrollbar && (
          <div className={`w-full h-1 mt-2 ${scrollBarBgColor} overflow-hidden`}>
            <div
              className={`h-full ${scrollBarSliderColor} transition-all`}
              style={{
                width: scroll.scrollWidth > 0 ? `${(scroll.width / scroll.scrollWidth) * 100}%` : "0%",
                marginLeft: scroll.scrollWidth > 0 ? `${(scroll.left / scroll.scrollWidth) * 100}%` : "0%",
              }}
            />
          </div>
        )}

        {/* Show More Button */}
        {showMoreButton && (
          <div className="flex justify-end mt-6">
            <Link
              href={isClickable ? `/e-commerce/${subdomain}/categories` : "#"}
              className={cn(
                "inline-flex items-center px-6 py-2",
                "hover:bg-opacity-80 transition-colors duration-300",
                "rounded-lg text-sm font-medium"
              )}style={{
                backgroundColor: showMorebuttonBgColor.includes("[")
                  ? showMorebuttonBgColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
                  : showMorebuttonBgColor,
                color: showMorebuttonTextColor.includes("[")
                  ? showMorebuttonTextColor.split("-[")[1]?.slice(0, -1) || "#000000"
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
  )
}
