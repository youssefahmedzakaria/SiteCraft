/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { cn } from "@/lib/utils";
import type { ThemeConfig } from "@/app/e-commerce/[subdomain]/product/[id]/product";
import type { VariantGroup, VariantOption } from "@/app/e-commerce/[subdomain]/product/[id]/product";
import Image from "next/image";

interface ProductVariantsProps {
  variantGroups: VariantGroup[];
  selectedVariants: Record<string, string>; // groupId -> optionId
  onVariantChange: (
    groupId: string,
    optionId: string,
    productImages?: string[]
  ) => void;
  theme: ThemeConfig;
  className?: string;
}

export function ProductVariants({
  variantGroups,
  selectedVariants,
  onVariantChange,
  theme,
  className,
}: ProductVariantsProps) {
  const handleVariantChange = (groupId: string, optionId: string) => {
    const group = variantGroups.find((g) => g.id === groupId);
    const option = group?.options.find((o: VariantOption) => o.id === optionId);

    // If this variant changes images, pass them to the parent
    const productImages = option?.productImages;
    onVariantChange(groupId, optionId, productImages);
  };

  const renderColorVariant = (group: VariantGroup) => (
    <div className="flex flex-wrap gap-3">
      {group.options.map((option: VariantOption) => {
        const isSelected = selectedVariants[group.id] === option.id;

        return (
          <button
            key={option.id}
            onClick={() => handleVariantChange(group.id, option.id)}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center border-2 group relative transition-all",
              isSelected
                ? "border-current ring-2 ring-offset-2 ring-current/20"
                : "border-gray-200 hover:border-gray-300"
            )}
            title={option.label}
          >
            {option.colorCode ? (
              <span
                className="w-10 h-10 rounded-full border border-gray-100"
                style={{ backgroundColor: option.colorCode }}
              />
            ) : option.imageUrl ? (
              <Image
                src={option.imageUrl || "/placeholder.png"}
                alt={option.label}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium">{option.value}</span>
            )}

            {isSelected && (
              <div className="absolute inset-0 rounded-full border-2 border-white shadow-sm" />
            )}
          </button>
        );
      })}
    </div>
  );

  const renderButtonVariant = (group: VariantGroup) => (
    <div className="flex flex-wrap gap-2">
      {group.options.map((option: VariantOption) => {
        const isSelected = selectedVariants[group.id] === option.id;

        return (
          <button
            key={option.id}
            onClick={() => handleVariantChange(group.id, option.id)}
            className={cn(
              "px-4 py-2 border text-sm font-medium group relative transition-all",
              theme.borderRadius,
              isSelected
                ? "border-current bg-current/10 text-current"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            {option.label}
            {option.metadata?.priceAdjustment &&
              option.metadata.priceAdjustment !== 0 && (
                <span className="ml-1 text-xs opacity-75">
                  {option.metadata.priceAdjustment > 0 ? "+" : ""}$
                  {option.metadata.priceAdjustment}
                </span>
              )}
          </button>
        );
      })}
    </div>
  );

  const renderImageGridVariant = (group: VariantGroup) => (
    <div className="grid grid-cols-4 gap-3">
      {group.options.map((option: VariantOption) => {
        const isSelected = selectedVariants[group.id] === option.id;

        return (
          <button
            key={option.id}
            onClick={() => handleVariantChange(group.id, option.id)}
            className={cn(
              "aspect-square border-2 group relative transition-all overflow-hidden",
              theme.borderRadius,
              isSelected
                ? "border-current ring-2 ring-offset-2 ring-current/20"
                : "border-gray-200 hover:border-gray-300"
            )}
            title={option.label}
          >
            {option.imageUrl ? (
              <Image
                src={option.imageUrl || "/placeholder.png"}
                alt={option.label}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <span className="text-xs font-medium text-center px-1">
                  {option.label}
                </span>
              </div>
            )}

            {isSelected && (
              <div className="absolute inset-0 bg-current/10 flex items-center justify-center">
                <div className="w-6 h-6 bg-current rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  const renderDropdownVariant = (group: VariantGroup) => {
    const selectedOption = group.options.find(
      (o: VariantOption) => o.id === selectedVariants[group.id]
    );

    return (
      <select
        value={selectedVariants[group.id] || ""}
        onChange={(e) => handleVariantChange(group.id, e.target.value)}
        className={cn(
          "w-full px-3 py-2 border border-gray-200 bg-white text-sm",
          theme.borderRadius,
          "focus:outline-none focus:ring-2 focus:ring-current/20 focus:border-current"
        )}
      >
        <option value="">Select {group.name}</option>
        {group.options.map((option: VariantOption) => (
          <option key={option.id} value={option.id}>
            {option.label}
            {option.metadata?.priceAdjustment &&
              option.metadata.priceAdjustment !== 0 &&
              ` (+$${option.metadata.priceAdjustment})`}
          </option>
        ))}
      </select>
    );
  };

  const renderVariantGroup = (group: VariantGroup) => {
    const displayStyle =
      group.displayStyle ||
      (group.type === "color" ? "color-circles" : "buttons");

    switch (displayStyle) {
      case "color-circles":
        return renderColorVariant(group);
      case "dropdown":
        return renderDropdownVariant(group);
      case "image-grid":
        return renderImageGridVariant(group);
      default:
        return renderButtonVariant(group);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {variantGroups.map((group) => {
        const selectedOption = group.options.find(
          (o: VariantOption) => o.id === selectedVariants[group.id]
        );

        return (
          <div key={group.id}>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium">
                {group.name}
                {group.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>

            {renderVariantGroup(group)}

            {selectedOption && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Selected: {selectedOption.label}</p>
                {selectedOption.metadata && (
                  <div className="text-xs text-gray-500 mt-1">
                    {Object.entries(selectedOption.metadata).map(
                      ([key, value]) => (
                        <span key={key} className="mr-3">
                          {key}: {String(value)}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
