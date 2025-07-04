"use client";
import { useEffect, useState } from "react";
import { GridProductTemplate } from "@/components/e-commerce/product-lists";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/e-commerce/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/e-commerce/ui/select";
import { Slider } from "@/components/e-commerce/ui/slider";
import { Checkbox } from "@/components/e-commerce/ui/checkbox";
import { cn } from "@/lib/utils";
import { useProductManagement } from "@/hooks/useProductManagement";
import { getCategories, SimplifiedProduct } from "@/lib/products";

// Theme configuration (matching product page structure)
const defaultTheme = {
  backgroundColor: "white",
  textColor: "black",
  accentColor: "white",
  secondaryColor: "black",
  borderRadius: "rounded-lg",
  fontFamily: "font-sans",
};

// Optionally, import ThemeConfig type from product page for type safety
// import type { ThemeConfig } from "../product/[slug]/product"

export default function ProductsPage({
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
  const [categoryFilter, setCategoryFilter] =
    useState<string>("All Categories");
  const [stockFilter, setStockFilter] = useState<string>("All Stock");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const stockStatuses = ["All Stock", "In Stock", "Out of Stock"];
  const [file, setFile] = useState<File | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectionDropdownOpen, setSelectionDropdownOpen] = useState(false);
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { products, isLoading, error, clearError, fetchProducts } =
    useProductManagement();

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Apply filters
  const filteredProducts = products.filter((product: SimplifiedProduct) => {
    // Filter by category
    if (categoryFilter !== "All Categories") {
      if (!product.categoryId) return false;
      const category = categories.find((c) => c.id === product.categoryId);
      if (!category || category.name !== categoryFilter) {
        return false;
      }
    }

    // Filter by stock status
    if (stockFilter !== "All Stock") {
      const productStatus = product.stock > 0 ? "In Stock" : "Out of Stock";
      if (productStatus !== stockFilter) {
        return false;
      }
    }

    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const productName = product.name.toLowerCase();
      const productDescription = product.description.toLowerCase();

      if (
        !productName.includes(searchLower) &&
        !productDescription.includes(searchLower)
      ) {
        return false;
      }
    }

    return true;
  });

  //---------------------------------------------------------------------------------------------------------------

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItemsPerPage, setSelectedItemsPerPage] =
    useState(itemsPerPage);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter states
  const [maxPrice, setMaxPrice] = useState(maxPriceLimit);
  const [sortBy, setSortBy] = useState("featured");
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / selectedItemsPerPage);
  const startIndex = (currentPage - 1) * selectedItemsPerPage;
  const endIndex = startIndex + selectedItemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setSelectedItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setMaxPrice(maxPriceLimit);
    setSelectedCategories([]);
    setSortBy("featured");
    setShowInStockOnly(false);
    setCurrentPage(1);
  };

  // Generate page numbers for pagination (matching categories page)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const handleAddToCart = (product: any) => {
    console.log("Added to cart:", product);
    // Add your cart logic here
  };

  const handleAddToFavorite = (product: any) => {
    console.log("Added to favorites:", product);
    // Add your favorites logic here
  };

  //-----------------------------------------------------------------------------------------------------------------------

  return (
    <div
      className={`min-h-screen pt-20 ${theme.fontFamily}`}
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1
            className={`text-5xl font-bold mb-4`}
            style={{ color: theme.textColor }}
          >
            {mainTitle}
          </h1>
          <p
            className={`text-xl font-light max-w-2xl mx-auto`}
            style={{ color: theme.textColor + "CC" }}
          >
            {subtitle}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar/Overlay */}
          {showFilters && (
            <>
              {/* Mobile Overlay Background */}
              {isFilterOpen && (
                <div
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                  onClick={() => setIsFilterOpen(false)}
                />
              )}

              {/* Filter Content */}
              <div
                className={cn(
                  "transition-all duration-300 ease-in-out",
                  // Desktop: sliding sidebar
                  "hidden md:block",
                  isFilterOpen
                    ? "w-80 opacity-100"
                    : "w-0 opacity-0 overflow-hidden"
                )}
              >
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 w-80">
                  {/* Filter content remains the same */}
                  {/* Maximum Price */}
                  {enablePriceFilter && (
                    <div className="space-y-4 mb-6">
                      <h3
                        className={`text-lg font-semibold`}
                        style={{ color: theme.textColor }}
                      >
                        Maximum Price
                      </h3>
                      <Slider
                        min={0}
                        max={maxPriceLimit}
                        step={10}
                        value={[maxPrice]}
                        onValueChange={(value) => setMaxPrice(value[0])}
                        className="my-6"
                      />
                      <div
                        className={`flex justify-between text-sm`}
                        style={{ color: theme.textColor + "B3" }}
                      >
                        <span>$0</span>
                        <span>${maxPrice}</span>
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  {enableCategoryFilter && (
                    <div className="space-y-4 mb-6">
                      <h3
                        className={`text-lg font-semibold`}
                        style={{ color: theme.textColor }}
                      >
                        Categories
                      </h3>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {categories.map((category) => (
                          <label
                            key={category.name}
                            className="flex items-center space-x-3 cursor-pointer"
                          >
                            <Checkbox
                              checked={selectedCategories.includes(
                                category.name
                              )}
                              onCheckedChange={(checked) =>
                                handleCategoryChange(
                                  category.name,
                                  checked as boolean
                                )
                              }
                              className={`rounded-md border-2 border-current`}
                            />
                            <span
                              className={`font-medium text-sm`}
                              style={{ color: theme.textColor }}
                            >
                              {category.name}
                            </span>
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
                          onCheckedChange={(checked) =>
                            setShowInStockOnly(checked === true)
                          }
                          className="rounded-md border-2 border-current"
                        />
                        <span
                          className={`font-medium`}
                          style={{ color: theme.textColor }}
                        >
                          In Stock Only
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Sort */}
                  {enableSorting && (
                    <div className="space-y-4 mb-6">
                      <h3
                        className={`text-lg font-semibold`}
                        style={{ color: theme.textColor }}
                      >
                        Sort By
                      </h3>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full border-2 border-current rounded-xl">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="featured">Featured</SelectItem>
                          <SelectItem value="price-asc">
                            Price: Low to High
                          </SelectItem>
                          <SelectItem value="price-desc">
                            Price: High to Low
                          </SelectItem>
                          <SelectItem value="name-asc">Name: A to Z</SelectItem>
                          <SelectItem value="name-desc">
                            Name: Z to A
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className={`w-full border-2 border-current rounded-xl font-semibold`}
                    style={{
                      color: theme.textColor,
                      borderColor: theme.textColor,
                    }}
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
                  isFilterOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-full pointer-events-none"
                )}
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20 h-full overflow-y-auto">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <h2
                      className={`text-xl font-bold`}
                      style={{ color: theme.textColor }}
                    >
                      Filters
                    </h2>
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
                      <h3
                        className={`text-lg font-semibold`}
                        style={{ color: theme.textColor }}
                      >
                        Maximum Price
                      </h3>
                      <Slider
                        min={0}
                        max={maxPriceLimit}
                        step={10}
                        value={[maxPrice]}
                        onValueChange={(value) => setMaxPrice(value[0])}
                        className="my-6"
                      />
                      <div
                        className={`flex justify-between text-sm`}
                        style={{ color: theme.textColor + "B3" }}
                      >
                        <span>$0</span>
                        <span>${maxPrice}</span>
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  {enableCategoryFilter && (
                    <div className="space-y-4 mb-6">
                      <h3
                        className={`text-lg font-semibold`}
                        style={{ color: theme.textColor }}
                      >
                        Categories
                      </h3>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {categories.map((category) => (
                          <label
                            key={category.name}
                            className="flex items-center space-x-3 cursor-pointer"
                          >
                            <Checkbox
                              checked={selectedCategories.includes(
                                category.name
                              )}
                              onCheckedChange={(checked) =>
                                handleCategoryChange(
                                  category.name,
                                  checked as boolean
                                )
                              }
                              className={`rounded-md border-2 border-current`}
                            />
                            <span
                              className={`font-medium text-sm`}
                              style={{ color: theme.textColor }}
                            >
                              {category.name}
                            </span>
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
                          onCheckedChange={(checked) =>
                            setShowInStockOnly(checked === true)
                          }
                          className="rounded-md border-2 border-current"
                        />
                        <span
                          className={`font-medium`}
                          style={{ color: theme.textColor }}
                        >
                          In Stock Only
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Sort */}
                  {enableSorting && (
                    <div className="space-y-4 mb-6">
                      <h3
                        className={`text-lg font-semibold`}
                        style={{ color: theme.textColor }}
                      >
                        Sort By
                      </h3>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full border-2 border-current rounded-xl">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="featured">Featured</SelectItem>
                          <SelectItem value="price-asc">
                            Price: Low to High
                          </SelectItem>
                          <SelectItem value="price-desc">
                            Price: High to Low
                          </SelectItem>
                          <SelectItem value="name-asc">Name: A to Z</SelectItem>
                          <SelectItem value="name-desc">
                            Name: Z to A
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Mobile Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      className={`flex-1 border-2 border-current rounded-xl font-semibold`}
                      style={{
                        color: theme.textColor,
                        borderColor: theme.textColor,
                      }}
                      onClick={clearAllFilters}
                    >
                      Clear All
                    </Button>
                    <Button
                      className={`flex-1 rounded-xl font-semibold`}
                      style={{
                        backgroundColor: theme.textColor,
                        color: theme.backgroundColor,
                      }}
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
                    style={{
                      color: theme.textColor,
                      borderColor: theme.textColor,
                    }}
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
                <h3
                  className={`text-2xl font-semibold mb-4`}
                  style={{ color: theme.textColor }}
                >
                  No products found
                </h3>
                <p className={`mb-6`} style={{ color: theme.textColor + "B3" }}>
                  Try adjusting your filters to find what you are looking for.
                </p>
                <Button
                  onClick={clearAllFilters}
                  className={`rounded-xl px-8 py-3 font-semibold`}
                  style={{
                    backgroundColor: theme.textColor,
                    color: theme.backgroundColor,
                  }}
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
                overlayColor={theme.secondaryColor + "80"}
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
                        : `border-current`
                    }
                    `}
                    style={
                      currentPage !== 1
                        ? {
                            color: theme.textColor,
                            borderColor: theme.textColor,
                          }
                        : {}
                    }
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
                        );
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handlePageChange(page as number)}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            page === currentPage ? `` : ``
                          }`}
                          style={
                            page === currentPage
                              ? {
                                  backgroundColor: theme.textColor,
                                  color: theme.backgroundColor,
                                }
                              : {
                                  color: theme.textColor,
                                  borderColor: theme.textColor,
                                  borderWidth: 1,
                                  borderStyle: "solid",
                                }
                          }
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md border transition-colors ${
                      currentPage === totalPages
                        ? "border-gray-300 text-gray-400 cursor-not-allowed"
                        : `border-current`
                    }
                    `}
                    style={
                      currentPage !== totalPages
                        ? {
                            color: theme.textColor,
                            borderColor: theme.textColor,
                          }
                        : {}
                    }
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
  );
}
