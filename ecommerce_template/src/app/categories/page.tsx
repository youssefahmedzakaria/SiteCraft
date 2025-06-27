"use client"
import { useState } from "react"
import { GridCategoryTemplate } from "@/components/category-lists"
import { ChevronLeft, ChevronRight } from "lucide-react"

const categories = [
  {
    name: "Rings",
    media: {
      mainMedia: {
        image: {
          url: "/ring2.jpg",
        },
      },
    },
    slug: "rings",
  },
  {
    name: "Earrings",
    media: {
      mainMedia: {
        image: {
          url: "/earing.jpg",
        },
      },
    },
    slug: "earrings",
  },
  {
    name: "Necklaces",
    media: {
      mainMedia: {
        image: {
          url: "/neckless.jpg",
        },
      },
    },
    slug: "necklaces",
  },
  {
    name: "Bracelets",
    media: {
      mainMedia: {
        image: {
          url: "/ring2.jpg",
        },
      },
    },
    slug: "bracelets",
  },
  {
    name: "Watches",
    media: {
      mainMedia: {
        image: {
          url: "/earing.jpg",
        },
      },
    },
    slug: "watches",
  },
  {
    name: "Pendants",
    media: {
      mainMedia: {
        image: {
          url: "/neckless.jpg",
        },
      },
    },
    slug: "pendants",
  },
  {
    name: "Anklets",
    media: {
      mainMedia: {
        image: {
          url: "/ring2.jpg",
        },
      },
    },
    slug: "anklets",
  },
  {
    name: "Chains",
    media: {
      mainMedia: {
        image: {
          url: "/earing.jpg",
        },
      },
    },
    slug: "chains",
  },
  {
    name: "Charms",
    media: {
      mainMedia: {
        image: {
          url: "/neckless.jpg",
        },
      },
    },
    slug: "charms",
  },
  {
    name: "Cufflinks",
    media: {
      mainMedia: {
        image: {
          url: "/ring2.jpg",
        },
      },
    },
    slug: "cufflinks",
  },
  {
    name: "Brooches",
    media: {
      mainMedia: {
        image: {
          url: "/earing.jpg",
        },
      },
    },
    slug: "brooches",
  },
  {
    name: "Toe Rings",
    media: {
      mainMedia: {
        image: {
          url: "/neckless.jpg",
        },
      },
    },
    slug: "toe-rings",
  },
  {
    name: "Hair Accessories",
    media: {
      mainMedia: {
        image: {
          url: "/ring2.jpg",
        },
      },
    },
    slug: "hair-accessories",
  },
  {
    name: "Body Jewelry",
    media: {
      mainMedia: {
        image: {
          url: "/earing.jpg",
        },
      },
    },
    slug: "body-jewelry",
  },
  {
    name: "Wedding Sets",
    media: {
      mainMedia: {
        image: {
          url: "/neckless.jpg",
        },
      },
    },
    slug: "wedding-sets",
  },
  {
    name: "Vintage Collections",
    media: {
      mainMedia: {
        image: {
          url: "/ring2.jpg",
        },
      },
    },
    slug: "vintage-collections",
  },
  {
    name: "Custom Jewelry",
    media: {
      mainMedia: {
        image: {
          url: "/earing.jpg",
        },
      },
    },
    slug: "custom-jewelry",
  },
  {
    name: "Gift Sets",
    media: {
      mainMedia: {
        image: {
          url: "/neckless.jpg",
        },
      },
    },
    slug: "gift-sets",
  },
  {
    name: "Men's Collection",
    media: {
      mainMedia: {
        image: {
          url: "/ring2.jpg",
        },
      },
    },
    slug: "mens-collection",
  },
  {
    name: "Kids Jewelry",
    media: {
      mainMedia: {
        image: {
          url: "/earing.jpg",
        },
      },
    },
    slug: "kids-jewelry",
  },
]

