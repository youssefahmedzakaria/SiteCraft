"use client";

import React, { useState, useRef } from "react";
import { Input } from "@/components/SiteCraft/ui/input";
import { CardTitle } from "@/components/SiteCraft/ui/card";

export function LowStockSection() {
  {
    /* For low stock */
  }
  const [lowStockOption, setLowStockOption] = useState<string | null>(
    "Number of Items"
  );

  {
    /* For low stock */
  }
  const handleLowStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === lowStockOption) {
      setLowStockOption(null);
    } else {
      setLowStockOption(event.target.value);
    }
  };

  {
    /* Low Stock Settings Section */
  }
  return (
    <div className="space-y-4">
      <div className="mb-2">
        <CardTitle className="font-bold">Low Stock Settings</CardTitle>
        <p className="text-gray-500">
          Enter the details for stock level availabile in your inventory you
          want to be noified at
        </p>
      </div>

      {/* Settings type and value */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {/* Settings Type */}
        <div className="flex-1 space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Settings Type
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

        {/* Settings Value */}
        <div className="flex-1 space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            {lowStockOption === "Percentage"
              ? "Percentage Value"
              : "Minimum Inventory Capacity"}
            <span className="text-red-500">*</span>
          </label>
          <Input
            id="settingsValue"
            name="settingsValue"
            placeholder="e.g. 10"
            className="w-full"
            required
          />
        </div>
      </div>

      {/* Maximum inventory capacity */}
      {lowStockOption === "Percentage" && (
        <div className="flex-1 space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Maximum Inventory Capacity <span className="text-red-500">*</span>
          </label>
          <Input
            id="maxCapacity"
            name="maxCapacity"
            placeholder="e.g. 90"
            className="w-full"
            required
          />
        </div>
      )}
    </div>
  );
}
