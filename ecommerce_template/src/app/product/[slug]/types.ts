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

// Product variant type
export type ProductVariant = {
  color: string
  colorCode: string
  images: string[]
  sizes: string[]
  price: number
  compareAtPrice?: number
  inStock: boolean
}

// Product type
export type Product = {
  id: string
  name: string
  description: string
  category: string
  rating: number
  reviewCount: number
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
  variants: ProductVariant[]
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
