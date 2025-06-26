"use client"

import { useSearchParams } from "next/navigation"
import { GridProductTemplate } from "@/components/product-lists"

// Sample products data - replace with your actual data fetching
const allProducts = [
  // Rings
  {
    name: "Diamond Solitaire Ring",
    media: {
      mainMedia: {
        image: {
          url: "/ring2.jpg"
        }
      }
    },
    price: {
      price: 1299,
      compareAtPrice: 1599
    },
    description: "A timeless diamond solitaire ring that captures the essence of elegance.",
    slug: "diamond-solitaire-ring",
    category: "rings",
    subcategory: "Engagement Rings",
    material: "Platinum",
    style: "Classic"
  },
  // Earrings
  {
    name: "Pearl Drop Earrings",
    media: {
      mainMedia: {
        image: {
          url: "/ring2.jpg"
        }
      }
    },
    price: {
      price: 299,
      compareAtPrice: 399
    },
    description: "Elegant pearl drop earrings with diamond accents.",
    slug: "pearl-drop-earrings",
    category: "earrings",
    subcategory: "Drop Earrings",
    material: "White Gold",
    style: "Classic"
  },
  {
    name: "Diamond Stud Earrings",
    media: {
      mainMedia: {
        image: {
          url: "/ring2.jpg"
        }
      }
    },
    price: {
      price: 599
    },
    description: "Classic diamond stud earrings for everyday elegance.",
    slug: "diamond-stud-earrings",
    category: "earrings",
    subcategory: "Stud Earrings",
    material: "Platinum",
    style: "Minimalist"
  },
  {
    name: "Gold Hoop Earrings",
    media: {
      mainMedia: {
        image: {
          url: "/ring2.jpg"
        }
      }
    },
    price: {
      price: 199
    },
    description: "Timeless gold hoop earrings for a classic look.",
    slug: "gold-hoop-earrings",
    category: "earrings",
    subcategory: "Hoop Earrings",
    material: "Gold",
    style: "Classic"
  },
  {
    name: "Chandelier Earrings",
    media: {
      mainMedia: {
        image: {
          url: "/ring2.jpg"
        }
      }
    },
    price: {
      price: 449,
      compareAtPrice: 599
    },
    description: "Stunning chandelier earrings with crystal and pearl details.",
    slug: "chandelier-earrings",
    category: "earrings",
    subcategory: "Statement Earrings",
    material: "Rose Gold",
    style: "Modern"
  },
  // Necklaces
  {
    name: "Diamond Pendant Necklace",
    media: {
      mainMedia: {
        image: {
          url: "/ring2.jpg"
        }
      }
    },
    price: {
      price: 899,
      compareAtPrice: 1099
    },
    description: "Elegant diamond pendant necklace on a delicate chain.",
    slug: "diamond-pendant-necklace",
    category: "necklaces",
    subcategory: "Pendants",
    material: "White Gold",
    style: "Classic"
  },
  {
    name: "Pearl Strand Necklace",
    media: {
      mainMedia: {
        image: {
          url: "/ring2.jpg"
        }
      }
    },
    price: {
      price: 399
    },
    description: "Classic pearl strand necklace for timeless elegance.",
    slug: "pearl-strand-necklace",
    category: "necklaces",
    subcategory: "Pearl Necklaces",
    material: "Gold",
    style: "Classic"
  },
  // Bracelets
  {
    name: "Diamond Tennis Bracelet",
    media: {
      mainMedia: {
        image: {
          url: "/ring2.jpg"
        }
      }
    },
    price: {
      price: 1499,
      compareAtPrice: 1799
    },
    description: "Sparkling diamond tennis bracelet for special occasions.",
    slug: "diamond-tennis-bracelet",
    category: "bracelets",
    subcategory: "Tennis Bracelets",
    material: "Platinum",
    style: "Classic"
  },
  {
    name: "Charm Bracelet",
    media: {
      mainMedia: {
        image: {
          url: "/ring2.jpg"
        }
      }
    },
    price: {
      price: 299
    },
    description: "Personalized charm bracelet with meaningful symbols.",
    slug: "charm-bracelet",
    category: "bracelets",
    subcategory: "Charm Bracelets",
    material: "Gold",
    style: "Modern"
  }
]

export default function ListPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get("cat")?.toLowerCase()

  // Filter products by category if specified
  const filteredProducts = category
    ? allProducts.filter(product => product.category === category)
    : allProducts

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {category ? `${category} Collection` : "All Products"}
      </h1>
      
      <GridProductTemplate
        products={filteredProducts}
        columns={{ sm: 2, md: 3, lg: 4 }}
        gap="gap-6"
        bgColor="bg-white"
        textColor="text-gray-900"
        borderRadius="rounded-lg"
        showTitle={true}
        titlePosition="top"
        fontFamily="font-sans"
        hoverEffect={true}
        cardVariant="featured"
        showCardTitle={true}
        showSubtitle={true}
        showCta={true}
        ctaText="View Details"
        cornerRadius="medium"
        cardShadow="shadow-lg"
        titleColor="text-black"
        titleFontSize="text-xl"
        titleFont="font-semibold"
      />
    </div>
  )
} 