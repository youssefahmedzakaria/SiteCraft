/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import FlexibleCard from "@/components/e-commerce/card/card-templates"
interface FeaturedGridCategoryTemplateProps {
  categories: any[]
  bgColor?: string
  textColor?: string
  overlayColor?: string
  borderRadius?: string
  showTitle?: boolean
  showCategoryTitle?: boolean
  showCta?: boolean
  ctaText?: string
  gap?: string
  fontFamily?: string
  hoverEffect?: boolean
  // Card related props
  cardVariant?: "default" | "compact" | "detailed" | "minimal" | "hover" | "overlay" | "featured"
  showSubtitle?: boolean
  cornerRadius?: "none" | "small" | "medium" | "large"
  cardShadow?: string
  accentColor?: string
  borderColor?: string
  titleColor?: string
  titleFontSize?: string
  title?: string
  titleFont?: string
  showMoreButton?: boolean
  showMoreText?: string
  showMorebuttonBgColor?: string
  showMorebuttonTextColor?: string
}

export default function FeaturedGridCategoryTemplate({
  categories,
  bgColor = "bg-white",
  textColor = "text-gray-800",
  overlayColor = "from-black/60",
  borderRadius = "rounded-lg",
  showTitle = true,
  showCategoryTitle = true,
  showCta = true,
  ctaText = "Shop Now",
  gap = "gap-6",
  fontFamily = "",
  hoverEffect = true,
  // Card related props
  cardVariant = "default",
  showSubtitle = false,
  cornerRadius = "medium",
  cardShadow,
  accentColor,
  borderColor,
  titleColor,
  titleFontSize,
  title,
  titleFont,
  showMoreButton = true,
  showMoreText = "Show More",
  showMorebuttonBgColor = "bg-slate-100",
  showMorebuttonTextColor = "text-gray-800",
}: FeaturedGridCategoryTemplateProps) {
  // Get the first category as featured
  const featuredCategory = categories[0]
  const remainingCategories = categories.slice(1)

  // Generate overlay gradient class
  const overlayGradientClass = overlayColor.startsWith("from-")
    ? `bg-gradient-to-t ${overlayColor} to-transparent`
    : "bg-gradient-to-t from-black/60 to-transparent"

  return (
    <div className={cn("w-full flex-shrink-0", bgColor)}>
      <div
        className={cn(" mx-auto px-16 py-8 md:py-16", textColor, fontFamily)}
      >
        {showTitle && (
          <h2 className={cn("text-4xl md:text-4xl font-bold text-center mb-6")}>
            {title || "Shop Our Collections"}
          </h2>
        )}
        <div className={cn("grid grid-cols-1 md:grid-cols-3 w-full", gap)}>
          {/* Featured large category */}
          {featuredCategory && (
            <Link
              href={`/list?cat=${featuredCategory.id}`}
              className="md:col-span-2 md:row-span-2 group w-full"
              key={featuredCategory._id}
            >
              <div
                className={cn(
                  "relative h-96 md:h-full bg-slate-100 overflow-hidden w-full",
                  borderRadius
                )}
              >
                <Image
                  src={
                    featuredCategory.media?.mainMedia?.image?.url ||
                    "/placeholder.svg?height=600&width=800"
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
                {showCategoryTitle && (
                  <div
                    className={cn(
                      "absolute inset-0 flex items-end",
                      overlayGradientClass
                    )}
                  >
                    <div className="p-6">
                      <h3 className="text-white text-2xl font-bold">
                        {featuredCategory.name}
                      </h3>
                      {showCta && (
                        <p className="text-white/80 mt-2">{ctaText}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          )}

          {/* All remaining categories */}
          {remainingCategories.map((category) => (
            <Link
              href={`/list?cat=${category.id}`}
              className="group w-full"
              key={category.id}
            >
              <div
                className={cn(
                  "relative h-64 bg-slate-100 overflow-hidden w-full",
                  borderRadius
                )}
              >
                <Image
                  src={
                    category.media?.mainMedia?.image?.url ||
                    "/placeholder.svg?height=256&width=256"
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
                {showCategoryTitle && (
                  <div
                    className={cn(
                      "absolute inset-0 flex items-end",
                      overlayGradientClass
                    )}
                  >
                    <div className="p-4">
                      <h3 className="text-white text-lg font-medium">
                        {category.name}
                      </h3>
                      {showCta && (
                        <p className="text-white/80 text-sm mt-1">{ctaText}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Show More Button */}
        {showMoreButton && (
          <div className="flex justify-end mt-6">
            <Link
              href="/e-commerce/TODO/categories"
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
