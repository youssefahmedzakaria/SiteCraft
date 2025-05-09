import Image from "next/image"
import { cn } from "@/lib/utils"

export interface AboutUsProps {
  title: string
  description: string
  image: string
  imageAlt: string
  variant?: "centered" | "top-image" | "left-aligned" | "right-aligned"
  className?: string
  backgroundColor?: string
  imageObjectFit?: "cover" | "fill" | "contain"
  titleFont?: string
  titleColor?: string
  titleSize?: string
  descriptionFont?: string
  descriptionColor?: string
  descriptionSize?: string
  secondaryDescription?: string
}

export function AboutUs({
  title,
  description,
  image,
  imageAlt,
  variant = "centered",
  className,
  backgroundColor = "bg-white",
  imageObjectFit,
  titleFont,
  titleColor,
  titleSize,
  descriptionFont,
  descriptionColor = "text-gray-600",
  descriptionSize = "text-base md:text-lg",
  secondaryDescription,
}: AboutUsProps) {
  const variants = {
    centered: {
      container: "py-8 md:py-16",
      content: "container mx-auto px-4",
      title: "text-2xl md:text-4xl lg:text-6xl font-light text-center mb-6 md:mb-12",
      description: "max-w-3xl mx-auto text-center",
      image: "relative h-[200px] md:h-[300px] lg:h-[400px] mb-6 md:mb-12",
    },
    "top-image": {
      container: "py-8 md:py-16",
      content: "container mx-auto px-4",
      title: "text-2xl md:text-4xl lg:text-5xl font-light mb-4 md:mb-0",
      description: "md:col-span-8 space-y-4",
      image: "relative h-[200px] md:h-[300px] lg:h-[400px] mb-6 md:mb-12 w-full",
    },
    "left-aligned": {
      container: "py-8 md:py-16",
      content: "container mx-auto px-4",
      title: "text-2xl md:text-4xl lg:text-6xl font-light text-left mb-6 md:mb-12",
      description: "space-y-4 md:space-y-6",
      image: "relative h-[250px] md:h-[350px] lg:h-[450px]",
    },
    "right-aligned": {
      container: "py-8 md:py-16",
      content: "container mx-auto px-4",
      title: "text-2xl md:text-4xl lg:text-6xl font-light text-left mb-6 md:mb-12",
      description: "space-y-4 md:space-y-6",
      image: "relative h-[250px] md:h-[350px] lg:h-[450px]",
    },
  }

  const style = variants[variant]

  return (
    <section className={cn(style.container, backgroundColor, className)}>
      <div className={style.content}>
        {variant === "top-image" ? (
          <>
            <div className={style.image}>
              <Image
                src={image || "/placeholder.svg"}
                alt={imageAlt}
                fill
                className={cn(
                  "object-cover rounded-lg",
                  imageObjectFit === "fill"
                    ? "object-fill"
                    : imageObjectFit === "contain"
                    ? "object-contain"
                    : "object-cover"
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-4">
                <h2 className={cn(style.title, titleFont, titleColor, titleSize)}>{title}</h2>
              </div>
              <div className={style.description}>
                <p className={cn(descriptionSize, descriptionColor)}>{description}</p>
                {secondaryDescription && (
                  <p className={cn(descriptionSize, descriptionColor)}>{secondaryDescription}</p>
                )}
              </div>
            </div>
          </>
        ) : variant === "left-aligned" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className={cn(style.title, titleFont, titleColor, titleSize)}>{title}</h2>
              <div className={style.description}>
                <p className={cn(descriptionSize, descriptionColor, "mb-4")}>{description}</p>
                {secondaryDescription && (
                  <p className={cn(descriptionSize, descriptionColor)}>{secondaryDescription}</p>
                )}
              </div>
            </div>
            <div className={style.image}>
              <Image
                src={image || "/placeholder.svg"}
                alt={imageAlt}
                fill
                className={cn(
                  "object-cover rounded-lg",
                  imageObjectFit === "fill"
                    ? "object-fill"
                    : imageObjectFit === "contain"
                    ? "object-contain"
                    : "object-cover"
                )}
              />
            </div>
          </div>
        ) : variant === "right-aligned" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className={style.image}>
              <Image
                src={image || "/placeholder.svg"}
                alt={imageAlt}
                fill
                className={cn(
                  "object-cover rounded-lg",
                  imageObjectFit === "fill"
                    ? "object-fill"
                    : imageObjectFit === "contain"
                    ? "object-contain"
                    : "object-cover"
                )}
              />
            </div>
            <div>
              <h2 className={cn(style.title, titleFont, titleColor, titleSize)}>{title}</h2>
              <div className={style.description}>
                <p className={cn(descriptionSize, descriptionColor, "mb-4")}>{description}</p>
                {secondaryDescription && (
                  <p className={cn(descriptionSize, descriptionColor)}>{secondaryDescription}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={style.description}>
            <div className={style.image}>
              <Image
                src={image || "/placeholder.svg"}
                alt={imageAlt}
                fill
                className={cn(
                  "object-cover rounded-lg",
                  imageObjectFit === "fill"
                    ? "object-fill"
                    : imageObjectFit === "contain"
                    ? "object-contain"
                    : "object-cover"
                )}
              />
            </div>
            <h2 className={cn(style.title, titleFont, titleColor, titleSize)}>{title}</h2>
            <p className={cn(descriptionSize, descriptionColor, "mb-4 md:mb-8")}>{description}</p>
            {secondaryDescription && (
              <p className={cn(descriptionSize, descriptionColor)}>{secondaryDescription}</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
