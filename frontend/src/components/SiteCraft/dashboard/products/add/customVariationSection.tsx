/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Input } from "@/components/SiteCraft/ui/input";
import { GripVertical, Trash2, X } from "lucide-react";
import { useState } from "react";

interface CustomVariationSectionProps {
  name: string;
  index: number;
  values: string[];
  onDelete: () => void;
  onChange: (name: string) => void;
  onValuesChange: (values: string[]) => void;
  onSetStock: () => void;
  isDragging?: boolean;
}

export function CustomVariationSection({
  name,
  index,
  values,
  onDelete,
  onChange,
  onValuesChange,
  onSetStock,
  isDragging,
}: CustomVariationSectionProps & { index: number }) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleAddOption = (e: React.MouseEvent) => {
    e.preventDefault();
    onValuesChange([...values, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onValuesChange(newValues);
  };

  const handleDeleteOption = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    const newValues = values.filter((_, i) => i !== index);
    onValuesChange(newValues);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (
      draggedIndex !== null &&
      dragOverIndex !== null &&
      draggedIndex !== dragOverIndex
    ) {
      // Reorder the values
      const newValues = [...values];

      // Remove from original position
      const [movedValue] = newValues.splice(draggedIndex, 1);

      // Insert at new position
      newValues.splice(dragOverIndex, 0, movedValue);

      // Update state
      onValuesChange(newValues);
    }

    // Reset drag states
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div
      className={`space-y-4 ${
        isDragging ? "opacity-50 transition-opacity" : "transition-opacity"
      }`}
    >
      <div className="flex items-center justify-between group">
        <div className="flex items-center gap-2">
          <span className="cursor-move text-gray-400">
            <GripVertical size={20} />
          </span>
          <Input
            value={name}
            onChange={(e) => onChange(e.target.value)}
            className="font-bold w-48"
            placeholder="Variation Name"
          />
          {index === 0 && (
            <button
              type="button"
              onClick={onSetStock}
              className="ml-2 text-sm text-logo-dark-button hover:underline"
            >
              + Set Stock
            </button>
          )}
        </div>
        <button
          onClick={onDelete}
          className="text-logo-txt hover:text-logo-txt-hover"
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-3 space-y-2">
        {values.map((value, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 p-1 rounded-lg transition-all duration-150 ${
              dragOverIndex === index
                ? "bg-blue-50 border-2 border-blue-200 z-10"
                : "hover:bg-gray-50"
            } ${draggedIndex === index ? "shadow-md scale-[1.02] z-20" : ""}`}
            style={{ transition: "all 0.15s ease" }}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => {
              e.preventDefault();
              handleDragEnter(index);
            }}
            onDragEnd={handleDragEnd}
          >
            <span className="cursor-move text-gray-400">
              <GripVertical size={20} />
            </span>

            <Input
              id={index.toString()}
              name="value"
              placeholder="Enter a value"
              className="w-64"
              onChange={(e) => handleOptionChange(index, e.target.value)}
              value={value}
            />

            <button
              onClick={(e) => handleDeleteOption(e, index)}
              className="text-logo-txt hover:text-logo-txt-hover"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        <button
          onClick={handleAddOption}
          className="flex items-center gap-1 text-logo-dark-button hover:underline text-md"
        >
          + Add Value
        </button>
      </div>
    </div>
  );
}
