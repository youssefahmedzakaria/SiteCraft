"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ProductImageGallery } from "@/components/product/product-image-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { ProductReviews } from "@/components/product/product-reviews"
import { RelatedProducts } from "@/components/product/related-products"
import { productData, reviewsData, relatedProducts } from "./sample-data"
import type { ThemeConfig } from "./product"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"
import { useRouter } from "next/navigation"
import type { Product } from "./product"
import type { CartItem } from "@/contexts/cart-context"
import type { FavoriteItem } from "@/contexts/favorites-context"

// Theme configuration
const defaultTheme: ThemeConfig = {
  backgroundColor: "#F5ECD5",
  textColor: "#4A102A",
  accentColor: "#F5ECD5",
  secondaryColor: "#4A102A",
  borderRadius: "rounded-lg",
  fontFamily: "font-sans",
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [theme] = useState<ThemeConfig>(defaultTheme)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [currentImages, setCurrentImages] = useState<string[]>(productData.defaultImages)
  const [currentPrice, setCurrentPrice] = useState(productData.basePrice)
  
  // Action states
  const [isInCart, setIsInCart] = useState(false)
  const [isInFavorites, setIsInFavorites] = useState(false)
  const [justAddedToCart, setJustAddedToCart] = useState(false)
  const [justAddedToFavorites, setJustAddedToFavorites] = useState(false)
  const [shareClicked, setShareClicked] = useState(false)
  
  const { addToCart, state: cartState } = useCart();
  const { addToFavorites, removeFromFavorites, state: favoritesState } = useFavorites();
  const router = useRouter();

  // Initialize default selections
  useEffect(() => {
    const defaultSelections: Record<string, string> = {}
    productData.variantGroups.forEach((group) => {
      if (group.required && group.options.length > 0) {
        defaultSelections[group.id] = group.options[0].id
      }
    })
    setSelectedVariants(defaultSelections)
  }, [])

  // Check if product is already in cart or favorites
  useEffect(() => {
    const inCart = cartState.items.some((item: CartItem) => item.id === productData.id)
    const inFavorites = favoritesState.items.some((item: FavoriteItem) => item.id === productData.id)
    setIsInCart(inCart)
    setIsInFavorites(inFavorites)
  }, [cartState.items, favoritesState.items])

  // Calculate price based on selected variants
  useEffect(() => {
    let price = productData.basePrice
    Object.entries(selectedVariants).forEach(([groupId, optionId]) => {
      const group = productData.variantGroups.find((g) => g.id === groupId)
      const option = group?.options.find((o) => o.id === optionId)
      if (option?.metadata?.priceAdjustment) {
        price += option.metadata.priceAdjustment
      }
    })
    setCurrentPrice(price)
  }, [selectedVariants])

  // Handle variant change
  const handleVariantChange = (groupId: string, optionId: string, productImages?: string[]) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [groupId]: optionId,
    }))

    // Update images if this variant changes them
    if (productImages) {
      setCurrentImages(productImages)
    }
  }

  // Handle add to cart
  const handleAddToCart = () => {
    if (isInCart) {
      router.push("/cart");
      return;
    }
    addToCart({
      id: productData.id,
      name: productData.name,
      price: currentPrice,
      image: currentImages[0] || productData.defaultImages[0] || "",
      slug: params.slug,
    });
    setIsInCart(true);
    setJustAddedToCart(true);
    setTimeout(() => {
      setJustAddedToCart(false);
    }, 2000);
  };

  // Handle add to favorites
  const handleAddToFavorites = () => {
    const productItem: FavoriteItem = {
      id: productData.id,
      name: productData.name,
      price: currentPrice,
      image: currentImages[0] || productData.defaultImages[0] || "",
      slug: params.slug,
    };
    if (isInFavorites) {
      removeFromFavorites(productData.id);
      setIsInFavorites(false);
    } else {
      addToFavorites(productItem);
      setIsInFavorites(true);
      setJustAddedToFavorites(true);
      setTimeout(() => {
        setJustAddedToFavorites(false);
      }, 2000);
    }
  };

  // Handle share
  const handleShare = async () => {
    const url = window.location.href;
    const title = productData.name;
    const text = `Check out this ${productData.name}!`;

    setShareClicked(true);

    try {
      if (navigator.share) {
        // Use native share API if available
        await navigator.share({
          title,
          text,
          url,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        // You could also open a share dialog here
        alert('Product link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('Product link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        // Final fallback - just show the URL
        prompt('Copy this link to share:', url);
      }
    }
    
    // Reset share state after 1 second
    setTimeout(() => {
      setShareClicked(false);
    }, 1000);
  };

  // Create a current variant object for compatibility
  const currentVariant = {
    price: currentPrice,
    compareAtPrice: productData.compareAtPrice,
    inStock: true,
  }

  return (
    <div
      className={cn("min-h-screen pt-20", theme.fontFamily)}
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Product Main Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <ProductImageGallery images={currentImages} productName={productData.name} theme={theme} />

          {/* Product Info with Variants positioned under price */}
          <div className="space-y-8">
            <ProductInfo
              product={productData}
              currentVariant={currentVariant}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
              onAddToFavorites={handleAddToFavorites}
              onShare={handleShare}
              theme={theme}
              selectedVariants={selectedVariants}
              onVariantChange={handleVariantChange}
              variantGroups={productData.variantGroups}
              isInCart={isInCart}
              isInFavorites={isInFavorites}
              justAddedToCart={justAddedToCart}
              justAddedToFavorites={justAddedToFavorites}
              shareClicked={shareClicked}
            />
          </div>
        </div>

        {/* Related Products Section */}
        <RelatedProducts products={relatedProducts} theme={theme} />

        {/* Reviews Section */}
        <ProductReviews reviews={reviewsData} theme={theme} />
      </div>
    </div>
  )
}