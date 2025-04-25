"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { ProductInfoSection } from "@/components/dashboard/products/add/productInfoSection";
import { PricingSection } from "@/components/dashboard/products/add/pricingSection";
import { LowStockSection } from "@/components/dashboard/products/add/lowStockSection";

export default function AddProductPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">

        <h1 className="text-2xl md:text-3xl font-bold mt-2">Add New Product</h1>
        <p className="text-gray-500 mt-2 mb-6">Create a new product for your store</p>

        <Card className="flex flex-col gap-4 bg-white">
            <CardContent className="py-2">
            <form className="space-y-6">
                {/* Product Info */}
                <ProductInfoSection/>
                
                {/* Pricing Section */}
                <PricingSection/>
                
                {/* Low Stock Settings Section */}
                <LowStockSection/>
                
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