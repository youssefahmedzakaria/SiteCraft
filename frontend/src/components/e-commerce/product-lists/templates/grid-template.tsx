/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import FlexibleCard from "@/components/e-commerce/card/card-templates"

interface GridProductTemplateProps {
  products: any[]
  columns?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: string
  bgColor?: string
  textColor?: string
  borderRadius?: string
  showTitle?: boolean
  titlePosition?: "top" | "bottom" | "overlay"
  imageHeight?: string
  fontFamily?: string
  hoverEffect?: boolean
  // Card related props
  cardVariant?: "default" | "compact" | "detailed" | "minimal" | "hover" | "overlay" | "featured"
  showCardTitle?: boolean
  showSubtitle?: boolean
  showCta?: boolean
  ctaText?: string
  cornerRadius?: "none" | "small" | "medium" | "large"
  cardShadow?: string
  accentColor?: string
  borderColor?: string
  overlayColor?: string
  titleColor?: string
  titleFontSize?: string
  title?: string
  titleFont?: string
  // Show more button props
  showMoreButton?: boolean
  showMoreText?: string
  showMorebuttonBgColor?: string
  showMorebuttonTextColor?: string
  // Product specific props
  onAddToCart?: (product: any) => void
  onAddToFavorite?: (product: any) => void
}

export function GridProductTemplate({
  products,
  columns = { sm: 2, md: 3, lg: 4, xl: 6 },
  gap = "gap-4",
  bgColor = "bg-white",
  textColor = "text-gray-800",
  borderRadius = "rounded-lg",
  showTitle = true,
  imageHeight = "aspect-square",
  fontFamily = "",
  hoverEffect = true,
  // Card related props
  cardVariant = "default",
  showCardTitle = true,
  showSubtitle = false,
  showCta = false,
  ctaText = "Add to Cart",
  cornerRadius = "medium",
  cardShadow = "",
  accentColor = "bg-blue-600",
  borderColor = "border-gray-200",
  overlayColor = "bg-black/30",
  titleColor,
  titleFontSize,
  title = "Shop by Product",
  titleFont,
  // Show more button props
  showMoreButton = true,
  showMoreText = "Show More",
  showMorebuttonBgColor = "bg-slate-100",
  showMorebuttonTextColor = "text-gray-800",
  // Product specific props
  onAddToCart,
  onAddToFavorite,
}: GridProductTemplateProps) {
  // Generate dynamic grid classes based on columns prop
  const gridCols = cn(
    `grid-cols-${columns.sm || 2}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
  )

  return (
    <div className={cn("w-full flex-shrink-0", bgColor)}>
      <div
        className={cn(" mx-auto px-16 py-8 md:py-16", textColor, fontFamily)}
      >
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
        <div className={cn("grid", gridCols, gap)}>
          {products.map((product) => (
            <FlexibleCard
              key={product._id || product.id}
              item={product}
              type="product"
              variant={cardVariant}
              imageRatio={imageHeight.includes("h-") ? "portrait" : "square"}
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
              onAddToCart={onAddToCart ? () => onAddToCart(product) : undefined}
              onAddToFavorite={
                onAddToFavorite ? () => onAddToFavorite(product) : undefined
              }
              linkPath={`/e-commerce/TODO/product/${product.id}`}
            />
          ))}
        </div>
        {/* Show More Button */}
        {showMoreButton && (
          <div className="flex justify-end mt-6">
            <Link
              href="/e-commerce/TODO/products"
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
