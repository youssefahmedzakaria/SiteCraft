"use client";
import React, { useState } from "react";
import { Button } from "@/components/SiteCraft/ui/button";
import { Sidebar } from "@/components/SiteCraft/dashboard/customize/sidebar";
import { Eye } from "lucide-react";

export default function CustomizeTemplatePage() {
  const [selectedTab, setSelectedTab] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-3 flex flex-col sm:flex-row justify-between items-center h-16">
          <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
            {/* preview */}
            <Button variant="outline" className="bg-white">
              <span className="flex items-center gap-2">
                <Eye size={20} />
                Preview
              </span>
            </Button>
            {/* views */}
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
              <button
                className={`px-2 sm:px-4 py-2 text-sm ${
                  selectedTab === "desktop" ? "bg-gray-100" : "bg-white"
                }`}
                onClick={() => setSelectedTab("desktop")}
              >
                Desktop
              </button>
              <button
                className={`px-2 sm:px-4 py-2 text-sm ${
                  selectedTab === "tablet" ? "bg-gray-100" : "bg-white"
                }`}
                onClick={() => setSelectedTab("tablet")}
              >
                Tablet
              </button>
              <button
                className={`px-2 sm:px-4 py-2 text-sm ${
                  selectedTab === "mobile" ? "bg-gray-100" : "bg-white"
                }`}
                onClick={() => setSelectedTab("mobile")}
              >
                Mobile
              </button>
            </div>
          </div>
          {/* go to dashboard on saving  */}
          <Button
            className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Save Changes
          </Button>
        </div>

        {/* Content preview area */}
        <div className="flex-1 p-4 bg-gray-100">
          {/* Preview content would go here */}
          <div className="bg-white rounded-md shadow-sm p-4 h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="mb-2">Preview Area</div>
              <div className="text-sm">
                {/* {detailedSection
                  ? `Editing ${detailedSection.title}`: " */}
                Customize your template
                {/* "} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
