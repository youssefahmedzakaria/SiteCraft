"use client";

import React from "react";
import { CardTitle } from "@/components/SiteCraft/ui/card";
import { Input } from "@/components/SiteCraft/ui/input";

interface LowStockSectionProps {
  formData: any;
  updateFormData: (updates: any) => void;
}

export function LowStockSection({ formData, updateFormData }: LowStockSectionProps) {
  return (
    <div className="space-y-4">
      <div className="mb-2">
        <CardTitle className="font-bold">Low Stock Settings</CardTitle>
        <p className="text-gray-500">
          Enter the details for stock level available in your inventory you want to be notified at
        </p>
      </div>
      {/* Settings Type and Conditional Inputs on the same row */}
      <div className="flex flex-col md:flex-row md:items-end gap-6 w-full">
        {/* Settings Type */}
        <div className="flex-1 min-w-[220px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Settings Type
          </label>
          <div className="flex gap-6 items-center h-10">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="settingsType"
                value="number"
                checked={formData.settingsType === "number"}
                onChange={() => updateFormData({ settingsType: "number" })}
              />
              Number of Items
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="settingsType"
                value="percentage"
                checked={formData.settingsType === "percentage"}
                onChange={() => updateFormData({ settingsType: "percentage" })}
              />
              Percentage
            </label>
          </div>
        </div>
        {/* Conditional Inputs */}
        {formData.settingsType === "number" && (
          <div className="flex-1 min-w-[220px]">
            <label htmlFor="minInventory" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Inventory Capacity <span className="text-red-500">*</span>
            </label>
            <Input
              id="minInventory"
              name="minInventory"
              type="number"
              placeholder="e.g. 10"
              className="w-full"
              value={formData.minInventory || ''}
              onChange={e => updateFormData({ minInventory: e.target.value })}
              required
            />
          </div>
        )}
        {formData.settingsType === "percentage" && (
          <div className="flex-1 min-w-[220px]">
            <label htmlFor="percentageValue" className="block text-sm font-medium text-gray-700 mb-1">
              Percentage Value <span className="text-red-500">*</span>
            </label>
            <Input
              id="percentageValue"
              name="percentageValue"
              type="number"
              placeholder="e.g. 10"
              className="w-full"
              value={formData.percentageValue || ''}
              onChange={e => updateFormData({ percentageValue: e.target.value })}
              required
            />
          </div>
        )}
      </div>
      {/* Maximum Inventory Capacity for percentage type */}
      {formData.settingsType === "percentage" && (
        <div className="space-y-2 w-full">
          <label htmlFor="maxInventory" className="block text-sm font-medium text-gray-700">
            Maximum Inventory Capacity <span className="text-red-500">*</span>
          </label>
          <Input
            id="maxInventory"
            name="maxInventory"
            type="number"
            placeholder="e.g. 90"
            className="w-full"
            value={formData.maxInventory || ''}
            onChange={e => updateFormData({ maxInventory: e.target.value })}
            required
          />
        </div>
      )}
    </div>
  );
}
