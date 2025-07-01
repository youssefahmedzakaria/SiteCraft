/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import FlexibleCard from "@/components/e-commerce/card/card-templates";
import { usePathname } from "next/navigation";

interface ListViewProductTemplateProps {
  products: any[];
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
  // Show more button props
  showMoreButton?: boolean;
  showMoreText?: string;
  showMorebuttonBgColor?: string;
  showMorebuttonTextColor?: string;
  // Product specific props
  onAddToCart?: (product: any) => void;
  onAddToFavorite?: (product: any) => void;
}

export function ListViewProductTemplate({
  products,
  bgColor = "bg-white",
  textColor = "text-gray-800",
  accentColor = "bg-blue-600",
  borderColor = "border-gray-200",
  borderRadius = "rounded-lg",
  showTitle = true,
  showDescription = true,
  showIcon = true,
  gap = "gap-4",
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
  overlayColor = "bg-black/30",
  titleColor,
  titleFontSize,
  title = "Product List",
  titleFont,
  // Show more button props
  showMoreButton = true,
  showMoreText = "Show More",
  showMorebuttonBgColor = "bg-slate-100",
  showMorebuttonTextColor = "text-gray-800",
  // Product specific props
  onAddToCart,
  onAddToFavorite,
}: ListViewProductTemplateProps) {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];

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
      <div className={cn("flex flex-col", gap)}>
        {products.map((product) => (
          <FlexibleCard
            key={product._id || product.id}
            item={product}
            type="product"
            variant={cardVariant}
            imageRatio="square"
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
            linkPath={`/e-commerce/${subdomain}/product/${product.id}`}
          />
        ))}
      </div>

      {/* Show More Button */}
      {showMoreButton && (
        <div className="flex justify-end mt-6">
          <Link
            href={`/e-commerce/${subdomain}/products`}
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
