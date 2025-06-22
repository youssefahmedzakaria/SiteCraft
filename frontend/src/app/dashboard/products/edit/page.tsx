"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ProductInfoSection } from "@/components/dashboard/products/add/productInfoSection";
import { PricingSection } from "@/components/dashboard/products/add/pricingSection";
import { LowStockSection } from "@/components/dashboard/products/add/lowStockSection";
import { SizeVariationSection } from "@/components/dashboard/products/add/sizeVariationSection";
import { ColorVariationSection } from "@/components/dashboard/products/add/colorVariationSection";
import { StockManagementSection } from "@/components/dashboard/products/add/stockManagement";

export default function EditProductPage() {
  const [activeTab, setActiveTab] = useState<
    | "Product's Overview"
    | "Product's Options and Variations"
    | "Stock Management"
  >("Product's Overview");
  const tabs = [
    "Product's Overview",
    "Product's Options and Variations",
    "Stock Management",
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        {/* Header section with title and subtitle */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Edit Product</h1>
          <h2 className="text-lg md:text-xl text-gray-600">
            Edit the details of a product
          </h2>
        </div>

        <div className="flex mb-1 ml-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-4 py-2 border-b-2 transition-all duration-200 ${
                activeTab === tab
                  ? "border-logo-txt text-logo-txt font-medium"
                  : "border-transparent text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <Card className="flex flex-col gap-4 bg-white">
          <CardContent className="py-2">
            <form className="space-y-6">
              {activeTab === "Product's Overview" && (
                <>
                  {/* Product Info */}
                  <ProductInfoSection />

                  {/* Pricing Section */}
                  <PricingSection />

                  {/* Low Stock Settings Section */}
                  <LowStockSection />
                </>
              )}

              {activeTab === "Product's Options and Variations" && (
                <>
                  <div className="mb-2">
                    <CardTitle className="font-bold text-2xl">
                      Options and Variations
                    </CardTitle>
                    <p className="text-gray-500">
                      Edit product options that your customers can choose from
                      on the product page.
                    </p>
                  </div>

                  <SizeVariationSection />

                  <ColorVariationSection />
                </>
              )}

              {activeTab === "Stock Management" && (
                <>
                  <div className="mb-2">
                    <CardTitle className="font-bold text-2xl">
                      Handle Stock Levels
                    </CardTitle>
                    <p className="text-gray-500">
                      Management of stock levels of different options and
                      variation.
                    </p>
                  </div>

                  <StockManagementSection />
                </>
              )}

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
                >
                  Save Product
                </Button>
                <Link href="/dashboard/products">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
