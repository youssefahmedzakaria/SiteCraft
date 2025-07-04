/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Eye, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { useFavorites } from "@/contexts/favorites-context";
import { useRouter } from "next/navigation";

type CardItemType = "product" | "category";

type CardVariant = "default" | "minimal" | "hover" | "overlay" | "featured";

type ImageRatio = "square" | "portrait" | "landscape";

type CornerRadius = "none" | "small" | "medium" | "large";

// Define the props for the FlexibleCard component
interface FlexibleCardProps {
  isClickable?: boolean;
  // Core data
  item: any;
  type: CardItemType;

  // Layout and appearance
  variant?: CardVariant;
  imageRatio?: ImageRatio;
  cornerRadius?: CornerRadius;

  // Content visibility
  showTitle?: boolean;
  showSubtitle?: boolean;
  showPrice?: boolean;
  showReviews?: boolean;
  showSku?: boolean;
  showDescription?: boolean;
  showCta?: boolean;

  // CTA options
  ctaText?: string;
  ctaAction?: () => void;
  onAddToCart?: () => void;
  onAddToFavorite?: () => void;

  // Styling options
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  borderColor?: string;
  overlayColor?: string;
  fontFamily?: string;
  cardShadow?: string;
  titleColor?: string;
  titleFontSize?: string;
  titleFont?: string;

  // Effects
  hoverEffect?: boolean;

  // Link options
  linkPath?: string;
  openInNewTab?: boolean;

  // Custom classes
  className?: string;
  imageClassName?: string;
  contentClassName?: string;
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

export default function FlexibleCard({
  isClickable,
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
  overlayColor = "bg-black/30",
  fontFamily = "",
  cardShadow = "",
  titleFontSize = "text-2xl",
  titleFont = "",

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
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];
  const router = useRouter();
  const { addToCart, removeFromCart, state: cartState } = useCart();
  const {
    addToFavorites,
    removeFromFavorites,
    state: favoritesState,
  } = useFavorites();

  // Define aspect ratio classes
  const aspectRatioClass = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  }[imageRatio];

  // Define corner radius classes
  const radiusClass = {
    none: "rounded-none",
    small: "rounded-sm",
    medium: "rounded-md",
    large: "rounded-lg",
  }[cornerRadius];

  // Generate button styles based on accent color
  const buttonBgClass = accentColor.startsWith("bg-")
    ? accentColor
    : `bg-blue-600`;
  const buttonHoverClass = accentColor.startsWith("bg-")
    ? accentColor.replace("bg-", "hover:bg-") + "/90"
    : "hover:bg-blue-700";

  // Determine the link path based on the item type
  const href =
    linkPath ||
    (isClickable
      ? type === "product"
        ? `/${item.id}`
        : `/e-commerce/${subdomain}/products`
      : "#");

  // Get item description
  const description =
    type === "product"
      ? item.additionalInfoSections?.find(
          (section: any) => section.title === "shortDesc"
        )?.description ||
        item.description ||
        item.Description || // Add this line to check for capitalized Description
        ""
      : item.description || item.Description || "Explore our collection"; // Add Description fallback for categories too

  // Get item image
  const imageUrl =
    item.media?.mainMedia?.image?.url ||
    "/placeholder.png?height=300&width=300";
  const secondaryImageUrl = item.media?.items?.[1]?.image?.url;

  // Get price value - handle new price structure
  const getPrice = () => {
    // Calculate discounted price if discountType and discountValue are present
    if (item.discountType && typeof item.discountValue === 'number') {
      if (item.discountType === 'percentage') {
        return item.price - (item.price * item.discountValue) / 100;
      } else if (item.discountType === 'fixed amount') {
        return item.price - item.discountValue;
      }
    }
    return item.price || 0;
  };

