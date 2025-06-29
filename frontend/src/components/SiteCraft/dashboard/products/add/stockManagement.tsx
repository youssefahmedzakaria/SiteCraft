"use client";

import { Input } from "@/components/SiteCraft/ui/input";
import type { ProductVariantDTO } from "@/lib/products";

export function StockManagementSection({
  variants,
  setVariants,
}: {
  variants: ProductVariantDTO[];
  setVariants: React.Dispatch<React.SetStateAction<ProductVariantDTO[]>>;
}) {
  if (!variants || variants.length === 0) {
    return null;
  }

  // Helper to get display name for variant
  function getVariantDisplayName(variant: ProductVariantDTO) {
    if (!variant.attributes || variant.attributes.length === 0) return "Default";
    return variant.attributes.map(attr => attr.value).join(" - ");
  }

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <span className="block text-xl font-bold">Handle Stock Levels</span>
        <span className="block text-gray-500 text-sm">Management of stock levels of different options and variation.</span>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {variants.map((variant, index) => (
            <div key={index} className="flex flex-col">
              <label className="font-medium mb-1">
                {getVariantDisplayName(variant)} <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="e.g. 10"
                required
                value={variant.stock ?? ''}
                onChange={e => {
                  const newVariants = [...variants];
                  newVariants[index].stock = Number(e.target.value);
                  setVariants(newVariants);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
