"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart, Eye, Star } from "lucide-react"
import { cn } from "@/lib/utils"


type CardItemType = "product" | "category"


type CardVariant = "default" | "compact" | "detailed" | "minimal" | "hover" | "overlay" | "featured"


type ImageRatio = "square" | "portrait" | "landscape"


type CornerRadius = "none" | "small" | "medium" | "large"

// Define the props for the FlexibleCard component
interface FlexibleCardProps {
  // Core data
  item: any
  type: CardItemType

  // Layout and appearance
  variant?: CardVariant
  imageRatio?: ImageRatio
  cornerRadius?: CornerRadius

  // Content visibility
  showTitle?: boolean
  showSubtitle?: boolean
  showPrice?: boolean
  showReviews?: boolean
  showSku?: boolean
  showDescription?: boolean
  showCta?: boolean

  // CTA options
  ctaText?: string
  ctaAction?: () => void
  onAddToCart?: () => void
  onAddToFavorite?: () => void

  // Styling options
  bgColor?: string
  textColor?: string
  accentColor?: string
  borderColor?: string
  overlayColor?: string
  fontFamily?: string
  cardShadow?: string

  // Effects
  hoverEffect?: boolean

  // Link options
  linkPath?: string
  openInNewTab?: boolean

  // Custom classes
  className?: string
  imageClassName?: string
  contentClassName?: string
}

