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
import { usePathname } from "next/navigation";

export default function CartPage() {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];

  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const [initialColors, setInitialColors] = useState({
    primary: "#000000",
    secondary: "#000000",
    accent: "#000000",
  });

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
                backgroundColor: initialColors.accent,
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
      <div className="flex items-center gap-4  mb-8">
        <h1
          className="text-3xl pt-8  font-bold"
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
              Cart Items ({state.itemCount})
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              style={{
                borderColor: initialColors.accent,
                color: initialColors.primary,
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
                        SKU: {item.id}
                      </p>
                      <p
                        className="text-lg font-semibold mt-1"
                        style={{ color: initialColors.primary }}
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
                          borderColor: initialColors.secondary,
                          color: initialColors.primary,
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
                          borderColor: initialColors.secondary,
                          color: initialColors.primary,
                        }}
                        className="w-9 h-9 text-2xl"
                      >
                        <Plus className="w-6 h-6" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          borderColor: initialColors.secondary,
                          color: initialColors.primary,
                        }}
                        className="w-9 h-9 text-2xl"
                      >
                        <Trash2 className="w-6 h-6" />
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
                <span>${state.total.toFixed(2)}</span>
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
                    borderColor: initialColors.secondary,
                    color: initialColors.secondary,
                  }}
                >
                  Apply
                </Button>
              </div>
              {promoCode.toLowerCase() === "save10" && discount > 0 && (
                <p className="text-sm" style={{ color: initialColors.secondary }}>
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
                  backgroundColor: initialColors.secondary,
                  color: initialColors.primary,
                }}
              >
                Proceed to Checkout
              </Button>
            </Link>

            <p
              className="text-xs mt-4 text-center"
              style={{ color: initialColors.secondary }}
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
