import { PromoSlider } from "../promo-slider";

export interface CenteredPromoProps {
  isClickable?: boolean;
  id?: string;
  slides?: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    image: string;
    imageAlt: string;
  }[];
  autoPlay?: boolean;
  autoplaySpeed?: number;
  showArrows?: boolean;
  titleFont?: string;
  titleColor?: string;
  titleSize?: string;
  descriptionFont?: string;
  descriptionColor?: string;
  descriptionSize?: string;
  buttonFont?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonSize?: string;
  buttonRadius?: string;
  backgroundColor?: string;
  imageObjectFit?: "cover" | "fill" | "contain";
}

export function CenteredPromo({
  isClickable = true,
  id,
  slides = [
    {
      title: "Your Site Title",
      description:
        "This is your website. Here, you have everything to tell your story. Add as many pages as necessary to your site and. Every section is fully customizable. Change images, colors, and text to suit your needs effortlessly.",
      buttonText: "Shop Now",
      buttonLink: "/shop",
      image: "/placeholder.png?height=600&width=800",
      imageAlt: "Promotional image",
    },
    {
      title: "Summer Collection",
      description:
        "Discover our latest summer collection with styles perfect for any occasion. Limited time offer with free shipping on all orders.",
      buttonText: "Shop Now",
      buttonLink: "/summer-collection",
      image: "/placeholder.png?height=600&width=800",
      imageAlt: "Summer collection promotional image",
    },
  ],
  autoPlay = false,
  autoplaySpeed = 5000,
  showArrows = true,
  titleFont,
  titleColor,
  titleSize,
  descriptionFont,
  descriptionColor,
  descriptionSize,
  buttonFont,
  buttonColor,
  buttonTextColor,
  buttonSize,
  buttonRadius,
  backgroundColor,
  imageObjectFit,
}: CenteredPromoProps) {
  return (
    <section
      id={id}
      className="w-full relative"
      style={{
        backgroundColor: backgroundColor?.includes("[")
          ? backgroundColor.split("-[")[1]?.slice(0, -1) || undefined
          : undefined,
      }}
    >
      <div className="promo-new">
        <PromoSlider
          slides={slides}
          variant="centered"
          autoPlay={autoPlay}
          autoplaySpeed={autoplaySpeed}
          showArrows={showArrows}
          titleFont={titleFont}
          titleColor={titleColor}
          titleSize={titleSize}
          descriptionFont={descriptionFont}
          descriptionColor={descriptionColor}
          descriptionSize={descriptionSize}
          buttonFont={buttonFont}
          buttonColor={buttonColor}
          buttonTextColor={buttonTextColor}
          buttonSize={buttonSize}
          buttonRadius={buttonRadius}
          imageObjectFit={imageObjectFit}
          backgroundColor={backgroundColor}
          isClickable={isClickable}
        />
      </div>
    </section>
  );
}
