/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import FlexibleCard from "@/components/e-commerce/card/card-templates";
import { usePathname } from "next/navigation";

interface GridCategoryTemplateProps {
  isClickable?: boolean;
  categories: any[];
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
  bgColor?: string;
  textColor?: string;
  borderRadius?: string;
  showTitle?: boolean;
  titlePosition?: "top" | "bottom" | "overlay";
  imageHeight?: string;
  fontFamily?: string;
  hoverEffect?: boolean;
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
  accentColor?: string;
  borderColor?: string;
  overlayColor?: string;
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

export function GridCategoryTemplate({
  isClickable = true,
  categories,
  columns = { sm: 1, md: 3, lg: 4, xl: 5 },
  gap = "gap-4",
  bgColor = "bg-white",
  textColor = "text-gray-800",
  borderRadius = "rounded-lg",
  showTitle = true,
  titlePosition = "bottom",
  imageHeight = "aspect-square",
  fontFamily = "",
  hoverEffect = true,
  cardVariant = "default",
  showCardTitle = true,
  showSubtitle = false,
  showCta = false,
  ctaText = "Shop Now",
  cornerRadius = "medium",
  cardShadow = "",
  accentColor = "bg-blue-600",
  borderColor = "border-gray-200",
  overlayColor = "bg-black/30",
  titleColor = "text-gray-800",
  titleFontSize = "text-2xl",
  title = "Shop by Category",
  titleFont = "font-bold",
  showMoreButton = true,
  showMoreText = "Show More",
  showMorebuttonBgColor = "bg-slate-100",
  showMorebuttonTextColor = "text-gray-800",
  categoryTitleFontSize = "text-lg",
}: GridCategoryTemplateProps) {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];

  // Generate dynamic grid classes based on columns prop
  const gridCols = cn(
    `grid-cols-${columns.sm || 2}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`
  );

  return (
    <div className={cn("w-full flex-shrink-0")}style={{backgroundColor: bgColor.includes("[")
            ? bgColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
            : bgColor,}}>
      <div
        className={cn(" mx-auto px-16 py-8 md:py-16")}
        style={{
        color: textColor.includes("[")? textColor.split("-[")[1]?.slice(0, -1) || "#000000" : textColor,
          fontFamily: getFontFamily(fontFamily),
        }}
      >
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
        <div className={cn("grid", gridCols, gap)}>
          {categories.map((category) => (
            <FlexibleCard
              isClickable={isClickable}
              key={category._id || category.id  }
              item={category}
              type="category"
              variant={cardVariant}
              imageRatio={
                imageHeight === "aspect-square"
                  ? "square"
                  : imageHeight === "aspect-[3/4]"
                  ? "portrait"
                  : "landscape"
              }
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
              linkPath={`/e-commerce/${subdomain}/products`}
            />
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
