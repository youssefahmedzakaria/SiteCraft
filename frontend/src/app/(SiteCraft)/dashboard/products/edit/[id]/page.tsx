"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/SiteCraft/ui/button";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import { Card, CardContent, CardTitle } from "@/components/SiteCraft/ui/card";
import { ProductInfoSection } from "@/components/SiteCraft/dashboard/products/add/productInfoSection";
import { PricingSection } from "@/components/SiteCraft/dashboard/products/add/pricingSection";
import { LowStockSection } from "@/components/SiteCraft/dashboard/products/add/lowStockSection";
import { CustomVariationSection } from "@/components/SiteCraft/dashboard/products/add/customVariationSection";
import { useProductManagement } from "@/hooks/useProductManagement";
import { 
  Product, 
  ProductCreateDTO, 
  ProductAttributeDTO, 
  ProductVariantDTO, 
  VariantAttributeDTO,
  getProduct 
} from "@/lib/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/SiteCraft/ui/dialog";
import { Label } from "@/components/SiteCraft/ui/label";
import { Input } from "@/components/SiteCraft/ui/input";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { StockManagementSection } from "@/components/SiteCraft/dashboard/products/add/stockManagement";
import { useAuth } from "@/hooks/useAuth";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id ? parseInt(params.id as string) : null;
  const { isAuthenticated } = useAuth();
  
  const { handleUpdateProduct, isUpdating, error, clearError } = useProductManagement();
  
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
            <p className="text-gray-600 mb-4">Please log in to edit products.</p>
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

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Form state for basic product info
  const [basicFormData, setBasicFormData] = useState({
    name: '',
    description: '',
    categoryId: 0,
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
  const [existingImages, setExistingImages] = useState<any[]>([]);
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

  // Load existing product data
  useEffect(() => {
    if (productId) {
      loadProductData(productId);
    }
  }, [productId]);

  const loadProductData = async (id: number) => {
    try {
      setIsLoading(true);
      setLoadError('');
      
      console.log('📝 Loading product data for ID:', id);
      const product: Product = await getProduct(id);
      console.log('✅ Product loaded:', product);

      // Set basic form data
      setBasicFormData({
        name: product.name,
        description: product.description,
        categoryId: product.categoryId || 0,
      });

      // Set discount settings
      setDiscountSettings({
        discountType: product.discountType,
        discountValue: product.discountValue,
        minCap: product.minCap,
        percentageMax: product.percentageMax,
        maxCap: product.maxCap,
      });

      // Set existing images
      setExistingImages(product.images || []);

      // Transform attributes from backend format to frontend format
      let transformedAttributes: ProductAttributeDTO[] = [];
      if (product.attributes && product.attributes.length > 0) {
        transformedAttributes = product.attributes.map(attr => ({
          name: attr.attributeName,
          values: attr.attributeValues.map(val => val.attributeValue)
        }));
        setAttributes(transformedAttributes);
        console.log('🔄 Transformed attributes:', transformedAttributes);
      }

      // Map variant id to its attribute name/value pairs
      const variantIdToAttributes: Record<number, { name: string; value: string }[]> = {};
      if (product.attributes && product.attributes.length > 0) {
        for (const attr of product.attributes) {
          for (const attrValue of attr.attributeValues) {
            if (attrValue.variantAttributeValues && attrValue.variantAttributeValues.length > 0) {
              for (const vav of attrValue.variantAttributeValues) {
                if (!variantIdToAttributes[vav.id]) variantIdToAttributes[vav.id] = [];
                variantIdToAttributes[vav.id].push({ name: attr.attributeName, value: attrValue.attributeValue });
              }
            }
          }
        }
      }

      // Transform variants from backend format to frontend format
      if (product.variants && product.variants.length > 0) {
        const transformedVariants: ProductVariantDTO[] = product.variants.map(variant => {
          let variantAttributes = variantIdToAttributes[variant.id];
          if (!variantAttributes || variantAttributes.length === 0 || (variantAttributes.length === 1 && variantAttributes[0].name === "Default" && variantAttributes[0].value === "Default")) {
            // Parse the SKU and use everything after the second '|', then format nicely
            let parsedName = variant.sku || "-";
            if (parsedName.includes("|")) {
              const parts = parsedName.split("|");
              const attributes = parts.length > 2 ? parts.slice(2) : [parts[parts.length - 1]];
              parsedName = attributes
                .map(attr => {
                  const [name, value] = attr.split("-");
                  if (!name || !value) return attr;
                  return `${name.charAt(0).toUpperCase() + name.slice(1)}: ${value.charAt(0).toUpperCase() + value.slice(1)}`;
                })
                .join(", ");
            }
            // Remove leading colons, spaces, and any other unwanted characters
            parsedName = parsedName.replace(/^[:|\s]+/, "").trim();
            variantAttributes = [{ name: "", value: parsedName }];
          }
          return {
            id: variant.id,
            sku: variant.sku,
            stock: variant.stock,
            price: variant.price || 0,
            productionCost: variant.productionCost,
            attributes: variantAttributes
          };
        });
        setVariants(transformedVariants);
        console.log('🔄 Transformed variants:', transformedVariants);

        // Set price and production cost from the first variant (all variants have the same values)
        if (transformedVariants.length > 0) {
          setPrice(transformedVariants[0].price || 0);
          setProductionCost(transformedVariants[0].productionCost || 0);
        }
      }

    } catch (err: any) {
      console.error('💥 Error loading product:', err);
      setLoadError(err.message || 'Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

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
    
    if (!productId) {
      alert('Product ID not found');
      return;
    }
    
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

      // Validate required fields
      if (!basicFormData.name || !basicFormData.description || basicFormData.categoryId === 0) {
        alert('Please fill in all required fields');
        return;
      }

      // Assign global price and production cost to each variant
      const variantsWithPrice = variants.map(variant => ({
        ...variant,
        price,
        productionCost,
        // If attributes is a single item with name '', value 'Color: Black, Size: L',
        // replace it with the correct array of { name, value } pairs parsed from the string
        attributes:
          variant.attributes &&
          variant.attributes.length === 1 &&
          variant.attributes[0].name === "" &&
          variant.attributes[0].value.includes(":")
            ? variant.attributes[0].value.split(", ").map(pair => {
                const [name, value] = pair.split(": ");
                return { name: name?.trim() || "", value: value?.trim() || "" };
              })
            : variant.attributes || []
      }));

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
      console.log('📤 Sending updated product data to backend:', JSON.stringify(productData, null, 2));

      // Update product
      const updatedProduct = await handleUpdateProduct(productId, productData, imageFiles);
      
      // Show success dialog
      setShowSuccessDialog(true);
      
      // Redirect to products page after a short delay
      setTimeout(() => {
        router.push('/dashboard/products');
      }, 2000);
      
    } catch (err: any) {
      console.error('Error updating product:', err);
      alert(`Failed to update product: ${err.message}`);
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600">Loading product...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Product</h2>
              <p className="text-gray-600 mb-4">{loadError}</p>
              <Link href="/dashboard/products">
                <Button variant="outline">Back to Products</Button>
              </Link>
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
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        {/* Header section with title and subtitle */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Edit Product</h1>
          <h2 className="text-lg md:text-xl text-gray-600">
            Edit the details of {basicFormData.name}
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
                    existingImages={existingImages}
                    productId={productId ?? undefined}
                    setExistingImages={setExistingImages}
                  />

                  {/* Pricing Section */}
                  <PricingSection 
                    price={price} 
                    setPrice={setPrice} 
                    productionCost={productionCost} 
                    setProductionCost={setProductionCost} 
                  />

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
                      Edit product options that your customers can choose from
                      on the product page.
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
                  disabled={!!isUpdating}
                  className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
                >
                  {isUpdating ? 'Updating Product...' : 'Update Product'}
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
                <span>Product Updated Successfully!</span>
              </DialogTitle>
            </DialogHeader>
            <div className="text-center py-4">
              <p className="text-gray-600">
                Your product has been updated and is now available in your store.
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
