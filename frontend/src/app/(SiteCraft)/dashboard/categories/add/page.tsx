"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/SiteCraft/ui/button";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import { Card, CardContent } from "@/components/SiteCraft/ui/card";
import CategorysOverview from "@/components/SiteCraft/dashboard/categories/add/categoriesOverview";
import AssignProducts from "@/components/SiteCraft/dashboard/categories/add/assignProducts";

export default function AddCategoryPage() {
  const [activeTab, setActiveTab] = useState<
    "Category's Overview" | "Assign Products"
  >("Category's Overview");
  const tabs = ["Category's Overview", "Assign Products"];

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
            <form className="space-y-6">
              {activeTab === "Category's Overview" && <CategorysOverview />}

              {activeTab === "Assign Products" && <AssignProducts />}

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
                >
                  Save Category
                </Button>
                <Link href="/dashboard/categories">
                  <Button
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
