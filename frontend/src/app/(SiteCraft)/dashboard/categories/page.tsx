"use client";
import Link from "next/link";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { saveAs } from 'file-saver';

import { Button } from "@/components/SiteCraft/ui/button";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import Image from "next/image";
import { useCategoryManagement } from "@/hooks/useCategoryManagement";
import { getCategoryAnalyticsFromStats } from "@/lib/generalAnalytics";
import { GeneralAnalyticsCard } from "@/components/SiteCraft/dashboard/analytics/generalAnalyticsCard";
import { CategoryRecord } from "@/components/SiteCraft/dashboard/categories/categoryRecord";
import { SearchBar } from "@/components/SiteCraft/ui/searchBar";
import { CategoryTableHeader } from "@/components/SiteCraft/dashboard/categories/categoryTableHeader";
import { ImportProgressModal } from "@/components/SiteCraft/dashboard/categories/ImportProgressModal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/SiteCraft/ui/dropdown-menu";
import { ChevronDown, Plus, RefreshCw, AlertCircle, Download, Upload, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useStoreStatus } from "@/hooks/useStoreStatus";
import { useRouter } from "next/navigation";
import { parseExcelFile, validateExcelData, generateExcelFile, createImportTemplate, CategoryExportData } from "@/lib/excelUtils";
import { toast } from "react-toastify";

export default function CategoriesPage() {
  const [sortType, setSortType] = useState<
    | "newest"
    | "oldest"
    | "nameAsc"
    | "nameDesc"
    | "productsAsc"
    | "productsDesc"
  >("newest");
  const [file, setFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    categories,
    statistics,
    isLoading,
    error,
    clearError,
    fetchCategories
  } = useCategoryManagement();

  const { isAuthenticated } = useAuth();
  const { isInactive } = useStoreStatus();
  const router = useRouter();

  // Handle client-side rendering to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debug file input ref
  useEffect(() => {
    console.log('File input ref on mount:', fileInputRef.current);
  }, []);

  const handleSortChange = (
    type:
      | "newest"
      | "oldest"
      | "nameAsc"
      | "nameDesc"
      | "productsAsc"
      | "productsDesc"
  ) => {
    setSortType(type);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      console.log('File selected:', selectedFile.name, selectedFile.size);
      setFile(selectedFile);
      
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
        const parsedData = await parseExcelFile(selectedFile);
        console.log('Parsed data:', parsedData);
        setImportProgress(30);
        
        const validation = validateExcelData(parsedData);
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
        
        const response = await fetch('/api/categories/import', {
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
          toast.success(`Successfully imported ${result.data.successCount} categories`);
          fetchCategories(); // Refresh the categories list
        }
        
        if (result.data.errorCount > 0) {
          toast.warning(`${result.data.errorCount} categories failed to import`);
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

  const handleExportCategories = async () => {
    try {
      const response = await fetch('/api/categories/export', {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to export categories');
      }
      const blob = await response.blob();
      saveAs(blob, 'categories_export.xlsx');
      toast.success('Categories exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed');
    }
  };

  const handleDownloadTemplate = () => {
    createImportTemplate();
    toast.success('Import template downloaded');
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const categoryName = category.title.toLowerCase();
      return categoryName.includes(searchLower);
    }
    return true;
  });

  const sortedCategories = filteredCategories.sort((a, b) => {
    // Only sort on client-side to avoid hydration mismatch
    if (!isClient) {
      return 0;
    }
    
    switch (sortType) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "nameAsc":
        return a.title.localeCompare(b.title);
      case "nameDesc":
        return b.title.localeCompare(a.title);
      case "productsAsc":
        return a.numOfProducts - b.numOfProducts;
      case "productsDesc":
        return b.numOfProducts - a.numOfProducts;
      default:
        return 0;
    }
  });

  const handleRefreshAll = () => {
    fetchCategories();
    // If you have a separate fetchStatistics, call it here as well.
    // fetchStatistics();
  };

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

  if (isLoading || !isClient) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600">Loading categories...</span>
            </div>
                  </div>
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

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to view and manage categories.</p>
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
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100 min-h-screen">
        {/* Header section */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Categories</h1>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-600">
              Manage your product categories and organization
            </h2>
            <div className="flex flex-wrap gap-2 md:flex-col lg:flex-row md:items-center justify-end">
              <Link
                href="/dashboard/categories/add"
                className="w-full sm:w-auto"
              >
                <Button className="w-full justify-center items-center sm:w-auto bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover">
                  <Plus size={16} />
                  <span className="ml-2">Add New Category</span>
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
                    Import Categories From Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportCategories}>
                    <Download className="h-4 w-4 mr-2" />
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

        {/* Stats cards */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-end items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              disabled={isLoading}
              className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {statistics ? getCategoryAnalyticsFromStats(statistics).map((category) => (
              <GeneralAnalyticsCard key={category.id} analytic={category} />
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
            <SearchBar placeholder="Search: e.g. Home & Kitchen" onChange={handleSearchChange} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
                >
                  <span className="ml-2">
                    Sort By:{" "}
                    {sortType === "newest"
                      ? "Newest"
                      : sortType === "oldest"
                      ? "Oldest"
                      : sortType === "nameAsc"
                      ? "Name (A to Z)"
                      : sortType === "nameDesc"
                      ? "Name (Z to A)"
                      : sortType === "productsAsc"
                      ? "Products (Asc)"
                      : "Products (Desc)"}
                  </span>

                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleSortChange("newest")}>
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange("oldest")}>
                  Oldest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange("nameAsc")}>
                  Name (A to Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange("nameDesc")}>
                  Name (Z to A)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("productsAsc")}
                >
                  Products (Asc)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("productsDesc")}
                >
                  Products (Desc)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Category listing table (responsive) */}
          <div className="mt-6 border rounded-lg border-logo-border overflow-y-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-logo-border">
              <CategoryTableHeader />
              <tbody className="bg-white divide-y divide-logo-border">
                {sortedCategories.length > 0 ? (
                  sortedCategories.map((category) => (
                    <CategoryRecord 
                      key={category.id} 
                      category={category} 
                      onDelete={(categoryId) => {
                        // The category will be automatically removed from the list
                        // by the useCategoryManagement hook
                        console.log('Category deleted:', categoryId);
                      }}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-muted-foreground"
                    >
                      {categories.length === 0
                        ? "No categories found. Try adding your first category."
                        : "No categories match your search."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
