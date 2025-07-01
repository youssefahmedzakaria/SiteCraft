/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import FlexibleCard from "../../card/card-templates";

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
  showSubtitle = false,
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
    <div className={cn("w-full", bgColor)}>
      <div className={cn("mx-auto px-16 py-8 md:py-16", textColor, fontFamily)}>
        {showTitle && (
          <h2
            className={cn(
              "text-4xl md:text-4xl font-bold text-center mb-6",
              titleColor,
              titleFontSize,
              titleFont
            )}
          >
            {title}
          </h2>
        )}

        <div
          className={cn("grid grid-cols-1 md:grid-cols-3 w-full h-full", gap)}
        >
          {/* Featured large category using FlexibleCard */}
          {featuredCategory && (
            <div className="md:col-span-2 md:row-span-2 w-full h-full">
              <FlexibleCard
                isClickable={isClickable}
                item={featuredCategory}
                type="category"
                variant={cardVariant}
                imageRatio="landscape"
                cornerRadius={cornerRadius}
                showTitle={showCategoryTitle}
                showSubtitle={showSubtitle}
                showDescription={showSubtitle}
                showCta={showCta}
                ctaText={ctaText}
                bgColor={bgColor}
                textColor={textColor}
                titleColor={titleColor}
                titleFontSize={titleFontSize}
                titleFont={titleFont}
                accentColor={accentColor}
                borderColor={borderColor}
                overlayColor={overlayColor}
                fontFamily={fontFamily}
                cardShadow={cardShadow}
                hoverEffect={hoverEffect}
                linkPath={
                  isClickable ? `/e-commerce/${subdomain}/products` : undefined
                }
                className="w-full h-96 md:h-full"
                imageClassName="w-full h-96 md:h-full"
              />
            </div>
          )}

          {/* Remaining categories using FlexibleCard */}
          {remainingCategories.map((category) => (
            <div key={category.id || category._id} className="w-full h-full">
              <FlexibleCard
                isClickable={isClickable}
                item={category}
                type="category"
                variant={cardVariant}
                imageRatio="square"
                cornerRadius={cornerRadius}
                showTitle={showCategoryTitle}
                showSubtitle={showSubtitle}
                showDescription={showSubtitle}
                showCta={showCta}
                ctaText={ctaText}
                bgColor={bgColor}
                textColor={textColor}
                titleColor={titleColor}
                titleFontSize="text-lg"
                titleFont={titleFont}
                accentColor={accentColor}
                borderColor={borderColor}
                overlayColor={overlayColor}
                fontFamily={fontFamily}
                cardShadow={cardShadow}
                hoverEffect={hoverEffect}
                linkPath={
                  isClickable ? `/e-commerce/${subdomain}/products` : undefined
                }
                className="w-full h-64"
                imageClassName="w-full h-64"
              />
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {showMoreButton && (
          <div className="flex justify-end mt-10">
            <Link
              href={isClickable ? `/e-commerce/${subdomain}/categories` : "#"}
              className={cn(
                "inline-flex items-center px-6 py-2",
                "hover:bg-opacity-80 transition-colors duration-300",
                "rounded-lg text-sm font-medium",
                showMorebuttonBgColor,
                showMorebuttonTextColor
              )}
            >
              {showMoreText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
