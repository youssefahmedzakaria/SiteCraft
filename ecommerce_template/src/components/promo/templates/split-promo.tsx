import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface SplitPromoProps {
  slides: {
    title: string;
    description?: string;
    buttonText: string;
    buttonLink: string;
    image: string;
    imageAlt: string;
  }[];
  autoplay?: boolean;
  showArrows?: boolean;
  titleFont?: string;
  titleColor?: string;
  titleSize?: string;
  buttonFont?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonSize?: string;
  className?: string;
  buttonRadius?: string;    
  backgroundColor?: string;
  imageObjectFit?: "cover" | "fill" | "contain" ;
  id?: string;
}

export function SplitPromo({
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
  const [left, right] = slides;
  return (
    <section id={id} className={cn(
      "grid grid-rows-2 gap-0 md:grid-cols-2 md:grid-rows-1 w-full h-auto md:h-[400px]",
      className
    )}>
      {[left, right].map((slide, idx) => (
        <div 
          key={idx} 
          className={cn(
            "relative h-[250px] md:h-full w-full", 
            "flex flex-col justify-end", 
            backgroundColor
          )}
        >
          <Image
            src={slide.image}
            alt={slide.imageAlt}
            fill
            className={`object-${imageObjectFit}`}
            priority
          />
          <div className="absolute inset-0 bg-black/20" /> 
          <div className={cn(
            "relative z-10 p-4 md:p-6 w-full", 
            "flex flex-col items-start"
          )}>
            <h2 className={cn("mb-2 md:mb-3", titleFont, titleColor, titleSize)}>
              {slide.title}
            </h2>
            {slide.description && (
              <p className="mb-3 md:mb-4 text-white/80 text-sm md:text-base"> 
                {slide.description}
              </p>
            )}
            <Link
              href={slide.buttonLink}
              className={cn(
                "px-4 py-1.5 rounded border transition-all text-sm", 
                buttonFont,
                buttonColor,
                buttonTextColor,
                buttonSize,
                buttonRadius
              )}
            >
              {slide.buttonText}
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}