"use client";

import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { categories } from "@/lib/categories";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ProductInfoSection() {
    {/* For images */}
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    {/* For categories */}
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [openCategories, setOpenCategories] = useState(false);

    {/* For images */}
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
        addImageFiles(Array.from(files));
        }
    };
    
    const addImageFiles = (newFiles: File[]) => {
        // Process each new file
        newFiles.forEach(file => {
        // Create a preview for the file
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
        });
    
        // Add files to state
        setImageFiles(prev => [...prev, ...newFiles]);
    };
    
    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };
    
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
        addImageFiles(Array.from(files));
        }
    };
    
    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleImageDragStart = (index: number) => {
        setDraggedIndex(index);
    };
    
    const handleImageDragEnter = (index: number) => {
        setDragOverIndex(index);
    };

    const handleImageDragEnd = () => {
        if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
            // Reorder the images
            const newImageFiles = [...imageFiles];
            const newImagePreviews = [...imagePreviews];
            
            // Remove from original position
            const [movedFile] = newImageFiles.splice(draggedIndex, 1);
            const [movedPreview] = newImagePreviews.splice(draggedIndex, 1);
            
            // Insert at new position
            newImageFiles.splice(dragOverIndex, 0, movedFile);
            newImagePreviews.splice(dragOverIndex, 0, movedPreview);
            
            // Update state
            setImageFiles(newImageFiles);
            setImagePreviews(newImagePreviews);
        }
        
        // Reset drag states
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    {/* For categories */}
    const toggleCategoriesOption = (option: string) => {
        setSelectedCategories((prev) =>
          prev.includes(option)
            ? prev.filter((item) => item !== option)
            : [...prev, option]
        );
    };

    
    {/* Product Info */}
    return (
        <div className="space-y-4">
            <div className="mb-2">
                <CardTitle className="font-bold">Product Info</CardTitle>
                <p className="text-gray-500">Enter the details of your new product</p>
            </div>
            
            {/* Product Name and Category */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                {/* Product Name */}
                <div className="flex-1 space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="e.g. T-Shirt"
                        className="w-full"
                        required
                    />
                </div>
                
                {/* Product Category */}
                <div className="relative flex-1 space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <div
                        className="flex w-full border border-input bg-white rounded flex h-9 px-3 py-1 gap-2 items-center justify-between"
                        onClick={() => setOpenCategories(!openCategories)}
                    >
                        {selectedCategories.length > 0 ? selectedCategories.join(', ') : 'Select options'}
                        {openCategories ? <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50"/> : <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>}
                    </div>

                    {openCategories && (
                        <div className="absolute mt-2 w-full bg-white border border-input rounded shadow">
                            {categories.map((option) => (
                                <label key={option.id} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        checked={selectedCategories.includes(option.title)}
                                        onChange={() => toggleCategoriesOption(option.title)}
                                    />
                                    {option.title}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Product Description */}
            <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe this product..."
                    rows={4}
                    className="w-full"
                />
                <p className="text-xs text-gray-400">
                    A brief description of this product to help customers understand what products to expect.
                </p>
            </div>

            {/* Product Gallery */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Product Gallery
                </label>
                
                {/* Gallery Container */}
                <div className="p-4 border border-gray-200 rounded-lg">
                    {/* Gallery Preview */}
                    <div className="flex flex-wrap gap-4">
                        {imagePreviews.map((preview, index) => (
                            <div 
                                key={index} 
                                className={`relative w-24 h-24 group cursor-move ${dragOverIndex === index ? 'border-2 border-blue-500' : ''}`}
                                draggable
                                onDragStart={() => handleImageDragStart(index)}
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnter={() => handleImageDragEnter(index)}
                                onDragEnd={handleImageDragEnd}
                            >
                                <Image
                                    src={preview}
                                    alt={`Product image ${index + 1}`}
                                    fill
                                    className="object-cover rounded-md"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-30 rounded-md">
                                    <span className="text-white text-xs font-medium">
                                        Drag to move
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-logo-dark-button text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ✕
                                </button>
                                {index === 0 && (
                                    <div className="absolute -top-2 -left-2 bg-logo-dark-button text-white text-xs rounded-full px-2 py-1">
                                        Main
                                    </div>
                                )}
                        </div>
                        ))}
                    
                        {/* Add Image Button */}
                        {imagePreviews.length != 0 && (
                            <div
                                className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50"
                                onClick={handleBrowseClick}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl text-gray-400">+</span>
                                    <span className="text-xs text-gray-500">Add</span>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Drop Area (only shown when no images) */}
                    {imagePreviews.length === 0 && (
                        <div 
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <div className="flex flex-col items-center justify-center gap-2">
                                <Image
                                    src="/icons/upload.svg"
                                    alt="Upload"
                                    width={40}
                                    height={40}
                                    className="mx-auto"
                                />
                                <p className="text-sm text-gray-500">
                                    Drag and drop your images here, or{" "}
                                    <span 
                                    className="text-logo-txt cursor-pointer hover:text-logo-txt-hover"
                                    onClick={handleBrowseClick}
                                    >
                                        browse
                                    </span>
                                </p>
                                <p className="text-xs text-gray-400">
                                    Recommended: 512x512px, PNG or JPG
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {/* Hidden File Input */}
                    <input
                        ref={fileInputRef}
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>
                
                {/* Help Text */}
                <p className="text-xs text-gray-400">
                    You can upload multiple images. The first image will be used as the main product image.
                </p>
            </div>
        </div>  
    )
  }