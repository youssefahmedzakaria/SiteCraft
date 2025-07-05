/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LucideIcon } from "lucide-react"
import type { Product, ProductVariant } from "@/lib/products"

// Theme configuration type
export type ThemeConfig = {
  backgroundColor: string
  textColor: string
  accentColor: string
  secondaryColor: string
  borderRadius: string
  fontFamily: string
}

// Related product type for the related products component
export type RelatedProduct = {
  id: number
  name: string
  price: number
  compareAtPrice?: number
  image?: string
  category: string
  rating: number
  reviewCount: number
}

// Variant group type for product variants
export type VariantGroup = {
  id: string
  name: string
  type: "color" | "size" | "material" | "custom"
  required: boolean
  changesImages?: boolean
  displayStyle?: "color-circles" | "buttons" | "dropdown" | "image-grid"
  options: VariantOption[]
}

export type VariantOption = {
  id: string
  label: string
  value: string
  colorCode?: string
  imageUrl?: string
  productImages?: string[]
  metadata?: {
    priceAdjustment?: number
    [key: string]: any
  }
}