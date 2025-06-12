"use client"
import Link from "next/link"
import { cn } from "@/lib/utils"
import FlexibleCard from "@/components/card/card-templates"

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
    <div className={cn("w-full px-4 py-8", bgColor, textColor, fontFamily)}>
      {showTitle && (
        <h2 className={cn("text-2xl font-bold mb-6", titleColor, titleFontSize, titleFont)}>{title}</h2>
      )}

      <div className={cn("grid grid-cols-1 md:grid-cols-2", gap)}>
        {/* Featured Product */}
        <div className="md:col-span-2">
          <FlexibleCard
            item={featuredProduct}
            type="product"
            variant="featured"
            imageRatio="landscape"
            cornerRadius={cornerRadius}
            showTitle={showProductTitle}
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
            onAddToCart={onAddToCart ? () => onAddToCart(featuredProduct) : undefined}
            onAddToFavorite={onAddToFavorite ? () => onAddToFavorite(featuredProduct) : undefined}
            linkPath={`/product/${featuredProduct.slug}`}
          />
        </div>

        {/* Regular Products */}
        {regularProducts.map((product) => (
          <FlexibleCard
            key={product._id || product.slug}
            item={product}
            type="product"
            variant={cardVariant}
            imageRatio="square"
            cornerRadius={cornerRadius}
            showTitle={showProductTitle}
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
            onAddToFavorite={onAddToFavorite ? () => onAddToFavorite(product) : undefined}
            linkPath={`/product/${product.slug}`}
          />
        ))}
      </div>
      {/* Show More Button */}
      <div className="flex justify-end mt-6">
        <Link 
          href="/products" 
          className={cn(
            "inline-flex items-center px-6 py-2",
            "hover:bg-opacity-80 transition-colors duration-300",
            "rounded-lg text-sm font-medium",
            showMorebuttonBgColor,
            showMorebuttonTextColor
          )}
        >
          {showMoreText}
          <svg className="ml-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
