"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ProductInfoSection } from "@/components/dashboard/products/add/productInfoSection";
import { PricingSection } from "@/components/dashboard/products/add/pricingSection";
import { LowStockSection } from "@/components/dashboard/products/add/lowStockSection";
import { StockManagementSection } from "@/components/dashboard/products/add/stockManagement";
import { CustomVariationSection } from "@/components/dashboard/products/add/customVariationSection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AddProductPage() {
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

  // Initialize with default variations
  const [customVariations, setCustomVariations] = useState<
    { name: string; values: string[] }[]
  >([]);

  // Add state for stock modal
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedVariationIndex, setSelectedVariationIndex] =
    useState<number>(0);
  const [stockValues, setStockValues] = useState<
    { value: string; stock: number }[]
  >([]);

  // Add drag states for variations
  const [draggedVariationIndex, setDraggedVariationIndex] = useState<
    number | null
  >(null);
  const [dragOverVariationIndex, setDragOverVariationIndex] = useState<
    number | null
  >(null);

  // Function to add a new variation type
  const handleAddVariation = (e: React.MouseEvent) => {
    e.preventDefault();
    setCustomVariations([
      ...customVariations,
      { name: "New Variation", values: [""] },
    ]);
  };

  // Function to delete a variation type
  const handleDeleteVariation = (index: number) => {
    const newVariations = [...customVariations];
    newVariations.splice(index, 1);
    setCustomVariations(newVariations);
  };

  // Function to update variation name
  const handleVariationNameChange = (index: number, name: string) => {
    const newVariations = [...customVariations];
    newVariations[index].name = name;
    setCustomVariations(newVariations);
  };

  // Modified handleAddDefaults
  const handleAddDefaults = (index: number) => {
    // Always use first variation for stock management
    const firstVariation = customVariations[0];
    if (!firstVariation || firstVariation.values.length === 0) {
      alert("Please add values to the first variation first");
      return;
    }

    setStockValues(firstVariation.values.map((value) => ({ value, stock: 0 })));
    setShowStockModal(true);
  };

  // Handle stock changes
  const handleStockChange = (index: number, value: string) => {
    const newStock = [...stockValues];
    newStock[index].stock = Number(value);
    setStockValues(newStock);
  };

  // Save stock values
  const handleSaveStock = () => {
    // Here you would typically update your stock management state
    console.log("Stock values:", stockValues);
    setShowStockModal(false);
  };

  // Update variation values handler
  const handleValuesChange = (index: number, newValues: string[]) => {
    const newVariations = [...customVariations];
    newVariations[index].values = newValues;
    setCustomVariations(newVariations);
  };

  // Add these handlers
  const handleVariationDragStart = (index: number) => {
    setDraggedVariationIndex(index);
  };

  const handleVariationDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverVariationIndex(index);
  };

  const handleVariationDragEnd = () => {
    if (
      draggedVariationIndex !== null &&
      dragOverVariationIndex !== null &&
      draggedVariationIndex !== dragOverVariationIndex
    ) {
      const newVariations = [...customVariations];
      const [movedVariation] = newVariations.splice(draggedVariationIndex, 1);
      newVariations.splice(dragOverVariationIndex, 0, movedVariation);
      setCustomVariations(newVariations);
    }

    setDraggedVariationIndex(null);
    setDragOverVariationIndex(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        {/* Header section with title and subtitle */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Add New Product</h1>
          <h2 className="text-lg md:text-xl text-gray-600">
            Create a new product for your store
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
                      Add product options that your customers can choose from on
                      the product page.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {customVariations.map((variation, index) => (
                      <div
                        key={index}
                        className={`mb-4 p-4 rounded-lg border transition-all ${
                          dragOverVariationIndex === index
                            ? "border-blue-300 bg-blue-50"
                            : "border-transparent hover:border-gray-200"
                        } ${
                          draggedVariationIndex === index ? "shadow-lg" : ""
                        }`}
                        //   onDragStart={() => handleSizeDragStart(index)} <---------------
                        //   onDragOver={(e) => e.preventDefault()} <------------
                        //   onDragEnter={() => handleSizeDragEnter(index)}  <------------
                        //   onDragEnd={handleSizeDragEnd}
                        draggable
                        onDragStart={() => handleVariationDragStart(index)}
                        onDragOver={(e) => {
                          e.preventDefault();
                          handleVariationDragOver(e, index);
                        }}
                        onDragEnd={handleVariationDragEnd}
                      >
                        <CustomVariationSection
                          name={variation.name}
                          index={index}
                          values={variation.values}
                          onDelete={() => handleDeleteVariation(index)}
                          onChange={(name) =>
                            handleVariationNameChange(index, name)
                          }
                          onValuesChange={(values) =>
                            handleValuesChange(index, values)
                          }
                          onAddDefaults={() => handleAddDefaults(index)}
                          showDefaults={index === 0}
                          isDragging={draggedVariationIndex === index}
                        />
                      </div>
                    ))}

                    <button
                      onClick={handleAddVariation}
                      className="flex items-center gap-1 text-logo-dark-button hover:underline text-md"
                    >
                      + Add Variation Type
                    </button>
                  </div>
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

        {/* Stock Modal */}
        <Dialog open={showStockModal} onOpenChange={setShowStockModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Stock Levels</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {stockValues.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Label className="w-24">{item.value}</Label>
                  <Input
                    type="number"
                    value={item.stock}
                    onChange={(e) => handleStockChange(index, e.target.value)}
                    min="0"
                  />
                </div>
              ))}
              <Button onClick={handleSaveStock}>Save Stock Values</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
