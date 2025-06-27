"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"
import type { ThemeConfig } from "@/app/product/[slug]/product"

const defaultTheme: ThemeConfig = {
  backgroundColor: "bg-white",
  textColor: "text-black",
  accentColor: "white",
  secondaryColor: "black",
  borderRadius: "rounded-lg",
  fontFamily: "font-sans",
}

export default function CartPage() {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const theme = defaultTheme;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity)
    }
  }

  const handleApplyPromo = () => {
    // Simple promo code logic - you can expand this
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(state.total * 0.1)
    } else {
      setDiscount(0)
    }
  }

  const shipping = state.total > 500 ? 0 : 25
  const tax = (state.total - discount) * 0.08
  const finalTotal = state.total - discount + shipping + tax

  if (state.items.length === 0) {
    return (
      <div className={cn("min-h-screen pt-20", theme.fontFamily)} style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
        <div className="text-center py-16">
          <ShoppingBag className="w-24 h-24 mx-auto mb-6" style={{ color: theme.secondaryColor }} />
          <h1 className="text-3xl font-bold mb-4" style={{ color: theme.textColor }}>Your cart is empty</h1>
          <p className="mb-8" style={{ color: theme.secondaryColor }}>Looks like you have not added any items to your cart yet.</p>
          <Link href="/products">
            <Button size="lg" style={{ backgroundColor: theme.secondaryColor, color: theme.backgroundColor }}>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("min-h-screen pt-20 px-8", theme.fontFamily)} style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      <div className="flex items-center gap-4  mb-8">
        <h1 className="text-3xl pt-8  font-bold" style={{ color: theme.textColor }}>Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 pt-8 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold" style={{ color: theme.secondaryColor }}>Cart Items ({state.itemCount})</h2>
            <Button variant="outline" size="sm" onClick={clearCart} style={{ borderColor: theme.secondaryColor, color: theme.secondaryColor }}>
              Clear Cart
            </Button>
          </div>

          <div className="space-y-4">
            {state.items.map((item) => (
              <div key={item.id} className={cn("flex items-center gap-4 p-4 border", theme.borderRadius)} style={{backgroundColor:`${theme.secondaryColor}20`, borderColor: theme.secondaryColor }}>
                <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>

                <div className="flex-1">
                  <h3 className="font-medium" style={{ color: theme.textColor }}>{item.name}</h3>
                  <p className="text-sm" style={{ color: theme.secondaryColor }}>SKU: {item.id}</p>
                  <p className="text-lg font-semibold" style={{ color: theme.textColor }}>${item.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} style={{ borderColor: theme.secondaryColor, color: theme.secondaryColor }}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <Button variant="outline" size="sm" onClick={() => handleQuantityChange(item.id, item.quantity + 1)} style={{ borderColor: theme.secondaryColor, color: theme.secondaryColor }}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-right">
                  <p className="font-semibold" style={{ color: theme.textColor }}>${(item.price * item.quantity).toFixed(2)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    style={{ color: theme.secondaryColor }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className={cn("p-6 sticky top-24", theme.borderRadius)} style={{ backgroundColor: `${theme.secondaryColor}20` }}>
            <h2 className="text-xl font-semibold mb-6" style={{ color: theme.secondaryColor }}>Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${state.total.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between" style={{ color: theme.secondaryColor }}>
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <hr/>

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mt-6 space-y-2">
              <label className="text-sm font-medium">Promo Code</label>
              <div className="flex gap-2">
                <Input placeholder="Enter code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                <Button variant="outline" onClick={handleApplyPromo} style={{ borderColor: theme.secondaryColor, color: theme.secondaryColor }}>
                  Apply
                </Button>
              </div>
              {promoCode.toLowerCase() === "save10" && discount > 0 && (
                <p className="text-sm" style={{ color: theme.secondaryColor }}>Promo code applied! 10% off</p>
              )}
            </div>

            <Link href="/checkout" className="block mt-6">
              <Button className="w-full" size="lg" style={{ backgroundColor: theme.secondaryColor, color: theme.backgroundColor }}>
                Proceed to Checkout
              </Button>
            </Link>

            <p className="text-xs mt-4 text-center" style={{ color: theme.secondaryColor }}>
              {shipping === 0 ? "Free shipping applied!" : "Free shipping on orders over $500"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
