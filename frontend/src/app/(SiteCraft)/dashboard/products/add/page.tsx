"use client";
import React, { useState, useEffect } from "react";
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
import {
  ProductCreateDTO,
  ProductAttributeDTO,
  ProductVariantDTO,
  VariantAttributeDTO,
  getCategories,
} from "@/lib/products";
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
import { useStoreStatus } from "@/hooks/useStoreStatus";

export default function AddProductPage() {
  const router = useRouter();
  const { handleCreateProduct, isCreating, error, clearError } =
    useProductManagement();
  const { isAuthenticated } = useAuth();
  const { isInactive } = useStoreStatus();

  // Add local state for error handling
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  // Show inactive store message if store is inactive
  if (isInactive) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Store Inactive
              </h2>
              <p className="text-gray-600 mb-4">
                Your store is inactive. Please subscribe to activate your store.
              </p>
              <Button
                onClick={() => router.push("/pricing")}
                className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
              >
                Subscribe Now
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-4">
              Please log in to add new products.
            </p>
            <Button
              onClick={() => router.push("/login")}
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
    name: "",
    description: "",
    categoryIds: [] as number[],
  });

  // Discount settings
  const [discountSettings, setDiscountSettings] = useState({
    discountType: undefined as string | undefined,
    discountValue: undefined as number | undefined,
  });

  // Low stock notification settings
  const [lowStockSettings, setLowStockSettings] = useState({
    lowStockType: undefined as string | undefined,
    lowStockThreshold: undefined as number | undefined,
    lowStockEnabled: false,
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Attributes and variants state
  const [attributes, setAttributes] = useState<ProductAttributeDTO[]>([
    { name: "New Attribute", values: [""] },
  ]);
  const [variants, setVariants] = useState<ProductVariantDTO[]>([]);

  // Add state for stock modal and attribute index
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAttributeIndex, setStockAttributeIndex] = useState<number | null>(
    null
  );
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

  // Add state for price and productionCost at the parent level
  const [price, setPrice] = useState(0);
  const [productionCost, setProductionCost] = useState(0);

  // Add state for parent stocks
  const [parentStocks, setParentStocks] = useState<Record<string, number>>({});

  // Function to add a new attribute
  const handleAddAttribute = (e: React.MouseEvent) => {
    e.preventDefault();
    setAttributes([...attributes, { name: "New Attribute", values: [""] }]);
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
      const defaultVariant: ProductVariantDTO = {
        stock: 0,
        price: price,
        productionCost: productionCost,
        attributes: [],
      };
      setVariants([defaultVariant]);
      return;
    }

    // Generate all combinations of attribute values
    const combinations = generateCombinations(attrs);

    // Create variants from combinations
    const newVariants: ProductVariantDTO[] = combinations.map((combination) => {
      const variantAttributes: VariantAttributeDTO[] = combination.map(
        (value, attrIndex) => ({
          name: attrs[attrIndex].name,
          value: value,
        })
      );

      // For first attribute (parent), get its stock value
      const parentValue = combination[0];
      const parentStock = parentStocks[parentValue] || 0;

      // Find all combinations that share this parent value
      const siblingCombos = combinations.filter(
        (combo) => combo[0] === parentValue
      );
      const siblingCount = siblingCombos.length;
      const siblingIndex = siblingCombos.findIndex(
        (combo) => JSON.stringify(combo) === JSON.stringify(combination)
      );

      // Calculate this variant's portion of parent stock
      let stock = 0;
      if (siblingCount > 0) {
        const base = Math.floor(parentStock / siblingCount);
        const remainder = parentStock % siblingCount;
        stock = base + (siblingIndex < remainder ? 1 : 0);
      }

      console.log(`Creating variant:
        Parent Value: ${parentValue}
        Parent Total Stock: ${parentStock}
        Sibling Count: ${siblingCount}
        Sibling Index: ${siblingIndex}
        Assigned Stock: ${stock}
        Full Combination: ${combination.join("-")}
      `);

      return {
        stock,
        price: price,
        productionCost: productionCost,
        attributes: variantAttributes,
      };
    });

    console.log(
      "Final variants with stock:",
      newVariants.map((v) => ({
        attributes:
          v.attributes?.map((a) => `${a.name}: ${a.value}`).join(", ") ||
          "No attributes",
        stock: v.stock,
      }))
    );

    setVariants(newVariants);
  };

  // Helper function to generate all combinations of attribute values
  const generateCombinations = (attrs: ProductAttributeDTO[]): string[][] => {
    if (attrs.length === 0) return [];
    if (attrs.length === 1) {
      return attrs[0].values.map((value) => [value]);
    }

    const [firstAttr, ...restAttrs] = attrs;
    const restCombinations = generateCombinations(restAttrs);

    const combinations: string[][] = [];
    firstAttr.values.forEach((value) => {
      if (restCombinations.length === 0) {
        combinations.push([value]);
      } else {
        restCombinations.forEach((restCombo) => {
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

    // Initialize with current parent stocks or 0
    setStockValues(
      firstVariation.values.map((value) => ({
        value,
        stock: parentStocks[value] || 0,
      }))
    );
    setShowStockModal(true);
  };

  // Handler to open stock modal for a specific attribute
  const openStockModalForAttribute = (index: number) => {
    // Always use first variation for stock management
    if (index !== 0) {
      alert("Stock can only be set for the first attribute");
      return;
    }

    const firstVariation = attributes[0];
    if (!firstVariation || firstVariation.values.length === 0) {
      alert("Please add values to the first attribute first");
      return;
    }

    setStockAttributeIndex(index);
    setStockValues(
      firstVariation.values.map((value) => ({
        value,
        stock: parentStocks[value] || 0,
      }))
    );
    setShowStockModal(true);
  };

  // Save stock values for the selected attribute
  const handleSaveStock = () => {
    if (stockAttributeIndex === null) return;

    // Only allow setting stock for the first attribute (parent)
    if (stockAttributeIndex !== 0) {
      alert("Stock can only be set for the first attribute");
      setShowStockModal(false);
      return;
    }

    // Update parent stocks
    const newParentStocks = { ...parentStocks };
    stockValues.forEach((sv) => {
      newParentStocks[sv.value] = parseInt(sv.stock as any, 10) || 0;
    });

    console.log("Setting parent stocks:", newParentStocks);
    setParentStocks(newParentStocks);

    // Find all variants for each parent value and distribute stock
    const updatedVariants = [...variants];
    Object.entries(newParentStocks).forEach(([parentValue, totalStock]) => {
      // Find all variants with this parent value
      const matchingVariants = updatedVariants.filter(
        (variant) => variant.attributes?.[0]?.value === parentValue
      );

      console.log(`Distributing stock for ${parentValue}:`, {
        totalStock,
        variantCount: matchingVariants.length,
      });

      if (matchingVariants.length > 0) {
        const base = Math.floor(totalStock / matchingVariants.length);
        const remainder = totalStock % matchingVariants.length;

        matchingVariants.forEach((variant, idx) => {
          const variantStock = base + (idx < remainder ? 1 : 0);
          const variantIndex = updatedVariants.findIndex(
            (v) =>
              v.attributes?.[0]?.value === variant.attributes?.[0]?.value &&
              v.attributes?.[1]?.value === variant.attributes?.[1]?.value
          );

          if (variantIndex !== -1) {
            updatedVariants[variantIndex] = {
              ...updatedVariants[variantIndex],
              stock: variantStock,
            };

            console.log(`Set stock for variant:`, {
              parentValue,
              childValue: variant.attributes?.[1]?.value,
              stock: variantStock,
            });
          }
        });
      }
    });

    console.log(
      "Final variants after stock distribution:",
      updatedVariants.map((v) => ({
        combination: v.attributes?.map((a) => a.value).join("-"),
        stock: v.stock,
      }))
    );

    setVariants(updatedVariants);
    setShowStockModal(false);
  };

  // Update variant price and production cost
  const handleVariantUpdate = (
    index: number,
    field: "price" | "productionCost" | "stock",
    value: number
  ) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
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
      setSubmitError(null);
      setSubmitSuccess(false);
      clearError(); // Clear any existing errors from the hook

      // Validate global price and production cost
      if (price <= 0 || productionCost <= 0) {
        setSubmitError("Please enter valid price and production cost");
        return;
      }

      // Ensure we have at least one variant (create default if none exist)
      let finalVariants = variants;
      if (variants.length === 0) {
        // Create a default variant if none exist
        finalVariants = [
          {
            stock: 0,
            price: price,
            productionCost: productionCost,
            attributes: [],
          },
        ];
      } else {
        // Update existing variants with current global price and production cost
        finalVariants = variants.map((v) => ({
          ...v,
          price,
          productionCost,
        }));
      }

      // Validate stock for each variant
      if (finalVariants.some((v) => v.stock == null || v.stock < 0)) {
        setSubmitError("Please ensure all variants have valid stock levels");
        return;
      }

      // Validate required fields
      if (
        !basicFormData.name ||
        !basicFormData.description ||
        (basicFormData.categoryIds || []).length === 0
      ) {
        setSubmitError("Please fill in all required fields");
        return;
      }

      // Create the complete product data
      const productData: ProductCreateDTO = {
        name: basicFormData.name,
        description: basicFormData.description,
        categoryIds: basicFormData.categoryIds,
        discountType: discountSettings.discountType,
        discountValue: discountSettings.discountValue,
        attributes: attributes.length > 0 ? attributes : [],
        variants: finalVariants,
        // Low stock notification settings
        lowStockType: lowStockSettings.lowStockEnabled
          ? lowStockSettings.lowStockType
          : undefined,
        lowStockThreshold: lowStockSettings.lowStockEnabled
          ? lowStockSettings.lowStockThreshold
          : undefined,
        lowStockEnabled: lowStockSettings.lowStockEnabled,
      };

      // Log the data being sent
      console.log(
        "📤 Sending product data to backend:",
        JSON.stringify(productData, null, 2)
      );

      // Create product
      const newProduct = await handleCreateProduct(productData, imageFiles);

      // Show success message
      setSubmitSuccess(true);

      // Redirect to products page after a short delay
      setTimeout(() => {
        router.push("/dashboard/products");
      }, 2000);
    } catch (err: any) {
      console.error("Error creating product:", err);
      clearError(); // Clear hook error to avoid duplication
      setSubmitError(err.message || "Failed to create product");
    }
  };

  // Update basic form data handler
  const updateBasicFormData = (updates: Partial<typeof basicFormData>) => {
    setBasicFormData((prev) => ({ ...prev, ...updates }));
  };

  // Update discount settings handler
  const updateDiscountSettings = (
    updates: Partial<typeof discountSettings>
  ) => {
    setDiscountSettings((prev) => ({ ...prev, ...updates }));
  };

  // Update low stock settings handler
  const updateLowStockSettings = (
    updates: Partial<typeof lowStockSettings>
  ) => {
    setLowStockSettings((prev) => ({ ...prev, ...updates }));
  };

  // Update image files handler
  const updateImageFiles = (files: File[]) => {
    setImageFiles(files);
  };

  // UseEffect to regenerate variants when attributes change
  useEffect(() => {
    generateVariants(attributes);
  }, [attributes]);

  // UseEffect to regenerate default variant when price or production cost changes
  useEffect(() => {
    if (attributes.length === 0) {
      generateVariants(attributes);
    }
  }, [price, productionCost]);

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

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800">
                Product created successfully! Redirecting...
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{submitError}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSubmitError(null)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        {/* Error Alert from hook */}
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
                  <PricingSection
                    price={price}
                    setPrice={setPrice}
                    productionCost={productionCost}
                    setProductionCost={setProductionCost}
                    discountSettings={discountSettings}
                    updateDiscountSettings={updateDiscountSettings}
                  />

                  {/* Low Stock Settings Section */}
                  <LowStockSection
                    formData={lowStockSettings}
                    updateFormData={updateLowStockSettings}
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
                        className="mb-4 p-4 rounded-lg border transition-all border-gray-200"
                      >
                        <CustomVariationSection
                          name={attribute.name}
                          index={index}
                          values={attribute.values}
                          onDelete={() => handleDeleteAttribute(index)}
                          onChange={(name) =>
                            handleAttributeNameChange(index, name)
                          }
                          onValuesChange={(values) =>
                            handleAttributeValuesChange(index, values)
                          }
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
                <StockManagementSection
                  variants={variants}
                  setVariants={setVariants}
                />
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
                  {isCreating ? "Creating Product..." : "Create Product"}
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
                    onChange={(e) => {
                      const newStock = [...stockValues];
                      newStock[idx].stock = Number(e.target.value);
                      setStockValues(newStock);
                    }}
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
                Your product has been created and is now available in your
                store.
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
