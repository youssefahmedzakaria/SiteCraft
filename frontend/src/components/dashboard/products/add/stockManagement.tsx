"use client";

import { Input } from "@/components/ui/input";

export function StockManagementSection() {
  const colors = ["Red", "Green", "Blue"];
  const sizes = ["Small", "Medium", "Large"];

  return (
    <div className="space-y-6">
      {colors.length > 0 && sizes.length > 0
        ? colors.map((color) => (
            <div
              key={color}
              className="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
            >
              {sizes.map((size) => (
                <div key={size} className="flex-1 space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {color} - {size} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. 10"
                    className="w-full"
                    required
                  />
                </div>
              ))}
            </div>
          ))
        : colors.length > 0
        ? colors.map((color) => (
            <div
              key={color}
              className="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
            >
              <div className="flex-1 space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  {color} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. 10"
                  className="w-full"
                  required
                />
              </div>
            </div>
          ))
        : sizes.map((size) => (
            <div
              key={size}
              className="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
            >
              <div className="flex-1 space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  {size} <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. 10"
                  className="w-full"
                  required
                />
              </div>
            </div>
          ))}
    </div>
  );
}
