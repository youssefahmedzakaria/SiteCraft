// frontend/src/app/dashboard/account-settings/page.tsx
"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import { Card, CardContent } from "@/components/SiteCraft/ui/card";
import { StoreInformationSection } from "@/components/SiteCraft/dashboard/account-settings/StoreInformationSection";
import { StaffManagementSection } from "@/components/SiteCraft/dashboard/account-settings/StaffManagementSection";
import { useAuth } from "@/hooks/useAuth";
import { useStoreStatus } from "@/hooks/useStoreStatus";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/SiteCraft/ui/button";

export default function AccountSettingsPage() {
  const tabs = ["Store Information", "Staff Management"] as const;
  type Tab = (typeof tabs)[number];
  const [activeTab, setActiveTab] = useState<Tab>("Store Information");

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { isInactive } = useStoreStatus();
  const router = useRouter();

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
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
            <p className="text-gray-600 mb-4">Please log in to access account settings.</p>
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

  // Check if user has owner role
  if (user?.role !== 'owner') {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to access this page.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Check if store is inactive
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        {/* Page header */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Store Settings</h1>
          <h2 className="text-lg md:text-xl font-semibold text-gray-600">
            Manage your store information and staff members
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex mb-1 ml-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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

        {/* Content */}
        <Card className="bg-white">
          <CardContent className="py-2">
            {activeTab === "Store Information" ? (
              <StoreInformationSection />
            ) : (
              <StaffManagementSection />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
