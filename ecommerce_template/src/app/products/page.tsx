"use client"
import { useState } from "react"
import {GridProductTemplate,HorizontalScrollProductTemplate,ListViewProductTemplate,FeaturedGridProductTemplate} from "@/components/product-lists";
import { ChevronLeft, ChevronRight, Filter, Search, User, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const products = [
  {
    id: 1,
    name: "Diamond Solitaire Ring",
    price: { value: 299.99 },
    category: "Rings",
    media: { mainMedia: { image: { url: "/ring2.jpg" } } },
    slug: "diamond-solitaire-ring",
    description: "Elegant diamond solitaire ring crafted in 18k gold",
    inStock: true,
  },
  {
    id: 2,
    name: "Pearl Drop Earrings",
    price: { value: 199.99 },
    category: "Earrings",
    media: { mainMedia: { image: { url: "/earing.jpg" } } },
    slug: "pearl-drop-earrings",
    description: "Classic pearl drop earrings with sterling silver",
    inStock: true,
  },
  {
    id: 3,
    name: "Gold Chain Necklace",
    price: { value: 399.99 },
    category: "Necklaces",
    media: { mainMedia: { image: { url: "/neckless.jpg" } } },
    slug: "gold-chain-necklace",
    description: "Luxurious 14k gold chain necklace",
    inStock: true,
  },
  {
    id: 4,
    name: "Silver Hoop Earrings",
    price: { value: 89.99 },
    category: "Earrings",
    media: { mainMedia: { image: { url: "/earing.jpg" } } },
    slug: "silver-hoop-earrings",
    description: "Modern silver hoop earrings for everyday wear",
    inStock: false,
  },
  {
    id: 5,
    name: "Ruby Engagement Ring",
    price: { value: 599.99 },
    category: "Rings",
    media: { mainMedia: { image: { url: "/ring2.jpg" } } },
    slug: "ruby-engagement-ring",
    description: "Stunning ruby engagement ring with diamond accents",
    inStock: true,
  },
  {
    id: 6,
    name: "Vintage Pearl Necklace",
    price: { value: 449.99 },
    category: "Necklaces",
    media: { mainMedia: { image: { url: "/neckless.jpg" } } },
    slug: "vintage-pearl-necklace",
    description: "Vintage-inspired pearl necklace with gold clasp",
    inStock: true,
  },
  {
    id: 7,
    name: "Tennis Bracelet",
    price: { value: 799.99 },
    category: "Bracelets",
    media: { mainMedia: { image: { url: "/ring2.jpg" } } },
    slug: "tennis-bracelet",
    description: "Classic diamond tennis bracelet in white gold",
    inStock: true,
  },
  {
    id: 8,
    name: "Luxury Watch",
    price: { value: 1299.99 },
    category: "Watches",
    media: { mainMedia: { image: { url: "/earing.jpg" } } },
    slug: "luxury-watch",
    description: "Swiss-made luxury watch with leather strap",
    inStock: true,
  },
  {
    id: 9,
    name: "Heart Pendant",
    price: { value: 249.99 },
    category: "Pendants",
    media: { mainMedia: { image: { url: "/neckless.jpg" } } },
    slug: "heart-pendant",
    description: "Romantic heart pendant with diamond accent",
    inStock: true,
  },
  {
    id: 10,
    name: "Charm Anklet",
    price: { value: 129.99 },
    category: "Anklets",
    media: { mainMedia: { image: { url: "/ring2.jpg" } } },
    slug: "charm-anklet",
    description: "Delicate anklet with multiple charms",
    inStock: true,
  },
  {
    id: 11,
    name: "Gold Chain",
    price: { value: 349.99 },
    category: "Chains",
    media: { mainMedia: { image: { url: "/earing.jpg" } } },
    slug: "gold-chain",
    description: "18k gold chain for layering",
    inStock: true,
  },
  {
    id: 12,
    name: "Lucky Charm",
    price: { value: 79.99 },
    category: "Charms",
    media: { mainMedia: { image: { url: "/neckless.jpg" } } },
    slug: "lucky-charm",
    description: "Sterling silver lucky charm pendant",
    inStock: true,
  },
  {
    id: 13,
    name: "Rose Gold Ring",
    price: { value: 179.99 },
    category: "Rings",
    media: { mainMedia: { image: { url: "/ring2.jpg" } } },
    slug: "rose-gold-ring",
    description: "Beautiful rose gold ring with intricate design",
    inStock: true,
  },
  {
    id: 14,
    name: "Crystal Earrings",
    price: { value: 129.99 },
    category: "Earrings",
    media: { mainMedia: { image: { url: "/earing.jpg" } } },
    slug: "crystal-earrings",
    description: "Sparkling crystal drop earrings",
    inStock: true,
  },
  {
    id: 15,
    name: "Infinity Necklace",
    price: { value: 219.99 },
    category: "Necklaces",
    media: { mainMedia: { image: { url: "/neckless.jpg" } } },
    slug: "infinity-necklace",
    description: "Elegant infinity symbol necklace in silver",
    inStock: true,
  },
  {
    id: 16,
    name: "Statement Bracelet",
    price: { value: 329.99 },
    category: "Bracelets",
    media: { mainMedia: { image: { url: "/ring2.jpg" } } },
    slug: "statement-bracelet",
    description: "Bold statement bracelet with gemstones",
    inStock: false,
  },
]

export default function JewelryProductsPage({
  // Text configuration props
  mainTitle = "Jewelry Products",
  subtitle = "Discover our exquisite collection of handcrafted jewelry pieces, each designed to tell your unique story",
  ctaText = "View Product",
  
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
  
  // Template selection and props
  columns = { sm: 2, md: 3, lg: 3 },
  showTitle = false,
  textColor = "text-[#4A102A]",
  borderRadius = "rounded-2xl",
  hoverEffect = true,
  gap = "gap-8",
  imageHeight = "aspect-[4/3]",
  titlePosition = "overlay" as "overlay" | "top" | "bottom",
  showCta = true,
  cornerRadius = "large" as "large" | "small" | "none" | "medium",
  cardShadow = "shadow-xl hover:shadow-2xl",
  showSubtitle = false,
  borderColor = "border-white/20",
  cardVariant = "hover" as "overlay" | "default" | "compact" | "detailed" | "minimal" | "hover" | "featured",
  titleColor = "text-white",
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
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(itemsPerPage)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Filter states
  const [maxPrice, setMaxPrice] = useState(maxPriceLimit)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("featured")
  const [showInStockOnly, setShowInStockOnly] = useState(false)

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
    window.scrollTo({ top: 200, behavior: 'smooth' })
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
    setCurrentPage(1)
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

  const handleAddToCart = (product: any) => {
    console.log('Added to cart:', product)
    // Add your cart logic here
  }

  const handleAddToFavorite = (product: any) => {
    console.log('Added to favorites:', product)
    // Add your favorites logic here
  }

  return (
    <div className={`min-h-screen ${bgColor} pt-20`}>
      <div className="container mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className={`text-5xl ${titleFont} ${pageTitleColor} mb-4`}>
            {mainTitle}
          </h1>
          <p className={`text-xl ${subtitleColor} font-light max-w-2xl mx-auto`}>
            {subtitle}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          {showFilters && (
            <div
              className={cn(
                "transition-all duration-300 ease-in-out",
                isFilterOpen ? "w-80 opacity-100" : "w-0 opacity-0 overflow-hidden",
              )}
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 w-80">
                {/* Maximum Price */}
                {enablePriceFilter && (
                  <div className="space-y-4 mb-6">
                    <h3 className={`text-lg font-semibold ${textColor}`}>Maximum Price</h3>
                    <Slider
                      min={0}
                      max={maxPriceLimit}
                      step={10}
                      value={[maxPrice]}
                      onValueChange={(value) => setMaxPrice(value[0])}
                      className="my-6"
                    />
                    <div className={`flex justify-between text-sm ${textColor}/70`}>
                      <span>$0</span>
                      <span>${maxPrice}</span>
                    </div>
                  </div>
                )}

                {/* Categories */}
                {enableCategoryFilter && (
                  <div className="space-y-4 mb-6">
                    <h3 className={`text-lg font-semibold ${textColor}`}>Categories</h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {categories.map((category) => (
                        <label key={category} className="flex items-center space-x-3 cursor-pointer">
                          <Checkbox
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                            className={`rounded-md border-2 border-current`}
                          />
                          <span className={`${textColor} font-medium text-sm`}>{category}</span>
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
                      <span className={`${textColor} font-medium`}>In Stock Only</span>
                    </label>
                  </div>
                )}

                {/* Sort */}
                {enableSorting && (
                  <div className="space-y-4 mb-6">
                    <h3 className={`text-lg font-semibold ${textColor}`}>Sort By</h3>
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
                  className={`w-full border-2 border-current hover:${accentColor} rounded-xl font-semibold ${textColor}`}
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}

          {/* Products Section */}
          <div className="flex-1">
            {/* Items per page selector and results info */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <div className={`${textColor} text-sm`}>
                {Math.min(endIndex, totalItems)} out of {totalItems} products
              </div>
              
              <div className="flex items-center gap-4">
                {showFilters && (
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`border-2 border-current rounded-xl ${textColor} hover:${accentColor}`}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                )}
              </div>
            </div>

            {/* Products Display */}
            {currentProducts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className={`text-2xl font-semibold ${textColor} mb-4`}>No products found</h3>
                <p className={`${textColor}/70 mb-6`}>Try adjusting your filters to find what you are looking for.</p>
                <Button
                  onClick={clearAllFilters}
                  className={`${pageTitleColor.replace('text-', 'bg-')} hover:opacity-90 text-white rounded-xl px-8 py-3 font-semibold`}
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
                textColor={textColor}
                accentColor={accentColor}
                borderColor={borderColor}
                borderRadius={borderRadius}
                overlayColor={overlayColor}
                showCta={showCta}
                ctaText={ctaText}
                titlePosition={titlePosition}
                imageHeight={imageHeight}
                fontFamily={fontFamily}
                cardShadow={cardShadow}
                hoverEffect={hoverEffect}
                cardVariant={cardVariant}
                showSubtitle={showSubtitle}
                cornerRadius={cornerRadius}
                titleColor={titleColor}
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
                    className={`p-2 rounded-md border transition-colors ${currentPage === 1 
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                      : `border-current ${textColor} hover:${accentColor}`
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => {
                        if (page === '...') {
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
                                ? `${pageTitleColor.replace('text-', 'bg-')} text-white`
                                : `${textColor} hover:${accentColor} border border-current`
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md border transition-colors ${currentPage === totalPages 
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                      : `border-current ${textColor} hover:${accentColor}`
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
      </div>
    </div>
  )
}