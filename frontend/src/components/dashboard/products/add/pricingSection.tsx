"use client";

import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function PricingSection() {
    {/* For discount */}
    const [discountOption, setDiscountOption] = useState<string | null>(null);
    const [discountEnabled, setDiscountEnabled] = useState(false);

    {/* For discount */}
    const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.value === discountOption){
            setDiscountOption(null);
        }else{
            setDiscountOption(event.target.value);
        }
    };

    {/* Pricing Section */}
    return (
        <div className="space-y-4">
            <div className="mb-2">
                <CardTitle className="font-bold">Pricing</CardTitle>
                <p className="text-gray-500">Enter the details for stock level availabile </p>
            </div>
            
            {/* Product Price and Production Cost */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                {/* Product Price */}
                <div className="flex-1 space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Price <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="price"
                        name="price"
                        placeholder="e.g. 250"
                        className="w-full"
                        required
                    />
                </div>
                {/* Product Production Cost */}
                <div className="flex-1 space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Production Cost <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="productionCost"
                        name="productionCost"
                        placeholder="e.g. 125"
                        className="w-full"
                        required
                    />
                </div>
            </div>

            {/* Toggle Discount */}
            <div className="flex items-center gap-4">
                <Switch
                    id="enableDiscount"
                    checked={discountEnabled}
                    onCheckedChange={(value) => {
                        setDiscountEnabled(!discountEnabled);
                        if(value) {
                            setDiscountOption("Percentage");
                        } else {
                            setDiscountOption(null);
                        }
                    }}
                    className="data-[state=checked]:bg-logo-dark-button"
                />
                <label htmlFor="enableDiscount" className="text-sm font-medium text-gray-700">
                    Enable Discount
                </label>
            </div>

            {/* Product Discount */}
            {discountEnabled && (
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    {/* Discount Type */}
                    <div className="flex-1 space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Discount Type
                        </label>
                        <div className="flex gap-10">
                            <label className="flex gap-2">
                                <input
                                    type="radio"
                                    value="Percentage"
                                    checked={discountOption === 'Percentage'}
                                    onChange={handleDiscountChange}
                                />
                                Percentage
                            </label>
                            <label className="flex gap-2">
                                <input
                                type="radio"
                                value="Amount"
                                checked={discountOption === 'Amount'}
                                onChange={handleDiscountChange}
                            />
                                Amount
                            </label>
                        </div>
                    </div>

                    {/* Discount Value */}
                    <div className="flex-1 space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Discount Value <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="discountValue"
                            name="discountValue"
                            placeholder="e.g. 10, 100"
                            className="w-full"
                            required
                        />
                    </div>
                </div>
            )}
            
        </div>
    )
  }