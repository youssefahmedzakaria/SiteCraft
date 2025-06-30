"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/SiteCraft/ui/button";
import { Input } from "@/components/SiteCraft/ui/input";
import { Textarea } from "@/components/SiteCraft/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/SiteCraft/ui/card";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import { useStoreInfo } from "@/hooks/useStoreInfo";
import { getStorePolicyById } from "@/lib/store-info";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/SiteCraft/ui/alert";

export default function EditPolicyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const policyId = searchParams.get('id');
  const { updateExistingPolicy, policiesLoading } = useStoreInfo();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Active"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('📋 Edit Policy Page - Policy ID:', policyId);

  // Load policy data on mount
  useEffect(() => {
    if (policyId) {
      loadPolicyData();
    }
  }, [policyId]);

  const loadPolicyData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading policy data...', policyId);
      
      const policy = await getStorePolicyById(Number(policyId));
      console.log('✅ Policy data loaded:', policy);
      
      setFormData({
        title: policy.title || "",
        description: policy.description || "",
        status: policy.status || "Active"
      });
    } catch (err) {
      console.error('❌ Failed to load policy data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load policy data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!policyId) {
      setError('Policy ID is required');
      return;
    }
    
    try {
      setError(null);
      console.log('🔄 Updating policy...', { policyId, formData });
      
      await updateExistingPolicy(Number(policyId), formData);
      console.log('✅ Policy updated successfully, redirecting...');
      
      router.push('/dashboard/store-info');
    } catch (err) {
      console.error('❌ Failed to update policy:', err);
      setError(err instanceof Error ? err.message : 'Failed to update policy');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-logo-dark-button" />
              <p className="text-gray-600">Loading policy data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        
          {/* Header */}
          <div className="mb-6">
          
            <h1 className="text-2xl md:text-3xl font-bold">Edit Policy</h1>
            <p className="text-gray-600 mt-2">Update your policy information</p>
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
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Policy
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
