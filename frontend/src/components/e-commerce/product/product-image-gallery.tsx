"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { ThemeConfig } from "@/app/e-commerce/[subdomain]/product/[slug]/product"

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  theme: ThemeConfig
}

export function ProductImageGallery({ images, productName, theme }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  // Reset selected image when images change
  useEffect(() => {
    setSelectedImage(0)
  }, [images])

  return (
    <div className="space-y-6">
      <div className={cn("relative aspect-square overflow-hidden", theme.borderRadius)}>
        <Image
          src={images[selectedImage] || "/placeholder.svg?height=600&width=600"}
          alt={productName}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={cn(
              "relative aspect-square overflow-hidden bg-white transition-all group",
              theme.borderRadius,
              selectedImage === index ? `ring-2 ring-[${theme.secondaryColor}]` : "hover:ring-2 hover:ring-gray-300",
            )}
            style={{
              borderColor: selectedImage === index ? theme.secondaryColor : undefined,
            }}
          >
            <Image
              src={image || "/placeholder.svg?height=150&width=150"}
              alt={`${productName} - Image ${index + 1}`}
              fill
              className="object-cover"
            />
            <div
              className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity", "bg-black/5")}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
