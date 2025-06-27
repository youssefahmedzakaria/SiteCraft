"use client";

import { CardTitle } from "@/components/SiteCraft/ui/card";
import { Input } from "@/components/SiteCraft/ui/input";
import { GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";

export function SizeVariationSection() {
  const [sizes, setSizes] = useState<string[]>([""]);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleAddOption = (e: React.MouseEvent) => {
    e.preventDefault();
    setSizes((prev) => [...prev, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newSizes = [...sizes];
    newSizes[index] = value;
    setSizes(newSizes);
  };

  const handleDeleteOption = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
  };

  const handleSizeDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleSizeDragEnter = (index: number) => {
    setDragOverIndex(index);
  };

  const handleSizeDragEnd = () => {
    if (
      draggedIndex !== null &&
      dragOverIndex !== null &&
      draggedIndex !== dragOverIndex
    ) {
      // Reorder the sizes
      const newSizes = [...sizes];

      // Remove from original position
      const [movedSize] = newSizes.splice(draggedIndex, 1);

      // Insert at new position
      newSizes.splice(dragOverIndex, 0, movedSize);

      // Update state
      setSizes(newSizes);
    }

    // Reset drag states
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-4">
      <CardTitle className="font-bold">Sizes</CardTitle>
      <div className="px-3 space-y-2">
        {sizes.map((size, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 ${
              dragOverIndex === index ? "border border-blue-500 rounded" : ""
            }`}
            draggable
            onDragStart={() => handleSizeDragStart(index)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => handleSizeDragEnter(index)}
            onDragEnd={handleSizeDragEnd}
          >
            {/* Drag Handle */}
            <span className="cursor-move text-gray-400">
              <GripVertical size={20} />
            </span>

            {/* Input */}
            <Input
              id={index.toString()}
              name="size"
              placeholder='For example, "M" for size'
              className="w-64"
              onChange={(e) => handleOptionChange(index, e.target.value)}
              value={size}
            />

            {/* Delete Button */}
            <button
              onClick={(e) => handleDeleteOption(e, index)}
              className="text-logo-txt hover:text-logo-txt-hover"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        {/* Add Value */}
        <button
          onClick={handleAddOption}
          className="flex items-center gap-1 text-logo-dark-button hover:underline text-md"
        >
          + Add Size
        </button>
      </div>
    </div>
  );
}
