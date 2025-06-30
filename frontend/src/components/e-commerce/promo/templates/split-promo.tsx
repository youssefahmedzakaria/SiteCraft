"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface SplitPromoProps {
  isClickable?: boolean
  slides: {
    title: string
    description?: string
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
  className?: string
  buttonRadius?: string
  backgroundColor?: string
  imageObjectFit?: "cover" | "fill" | "contain"
  id?: string
}

const getFontFamily = (fontFamily: string) => {
  switch (fontFamily) {
    case "font-inter":
      return "Inter, sans-serif"
    case "font-roboto":
      return "Roboto, sans-serif"
    case "font-open-sans":
      return "Open Sans, sans-serif"
    case "font-poppins":
      return "Poppins, sans-serif"
    case "font-lato":
      return "Lato, sans-serif"
    case "font-serif":
      return "serif"
    default:
      return "system-ui, sans-serif"
  }
}

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
  }
  return sizeMap[fontSize] || "1rem"
}

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
  }
  return radiusMap[radius] || "0.375rem"
}

export function SplitPromo({
  isClickable = true,
  backgroundColor,
  slides,
  titleFont,
  titleColor,
  titleSize = "text-xl md:text-2xl",
  buttonFont,
  buttonColor,
  buttonTextColor,
  buttonSize = "text-sm",
  buttonRadius,
  className,
  imageObjectFit = "cover",
  id,
}: SplitPromoProps) {
  const [left, right] = slides
  return (
    <section
      id={id}
      className={cn(
        "grid grid-rows-2 gap-0 md:grid-cols-2 md:grid-rows-1 w-full h-auto md:h-[400px]",
        className
      )}
      style={{
        backgroundColor: backgroundColor?.includes("[")
          ? backgroundColor.split("-[")[1]?.slice(0, -1) || undefined
          : undefined,
      }}
    >
      {[left, right].map((slide, idx) => (
        <div
          key={idx}
          className="relative h-[250px] md:h-full w-full flex flex-col justify-end"
        >
          <Image
            src={slide.image || "/placeholder.png"}
            alt={slide.imageAlt}
            fill
            className={`object-${imageObjectFit}`}
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 p-4 md:p-6 w-full flex flex-col items-start">
            <h2
              className="mb-2 md:mb-3"
              style={{
                fontFamily: titleFont ? getFontFamily(titleFont) : undefined,
                color: titleColor?.includes("[")
                  ? titleColor.split("-[")[1]?.slice(0, -1) || "#ffffff"
                  : "#ffffff",
                fontSize: titleSize ? getFontSize(titleSize) : undefined,
              }}
            >
              {slide.title}
            </h2>
            {slide.description && (
              <p className="mb-3 md:mb-4 text-white/80 text-sm md:text-base">
                {slide.description}
              </p>
            )}
            <Link
              href={isClickable ? slide.buttonLink : "#"}
              className="px-4 py-1.5 border transition-all text-sm"
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
              {slide.buttonText}
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}
