/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils";
import { GridCategoryTemplate } from "@/components/e-commerce/category-lists/templates/grid-template";
import { HorizontalScrollCategoryTemplate } from "@/components/e-commerce/category-lists/templates/horizontal-scroll-template";
import FeaturedGridCategoryTemplate from "@/components/e-commerce/category-lists/templates/featured-grid-template";
interface CategoryListProps {
  categories: any[];
  template?: "grid" | "horizontal" | "featured" | "list";
  // Template customization props
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  borderColor?: string;
  borderRadius?: string;
  overlayColor?: string;
  showTitle?: boolean;
  showCategoryTitle?: boolean;
  showDescription?: boolean;
  showCta?: boolean;
  ctaText?: string;
  fontFamily?: string;
  cardShadow?: string;
  hoverEffect?: boolean;
  // Card related props
  cardVariant?: "default" | "minimal" | "hover" | "overlay" | "featured";
  showSubtitle?: boolean;
  cornerRadius?: "none" | "small" | "medium" | "large";
  showScrollbar?: boolean;
  scrollBarSliderColor?: string;
  scrollBarBgColor?: string;
  titleColor?: string;
  titleFontSize?: string;
  title?: string;
  titleFont?: string;
  // Show more button props
  showMoreButton?: boolean;
  showMoreText?: string;
  showMorebuttonBgColor?: string;
  showMorebuttonTextColor?: string;
}

export default function CategoryList({
  categories,
  template = "grid",
  // Template customization props
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
  ctaText,
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
  showMorebuttonTextColor,
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
        );
      case "featured":
        // Map unsupported "compact" variant to a supported one (e.g., "default")
        const featuredCardVariant =
          cardVariant === "default" ? "default" : cardVariant;
        return (
          <FeaturedGridCategoryTemplate
            categories={categories}
            bgColor={bgColor}
            textColor={textColor}
            overlayColor={overlayColor}
            borderRadius={borderRadius}
            showTitle={showTitle}
            showCardTitle={showCategoryTitle}
            showCta={showCta}
            ctaText={ctaText}
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
        );
      default: // grid template
        return (
          <GridCategoryTemplate
            categories={categories}
            bgColor={bgColor}
            textColor={textColor}
            borderRadius={borderRadius}
            showTitle={showTitle}
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
        );
    }
  };

  return <div>{renderTemplate()}</div>;
}
