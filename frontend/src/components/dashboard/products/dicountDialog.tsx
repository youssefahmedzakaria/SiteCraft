"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function ApplyDiscountDialog({ products }: { products: string[] }) {
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    products.forEach((product) => {
      console.log(`Applying discount to ${product}`);
    });
    setOpen(false);
  };

  const handleCancel = () => {
    // Close the dialog
    setOpen(false);
  };

  const [discountOption, setDiscountOption] = useState<string | null>(null);

  {
    /* For discount */
  }
  const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === discountOption) {
      setDiscountOption(null);
    } else {
      setDiscountOption(event.target.value);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover hover:text-white"
        onClick={() => setOpen(true)}
      >
        <span>Apply Discount</span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
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
                htmlFor="name"
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
    </>
  );
}
