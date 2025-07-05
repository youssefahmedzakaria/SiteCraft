/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ProductImageGallery } from "@/components/e-commerce/product/product-image-gallery";
import { RelatedProducts } from "@/components/e-commerce/product/related-products";
import type { ThemeConfig } from "./product";
import { useCart } from "@/contexts/cart-context";
import { useFavorites } from "@/contexts/favorites-context";
import { usePathname, useRouter } from "next/navigation";
import type { CartItem } from "@/contexts/cart-context";
import type { FavoriteItem } from "@/contexts/favorites-context";
import { getProduct, type Product } from "@/lib/products";
import { useProductManagement } from "@/hooks/useProductManagement";

// Theme configuration
const defaultTheme = {
  backgroundColor: "white",
  textColor: "black",
  accentColor: "white",
  secondaryColor: "black",
  borderRadius: "rounded-lg",
  fontFamily: "font-sans",
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];
  const productId = pathSegments[4];
  const [theme] = useState<ThemeConfig>(defaultTheme);
  const [productData, setProductData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);

  // Action states
  const [isInCart, setIsInCart] = useState(false);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [justAddedToCart, setJustAddedToCart] = useState(false);
  const [justAddedToFavorites, setJustAddedToFavorites] = useState(false);
  const [shareClicked, setShareClicked] = useState(false);

  const { addToCart, state: cartState } = useCart();
  const {
    addToFavorites,
    removeFromFavorites,
    state: favoritesState,
  } = useFavorites();
  const router = useRouter();

  // const { backendProduct } = useProductManagement();

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const product = await getProduct(parseInt(productId));
        setProductData(product);

        // Set initial images and price
        if (product.images && product.images.length > 0) {
          setCurrentImages(product.images.map((img) => img.imageUrl));
        }
        setCurrentPrice(product.variants?.[0]?.price || 0);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Initialize default selections
  // useEffect(() => {
  //   if (!productData) return;

  //   const defaultSelections: Record<string, string> = {};
  //   // Use sample data structure for variant groups since backend doesn't have this
  //   sampleProductData.variantGroups.forEach((group: any) => {
  //     if (group.required && group.options.length > 0) {
  //       defaultSelections[group.id] = group.options[0].id;
  //     }
  //   });
  //   setSelectedVariants(defaultSelections);
  // }, [productData]);

  // // Check if product is already in cart or favorites
  // useEffect(() => {
  //   if (!productData) return;

  //   const inCart = cartState.items.some(
  //     (item: CartItem) => item.id === productId
  //   );
  //   const inFavorites = favoritesState.items.some(
  //     (item: FavoriteItem) => item.id === productId
  //   );
  //   setIsInCart(inCart);
  //   setIsInFavorites(inFavorites);
  // }, [cartState.items, favoritesState.items, productData, productId]);

  // // Calculate price based on selected variants
  // useEffect(() => {
  //   if (!productData) return;

  //   let price = productData.variants?.[0]?.price || 0;
  //   Object.entries(selectedVariants).forEach(([groupId, optionId]) => {
  //     const group = sampleProductData.variantGroups.find(
  //       (g: any) => g.id === groupId
  //     );
  //     const option = group?.options.find((o: any) => o.id === optionId);
  //     if (option?.metadata?.priceAdjustment) {
  //       price += option.metadata.priceAdjustment;
  //     }
  //   });
  //   setCurrentPrice(price);
  // }, [selectedVariants, productData]);

  // // Handle variant change
  // const handleVariantChange = (
  //   groupId: string,
  //   optionId: string,
  //   productImages?: string[]
  // ) => {
  //   setSelectedVariants((prev) => ({
  //     ...prev,
  //     [groupId]: optionId,
  //   }));

  //   // Update images if this variant changes them
  //   if (productImages) {
  //     setCurrentImages(productImages);
  //   }
  // };

  // // Handle add to cart
  // const handleAddToCart = () => {
  //   if (!productData) return;

  //   if (isInCart) {
  //     router.push(`/e-commerce/${subdomain}/cart`);
  //     return;
  //   }
  //   addToCart({
  //     id: productId,
  //     name: productData.name,
  //     price: currentPrice,
  //     image: currentImages[0] || "",
  //   });
  //   setIsInCart(true);
  //   setJustAddedToCart(true);
  //   setTimeout(() => {
  //     setJustAddedToCart(false);
  //   }, 2000);
  // };

  // // Handle add to favorites
  // const handleAddToFavorites = () => {
  //   if (!productData) return;

  //   const productItem: FavoriteItem = {
  //     name: productData.name,
  //     price: currentPrice,
  //     image: currentImages[0] || "",
  //     id: productId,
  //   };
  //   if (isInFavorites) {
  //     removeFromFavorites(productId);
  //     setIsInFavorites(false);
  //   } else {
  //     addToFavorites(productItem);
  //     setIsInFavorites(true);
  //     setJustAddedToFavorites(true);
  //     setTimeout(() => {
  //       setJustAddedToFavorites(false);
  //     }, 2000);
  //   }
  // };

  // // Handle share
  // const handleShare = async () => {
  //   if (!productData) return;

  //   const url = window.location.href;
  //   const title = productData.name;
  //   const text = `Check out this ${productData.name}!`;

  //   setShareClicked(true);

  //   try {
  //     if (navigator.share) {
  //       // Use native share API if available
  //       await navigator.share({
  //         title,
  //         text,
  //         url,
  //       });
  //     } else {
  //       // Fallback to clipboard
  //       await navigator.clipboard.writeText(url);
  //       // You could also open a share dialog here
  //       alert("Product link copied to clipboard!");
  //     }
  //   } catch (error) {
  //     console.error("Error sharing:", error);
  //     // Fallback to clipboard
  //     try {
  //       await navigator.clipboard.writeText(url);
  //       alert("Product link copied to clipboard!");
  //     } catch (clipboardError) {
  //       console.error("Clipboard error:", clipboardError);
  //       // Final fallback - just show the URL
  //       prompt("Copy this link to share:", url);
  //     }
  //   }

  //   // Reset share state after 1 second
  //   setTimeout(() => {
  //     setShareClicked(false);
  //   }, 1000);
  // };

  // // Create a current variant object for compatibility
  // const currentVariant = {
  //   price: currentPrice,
  //   compareAtPrice: sampleProductData.compareAtPrice,
  //   inStock: true,
  // };

  // // Show loading state
  // if (loading) {
  //   return (
  //     <div
  //       className={cn("min-h-screen pt-20", theme.fontFamily)}
  //       style={{
  //         backgroundColor: theme.backgroundColor,
  //         color: theme.textColor,
  //       }}
  //     >
  //       <div className="container mx-auto px-4 py-8">
  //         <div className="text-center">
  //           <h2 className="text-2xl font-semibold mb-4">Loading product...</h2>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // // Show error state
  // if (error || !productData) {
  //   return (
  //     <div
  //       className={cn("min-h-screen pt-20", theme.fontFamily)}
  //       style={{
  //         backgroundColor: theme.backgroundColor,
  //         color: theme.textColor,
  //       }}
  //     >
  //       <div className="container mx-auto px-4 py-8">
  //         <div className="text-center">
  //           <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
  //           <p className="text-gray-600 mb-4">
  //             {error || "The requested product could not be loaded."}
  //           </p>
  //           <button
  //             onClick={() => router.back()}
  //             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  //           >
  //             Go Back
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // return (
  //   <div
  //     className={cn("min-h-screen pt-20", theme.fontFamily)}
  //     style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
  //   >
  //     <div className="container mx-auto px-4 py-8">
  //       {/* Product Main Section */}
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
  //         {/* Product Images */}
  //         <ProductImageGallery
  //           images={currentImages}
  //           productName={productData.name}
  //           theme={theme}
  //         />

  //         {/* Product Info with Variants positioned under price */}
  //         <div className="space-y-8">
  //           <ProductInfo
  //             product={productData as any}
  //             currentVariant={currentVariant}
  //             quantity={quantity}
  //             onQuantityChange={setQuantity}
  //             onAddToCart={handleAddToCart}
  //             onAddToFavorites={handleAddToFavorites}
  //             onShare={handleShare}
  //             theme={theme}
  //             selectedVariants={selectedVariants}
  //             onVariantChange={handleVariantChange}
  //             variantGroups={sampleProductData.variantGroups}
  //             isInCart={isInCart}
  //             isInFavorites={isInFavorites}
  //             justAddedToCart={justAddedToCart}
  //             justAddedToFavorites={justAddedToFavorites}
  //             shareClicked={shareClicked}
  //           />
  //         </div>
  //       </div>

  //       {/* Related Products Section */}
  //       <RelatedProducts products={relatedProducts} theme={theme} />
  //     </div>
  //   </div>
  // );
}
