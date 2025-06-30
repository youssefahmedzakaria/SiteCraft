"use client";
import React, { useState } from "react";
import { Dot } from "lucide-react";

interface HeaderLayoutItemsProps {
  selectedLayout: number;
  onLayoutSelect: (layoutId: number) => void;
}

export function HeaderLayoutItems({
  selectedLayout,
  onLayoutSelect,
}: HeaderLayoutItemsProps) {
  return (
    <div>
      <h3 className="font-medium mb-2">Layout</h3>
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((layoutId) => (
          <button
            key={layoutId}
            className={`aspect-square px-2 rounded border border-gray-200 hover:border-gray-900 transition-colors shadow ${
              layoutId === selectedLayout
                ? "bg-gray-800 border-gray-500"
                : "bg-white"
            }`}
            onClick={() => onLayoutSelect(layoutId)}
          >
            {layoutId === 1 && (
              <div className="space-y-0.5 items-center w-full h-4 p-1 bg-gray-300">
                <div className="flex justify-between items-center w-full">
                  <div
                    className={`w-1 h-1 rounded-full ${
                      layoutId === selectedLayout
                        ? "bg-gray-800 border-gray-500"
                        : "bg-white"
                    }`}
                  ></div>
                  <div
                    className={`w-4 h-0.5 ${
                      layoutId === selectedLayout
                        ? "bg-gray-900 border-gray-500"
                        : "bg-white"
                    }`}
                  ></div>
                </div>
                <div
                  className={`w-full h-0.5 ${
                    layoutId === selectedLayout
                      ? "bg-gray-900 border-gray-500"
                      : "bg-white"
                  }`}
                ></div>
              </div>
            )}
            {layoutId === 2 && (
              <div className="space-y-0.5 items-center w-full h-4 p-1 bg-gray-300">
                <div className="flex justify-between items-center w-full">
                  <div
                    className={`w-2 h-0.5 ${
                      layoutId === selectedLayout
                        ? "bg-gray-800 border-gray-500"
                        : "bg-white"
                    }`}
                  ></div>
                  <div
                    className={`w-1 h-1 rounded-full ${
                      layoutId === selectedLayout
                        ? "bg-gray-800 border-gray-500"
                        : "bg-white"
                    }`}
                  ></div>
                  <div
                    className={`w-2 h-0.5 ${
                      layoutId === selectedLayout
                        ? "bg-gray-900 border-gray-500"
                        : "bg-white"
                    }`}
                  ></div>
                </div>
                <div
                  className={`w-full h-0.5 ${
                    layoutId === selectedLayout
                      ? "bg-gray-900 border-gray-500"
                      : "bg-white"
                  }`}
                ></div>
              </div>
            )}
            {layoutId === 3 && (
                           <div className="flex items-center justify-between w-full h-3 bg-gray-300">
                <div className="flex flex-col w-1/3 h-full justify-center items-center gap-[1.5px]">
                  <div
                    className={`w-1.5 h-[1px] ${
                      layoutId === selectedLayout
                        ? "bg-gray-900 border-gray-500"
                        : "bg-white"
                    }`}
                  ></div>
                  <div
                    className={`w-1.5 h-[1px] ${
                      layoutId === selectedLayout
                        ? "bg-gray-900 border-gray-500"
                        : "bg-white"
                    }`}
                  ></div>
                  <div
                    className={`w-1.5 h-[1px] ${
                      layoutId === selectedLayout
                        ? "bg-gray-900 border-gray-500"
                        : "bg-white"
                    }`}
                  ></div>
                </div>
                <div className="w-1/3 h-full flex items-center justify-center">
                  <div
                    className={`w-1 h-1 rounded-full ${
                      layoutId === selectedLayout
                        ? "bg-gray-800 border-gray-500"
                        : "bg-white"
                    }`}
                  ></div>
                </div>
                <div className="w-1/3 h-full"></div>
              </div>
            )}
            {layoutId === 4 && (
              <div className="flex space-x-0.5 items-center justify-center w-full h-2 px-1 bg-gray-300">
                <div
                  className={`w-1.5 h-0.5 ${
                    layoutId === selectedLayout
                      ? "bg-gray-900 border-gray-500"
                      : "bg-white"
                  }`}
                ></div>
                <div
                  className={`w-1.5 h-0.5 ${
                    layoutId === selectedLayout
                      ? "bg-gray-900 border-gray-500"
                      : "bg-white"
                  }`}
                ></div>
                <div
                  className={`w-1.5 h-0.5 ${
                    layoutId === selectedLayout
                      ? "bg-gray-900 border-gray-500"
                      : "bg-white"
                  }`}
                ></div>
              </div>
            )}
            {layoutId === 5 && (
              <div className="space-y-0.5 items-center w-full h-4 p-1 bg-gray-300">
                <div className="flex justify-between items-center w-full">
                  <div
                    className={`w-1 h-1 rounded-full ${
                      layoutId === selectedLayout
                        ? "bg-gray-800 border-gray-500"
                        : "bg-white"
                    }`}
                  ></div>
                  <div
                    className={`w-2 h-0.5 ${
                      layoutId === selectedLayout
                        ? "bg-gray-900 border-gray-500"
                        : "bg-white"
                    }`}
                  ></div>
                </div>
                <div
                  className={`w-full h-0.5 ${
                    layoutId === selectedLayout
                      ? "bg-gray-900 border-gray-500"
                      : "bg-white"
                  }`}
                ></div>
              </div>
            )}
            {layoutId === 6 && (
              <div className="flex space-x-0.5 items-center justify-center w-full h-2 px-1 bg-gray-300">
                <div
                  className={`w-1 h-1 rounded-full ${
                    layoutId === selectedLayout
                      ? "bg-gray-800 border-gray-500"
                      : "bg-white"
                  }`}
                ></div>
                <div
                  className={`w-2 h-0.5 ${
                    layoutId === selectedLayout
                      ? "bg-gray-800 border-gray-500"
                      : "bg-white"
                  }`}
                ></div>
                <div
                  className={`w-2 h-0.5 ${
                    layoutId === selectedLayout
                      ? "bg-gray-900 border-gray-500"
                      : "bg-white"
                  }`}
                ></div>
              </div>
            )}
            {layoutId === 7 && (
              <div className="flex space-x-0.5 items-center justify-center w-full h-2 px-1 bg-gray-300">
                <div
                  className={`w-2 h-0.5 ${
                    layoutId === selectedLayout
                      ? "bg-gray-800 border-gray-500"
                      : "bg-white"
                  }`}
                ></div>
                <div
                  className={`w-1 h-1 rounded-full ${
                    layoutId === selectedLayout
                      ? "bg-gray-800 border-gray-500"
                      : "bg-white"
                  }`}
                ></div>
                <div
                  className={`w-2 h-0.5 ${
                    layoutId === selectedLayout
                      ? "bg-gray-900 border-gray-500"
                      : "bg-white"
                  }`}
                ></div>
              </div>
            )}
            {layoutId === 8 && (
              <div className="flex items-center justify-between w-full h-3 bg-gray-300">
                <div className="w-1/3 h-full flex items-center justify-center">
                  <div
                    className={`w-1 h-1 rounded-full ${
                      layoutId === selectedLayout
                        ? "bg-gray-800 border-gray-500"
                        : "bg-white"
                    }`}
                  ></div>
                </div>
                <div className="w-1/3 h-full"></div>
                <div className="flex flex-col w-1/3 h-full justify-center items-center gap-[1.5px]">
                  <div
                    className={`w-1.5 h-[1px] ${
                      layoutId === selectedLayout
                        ? "bg-gray-900 border-gray-500"
                        : "bg-white"
                    }`}
                  ></div>
                  <div
                    className={`w-1.5 h-[1px] ${
                      layoutId === selectedLayout
                        ? "bg-gray-900 border-gray-500"
                        : "bg-white"
                    }`}
                  ></div>
                  <div
                    className={`w-1.5 h-[1px] ${
                      layoutId === selectedLayout
                        ? "bg-gray-900 border-gray-500"
                        : "bg-white"
                    }`}
                  ></div>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
