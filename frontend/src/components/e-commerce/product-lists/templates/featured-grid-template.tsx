/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import Link from "next/link"
import { cn } from "@/lib/utils"
import FlexibleCard from "@/components/e-commerce/card/card-templates"
import Image from "next/image"

interface FeaturedGridProductTemplateProps {
  products: any[]
  bgColor?: string
  textColor?: string
  overlayColor?: string
  borderRadius?: string
  showTitle?: boolean
  showProductTitle?: boolean
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
  // Show more button props
  showMoreButton?: boolean  
  showMoreText?: string
  showMorebuttonBgColor?: string
  showMorebuttonTextColor?: string
  // Product specific props
  onAddToCart?: (product: any) => void
  onAddToFavorite?: (product: any) => void

}

export function FeaturedGridProductTemplate({
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
}: FeaturedGridProductTemplateProps) {
  // Split products into featured and regular
  const featuredProduct = products[0]
  const regularProducts = products.slice(1)

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

        <div className={cn("grid grid-cols-1 md:grid-cols-3 w-full", gap)}>
          {/* Featured Product */}
          {featuredProduct && (
            <div className="md:col-span-2 md:row-span-2 group w-full">
              <div
                className={cn(
                  "relative h-96 md:h-full bg-slate-100 overflow-hidden w-full",
                  borderRadius
                )}
              >
                <Image
                  src={
                    featuredProduct.media?.mainMedia?.image?.url ||
                    "/placeholder.svg?height=600&width=800"
                  }
                  alt={featuredProduct.name}
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
                    <h3 className="text-white text-2xl font-bold">
                      {featuredProduct.name}
                    </h3>
                    {showCta && <p className="text-white/80 mt-2">{ctaText}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Regular Products */}
          {regularProducts.map((product) => (
            <div className="group w-full" key={product.id}>
              <div
                className={cn(
                  "relative h-64 bg-slate-100 overflow-hidden w-full",
                  borderRadius
                )}
              >
                <Image
                  src={
                    product.media?.mainMedia?.image?.url ||
                    "/placeholder.svg?height=256&width=256"
                  }
                  alt={product.name}
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
                    <h3 className="text-white text-lg font-medium">
                      {product.name}
                    </h3>
                    {showCta && (
                      <p className="text-white/80 text-sm mt-1">{ctaText}</p>
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
