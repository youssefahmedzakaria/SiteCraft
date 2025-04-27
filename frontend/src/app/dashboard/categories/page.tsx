// dropdown-menu.tsx
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar/sidebar";
import Image from "next/image";
import { categories } from "@/lib/categories";
import { categoryAnalytics } from "@/lib/generalAnalytics";
import { GeneralAnalyticsCard } from "@/components/dashboard/generalAnalyticsCard";
import { CategoryRecord } from "@/components/dashboard/categories/categoryRecord";
import { SearchBar } from "@/components/ui/searchBar";
import { CategoryTableHeader } from "@/components/dashboard/categories/categoryTableHeader";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
export default function CategoriesPage() {
  const [sortType, setSortType] = useState<
    | "newest"
    | "oldest"
    | "nameAsc"
    | "nameDesc"
    | "productsAsc"
    | "productsDesc"
  >("newest");

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

  // sort categories based on the selected type
  const sortedCategories = categories.sort((a, b) => {
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
        return a.title.localeCompare(b.title); // Sort by name A to Z
      case "nameDesc":
        return b.title.localeCompare(a.title); // Sort by name Z to A
      case "productsAsc":
        return a.numOfProducts - b.numOfProducts; // Sort by number of products ascending
      case "productsDesc":
        return b.numOfProducts - a.numOfProducts; // Sort by number of products descending
      default:
        return 0;
    }
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl md:text-3xl font-bold mt-2">Categories</h1>

        {/* Header section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 gap-4">
          <h2 className="text-lg md:text-xl font-semibold">
            Manage your product categories and organization
          </h2>
          <div className="flex flex-wrap gap-2 md:flex-col lg:flex-row md:items-center justify-end">
            <Link href="/dashboard/categories/add" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover">
                <Image
                  src="/icons/plus.svg"
                  alt="Add Icon"
                  width={20}
                  height={20}
                />
                <span className="ml-2">Add New Category</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="default"
              className="w-full sm:w-auto text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
            >
              <Image
                src="/icons/dropdown-colored.svg"
                alt="Dropdown Icon"
                width={20}
                height={20}
              />
              <span className="ml-2">Import or Export</span>
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          {categoryAnalytics.map((category) => (
            <GeneralAnalyticsCard key={category.id} analytic={category} />
          ))}
        </div>

        {/* Search and filters */}
        <div className="border-t border-logo-border mt-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4">
            {/* Search Bar */}
            <SearchBar placeholder="Search: e.g. Home & Kitchen"></SearchBar>
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

                  <Image
                    src="/icons/dropdown-colored.svg"
                    alt="Dropdown Icon"
                    width={20}
                    height={20}
                  />
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
                {/* Sample category rows */}
                {sortedCategories.map((category) => (
                  <CategoryRecord key={category.id} category={category} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
