"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/SiteCraft/ui/button";
import { Input } from "@/components/SiteCraft/ui/input";
import { Textarea } from "@/components/SiteCraft/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/SiteCraft/ui/card";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import { useStoreInfo } from "@/hooks/useStoreInfo";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/SiteCraft/ui/alert";

export default function AddAboutUsPage() {
  const router = useRouter();
  const { addNewAboutUs, aboutLoading } = useStoreInfo();
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "Text",
    status: "Visible"
  });
  const [error, setError] = useState<string | null>(null);

  console.log('📄 Add About Us Page - Current state:', { formData, aboutLoading, error });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError(null);
      console.log('🔄 Submitting new about us section...', formData);
      
      await addNewAboutUs(formData);
      console.log('✅ About us section added successfully, redirecting...');
      
      router.push('/dashboard/store-info');
    } catch (err) {
      console.error('❌ Failed to add about us section:', err);
      setError(err instanceof Error ? err.message : 'Failed to add about us section');
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
          
            <h1 className="text-2xl md:text-3xl font-bold">Add New About Us Section</h1>
            <p className="text-gray-600 mt-2">Create a new section for your about us page</p>
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
              <CardTitle>About Us Section Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Section Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    name="title"
                    required
                    placeholder="e.g., Our Story, Mission Statement"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Section Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-logo-dark-button focus:border-transparent"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    <option value="Text">Text</option>
                    <option value="Mission">Mission</option>
                    <option value="Team">Team</option>
                    <option value="History">History</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="content"
                    name="content"
                    required
                    placeholder="Enter the content for this section..."
                    rows={8}
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
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
                    <option value="Visible">Visible</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-4">
                  <Link href="/dashboard/store-info">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={aboutLoading} className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover">
                    {aboutLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Add Section
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
