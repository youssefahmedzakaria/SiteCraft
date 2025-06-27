"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/SiteCraft/ui/button";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import { Card, CardContent, CardTitle } from "@/components/SiteCraft/ui/card";
import { ProductInfoSection } from "@/components/SiteCraft/dashboard/products/add/productInfoSection";
import { PricingSection } from "@/components/SiteCraft/dashboard/products/add/pricingSection";
import { LowStockSection } from "@/components/SiteCraft/dashboard/products/add/lowStockSection";
import { StockManagementSection } from "@/components/SiteCraft/dashboard/products/add/stockManagement";
import { CustomVariationSection } from "@/components/SiteCraft/dashboard/products/add/customVariationSection";
import { useProductManagement } from "@/hooks/useProductManagement";
import { ProductCreateDTO } from "@/lib/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/SiteCraft/ui/dialog";
import { Label } from "@/components/SiteCraft/ui/label";
import { Input } from "@/components/SiteCraft/ui/input";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const { handleCreateProduct, isCreating, error, clearError } = useProductManagement();
  
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

  // Form state
  const [formData, setFormData] = useState<ProductCreateDTO>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 0,
    discountType: undefined,
    discountValue: undefined,
    minCap: undefined,
    percentageMax: undefined,
    maxCap: undefined,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

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

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.name || !formData.description || formData.price <= 0 || formData.categoryId === 0) {
        alert('Please fill in all required fields');
        return;
      }

      // Create product
      const newProduct = await handleCreateProduct(formData, imageFiles);
      
      // Show success dialog
      setShowSuccessDialog(true);
      
      // Redirect to products page after a short delay
      setTimeout(() => {
        router.push('/dashboard/products');
      }, 2000);
      
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  // Update form data handler
  const updateFormData = (updates: Partial<ProductCreateDTO>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Update image files handler
  const updateImageFiles = (files: File[]) => {
    setImageFiles(files);
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === "Product's Overview" && (
                <>
                  {/* Product Info */}
                  <ProductInfoSection 
                    formData={formData}
                    updateFormData={updateFormData}
                    imageFiles={imageFiles}
                    updateImageFiles={updateImageFiles}
                  />

                  {/* Pricing Section */}
                  <PricingSection 
                    formData={formData}
                    updateFormData={updateFormData}
                  />

                  {/* Low Stock Settings Section */}
                  <LowStockSection 
                    formData={formData}
                    updateFormData={updateFormData}
                  />
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
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                        draggable
                        onDragStart={() => handleVariationDragStart(index)}
                        onDragOver={(e) => handleVariationDragOver(e, index)}
                        onDragEnd={handleVariationDragEnd}
                      >
                        <CustomVariationSection
                          name={variation.name}
                          index={index}
                          values={variation.values}
                          onDelete={() => handleDeleteVariation(index)}
                          onChange={(name) => handleVariationNameChange(index, name)}
                          onValuesChange={(values) => handleValuesChange(index, values)}
                          onAddDefaults={() => handleAddDefaults(index)}
                          showDefaults={index === 0}
                          isDragging={draggedVariationIndex === index}
                        />
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddVariation}
                      className="w-full"
                    >
                      + Add Variation
                    </Button>
                  </div>
                </>
              )}

              {activeTab === "Stock Management" && (
                <StockManagementSection />
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Link href="/dashboard/products">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={isCreating}
                  className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
                >
                  {isCreating ? 'Creating Product...' : 'Create Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Stock Modal */}
        <Dialog open={showStockModal} onOpenChange={setShowStockModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Stock for Variations</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {stockValues.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Label className="flex-1">{item.value}</Label>
                  <Input
                    type="number"
                    value={item.stock}
                    onChange={(e) => handleStockChange(index, e.target.value)}
                    className="w-24"
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowStockModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveStock}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Product Created Successfully!</span>
              </DialogTitle>
            </DialogHeader>
            <div className="text-center py-4">
              <p className="text-gray-600">
                Your product has been created and is now available in your store.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Redirecting to products page...
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