  const getOriginalPrice = () => {
    return item.price || null;
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  // Check if item is in favorites
  const isInFavorites = favoritesState.items.some((fav) => fav.id === item.id);

  // Check if item is in cart
  const isInCart = cartState.items.some((cartItem) => cartItem.id === item.id);

  // Handle add to cart action (toggle)
  const handleAddToCartAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "product") {
      if (isInCart) {
        // Remove from cart if already in cart
        removeFromCart(item.id);
      } else {
        // Add to cart if not in cart
        addToCart({
          id: item.id,
          name: item.name,
          price: getPrice(),
          image: imageUrl,
        });
      }
    }
    onAddToCart?.();
  };

  // Handle favorites action
  const handleFavoritesAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "product") {
      const favoriteItem = {
        id: item.id,
        name: item.name,
        price: getPrice(),
        image: imageUrl,
      };

      if (isInFavorites) {
        removeFromFavorites(item.id);
      } else {
        addToFavorites(favoriteItem);
      }
    }
    onAddToFavorite?.();
  };

  // Handle view/eye action
  const handleViewAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "product") {
      router.push(
        isClickable ? `/e-commerce/${subdomain}/product/${item.id}` : "#"
      );
    }
  };

  // Wrap content in Link if needed
  const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!isClickable || !href || href === "#") return <>{children}</>;
    return (
      <Link
        href={href}
        target={openInNewTab ? "_blank" : undefined}
        className="block"
      >
        {children}
      </Link>
    );
  };

  // Handle CTA click
  const handleCtaClick = (e: React.MouseEvent) => {
    if (ctaAction) {
      e.preventDefault();
      ctaAction();
    }
  };

  // Enhanced price display component
  const PriceDisplay = ({ className = "" }: { className?: string }) => {
    if (!showPrice || type !== "product") return null;

    const currentPrice = getPrice();
    const originalPrice = getOriginalPrice();
    const isDiscounted = item.discountType && typeof item.discountValue === 'number' && currentPrice < originalPrice;
    const discountPercent =
      item.discountType === 'percentage' && typeof item.discountValue === 'number'
        ? item.discountValue
        : item.discountType === 'fixed amount' && typeof item.discountValue === 'number' && originalPrice
        ? Math.round((item.discountValue / originalPrice) * 100)
        : null;

    return (
      <div className={cn("flex items-center gap-2", className)}>
        {isDiscounted ? (
          <>
            <span className={cn("font-semibold", textColor)}>${formatPrice(currentPrice)}</span>
            <span className="text-sm line-through text-gray-500">${formatPrice(originalPrice)}</span>
          </>
        ) : (
          <span className={cn("font-semibold", textColor)}>
            ${formatPrice(currentPrice)}
          </span>
        )}
      </div>
    );
  };

  // Helper to render discount badge next to product name
  const DiscountBadge = () => {
    const currentPrice = getPrice();
    const originalPrice = getOriginalPrice();
    const isDiscounted = item.discountType && typeof item.discountValue === 'number' && currentPrice < originalPrice;
    const discountPercent =
      item.discountType === 'percentage' && typeof item.discountValue === 'number'
        ? item.discountValue
        : item.discountType === 'fixed amount' && typeof item.discountValue === 'number' && originalPrice
        ? Math.round((item.discountValue / originalPrice) * 100)
        : null;
    if (isDiscounted && discountPercent && discountPercent > 0) {
      return (
        <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 rounded-md align-middle">
          {discountPercent}% OFF
        </span>
      );
    }
    return null;
  };

  // Helper to render out of stock badge
  const OutOfStockBadge = () => {
    if (type === "product" && item.currentTotalStock === 0) {
      return (
        <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded-md align-middle">
          Out of Stock
        </span>
      );
    }
    return null;
  };

  // Use titleColor if provided, otherwise fall back to textColor
  const finalTitleFont = titleFont || fontFamily;

  // Render different card variants
  switch (variant) {
    case "overlay":
      return (
        <div
          className={cn("group",className)}
          style={{backgroundColor: bgColor.includes("[")
            ? bgColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
            : bgColor,
            color: textColor.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor,
            fontFamily: getFontFamily(fontFamily),
          }}
        >
          <ContentWrapper>
            <div
              className={cn(
                "relative bg-slate-100 overflow-hidden",
                aspectRatioClass,
                radiusClass,
                cardShadow,
                imageClassName
              )}
            >
              <Image
                src={item.images[0]?.url || "/placeholder.png"}
                alt={item.images[0]?.alt || "Item image"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={cn(
                  "object-cover",
                  hoverEffect &&
                    "transition-transform duration-500 group-hover:scale-105"
                )}
              />
              {showTitle && (
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center",
                    overlayColor
                  )}
                >
                  <div className={cn("text-center p-4", contentClassName)}
                   style={{color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor,
                      fontFamily: getFontFamily(fontFamily),
                    }}>
                    <h3 className={cn( "font-bold flex items-center justify-center gap-2")} style={{color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor,
                      fontFamily: getFontFamily(fontFamily),
                    }}>{item.name}<DiscountBadge /><OutOfStockBadge /></h3>
                    {showSubtitle && showDescription && (
                      <p className={cn( "opacity-80 text-sm mt-1")}style={{color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor,
                      fontFamily: getFontFamily(fontFamily),
                    }}>
                        {description}
                      </p>
                    )}
                    <PriceDisplay
                      className={cn("justify-center mt-2" ,textColor) }
                    />
                    {showCta && (
                      <div
                        onClick={handleCtaClick}
                        className={cn(
                          "mt-3 text-sm font-medium border border-white/60 px-3 py-1 rounded-full inline-block cursor-pointer",
                        )}
                        style={{color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor,
                          fontFamily: getFontFamily(fontFamily),
                        }}
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
      );

    case "minimal":
      return (
        <div className={cn("group", finalTitleFont, textColor, className)}>
          <ContentWrapper>
            <div
              className={cn(
                "relative bg-slate-100 overflow-hidden",
                aspectRatioClass,
                radiusClass,
                cardShadow,
                imageClassName
              )}
            >
              <Image
                src={item.images[0]?.url || "/placeholder.png"}
                alt={item.images[0]?.alt || "Item image"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />
            </div>
          </ContentWrapper>
          <div className={cn("mt-2", contentClassName)}>
            {showTitle && <h3 className={cn("text-sm","flex items-center gap-2")}
             style={{color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor,
                      fontFamily: getFontFamily(fontFamily),
                    }}
            >{item.name}<DiscountBadge /><OutOfStockBadge /></h3>}
            <PriceDisplay className="text-sm mt-1" />
          </div>
        </div>
      );

    case "hover":
      return (
        <div className={cn("group", className)}
         style={{color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor,
          fontFamily: getFontFamily(fontFamily),       
        }}
        >
          <ContentWrapper>
            <div
              className={cn(
                "relative bg-slate-100 overflow-hidden mb-3",
                aspectRatioClass,
                radiusClass,
                cardShadow,
                imageClassName
              )}
            >
              <Image
                src={item.images[0]?.url || "/placeholder.png"}
                alt={item.images[0]?.alt || "Item image"}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className={cn(
                  "object-cover",
                  hoverEffect &&
                    "transition-opacity duration-300 group-hover:opacity-75"
                )}
              />
              {secondaryImageUrl && hoverEffect && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Image
                    src={item.images[0]?.url || "/placeholder.png"}
                alt={item.images[0]?.alt || "Item image"}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              )}
              {type === "product" && hoverEffect && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddToCartAction}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                      title={isInCart ? "Remove from Cart" : "Add to Cart"}
                    >
                      <ShoppingCart
                        className={`w-5 h-5 ${
                          isInCart ? "fill-blue-500 text-blue-500" : ""
                        }`}
                      />
                    </button>
                    <button
                      onClick={handleFavoritesAction}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                      title={
                        isInFavorites
                          ? "Remove from Favorites"
                          : "Add to Favorites"
                      }
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isInFavorites ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </button>
                    <button
                      onClick={handleViewAction}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                      title="View Product"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </ContentWrapper>
          <div className={cn("space-y-1", contentClassName)}>
            {showTitle && <h3 className={cn("font-medium", "flex items-center gap-2")}
             style={{color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor,
                    fontFamily: getFontFamily(fontFamily),}}
            >{item.name}<DiscountBadge /><OutOfStockBadge /></h3>}
            {showSubtitle && <p className={cn("text-sm opacity-70")}
             style={{color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor,
                    }}
            >{description}</p>}
            {showReviews && type === "product" && (
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < 4
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">(24)</span>
              </div>
            )}
            {showSku && type === "product" && (
              <div className="text-xs text-gray-400">
                SKU: {item.sku || "N/A"}
              </div>
            )}
            <PriceDisplay />
          </div>
        </div>
      );

    case "featured":
      return (
        <div
          className={cn("group", className)}
           style={{color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor,
                  fontFamily: getFontFamily(fontFamily),
                  backgroundColor: bgColor?.includes("[") ? bgColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : bgColor, 
          }}
        >
          <ContentWrapper>
            <div
              className={cn(
                "relative h-64 md:h-80 bg-slate-100 overflow-hidden",
                radiusClass,
                cardShadow,
                imageClassName
              )}
            >
              <Image
                src={item.images[0]?.url || "/placeholder.png"}
                alt={item.images[0]?.alt || "Item image"}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={cn(
                  "object-cover",
                  hoverEffect &&
                    "transition-transform duration-500 group-hover:scale-105"
                )}
              />
              {showTitle && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className={cn("p-6", contentClassName)}>
                    <h3 className={cn("font-bold flex items-center gap-2")}
                       style={{color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor,
                        fontSize: getFontSize(fontFamily),
                    }}
                      >{item.name}<DiscountBadge /><OutOfStockBadge /></h3>
                    {showSubtitle && showDescription && (
                      <p className={cn("opacity-80 mt-1")}
                       style={{color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor,
                    }}>
                        {description}
                      </p>
                    )}
                    <PriceDisplay className={cn("mt-2", textColor)} />
                    {showCta && (
                      <div
                        onClick={handleCtaClick}
                        className={cn(
                          textColor,
                          "opacity-80 mt-2 cursor-pointer hover:opacity-100"
                        )}
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
      );

    default: // default variant
      return (
        <div className={cn("group" ,className)}
         style={{color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor,
                   fontFamily: getFontFamily(fontFamily),}}
        >
          <ContentWrapper>
            <div
              className={cn(
                "relative bg-slate-100 overflow-hidden mb-3",
                aspectRatioClass,
                radiusClass,
                cardShadow,
                imageClassName
              )}
            >
              <Image
                src={item.images[0]?.url || "/placeholder.png"}
                alt={item.images[0]?.alt || "Item image"}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className={cn(
                  "object-cover",
                  hoverEffect &&
                    "transition-transform duration-300 group-hover:scale-105"
                )}
              />
              {type === "product" && (
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleFavoritesAction}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                    title={
                      isInFavorites
                        ? "Remove from Favorites"
                        : "Add to Favorites"
                    }
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isInFavorites ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>
          </ContentWrapper>
          <div className={cn("space-y-1", contentClassName)}>
            {showTitle && <h3 className={cn("font-medium", "flex items-center gap-2")}
             style={{color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor,
                    fontSize: getFontSize(fontFamily),
                    }}
            >{item.name}<DiscountBadge /><OutOfStockBadge /></h3>}
            {showSubtitle && <p className={cn("text-sm")}
             style={{color: textColor?.includes("[") ? textColor.split("-[")[1]?.slice(0, -1) || "#ffffff" : textColor,
                    }}>{description}</p>}
            <div className="flex justify-between items-center">
              <PriceDisplay />
              {showCta && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (type === "product") {
                      handleAddToCartAction(e);
                    } else {
                      ctaAction?.();
                    }
                  }}
                  className={cn(
                    "text-xs text-white px-3 py-1 rounded-full",
                    buttonBgClass,
                    buttonHoverClass
                  )}
                >
                  {ctaText}
                </button>
              )}
            </div>
            {showSku && type === "product" && (
              <div className="text-xs text-gray-400">
                SKU: {item.sku || "N/A"}
              </div>
            )}
          </div>
        </div>
      );
  }
}
