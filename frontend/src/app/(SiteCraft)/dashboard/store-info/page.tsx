"use client";

import Link from "next/link";
import { Button } from "@/components/SiteCraft/ui/button";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import { StorePolicyTableHeader } from "@/components/SiteCraft/dashboard/storeInfo/policyTableHeader";
import { StoreAboutTableHeader } from "@/components/SiteCraft/dashboard/storeInfo/aboutTableHeader";
import { PolicyRecord } from "@/components/SiteCraft/dashboard/storeInfo/policyRecord";
import { AboutRecord } from "@/components/SiteCraft/dashboard/storeInfo/aboutRecord";
import { useStoreInfo } from "@/hooks/useStoreInfo";
import { Plus, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/SiteCraft/ui/alert";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function StoreInfoPage() {
  const { 
    policies, 
    aboutSections, 
    loading, 
    error, 
    refreshStoreInfo,
    forceUpdate,
    removePolicy,
    removeAboutUs
  } = useStoreInfo();

  const { isAuthenticated } = useAuth();
  const router = useRouter();

  console.log('🏪 Store Info Page - Current state:', {
    policiesCount: policies.length,
    aboutSectionsCount: aboutSections.length,
    loading,
    error,
    forceUpdate
  });

  // Force re-render when forceUpdate changes
  useEffect(() => {
    console.log('🔄 Store Info Page re-rendering due to forceUpdate:', forceUpdate);
  }, [forceUpdate]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-logo-dark-button" />
              <p className="text-gray-600">Loading store information...</p>
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
            <p className="text-gray-600 mb-4">Please log in to view and manage store information.</p>
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

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading store information: {error}
            </AlertDescription>
          </Alert>
          <div className="text-center">
            <Button onClick={refreshStoreInfo} variant="outline" className="mb-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Store Info</h1>
              <h2 className="text-lg md:text-xl font-semibold text-gray-600">
                Manage store policies and about us content
              </h2>
            </div>
          </div>
        </div>

        {/* Policies Table */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Store Policies: {policies.length}
            </h3>
            <div className="flex justify-end">
              <Link href="/dashboard/store-info/policy-add">
                <Button className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover">
                  <Plus size={16} />
                  <span className="ml-2">Add New Policy</span>
                </Button>
              </Link>
            </div>
          </div>
          
          {policies.length === 0 ? (
            <div className="border rounded-lg border-logo-border p-8 text-center">
              <p className="text-gray-500 mb-2">No policies found</p>
              <p className="text-xs text-gray-400">Add your first policy to get started.</p>
            </div>
          ) : (
            <div className="border rounded-lg border-logo-border overflow-y-auto overflow-x-auto">
              <table className="min-w-full divide-y divide-logo-border">
                <StorePolicyTableHeader />
                <tbody className="bg-white divide-y divide-logo-border">
                  {policies.map((policy) => (
                    <PolicyRecord key={policy.id} policy={policy} onDelete={removePolicy} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* About Us Table */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              About Us: {aboutSections.length}
            </h3>
            <div className="flex justify-end">
              <Link href="/dashboard/store-info/about-add">
                <Button className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover">
                  <Plus size={16} />
                  <span className="ml-2">Add New Section</span>
                </Button>
              </Link>
            </div>
          </div>
          
          {aboutSections.length === 0 ? (
            <div className="border rounded-lg border-logo-border p-8 text-center">
              <p className="text-gray-500 mb-2">No about us sections found</p>
              <p className="text-xs text-gray-400">Add your first section to get started.</p>
            </div>
          ) : (
            <div className="border rounded-lg border-logo-border overflow-y-auto overflow-x-auto">
              <table className="min-w-full divide-y divide-logo-border">
                <StoreAboutTableHeader />
                <tbody className="bg-white divide-y divide-logo-border">
                  {aboutSections.map((section) => (
                    <AboutRecord key={section.id} section={section} onDelete={removeAboutUs} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
