"use client";

import { Input } from "@/components/SiteCraft/ui/input";

export interface VariantAttributeDTO {
  name: string;
  value: string;
}

export interface ProductVariantDTO {
  sku?: string;
  stock?: number;
  price?: number;
  productionCost?: number;
  attributes?: VariantAttributeDTO[];
}

export function StockManagementSection({ variants }: { variants: ProductVariantDTO[] }) {
  if (!variants || variants.length === 0) {
    return null;
  }

  // Helper to parse SKU for display
  function getVariantDisplayName(variant: ProductVariantDTO) {
    const attrs = variant.attributes;
    const isDefault =
      !attrs ||
      attrs.length === 0 ||
      (attrs.length === 1 &&
        (attrs[0].name === "Default" || !attrs[0].name) &&
        (attrs[0].value === "Default" || !attrs[0].value));
    if (isDefault) {
      // Parse the SKU and use the last part after the last '|'
      if (variant.sku && variant.sku.includes("|")) {
        const parts = variant.sku.split("|");
        return parts[parts.length - 1];
      }
      return variant.sku || "-";
    } else {
      return attrs?.map(attr => `${attr.name}: ${attr.value}`).join(', ');
    }
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Variant</th>
              <th className="px-4 py-2 border-b">SKU</th>
              <th className="px-4 py-2 border-b">Stock</th>
              <th className="px-4 py-2 border-b">Price</th>
              <th className="px-4 py-2 border-b">Production Cost</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant, index) => (
              <tr key={index} className="text-center">
                <td className="px-4 py-2 border-b">{getVariantDisplayName(variant)}</td>
                <td className="px-4 py-2 border-b">{variant.sku}</td>
                <td className="px-4 py-2 border-b">{variant.stock}</td>
                <td className="px-4 py-2 border-b">{variant.price}</td>
                <td className="px-4 py-2 border-b">{variant.productionCost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
