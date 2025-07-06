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
import { useState, useEffect, useRef } from "react";
import { saveAs } from 'file-saver';
import { getCategories } from "@/lib/products";
import { ApplyDiscountDialog } from "@/components/SiteCraft/dashboard/products/dicountDialog";
import { ImportProgressModal } from "@/components/SiteCraft/dashboard/categories/ImportProgressModal";
import { ChevronDown, Plus, RefreshCw, AlertCircle, Download, Upload, FileText } from "lucide-react";
import { SimplifiedProduct } from "@/lib/products";
import { useAuth } from "@/hooks/useAuth";
import { useStoreStatus } from "@/hooks/useStoreStatus";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/SiteCraft/ui/dialog";
import { Label } from "@/components/SiteCraft/ui/label";
import { Input } from "@/components/SiteCraft/ui/input";
import { parseProductExcelFile, validateProductExcelData, createProductImportTemplate } from "@/lib/productExcelUtils";
import { toast } from "react-toastify";

export default function ProductPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("All Categories");
  const [stockFilter, setStockFilter] = useState<string>("All Stock");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const stockStatuses = ["All Stock", "In Stock", "Out of Stock"];
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectionDropdownOpen, setSelectionDropdownOpen] = useState(false);
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockValues, setStockValues] = useState([{ value: "Stock", stock: 0 }]);
  const [selectedProductForStock, setSelectedProductForStock] = useState<SimplifiedProduct | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const { isInactive } = useStoreStatus();
  const router = useRouter();

  // Show inactive store message if store is inactive
  if (isInactive) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Store Inactive</h2>
              <p className="text-gray-600 mb-4">Your store is inactive. Please subscribe to activate your store.</p>
              <Button 
                onClick={() => router.push('/pricing')}
                className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
              >
                Subscribe Now
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
      if (!product.categories || product.categories.length === 0) return false;
      const hasMatchingCategory = product.categories.some(cat => cat.name === categoryFilter);
      if (!hasMatchingCategory) {
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      console.log('File selected:', selectedFile.name, selectedFile.size);
      
      // Validate file type
      const validTypes = ['.xlsx', '.xls', '.csv'];
      const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
      
      if (!validTypes.includes(fileExtension)) {
        toast.error('Please select a valid Excel file (.xlsx, .xls) or CSV file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      try {
        console.log('Starting import process...');
        setIsImporting(true);
        setIsImportModalOpen(true);
        console.log('Modal should be open now');
        setImportProgress(10);
        
        // Parse and validate Excel file
        console.log('Parsing Excel file...');
        const parsedData = await parseProductExcelFile(selectedFile);
        console.log('Parsed data:', parsedData);
        setImportProgress(30);
        
        const validation = validateProductExcelData(parsedData);
        console.log('Validation result:', validation);
        setImportProgress(50);
        
        if (!validation.isValid) {
          console.log('Validation failed:', validation.errors);
          setImportResult({
            successCount: 0,
            errorCount: validation.errors.length,
            errors: validation.errors,
            totalProcessed: validation.errors.length
          });
          setIsImporting(false);
          setImportProgress(100);
          return;
        }
        
        // Upload to backend
        console.log('Uploading to backend...');
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const response = await fetch('/api/products/import', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });
        
        console.log('Backend response status:', response.status);
        setImportProgress(80);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Backend error:', errorData);
          throw new Error(errorData.message || 'Import failed');
        }
        
        const result = await response.json();
        console.log('Backend result:', result);
        setImportResult(result.data);
        setImportProgress(100);
        
        if (result.data.successCount > 0) {
          toast.success(`Successfully imported ${result.data.successCount} products`);
          fetchProducts(); // Refresh the products list
        }
        
        if (result.data.errorCount > 0) {
          toast.warning(`${result.data.errorCount} products failed to import`);
        }
        
      } catch (error) {
        console.error('Import error:', error);
        setImportResult({
          successCount: 0,
          errorCount: 1,
          errors: [error instanceof Error ? error.message : 'Import failed'],
          totalProcessed: 0
        });
        toast.error('Import failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
        setIsImporting(false);
        setImportProgress(100);
      }
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
        if (!product.categories || product.categories.length === 0) return false;
        return product.categories.some(cat => cat.name === category);
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

  const handleSetStock = (product: SimplifiedProduct) => {
    setSelectedProductForStock(product);
    // For now, just show a simple stock input
    setStockValues([{ value: "Total Stock", stock: product.stock }]);
    setShowStockModal(true);
  };

  const handleSaveStock = () => {
    if (selectedProductForStock && stockValues.length > 0) {
      const newStock = stockValues[0].stock;
      console.log(`Setting stock for product ${selectedProductForStock.id} to ${newStock}`);
      // Here you would typically make an API call to update the product stock
      // For now, we'll just close the modal
      setShowStockModal(false);
      setSelectedProductForStock(null);
      // Optionally refresh the products list
      fetchProducts();
    }
  const handleExportProducts = async () => {
    try {
      const response = await fetch('/api/products/export', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to export products');
      }
      const blob = await response.blob();
      saveAs(blob, 'products_export.xlsx');
      toast.success('Products exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed');
    }
  };

  const handleDownloadTemplate = () => {
    createProductImportTemplate();
    toast.success('Import template downloaded');
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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to view product statistics and manage products.</p>
            <Button 
              onClick={() => router.push('/login')}
              className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Hidden file input for import - moved to top level */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

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
                    <span className="ml-2">Import or Export Products</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleDownloadTemplate}>
                    <FileText className="h-4 w-4 mr-2" />
                    Download Import Template
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    console.log('Import menu item clicked');
                    console.log('File input ref:', fileInputRef.current);
                    // Trigger file input click using ref
                    if (fileInputRef.current) {
                      console.log('File input found, clicking...');
                      fileInputRef.current.click();
                    } else {
                      console.log('File input not found');
                    }
                  }}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Products From Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportProducts}>
                    <Download className="h-4 w-4 mr-2" />
                    Export All Products
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

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <ProductTableHeader
                onSelectAll={handleSelectAll}
                selectAll={selectAll}
                categories={categories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                filteredProducts={filteredProducts}
              />
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <ProductRecord
                    key={product.id}
                    product={product}
                    categories={categories}
                    isSelected={selectedProducts.includes(product.id)}
                    onSelect={() => handleSelectProduct(product.id)}
                    fetchProducts={fetchProducts}
                    onSetStock={() => handleSetStock(product)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Modal */}
        <Dialog open={showStockModal} onOpenChange={setShowStockModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Stock for Variations</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {stockValues.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4">
                  <Label className="flex-1">{item.value}</Label>
                  <Input
                    type="number"
                    value={item.stock}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newStock = [...stockValues];
                      newStock[idx].stock = Number(e.target.value);
                      setStockValues(newStock);
                    }}
                    className="w-24"
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowStockModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveStock}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      {/* Import Progress Modal */}
      <ImportProgressModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        isImporting={isImporting}
        progress={importProgress}
        result={importResult}
      />
    </div>
  );
}
