/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/e-commerce/ui/button";
import { Input } from "@/components/e-commerce/ui/input";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

export default function CartPage() {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];
  const router = useRouter();

  const { 
    state, 
    loadCartFromBackend, 
    updateQuantityBackend, 
    removeFromCartBackend, 
    clearCartBackend 
  } = useCart();
  
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [initialColors, setInitialColors] = useState({
    primary: "#000000",
    secondary: "#000000",
    accent: "#000000",
    foreground: "#ffffff",
  });

  // Load cart from backend on mount
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      const success = await loadCartFromBackend();
      setIsLoading(false);
      
      if (!success && state.error?.includes("log in")) {
        // Redirect to login if authentication is required
        router.push(`/e-commerce/${subdomain}/login`);
      }
    };

    loadCart();
  }, []); // Only run on mount

  const handleQuantityChange = async (cartProductId: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      setIsLoading(true);
      const success = await updateQuantityBackend(cartProductId, newQuantity);
      setIsLoading(false);
      
      if (!success && state.error?.includes("log in")) {
        router.push(`/e-commerce/${subdomain}/login`);
      }
    }
  };

  const handleRemoveItem = async (cartProductId: number) => {
    setIsLoading(true);
    const success = await removeFromCartBackend(cartProductId);
    setIsLoading(false);
    
    if (!success && state.error?.includes("log in")) {
      router.push(`/e-commerce/${subdomain}/login`);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      setIsLoading(true);
      const success = await clearCartBackend();
      setIsLoading(false);
      
      if (!success && state.error?.includes("log in")) {
        router.push(`/e-commerce/${subdomain}/login`);
      }
    }
  };

  const subtotal = state.items.reduce((sum, item) => {
    const itemPrice = item.discountType !== null
      ? item.discountType === "amount"
        ? (item.originalPrice || 0) - Number(item.discountValue)
        : (item.originalPrice || 0) * (1 - Number(item.discountValue))
      : item.price || 0;
    return sum + (itemPrice * item.quantity);
  }, 0);

  const handleApplyPromo = () => {
    // Simple promo code logic - you can expand this
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(subtotal * 0.1);
    } else {
      setDiscount(0);
    }
  };

  const shipping = subtotal > 500 ? 0 : 25;
  const tax = (subtotal - discount) * 0.08;
  const finalTotal = subtotal - discount + shipping + tax;

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
            Loading your cart...
          </h1>
        </div>
      </div>
    );
  }

  // Show error state
  if (state.error && !state.error.includes("log in")) {
    return (
      <div
        className={cn("min-h-screen pt-20 bg-[#ffffff]")}
        style={{ color: initialColors.primary }}
      >
        <div className="text-center py-16">
          <ShoppingBag
            className="w-24 h-24 mx-auto mb-6"
            style={{ color: initialColors.primary }}
          />
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: initialColors.primary }}
          >
            Error Loading Cart
          </h1>
          <p className="mb-8 text-red-600">
            {state.error}
          </p>
          <Button
            onClick={() => loadCartFromBackend()}
            size="lg"
            style={{
              backgroundColor: initialColors.foreground,
              color: initialColors.primary,
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div
        className={cn("min-h-screen pt-20 bg-[#ffffff]")}
        style={{ color: initialColors.primary }}
      >
        <div className="text-center py-16">
          <ShoppingBag
            className="w-24 h-24 mx-auto mb-6"
            style={{ color: initialColors.primary }}
          />
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: initialColors.primary }}
          >
            Your cart is empty
          </h1>
          <p className="mb-8" style={{ color: initialColors.secondary }}>
            Looks like you have not added any items to your cart yet.
          </p>
          <Link href={`/e-commerce/${subdomain}/products`}>
            <Button
              size="lg"
              style={{
                backgroundColor: initialColors.foreground,
                color: initialColors.primary,
              }}
            >
              Continue Shopping
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
      <div className="flex items-center gap-4 mb-8">
        <h1
          className="text-3xl pt-8 font-bold"
          style={{ color: initialColors.primary }}
        >
          Shopping Cart
        </h1>
      </div>

      <div className="grid grid-cols-1 pt-8 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2
              className="text-xl font-semibold"
              style={{ color: initialColors.secondary }}
            >
              Cart Items ({state.items.reduce((sum, item) => sum + item.quantity, 0)})
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCart}
              disabled={isLoading}
              style={{
                borderColor: initialColors.accent,
                color: initialColors.primary,
              }}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Clear Cart"
              )}
            </Button>
          </div>

          <div className="space-y-4">
            {state.items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex flex-col lg:flex-row items-center gap-4 p-4 border",
                  "rounded-lg"
                )}
                style={{
                  backgroundColor: `${initialColors.secondary}20`,
                  borderColor: initialColors.secondary,
                }}
              >
                <div className="relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Info and Controls */}
                <div className="flex flex-col flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                    <div>
                      <h3
                        className="font-medium text-base sm:text-lg"
                        style={{ color: initialColors.primary }}
                      >
                        {item.name}
                      </h3>
                      <p
                        className="text-xs sm:text-sm"
                        style={{ color: initialColors.secondary }}
                      >
                        SKU: {item.sku}
                      </p>
                      {item.variantInfo?.attributes && item.variantInfo.attributes.length > 0 && (
                        <p
                          className="text-xs sm:text-sm"
                          style={{ color: initialColors.secondary }}
                        >
                          {item.variantInfo.attributes.map(attr => `${attr.name}: ${attr.value}`).join(", ")}
                        </p>
                      )}
                      <div className="flex items-baseline gap-2 mt-1">
                        <span
                          className="text-lg font-semibold"
                          style={{ color: initialColors.primary }}
                        >
                          $
          {item.discountType !== null
            ? item.discountType === "amount"
              ? (item.originalPrice || 0) - Number(item.discountValue)
              : (item.originalPrice || 0) * (1 - Number(item.discountValue))
            : item.price || 0}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span
                            className="text-sm opacity-75 line-through"
                            style={{ color: initialColors.secondary }}
                          >
                            ${item.originalPrice}
                          </span>
                        )}
                        {item.discountValue && item.discountValue > 0 && item.discountType && (
                          <span
                            className="text-xs font-medium"
                            style={{ color: "#10B981" }}
                          >
                            Save ${item.discountType === "amount" ? item.discountValue : (item.originalPrice || 0) * item.discountValue}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.cartProductId!, item.quantity - 1)
                        }
                        disabled={isLoading}
                        style={{
                          borderColor: initialColors.secondary,
                          color: initialColors.primary,
                        }}
                        className="w-9 h-9 text-2xl"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Minus className="w-6 h-6" />
                        )}
                      </Button>
                      <span className="w-8 text-center text-base">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.cartProductId!, item.quantity + 1)
                        }
                        disabled={isLoading}
                        style={{
                          borderColor: initialColors.secondary,
                          color: initialColors.primary,
                        }}
                        className="w-9 h-9 text-2xl"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-6 h-6" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveItem(item.cartProductId!)}
                        disabled={isLoading}
                        style={{
                          borderColor: initialColors.secondary,
                          color: initialColors.primary,
                        }}
                        className="w-9 h-9 text-2xl"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-6 h-6" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div
            className={cn("p-6 sticky top-24", "rounded-lg")}
            style={{ backgroundColor: `${initialColors.secondary}20` }}
          >
            <h2
              className="text-xl font-semibold mb-6"
              style={{ color: initialColors.primary }}
            >
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div
                  className="flex justify-between"
                  style={{ color: initialColors.secondary }}
                >
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  To Be Decided based on your address
                </span>
              </div>

              <hr />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>-</span>
              </div>
            </div>

            <Link
              href={`/e-commerce/${subdomain}/checkout`}
              className="block mt-6"
            >
              <Button
                className="w-full"
                size="lg"
                disabled={isLoading}
                style={{
                  color: initialColors.primary,
                  backgroundColor: initialColors.foreground,
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Proceed to Checkout"
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