export default function FlexibleCard({
  // Core data
  item,
  type = "product",

  // Layout and appearance
  variant = "default",
  imageRatio = "square",
  cornerRadius = "medium",

  // Content visibility
  showTitle = true,
  showSubtitle = false,
  showPrice = type === "product",
  showReviews = false,
  showSku = false,
  showDescription = false,
  showCta = false,

  // CTA options
  ctaText = type === "product" ? "Add to Cart" : "Shop Now",
  ctaAction,
  onAddToCart,
  onAddToFavorite,

  // Styling options
  bgColor = "bg-white",
  textColor = "text-gray-800",
  accentColor = "bg-blue-600",
  borderColor = "border-gray-200",
  overlayColor = "bg-black/30",
  fontFamily = "",
  cardShadow = "",

  // Effects
  hoverEffect = true,

  // Link options
  linkPath,
  openInNewTab = false,

  // Custom classes
  className = "",
  imageClassName = "",
  contentClassName = "",
}: FlexibleCardProps) {
  // Define aspect ratio classes
  const aspectRatioClass = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  }[imageRatio]

  // Define corner radius classes
  const radiusClass = {
    none: "rounded-none",
    small: "rounded-sm",
    medium: "rounded-md",
    large: "rounded-lg",
  }[cornerRadius]

  // Generate button styles based on accent color
  const buttonBgClass = accentColor.startsWith("bg-") ? accentColor : `bg-blue-600`
  const buttonHoverClass = accentColor.startsWith("bg-")
    ? accentColor.replace("bg-", "hover:bg-") + "/90"
    : "hover:bg-blue-700"

  // Generate text accent color
  const textAccentClass = accentColor.startsWith("bg-")
    ? accentColor.replace("bg-", "text-")
    : accentColor.startsWith("text-")
      ? accentColor
      : "text-blue-600"

  // Determine the link path based on the item type
  const href = linkPath || (type === "product" ? `/${item.slug}` : `/list?cat=${item.slug}`)

  // Get item description
  const description =
    type === "product"
      ? item.additionalInfoSections?.find((section: any) => section.title === "shortDesc")?.description || ""
      : "Explore our collection"

  // Get item image
  const imageUrl = item.media?.mainMedia?.image?.url || "/placeholder.svg?height=300&width=300"
  const secondaryImageUrl = item.media?.items?.[1]?.image?.url

  // Wrap content in Link if needed
  const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!href) return <>{children}</>

    return (
      <Link href={href} target={openInNewTab ? "_blank" : undefined} className="block">
        {children}
      </Link>
    )
  }

  // Handle CTA click
  const handleCtaClick = (e: React.MouseEvent) => {
    if (ctaAction) {
      e.preventDefault()
      ctaAction()
    }
  }

  // Render different card variants
  switch (variant) {
    case "overlay":
      return (
        <div className={cn("group", fontFamily, className)}>
          <ContentWrapper>
            <div
              className={cn(
                "relative bg-slate-100 overflow-hidden",
                aspectRatioClass,
                radiusClass,
                cardShadow,
                imageClassName,
              )}
            >
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={item.name || "Category image"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={cn("object-cover", hoverEffect && "transition-transform duration-500 group-hover:scale-105")}
              />
              {showTitle && (
                <div className={cn("absolute inset-0 flex items-center justify-center", overlayColor)}>
                  <div className={cn("text-center p-4", contentClassName)}>
                    <h3 className="text-white text-xl font-bold">{item.name}</h3>
                    {showDescription && <p className="text-white/80 text-sm mt-1">{description}</p>}
                    {showCta && (
                      <div
                        onClick={handleCtaClick}
                        className="mt-3 text-white text-sm font-medium border border-white/60 px-3 py-1 rounded-full inline-block cursor-pointer"
                      >
                        {ctaText}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </ContentWrapper>
        </div>
      )

    case "compact":
      return (
        <div className={cn("group", fontFamily, textColor, className)}>
          <ContentWrapper>
            <div
              className={cn(
                "relative bg-slate-100 overflow-hidden mb-2",
                aspectRatioClass,
                radiusClass,
                cardShadow,
                imageClassName,
              )}
            >
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={item.name || "Item image"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />
            </div>
          </ContentWrapper>
          <div className={cn("space-y-1", contentClassName)}>
            {showTitle && <h3 className="text-sm font-medium truncate">{item.name}</h3>}
            {showSubtitle && <p className="text-xs text-gray-500 truncate">{description}</p>}
            {showPrice && type === "product" && (
              <div className={cn("text-sm font-semibold", textAccentClass)}>${item.price?.price}</div>
            )}
            {showSku && type === "product" && <div className="text-xs text-gray-400">SKU: {item.sku || "N/A"}</div>}
          </div>
        </div>
      )

    case "detailed":
      return (
        <div
          className={cn(
            "border overflow-hidden transition-shadow",
            borderColor,
            radiusClass,
            cardShadow || "shadow-sm hover:shadow-md",
            fontFamily,
            textColor,
            bgColor,
            className,
          )}
        >
          <ContentWrapper>
            <div className={cn("relative bg-slate-100", aspectRatioClass, imageClassName)}>
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={item.name || "Item image"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          </ContentWrapper>
          <div className={cn("p-4 space-y-2", contentClassName)}>
            {showReviews && type === "product" && (
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-2">(24)</span>
              </div>
            )}

            {showTitle && <h3 className="font-semibold">{item.name}</h3>}

            {showDescription && <p className="text-sm text-gray-600 line-clamp-2">{description}</p>}

            {showSku && type === "product" && <div className="text-xs text-gray-400">SKU: {item.sku || "N/A"}</div>}

            <div className="flex justify-between items-center pt-2">
              {showPrice && type === "product" && <span className="font-bold">${item.price?.price}</span>}
              {showCta && (
                <button
                  onClick={handleCtaClick}
                  className={cn(
                    "flex items-center gap-1 text-white px-3 py-1.5 rounded text-sm",
                    buttonBgClass,
                    buttonHoverClass,
                  )}
                >
                  {type === "product" && <ShoppingCart className="w-4 h-4" />}
                  {ctaText}
                </button>
              )}
            </div>
          </div>
        </div>
      )

    case "minimal":
      return (
        <div className={cn("group", fontFamily, textColor, className)}>
          <ContentWrapper>
            <div
              className={cn(
                "relative bg-slate-100 overflow-hidden",
                aspectRatioClass,
                radiusClass,
                cardShadow,
                imageClassName,
              )}
            >
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={item.name || "Item image"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />
            </div>
          </ContentWrapper>
          <div className={cn("mt-2", contentClassName)}>
            {showTitle && <h3 className="text-sm">{item.name}</h3>}
            {showPrice && type === "product" && (
              <div className={cn("text-sm font-medium", textAccentClass)}>${item.price?.price}</div>
            )}
          </div>
        </div>
      )

    case "hover":
      return (
        <div className={cn("group", fontFamily, textColor, className)}>
          <ContentWrapper>
            <div
              className={cn(
                "relative bg-slate-100 overflow-hidden mb-3",
                aspectRatioClass,
                radiusClass,
                cardShadow,
                imageClassName,
              )}
            >
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={item.name || "Item image"}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className={cn("object-cover", hoverEffect && "transition-opacity duration-300 group-hover:opacity-75")}
              />
              {secondaryImageUrl && hoverEffect && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Image
                    src={secondaryImageUrl || "/placeholder.svg"}
                    alt={`${item.name} - alternate view`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              )}
              {type === "product" && hoverEffect && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <button className="bg-white p-2 rounded-full shadow-md">
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                    <button className="bg-white p-2 rounded-full shadow-md">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="bg-white p-2 rounded-full shadow-md">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </ContentWrapper>
          <div className={cn("space-y-1", contentClassName)}>
            {showTitle && <h3 className="font-medium">{item.name}</h3>}
            {showSubtitle && <p className="text-sm text-gray-500">{description}</p>}
            {showReviews && type === "product" && (
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">(24)</span>
              </div>
            )}
            {showSku && type === "product" && <div className="text-xs text-gray-400">SKU: {item.sku || "N/A"}</div>}
            {showPrice && type === "product" && <div className="font-semibold">${item.price?.price}</div>}
          </div>
        </div>
      )

    case "featured":
      return (
        <div className={cn("group", fontFamily, className)}>
          <ContentWrapper>
            <div
              className={cn(
                "relative h-64 md:h-80 bg-slate-100 overflow-hidden",
                radiusClass,
                cardShadow,
                imageClassName,
              )}
            >
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={item.name || "Item image"}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={cn("object-cover", hoverEffect && "transition-transform duration-500 group-hover:scale-105")}
              />
              {showTitle && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className={cn("p-6", contentClassName)}>
                    <h3 className="text-white text-2xl font-bold">{item.name}</h3>
                    {showDescription && <p className="text-white/80 mt-1">{description}</p>}
                    {showCta && (
                      <div onClick={handleCtaClick} className="text-white/80 mt-2 cursor-pointer hover:text-white">
                        {ctaText}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </ContentWrapper>
        </div>
      )

    default: // default variant
      return (
        <div className={cn("group", fontFamily, textColor, className)}>
          <ContentWrapper>
            <div
              className={cn(
                "relative bg-slate-100 overflow-hidden mb-3",
                aspectRatioClass,
                radiusClass,
                cardShadow,
                imageClassName,
              )}
            >
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={item.name || "Item image"}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className={cn("object-cover", hoverEffect && "transition-transform duration-300 group-hover:scale-105")}
              />
              {type === "product" && (
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onAddToCart?.();
                    }}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onAddToFavorite?.();
                    }}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </ContentWrapper>
          <div className={cn("space-y-1", contentClassName)}>
            {showTitle && <h3 className="font-medium">{item.name}</h3>}
            {showSubtitle && <p className="text-sm text-gray-500">{description}</p>}
            <div className="flex justify-between items-center">
              {showPrice && type === "product" && <span className="font-semibold">${item.price?.price}</span>}
              {showCta && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (type === "product") {
                      onAddToCart?.();
                    } else {
                      ctaAction?.();
                    }
                  }}
                  className={cn("text-xs text-white px-3 py-1 rounded-full", buttonBgClass, buttonHoverClass)}
                >
                  {ctaText}
                </button>
              )}
            </div>
            {showSku && type === "product" && <div className="text-xs text-gray-400">SKU: {item.sku || "N/A"}</div>}
          </div>
        </div>
      )
  }
}
