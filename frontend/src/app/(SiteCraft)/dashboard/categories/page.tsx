"use client";
import Link from "next/link";
import type React from "react";
import { useState, useEffect } from "react";

import { Button } from "@/components/SiteCraft/ui/button";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import Image from "next/image";
import { useCategoryManagement } from "@/hooks/useCategoryManagement";
import { getCategoryAnalyticsFromStats } from "@/lib/generalAnalytics";
import { GeneralAnalyticsCard } from "@/components/SiteCraft/dashboard/analytics/generalAnalyticsCard";
import { CategoryRecord } from "@/components/SiteCraft/dashboard/categories/categoryRecord";
import { SearchBar } from "@/components/SiteCraft/ui/searchBar";
import { CategoryTableHeader } from "@/components/SiteCraft/dashboard/categories/categoryTableHeader";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/SiteCraft/ui/dropdown-menu";
import { ChevronDown, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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

  const {
    categories,
    statistics,
    isLoading,
    error,
    clearError,
    fetchCategories
  } = useCategoryManagement();

  const { isAuthenticated } = useAuth();

  // Handle client-side rendering to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("File selected:", selectedFile.name);
    }
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
              <p className="text-gray-600">Please log in to view and manage categories.</p>
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
