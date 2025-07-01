"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/SiteCraft/ui/button";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import { Card, CardContent } from "@/components/SiteCraft/ui/card";
import CategorysOverview from "@/components/SiteCraft/dashboard/categories/edit/categoriesOverview";
import AssignProducts from "@/components/SiteCraft/dashboard/categories/add/assignProducts";
import { useCategoryManagement } from "@/hooks/useCategoryManagement";
import { getCategoryById, getCategoryProducts } from "@/lib/categories";
import { CategoryCreateDTO } from "@/lib/categories";
import { SimplifiedProduct, transformProduct } from "@/lib/products";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  const { isAuthenticated } = useAuth();
  
  const [activeTab, setActiveTab] = useState<
    "Category's Overview" | "Assign Products"
  >("Category's Overview");
  
  // State for maintaining data across tab switches
  const [assignedProducts, setAssignedProducts] = useState<SimplifiedProduct[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const tabs = ["Category's Overview", "Assign Products"];
  const { editCategory, assignProductsToCategory } = useCategoryManagement();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to edit categories.</p>
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

  // Load category data on component mount
  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        
        if (!categoryId) {
          setLoadError('Category ID is required');
          return;
        }

        console.log('Loading category data for ID:', categoryId);
        
        // Load category details
        const category = await getCategoryById(parseInt(categoryId));
        setCategoryName(category.name);
        setCategoryDescription(category.description);
        setExistingImageUrl(category.image);
        
        // Load assigned products
        const products = await getCategoryProducts(parseInt(categoryId));
        // Transform the products to match SimplifiedProduct interface
        const transformedProducts = products.map((product: any) => transformProduct(product));
        setAssignedProducts(transformedProducts);
        
        console.log('Category data loaded successfully:', category);
        console.log('Assigned products:', transformedProducts);
        
      } catch (error) {
        console.error('💥 Error loading category data:', error);
        setLoadError(error instanceof Error ? error.message : 'Failed to load category data');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryData();
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      if (!categoryId) {
        setSubmitError('Category ID is required');
        return;
      }
      
      if (!categoryName || categoryName.trim() === '') {
        setSubmitError('Category name is required');
        return;
      }
      
      const categoryData: CategoryCreateDTO = {
        name: categoryName.trim(),
        description: categoryDescription?.trim() || '',
      };
      
      console.log('Updating category with data:', categoryData);
      console.log('Assigned products:', assignedProducts);
      
      // Update the category
      await editCategory(parseInt(categoryId), categoryData, imageFile || undefined);
      
      // Update assigned products if any are selected
      if (assignedProducts.length > 0) {
        const productIds = assignedProducts.map(product => product.id);
        console.log('Assigning products to category:', categoryId, productIds);
        await assignProductsToCategory(parseInt(categoryId), productIds);
      }
      
      setSubmitSuccess(true);
      
      // Redirect to categories page after a brief delay
      setTimeout(() => {
        router.push('/dashboard/categories');
      }, 1500);
      
    } catch (error) {
      console.error('💥 Error updating category:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600">Loading category data...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (loadError) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Category</h2>
              <p className="text-gray-600 mb-4">{loadError}</p>
              <Link href="/dashboard/categories">
                <Button variant="outline">Back to Categories</Button>
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
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Edit Category</h1>
          <h2 className="text-lg md:text-xl text-gray-600">
            Edit the details of the category and assign products to it
          </h2>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800">Category updated successfully! Redirecting...</span>
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
                  categoryName={categoryName}
                  setCategoryName={setCategoryName}
                  categoryDescription={categoryDescription}
                  setCategoryDescription={setCategoryDescription}
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                  existingImageUrl={existingImageUrl}
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
                  {isSubmitting ? 'Updating...' : 'Save Changes'}
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
