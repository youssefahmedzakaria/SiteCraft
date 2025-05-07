"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/customize/sidebar";


export default function CustomizeTemplatePage() {
  const [selectedTab, setSelectedTab] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar></Sidebar>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-3 flex flex-col sm:flex-row justify-between items-center h-16">
          <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
            <Button variant="outline" className="bg-white">
              <span className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Preview
              </span>
            </Button>
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
          <Button className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto" onClick ={()=>{ window.location.href="/dashboard/customers";}}>
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
