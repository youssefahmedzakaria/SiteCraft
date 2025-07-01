/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LucideIcon } from "lucide-react"

// Theme configuration type
export type ThemeConfig = {
  backgroundColor: string
  textColor: string
  accentColor: string
  secondaryColor: string
  borderRadius: string
  fontFamily: string
}

// Flexible variant system types
export interface VariantOption {
  id: string
  label: string
  value: string
  // For color variants
  colorCode?: string
  // For pattern/texture variants
  imageUrl?: string
  // For variants that change product images
  productImages?: string[]
  // Additional data
  metadata?: Record<string, any>
}

export interface VariantGroup {
  id: string
  name: string
  type: "color" | "size" | "material" | "pattern" | "custom"
  required?: boolean
  options: VariantOption[]
  // Whether selecting this variant changes the main product images
  changesImages?: boolean
  // Display style for this variant group
  displayStyle?: "buttons" | "dropdown" | "color-circles" | "image-grid"
}

// Updated Product type to use new variant system
export type Product = {
  id: string
  name: string
  description: string
  category: string
  rating: number
  reviewCount: number
  basePrice: number
  compareAtPrice?: number
  shipping: {
    free: boolean
    estimatedDays: string
  }
  features: {
    icon: LucideIcon
    title: string
    description: string
  }[]
  additionalInfoSections: {
    title: string
    description: string
  }[]
  variantGroups: VariantGroup[]
  // Default product images when no variant is selected
  defaultImages: string[]
}

// Review type
export type Review = {
  id: string
  author: string
  avatar?: string
  rating: number
  date: string
  title: string
  comment: string
  helpful: number
  verified: boolean
}

// Related product type
export type RelatedProduct = {
  id: string
  name: string
  image: string
  price: number
  compareAtPrice?: number
  rating: number
  reviewCount: number
  category: string
}

export type ProductVariant = {
  price: number
  compareAtPrice?: number
  inStock: boolean
}
