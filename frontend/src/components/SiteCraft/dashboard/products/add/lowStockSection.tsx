"use client";

import React, { useState } from "react";
import { Input } from "@/components/SiteCraft/ui/input";
import { CardTitle } from "@/components/SiteCraft/ui/card";
import { ProductCreateDTO } from "@/lib/products";

interface LowStockSectionProps {
  formData: ProductCreateDTO;
  updateFormData: (updates: Partial<ProductCreateDTO>) => void;
}

export function LowStockSection({ formData, updateFormData }: LowStockSectionProps) {
  const [lowStockOption, setLowStockOption] = useState<string>("Number of Items");

  // Handle form field changes
  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ stock: parseInt(e.target.value) || 0 });
  };

  const handleLowStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLowStockOption(event.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <CardTitle className="font-bold">Stock Management</CardTitle>
        <p className="text-gray-500">
          Set the initial stock level and low stock notification settings
        </p>
      </div>

      {/* Initial Stock */}
      <div className="space-y-2">
        <label
          htmlFor="stock"
          className="block text-sm font-medium text-gray-700"
        >
          Initial Stock <span className="text-red-500">*</span>
        </label>
        <Input
          id="stock"
          name="stock"
          type="number"
          value={formData.stock || ''}
          onChange={handleStockChange}
          placeholder="e.g. 100"
          className="w-full"
          required
        />
      </div>

      {/* Low Stock Settings */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Low Stock Notification Type
          </label>
          <div className="flex gap-10">
            <label className="flex gap-2">
              <input
                type="radio"
                value="Number of Items"
                checked={lowStockOption === "Number of Items"}
                onChange={handleLowStockChange}
              />
              Number of Items
            </label>
            <label className="flex gap-2">
              <input
                type="radio"
                value="Percentage"
                checked={lowStockOption === "Percentage"}
                onChange={handleLowStockChange}
              />
              Percentage
            </label>
          </div>
        </div>

        {/* Low Stock Value */}
        <div className="space-y-2">
          <label
            htmlFor="lowStockValue"
            className="block text-sm font-medium text-gray-700"
          >
            {lowStockOption === "Percentage"
              ? "Low Stock Percentage"
              : "Low Stock Threshold"}
          </label>
          <Input
            id="lowStockValue"
            name="lowStockValue"
            type="number"
            placeholder={lowStockOption === "Percentage" ? "e.g. 10" : "e.g. 5"}
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            {lowStockOption === "Percentage" 
              ? "You'll be notified when stock falls below this percentage"
              : "You'll be notified when stock falls below this number of items"
            }
          </p>
        </div>
      </div>
    </div>
  );
}
