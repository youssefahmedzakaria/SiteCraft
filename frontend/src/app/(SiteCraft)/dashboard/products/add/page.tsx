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
import { ProductCreateDTO, ProductAttributeDTO, ProductVariantDTO, VariantAttributeDTO, getCategories } from "@/lib/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/SiteCraft/ui/dialog";
import { Label } from "@/components/SiteCraft/ui/label";
import { Input } from "@/components/SiteCraft/ui/input";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AddProductPage() {
  const router = useRouter();
  const { handleCreateProduct, isCreating, error, clearError } = useProductManagement();
  const { isAuthenticated } = useAuth();
  
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

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to add new products.</p>
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

  // Form state for basic product info
  const [basicFormData, setBasicFormData] = useState({
    name: '',
    description: '',
    categoryId: 2,
  });

  // Discount settings
  const [discountSettings, setDiscountSettings] = useState({
    discountType: undefined as string | undefined,
    discountValue: undefined as number | undefined,
    minCap: undefined as number | undefined,
    percentageMax: undefined as number | undefined,
    maxCap: undefined as number | undefined,
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Attributes and variants state
  const [attributes, setAttributes] = useState<ProductAttributeDTO[]>([]);
  const [variants, setVariants] = useState<ProductVariantDTO[]>([]);

  // Add state for stock modal and attribute index
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAttributeIndex, setStockAttributeIndex] = useState<number | null>(null);
  const [stockValues, setStockValues] = useState<{ value: string; stock: number }[]>([]);

  // Add drag states for variations
  const [draggedVariationIndex, setDraggedVariationIndex] = useState<number | null>(null);
  const [dragOverVariationIndex, setDragOverVariationIndex] = useState<number | null>(null);

  // Add state for price and productionCost at the parent level
  const [price, setPrice] = useState(0);
  const [productionCost, setProductionCost] = useState(0);

  // Function to add a new attribute
  const handleAddAttribute = (e: React.MouseEvent) => {
    e.preventDefault();
    setAttributes([
      ...attributes,
      { name: "New Attribute", values: [""] },
    ]);
  };

  // Function to delete an attribute
  const handleDeleteAttribute = (index: number) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
    
    // Regenerate variants when attributes change
    generateVariants(newAttributes);
  };

  // Function to update attribute name
  const handleAttributeNameChange = (index: number, name: string) => {
    const newAttributes = [...attributes];
    newAttributes[index].name = name;
    setAttributes(newAttributes);
    
    // Regenerate variants when attributes change
    generateVariants(newAttributes);
  };

  // Function to update attribute values
  const handleAttributeValuesChange = (index: number, values: string[]) => {
    const newAttributes = [...attributes];
    newAttributes[index].values = values;
    setAttributes(newAttributes);
    
    // Regenerate variants when attributes change
    generateVariants(newAttributes);
  };

  // Function to generate all possible variant combinations
  const generateVariants = (attrs: ProductAttributeDTO[]) => {
    if (attrs.length === 0) {
      setVariants([]);
      return;
    }

    // Generate all combinations of attribute values
    const combinations = generateCombinations(attrs);
    
    // Create variants from combinations
    const newVariants: ProductVariantDTO[] = combinations.map((combination, index) => {
      const variantAttributes: VariantAttributeDTO[] = combination.map((value, attrIndex) => ({
        name: attrs[attrIndex].name,
        value: value
      }));

      return {
        stock: 0,
        price: 0,
        productionCost: 0,
        attributes: variantAttributes
      };
    });

    console.log('🔄 Generated variants:', newVariants);
    setVariants(newVariants);
  };

  // Helper function to generate all combinations of attribute values
  const generateCombinations = (attrs: ProductAttributeDTO[]): string[][] => {
    if (attrs.length === 0) return [];
    if (attrs.length === 1) {
      return attrs[0].values.map(value => [value]);
    }

    const [firstAttr, ...restAttrs] = attrs;
    const restCombinations = generateCombinations(restAttrs);
    
    const combinations: string[][] = [];
    firstAttr.values.forEach(value => {
      if (restCombinations.length === 0) {
        combinations.push([value]);
      } else {
        restCombinations.forEach(restCombo => {
          combinations.push([value, ...restCombo]);
        });
      }
    });

    return combinations;
  };

  // Modified handleAddDefaults
  const handleAddDefaults = (index: number) => {
    // Always use first variation for stock management
    const firstVariation = attributes[0];
    if (!firstVariation || firstVariation.values.length === 0) {
      alert("Please add values to the first attribute first");
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

  // Handler to open stock modal for a specific attribute
  const openStockModalForAttribute = (index: number) => {
    setStockAttributeIndex(index);
    const attr = attributes[index];
    setStockValues(attr.values.map(value => ({ value, stock: 0 })));
    setShowStockModal(true);
  };

  // Save stock values for the selected attribute
  const handleSaveStock = () => {
    if (stockAttributeIndex === null) return;
    const attrName = attributes[stockAttributeIndex].name;
    const updatedVariants = variants.map(variant => {
      const attr = variant.attributes?.find(a => a.name === attrName);
      if (attr) {
        const stockObj = stockValues.find(sv => sv.value === attr.value);
        if (stockObj) {
          return { ...variant, stock: stockObj.stock };
        }
      }
      return variant;
    });
    setVariants(updatedVariants);
    setShowStockModal(false);
  };

  // Update variant price and production cost
  const handleVariantUpdate = (index: number, field: 'price' | 'productionCost' | 'stock', value: number) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value
    };
    setVariants(updatedVariants);
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
      const newVariants = [...variants];
      const [movedVariant] = newVariants.splice(draggedVariationIndex, 1);
      newVariants.splice(dragOverVariationIndex, 0, movedVariant);
      setVariants(newVariants);
    }

    setDraggedVariationIndex(null);
    setDragOverVariationIndex(null);
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate global price and production cost
      if (price <= 0 || productionCost <= 0) {
        alert('Please enter valid price and production cost');
        return;
      }
      // Validate stock for each variant
      if (variants.some(v => v.stock == null || v.stock < 0)) {
        alert('Please ensure all variants have valid stock levels');
        return;
      }
      // Assign global price and production cost to each variant
      const variantsWithPrice = variants.map(v => ({
        ...v,
        price,
        productionCost,
      }));

      // Validate required fields
      if (!basicFormData.name || !basicFormData.description || basicFormData.categoryId === 0) {
        alert('Please fill in all required fields');
        return;
      }

      // Create the complete product data
      const productData: ProductCreateDTO = {
        name: basicFormData.name,
        description: basicFormData.description,
        categoryId: basicFormData.categoryId,
        discountType: discountSettings.discountType,
        discountValue: discountSettings.discountValue,
        minCap: discountSettings.minCap,
        percentageMax: discountSettings.percentageMax,
        maxCap: discountSettings.maxCap,
        attributes: attributes.length > 0 ? attributes : [],
        variants: variantsWithPrice,
      };

      // Log the data being sent
      console.log('📤 Sending product data to backend:', JSON.stringify(productData, null, 2));

      // Create product
      const newProduct = await handleCreateProduct(productData, imageFiles);
      
      // Show success dialog
      setShowSuccessDialog(true);
      
      // Redirect to products page after a short delay
      setTimeout(() => {
        router.push('/dashboard/products');
      }, 2000);
      
    } catch (err: any) {
      console.error('Error creating product:', err);
      alert(`Failed to create product: ${err.message}`);
    }
  };

  // Update basic form data handler
  const updateBasicFormData = (updates: Partial<typeof basicFormData>) => {
    setBasicFormData(prev => ({ ...prev, ...updates }));
  };

  // Update discount settings handler
  const updateDiscountSettings = (updates: Partial<typeof discountSettings>) => {
    setDiscountSettings(prev => ({ ...prev, ...updates }));
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
                    formData={basicFormData}
                    updateFormData={updateBasicFormData}
                    imageFiles={imageFiles}
                    updateImageFiles={updateImageFiles}
                  />

                  {/* Pricing Section */}
                  <PricingSection price={price} setPrice={setPrice} productionCost={productionCost} setProductionCost={setProductionCost} />

                  {/* Low Stock Settings Section */}
                  <LowStockSection 
                    formData={discountSettings}
                    updateFormData={updateDiscountSettings}
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
                    {attributes.map((attribute, index) => (
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
                          name={attribute.name}
                          index={index}
                          values={attribute.values}
                          onDelete={() => handleDeleteAttribute(index)}
                          onChange={(name) => handleAttributeNameChange(index, name)}
                          onValuesChange={(values) => handleAttributeValuesChange(index, values)}
                          onSetStock={() => openStockModalForAttribute(index)}
                          isDragging={draggedVariationIndex === index}
                        />
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddAttribute}
                      className="w-full"
                    >
                      + Add Attribute
                    </Button>
                  </div>
                </>
              )}

              {activeTab === "Stock Management" && (
                <StockManagementSection variants={variants} setVariants={setVariants} />
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
              {stockValues.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4">
                  <Label className="flex-1">{item.value}</Label>
                  <Input
                    type="number"
                    value={item.stock}
                    onChange={e => {
                      const newStock = [...stockValues];
                      newStock[idx].stock = Number(e.target.value);
                      setStockValues(newStock);
                    }}
                    className="w-24"
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowStockModal(false)}>
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
