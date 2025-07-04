"use client"
import { useState, useEffect } from "react"
import { GridProductTemplate } from "@/components/e-commerce/product-lists"
import { ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { Button } from "@/components/e-commerce/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/e-commerce/ui/select"
import { Slider } from "@/components/e-commerce/ui/slider"
import { Checkbox } from "@/components/e-commerce/ui/checkbox"
import { cn } from "@/lib/utils"
import { useSearchParams, useRouter } from "next/navigation"

const products = [
  {
    id: 1,
    name: "Diamond Solitaire Ring",
    price: { value: 299.99 },
    category: "Rings",
    media: { mainMedia: { image: { url: "/ring2.jpg" } } },
    description: "Elegant diamond solitaire ring crafted in 18k gold",
    inStock: true,
  },
  {
    id: 2,
    name: "Pearl Drop Earrings",
    price: { value: 199.99 },
    category: "Earrings",
    media: { mainMedia: { image: { url: "/earing.jpg" } } },
    description: "Classic pearl drop earrings with sterling silver",
    inStock: true,
  },
  {
    id: 3,
    name: "Gold Chain Necklace",
    price: { value: 399.99 },
    category: "Necklaces",
    media: { mainMedia: { image: { url: "/neckless.jpg" } } },
    description: "Luxurious 14k gold chain necklace",
    inStock: true,
  },
  {
    id: 4,
    name: "Silver Hoop Earrings",
    price: { value: 89.99 },
    category: "Earrings",
    media: { mainMedia: { image: { url: "/earing.jpg" } } },
    description: "Modern silver hoop earrings for everyday wear",
    inStock: false,
  },
  {
    id: 5,
    name: "Ruby Engagement Ring",
    price: { value: 599.99 },
    category: "Rings",
    media: { mainMedia: { image: { url: "/ring2.jpg" } } },
    description: "Stunning ruby engagement ring with diamond accents",
    inStock: true,
  },
  {
    id: 6,
    name: "Vintage Pearl Necklace",
    price: { value: 449.99 },
    category: "Necklaces",
    media: { mainMedia: { image: { url: "/neckless.jpg" } } },
    description: "Vintage-inspired pearl necklace with gold clasp",
    inStock: true,
  },
  {
    id: 7,
    name: "Tennis Bracelet",
    price: { value: 799.99 },
    category: "Bracelets",
    media: { mainMedia: { image: { url: "/ring2.jpg" } } },
    description: "Classic diamond tennis bracelet in white gold",
    inStock: true,
  },
  {
    id: 8,
    name: "Luxury Watch",
    price: { value: 1299.99 },
    category: "Watches",
    media: { mainMedia: { image: { url: "/earing.jpg" } } },
    description: "Swiss-made luxury watch with leather strap",
    inStock: true,
  },
  {
    id: 9,
    name: "Heart Pendant",
    price: { value: 249.99 },
    category: "Pendants",
    media: { mainMedia: { image: { url: "/neckless.jpg" } } },
    description: "Romantic heart pendant with diamond accent",
    inStock: true,
  },
  {
    id: 10,
    name: "Charm Anklet",
    price: { value: 129.99 },
    category: "Anklets",
    media: { mainMedia: { image: { url: "/ring2.jpg" } } },
    description: "Delicate anklet with multiple charms",
    inStock: true,
  },
  {
    id: 11,
    name: "Gold Chain",
    price: { value: 349.99 },
    category: "Chains",
    media: { mainMedia: { image: { url: "/earing.jpg" } } },
    description: "18k gold chain for layering",
    inStock: true,
  },
  {
    id: 12,
    name: "Lucky Charm",
    price: { value: 79.99 },
    category: "Charms",
    media: { mainMedia: { image: { url: "/neckless.jpg" } } },
    description: "Sterling silver lucky charm pendant",
    inStock: true,
  },
  {
    id: 13,
    name: "Rose Gold Ring",
    price: { value: 179.99 },
    category: "Rings",
    media: { mainMedia: { image: { url: "/ring2.jpg" } } },
    description: "Beautiful rose gold ring with intricate design",
    inStock: true,
  },
  {
    id: 14,
    name: "Crystal Earrings",
    price: { value: 129.99 },
    category: "Earrings",
    media: { mainMedia: { image: { url: "/earing.jpg" } } },
    description: "Sparkling crystal drop earrings",
    inStock: true,
  },
  {
    id: 15,
    name: "Infinity Necklace",
    price: { value: 219.99 },
    category: "Necklaces",
    media: { mainMedia: { image: { url: "/neckless.jpg" } } },
    description: "Elegant infinity symbol necklace in silver",
    inStock: true,
  },
  {
    id: 16,
    name: "Statement Bracelet",
    price: { value: 329.99 },
    category: "Bracelets",
    media: { mainMedia: { image: { url: "/ring2.jpg" } } },
    description: "Bold statement bracelet with gemstones",
    inStock: false,
  },
]

// Theme configuration (matching product page structure)
const defaultTheme = {
  backgroundColor: "white",
  textColor: "black",
  accentColor: "white",
  secondaryColor: "black",
  borderRadius: "rounded-lg",
  fontFamily: "font-sans",
}

// Optionally, import ThemeConfig type from product page for type safety
// import type { ThemeConfig } from "../product/[slug]/product"

export default function JewelryProductsPage({
  theme = defaultTheme,
  // Text configuration props
  mainTitle = "Jewelry Products",
  subtitle = "Discover our exquisite collection of handcrafted jewelry pieces, each designed to tell your unique story",
  ctaText = "View Product",

  // Background and styling props
  titleFont = "font-bold",

  // Pagination props
  itemsPerPage = 12,
  showPagination = true,

  // Template selection and props
  columns = { sm: 1, md: 4, lg: 4 },
  showTitle = false,
  hoverEffect = true,
  gap = "gap-8",
  imageHeight = "aspect-[4/3]",
  titlePosition = "overlay" as "overlay" | "top" | "bottom",
  showCta = true,
  cornerRadius = "large" as "large" | "small" | "none" | "medium",
  cardShadow = "shadow-xl hover:shadow-2xl",
  showSubtitle = false,
  cardVariant = "hover" as "default" | "minimal" | "hover" | "overlay" | "featured",
  titleFontSize = "text-3xl",
  showMoreButton = false,

  // Filter props
  showFilters = true,
  enablePriceFilter = true,
  enableCategoryFilter = true,
  enableStockFilter = true,
  enableSorting = true,
  maxPriceLimit = 1500,
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(itemsPerPage)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Filter states
  const [maxPrice, setMaxPrice] = useState(maxPriceLimit)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("featured")
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("")

  // Initialize search from URL params
  useEffect(() => {
    const searchFromUrl = searchParams.get('search')
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl)
    }
  }, [searchParams])

  const categories = [
    "Rings",
    "Earrings",
    "Necklaces",
    "Bracelets",
    "Watches",
    "Pendants",
    "Anklets",
    "Chains",
    "Charms",
  ]

  // Apply filters
  const getFilteredProducts = () => {
    let filtered = [...products]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      const searchWords = query.split(/\s+/).filter(word => word.length > 0)
      
      filtered = filtered.filter((product) => {
        const productText = [
          product.name.toLowerCase(),
          product.description.toLowerCase(),
          product.category.toLowerCase()
        ].join(' ')
        
        // Check if all search words are found in the product text
        return searchWords.every(word => {
          // Use word boundary regex to prevent partial matches
          const wordRegex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
          return wordRegex.test(productText)
        })
      })
    }

    // Price filter
    if (enablePriceFilter) {
      filtered = filtered.filter((product) => product.price.value <= maxPrice)
    }

    // Category filter
    if (enableCategoryFilter && selectedCategories.length > 0) {
      filtered = filtered.filter((product) => selectedCategories.includes(product.category))
    }

    // Stock filter
    if (enableStockFilter && showInStockOnly) {
      filtered = filtered.filter((product) => product.inStock)
    }

    // Sort
    if (enableSorting) {
      switch (sortBy) {
        case "price-asc":
          filtered.sort((a, b) => a.price.value - b.price.value)
          break
        case "price-desc":
          filtered.sort((a, b) => b.price.value - a.price.value)
          break
        case "name-asc":
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
        case "name-desc":
          filtered.sort((a, b) => b.name.localeCompare(a.name))
          break
      }
    }

    return filtered
  }

  const filteredProducts = getFilteredProducts()
  const totalItems = filteredProducts.length
  const totalPages = Math.ceil(totalItems / selectedItemsPerPage)
  const startIndex = (currentPage - 1) * selectedItemsPerPage
  const endIndex = startIndex + selectedItemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 200, behavior: "smooth" })
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setSelectedItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setMaxPrice(maxPriceLimit)
    setSelectedCategories([])
    setSortBy("featured")
    setShowInStockOnly(false)
    setSearchQuery("")
    setCurrentPage(1)
    
    // Clear search from URL
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.delete('search')
    router.replace(`?${newSearchParams.toString()}`)
  }

  // Handle search from navbar
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    
    // Update URL with search parameter
    const newSearchParams = new URLSearchParams(searchParams)
    if (query.trim()) {
      newSearchParams.set('search', query.trim())
    } else {
      newSearchParams.delete('search')
    }
    router.replace(`?${newSearchParams.toString()}`)
  }

  // Generate page numbers for pagination (matching categories page)
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
        pageNumbers.push("...")
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1)
        pageNumbers.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else {
        pageNumbers.push(1)
        pageNumbers.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push("...")
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  const handleAddToCart = (product: any) => {
    console.log("Added to cart:", product)
    // Add your cart logic here
  }

  const handleAddToFavorite = (product: any) => {
    console.log("Added to favorites:", product)
    // Add your favorites logic here
  }

  return (
    <div className={`min-h-screen pt-20 ${theme.fontFamily}`}
         style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      <div className="container mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold mb-4`} style={{ color: theme.textColor }}>{mainTitle}</h1>
          <p className={`text-xl font-light max-w-2xl mx-auto`} style={{ color: theme.textColor + 'CC' }}>{subtitle}</p>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar/Overlay */}
          {showFilters && (
            <>
              {/* Mobile Overlay Background */}
              {isFilterOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsFilterOpen(false)} />
              )}

              {/* Filter Content */}
              <div
                className={cn(
                  "transition-all duration-300 ease-in-out",
                  // Desktop: sliding sidebar
                  "hidden md:block",
                  isFilterOpen ? "w-80 opacity-100" : "w-0 opacity-0 overflow-hidden",
                )}
              >
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 w-80">
                  {/* Filter content remains the same */}
                  {/* Maximum Price */}
                  {enablePriceFilter && (
                    <div className="space-y-4 mb-6">
                      <h3 className={`text-lg font-semibold`} style={{ color: theme.textColor }}>Maximum Price</h3>
                      <Slider
                        min={0}
                        max={maxPriceLimit}
                        step={10}
                        value={[maxPrice]}
                        onValueChange={(value) => setMaxPrice(value[0])}
                        className="my-6"
                      />
                      <div className={`flex justify-between text-sm`} style={{ color: theme.textColor + 'B3' }}>
                        <span>$0</span>
                        <span>${maxPrice}</span>
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  {enableCategoryFilter && (
                    <div className="space-y-4 mb-6">
                      <h3 className={`text-lg font-semibold`} style={{ color: theme.textColor }}>Categories</h3>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {categories.map((category) => (
                          <label key={category} className="flex items-center space-x-3 cursor-pointer">
                            <Checkbox
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                              className={`rounded-md border-2 border-current`}
                            />
                            <span className={`font-medium text-sm`} style={{ color: theme.textColor }}>{category}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stock Filter */}
                  {enableStockFilter && (
                    <div className="space-y-4 mb-6">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox
                          checked={showInStockOnly}
                          onCheckedChange={(checked) => setShowInStockOnly(checked === true)}
                          className="rounded-md border-2 border-current"
                        />
                        <span className={`font-medium`} style={{ color: theme.textColor }}>In Stock Only</span>
                      </label>
                    </div>
                  )}

                  {/* Sort */}
                  {enableSorting && (
                    <div className="space-y-4 mb-6">
                      <h3 className={`text-lg font-semibold`} style={{ color: theme.textColor }}>Sort By</h3>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full border-2 border-current rounded-xl">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="featured">Featured</SelectItem>
                          <SelectItem value="price-asc">Price: Low to High</SelectItem>
                          <SelectItem value="price-desc">Price: High to Low</SelectItem>
                          <SelectItem value="name-asc">Name: A to Z</SelectItem>
                          <SelectItem value="name-desc">Name: Z to A</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className={`w-full border-2 border-current rounded-xl font-semibold`}
                    style={{ color: theme.textColor, borderColor: theme.textColor }}
                    onClick={clearAllFilters}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>

              {/* Mobile Filter Overlay Card */}
              <div
                className={cn(
                  "fixed inset-x-4 top-24 bottom-4 z-50 md:hidden transition-all duration-300 ease-in-out",
                  isFilterOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none",
                )}
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20 h-full overflow-y-auto">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <h2 className={`text-xl font-bold`} style={{ color: theme.textColor }}>Filters</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFilterOpen(false)}
                      className={`rounded-full`}
                      style={{ color: theme.textColor }}
                    >
                      ✕
                    </Button>
                  </div>

                  {/* Filter content - same as desktop */}
                  {/* Maximum Price */}
                  {enablePriceFilter && (
                    <div className="space-y-4 mb-6">
                      <h3 className={`text-lg font-semibold`} style={{ color: theme.textColor }}>Maximum Price</h3>
                      <Slider
                        min={0}
                        max={maxPriceLimit}
                        step={10}
                        value={[maxPrice]}
                        onValueChange={(value) => setMaxPrice(value[0])}
                        className="my-6"
                      />
                      <div className={`flex justify-between text-sm`} style={{ color: theme.textColor + 'B3' }}>
                        <span>$0</span>
                        <span>${maxPrice}</span>
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  {enableCategoryFilter && (
                    <div className="space-y-4 mb-6">
                      <h3 className={`text-lg font-semibold`} style={{ color: theme.textColor }}>Categories</h3>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {categories.map((category) => (
                          <label key={category} className="flex items-center space-x-3 cursor-pointer">
                            <Checkbox
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                              className={`rounded-md border-2 border-current`}
                            />
                            <span className={`font-medium text-sm`} style={{ color: theme.textColor }}>{category}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stock Filter */}
                  {enableStockFilter && (
                    <div className="space-y-4 mb-6">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox
                          checked={showInStockOnly}
                          onCheckedChange={(checked) => setShowInStockOnly(checked === true)}
                          className="rounded-md border-2 border-current"
                        />
                        <span className={`font-medium`} style={{ color: theme.textColor }}>In Stock Only</span>
                      </label>
                    </div>
                  )}

                  {/* Sort */}
                  {enableSorting && (
                    <div className="space-y-4 mb-6">
                      <h3 className={`text-lg font-semibold`} style={{ color: theme.textColor }}>Sort By</h3>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full border-2 border-current rounded-xl">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="featured">Featured</SelectItem>
                          <SelectItem value="price-asc">Price: Low to High</SelectItem>
                          <SelectItem value="price-desc">Price: High to Low</SelectItem>
                          <SelectItem value="name-asc">Name: A to Z</SelectItem>
                          <SelectItem value="name-desc">Name: Z to A</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Mobile Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      className={`flex-1 border-2 border-current rounded-xl font-semibold`}
                      style={{ color: theme.textColor, borderColor: theme.textColor }}
                      onClick={clearAllFilters}
                    >
                      Clear All
                    </Button>
                    <Button
                      className={`flex-1 rounded-xl font-semibold`}
                      style={{ backgroundColor: theme.textColor, color: theme.backgroundColor }}
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Products Section */}
          <div className="flex-1">
            {/* Items per page selector and results info */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <div className={`text-sm`} style={{ color: theme.textColor }}>
                {Math.min(endIndex, totalItems)} out of {totalItems} products
              </div>

              <div className="flex items-center gap-4">
                {showFilters && (
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`border-2 border-current rounded-xl`}
                    style={{ color: theme.textColor, borderColor: theme.textColor }}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                )}
              </div>
            </div>

            {/* Search Results Display */}
            {searchQuery.trim() && (
              <div className="mb-6 p-4 rounded-lg border" style={{ 
                backgroundColor: theme.backgroundColor + '20', 
                borderColor: theme.textColor + '30',
                color: theme.textColor 
              }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Search results for:</span>
                    <span className="text-sm font-semibold">"{searchQuery}"</span>
                    <span className="text-sm opacity-70">({totalItems} products found)</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("")
                      const newSearchParams = new URLSearchParams(searchParams)
                      newSearchParams.delete('search')
                      router.replace(`?${newSearchParams.toString()}`)
                    }}
                    className="text-xs"
                    style={{ color: theme.textColor, borderColor: theme.textColor }}
                  >
                    Clear Search
                  </Button>
                </div>
              </div>
            )}

            {/* Products Display */}
            {currentProducts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className={`text-2xl font-semibold mb-4`} style={{ color: theme.textColor }}>No products found</h3>
                <p className={`mb-6`} style={{ color: theme.textColor + 'B3' }}>Try adjusting your filters to find what you are looking for.</p>
                <Button
                  onClick={clearAllFilters}
                  className={`rounded-xl px-8 py-3 font-semibold`}
                  style={{ backgroundColor: theme.textColor, color: theme.backgroundColor }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <GridProductTemplate
                products={currentProducts}
                columns={columns}
                showTitle={showTitle}
                gap={gap}
                bgColor="bg-transparent"
                textColor={theme.textColor}
                accentColor={theme.accentColor}
                borderColor={theme.backgroundColor}
                borderRadius={theme.borderRadius}
                overlayColor={theme.secondaryColor + '80'}
                showCta={showCta}
                ctaText={ctaText}
                titlePosition={titlePosition}
                imageHeight={imageHeight}
                fontFamily={theme.fontFamily}
                cardShadow={cardShadow}
                hoverEffect={hoverEffect}
                cardVariant={cardVariant}
                showSubtitle={showSubtitle}
                cornerRadius={cornerRadius}
                titleColor={theme.textColor}
                titleFontSize={titleFontSize}
                titleFont={titleFont}
                onAddToCart={handleAddToCart}
                onAddToFavorite={handleAddToFavorite}
                showMoreButton={showMoreButton}
              />
            )}

            {/* Pagination */}
            {showPagination && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center mt-12 gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md border transition-colors ${
                      currentPage === 1
                        ? "border-gray-300 text-gray-400 cursor-not-allowed"
                        : `border-current`}
                    `}
                    style={currentPage !== 1 ? { color: theme.textColor, borderColor: theme.textColor } : {}}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => {
                      if (page === "...") {
                        return (
                          <span
                            key={`dots-${index}`}
                            className="px-3 py-2 rounded-md text-sm text-gray-400 cursor-default"
                          >
                            ...
                          </span>
                        )
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handlePageChange(page as number)}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            page === currentPage
                              ? ``
                              : ``
                          }`}
                          style={
                            page === currentPage
                              ? { backgroundColor: theme.textColor, color: theme.backgroundColor }
                              : { color: theme.textColor, borderColor: theme.textColor, borderWidth: 1, borderStyle: 'solid' }
                          }
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md border transition-colors ${
                      currentPage === totalPages
                        ? "border-gray-300 text-gray-400 cursor-not-allowed"
                        : `border-current`}
                    `}
                    style={currentPage !== totalPages ? { color: theme.textColor, borderColor: theme.textColor } : {}}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className={`text-sm`} style={{ color: theme.textColor }}>
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
