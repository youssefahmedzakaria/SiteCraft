"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Theme configuration with customizable colors
type ThemeConfig = {
  primaryColor: string
  secondaryColor: string
  textColor: string
  hoverOverlay: string
  borderRadius: string
  fontFamily: string
}

// Product variant type
type ProductVariant = {
  title: string
  color: string
  colorCode: string
  images: string[]
  sizes: string[]
  price: number
  compareAtPrice?: number
  inStock: boolean
  options?: Record<string, string>
}

// Product type
type Product = {
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
    icon: any
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
type Review = {
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
type RelatedProduct = {
  id: string
  name: string
  image: string
  price: number
  compareAtPrice?: number
  rating: number
  reviewCount: number
  category: string
  sales: number
}

// Sample product data
const productData: Product = {
  id: "diamond-ring-1",
  name: "Diamond Solitaire Ring",
  description:
    "A timeless diamond solitaire ring that captures the essence of elegance and sophistication. This stunning piece features a brilliant-cut diamond set in a classic four-prong setting, allowing maximum light to showcase the stone's natural beauty. The band is crafted from 18k white gold, providing a perfect complement to the diamond's sparkle.",
  category: "Rings",
  rating: 4.8,
  reviewCount: 124,
  shipping: {
    free: true,
    estimatedDays: "2-4",
  },
  features: [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $500",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure payment",
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      description: "30 days return policy",
    },
  ],
  additionalInfoSections: [
    {
      title: "shortDesc",
      description: "A stunning diamond solitaire ring that symbolizes eternal love and commitment.",
    },
    {
      title: "specifications",
      description:
        "Material: 18k White Gold\nDiamond: 1.0 Carat\nCut: Brilliant\nColor: D\nClarity: VVS1\nBand Width: 2mm\nRing Size: Adjustable (4-10)\nWeight: 3.5g",
    },
  ],
  variants: [
    {
      title: "Classic White Gold",
      color: "White Gold",
      colorCode: "#E0E0E0",
      images: ["/hand.jpg", "/hand.jpg", "/hand.jpg", "/hand.jpg", "/hand.jpg", "/hand.jpg"],
      sizes: ["6", "7", "8", "9", "10"],
      price: 1299,
      compareAtPrice: 1599,
      inStock: true,
      options: {
        material: "18k White Gold",
        finish: "Polished",
      },
    },
    {
      title: "Elegant Yellow Gold",
      color: "Yellow Gold",
      colorCode: "#FFD700",
      images: ["/ring3.jpg", "/ring3.jpg", "/ring3.jpg", "/ring3.jpg"],
      sizes: ["6", "7", "8", "9"],
      price: 1349,
      compareAtPrice: 1649,
      inStock: true,
      options: {
        material: "18k Yellow Gold",
        finish: "Matte",
      },
    },
    {
      title: "Romantic Rose Gold",
      color: "Rose Gold",
      colorCode: "#B76E79",
      images: ["/ring2.jpg", "/ring2.jpg", "/ring2.jpg", "/ring2.jpg"],
      sizes: ["7", "8", "9", "10"],
      price: 1399,
      compareAtPrice: 1699,
      inStock: true,
      options: {
        material: "18k Rose Gold",
        finish: "Brushed",
      },
    },
    {
      title: "Premium Platinum",
      color: "Platinum",
      colorCode: "#E5E4E2",
      images: ["/ring.jpg", "/ring.jpg", "/ring.jpg", "/ring.jpg"],
      sizes: ["6", "7", "8"],
      price: 1599,
      compareAtPrice: 1899,
      inStock: false,
      options: {
        material: "Platinum 950",
        finish: "High Polish",
      },
    },
  ],
}

// Sample reviews data
const reviewsData: Review[] = [
  {
    id: "review-1",
    author: "Sarah Johnson",
    avatar: "/avatar-1.jpg",
    rating: 5,
    date: "2023-11-15",
    title: "Absolutely stunning!",
    comment:
      "I received this ring as an anniversary gift and I couldn't be happier. The diamond sparkles beautifully in any light and the craftsmanship is exceptional. It's comfortable to wear daily and I've received so many compliments!",
    helpful: 24,
    verified: true,
  },
  {
    id: "review-2",
    author: "Michael Thompson",
    rating: 4,
    date: "2023-10-22",
    title: "Beautiful ring, slightly smaller than expected",
    comment:
      "The ring is gorgeous and my fiancée loves it. The diamond quality is excellent and the setting is secure. My only comment is that it appeared slightly smaller in person than in the photos, but that doesn't take away from its beauty.",
    helpful: 12,
    verified: true,
  },
  {
    id: "review-3",
    author: "Emily Davis",
    avatar: "/avatar-3.jpg",
    rating: 5,
    date: "2023-09-10",
    title: "Perfect engagement ring",
    comment:
      "I proposed with this ring and it was perfect! The diamond catches the light beautifully and the white gold band complements it perfectly. The packaging was also very elegant. Highly recommend!",
    helpful: 18,
    verified: true,
  },
  {
    id: "review-4",
    author: "Robert Wilson",
    rating: 3,
    date: "2023-08-15",
    title: "Good quality but shipping took longer than expected",
    comment:
      "The ring itself is beautiful and well-made. My only issue was with the shipping time which was longer than the estimated delivery window. Customer service was helpful in tracking the package though.",
    helpful: 5,
    verified: true,
  },
]

// Sample related products sorted by sales (top selling)
const relatedProducts: RelatedProduct[] = [
  {
    id: "diamond-necklace-1",
    name: "Diamond Pendant Necklace",
    image: "/simple-necklace.jpg",
    price: 799,
    compareAtPrice: 999,
    rating: 4.9,
    reviewCount: 112,
    category: "Necklaces",
    sales: 342,
  },
  {
    id: "diamond-bracelet-1",
    name: "Diamond Tennis Bracelet",
    image: "/about.jpg",
    price: 1499,
    rating: 4.8,
    reviewCount: 74,
    category: "Bracelets",
    sales: 287,
  },
  {
    id: "diamond-earrings-1",
    name: "Diamond Stud Earrings",
    image: "/earing.jpg",
    price: 899,
    compareAtPrice: 1099,
    rating: 4.7,
    reviewCount: 86,
    category: "Earrings",
    sales: 265,
  },
  {
    id: "diamond-ring-2",
    name: "Three Stone Diamond Ring",
    image: "/ring.jpg",
    price: 1899,
    compareAtPrice: 2199,
    rating: 4.6,
    reviewCount: 58,
    category: "Rings",
    sales: 198,
  },
]

// Theme configuration with primary and secondary colors
const defaultTheme: ThemeConfig = {
  primaryColor: "#F5ECD5", 
  secondaryColor: "#4A102A",
  textColor: "#4A102A", 
  hoverOverlay: "bg-black/5", 
  borderRadius: "rounded-lg",
  fontFamily: "font-sans",
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(productData.variants[0].sizes[0])
  const [reviewsTab, setReviewsTab] = useState("all")

  // Get the current variant
  const currentVariant = productData.variants[selectedVariantIndex]

  // Handle color change
  const handleColorChange = (index: number) => {
    setSelectedVariantIndex(index)
    setSelectedImage(0)

    // Set a size that's available in the new variant
    if (!currentVariant.sizes.includes(selectedSize)) {
      setSelectedSize(currentVariant.sizes[0])
    }
  }

  // Handle add to cart
  const handleAddToCart = () => {
    console.log("Adding to cart:", {
      product: productData,
      variant: currentVariant,
      size: selectedSize,
      quantity,
    })
  }

  // Handle add to favorites
  const handleAddToFavorites = () => {
    console.log("Adding to favorites:", {
      product: productData,
      variant: currentVariant,
    })
  }

  // Filter reviews based on selected tab
  const filteredReviews = reviewsData.filter((review) => {
    if (reviewsTab === "all") return true
    if (reviewsTab === "5star") return review.rating === 5
    if (reviewsTab === "4star") return review.rating === 4
    if (reviewsTab === "3star") return review.rating === 3
    if (reviewsTab === "2star") return review.rating === 2
    if (reviewsTab === "1star") return review.rating === 1
    return true
  })

  // Calculate average rating
  const averageRating = reviewsData.reduce((total, review) => total + review.rating, 0) / reviewsData.length

  // Count reviews by rating
  const ratingCounts = {
    5: reviewsData.filter((r) => r.rating === 5).length,
    4: reviewsData.filter((r) => r.rating === 4).length,
    3: reviewsData.filter((r) => r.rating === 3).length,
    2: reviewsData.filter((r) => r.rating === 2).length,
    1: reviewsData.filter((r) => r.rating === 1).length,
  }

  // Sort related products by sales (top selling)
  const topSellingProducts = [...relatedProducts].sort((a, b) => b.sales - a.sales).slice(0, 4)

  return (
    <div
      className={cn("min-h-screen pt-20", `bg-[${theme.primaryColor}]`, `text-[${theme.textColor}]`, theme.fontFamily)}
      style={{ backgroundColor: theme.primaryColor, color: theme.textColor }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Product Main Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <div className={cn("relative aspect-square overflow-hidden", theme.borderRadius)}>
              <Image
                src={currentVariant.images[selectedImage] || "/placeholder.svg?height=600&width=600"}
                alt={productData.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {currentVariant.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative aspect-square overflow-hidden bg-white transition-all group",
                    theme.borderRadius,
                    selectedImage === index
                      ? `ring-2 ring-[${theme.secondaryColor}]`
                      : "hover:ring-2 hover:ring-gray-300",
                  )}
                  style={{
                    borderColor: selectedImage === index ? theme.secondaryColor : undefined,
                  }}
                >
                  <Image
                    src={image || "/placeholder.svg?height=150&width=150"}
                    alt={`${productData.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                      theme.hoverOverlay,
                    )}
                  ></div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">{productData.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn("w-5 h-5", i < Math.floor(productData.rating) ? "fill-current" : "text-gray-300")}
                      style={{ color: i < Math.floor(productData.rating) ? theme.secondaryColor : undefined }}
                    />
                  ))}
                  <span className="ml-2 text-sm opacity-75">({productData.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold">${currentVariant.price}</span>
              {currentVariant.compareAtPrice && (
                <span className="text-xl opacity-75 line-through">${currentVariant.compareAtPrice}</span>
              )}
              {currentVariant.compareAtPrice && (
                <span className="text-sm font-medium" style={{ color: theme.secondaryColor }}>
                  Save ${currentVariant.compareAtPrice - currentVariant.price}
                </span>
              )}
            </div>

            {/* Product Variants */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Color</label>
                <div className="flex flex-wrap gap-3">
                  {productData.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => handleColorChange(index)}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 group relative",
                        selectedVariantIndex === index ? "border-current" : "border-gray-200 hover:border-gray-300",
                      )}
                      title={variant.title}
                    >
                      <span className="w-8 h-8 rounded-full" style={{ backgroundColor: variant.colorCode }} />
                      <div
                        className={cn(
                          "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                          theme.hoverOverlay,
                        )}
                      ></div>
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-sm opacity-75">
                  <p>Selected: {currentVariant.title}</p>
                  {currentVariant.options && (
                    <div className="mt-1">
                      {Object.entries(currentVariant.options).map(([key, value]) => (
                        <p key={key}>
                          {key}: {value}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Size</label>
                <div className="flex flex-wrap gap-2">
                  {currentVariant.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "px-4 py-2 border text-sm font-medium group relative",
                        theme.borderRadius,
                        selectedSize === size ? "border-current bg-white/20" : "border-gray-200 hover:border-gray-300",
                      )}
                    >
                      {size}
                      <div
                        className={cn(
                          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                          theme.borderRadius,
                          theme.hoverOverlay,
                        )}
                      ></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={cn("flex items-center border", theme.borderRadius)}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-white/20 border-r group relative"
                    aria-label="Decrease quantity"
                  >
                    -
                    <div
                      className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                        theme.hoverOverlay,
                      )}
                    ></div>
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-white/20 border-l group relative"
                    aria-label="Increase quantity"
                  >
                    +
                    <div
                      className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                        theme.hoverOverlay,
                      )}
                    ></div>
                  </button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className={cn("flex-1 h-12 text-base group relative")}
                  style={{ backgroundColor: theme.secondaryColor, color: theme.primaryColor }}
                  disabled={!currentVariant.inStock}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {currentVariant.inStock ? "Add to Cart" : "Out of Stock"}
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                      theme.hoverOverlay,
                    )}
                  ></div>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAddToFavorites}
                  className="h-12 w-12 p-0 group relative"
                  aria-label="Add to favorites"
                >
                  <Heart className="w-5 h-5" />
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                      theme.hoverOverlay,
                    )}
                  ></div>
                </Button>
                <Button variant="outline" className="h-12 w-12 p-0 group relative" aria-label="Share product">
                  <Share2 className="w-5 h-5" />
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                      theme.hoverOverlay,
                    )}
                  ></div>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {productData.features.map((feature, index) => (
                  <div
                    key={index}
                    className={cn("flex items-center gap-3 p-4 group relative", theme.borderRadius)}
                    style={{ backgroundColor: `${theme.secondaryColor}20` }}
                  >
                    <feature.icon className="w-5 h-5" />
                    <div>
                      <h4 className="font-medium text-sm">{feature.title}</h4>
                      <p className="text-sm opacity-75">{feature.description}</p>
                    </div>
                    <div
                      className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                        theme.borderRadius,
                        theme.hoverOverlay,
                      )}
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start bg-white/20">
                <TabsTrigger value="description" className="group relative data-[state=active]:bg-white/30">
                  Description
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                      theme.hoverOverlay,
                    )}
                  ></div>
                </TabsTrigger>
                <TabsTrigger value="specifications" className="group relative data-[state=active]:bg-white/30">
                  Specifications
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                      theme.hoverOverlay,
                    )}
                  ></div>
                </TabsTrigger>
                <TabsTrigger value="shipping" className="group relative data-[state=active]:bg-white/30">
                  Shipping & Returns
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                      theme.hoverOverlay,
                    )}
                  ></div>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-6">
                <p className="opacity-90 leading-relaxed">{productData.description}</p>
              </TabsContent>
              <TabsContent value="specifications" className="mt-6">
                <div className="space-y-4">
                  <p className="opacity-90 whitespace-pre-line">
                    {
                      productData.additionalInfoSections.find((section) => section.title === "specifications")
                        ?.description
                    }
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="shipping" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    <span className="font-medium">Free Shipping</span>
                  </div>
                  <p className="opacity-90">Estimated delivery: {productData.shipping.estimatedDays} business days</p>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    <span className="font-medium">30-Day Return Policy</span>
                  </div>
                  <p className="opacity-90">
                    If you are not completely satisfied with your purchase, you can return it within 30 days for a full
                    refund.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Products Section */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold mb-8">Top Selling Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {topSellingProducts.map((product) => (
              <Card
                key={product.id}
                className={cn("overflow-hidden group relative", theme.borderRadius)}
                style={{ backgroundColor: `${theme.secondaryColor}10` }}
              >
                <div className="relative aspect-square">
                  <Image
                    src={product.image || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                      theme.hoverOverlay,
                    )}
                  ></div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/product/${product.id}`} className="font-medium hover:underline line-clamp-2 flex-1">
                      {product.name}
                    </Link>
                    <Badge
                      variant="outline"
                      className="ml-2"
                      style={{ borderColor: theme.secondaryColor, color: theme.secondaryColor }}
                    >
                      {product.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn("w-4 h-4", i < Math.floor(product.rating) ? "fill-current" : "text-gray-300")}
                        style={{ color: i < Math.floor(product.rating) ? theme.secondaryColor : undefined }}
                      />
                    ))}
                    <span className="text-xs opacity-75 ml-1">({product.reviewCount})</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold">${product.price}</span>
                      {product.compareAtPrice && (
                        <span className="text-sm opacity-75 line-through">${product.compareAtPrice}</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className={cn("rounded-full w-8 h-8 p-0 group relative")}
                      style={{ borderColor: theme.secondaryColor, color: theme.secondaryColor }}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <div
                        className={cn(
                          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full",
                          theme.hoverOverlay,
                        )}
                      ></div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mt-20 mb-16">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Review Summary */}
            <div
              className={cn("p-6", theme.borderRadius, "relative")}
              style={{ backgroundColor: `${theme.secondaryColor}20` }}
            >
              <div className="text-center mb-6">
                <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn("w-5 h-5", i < Math.floor(averageRating) ? "fill-current" : "text-gray-300")}
                      style={{ color: i < Math.floor(averageRating) ? theme.secondaryColor : undefined }}
                    />
                  ))}
                </div>
                <p className="text-sm opacity-75">Based on {reviewsData.length} reviews</p>
              </div>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="flex items-center gap-1 w-16">
                      {rating} <Star className="w-4 h-4 fill-current" />
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(ratingCounts[rating as keyof typeof ratingCounts] / reviewsData.length) * 100}%`,
                          backgroundColor: theme.secondaryColor,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs opacity-75 w-8 text-right">
                      {ratingCounts[rating as keyof typeof ratingCounts]}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  className={cn("w-full group relative")}
                  style={{ backgroundColor: theme.secondaryColor, color: theme.primaryColor }}
                >
                  Write a Review
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                      theme.hoverOverlay,
                    )}
                  ></div>
                </Button>
              </div>
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                  theme.borderRadius,
                  theme.hoverOverlay,
                )}
              ></div>
            </div>

            {/* Reviews List */}
            <div className="md:col-span-2">
              <Tabs defaultValue="all" onValueChange={setReviewsTab}>
                <TabsList className="bg-white/20">
                  <TabsTrigger value="all" className="group relative data-[state=active]:bg-white/30">
                    All Reviews
                    <div
                      className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                        theme.hoverOverlay,
                      )}
                    ></div>
                  </TabsTrigger>
                  <TabsTrigger value="5star" className="group relative data-[state=active]:bg-white/30">
                    5 Star
                    <div
                      className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                        theme.hoverOverlay,
                      )}
                    ></div>
                  </TabsTrigger>
                  <TabsTrigger value="4star" className="group relative data-[state=active]:bg-white/30">
                    4 Star
                    <div
                      className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                        theme.hoverOverlay,
                      )}
                    ></div>
                  </TabsTrigger>
                  <TabsTrigger value="3star" className="group relative data-[state=active]:bg-white/30">
                    3 Star
                    <div
                      className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                        theme.hoverOverlay,
                      )}
                    ></div>
                  </TabsTrigger>
                  <TabsTrigger value="2star" className="group relative data-[state=active]:bg-white/30">
                    2 Star
                    <div
                      className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                        theme.hoverOverlay,
                      )}
                    ></div>
                  </TabsTrigger>
                  <TabsTrigger value="1star" className="group relative data-[state=active]:bg-white/30">
                    1 Star
                    <div
                      className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                        theme.hoverOverlay,
                      )}
                    ></div>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={reviewsTab} className="mt-6">
                  <div className="space-y-6">
                    {filteredReviews.length > 0 ? (
                      filteredReviews.map((review) => (
                        <div
                          key={review.id}
                          className={cn("p-6 border group relative", theme.borderRadius)}
                          style={{ borderColor: `${theme.secondaryColor}30` }}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                {review.avatar ? (
                                  <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.author} />
                                ) : null}
                                <AvatarFallback>{review.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{review.author}</div>
                                <div className="text-sm opacity-75">{new Date(review.date).toLocaleDateString()}</div>
                              </div>
                            </div>
                            {review.verified && (
                              <Badge
                                variant="outline"
                                className="bg-green-50 border-green-200"
                                style={{ color: theme.secondaryColor }}
                              >
                                Verified Purchase
                              </Badge>
                            )}
                          </div>

                          <div className="mb-2">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn("w-4 h-4", i < review.rating ? "fill-current" : "text-gray-300")}
                                    style={{ color: i < review.rating ? theme.secondaryColor : undefined }}
                                  />
                                ))}
                              </div>
                              <h4 className="font-medium">{review.title}</h4>
                            </div>
                            <p className="opacity-90">{review.comment}</p>
                          </div>
                          <div
                            className={cn(
                              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                              theme.borderRadius,
                              theme.hoverOverlay,
                            )}
                          ></div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <p className="opacity-75">No reviews found for this rating.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {filteredReviews.length > 4 && (
                <div className="flex justify-center mt-8">
                  <Button
                    variant="outline"
                    className="group relative"
                    style={{ borderColor: theme.secondaryColor, color: theme.secondaryColor }}
                  >
                    Load More Reviews
                    <div
                      className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-md",
                        theme.hoverOverlay,
                      )}
                    ></div>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
