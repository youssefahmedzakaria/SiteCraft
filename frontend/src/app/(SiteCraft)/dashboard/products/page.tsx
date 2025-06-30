"use client";
import type React from "react";
import Link from "next/link";
import { Button } from "@/components/SiteCraft/ui/button";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import Image from "next/image";
import { useProductManagement } from "@/hooks/useProductManagement";
import { useProductStatistics } from "@/hooks/useProductStatistics";
import { getProductAnalyticsFromStats } from "@/lib/generalAnalytics";
import { GeneralAnalyticsCard } from "@/components/SiteCraft/dashboard/analytics/generalAnalyticsCard";
import { ProductRecord } from "@/components/SiteCraft/dashboard/products/productRecord";
import { SearchBar } from "@/components/SiteCraft/ui/searchBar";
import { ProductTableHeader } from "@/components/SiteCraft/dashboard/products/productTableHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/SiteCraft/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { getCategories } from "@/lib/products";
import { ApplyDiscountDialog } from "@/components/SiteCraft/dashboard/products/dicountDialog";
import { ChevronDown, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { SimplifiedProduct } from "@/lib/products";
import { useAuth } from "@/hooks/useAuth";

export default function ProductPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("All Categories");
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

  const {
    products,
    isLoading,
    error,
    clearError,
    fetchProducts
  } = useProductManagement();

  const {
    stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useProductStatistics();

  const { isAuthenticated, user } = useAuth();

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategorySelect = (title: string) => {
    setCategoryFilter(title);
  };

  const handleStockSelect = (title: string) => {
    setStockFilter(title);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const filteredProducts = products.filter((product: SimplifiedProduct) => {
    // Filter by category
    if (categoryFilter !== "All Categories") {
      if (!product.categoryId) return false;
      const category = categories.find(c => c.id === product.categoryId);
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
      
      if (!productName.includes(searchLower) && !productDescription.includes(searchLower)) {
        return false;
      }
    }

    return true;
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("File selected:", selectedFile.name);
    }
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectAll((prevSelectAll) => !prevSelectAll);
    if (!selectAll) {
      setSelectedProducts(filteredProducts.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectByCategory = (category: string) => {
    const categoryProducts = filteredProducts.filter(
      (product: SimplifiedProduct) => {
        if (!product.categoryId) return false;
        const categoryObj = categories.find(c => c.id === product.categoryId);
        return categoryObj && categoryObj.name === category;
      }
    );
    const newSelection = [...selectedProducts];

    // Toggle category selection
    const allInCategorySelected = categoryProducts.every((p) =>
      selectedProducts.includes(p.id)
    );

    if (allInCategorySelected) {
      // Remove all products from this category
      newSelection.splice(
        0,
        newSelection.length,
        ...newSelection.filter(
          (id) => !categoryProducts.some((p) => p.id === id)
        )
      );
    } else {
      // Add all products from this category
      categoryProducts.forEach((p) => {
        if (!newSelection.includes(p.id)) {
          newSelection.push(p.id);
        }
      });
    }

    setSelectedProducts(newSelection);
  };

  const allSelected = selectedProducts.length === products.length && products.length > 0;
  const toggleSelectAll = () => {
    setSelectedProducts(allSelected ? [] : products.map(p => p.id));
  };
  const toggleSelect = (id: number) => {
    setSelectedProducts(sel =>
      sel.includes(id) ? sel.filter(pid => pid !== id) : [...sel, id]
    );
  };

  const handleApplyDiscount = async (discountType: string, discountValue: number) => {
    await fetch("http://localhost:8080/products/apply-discount", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productIds: selectedProducts,
        discountType: discountType.toLowerCase(),
        discountValue: parseFloat(discountValue as any), 
      }),
      credentials: 'include',
    });
    setShowDiscountDialog(false);
    // Optionally: refresh products list
  };

  const handleRefreshAll = () => {
    refetchStats();
    fetchProducts();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600">Loading products...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
              <p className="text-gray-600">Please log in to view product statistics and manage products.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        {/* Header section */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Products</h1>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-600">
              Manage your product inventory and details
            </h2>
            <div className="flex flex-wrap gap-2 md:flex-col lg:flex-row md:items-center justify-end">
              <Link href="/dashboard/products/add" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover">
                  <Plus size={16} />
                  <span className="ml-2">Add New Product</span>
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
                  >
                    <span className="ml-2">Import or Export Categories</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <label htmlFor="import-file">
                      Import Categories From Excel Sheet
                    </label>
                    <input
                      id="import-file"
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log(file)}>
                    Export All Categories
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        {/* Statistics Error Alert */}
        {statsError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{statsError}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshAll}
                className="text-red-600 hover:text-red-800"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Stats cards */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-end items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              disabled={statsLoading}
              className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {stats ? getProductAnalyticsFromStats(stats).map((product) => (
              <GeneralAnalyticsCard key={product.id} analytic={product} />
            )) : (
              // Show loading state for stats
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg border border-logo-border p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Search and filters */}
        <div className="border-t border-logo-border mt-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4">
            {/* Search Bar */}
            <SearchBar 
              placeholder="Search products by name or description" 
              value={searchQuery}
              onChange={handleSearchChange}
            />

            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
                >
                  <span className="ml-2">
                    {categoryFilter}
                  </span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleCategorySelect("All Categories")}>
                  All Categories
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => handleCategorySelect(category.name)}
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Stock Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
                >
                  <span className="ml-2">
                    {stockFilter}
                  </span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {stockStatuses.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => handleStockSelect(status)}
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Left-aligned selection controls */}
        <div className="flex justify-start items-center gap-4 my-4">
          <span>{selectedProducts.length} Selected</span>
          {selectedProducts.length > 0 && (
            <Button
              onClick={() => setShowDiscountDialog(true)}
              className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
              size="lg"
            >
              Apply Discount
            </Button>
          )}
        </div>

        {/* Discount Dialog */}
        {showDiscountDialog && (
          <ApplyDiscountDialog
            open={showDiscountDialog}
            onOpenChange={setShowDiscountDialog}
            products={selectedProducts}
            onApply={handleApplyDiscount}
          />
        )}

        {/* Product listing table */}
        <div className="border rounded-lg border-logo-border overflow-hidden mt-6">
          <table className="min-w-full divide-y divide-logo-border">
            <ProductTableHeader
              selectAll={selectAll}
              onSelectAll={handleSelectAll}
              selectedProducts={selectedProducts}
              categories={categories}
              filteredProducts={filteredProducts}
              setSelectedProducts={setSelectedProducts}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
            <tbody className="bg-white divide-y divide-logo-border">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product: SimplifiedProduct) => (
                  <ProductRecord 
                    key={product.id} 
                    product={product}
                    categories={categories}
                    isSelected={selectedProducts.includes(product.id)}
                    onSelect={() => handleSelectProduct(product.id)}
                    fetchProducts={fetchProducts}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-muted-foreground"
                  >
                    {products.length === 0
                      ? "No products found. Try adding your first product."
                      : "No products match your filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
