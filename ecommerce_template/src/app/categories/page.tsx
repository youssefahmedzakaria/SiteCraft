"use client"

import { useState } from "react"
import { GridCategoryTemplate } from "@/components/category-lists"


// Sample categories data - replace with your actual data fetching
const categories = [
  {
    name: "Rings",
    media: {
      mainMedia: {
        image: {
          url: "/ring2.jpg"
        }
      }
    },
    slug: "rings"
  },
  {
    name: "Earrings",
    media: {
      mainMedia: {
        image: {
          url: "/earing.jpg"
        }
      }
    },
    slug: "earrings"
  },
  {
    name: "Necklaces",
    media: {
      mainMedia: {
        image: {
          url: "/neckless.jpg"
        }
      }
    },
    slug: "necklaces"
  }
]

export default function CategoriesPage() {
  const [filteredCategories, setFilteredCategories] = useState(categories)

  const handleFilterChange = (filters: any) => {
    let filtered = [...categories]

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Apply sort
    switch (filters.sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "newest":
        // Add your sorting logic here
        break
      case "oldest":
        // Add your sorting logic here
        break
    }

    setFilteredCategories(filtered)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Categories</h1>
      </div>

      <GridCategoryTemplate
        categories={filteredCategories}
        columns={{ sm: 2, md: 3, lg: 4 }}
        bgColor="bg-[#F5ECD5]"
        textColor="text-black"
        borderRadius="rounded-lg"
        showTitle={true}
        fontFamily="font-sans"
        hoverEffect={true}
        gap="gap-4"
        imageHeight="aspect-square"
        titlePosition="top"
        showCta={true}
        ctaText="Shop Now"
        cornerRadius="medium"
        cardShadow="shadow-lg"
        overlayColor="bg-black/30"
        showSubtitle={true}
        accentColor="text-white"
        borderColor="border-gray-200"
        cardVariant="featured"
        showCardTitle={true}
        titleColor="text-black"
        titleFontSize="text-2xl"
        title="Shop by Category"
        titleFont="font-bold"
      />
    </div>
  )
} 