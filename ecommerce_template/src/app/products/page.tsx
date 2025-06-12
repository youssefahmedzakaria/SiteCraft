"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter, ChevronLeft, ChevronRight, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

// Generic product interface that can handle any product structure
interface ProductAttribute {
  [key: string]: any
}

interface ProductMedia {
  [key: string]: any
  url?: string
}

interface ProductPrice {
  [key: string]: any
  value?: number
  currency?: string
  compareAtPrice?: number
  onSale?: boolean
}

interface Product {
  id: string
  title?: string
  name?: string
  description?: string
  slug?: string
  path?: string
  media?: ProductMedia | ProductMedia[] | { [key: string]: ProductMedia }
  price?: ProductPrice | number
  category?: string | string[]
  tags?: string[]
  attributes?: ProductAttribute
  [key: string]: any // Allow any additional fields
}

// Generic filter configuration
interface FilterConfig {
  id: string
  type: "search" | "range" | "select" | "multiselect" | "checkbox" | "radio" | "toggle" | "color" | "size"
  label: string
  field: string // The field in the product object to filter on
  options?: { label: string; value: string | number; color?: string }[] // For select, multiselect, checkbox, radio
  min?: number // For range
  max?: number // For range
  step?: number // For range
  defaultValue?: any
  placeholder?: string
  nestedField?: string // For nested fields like price.value
}

interface SortOption {
  id: string
  label: string
  field: string
  direction: "asc" | "desc"
  nestedField?: string // For nested fields like price.value
}

interface ProductsPageConfig {
  title?: string
  perPage?: number
  filters?: FilterConfig[]
  sortOptions?: SortOption[]
  layout?: {
    defaultView?: "grid" | "list" | "compact"
    allowViewChange?: boolean
    columns?: {
      sm?: number
      md?: number
      lg?: number
    }
  }
  pagination?: {
    enabled?: boolean
    position?: "top" | "bottom" | "both"
    type?: "numbered" | "loadMore" | "infinite"
  }
  urls?: {
    product?: string // URL pattern for product pages, e.g., "/products/[slug]"
    category?: string // URL pattern for category pages
  }
  currency?: {
    code?: string
    symbol?: string
    position?: "before" | "after"
  }
  theme?: {
    colors?: {
      primary?: string
      secondary?: string
      accent?: string
      background?: string
      text?: string
      border?: string
    }
    borderRadius?: string
    cardShadow?: string
  }
}

// Default configuration
const defaultConfig: ProductsPageConfig = {
  title: "Products",
  perPage: 12,
  filters: [
    {
      id: "search",
      type: "search",
      label: "Search",
      field: "all", // Special case to search across multiple fields
      placeholder: "Search products...",
    },
    {
      id: "price",
      type: "range",
      label: "Price",
      field: "price",
      nestedField: "value",
      min: 0,
      max: 1000,
      step: 10,
      defaultValue: [0, 1000],
    },
    {
      id: "category",
      type: "multiselect",
      label: "Categories",
      field: "category",
      options: [],
    },
  ],
  sortOptions: [
    { id: "featured", label: "Featured", field: "featured", direction: "desc" },
    { id: "price-asc", label: "Price: Low to High", field: "price", nestedField: "value", direction: "asc" },
    { id: "price-desc", label: "Price: High to Low", field: "price", nestedField: "value", direction: "desc" },
    { id: "name-asc", label: "Name: A to Z", field: "name", direction: "asc" },
    { id: "name-desc", label: "Name: Z to A", field: "name", direction: "desc" },
    { id: "newest", label: "Newest", field: "createdAt", direction: "desc" },
    { id: "oldest", label: "Oldest", field: "createdAt", direction: "asc" },
  ],
  layout: {
    defaultView: "grid",
    allowViewChange: true,
    columns: { sm: 2, md: 3, lg: 4 },
  },
  pagination: {
    enabled: true,
    position: "bottom",
    type: "numbered",
  },
  urls: {
    product: "/products/[slug]",
    category: "/categories/[slug]",
  },
  currency: {
    code: "USD",
    symbol: "$",
    position: "before",
  },
  theme: {
    colors: {
      primary: "bg-yellow-400 hover:bg-yellow-500 text-black",
      secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
      accent: "bg-blue-600 hover:bg-blue-700 text-white",
      background: "bg-white",
      text: "text-gray-900",
      border: "border-gray-200",
    },
    borderRadius: "rounded-md",
    cardShadow: "shadow-sm hover:shadow-md",
  },
}

