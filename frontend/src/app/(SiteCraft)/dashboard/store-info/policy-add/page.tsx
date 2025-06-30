"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/SiteCraft/ui/button";
import { Input } from "@/components/SiteCraft/ui/input";
import { Textarea } from "@/components/SiteCraft/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/SiteCraft/ui/card";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import { useStoreInfo } from "@/hooks/useStoreInfo";
import { ArrowLeft, Loader2, Save, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/SiteCraft/ui/alert";
import { useAuth } from "@/hooks/useAuth";

export default function AddPolicyPage() {
  const router = useRouter();
  const { addNewPolicy, policiesLoading } = useStoreInfo();
  const { isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Active"
  });
  const [error, setError] = useState<string | null>(null);

  console.log('📋 Add Policy Page - Current state:', { formData, policiesLoading, error });

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to add new policies.</p>
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
      setError(null);
      console.log('🔄 Submitting new policy...', formData);
      
      const newPolicy = await addNewPolicy(formData);
      console.log('✅ Policy added successfully, redirecting...');
      
      router.push('/dashboard/store-info');
    } catch (err) {
      console.error('❌ Failed to add policy:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add policy';
      setError(errorMessage);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        
          {/* Header */}
          <div className="mb-6">
            {/* <Link href="/dashboard/store-info" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Store Info
            </Link> */}
            <h1 className="text-2xl md:text-3xl font-bold">Add New Policy</h1>
            <p className="text-gray-600 mt-2">Create a new policy for your store</p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Policy Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    name="title"
                    required
                    placeholder="e.g., Return Policy, Shipping Policy"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Policy Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    placeholder="Enter the full policy description..."
                    rows={6}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logo-dark-button focus:border-transparent"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-4">
                  <Link href="/dashboard/store-info">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={policiesLoading} className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover">
                    {policiesLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Add Policy
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        
      </main>
    </div>
  );
}
