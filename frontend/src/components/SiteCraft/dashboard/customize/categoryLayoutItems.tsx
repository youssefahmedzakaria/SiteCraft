"use client";
import React from "react";

interface CategoryLayoutItemsProps {
  selectedLayout: number;
  onLayoutSelect: (layoutId: number) => void;
  itemCount: number;
}

export function CategoryLayoutItems({
  selectedLayout,
  onLayoutSelect,
  itemCount,
}: CategoryLayoutItemsProps) {
  // Define available layouts based on item count
  const availableLayouts = itemCount >= 3 
    ? [1, 2, 3] // Grid, Featured Grid, Horizontal Scroll
    : [1, 3];   // Grid, Horizontal Scroll (hide Featured Grid)

  // Map layout IDs to names
  const getLayoutName = (layoutId: number) => {
    switch (layoutId) {
      case 1: return "Grid";
      case 2: return "Featured Grid";
      case 3: return "Horizontal Scroll";
      default: return "Grid";
    }
  };

  return (
    <div>
      <h3 className="font-medium mb-2">Category Layout</h3>
      <div className="grid grid-cols-4 gap-2">
        {availableLayouts.map((layoutId) => (
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
              {getLayoutName(layoutId)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
