"use client";

import { cn } from "@/lib/utils";
import { GridProductTemplate } from "./templates/grid-template";
import { HorizontalScrollProductTemplate } from "./templates/horizontal-scroll-template";
import { FeaturedGridProductTemplate } from "./templates/featured-grid-template";
import { ListViewProductTemplate } from "./templates/list-view-template";
import Link from "next/link";

interface ProductListProps {
  isClickable?: boolean;
  products: any[];
  template?: "grid" | "horizontal" | "featured" | "list";
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  borderColor?: string;
  borderRadius?: string;
  overlayColor?: string;
  showTitle?: boolean;
  showProductTitle?: boolean;
  showDescription?: boolean;
  showCta?: boolean;
  showControls?: boolean;
  showIcon?: boolean;
  ctaText?: string;
  titlePosition?: "top" | "bottom" | "overlay";
  imageHeight?: string;
  cardWidth?: string;
  fontFamily?: string;
  cardShadow?: string;
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
  showSubtitle?: boolean;
  cornerRadius?: "none" | "small" | "medium" | "large";
  showScrollbar?: boolean;
  scrollBarSliderColor?: string;
  scrollBarBgColor?: string;
  titleColor?: string;
  titleFontSize?: string;
  title?: string;
  titleFont?: string;
  // Product specific props
  onAddToCart?: (product: any) => void;
  onAddToFavorite?: (product: any) => void;
  // Show more button props
  showMoreButton?: boolean;
  showMoreText?: string;
  showMorebuttonBgColor?: string;
  showMorebuttonTextColor?: string;
}

