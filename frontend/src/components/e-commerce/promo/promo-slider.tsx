/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { PromoSlide } from "./promo-slide"
import { Button } from "@/components/e-commerce/ui/button"

export interface PromoSliderProps {
  isClickable?: boolean
  slides: {
    title: string
    description: string
    buttonText: string
    buttonLink: string
    image: string
    imageAlt: string
  }[]
  variant?: "left" | "centered" | "right" | "overlay" | "minimalRight" | "minimalLeft" | "split"
  autoPlay?: boolean
  autoplaySpeed?: number
  showArrows?: boolean
  className?: string
  titleFont?: string
  titleColor?: string
  titleSize?: string
  descriptionFont?: string
  descriptionColor?: string
  descriptionSize?: string
  buttonFont?: string
  buttonColor?: string
  buttonTextColor?: string
  buttonSize?: string
  buttonRadius?: string
  imageObjectFit?: "cover" | "fill" | "contain"
  backgroundColor?: string
}

export function PromoSlider({
  isClickable,
  slides,
  variant = "left",
  autoPlay = false,
  autoplaySpeed = 3000,
  showArrows = true,
  className,
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
  imageObjectFit,
  backgroundColor,
}: PromoSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const totalSlides = slides.length

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
  }, [totalSlides])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }, [totalSlides])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoPlay && totalSlides > 1) {
      interval = setInterval(() => {
        nextSlide()
      }, autoplaySpeed)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoPlay, autoplaySpeed, nextSlide, totalSlides])

  return (
    <div className={cn("relative overflow-hidden", className)} ref={sliderRef}>
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <PromoSlide
            key={index}
            title={slide.title}
            description={slide.description}
            buttonText={slide.buttonText}
            buttonLink={slide.buttonLink}
            image={slide.image}
            imageAlt={slide.imageAlt}
            variant={variant}
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
        ))}
      </div>

      {showArrows && totalSlides > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 shadow-none bg-transparent rounded-none p-0 hover:bg-transparent z-30"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 md:h-8 md:w-8 text-white/80" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 shadow-none bg-transparent rounded-none p-0 hover:bg-transparent z-30"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 md:h-8 md:w-8 text-white/80" />
          </Button>
        </>
      )}

      {totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                index === currentSlide ? "bg-white" : "bg-white/50",
              )}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
