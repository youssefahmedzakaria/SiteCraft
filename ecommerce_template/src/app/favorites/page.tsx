"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/contexts/favorites-context"
import { useCart } from "@/contexts/cart-context"

export default function FavoritesPage() {
  const { state, removeFromFavorites } = useFavorites()
  const { addToCart } = useCart()

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      slug: item.slug,
    })
  }

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20 mt-20">
        <div className="text-center py-16">
          <Heart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your favorites list is empty</h1>
          <p className="text-gray-600 mb-8">Save items you love to easily find them later.</p>
          <Link href="/products">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
        <p className="text-gray-600">{state.items.length} items</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {state.items.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => removeFromFavorites(item.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              </button>
            </div>

            <div className="p-4">
              <Link href={`/product/${item.slug}`}>
                <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">{item.name}</h3>
              </Link>
              <p className="text-lg font-semibold text-gray-900 mt-2">${item.price}</p>

              <div className="flex gap-2 mt-4">
                <Button onClick={() => handleAddToCart(item)} className="flex-1" size="sm">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFromFavorites(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/products">
          <Button variant="outline" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  )
}
