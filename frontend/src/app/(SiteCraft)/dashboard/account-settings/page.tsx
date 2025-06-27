// frontend/src/app/dashboard/account-settings/page.tsx
"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import { Card, CardContent } from "@/components/SiteCraft/ui/card";
import { StoreInformationSection } from "@/components/SiteCraft/dashboard/account-settings/StoreInformationSection";
import { StaffManagementSection } from "@/components/SiteCraft/dashboard/account-settings/StaffManagementSection";

export default function AccountSettingsPage() {
  const tabs = ["Store Information", "Staff Management"] as const;
  type Tab = (typeof tabs)[number];
  const [activeTab, setActiveTab] = useState<Tab>("Store Information");

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
