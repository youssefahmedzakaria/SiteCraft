"use client";

import React, { useState } from "react";
import { Input } from "@/components/SiteCraft/ui/input";
import { CardTitle } from "@/components/SiteCraft/ui/card";
import { Switch } from "@/components/SiteCraft/ui/switch";
import type { ProductVariantDTO } from "@/lib/products";

interface DiscountSettings {
  discountType?: string;
  discountValue?: number;
  minCap?: number;
  percentageMax?: number;
  maxCap?: number;
}

interface PricingSectionProps {
  price: number;
  setPrice: (v: number) => void;
  productionCost: number;
  setProductionCost: (v: number) => void;
}

export function PricingSection({ price, setPrice, productionCost, setProductionCost }: PricingSectionProps) {
  const [discountEnabled, setDiscountEnabled] = useState(false);

  // Handle form field changes
  const handleDiscountTypeChange = (type: string) => {
  };

  const handleDiscountValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  };

  const handleMinCapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  };

  const handlePercentageMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  };

  const handleMaxCapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  };

  const toggleDiscount = (enabled: boolean) => {
    setDiscountEnabled(enabled);
  };

  return (
    <div className="space-y-6">
      {/* Pricing Fields */}
      <div className="mb-2">
        <CardTitle className="font-bold">Pricing</CardTitle>
        <p className="text-gray-500">
          Enter the details for stock level available
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price <span className="text-red-500">*</span>
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            placeholder="e.g. 250"
            className="w-full"
            required
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="productionCost" className="block text-sm font-medium text-gray-700">
            Production Cost <span className="text-red-500">*</span>
          </label>
          <Input
            id="productionCost"
            name="productionCost"
            type="number"
            placeholder="e.g. 125"
            className="w-full"
            required
            value={productionCost}
            onChange={e => setProductionCost(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Discount Settings */}
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
          <div className="flex flex-col md:flex-row gap-6 w-full">
            {/* Discount Type */}
            <div className="flex-1 min-w-[220px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Type
              </label>
              <div className="flex gap-8 items-center h-10">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="percentage"
                    checked={false}
                    onChange={(e) => handleDiscountTypeChange(e.target.value)}
                  />
                  Percentage
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="fixed"
                    checked={false}
                    onChange={(e) => handleDiscountTypeChange(e.target.value)}
                  />
                  Amount
                </label>
              </div>
            </div>
            {/* Discount Value */}
            <div className="flex-1 min-w-[220px]">
              <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 mb-1">
                Discount Value <span className="text-red-500">*</span>
              </label>
              <Input
                id="discountValue"
                name="discountValue"
                type="number"
                value={0}
                onChange={handleDiscountValueChange}
                placeholder="e.g. 10, 100"
                className="w-full"
                required
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
