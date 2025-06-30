"use client";
import React from "react";

interface CategoryLayoutItemsProps {
  selectedLayout: number;
  onLayoutSelect: (layoutId: number) => void;
}

export function CategoryLayoutItems({
  selectedLayout,
  onLayoutSelect,
}: CategoryLayoutItemsProps) {
  return (
    <div>
      <h3 className="font-medium mb-2">Category Layout</h3>
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((layoutId) => (
          <button
            key={layoutId}
            className={`aspect-square px-2 py-3 rounded border border-gray-200 hover:border-gray-900 transition-colors shadow flex items-center justify-center ${
              layoutId === selectedLayout
                ? "bg-gray-800 border-gray-500"
                : "bg-white"
            }`}
            onClick={() => onLayoutSelect(layoutId)}
          >
            {/* You can add icons or visual representations for each layout here */}
            <span className="text-xs font-semibold">
              {layoutId === 1 && "Grid"}
              {layoutId === 2 && "List"}
              {layoutId === 3 && "Featured Grid"}
              {layoutId === 4 && "Horizontal Scroll"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
