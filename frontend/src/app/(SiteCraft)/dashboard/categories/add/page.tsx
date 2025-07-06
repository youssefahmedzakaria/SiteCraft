"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/SiteCraft/ui/button";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import { Card, CardContent } from "@/components/SiteCraft/ui/card";
import CategorysOverview from "@/components/SiteCraft/dashboard/categories/add/categoriesOverview";
import AssignProducts from "@/components/SiteCraft/dashboard/categories/add/assignProducts";
import { useCategoryManagement } from "@/hooks/useCategoryManagement";
import { CategoryCreateDTO } from "@/lib/categories";
import { SimplifiedProduct } from "@/lib/products";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useStoreStatus } from "@/hooks/useStoreStatus";

export default function AddCategoryPage() {
  const [activeTab, setActiveTab] = useState<
    "Category's Overview" | "Assign Products"
  >("Category's Overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // State for maintaining data across tab switches
  const [assignedProducts, setAssignedProducts] = useState<SimplifiedProduct[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  
  const tabs = ["Category's Overview", "Assign Products"];
  const router = useRouter();
  const { addCategory, assignProductsToCategory } = useCategoryManagement();
  const { isAuthenticated } = useAuth();
  const { isInactive } = useStoreStatus();
  
  // Refs to access form data (keeping for backward compatibility)
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  // Show inactive store message if store is inactive
  if (isInactive) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Store Inactive</h2>
              <p className="text-gray-600 mb-4">Your store is inactive. Please subscribe to activate your store.</p>
              <Button 
                onClick={() => router.push('/pricing')}
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
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to add new categories.</p>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Use state values instead of refs
      const name = categoryName || nameRef.current?.value;
      const description = categoryDescription || descriptionRef.current?.value;
      const fileToUpload = imageFile || imageRef.current?.files?.[0];
      
      if (!name || name.trim() === '') {
        setSubmitError('Category name is required');
        return;
      }
      
      const categoryData: CategoryCreateDTO = {
        name: name.trim(),
        description: description?.trim() || '',
      };
      
      console.log('Creating category with data:', categoryData);
      console.log('Assigned products:', assignedProducts);
      
      // First, create the category
      const newCategory = await addCategory(categoryData, fileToUpload);
      
      // Then, assign products to the category if any are selected
      if (assignedProducts.length > 0) {
        const productIds = assignedProducts.map(product => product.id);
        console.log('Assigning products to category:', newCategory.id, productIds);
        await assignProductsToCategory(Number(newCategory.id), productIds);
      }
      
      setSubmitSuccess(true);
      
      // Redirect to categories page after a brief delay
      setTimeout(() => {
        router.push('/dashboard/categories');
      }, 1500);
      
    } catch (error) {
      console.error('💥 Error creating category:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Add New Category</h1>
          <h2 className="text-lg md:text-xl text-gray-600">
            Create a new product category for your store
          </h2>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800">Category created successfully! Redirecting...</span>
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

        <Card className="bg-white">
          <CardContent className="py-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === "Category's Overview" && (
                <CategorysOverview 
                  nameRef={nameRef}
                  descriptionRef={descriptionRef}
                  imageRef={imageRef}
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                  categoryName={categoryName}
                  setCategoryName={setCategoryName}
                  categoryDescription={categoryDescription}
                  setCategoryDescription={setCategoryDescription}
                />
              )}

              {activeTab === "Assign Products" && (
                <AssignProducts 
                  assignedProducts={assignedProducts}
                  setAssignedProducts={setAssignedProducts}
                />
              )}

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
                >
                  {isSubmitting ? 'Creating...' : 'Save Category'}
                </Button>
                <Link href="/dashboard/categories">
                  <Button
                    type="button"
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
