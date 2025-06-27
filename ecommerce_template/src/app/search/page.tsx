"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Mock data - replace with your actual data
const mockProducts = [
  { id: 1, name: "Diamond Ring", category: "Rings", price: 299.99, image: "/ring2.jpg", slug: "diamond-ring" },
  { id: 2, name: "Gold Earrings", category: "Earrings", price: 199.99, image: "/earing.jpg", slug: "gold-earrings" },
  {
    id: 3,
    name: "Pearl Necklace",
    category: "Necklaces",
    price: 399.99,
    image: "/neckless.jpg",
    slug: "pearl-necklace",
  },
]

const mockCategories = [
  { id: 1, name: "Rings", slug: "rings", image: "/ring2.jpg" },
  { id: 2, name: "Earrings", slug: "earrings", image: "/earing.jpg" },
  { id: 3, name: "Necklaces", slug: "necklaces", image: "/neckless.jpg" },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const term = searchTerm.toLowerCase()

    const productResults = mockProducts
      .filter((product) => product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term))
      .map((product) => ({ ...product, type: "product" }))

    const categoryResults = mockCategories
      .filter((category) => category.name.toLowerCase().includes(term))
      .map((category) => ({ ...category, type: "category" }))

    setSearchResults([...productResults, ...categoryResults])
    setIsLoading(false)
  }

  useEffect(() => {
    performSearch(query)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchQuery)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Search Results
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products and categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-purple-200 focus:border-purple-400"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 rounded-xl"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Results */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching...</p>
            </div>
          ) : searchResults.length === 0 && searchQuery ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">No results found</h3>
              <p className="text-gray-600">Try searching with different keywords</p>
            </div>
          ) : (
            <div className="space-y-8">
              <p className="text-gray-600">
                Found {searchResults.length} results for {searchQuery}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.type === "product" ? `/products/${result.slug}` : `/categories/${result.slug}`}
                    className="group"
                  >
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                      <div className="relative aspect-square">
                        <Image
                          src={result.image || "/placeholder.svg"}
                          alt={result.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              result.type === "product" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                            }`}
                          >
                            {result.type === "product" ? "Product" : "Category"}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{result.name}</h3>
                        {result.type === "product" && (
                          <>
                            <p className="text-sm text-gray-600 mb-2">{result.category}</p>
                            <p className="font-bold text-purple-600">${result.price}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
