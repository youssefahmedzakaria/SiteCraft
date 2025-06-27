/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils"
import {GridCategoryTemplate} from "@/components/e-commerce/category-lists/templates/grid-template"
import {HorizontalScrollCategoryTemplate} from "@/components/e-commerce/category-lists/templates/horizontal-scroll-template"
import FeaturedGridCategoryTemplate from "@/components/e-commerce/category-lists/templates/featured-grid-template"
import {ListViewCategoryTemplate} from "@/components/e-commerce/category-lists/templates/list-view-template"
interface CategoryListProps {
  categories: any[]
  template?: "grid" | "horizontal" | "featured" | "list" 
  // Template customization props
  columns?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: string
  bgColor?: string
  textColor?: string
  accentColor?: string
  borderColor?: string
  borderRadius?: string
  overlayColor?: string
  showTitle?: boolean
  showCategoryTitle?: boolean
  showDescription?: boolean
  showCta?: boolean
  showControls?: boolean
  showIcon?: boolean
  ctaText?: string
  titlePosition?: "top" | "bottom" | "overlay"
  imageHeight?: string
  cardWidth?: string
  fontFamily?: string
  cardShadow?: string
  hoverEffect?: boolean
  // Card related props
  cardVariant?: "default" | "compact" | "detailed" | "minimal" | "hover" | "overlay" | "featured"
  showSubtitle?: boolean
  cornerRadius?: "none" | "small" | "medium" | "large"
  showScrollbar?: boolean
  scrollBarSliderColor?: string
  scrollBarBgColor?: string
  titleColor?: string
  titleFontSize?: string
  title?: string
  titleFont?: string
  // Show more button props
  showMoreButton?: boolean
  showMoreText?: string
  showMorebuttonBgColor?: string
  showMorebuttonTextColor?: string
}

export default function CategoryList({
  categories,
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
  showCategoryTitle,
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
  // Show more button props
  showMoreButton,
  showMoreText,   
  showMorebuttonBgColor,
  showMorebuttonTextColor
}: CategoryListProps) {
  // Render the selected template with passed props
  const renderTemplate = () => {
    switch (template) {
      case "horizontal":
        return (
          <HorizontalScrollCategoryTemplate
            categories={categories}
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
            showCardTitle={showCategoryTitle}
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
            // Show more button props
            showMoreButton={showMoreButton}
            showMoreText={showMoreText}
            showMorebuttonBgColor={showMorebuttonBgColor}
            showMorebuttonTextColor={showMorebuttonTextColor}
          />
        )
      case "featured":
        return (
          <FeaturedGridCategoryTemplate
            categories={categories}
            bgColor={bgColor}
            textColor={textColor}
            overlayColor={overlayColor}
            borderRadius={borderRadius}
            showTitle={showTitle}
            showCategoryTitle={showCategoryTitle}
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
            // Show more button props
            showMoreButton={showMoreButton}
            showMoreText={showMoreText}
            showMorebuttonBgColor={showMorebuttonBgColor}
            showMorebuttonTextColor={showMorebuttonTextColor}
          />
        )
      case "list":
        return (
          <ListViewCategoryTemplate
            categories={categories}
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
            showCardTitle={showCategoryTitle}
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
            // Show more button props
            showMoreButton={showMoreButton}
            showMoreText={showMoreText}
            showMorebuttonBgColor={showMorebuttonBgColor}
            showMorebuttonTextColor={showMorebuttonTextColor}
          />
        )
      default: // grid template
        return (
          <GridCategoryTemplate
            categories={categories}
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
            showCardTitle={showCategoryTitle}
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
            // Show more button props
            showMoreButton={showMoreButton}
            showMoreText={showMoreText}
            showMorebuttonBgColor={showMorebuttonBgColor} 
            showMorebuttonTextColor={showMorebuttonTextColor}
          />
        )
    }
  }

  return <div>{renderTemplate()}</div>
}