// Helper function to get nested property value
const getNestedValue = (obj: any, path: string | undefined, defaultValue: any = undefined): any => {
  if (!path) return obj
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj)
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)
  return result === undefined || result === obj ? defaultValue : result
}

// Helper function to format price
const formatPrice = (price: any, config: ProductsPageConfig): string => {
  if (price === undefined || price === null) return ""

  let value: number
  if (typeof price === "number") {
    value = price
  } else if (typeof price === "object" && "value" in price) {
    value = price.value as number
  } else if (typeof price === "object" && "price" in price) {
    value = price.price as number
  } else {
    return ""
  }

  const symbol = config.currency?.symbol || "$"
  const formattedValue = value.toFixed(2)

  return config.currency?.position === "after" ? `${formattedValue} ${symbol}` : `${symbol}${formattedValue}`
}

// Helper function to get product image URL
const getProductImageUrl = (product: Product): string => {
  if (!product.media) return "/placeholder.svg"

  if (typeof product.media === "string") return product.media

  if (Array.isArray(product.media) && product.media.length > 0) {
    const firstMedia = product.media[0]
    return typeof firstMedia === "string" ? firstMedia : firstMedia.url || "/placeholder.svg"
  }

  if (typeof product.media === "object") {
    // Try common patterns
    if ("url" in product.media) return product.media.url as string
    if ("src" in product.media) return product.media.src as string
    if ("mainMedia" in product.media && typeof product.media.mainMedia === "object") {
      const mainMedia = product.media.mainMedia
      if ("url" in mainMedia) return mainMedia.url as string
      if ("src" in mainMedia) return mainMedia.src as string
      if ("image" in mainMedia && typeof mainMedia.image === "object" && "url" in mainMedia.image) {
        return mainMedia.image.url as string
      }
    }
    if ("featured" in product.media && typeof product.media.featured === "object") {
      const featured = product.media.featured
      if ("url" in featured) return featured.url as string
      if ("src" in featured) return featured.src as string
    }
  }

  return "/placeholder.svg"
}

// Helper function to get product name
const getProductName = (product: Product): string => {
  return product.name || product.title || "Untitled Product"
}

// Helper function to get product price
const getProductPrice = (product: Product): number => {
  if (typeof product.price === "number") return product.price
  if (typeof product.price === "object" && "value" in product.price) return product.price.value as number
  if (typeof product.price === "object" && "price" in product.price) return product.price.price as number
  return 0
}

// Helper function to get product category
const getProductCategory = (product: Product): string[] => {
  if (!product.category) return []
  if (typeof product.category === "string") return [product.category]
  if (Array.isArray(product.category)) return product.category as string[]
  return []
}

// Helper function to get product URL
const getProductUrl = (product: Product, config: ProductsPageConfig): string => {
  const urlPattern = config.urls?.product || "/products/[slug]"
  const slug = product.slug || product.id
  return urlPattern.replace("[slug]", slug)
}

// Helper function to extract all unique categories from products
const extractCategories = (products: Product[]): { label: string; value: string }[] => {
  const categoriesSet = new Set<string>()

  products.forEach((product) => {
    const categories = getProductCategory(product)
    categories.forEach((category) => categoriesSet.add(category))
  })

  return Array.from(categoriesSet).map((category) => ({
    label: category,
    value: category,
  }))
}