export default function ProductList({
  isClickable = true,
  products,
  template = "grid",
  // Template customization props
  columns,
  gap,
  bgColor,
  textColor,
  accentColor,
  borderColor,
  borderRadius,
  overlayColor,
  showTitle,
  showProductTitle,
  showDescription,
  showCta,
  showControls,
  showIcon,
  ctaText,
  titlePosition,
  imageHeight,
  cardWidth,
  fontFamily,
  cardShadow,
  hoverEffect,
  // Card related props
  cardVariant = "default",
  showSubtitle,
  cornerRadius = "medium",
  showScrollbar,
  scrollBarSliderColor,
  scrollBarBgColor,
  titleColor,
  titleFontSize,
  title,
  titleFont,
  // Product specific props
  onAddToCart,
  onAddToFavorite,
  // Show more button props
  showMoreButton = true,
  showMoreText = "Show More",
  showMorebuttonBgColor = "blue",
  showMorebuttonTextColor = "white",
}: ProductListProps) {
  // Render the selected template with passed props
  const renderTemplate = () => {
    switch (template) {
      case "horizontal":
        return (
          <HorizontalScrollProductTemplate
            isClickable={isClickable}
            products={products}
            bgColor={bgColor}
            textColor={textColor}
            accentColor={accentColor}
            borderRadius={borderRadius}
            borderColor={borderColor}
            showTitle={showTitle}
            showControls={showControls}
            imageHeight={imageHeight}
            cardWidth={cardWidth}
            fontFamily={fontFamily}
            hoverEffect={hoverEffect}
            showScrollbar={showScrollbar}
            scrollBarSliderColor={scrollBarSliderColor}
            scrollBarBgColor={scrollBarBgColor}
            // Card related props
            cardVariant={cardVariant}
            showCardTitle={showProductTitle}
            showSubtitle={showSubtitle}
            showCta={showCta}
            ctaText={ctaText}
            cornerRadius={cornerRadius}
            cardShadow={cardShadow}
            overlayColor={overlayColor}
            titleColor={titleColor}
            titleFontSize={titleFontSize}
            title={title}
            titleFont={titleFont}
            // Product specific props
            onAddToCart={onAddToCart}
            onAddToFavorite={onAddToFavorite}
            // Show more button props
            showMoreButton={showMoreButton}
            showMoreText={showMoreText}
            showMorebuttonBgColor={showMorebuttonBgColor}
            showMorebuttonTextColor={showMorebuttonTextColor}
          />
        );
      case "featured":
        return (
          <FeaturedGridProductTemplate
            isClickable={isClickable}
            products={products}
            bgColor={bgColor}
            textColor={textColor}
            overlayColor={overlayColor}
            borderRadius={borderRadius}
            showTitle={showTitle}
            showProductTitle={showProductTitle}
            showCta={showCta}
            ctaText={ctaText}
            gap={gap}
            fontFamily={fontFamily}
            hoverEffect={hoverEffect}
            // Card related props
            cardVariant={cardVariant}
            showSubtitle={showSubtitle}
            cornerRadius={cornerRadius}
            cardShadow={cardShadow}
            accentColor={accentColor}
            borderColor={borderColor}
            titleColor={titleColor}
            titleFontSize={titleFontSize}
            title={title}
            titleFont={titleFont}
            // Product specific props
            onAddToCart={onAddToCart}
            onAddToFavorite={onAddToFavorite}
            // Show more button props
            showMoreButton={showMoreButton}
            showMoreText={showMoreText}
            showMorebuttonBgColor={showMorebuttonBgColor}
            showMorebuttonTextColor={showMorebuttonTextColor}
          />
        );
      case "list":
        return (
          <ListViewProductTemplate
            isClickable={isClickable}
            products={products}
            bgColor={bgColor}
            textColor={textColor}
            accentColor={accentColor}
            borderColor={borderColor}
            borderRadius={borderRadius}
            showTitle={showTitle}
            showDescription={showDescription}
            showIcon={showIcon}
            gap={gap}
            fontFamily={fontFamily}
            hoverEffect={hoverEffect}
            // Card related props
            cardVariant={cardVariant}
            showCardTitle={showProductTitle}
            showSubtitle={showSubtitle}
            showCta={showCta}
            ctaText={ctaText}
            cornerRadius={cornerRadius}
            cardShadow={cardShadow}
            overlayColor={overlayColor}
            titleColor={titleColor}
            titleFontSize={titleFontSize}
            title={title}
            titleFont={titleFont}
            // Product specific props
            onAddToCart={onAddToCart}
            onAddToFavorite={onAddToFavorite}
            // Show more button props
            showMoreButton={showMoreButton}
            showMoreText={showMoreText}
            showMorebuttonBgColor={showMorebuttonBgColor}
            showMorebuttonTextColor={showMorebuttonTextColor}
          />
        );
      default: // grid template
        return (
          <GridProductTemplate
            isClickable={isClickable}
            products={products}
            columns={columns}
            gap={gap}
            bgColor={bgColor}
            textColor={textColor}
            borderRadius={borderRadius}
            showTitle={showTitle}
            titlePosition={titlePosition || "bottom"}
            imageHeight={imageHeight}
            fontFamily={fontFamily}
            hoverEffect={hoverEffect}
            // Card related props
            cardVariant={cardVariant}
            showCardTitle={showProductTitle}
            showSubtitle={showSubtitle}
            showCta={showCta}
            ctaText={ctaText}
            cornerRadius={cornerRadius}
            cardShadow={cardShadow}
            accentColor={accentColor}
            borderColor={borderColor}
            overlayColor={overlayColor}
            titleColor={titleColor}
            titleFontSize={titleFontSize}
            title={title}
            titleFont={titleFont}
            // Product specific props
            onAddToCart={onAddToCart}
            onAddToFavorite={onAddToFavorite}
            // Show more button props
            showMoreButton={showMoreButton}
            showMoreText={showMoreText}
            showMorebuttonBgColor={showMorebuttonBgColor}
            showMorebuttonTextColor={showMorebuttonTextColor}
          />
        );
    }
  };

  return <div className="w-full">{renderTemplate()}</div>;
}
