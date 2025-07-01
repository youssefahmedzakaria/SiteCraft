/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import FlexibleCard from "@/components/e-commerce/card/card-templates";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
interface ListViewCategoryTemplateProps {
  categories: any[];
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  borderColor?: string;
  borderRadius?: string;
  showTitle?: boolean;
  showDescription?: boolean;
  showIcon?: boolean;
  gap?: string;
  fontFamily?: string;
  hoverEffect?: boolean;
  // Card related props
  cardVariant?:
    | "default"
    | "compact"
    | "detailed"
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
  overlayColor?: string;
  titleColor?: string;
  titleFontSize?: string;
  title?: string;
  titleFont?: string;
  imageFit?: "cover" | "contain" | "fill";
  showMoreButton?: boolean;
  showMoreText?: string;
  showMorebuttonBgColor?: string;
  showMorebuttonTextColor?: string;
}

export function ListViewCategoryTemplate({
  categories,
  bgColor = "bg-white",
  textColor = "text-gray-800",
  accentColor = "text-gray-400",
  borderColor = "border-gray-200",
  borderRadius = "rounded-lg",
  showTitle = true,
  showDescription = true,
  showIcon = true,
  gap = "space-y-4",
  fontFamily = "",
  hoverEffect = true,
  // Card related props - using these for custom look or falling back to standard list view
  cardVariant = "default",
  showCardTitle = true,
  showSubtitle = false,
  showCta = false,
  ctaText = "Shop Now",
  cornerRadius = "medium",
  cardShadow = "",
  overlayColor = "bg-black/30",
  titleColor = "text-gray-800",
  titleFontSize = "text-2xl",
  title = "Browse Categories",
  titleFont = "font-bold",
  imageFit = "cover",
  showMoreButton = true,
  showMoreText = "Show More",
  showMorebuttonBgColor = "bg-slate-100",
  showMorebuttonTextColor = "text-gray-800",
}: ListViewCategoryTemplateProps) {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];
  
  // Generate accent color for icon
  const iconColorClass = accentColor.startsWith("text-")
    ? accentColor
    : "text-gray-400";

  // If cardVariant is set to anything other than default, we'll use the FlexibleCard component
  const useCardComponent = cardVariant !== "default";

  if (useCardComponent) {
    return (
      <div
        className={cn(
          "w-full mx-auto px-4 py-8",
          bgColor,
          textColor,
          fontFamily
        )}
      >
        {showTitle && (
          <h2
            className={cn(
              "text-2xl font-bold mb-6",
              titleColor,
              titleFontSize,
              titleFont
            )}
          >
            {title}
          </h2>
        )}

        <div className={gap}>
          {categories.map((category) => (
            <FlexibleCard
              key={category._id}
              item={category}
              type="category"
              variant={cardVariant}
              imageRatio="landscape"
              cornerRadius={cornerRadius}
              showTitle={showCardTitle}
              showSubtitle={showSubtitle || showDescription}
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
      </div>
    );
  }

  // Standard list view implementation
  return (
    <div className={cn(" mx-auto px-16 py-8 md:py-16", textColor, fontFamily)}>
      {showTitle && (
        <h2
          className={cn(
            "text-4xl md:text-4xl font-bold text-center pb-4 mb-6",
            titleColor,
            titleFontSize,
            titleFont
          )}
        >
          {title}
        </h2>
      )}
      <div className={gap}>
        {categories.map((category) => (
          <Link
            href={`/e-commerce/${subdomain}/products`}
            className={cn(
              "flex items-center gap-4 p-4 border",
              borderColor,
              borderRadius,
              hoverEffect && "hover:bg-slate-50 transition-colors"
            )}
            key={category._id}
          >
            <div className="relative w-16 h-16 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={
                  category.media?.mainMedia?.image?.url ||
                  "/placeholder.svg?height=64&width=64"
                }
                alt={category.name}
                fill
                sizes="64px"
                className={cn("object-cover", imageFit)}
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-medium">{category.name}</h3>
              {showDescription && (
                <p className="text-sm text-gray-500">Browse products</p>
              )}
            </div>
            {showIcon && (
              <ArrowRight className={cn("w-5 h-5", iconColorClass)} />
            )}
          </Link>
        ))}
      </div>
      {/* Show More Button */}
      {showMoreButton && categories.length > 0 && (
        <div className="flex justify-end mt-6">
          <Link
            href={`/e-commerce/${subdomain}/categories`}
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
  );
}
