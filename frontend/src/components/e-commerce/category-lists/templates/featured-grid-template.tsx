/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface FeaturedGridCategoryTemplateProps {
  isClickable?: boolean;
  categories: any[];
  bgColor?: string;
  textColor?: string;
  overlayColor?: string;
  borderRadius?: string;
  showTitle?: boolean;
  showCardTitle?: boolean;
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
  showMoreButton?: boolean;
  showMoreText?: string;
  showMorebuttonBgColor?: string;
  showMorebuttonTextColor?: string;
  categoryTitleFontSize?: string;
}
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

export default function FeaturedGridCategoryTemplate({
  isClickable = true,
  categories,
  bgColor = "bg-white",
  textColor = "text-gray-800",
  overlayColor = "bg-black/30",
  borderRadius = "rounded-lg",
  showTitle = true,
  showCardTitle: showCategoryTitle = true,
  showCta = true,
  ctaText = "Shop Now",
  gap = "gap-6",
  fontFamily = "",
  hoverEffect = true,
  // Card related props
  cardVariant = "featured",
  showSubtitle = true,
  cornerRadius = "medium",
  cardShadow = "shadow-lg",
  accentColor = "bg-blue-600",
  borderColor = "border-gray-200",
  titleColor = "text-white",
  titleFontSize = "text-2xl",
  title = "Shop Our Collections",
  titleFont = "",
  showMoreButton = true,
  showMoreText = "Show More",
  showMorebuttonBgColor = "bg-slate-100",
  showMorebuttonTextColor = "text-gray-800",
  categoryTitleFontSize = "text-lg",
}: FeaturedGridCategoryTemplateProps) {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];

  // Get the first category as featured
  const featuredCategory = categories[0];
  const remainingCategories = categories.slice(1);

  if (!categories || categories.length === 0) {
    return null;
  }

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
              "text-4xl md:text-4xl font-bold text-center pb-4 mb-6",
            )}style={{
              color: titleColor.includes("[")? titleColor.split("-[")[1]?.slice(0, -1) || "#000000" : titleColor,
              fontSize: getFontSize(titleFontSize),
              fontFamily: getFontFamily(fontFamily),
            }}
          >
            {title}
          </h2>
        )}
        <div className={cn("grid grid-cols-1 md:grid-cols-3 w-full", gap)}>
          {/* Featured Category */}
          {featuredCategory && (
            <div className="md:col-span-2 md:row-span-2 group w-full">
              <div
                className={cn(
                  "relative h-96 md:h-full bg-slate-100 overflow-hidden w-full",
                  borderRadius
                )}
              >
                <Image
                  src={
                    featuredCategory.media?.mainMedia?.image?.url ||
                    "/placeholder.png?height=600&width=800"
                  }
                  alt={featuredCategory.name}
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
                    <h3
                      className="text-2xl font-bold flex items-center gap-2"
                      style={{ color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor, fontFamily: getFontFamily(fontFamily) }}
                    >
                      {featuredCategory.name}
                    </h3>
                    {/* Subtitle */}
                    {showSubtitle && featuredCategory.description && (
                      <p className="opacity-80 mt-1 text-base" style={{ color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor, fontFamily: getFontFamily(fontFamily) }}>{featuredCategory.description}</p>
                    )}
                    {showCta && <p className={cn(textColor, "mt-2")}>{ctaText}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Regular Categories */}
          {remainingCategories.map((category) => (
            <div className="group w-full" key={category.id || category._id}>
              <div
                className={cn(
                  "relative h-64 bg-slate-100 overflow-hidden w-full",
                  borderRadius
                )}
              >
                <Image
                  src={
                    category.media?.mainMedia?.image?.url ||
                    "/placeholder.png"
                  }
                  alt={category.name}
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
                    <h3
                      className="text-lg font-medium flex items-center gap-2"
                      style={{ color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor, fontFamily: getFontFamily(fontFamily) }}
                    >
                      {category.name}
                    </h3>
                    {/* Subtitle */}
                    {showSubtitle && category.description && (
                      <p className="opacity-80 text-sm mt-1" style={{ color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor, fontFamily: getFontFamily(fontFamily) }}>{category.description}</p>
                    )}
                    {showCta && (
                      <p className={cn(textColor, "text-sm mt-1")}style={{ color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor, fontFamily: getFontFamily(fontFamily) }}>{ctaText}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
  );
}
