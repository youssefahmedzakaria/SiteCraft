"use client";

import React from "react";
import { CardTitle } from "@/components/SiteCraft/ui/card";
import { Input } from "@/components/SiteCraft/ui/input";
import { Switch } from "@/components/SiteCraft/ui/switch";
import { Label } from "@/components/SiteCraft/ui/label";

interface LowStockSectionProps {
  formData: {
    lowStockType?: string;
    lowStockThreshold?: number;
    lowStockEnabled: boolean;
  };
  updateFormData: (updates: any) => void;
}

export function LowStockSection({ formData, updateFormData }: LowStockSectionProps) {
  return (
    <div className="space-y-4">
      <div className="mb-2">
        <CardTitle className="font-bold">Low Stock Notification Settings</CardTitle>
        <p className="text-gray-500">
          Set up notifications for when your product stock reaches low levels
        </p>
      </div>
      
      {/* Enable/Disable Switch */}
      <div className="flex items-center space-x-2">
        <Switch
          id="lowStockEnabled"
          checked={formData.lowStockEnabled}
          onCheckedChange={(checked) => updateFormData({ lowStockEnabled: checked })}
        />
        <Label htmlFor="lowStockEnabled">Enable low stock notifications</Label>
      </div>

      {formData.lowStockEnabled && (
        <>
          {/* Notification Type Selection */}
          <div className="flex flex-col md:flex-row md:items-end gap-6 w-full">
            <div className="flex-1 min-w-[220px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notification Type
              </label>
              <div className="flex gap-6 items-center h-10">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="lowStockType"
                    value="number"
                    checked={formData.lowStockType === "number"}
                    onChange={() => updateFormData({ lowStockType: "number" })}
                  />
                  Number of Items
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="lowStockType"
                    value="percentage"
                    checked={formData.lowStockType === "percentage"}
                    onChange={() => updateFormData({ lowStockType: "percentage" })}
                  />
                  Percentage
                </label>
              </div>
            </div>

            {/* Threshold Input */}
            {formData.lowStockType && (
              <div className="flex-1 min-w-[220px]">
                <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.lowStockType === "number" ? "Minimum Stock Level" : "Low Stock Percentage"} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="lowStockThreshold"
                  name="lowStockThreshold"
                  type="number"
                  placeholder={formData.lowStockType === "number" ? "e.g. 10" : "e.g. 20"}
                  className="w-full"
                  value={formData.lowStockThreshold || ''}
                  onChange={e => updateFormData({ lowStockThreshold: Number(e.target.value) })}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.lowStockType === "number" 
                    ? "Get notified when stock falls below this number" 
                    : "Get notified when stock falls below this percentage of total capacity"
                  }
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
