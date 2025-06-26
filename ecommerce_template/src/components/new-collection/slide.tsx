import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface NewCollectionSlideProps {
  title: string
  buttonText: string
  buttonLink: string
  image: string
  imageAlt: string
  variant?: "left" | "centered" | "right" | "overlay" | "minimalRight" | "minimalLeft"
  className?: string
  backgroundColor?: string
  imageObjectFit?: "cover" | "fill" | "contain"
  titleFont?: string
  titleColor?: string
  titleSize?: string
  buttonFont?: string
  buttonColor?: string
  buttonTextColor?: string
  buttonSize?: string
  buttonRadius?: string
}

export function NewCollectionSlide({
  title,
  buttonText,
  buttonLink,
  image,
  imageAlt,
  variant = "centered",
  className,
  backgroundColor = "bg-[#F5ECD5]",
  imageObjectFit,
  titleFont = "font-sans",
  titleColor = "text-white",
  titleSize = "text-4xl md:text-6xl",
  buttonFont = "font-sans",
  buttonColor = "bg-white",
  buttonTextColor = "text-black",
  buttonSize = "text-lg",
  buttonRadius = "rounded-md",
}: NewCollectionSlideProps) {
  const variants = {
    centered: {
      container: "relative h-[500px] md:h-screen",
      content: "absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-12 bg-black/50 text-white z-10",
      image: "absolute inset-0 w-full h-full",
    },
    overlay: {
      container: "relative h-[500px] md:h-screen",
      content: "absolute inset-0 flex flex-col justify-center p-6 md:p-12 bg-gradient-to-r from-black/80 to-transparent text-white z-10",
      image: "absolute inset-0 w-full h-full",
    },
    minimalRight: {
      container: "relative h-[500px] md:h-screen",
      content: "absolute bottom-0 left-0 right-0 p-6 md:p-12 bg-gradient-to-t from-black/80 to-transparent text-white z-10 text-right",
      image: "absolute inset-0 w-full h-full",
    },
    minimalLeft: {
      container: "relative h-[500px] md:h-screen",
      content: "absolute bottom-0 left-0 right-0 p-6 md:p-12 bg-gradient-to-t from-black/80 to-transparent text-white z-10",
      image: "absolute inset-0 w-full h-full",
    },
    left: {
      container: "grid md:grid-cols-2 md:h-[500px]",
      content: "flex flex-col justify-center p-6 md:p-12 text-white order-2 md:order-1 z-10",
      image: "relative w-full h-[250px] md:h-full order-1 md:order-2",
    },
    right: {
      container: "grid md:grid-cols-2 md:h-[500px]",
      content: "flex flex-col justify-center p-6 md:p-12 text-white order-2 md:order-2 z-10",
      image: "relative w-full h-[250px] md:h-full order-1 md:order-1",
    },
  }

  const style = variants[variant]

  return (
    <div className={cn("w-full flex-shrink-0", style.container, className)}>
      <div className={cn(style.content, 
        (variant === "left" || variant === "right") ? backgroundColor : "")}>
        <h2 className={cn(
          "font-bold mb-6", 
          titleFont, 
          titleColor, 
          titleSize
        )}>
          {title}
        </h2>
        
        <Button asChild className={cn(
          "w-fit", 
          buttonFont, 
          buttonColor, 
          buttonTextColor, 
          buttonSize, 
          buttonRadius
        )}>
          <Link href={buttonLink}>{buttonText}</Link>
        </Button>
      </div>

      <div className={style.image}>
        <Image
          src={image || "/placeholder.svg"}
          alt={imageAlt}
          fill
          className={cn(
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
  )
}