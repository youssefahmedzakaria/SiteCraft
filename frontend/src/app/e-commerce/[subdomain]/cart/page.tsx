/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/e-commerce/ui/button";
import { Input } from "@/components/e-commerce/ui/input";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/utils";
import type { ThemeConfig } from "@/app/e-commerce/[subdomain]/product/[id]/product";
import { usePathname } from "next/navigation";

const defaultTheme: ThemeConfig = {
  backgroundColor: "bg-white",
  textColor: "text-black",
  accentColor: "white",
  secondaryColor: "black",
  borderRadius: "rounded-lg",
  fontFamily: "font-sans",
};

export default function CartPage() {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];

  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const theme = defaultTheme;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  const handleApplyPromo = () => {
    // Simple promo code logic - you can expand this
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(state.total * 0.1);
    } else {
      setDiscount(0);
    }
  };

  const shipping = state.total > 500 ? 0 : 25;
  const tax = (state.total - discount) * 0.08;
  const finalTotal = state.total - discount + shipping + tax;

  if (state.items.length === 0) {
    return (
      <div
        className={cn("min-h-screen pt-20", theme.fontFamily)}
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
        }}
      >
        <div className="text-center py-16">
          <ShoppingBag
            className="w-24 h-24 mx-auto mb-6"
            style={{ color: theme.secondaryColor }}
          />
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: theme.textColor }}
          >
            Your cart is empty
          </h1>
          <p className="mb-8" style={{ color: theme.secondaryColor }}>
            Looks like you have not added any items to your cart yet.
          </p>
          <Link href={`/e-commerce/${subdomain}/products`}>
            <Button
              size="lg"
              style={{
                backgroundColor: theme.secondaryColor,
                color: theme.backgroundColor,
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
      className={cn("min-h-screen pt-20 px-8", theme.fontFamily)}
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <div className="flex items-center gap-4  mb-8">
        <h1
          className="text-3xl pt-8  font-bold"
          style={{ color: theme.textColor }}
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
              style={{ color: theme.secondaryColor }}
            >
              Cart Items ({state.itemCount})
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              style={{
                borderColor: theme.secondaryColor,
                color: theme.secondaryColor,
              }}
            >
              Clear Cart
            </Button>
          </div>

          <div className="space-y-4">
            {state.items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex flex-col lg:flex-row items-center gap-4 p-4 border",
                  theme.borderRadius
                )}
                style={{
                  backgroundColor: `${theme.secondaryColor}20`,
                  borderColor: theme.secondaryColor,
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
                        style={{ color: theme.textColor }}
                      >
                        {item.name}
                      </h3>
                      <p
                        className="text-xs sm:text-sm"
                        style={{ color: theme.secondaryColor }}
                      >
                        SKU: {item.id}
                      </p>
                      <p
                        className="text-lg font-semibold mt-1"
                        style={{ color: theme.textColor }}
                      >
                        ${item.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        style={{
                          borderColor: theme.secondaryColor,
                          color: theme.secondaryColor,
                        }}
                        className="w-9 h-9 text-2xl"
                      >
                        <Minus className="w-6 h-6" />
                      </Button>
                      <span className="w-8 text-center text-base">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        style={{
                          borderColor: theme.secondaryColor,
                          color: theme.secondaryColor,
                        }}
                        className="w-9 h-9 text-2xl"
                      >
                        <Plus className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className="text-base font-bold"
                      style={{ color: theme.textColor }}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div
            className={cn("p-6 sticky top-24", theme.borderRadius)}
            style={{ backgroundColor: `${theme.secondaryColor}20` }}
          >
            <h2
              className="text-xl font-semibold mb-6"
              style={{ color: theme.secondaryColor }}
            >
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${state.total.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div
                  className="flex justify-between"
                  style={{ color: theme.secondaryColor }}
                >
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <hr />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mt-6 space-y-2">
              <label className="text-sm font-medium">Promo Code</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={handleApplyPromo}
                  style={{
                    borderColor: theme.secondaryColor,
                    color: theme.secondaryColor,
                  }}
                >
                  Apply
                </Button>
              </div>
              {promoCode.toLowerCase() === "save10" && discount > 0 && (
                <p className="text-sm" style={{ color: theme.secondaryColor }}>
                  Promo code applied! 10% off
                </p>
              )}
            </div>

            <Link
              href={`/e-commerce/${subdomain}/checkout`}
              className="block mt-6"
            >
              <Button
                className="w-full"
                size="lg"
                style={{
                  backgroundColor: theme.secondaryColor,
                  color: theme.backgroundColor,
                }}
              >
                Proceed to Checkout
              </Button>
            </Link>

            <p
              className="text-xs mt-4 text-center"
              style={{ color: theme.secondaryColor }}
            >
              {shipping === 0
                ? "Free shipping applied!"
                : "Free shipping on orders over $500"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
