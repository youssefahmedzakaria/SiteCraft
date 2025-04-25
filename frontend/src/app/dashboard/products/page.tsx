import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar/sidebar";
import Image from "next/image";
import { products } from "@/lib/products";
import { productAnalytics } from "@/lib/generalAnalytics";
import { GeneralAnalyticsCard } from "@/components/dashboard/generalAnalyticsCard";
import { ProductRecord } from "@/components/dashboard/products/productRecord";
import { SearchBar } from "@/components/ui/searchBar";
import { ProductTableHeader } from "@/components/dashboard/products/productTableHeader";

export default function ProductPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        <h1 className="text-2xl md:text-3xl font-bold mt-2">Products</h1>
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 gap-4">
          <h2 className="text-lg md:text-xl font-semibold">
          Manage your product inventory and details
          </h2>
          <div className="flex flex-wrap gap-2 md:flex-col lg:flex-row md:items-center justify-end">
            <Link href="/dashboard/products/add" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover">
                <Image
                  src="/icons/plus.svg"
                  alt="Add Icon"
                  width={20}
                  height={20}
                />
                <span className="ml-2">Add New Product</span>
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
          {productAnalytics.map((product) => (
                    <GeneralAnalyticsCard key={product.id} analytic={product}/>
                  ))}
        </div>

        {/* Search and filters */}
        <div className="border-t border-logo-border mt-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4">
            {/* Search Bar */}
            <SearchBar placeholder="Search: e.g. Watch"></SearchBar>
            <Button
              variant="outline"
              size="lg" 
              className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
            >
              <Image 
              src="/icons/dropdown-colored.svg" 
              alt="Dropdown Icon" 
              width={20} 
              height={20} 
              />
              All Categories
            </Button>
            <Button 
              variant="outline"
              size="lg" 
              className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
            >
              <Image 
              src="/icons/dropdown-colored.svg" 
              alt="Dropdown Icon" 
              width={20} 
              height={20} 
              />
              In Stock
            </Button>
          </div>
          
          {/* Product listing table (responsive) */}
          <div className="mt-6 border rounded-lg border-logo-border overflow-y-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-logo-border">
              <ProductTableHeader/>
              <tbody className="bg-white divide-y divide-logo-border">
                {/* Sample product rows */}
                {products.map((product) => (
                  <ProductRecord key={product.id} product={product} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}