// Helper function to extract price range from products
const extractPriceRange = (products: Product[]): [number, number] => {
  if (products.length === 0) return [0, 1000]

  let min = Number.MAX_VALUE
  let max = Number.MIN_VALUE

  products.forEach((product) => {
    const price = getProductPrice(product)
    if (price < min) min = price
    if (price > max) max = price
  })

  // Round min down and max up to nearest 10
  min = Math.floor(min / 10) * 10
  max = Math.ceil(max / 10) * 10

  return [min, max]
}

interface ProductsPageProps {
  products: Product[]
  config?: Partial<ProductsPageConfig>
}

export default function ProductsPage({ products: initialProducts = [], config: userConfig = {} }: ProductsPageProps) {
  // Create a memoized config to prevent unnecessary re-renders
  const configRef = useRef<ProductsPageConfig>({
    ...defaultConfig,
    ...userConfig,
    filters: [...(defaultConfig.filters || []), ...(userConfig.filters || [])],
    sortOptions: [...(defaultConfig.sortOptions || []), ...(userConfig.sortOptions || [])],
    layout: {
      ...defaultConfig.layout,
      ...userConfig.layout,
    },
    pagination: {
      ...defaultConfig.pagination,
      ...userConfig.pagination,
    },
    urls: {
      ...defaultConfig.urls,
      ...userConfig.urls,
    },
    currency: {
      ...defaultConfig.currency,
      ...userConfig.currency,
    },
    theme: {
      ...defaultConfig.theme,
      ...userConfig.theme,
      colors: {
        ...defaultConfig.theme?.colors,
        ...userConfig.theme?.colors,
      },
    },
  })
  const config = configRef.current

  // State
  const [products] = useState<Product[]>(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [view, setView] = useState<"grid" | "list" | "compact">(config.layout?.defaultView || "grid")

  // Dynamic filter state
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string }[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const filtersInitialized = useRef(false)

  // Initialize filter values with defaults - only once
  useEffect(() => {
    if (filtersInitialized.current) return

    const initialFilterValues: Record<string, any> = {}
    config.filters?.forEach((filter) => {
      if (filter.defaultValue !== undefined) {
        initialFilterValues[filter.id] = filter.defaultValue
      } else {
        switch (filter.type) {
          case "search":
            initialFilterValues[filter.id] = ""
            break
          case "range":
            initialFilterValues[filter.id] = [filter.min || 0, filter.max || 1000]
            break
          case "multiselect":
          case "checkbox":
            initialFilterValues[filter.id] = []
            break
          case "select":
          case "radio":
            initialFilterValues[filter.id] = ""
            break
          case "toggle":
            initialFilterValues[filter.id] = false
            break
        }
      }
    })

    // Set default sort option
    initialFilterValues.sortBy = config.sortOptions?.[0]?.id || "featured"

    setFilterValues(initialFilterValues)
    filtersInitialized.current = true
  }, [config.filters, config.sortOptions])

  // Extract category options and price range from products - only once
  useEffect(() => {
    if (products.length > 0) {
      // Extract categories
      const categories = extractCategories(products)
      setCategoryOptions(categories)

      // Extract price range
      const [min, max] = extractPriceRange(products)
      setPriceRange([min, max])

      // Update price filter value if not set yet
      setFilterValues((prev) => {
        if (!prev.price) {
          return { ...prev, price: [min, max] }
        }
        return prev
      })
    }
  }, [products])

  // Apply filters and sorting when filterValues change
  useEffect(() => {
    if (products.length === 0 || !filtersInitialized.current) return

    let filtered = [...products]

    // Apply all filters
    config.filters?.forEach((filter) => {
      const value = filterValues[filter.id]
      if (value === undefined || value === null) return

      switch (filter.type) {
        case "search":
          if (value && typeof value === "string" && value.trim() !== "") {
            const searchTerm = value.toLowerCase()
            filtered = filtered.filter((product) => {
              if (filter.field === "all") {
                // Search across multiple fields
                return (
                  getProductName(product).toLowerCase().includes(searchTerm) ||
                  (product.description && product.description.toLowerCase().includes(searchTerm))
                )
              } else {
                const fieldValue = getNestedValue(product, filter.field)
                return fieldValue && String(fieldValue).toLowerCase().includes(searchTerm)
              }
            })
          }
          break
        case "range":
          if (Array.isArray(value) && value.length === 2) {
            filtered = filtered.filter((product) => {
              let fieldValue
              if (filter.nestedField) {
                const obj = getNestedValue(product, filter.field)
                fieldValue = obj ? getNestedValue(obj, filter.nestedField) : undefined
              } else {
                fieldValue = getNestedValue(product, filter.field)
              }

              // Handle special case for price
              if (filter.field === "price" && typeof fieldValue !== "number") {
                fieldValue = getProductPrice(product)
              }

              return fieldValue >= value[0] && fieldValue <= value[1]
            })
          }
          break
        case "multiselect":
        case "checkbox":
          if (Array.isArray(value) && value.length > 0) {
            filtered = filtered.filter((product) => {
              let fieldValue = getNestedValue(product, filter.field)

              // Handle special case for category
              if (filter.field === "category") {
                fieldValue = getProductCategory(product)
              }

              if (Array.isArray(fieldValue)) {
                return fieldValue.some((v) => value.includes(v))
              }
              return value.includes(fieldValue)
            })
          }
          break
        case "select":
        case "radio":
          if (value) {
            filtered = filtered.filter((product) => {
              const fieldValue = getNestedValue(product, filter.field)
              return fieldValue === value
            })
          }
          break
        case "toggle":
          if (value === true) {
            filtered = filtered.filter((product) => {
              const fieldValue = getNestedValue(product, filter.field)
              return Boolean(fieldValue)
            })
          }
          break
      }
    })

    // Apply sorting
    const sortOption = config.sortOptions?.find((option) => option.id === filterValues.sortBy)
    if (sortOption) {
      filtered.sort((a, b) => {
        let aValue, bValue

        if (sortOption.nestedField) {
          const aObj = getNestedValue(a, sortOption.field)
          const bObj = getNestedValue(b, sortOption.field)
          aValue = aObj ? getNestedValue(aObj, sortOption.nestedField) : undefined
          bValue = bObj ? getNestedValue(bObj, sortOption.nestedField) : undefined
        } else {
          aValue = getNestedValue(a, sortOption.field)
          bValue = getNestedValue(b, sortOption.field)
        }

        // Handle special cases
        if (sortOption.field === "price") {
          aValue = getProductPrice(a)
          bValue = getProductPrice(b)
        } else if (sortOption.field === "name") {
          aValue = getProductName(a)
          bValue = getProductName(b)
        }

        if (aValue === undefined) return 1
        if (bValue === undefined) return -1
        if (aValue === bValue) return 0

        const modifier = sortOption.direction === "asc" ? 1 : -1
        return aValue > bValue ? modifier : -modifier
      })
    }

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [filterValues, products])

  // Calculate pagination
  const perPage = config.perPage || 12
  const totalProducts = filteredProducts.length
  const totalPages = Math.ceil(totalProducts / perPage)
  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleFilterChange = (filterId: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [filterId]: value }))
  }

  const clearAllFilters = () => {
    const clearedValues: Record<string, any> = {}
    config.filters?.forEach((filter) => {
      switch (filter.type) {
        case "search":
          clearedValues[filter.id] = ""
          break
        case "range":
          if (filter.id === "price") {
            clearedValues[filter.id] = priceRange
          } else {
            clearedValues[filter.id] = [filter.min || 0, filter.max || 1000]
          }
          break
        case "multiselect":
        case "checkbox":
          clearedValues[filter.id] = []
          break
        case "select":
        case "radio":
          clearedValues[filter.id] = ""
          break
        case "toggle":
          clearedValues[filter.id] = false
          break
      }
    })
    clearedValues.sortBy = config.sortOptions?.[0]?.id || "featured"
    setFilterValues(clearedValues)
  }

  // Render filter component based on filter type
  const renderFilter = (filter: FilterConfig) => {
    const value = filterValues[filter.id]

    switch (filter.type) {
      case "search":
        return (
          <div className="relative">
            <Input
              placeholder={filter.placeholder || "Search..."}
              value={value || ""}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              className="pl-10 border-gray-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        )
      case "range":
        const rangeValue = value || (filter.id === "price" ? priceRange : [filter.min || 0, filter.max || 1000])
        return (
          <>
            <Slider
              min={filter.id === "price" ? priceRange[0] : filter.min || 0}
              max={filter.id === "price" ? priceRange[1] : filter.max || 1000}
              step={filter.step || 10}
              value={rangeValue}
              onValueChange={(newValue) => handleFilterChange(filter.id, newValue)}
              className="my-6"
            />
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>
                {config.currency?.position === "before" ? config.currency?.symbol : ""}
                {rangeValue[0]}
                {config.currency?.position === "after" ? ` ${config.currency?.symbol}` : ""}
              </span>
              <span>
                {config.currency?.position === "before" ? config.currency?.symbol : ""}
                {rangeValue[1]}
                {config.currency?.position === "after" ? ` ${config.currency?.symbol}` : ""}
              </span>
            </div>
          </>
        )
      case "multiselect":
      case "checkbox":
        // Use categoryOptions for category filter, otherwise use filter.options
        const options = filter.id === "category" ? categoryOptions : filter.options || []
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={(value || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const newValue = checked
                      ? [...(value || []), option.value]
                      : (value || []).filter((v: any) => v !== option.value)
                    handleFilterChange(filter.id, newValue)
                  }}
                  className="rounded-sm"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )
      case "select":
        return (
          <Select value={value} onValueChange={(newValue) => handleFilterChange(filter.id, newValue)}>
            <SelectTrigger className="w-full border-gray-300">
              <SelectValue placeholder={filter.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return null
    }
  }

  // Determine grid columns based on view and config
  const gridColumns = () => {
    const cols = config.layout?.columns || { sm: 2, md: 3, lg: 4 }
    return `grid grid-cols-${cols.sm} md:grid-cols-${cols.md} lg:grid-cols-${cols.lg} gap-4 md:gap-6`
  }

  return (
    <div className={cn("container mx-auto px-4 py-8 max-w-7xl", config.theme?.colors?.background)}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className={cn("text-3xl font-bold", config.theme?.colors?.text)}>{config.title}</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Search filter if configured to show in header */}
          {config.filters?.some((f) => f.id === "search") && (
            <div className="relative flex-1 md:w-64">
              <Input
                placeholder="Search products..."
                value={filterValues.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 border-gray-300 rounded-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          )}

          {/* View switcher */}
          {config.layout?.allowViewChange && (
            <Select value={view} onValueChange={(value: "grid" | "list" | "compact") => setView(value)}>
              <SelectTrigger className="w-[120px] border-gray-300">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid View</SelectItem>
                <SelectItem value="list">List View</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Mobile filter button */}
          <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="md:hidden border-gray-300">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div
          className={cn(
            isFilterOpen ? "block" : "hidden md:block",
            "bg-white md:sticky md:top-24 md:self-start md:w-64 space-y-6",
          )}
        >
          {isFilterOpen && (
            <div className="flex justify-between items-center mb-4 md:hidden">
              <h2 className="text-xl font-bold">Filters</h2>
              <Button variant="ghost" onClick={() => setIsFilterOpen(false)}>
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" />
              </Button>
            </div>
          )}

          {/* Dynamic filters */}
          {config.filters?.map((filter) => {
            // Skip search filter if it's shown in the header
            if (filter.id === "search") return null

            return (
              <div key={filter.id} className="space-y-2">
                <h3 className="font-medium text-gray-900 mb-3">{filter.label}</h3>
                {renderFilter(filter)}
              </div>
            )
          })}

          {/* Sort options */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Sort By</h3>
            <Select
              value={filterValues.sortBy || config.sortOptions?.[0]?.id}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
            >
              <SelectTrigger className="w-full border-gray-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {config.sortOptions?.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50" onClick={clearAllFilters}>
            Clear All Filters
          </Button>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Products Count */}
          <div className="mb-6">
            <p className="text-gray-500 text-sm">
              Showing {paginatedProducts.length} of {totalProducts} products
            </p>
          </div>

          {isLoading ? (
            <div className={gridColumns()}>
              {Array.from({ length: perPage }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-md mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter to find what you are looking for.</p>
              <Button variant="default" onClick={clearAllFilters} className={cn("mt-4", config.theme?.colors?.primary)}>
                Clear Filters
              </Button>
            </div>
          ) : view === "grid" ? (
            <div className={gridColumns()}>
              {paginatedProducts.map((product) => (
                <Link
                  href={getProductUrl(product, config)}
                  key={product.id}
                  className="group transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={cn(
                      "bg-white overflow-hidden border border-gray-100",
                      config.theme?.borderRadius,
                      config.theme?.cardShadow,
                    )}
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={getProductImageUrl(product) || "/placeholder.svg"}
                        alt={getProductName(product)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 line-clamp-1">{getProductName(product)}</h3>
                      {product.category && (
                        <p className="text-sm text-gray-500 mb-1">
                          {Array.isArray(product.category) ? product.category[0] : product.category}
                        </p>
                      )}
                      <p className="font-semibold">{formatPrice(product.price, config)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : view === "list" ? (
            <div className="space-y-4">
              {paginatedProducts.map((product) => (
                <Link
                  href={getProductUrl(product, config)}
                  key={product.id}
                  className="group transition-all duration-300 hover:-translate-y-1 block"
                >
                  <div
                    className={cn(
                      "bg-white overflow-hidden border border-gray-100 flex",
                      config.theme?.borderRadius,
                      config.theme?.cardShadow,
                    )}
                  >
                    <div className="relative w-1/3 aspect-square">
                      <Image
                        src={getProductImageUrl(product) || "/placeholder.svg"}
                        alt={getProductName(product)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 w-2/3">
                      <h3 className="font-medium text-gray-900">{getProductName(product)}</h3>
                      {product.category && (
                        <p className="text-sm text-gray-500 mb-1">
                          {Array.isArray(product.category) ? product.category[0] : product.category}
                        </p>
                      )}
                      <p className="font-semibold">{formatPrice(product.price, config)}</p>
                      {product.description && (
                        <p className="text-sm text-gray-500 my-2 line-clamp-2">{product.description}</p>
                      )}
                      <Button className={cn("mt-3", config.theme?.colors?.primary)}>View Product</Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {paginatedProducts.map((product) => (
                <Link
                  href={getProductUrl(product, config)}
                  key={product.id}
                  className="group transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={cn(
                      "bg-white overflow-hidden border border-gray-100",
                      config.theme?.borderRadius,
                      config.theme?.cardShadow,
                    )}
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={getProductImageUrl(product) || "/placeholder.svg"}
                        alt={getProductName(product)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{getProductName(product)}</h3>
                      <p className="font-semibold text-sm">{formatPrice(product.price, config)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {config.pagination?.enabled && totalPages > 1 && (
            <div className="flex justify-center items-center mt-10 gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 border-gray-300"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, and pages around current page
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        "h-8 w-8 p-0",
                        page === currentPage ? config.theme?.colors?.primary : "border-gray-300",
                      )}
                    >
                      {page}
                    </Button>
                  )
                }

                // Show ellipsis for skipped pages
                if ((page === 2 && currentPage > 3) || (page === totalPages - 1 && currentPage < totalPages - 2)) {
                  return (
                    <span key={page} className="px-2">
                      ...
                    </span>
                  )
                }

                return null
              })}

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0 border-gray-300"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
