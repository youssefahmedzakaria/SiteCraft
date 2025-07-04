"use client"

import { cn } from "@/lib/utils"

export interface PoliciesProps {
  id?: string
  title?: string
  sections?: Array<{
    title: string
    content: string
  }>
  variant?: "centered" | "default" | "left" | "titleLeftContentCenter"
  backgroundColor?: string
  titleColor?: string
  titleSize?: string
  titleFont?: string
  titleFontWeight?: string
  sectionTitleColor?: string
  sectionTitleSize?: string
  sectionTitleFont?: string
  sectionTitleFontWeight?: string
  sectionContentColor?: string
  sectionContentSize?: string
  sectionContentFont?: string
  sectionContentFontWeight?: string
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
    case "font-sans":
      return "system-ui, sans-serif"
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

const getFontWeight = (fontWeight: string) => {
  const weightMap: Record<string, string> = {
    "font-thin": "100",
    "font-extralight": "200",
    "font-light": "300",
    "font-normal": "400",
    "font-medium": "500",
    "font-semibold": "600",
    "font-bold": "700",
    "font-extrabold": "800",
    "font-black": "900",
  }
  return weightMap[fontWeight] || "400"
}

export function Policies({
  id,
  variant = "default",
  title = "Our Policies",
  sections = [],
  backgroundColor,
  titleColor,
  titleSize,
  titleFont,
  titleFontWeight,
  sectionTitleColor,
  sectionTitleSize,
  sectionTitleFont,
  sectionTitleFontWeight,
  sectionContentColor,
  sectionContentSize,
  sectionContentFont,
  sectionContentFontWeight,
}: PoliciesProps) {
  const variants = {
    centered: {
      container: "py-8 md:py-16",
      wrapper: "max-w-4xl mx-auto px-4 text-center",
      title: "text-2xl md:text-4xl lg:text-6xl text-center mb-8 md:mb-12",
      sectionTitle: "text-lg md:text-2xl text-center mb-3 md:mb-4",
      sectionContent: "text-center mb-8 md:mb-12",
    },
    default: {
      container: "py-8 md:py-16",
      wrapper: "max-w-6xl mx-auto px-4",
      title: "text-2xl md:text-4xl lg:text-6xl text-center mb-8 md:mb-12",
      sectionTitle: "text-lg md:text-2xl mb-3 md:mb-4",
      sectionContent: "mb-8 md:mb-12",
    },
    left: {
      container: "py-8 md:py-16",
      wrapper: "max-w-6xl mx-auto px-4",
      title: "text-2xl md:text-4xl lg:text-6xl text-left mb-8 md:mb-12",
      sectionTitle: "text-lg md:text-2xl mb-3 md:mb-4",
      sectionContent: "mb-8 md:mb-12",
    },
    titleLeftContentCenter: {
      container: "py-8 md:py-16",
      wrapper: "max-w-6xl mx-auto px-4",
      title: "text-2xl md:text-4xl lg:text-6xl mb-2 md:mb-4",
      sectionTitle: "text-lg md:text-2xl text-center mb-3 md:mb-4",
      sectionContent: "text-center",
    },
  }

  const style = variants[variant]

  return (
    <section
      id={id}
      className={cn("w-full flex-shrink-0", style.container)}
      style={{
        backgroundColor: backgroundColor?.includes("[")
          ? backgroundColor.split("-[")[1]?.slice(0, -1) || undefined
          : undefined,
      }}
    >
      <div className={style.wrapper}>
        {variant === "titleLeftContentCenter" ? (
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8">
            <div className="flex flex-col mb-6 md:mb-0">
              <h2
                className={cn(style.title)}
                style={{
                  fontFamily: titleFont ? getFontFamily(titleFont) : undefined,
                  color: titleColor?.includes("[") ? titleColor.split("-[")[1]?.slice(0, -1) || "#000000" : "#000000",
                  fontSize: titleSize ? getFontSize(titleSize) : undefined,
                  fontWeight: titleFontWeight ? getFontWeight(titleFontWeight) : undefined,
                }}
              >
                {title}
              </h2>
            </div>
            <div className="space-y-6 md:space-y-8 md:col-span-2">
              {sections.map((section, index) => (
                <div key={index} className="mb-8">
                  <h3
                    className={cn(style.sectionTitle)}
                    style={{
                      fontFamily: sectionTitleFont ? getFontFamily(sectionTitleFont) : undefined,
                      color: sectionTitleColor?.includes("[")
                        ? sectionTitleColor.split("-[")[1]?.slice(0, -1) || "#000000"
                        : "#000000",
                      fontSize: sectionTitleSize ? getFontSize(sectionTitleSize) : undefined,
                      fontWeight: sectionTitleFontWeight ? getFontWeight(sectionTitleFontWeight) : undefined,
                    }}
                  >
                    {section.title}
                  </h3>
                  <p
                    className={cn(style.sectionContent)}
                    style={{
                      fontFamily: sectionContentFont ? getFontFamily(sectionContentFont) : undefined,
                      color: sectionContentColor?.includes("[")
                        ? sectionContentColor.split("-[")[1]?.slice(0, -1) || "#4B5563"
                        : "#4B5563",
                      fontSize: sectionContentSize ? getFontSize(sectionContentSize) : undefined,
                      fontWeight: sectionContentFontWeight ? getFontWeight(sectionContentFontWeight) : undefined,
                    }}
                  >
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <h2
              className={cn(style.title)}
              style={{
                fontFamily: titleFont ? getFontFamily(titleFont) : undefined,
                color: titleColor?.includes("[") ? titleColor.split("-[")[1]?.slice(0, -1) || "#000000" : "#000000",
                fontSize: titleSize ? getFontSize(titleSize) : undefined,
                fontWeight: titleFontWeight ? getFontWeight(titleFontWeight) : undefined,
              }}
            >
              {title}
            </h2>
            <div className="max-w-4xl mx-auto">
              {sections.map((section, index) => (
                <div key={index} className="mb-8">
                  <h3
                    className={cn(style.sectionTitle)}
                    style={{
                      fontFamily: sectionTitleFont ? getFontFamily(sectionTitleFont) : undefined,
                      color: sectionTitleColor?.includes("[")
                        ? sectionTitleColor.split("-[")[1]?.slice(0, -1) || "#000000"
                        : "#000000",
                      fontSize: sectionTitleSize ? getFontSize(sectionTitleSize) : undefined,
                      fontWeight: sectionTitleFontWeight ? getFontWeight(sectionTitleFontWeight) : undefined,
                    }}
                  >
                    {section.title}
                  </h3>
                  <p
                    className={cn(style.sectionContent)}
                    style={{
                      fontFamily: sectionContentFont ? getFontFamily(sectionContentFont) : undefined,
                      color: sectionContentColor?.includes("[")
                        ? sectionContentColor.split("-[")[1]?.slice(0, -1) || "#4B5563"
                        : "#4B5563",
                      fontSize: sectionContentSize ? getFontSize(sectionContentSize) : undefined,
                      fontWeight: sectionContentFontWeight ? getFontWeight(sectionContentFontWeight) : undefined,
                    }}
                  >
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
