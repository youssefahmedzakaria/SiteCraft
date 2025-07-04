"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AboutUsProps {
  id?: string;
  title: string;
  image: string;
  imageAlt: string;
  variant?: "centered" | "top-image" | "left-aligned" | "right-aligned";
  className?: string;
  backgroundColor?: string;
  imageObjectFit?: "cover" | "fill" | "contain";
  titleFont?: string;
  titleColor?: string;
  titleSize?: string;
  sections: { sectionTitle: string; description: string }[];
  sectionColor?: string;
  sectionSize?: string;
  sectionFont?: string;
  sectionFontWeight?: string;
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
    case "font-sans":
      return "system-ui, sans-serif";
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

export function AboutUs({
  id,
  title,
  image,
  imageAlt,
  variant = "centered",
  className,
  backgroundColor = "bg-white",
  imageObjectFit = "cover",
  titleFont,
  titleColor,
  titleSize,
  sections,
  sectionColor,
  sectionSize,
  sectionFont,
  sectionFontWeight,
}: AboutUsProps) {
  const variants = {
    centered: {
      container: "py-8 md:py-16",
      content: "container mx-auto px-4",
      title:
        "text-2xl md:text-4xl lg:text-6xl font-light text-center mb-6 md:mb-12",
      section: "max-w-3xl mx-auto text-center",
      image: "relative h-[200px] md:h-[300px] lg:h-[400px] mb-6 md:mb-12",
    },
    "top-image": {
      container: "py-8 md:py-16",
      content: "container mx-auto px-4",
      title: "text-2xl md:text-4xl lg:text-5xl font-light mb-4 md:mb-0",
      section: "md:col-span-8 space-y-4",
      image:
        "relative h-[200px] md:h-[300px] lg:h-[400px] mb-6 md:mb-12 w-full",
    },
    "left-aligned": {
      container: "py-8 md:py-16",
      content: "container mx-auto px-4",
      title:
        "text-2xl md:text-4xl lg:text-6xl font-light text-left mb-6 md:mb-12",
      section: "space-y-4 md:space-y-6",
      image: "relative h-[250px] md:h-[350px] lg:h-[450px]",
    },
    "right-aligned": {
      container: "py-8 md:py-16",
      content: "container mx-auto px-4",
      title:
        "text-2xl md:text-4xl lg:text-6xl font-light text-left mb-6 md:mb-12",
      section: "space-y-4 md:space-y-6",
      image: "relative h-[250px] md:h-[350px] lg:h-[450px]",
    },
  };

  const style = variants[variant];

  return (
    <section
      id={id}
      className={cn(style.container, className)}
      style={{
        backgroundColor: backgroundColor?.includes("[")
          ? backgroundColor.split("-[")[1]?.slice(0, -1) || undefined
          : undefined,
      }}
    >
      <div className={style.content}>
        {variant === "top-image" ? (
          <>
            <div className={style.image}>
              <Image
                src={image || "/placeholder.png?height=400&width=800"}
                alt={imageAlt}
                fill
                className={cn(
                  "rounded-lg",
                  imageObjectFit === "fill"
                    ? "object-fill"
                    : imageObjectFit === "contain"
                    ? "object-contain"
                    : "object-cover"
                )}
                priority
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-4">
                <h2
                  className={cn(style.title)}
                  style={{
                    fontFamily: titleFont
                      ? getFontFamily(titleFont)
                      : undefined,
                    color: titleColor?.includes("[")
                      ? titleColor.split("-[")[1]?.slice(0, -1) || "#000000"
                      : "#000000",
                    fontSize: titleSize ? getFontSize(titleSize) : undefined,
                  }}
                >
                  {title}
                </h2>
              </div>
              <div className={style.section}>
                {sections.map((section, idx) => (
                  <div key={idx} className="mb-6">
                    <div
                      style={{
                        fontFamily: sectionFont ? getFontFamily(sectionFont) : undefined,
                        color: sectionColor?.includes("[")
                          ? sectionColor.split("-[")[1]?.slice(0, -1) || "#4B5563"
                          : sectionColor || "#4B5563",
                        fontSize: sectionSize ? getFontSize(sectionSize) : undefined,
                        fontWeight: sectionFontWeight || undefined,
                      }}
                    >
                      <span className="font-semibold">{section.sectionTitle}</span>: {section.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : variant === "left-aligned" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2
                className={cn(style.title)}
                style={{
                  fontFamily: titleFont ? getFontFamily(titleFont) : undefined,
                  color: titleColor?.includes("[")
                    ? titleColor.split("-[")[1]?.slice(0, -1) || "#000000"
                    : "#000000",
                  fontSize: titleSize ? getFontSize(titleSize) : undefined,
                }}
              >
                {title}
              </h2>
              <div className={style.section}>
                {sections.map((section, idx) => (
                  <div key={idx} className="mb-6">
                    <div
                      style={{
                        fontFamily: sectionFont ? getFontFamily(sectionFont) : undefined,
                        color: sectionColor?.includes("[")
                          ? sectionColor.split("-[")[1]?.slice(0, -1) || "#4B5563"
                          : sectionColor || "#4B5563",
                        fontSize: sectionSize ? getFontSize(sectionSize) : undefined,
                        fontWeight: sectionFontWeight || undefined,
                      }}
                    >
                      <span className="font-semibold">{section.sectionTitle}</span>: {section.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={style.image}>
              <Image
                src={image || "/placeholder.png?height=450&width=600"}
                alt={imageAlt}
                fill
                className={cn(
                  "rounded-lg",
                  imageObjectFit === "fill"
                    ? "object-fill"
                    : imageObjectFit === "contain"
                    ? "object-contain"
                    : "object-cover"
                )}
                priority
              />
            </div>
          </div>
        ) : variant === "right-aligned" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className={style.image}>
              <Image
                src={image || "/placeholder.png?height=450&width=600"}
                alt={imageAlt}
                fill
                className={cn(
                  "rounded-lg",
                  imageObjectFit === "fill"
                    ? "object-fill"
                    : imageObjectFit === "contain"
                    ? "object-contain"
                    : "object-cover"
                )}
                priority
              />
            </div>
            <div>
              <h2
                className={cn(style.title)}
                style={{
                  fontFamily: titleFont ? getFontFamily(titleFont) : undefined,
                  color: titleColor?.includes("[")
                    ? titleColor.split("-[")[1]?.slice(0, -1) || "#000000"
                    : "#000000",
                  fontSize: titleSize ? getFontSize(titleSize) : undefined,
                }}
              >
                {title}
              </h2>
              <div className={style.section}>
                {sections.map((section, idx) => (
                  <div key={idx} className="mb-6">
                    <div
                      style={{
                        fontFamily: sectionFont ? getFontFamily(sectionFont) : undefined,
                        color: sectionColor?.includes("[")
                          ? sectionColor.split("-[")[1]?.slice(0, -1) || "#4B5563"
                          : sectionColor || "#4B5563",
                        fontSize: sectionSize ? getFontSize(sectionSize) : undefined,
                        fontWeight: sectionFontWeight || undefined,
                      }}
                    >
                      <span className="font-semibold">{section.sectionTitle}</span>: {section.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={style.section}>
            <div className={style.image}>
              <Image
                src={image || "/placeholder.png?height=400&width=800"}
                alt={imageAlt}
                fill
                className={cn(
                  "rounded-lg",
                  imageObjectFit === "fill"
                    ? "object-fill"
                    : imageObjectFit === "contain"
                    ? "object-contain"
                    : "object-cover"
                )}
                priority
              />
            </div>
            <h2
              className={cn(style.title)}
              style={{
                fontFamily: titleFont ? getFontFamily(titleFont) : undefined,
                color: titleColor?.includes("[")
                  ? titleColor.split("-[")[1]?.slice(0, -1) || "#000000"
                  : "#000000",
                fontSize: titleSize ? getFontSize(titleSize) : undefined,
              }}
            >
              {title}
            </h2>
            {sections.map((section, idx) => (
              <div key={idx} className="mb-6">
                <div
                  style={{
                    fontFamily: sectionFont ? getFontFamily(sectionFont) : undefined,
                    color: sectionColor?.includes("[")
                      ? sectionColor.split("-[")[1]?.slice(0, -1) || "#4B5563"
                      : sectionColor || "#4B5563",
                    fontSize: sectionSize ? getFontSize(sectionSize) : undefined,
                    fontWeight: sectionFontWeight || undefined,
                  }}
                >
                  <span className="font-semibold">{section.sectionTitle}</span>: {section.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
