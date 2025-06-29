"use client";
import React, { useState } from "react";

interface AboutLayoutItemsProps {
  selectedLayout: number;
  onLayoutSelect: (layoutId: number) => void;
}

export function AboutLayoutItems({
  selectedLayout,
  onLayoutSelect,
}: AboutLayoutItemsProps) {
  {
    /* For layout selection in design */
  }
  return (
    <div>
      <h3 className="font-medium mb-2">Layout</h3>
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((layoutId) => (
          <button
            key={layoutId}
            className={`flex flex-col items-center justify-center aspect-square p-2 rounded border border-gray-200 hover:border-gray-900 transition-colors shadow ${
              layoutId === selectedLayout
                ? "bg-gray-800 border-gray-500"
                : "bg-white"
            }`}
            onClick={() => onLayoutSelect(layoutId)}
          >
            {layoutId === 1 && (
              <div className="flex flex-col space-y-0.5 items-center justify-center w-8 h-5">
                <div className="w-full h-3 bg-gray-300" />
                <div className="flex justify-between items-center justify-center w-full h-2">
                  <div className="flex flex-col h-full space-y-0.5">
                    <div className="w-2 h-full bg-gray-300" />
                  </div>
                  <div className="flex flex-col h-full space-y-0.5">
                    <div className="w-5 h-0.5 bg-gray-300" />
                    <div className="w-5 h-0.5 bg-gray-300" />
                  </div>
                </div>
              </div>
            )}
            {layoutId === 2 && (
              <div className="flex flex-col space-y-0.5 items-center justify-center w-8 h-7 ">
                <div className="w-full h-3 bg-gray-300" />
                <div className="w-full h-1 bg-gray-300" />
                <div className="w-full h-0.5 bg-gray-300" />
                <div className="w-full h-0.5 bg-gray-300" />
              </div>
            )}
            {layoutId === 3 && (
              <div className="flex justify-between items-center justify-center w-8 h-4">
                <div className="w-4 h-full bg-gray-300" />
                <div className="flex flex-col space-y-0.5 justify-between items-center justify-center w-3 h-full">
                  <div className="w-3 h-2 bg-gray-300" />
                  <div className="w-3 h-1 bg-gray-300" />
                  <div className="w-3 h-1 bg-gray-300" />
                </div>
              </div>
            )}
            {layoutId === 4 && (
              <div className="flex justify-between items-center justify-center w-8 h-4">
                <div className="flex flex-col space-y-0.5 justify-between items-center justify-center w-3 h-full">
                  <div className="w-3 h-2 bg-gray-300" />
                  <div className="w-3 h-1 bg-gray-300" />
                  <div className="w-3 h-1 bg-gray-300" />
                </div>
                <div className="w-4 h-full bg-gray-300" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
