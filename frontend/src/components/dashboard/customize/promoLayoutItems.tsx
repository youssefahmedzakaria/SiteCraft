"use client";
import React, { useState } from "react";
import { Dot } from "lucide-react";

export function PromoLayoutItems() {
  {
    /* For layout selection in design */
  }
  const [layoutSelected, setLayoutSelected] = useState<number | null>(1);
  return (
    <div>
      <h3 className="font-medium mb-2">Layout</h3>
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((layoutId) => (
          <button
            key={layoutId}
            className={`aspect-square px-2 py-3 rounded border border-gray-200 hover:border-gray-900 transition-colors shadow flex items-center justify-center ${
              layoutId === layoutSelected
                ? "bg-gray-800 border-gray-500"
                : "bg-white"
            }`}
            onClick={() => setLayoutSelected(layoutId)}
          >
            {layoutId === 1 && (
              <div className="w-12 h-6 px-1 bg-gray-300 flex flex-col items-center justify-center space-y-0.5">
                <div
                  className={`w-5 h-0.5 ${
                    1 === layoutSelected
                      ? "bg-gray-800 border-gray-500"
                      : "bg-white"
                  }`}
                ></div>
                <div
                  className={`w-3 h-0.5 ${
                    1 === layoutSelected
                      ? "bg-gray-900 border-gray-500"
                      : "bg-white"
                  }`}
                ></div>
              </div>
            )}
            {layoutId === 2 && (
              <div className="w-12 h-6 px-1 bg-gray-300 flex flex-col justify-center space-y-0.5">
                <div
                  className={`w-5 h-0.5 ${
                    2 === layoutSelected
                      ? "bg-gray-800 border-gray-500"
                      : "bg-white"
                  }`}
                ></div>
                <div
                  className={`w-3 h-0.5 ${
                    2 === layoutSelected
                      ? "bg-gray-900 border-gray-500"
                      : "bg-white"
                  }`}
                ></div>
              </div>
            )}
            {layoutId === 3 && (
              <div className="w-12 h-6 bg-gray-300 flex flex-col items-end justify-end p-[3px] space-y-0.5">
                <div
                  className={`w-5 h-0.5 bg-gray-300 ${
                    3 === layoutSelected
                      ? "bg-gray-800 border-gray-500"
                      : "bg-white"
                  }`}
                />
                <div
                  className={`w-3 h-0.5 bg-gray-300 ${
                    3 === layoutSelected
                      ? "bg-gray-800 border-gray-500"
                      : "bg-white"
                  }`}
                />
              </div>
            )}
            {layoutId === 4 && (
              <div className="w-12 h-6 bg-gray-300 flex flex-col items-center justify-center p-[2px]">
                <div
                  className={`w-full h-full flex flex-col justify-end space-y-0.5 p-[2px] ${
                    4 === layoutSelected
                      ? "bg-gray-800 border-gray-500"
                      : "bg-white"
                  }`}
                >
                  <div className="w-5 h-0.5 bg-gray-300" />
                  <div className="w-3 h-0.5 bg-gray-300" />
                </div>
              </div>
            )}
            {layoutId === 5 && (
              <div className="w-12 h-6 bg-gray-300 flex items-center justify-center py-[2px] gap-[3px]">
                <div
                  className={`w-1/3 h-full flex flex-col justify-end items-center p-[2px] ${
                    5 === layoutSelected
                      ? "bg-gray-800 border-gray-500"
                      : "bg-white"
                  }`}
                >
                  <div className="w-2 h-0.5 bg-gray-300" />
                </div>
                <div
                  className={`w-1/3 h-full flex flex-col justify-end items-center p-[2px] ${
                    5 === layoutSelected
                      ? "bg-gray-800 border-gray-500"
                      : "bg-white"
                  }`}
                >
                  <div className="w-2 h-0.5 bg-gray-300" />
                </div>
              </div>
            )}
            {layoutId === 6 && (
              <div className="w-12 h-6 bg-gray-300 flex items-center justify-center justify-between p-[3px]">
                <div
                  className={`w-3 h-4 flex flex-col items-center justify-center ${
                    6 === layoutSelected
                      ? "bg-gray-800 border-gray-500"
                      : "bg-white"
                  }`}
                />

                <div className="w-3 h-full flex flex-col justify-center gap-[1px]">
                  <div
                    className={`w-3 h-0.5 ${
                      6 === layoutSelected
                        ? "bg-gray-800 border-gray-500"
                        : "bg-white"
                    }`}
                  ></div>
                  <div
                    className={`w-1 h-0.5 ${
                      6 === layoutSelected
                        ? "bg-gray-900 border-gray-500"
                        : "bg-white"
                    }`}
                  ></div>
                </div>
              </div>
            )}
            {layoutId === 7 && (
              <div className="w-12 h-6 bg-gray-300 flex items-center justify-center justify-between p-[3px]">
                <div className="w-3 h-full flex flex-col justify-center gap-[1px]">
                  <div
                    className={`w-3 h-0.5 ${
                      7 === layoutSelected
                        ? "bg-gray-800 border-gray-500"
                        : "bg-white"
                    }`}
                  />
                  <div
                    className={`w-1 h-0.5 ${
                      7 === layoutSelected
                        ? "bg-gray-900 border-gray-500"
                        : "bg-white"
                    }`}
                  />
                </div>

                <div
                  className={`w-3 h-4 flex flex-col items-center justify-center ${
                    7 === layoutSelected
                      ? "bg-gray-800 border-gray-500"
                      : "bg-white"
                  }`}
                />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
