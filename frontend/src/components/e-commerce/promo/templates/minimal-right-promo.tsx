import { PromoSlider } from "../promo-slider";

export interface MinimalRightPromoProps {
  isClickable?: boolean;
  slides?: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    image: string;
    imageAlt: string;
  }[];
  autoPlay?: boolean;
  showArrows?: boolean;
  titleFont?: string;
  titleColor?: string;
  titleSize?: string;
  buttonFont?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonSize?: string;
  buttonRadius?: string;
  descriptionFont?: string;
  descriptionColor?: string;
  descriptionSize?: string;
  backgroundColor?: string;
  imageObjectFit?: "cover" | "fill" | "contain";
  id?: string;
}

export function MinimalRightPromo({
  isClickable = true,
  id,
  slides = [
    {
      title: "Your Site Title",
      description:
        "This is your website. Here, you have everything to tell your story. Add as many pages as necessary to your site and. Every section is fully customizable. Change images, colors, and text to suit your needs effortlessly.",
      buttonText: "Shop Now",
      buttonLink: "/shop",
      image: "/placeholder.png?height=500&width=500",
      imageAlt: "Promotional image",
    },
    {
      title: "Summer Collection",
      description:
        "Discover our latest summer collection with styles perfect for any occasion. Limited time offer with free shipping on all orders.",
      buttonText: "Shop Now",
      buttonLink: "/summer-collection",
      image: "/placeholder.png?height=500&width=500",
      imageAlt: "Summer collection promotional image",
    },
  ],
  autoPlay = false,
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
}: MinimalRightPromoProps) {
  return (
    <section
      id={id}
      className="w-full"
      style={{
        backgroundColor: backgroundColor?.includes("[")
          ? backgroundColor.split("-[")[1]?.slice(0, -1) || undefined
          : undefined,
      }}
    >
      <div className="promo-new">
        <PromoSlider
          slides={slides}
          variant="minimalRight"
          autoPlay={autoPlay}
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
          isClickable={isClickable}
        />
      </div>
    </section>
  );
}
