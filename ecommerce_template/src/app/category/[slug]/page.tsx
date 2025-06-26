"use client"

import { GridCategoryTemplate } from "@/components/category-lists/templates/grid-template"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"

const products = [
  {
    id: "1",
    name: "Product 1",
    price: 20,
    image: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Product 2",
    price: 30,
    image: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Product 3",
    price: 40,
    image: "/placeholder.svg",
  },
]

export default function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const { addToCart } = useCart()
  const { addToFavorites } = useFavorites()

  const handleAddToCart = (product: any) => {
    addToCart(product)
  }

  const handleAddToFavorites = (product: any) => {
    addToFavorites(product)
  }

  return (
    <div>
      <h1>Category: {params.slug}</h1>
      <GridCategoryTemplate
        categories={products}
      />
    </div>
  )
}
