"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar/sidebar";
import Image from "next/image";
import { shippingTableHeader as ShippingTableHeader } from "@/components/dashboard/shipping/shippingTableHeader";
import { ShippingRecord } from "@/components/dashboard/shipping/shippingRecord";
import { shippings } from "@/lib/shipping";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

export default function ShippingPage() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("File selected:", selectedFile.name);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        {/* Header section */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Shipping</h1>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-600">
              Manage shipping rates and delivery locations
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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

        <div className="border rounded-lg border-logo-border overflow-y-auto overflow-x-auto">
          <table className="min-w-full divide-y divide-logo-border">
            <ShippingTableHeader />
            <tbody className="bg-white divide-y divide-logo-border">
              {shippings.map((shipping) => (
                <ShippingRecord key={shipping.id} shipping={shipping} />
              ))}
            </tbody>
          </table>
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
