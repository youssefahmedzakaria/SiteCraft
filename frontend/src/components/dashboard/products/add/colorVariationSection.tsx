"use client";

import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";



export function ColorVariationSection() {
    const [colors, setColors] = useState<string[]>(['']);

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const handleAddOption = (e: React.MouseEvent) => {
        e.preventDefault();
        setColors((prev) => [...prev, '']);
    };
  
    const handleOptionChange = (index: number, value: string) => {
      const newColors = [...colors];
      newColors[index] = value;
      setColors(newColors);
    };
  
    const handleDeleteOption = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        
        const newColors = colors.filter((_, i) => i !== index);
        setColors(newColors);
    };

    
    const handleColorDragStart = (index: number) => {
        setDraggedIndex(index);
    };
    
    const handleColorDragEnter = (index: number) => {
        setDragOverIndex(index);
    };

    const handleColorDragEnd = () => {
        if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
            // Reorder the colors
            const newColors = [...colors];
            
            // Remove from original position
            const [movedColor] = newColors.splice(draggedIndex, 1);
            
            // Insert at new position
            newColors.splice(dragOverIndex, 0, movedColor);
            
            // Update state
            setColors(newColors);
        }
        
        // Reset drag states
        setDraggedIndex(null);
        setDragOverIndex(null);
    };
    
    return (
        <div className="space-y-4">
            <CardTitle className="font-bold">Colors</CardTitle>
            <div className="px-3 space-y-2">
                {colors.map((color, index) => (
                    <div  key={index} 
                        className={`flex items-center gap-2 ${dragOverIndex === index ? 'border border-blue-500 rounded' : ''}`}
                        draggable
                        onDragStart={() => handleColorDragStart(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={() => handleColorDragEnter(index)}
                        onDragEnd={handleColorDragEnd}
                    >
                        {/* Drag Handle */}
                        <span className="cursor-move text-gray-400">
                            <GripVertical size={20} />
                        </span>

                        {/* Input */}
                        <Input
                            id={index.toString()}
                            name="color"
                            placeholder='For example, "Red" for color'
                            className="w-64"
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            value={color}
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
                    + Add Color
                </button>
            </div>
        </div>
    )
  }