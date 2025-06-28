"use client";

import React from "react";
import { CardTitle } from "@/components/SiteCraft/ui/card";
import { Info } from "lucide-react";

interface LowStockSectionProps {
  formData: any; // Not used in this simplified version
  updateFormData: (updates: any) => void; // Not used in this simplified version
}

export function LowStockSection({ formData, updateFormData }: LowStockSectionProps) {
  return (
    <div className="space-y-4">
      <div className="mb-2">
        <CardTitle className="font-bold">Stock Management</CardTitle>
        <p className="text-gray-500">
          Stock levels are managed per variant in the Options and Variations tab
        </p>
      </div>

      {/* Information about stock management */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Stock Management Information</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Stock levels are set individually for each product variant</li>
              <li>Navigate to the "Product's Options and Variations" tab to set stock levels</li>
              <li>Each variant can have different stock quantities</li>
              <li>Low stock notifications will be based on individual variant stock levels</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
