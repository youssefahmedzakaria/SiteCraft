"use client";

import React, { useState } from "react";
import { Input } from "@/components/SiteCraft/ui/input";
import { CardTitle } from "@/components/SiteCraft/ui/card";
import { Switch } from "@/components/SiteCraft/ui/switch";

interface DiscountSettings {
  discountType?: string;
  discountValue?: number;
  minCap?: number;
  percentageMax?: number;
  maxCap?: number;
}

interface PricingSectionProps {
  formData: DiscountSettings;
  updateFormData: (updates: Partial<DiscountSettings>) => void;
}

export function PricingSection({ formData, updateFormData }: PricingSectionProps) {
  const [discountEnabled, setDiscountEnabled] = useState(false);

  // Handle form field changes
  const handleDiscountTypeChange = (type: string) => {
    updateFormData({ discountType: type });
  };

  const handleDiscountValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ discountValue: parseFloat(e.target.value) || 0 });
  };

  const handleMinCapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ minCap: parseFloat(e.target.value) || 0 });
  };

  const handlePercentageMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ percentageMax: parseFloat(e.target.value) || 0 });
  };

  const handleMaxCapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ maxCap: parseFloat(e.target.value) || 0 });
  };

  const toggleDiscount = (enabled: boolean) => {
    setDiscountEnabled(enabled);
    if (!enabled) {
      updateFormData({ 
        discountType: undefined, 
        discountValue: undefined,
        minCap: undefined,
        percentageMax: undefined,
        maxCap: undefined
      });
    } else {
      updateFormData({ discountType: "percentage" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <CardTitle className="font-bold">Discount Settings</CardTitle>
        <p className="text-gray-500">
          Set discount options for your product (pricing is handled per variant)
        </p>
      </div>

      {/* Toggle Discount */}
      <div className="flex items-center gap-4">
        <Switch
          id="enableDiscount"
          checked={discountEnabled}
          onCheckedChange={toggleDiscount}
          className="data-[state=checked]:bg-logo-dark-button"
        />
        <label
          htmlFor="enableDiscount"
          className="text-sm font-medium text-gray-700"
        >
          Enable Discount
        </label>
      </div>

      {/* Product Discount */}
      {discountEnabled && (
        <div className="space-y-4">
          {/* Discount Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Discount Type
            </label>
            <div className="flex gap-10">
              <label className="flex gap-2">
                <input
                  type="radio"
                  value="percentage"
                  checked={formData.discountType === "percentage"}
                  onChange={(e) => handleDiscountTypeChange(e.target.value)}
                />
                Percentage
              </label>
              <label className="flex gap-2">
                <input
                  type="radio"
                  value="fixed"
                  checked={formData.discountType === "fixed"}
                  onChange={(e) => handleDiscountTypeChange(e.target.value)}
                />
                Fixed Amount
              </label>
            </div>
          </div>

          {/* Discount Value */}
          <div className="space-y-2">
            <label
              htmlFor="discountValue"
              className="block text-sm font-medium text-gray-700"
            >
              Discount Value <span className="text-red-500">*</span>
            </label>
            <Input
              id="discountValue"
              name="discountValue"
              type="number"
              value={formData.discountValue || ''}
              onChange={handleDiscountValueChange}
              placeholder={formData.discountType === "percentage" ? "e.g. 10" : "e.g. 100"}
              className="w-full"
              required
            />
          </div>

          {/* Discount Limits */}
          {formData.discountType === "percentage" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="minCap"
                  className="block text-sm font-medium text-gray-700"
                >
                  Minimum Cap (EGP)
                </label>
                <Input
                  id="minCap"
                  name="minCap"
                  type="number"
                  value={formData.minCap || ''}
                  onChange={handleMinCapChange}
                  placeholder="e.g. 50"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="percentageMax"
                  className="block text-sm font-medium text-gray-700"
                >
                  Max Percentage (%)
                </label>
                <Input
                  id="percentageMax"
                  name="percentageMax"
                  type="number"
                  value={formData.percentageMax || ''}
                  onChange={handlePercentageMaxChange}
                  placeholder="e.g. 50"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="maxCap"
                  className="block text-sm font-medium text-gray-700"
                >
                  Maximum Cap (EGP)
                </label>
                <Input
                  id="maxCap"
                  name="maxCap"
                  type="number"
                  value={formData.maxCap || ''}
                  onChange={handleMaxCapChange}
                  placeholder="e.g. 200"
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
