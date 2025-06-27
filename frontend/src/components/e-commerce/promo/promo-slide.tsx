import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/e-commerce/ui/button";

export interface PromoSlideProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  imageAlt: string;
  variant?: "left" | "centered" | "right" | "overlay" | "minimalRight" | "minimalLeft" | "split";
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

export function PromoSlide({
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
      container: "relative h-[600px]",
      content: "absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-12 bg-black/50 text-white z-10",
      image: "absolute inset-0 w-full h-full",
    },
    overlay: {
      container: "relative h-[500px]",
      content: "absolute inset-0 flex flex-col justify-center p-6 md:p-12 bg-gradient-to-r from-black/80 to-transparent text-white z-10",
      image: "absolute inset-0 w-full h-full",
    },
    minimalRight: {
      container: "relative h-[500px]",
      content: "absolute bottom-0 left-0 right-0 p-6 md:p-12 bg-gradient-to-t from-black/80 to-transparent text-white z-10 text-right",
      image: "absolute inset-0 w-full h-full",
    },
    minimalLeft: {
      container: "relative h-[500px]",
      content: "absolute bottom-0 left-0 right-0 p-6 md:p-12 bg-gradient-to-t from-black/80 to-transparent text-white z-10",
      image: "absolute inset-0 w-full h-full object-fill",
    },
    left: {
      container: "grid md:grid-cols-2 md:h-[500px]",
      content: `flex flex-col justify-center p-6 md:p-12 ${backgroundColor} text-white order-2 md:order-1`, 
      image: "relative w-full h-[250px] md:h-full order-1 md:order-2", 
    },
    right: {
      container: "grid md:grid-cols-2 md:h-[500px]",
      content: `flex flex-col justify-center p-6 md:p-12 ${backgroundColor} text-white order-2 md:order-2`, 
      image: "relative w-full h-[250px] md:h-full order-1 md:order-1",
    },
    split: {
      container: "grid grid-rows-2 md:grid-cols-1 md:grid-rows-2 md:h-[500px]",
      content: "flex flex-col justify-center p-6 md:p-12 bg-black text-white order-2 md:order-1",
      image: "relative w-full h-[250px] md:h-full order-1 md:order-2",
    },
    
  };

  const style = variants[variant];

  return (
    <div className={cn("w-full flex-shrink-0", style.container, className)}>
      <div className={cn(style.content)}>
        <h2 className={cn(
          "text-xl md:text-4xl font-bold mb-4", 
          titleFont, 
          titleColor, 
          titleSize
        )}>
          {title}
        </h2>

        <p className={cn(
          "text-sm md:text-base mb-6 text-white/80", 
          descriptionFont, 
          descriptionColor, 
          descriptionSize
        )}>
          {description}
        </p>

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
          className={
            imageObjectFit === "fill"
              ? "object-fill"
              : imageObjectFit === "contain"
              ? "object-contain"
              : "object-cover"
          }
          priority
        />
      </div>
    </div>
  );
}
