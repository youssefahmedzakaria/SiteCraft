import { PromoSlider } from "../promo-slider"
import { cn } from "@/lib/utils"

export interface MinimalRightPromoProps {
  slides?: {
    title: string
    description: string
    buttonText: string
    buttonLink: string
    image: string
    imageAlt: string
  }[]
  autoplay?: boolean
  showArrows?: boolean
  titleFont?: string
  titleColor?: string
  titleSize?: string
  buttonFont?: string
  buttonColor?: string
  buttonTextColor?: string
  buttonSize?: string
  buttonRadius?: string
  descriptionFont?: string
  descriptionColor?: string
  descriptionSize?: string
  backgroundColor?: string
  imageObjectFit?: "cover" | "fill" | "contain"
  id?: string
  scrollEffect?: "zoom-out" | "sticky" | "parallax" | "none"
  scrollSpeed?: number
}

export function MinimalRightPromo({ 
  id,
  slides = [
    {
      title: "Your Site Title",
      description:
        "This is your website. Here, you have everything to tell your story. Add as many pages as necessary to your site and. Every section is fully customizable. Change images, colors, and text to suit your needs effortlessly.",
      buttonText: "Shop Now",
      buttonLink: "/shop",
      image: "/placeholder.svg?height=500&width=500",
      imageAlt: "Promotional image",
    },
    {
      title: "Summer Collection",
      description:
        "Discover our latest summer collection with styles perfect for any occasion. Limited time offer with free shipping on all orders.",
      buttonText: "Shop Now",
      buttonLink: "/summer-collection",
      image: "/placeholder.svg?height=500&width=500",
      imageAlt: "Summer collection promotional image",
    },
  ],
  autoplay = false,
  showArrows = true,
  titleFont,
  titleColor,
  titleSize,
  buttonFont,
  buttonColor,
  buttonTextColor,
  buttonSize,
  buttonRadius,
  descriptionFont,
  descriptionColor,
  descriptionSize,
  backgroundColor,
  imageObjectFit,
  scrollEffect,
  scrollSpeed,
}: MinimalRightPromoProps) {
  return (
    <section id={id} className={cn("w-full", backgroundColor)}>
      <div className="promo-new">
        <PromoSlider
          slides={slides}
          variant="minimalRight"
          autoplay={autoplay}
          showArrows={showArrows}
          titleFont={titleFont}
          titleColor={titleColor}
          titleSize={titleSize}
          buttonFont={buttonFont}
          buttonColor={buttonColor}
          buttonTextColor={buttonTextColor}
          buttonSize={buttonSize}
          buttonRadius={buttonRadius}
          descriptionFont={descriptionFont}
          descriptionColor={descriptionColor}
          descriptionSize={descriptionSize}
          imageObjectFit={imageObjectFit}
          scrollEffect={scrollEffect}
          scrollSpeed={scrollSpeed}
        />
      </div>
    </section>
  )
}
