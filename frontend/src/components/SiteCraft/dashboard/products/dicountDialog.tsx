"use client";

import { useState } from "react";
import { Button } from "@/components/SiteCraft/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/SiteCraft/ui/dialog";
import { Input } from "@/components/SiteCraft/ui/input";

export function ApplyDiscountDialog({ products, open, onOpenChange, onApply }: { products: number[], open: boolean, onOpenChange: (open: boolean) => void, onApply: (discountType: string, discountValue: number) => void }) {
  const [discountOption, setDiscountOption] = useState<string | null>(null);
  const [discountValue, setDiscountValue] = useState(0);

  const handleApply = () => {
    if (!discountOption || !discountValue) return;
    let floatValue = parseFloat(discountValue as any);
    if (Number.isInteger(floatValue)) {
      floatValue = parseFloat(floatValue.toFixed(1));
    }
    onApply(discountOption, floatValue);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === discountOption) {
      setDiscountOption(null);
    } else {
      setDiscountOption(event.target.value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply Discount</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col justify-between gap-4 pt-2">
          {/* Discount Type */}
          <div className="flex-1 space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Discount Type
            </label>
            <div className="flex gap-10">
              <label className="flex gap-2">
                <input
                  type="radio"
                  value="Percentage"
                  checked={discountOption === "Percentage"}
                  onChange={handleDiscountChange}
                />
                Percentage
              </label>
              <label className="flex gap-2">
                <input
                  type="radio"
                  value="Amount"
                  checked={discountOption === "Amount"}
                  onChange={handleDiscountChange}
                />
                Amount
              </label>
            </div>
          </div>

          {/* Discount Value */}
          <div className="flex-1 space-y-2">
            <label
              htmlFor="discountValue"
              className="block text-sm font-medium text-gray-700"
            >
              Discount Value <span className="text-red-500">*</span>
            </label>
            <Input
              id="discountValue"
              name="discountValue"
              placeholder="e.g. 10, 100"
              className="w-full"
              required
              type="number"
              value={discountValue}
              onChange={e => setDiscountValue(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter className="flex sm:justify-between gap-3">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleApply}>
            Apply Discount
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
