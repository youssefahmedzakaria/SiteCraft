"use client";
import Link from "next/link";
import { Button } from "@/components/SiteCraft/ui/button";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import Image from "next/image";
import { shippingTableHeader as ShippingTableHeader } from "@/components/SiteCraft/dashboard/shipping/shippingTableHeader";
import { ShippingRecord } from "@/components/SiteCraft/dashboard/shipping/shippingRecord";
import { useShippingInfo } from "@/hooks/useShippingInfo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/SiteCraft/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { ChevronDown, Plus, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/SiteCraft/ui/alert";

export default function ShippingPage() {
  const [file, setFile] = useState<File | null>(null);
  const { 
    shippingInfo, 
    loading, 
    error, 
    refreshShippingInfo,
    forceUpdate,
    removeShippingInfo
  } = useShippingInfo();

  console.log('🚚 Shipping Page - Current state:', {
    shippingCount: shippingInfo.length,
    loading,
    error,
    forceUpdate
  });

  // Force re-render when forceUpdate changes
  useEffect(() => {
    console.log('🔄 Shipping Page re-rendering due to forceUpdate:', forceUpdate);
  }, [forceUpdate]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("File selected:", selectedFile.name);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-logo-dark-button" />
              <p className="text-gray-600">Loading shipping information...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading shipping information: {error}
            </AlertDescription>
          </Alert>
          <div className="text-center">
            <Button onClick={refreshShippingInfo} variant="outline" className="mb-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Shipping</h1>
              <h2 className="text-lg md:text-xl font-semibold text-gray-600">
                Manage shipping rates and delivery locations
              </h2>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <h3 className="text-lg font-semibold">
              Shipping Locations: {shippingInfo.length}
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:justify-end">
              <Link href="/dashboard/shipping/add" className="w-full sm:w-auto">
                <Button className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover w-full">
                  <Plus size={16} />
                  <span className="ml-2">Add New Location</span>
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
                  >
                    <span className="ml-2">
                      Import or Export Shipping Locations
                    </span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <label htmlFor="import-file">
                      Import Shipping Locations from Excell Sheet
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
                    Export All Shipping Locations
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Shipping Table */}
        <div>
          {shippingInfo.length === 0 ? (
            <div className="border rounded-lg border-logo-border p-8 text-center">
              <p className="text-gray-500 mb-2">No shipping locations found</p>
              <p className="text-xs text-gray-400">Add your first location to get started.</p>
            </div>
          ) : (
            <div className="border rounded-lg border-logo-border overflow-y-auto overflow-x-auto">
              <table className="min-w-full divide-y divide-logo-border">
                <ShippingTableHeader />
                <tbody className="bg-white divide-y divide-logo-border">
                  {shippingInfo.map((shipping) => (
                    <ShippingRecord key={shipping.id} shipping={shipping} onDelete={removeShippingInfo} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Additional information or settings could go here */}
        <div className="mt-10 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
          <p className="text-gray-600 mb-4">
            Configure shipping rates for different governorates. Set competitive
            pricing and accurate delivery timeframes to enhance customer
            experience.
          </p>
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <svg
                  className="h-5 w-5 text-logo-dark-button"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Delivery Times</p>
                <p className="text-sm text-gray-500">
                  Estimated delivery times are displayed to customers during
                  checkout.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <svg
                  className="h-5 w-5 text-logo-dark-button"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Shipping Costs</p>
                <p className="text-sm text-gray-500">
                  All shipping prices are automatically added to order totals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