export default function CategoriesPage({
  // Text configuration props
  mainTitle = "Jewelry Collections",
  subtitle = "Discover our exquisite range of handcrafted jewelry pieces, each telling its own unique story",
  ctaText = "Explore Collection",
  
  // Background and styling props
  bgColor = "bg-[#F5ECD5]",
  pageTitleColor = "text-[#4A102A]",
  subtitleColor = "text-[#4A102A]/80",
  fontFamily = "font-serif",
  titleFont = "font-bold",
  accentColor = "bg-black/20",
  overlayColor = "bg-black/50",
  
  // Pagination props
  itemsPerPage = 12,
  showPagination = true,
  
  // Other template props
  columns = { sm: 1, md: 2, lg: 3 },
  textColor = "text-[#4A102A]",
  borderRadius = "rounded-2xl",
  showTitle = false,
  hoverEffect = true,
  gap = "gap-8",
  imageHeight = "aspect-[4/3]",
  titlePosition = "overlay" as "overlay" | "top" | "bottom",
  showCta = true,
  cornerRadius = "large" as "large" | "small" | "none" | "medium",
  cardShadow = "shadow-xl hover:shadow-2xl",
  showSubtitle = false,
  borderColor = "border-white/20",
  cardVariant = "overlay" as "overlay" | "default" | "compact" | "detailed" | "minimal" | "hover" | "featured",
  showCardTitle = true,
  titleColor = "text-white",
  titleFontSize = "text-3xl",
  showMoreButton = false,
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(itemsPerPage)

  // Calculate pagination
  const totalItems = categories.length
  const totalPages = Math.ceil(totalItems / selectedItemsPerPage)
  const startIndex = (currentPage - 1) * selectedItemsPerPage
  const endIndex = startIndex + selectedItemsPerPage
  const currentCategories = categories.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    
    window.scrollTo({ top: 200, behavior: 'smooth' })
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setSelectedItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1)
        pageNumbers.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        pageNumbers.push(1)
        pageNumbers.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push('...')
        pageNumbers.push(totalPages)
      }
    }
    
    return pageNumbers
  }

  return (
    <div className={`min-h-screen ${bgColor} pt-20`}>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-5xl ${titleFont} ${pageTitleColor} mb-4`}>
            {mainTitle}
          </h1>
          <p className={`text-xl ${subtitleColor} font-light max-w-2xl mx-auto`}>
            {subtitle}
          </p>
        </div>

        {/* Items per page selector and results info */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className={`${textColor} text-sm`}>
        {Math.min(endIndex, totalItems)} out of {totalItems} categories
          </div>
        </div>

        <GridCategoryTemplate
          categories={currentCategories}
          columns={columns}
          bgColor="bg-transparent"
          textColor={textColor}
          borderRadius={borderRadius}
          showTitle={showTitle}
          fontFamily={fontFamily}
          hoverEffect={hoverEffect}
          gap={gap}
          imageHeight={imageHeight}
          titlePosition={titlePosition}
          showCta={showCta}
          ctaText={ctaText}
          cornerRadius={cornerRadius}
          cardShadow={cardShadow}
          overlayColor={overlayColor}
          showSubtitle={showSubtitle}
          accentColor={accentColor}
          borderColor={borderColor}
          cardVariant={cardVariant}
          showCardTitle={showCardTitle}
          titleColor={titleColor}
          titleFontSize={titleFontSize}
          titleFont={titleFont}
          showMoreButton={showMoreButton}
        />

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center mt-12 gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md border transition-colors ${currentPage === 1 
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                  : `border-current ${textColor} hover:bg-black/5`
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                    disabled={page === '...'}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      page === currentPage
                        ? `bg-[#4A102A] text-white`
                        : page === '...'
                        ? 'text-gray-400 cursor-default'
                        : `${textColor} hover:bg-black/5 border border-current`
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md border transition-colors ${currentPage === totalPages 
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                  : `border-current ${textColor} hover:bg-black/5`
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            <div className={`${textColor} text-sm`}>
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}