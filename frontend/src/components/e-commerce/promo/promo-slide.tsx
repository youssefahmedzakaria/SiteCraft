"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/e-commerce/ui/button";

export interface PromoSlideProps {
  isClickable?: boolean;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  imageAlt: string;
  variant?:
    | "left"
    | "centered"
    | "right"
    | "overlay"
    | "minimalRight"
    | "minimalLeft"
    | "split";
  className?: string;
  backgroundColor?: string;
  imageObjectFit?: "cover" | "fill" | "contain";
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

const getBorderRadius = (radius: string) => {
  const radiusMap: Record<string, string> = {
    "rounded-none": "0",
    "rounded-sm": "0.125rem",
    rounded: "0.25rem",
    "rounded-md": "0.375rem",
    "rounded-lg": "0.5rem",
    "rounded-xl": "0.75rem",
    "rounded-2xl": "1rem",
    "rounded-3xl": "1.5rem",
    "rounded-full": "9999px",
  };
  return radiusMap[radius] || "0.375rem";
};

export function PromoSlide({
  isClickable,
  title,
  description,
  buttonText,
  buttonLink,
  image,
  imageAlt,
  variant = "left",
  className,
  backgroundColor,
  imageObjectFit,
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
}: PromoSlideProps) {
  const variants = {
    centered: {
      container: "relative h-[600px] overflow-hidden",
      content:
        "absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-12 bg-black/50 text-white z-20",
      image: "absolute inset-0 w-full h-full z-0",
    },
    overlay: {
      container: "relative h-[500px] overflow-hidden",
      content:
        "absolute inset-0 flex flex-col justify-center p-6 md:p-12 bg-gradient-to-r from-black/80 to-transparent text-white z-20",
      image: "absolute inset-0 w-full h-full z-0",
    },
    minimalRight: {
      container: "relative h-[500px] overflow-hidden",
      content:
        "absolute bottom-0 left-0 right-0 p-6 md:p-12 bg-gradient-to-t from-black/80 to-transparent text-white z-20 text-right",
      image: "absolute inset-0 w-full h-full z-0",
    },
    minimalLeft: {
      container: "relative h-[500px] overflow-hidden",
      content:
        "absolute bottom-0 left-0 right-0 p-6 md:p-12 bg-gradient-to-t from-black/80 to-transparent text-white z-20",
      image: "absolute inset-0 w-full h-full z-0",
    },
    left: {
      container: "grid md:grid-cols-2 md:h-[500px]",
      content:
        "flex flex-col justify-center p-6 md:p-12 text-white order-2 md:order-1",
      image: "relative w-full h-[250px] md:h-full order-1 md:order-2",
    },
    right: {
      container: "grid md:grid-cols-2 md:h-[500px]",
      content:
        "flex flex-col justify-center p-6 md:p-12 text-white order-2 md:order-2",
      image: "relative w-full h-[250px] md:h-full order-1 md:order-1",
    },
    split: {
      container: "grid grid-rows-2 md:grid-cols-1 md:grid-rows-2 md:h-[500px]",
      content:
        "flex flex-col justify-center p-6 md:p-12 bg-black text-white order-2 md:order-1",
      image: "relative w-full h-[250px] md:h-full order-1 md:order-2",
    },
  };

  const style = variants[variant];

  return (
    <div className={cn("w-full flex-shrink-0", style.container, className)}>
      {/* Image Layer */}
      <div className={cn(style.image)}>
        <Image
          src={image || "/placeholder.png?height=600&width=800"}
          alt={imageAlt || "Promotional image"}
          fill
          className={
            imageObjectFit === "fill"
              ? "object-fill"
              : imageObjectFit === "contain"
              ? "object-contain"
              : "object-cover"
          }
          priority
          onError={(e) => {
            console.error("Failed to load image:", image);
            // Fallback to a placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.png?height=600&width=800";
          }}
        />
      </div>

      {/* Content Layer */}
      <div
        className={cn(style.content)}
        style={{
          backgroundColor:
            variant === "centered" ||
            variant === "overlay" ||
            variant === "minimalRight" ||
            variant === "minimalLeft"
              ? undefined // Use the gradient/overlay from className
              : backgroundColor?.includes("[")
              ? backgroundColor.split("-[")[1]?.slice(0, -1) || undefined
              : undefined,
        }}
      >
        <h2
          className="text-xl md:text-4xl font-bold mb-4"
          style={{
            fontFamily: titleFont ? getFontFamily(titleFont) : undefined,
            color: titleColor?.includes("[")
              ? titleColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
              : "#ffffff",
            fontSize: titleSize ? getFontSize(titleSize) : undefined,
          }}
        >
          {title}
        </h2>

        <p
          className="text-sm md:text-base mb-6 text-white/80"
          style={{
            fontFamily: descriptionFont
              ? getFontFamily(descriptionFont)
              : undefined,
            color: descriptionColor?.includes("[")
              ? descriptionColor.split("-[")[1]?.slice(0, -1) ||
                "rgba(255, 255, 255, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
            fontSize: descriptionSize
              ? getFontSize(descriptionSize)
              : undefined,
          }}
        >
          {description}
        </p>

        <Button
          asChild
          className="w-fit border-0"
          style={{
            fontFamily: buttonFont ? getFontFamily(buttonFont) : undefined,
            backgroundColor: buttonColor?.includes("[")
              ? buttonColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
              : "#ffffff",
            color: buttonTextColor?.includes("[")
              ? buttonTextColor.split("-[")[1]?.slice(0, -1) || "#000000"
              : "#000000",
            fontSize: buttonSize ? getFontSize(buttonSize) : undefined,
            borderRadius: buttonRadius
              ? getBorderRadius(buttonRadius)
              : undefined,
          }}
        >
          <Link href={isClickable ? buttonLink : "#"}>{buttonText}</Link>
        </Button>
      </div>
    </div>
  );
}
