/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/e-commerce/ui/button";
import { useFavorites } from "@/contexts/favorites-context";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function FavoritesPage() {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];
  const router = useRouter();

  const [initialColors, setInitialColors] = useState({
    primary: "#ffffff",
    secondary: "#ffffff",
    accent: "#000000",
  });

  const { 
    state, 
    loadWishlistFromBackend, 
    removeFromWishlistBackend, 
    clearWishlistBackend 
  } = useFavorites();
  const { addToCartBackend } = useCart();

  const [isLoading, setIsLoading] = useState(false);

  // Load wishlist from backend on mount
  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);
      const success = await loadWishlistFromBackend();
      setIsLoading(false);
      
      // Print the fetched wishlist data for debugging
      console.log("Fetched wishlist data:", state.items);
      console.log("Wishlist state:", state);
      
      // Log each item's structure
      state.items.forEach((item, index) => {
        console.log(`Item ${index}:`, item);
        console.log(`Item ${index} product:`, item.product);
        console.log(`Item ${index} variants:`, item.product?.variants);
        console.log(`Item ${index} SKU:`, item.sku);
      });
      
      if (!success && state.error?.includes("log in")) {
        // Redirect to login if authentication is required
        router.push(`/e-commerce/${subdomain}/login`);
      }
    };

    loadWishlist();
  }, []); // Only run on mount

  const handleAddToCart = async (item: any) => {
    if (!item.sku) {
      console.error("No SKU found for item:", item);
      return;
    }

    setIsLoading(true);
    const success = await addToCartBackend(parseInt(item.id), item.sku, 1);
    setIsLoading(false);
    
    if (success) {
      // Remove from wishlist after successfully adding to cart
      if (item.wishListProductId) {
        await removeFromWishlistBackend(item.wishListProductId);
      }
    } else {
      // Check if it's an authentication error
      if (state.error?.includes("log in")) {
        router.push(`/e-commerce/${subdomain}/login`);
      }
    }
  };

  const handleRemoveItem = async (wishListProductId: number) => {
    setIsLoading(true);
    const success = await removeFromWishlistBackend(wishListProductId);
    setIsLoading(false);
    
    if (!success && state.error?.includes("log in")) {
      router.push(`/e-commerce/${subdomain}/login`);
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      setIsLoading(true);
      const success = await clearWishlistBackend();
      setIsLoading(false);
      
      if (!success && state.error?.includes("log in")) {
        router.push(`/e-commerce/${subdomain}/login`);
      }
    }
  };

  // Show loading state
  if (isLoading || state.loading) {
    return (
      <div
        className={cn("min-h-screen pt-20 bg-[#ffffff]")}
        style={{ color: initialColors.primary }}
      >
        <div className="text-center py-16">
          <Loader2 className="w-12 h-12 mx-auto mb-6 animate-spin" style={{ color: initialColors.primary }} />
          <h1
            className="text-2xl font-semibold mb-4"
            style={{ color: initialColors.primary }}
          >
            Loading your wishlist...
          </h1>
        </div>
      </div>
    );
  }

  // Show error state
  if (state.error) {
    return (
      <div
        className={cn("min-h-screen pt-20 bg-[#ffffff]")}
        style={{ color: initialColors.primary }}
      >
        <div className="text-center py-16">
          <Heart
            className="w-24 h-24 mx-auto mb-6"
            style={{ color: initialColors.primary }}
          />
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: initialColors.primary }}
          >
            {state.error.includes("log in") ? "Authentication Required" : "Error Loading Wishlist"}
          </h1>
          <p className="mb-8 text-red-600">
            {state.error}
          </p>
          {state.error.includes("log in") ? (
            <div className="space-y-4">
              <Link href={`/e-commerce/${subdomain}/login`}>
                <Button
                  size="lg"
                  style={{
                    backgroundColor: initialColors.primary,
                    color: initialColors.primary,
                  }}
                >
                  Log In as Customer
                </Button>
              </Link>
              <p className="text-sm" style={{ color: initialColors.secondary }}>
                You need to be logged in as a customer to access your wishlist
              </p>
            </div>
          ) : (
            <Button
              onClick={() => loadWishlistFromBackend()}
              size="lg"
              style={{
                backgroundColor: initialColors.primary,
                color: initialColors.primary,
              }}
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div
        className={cn("min-h-screen pt-20 px-8 bg-[#ffffff] font-sans")}
        style={{ color: initialColors.primary }}
      >
        <div className="text-center py-16">
          <Heart
            className="w-24 h-24 mx-auto mb-6"
            style={{ color: initialColors.accent }}
          />
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: initialColors.accent }}
          >
            Your wishlist is empty
          </h1>
          <p className="mb-8" style={{ color: initialColors.accent }}>
            Save items you love to easily find them later.
          </p>
          <Link href={`/e-commerce/${subdomain}/products`}>
            <Button
              size="lg"
              style={{
                backgroundColor: initialColors.primary,
                color: initialColors.accent,
              }}
            >
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("min-h-screen pt-20 px-8 bg-[#ffffff]")}
      style={{ color: initialColors.primary }}
    >
      <div className="flex justify-between items-center pt-8 mb-8">
        <h1 className="text-3xl font-bold" style={{ color: initialColors.primary }}>
          My Wishlist
        </h1>
        <div className="flex items-center gap-4">
          <p style={{ color: initialColors.secondary }}>
            {state.items.length} items
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearWishlist}
            disabled={isLoading}
            style={{
              borderColor: initialColors.accent,
              color: initialColors.accent,
            }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Clear All"
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {state.items.map((item) => (
          <div
            key={item.wishListProductId}
            className={cn(
              "group relative border overflow-hidden hover:shadow-lg transition-shadow rounded-lg"
            )}
            style={{
              backgroundColor: initialColors.accent,
              borderColor: initialColors.secondary,
            }}
          >
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={item.image || "/placeholder.png"}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => item.wishListProductId && handleRemoveItem(item.wishListProductId)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md transition-colors"
                style={{ color: initialColors.secondary }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Heart
                    className="w-4 h-4"
                    style={{
                      stroke: initialColors.secondary,
                      fill: initialColors.accent,
                      strokeWidth: 2,
                    }}
                  />
                )}
              </button>
            </div>

            <div className="p-4">
              <Link href={`/e-commerce/${subdomain}/product/${item.id}`}>
                <h3
                  className="font-medium hover:underline"
                  style={{ color: initialColors.primary }}
                >
                  {item.name}
                </h3>
              </Link>
              
              {/* SKU and Variant Info */}
              {item.sku && (
                <p
                  className="text-xs mt-1"
                  style={{ color: initialColors.secondary }}
                >
                  SKU: {item.sku}
                </p>
              )}
              {item.variantInfo?.attributes && item.variantInfo.attributes.length > 0 && (
                <p
                  className="text-xs mt-1"
                  style={{ color: initialColors.secondary }}
                >
                  {item.variantInfo.attributes.map(attr => `${attr.name}: ${attr.value}`).join(", ")}
                </p>
              )}

              {/* Price Display with Discounts */}
              <div className="flex items-baseline gap-2 mt-2">
                <span
                  className="text-lg font-semibold"
                  style={{ color: initialColors.primary }}
                >
                  $
                  {(() => {
                    // Find the variant that matches the SKU
                    const matchingVariant = item.product?.variants?.find(variant => variant.sku === item.sku);
                    const variantPrice = matchingVariant?.price || 0;
                    
                    // Apply discount if available
                    if (item.product?.discountType && item.product?.discountValue) {
                      if (item.product.discountType === "amount") {
                        return (variantPrice - Number(item.product.discountValue)).toFixed(2);
                      } else {
                        return (variantPrice * (1 - Number(item.product.discountValue))).toFixed(2);
                      }
                    }
                    
                    return variantPrice.toFixed(2);
                  })()}
                </span>
                {(() => {
                  // Find the variant that matches the SKU
                  const matchingVariant = item.product?.variants?.find(variant => variant.sku === item.sku);
                  const variantPrice = matchingVariant?.price || 0;
                  
                  // Show original price if there's a discount
                  if (item.product?.discountType && item.product?.discountValue && variantPrice > 0) {
                    return (
                      <span
                        className="text-sm opacity-75 line-through"
                        style={{ color: initialColors.secondary }}
                      >
                        ${variantPrice.toFixed(2)}
                      </span>
                    );
                  }
                  return null;
                })()}
                {(() => {
                  // Show discount amount if available
                  const matchingVariant = item.product?.variants?.find(variant => variant.sku === item.sku);
                  const variantPrice = matchingVariant?.price || 0;
                  
                  if (item.product?.discountType && item.product?.discountValue && variantPrice > 0) {
                    const discountAmount = item.product.discountType === "amount" 
                      ? item.product.discountValue 
                      : (variantPrice * item.product.discountValue);
                    
                    return (
                      <span
                        className="text-xs font-medium"
                        style={{ color: "#10B981" }}
                      >
                        Save ${discountAmount.toFixed(2)}
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1"
                  size="sm"
                  disabled={isLoading}
                  style={{
                    backgroundColor: initialColors.secondary,
                    color: initialColors.accent,
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => item.wishListProductId && handleRemoveItem(item.wishListProductId)}
                  disabled={isLoading}
                  style={{
                    borderColor: initialColors.secondary,
                    color: initialColors.accent,
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href={`/e-commerce/${subdomain}/products`}>
          <Button
            variant="outline"
            size="lg"
            style={{
              backgroundColor: initialColors.secondary,
              color: initialColors.accent,
            }}
          >
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
