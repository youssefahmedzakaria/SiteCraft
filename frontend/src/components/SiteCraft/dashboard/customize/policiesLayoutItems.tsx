"use client";
import React, { useState } from "react";
import { Dot } from "lucide-react";

interface PoliciesLayoutItemsProps {
  selectedLayout: number;
  onLayoutSelect: (layoutId: number) => void;
}

export function PoliciesLayoutItems({
  selectedLayout,
  onLayoutSelect,
}: PoliciesLayoutItemsProps) {
  return (
    <div>
      <h3 className="font-medium mb-2">Layout</h3>
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((layoutId) => (
          <button
            key={layoutId}
            className={`aspect-square px-1 py-3 rounded border border-gray-200 hover:border-gray-900 transition-colors shadow flex items-center justify-center ${
              layoutId === selectedLayout
                ? "bg-gray-800 border-gray-500"
                : "bg-white"
            }`}
            onClick={() => onLayoutSelect(layoutId)}
          >
            {layoutId === 1 && (
              <div className="w-12 h-6 flex flex-col items-center justify-center space-y-0.5">
                <div className="w-5 h-1 bg-gray-300" />
                <div className="w-full h-5 flex flex-col space-y-0.5 items-center justify-center">
                  <div className="w-2 h-0.5 bg-gray-300" />
                  <div className="w-4 h-0.5 bg-gray-300" />
                  <div className="w-2 h-0.5 bg-gray-300" />
                  <div className="w-4 h-0.5 bg-gray-300" />
                </div>
              </div>
            )}
            {layoutId === 2 && (
              <div className="w-12 h-6 px-1 flex flex-col justify-center space-y-0.5">
                <div className="w-5 h-1 bg-gray-300" />
                <div className="w-full h-5 pl-0.5 space-y-0.5">
                  <div className="w-2 h-0.5 bg-gray-300" />
                  <div className="w-4 h-0.5 bg-gray-300" />
                  <div className="w-2 h-0.5 bg-gray-300" />
                  <div className="w-4 h-0.5 bg-gray-300" />
                </div>
              </div>
            )}
            {layoutId === 3 && (
              <div className="w-12 h-6 flex flex-col items-center justify-center space-y-0.5">
                <div className="w-full h-1 pl-1">
                  <div className="w-5 h-1 bg-gray-300" />
                </div>
                <div className="w-2 h-0.5 bg-gray-300" />
                <div className="w-4 h-0.5 bg-gray-300" />
                <div className="w-2 h-0.5 bg-gray-300" />
                <div className="w-4 h-0.5 bg-gray-300" />
              </div>
            )}
            {layoutId === 4 && (
              <div className="w-12 h-6 flex flex-col items-center justify-center space-y-0.5">
                <div className="w-5 h-1 bg-gray-300" />
                <div className="w-full h-5 pl-1 space-y-0.5">
                  <div className="w-2 h-0.5 bg-gray-300" />
                  <div className="w-4 h-0.5 bg-gray-300" />
                  <div className="w-2 h-0.5 bg-gray-300" />
                  <div className="w-4 h-0.5 bg-gray-300" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
