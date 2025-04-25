"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";

export default function AddProductPage() {
    {/* For images */}
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    {/* For discount */}
    const [discountOption, setDiscountOption] = useState<string | null>(null);
    const [discountEnabled, setDiscountEnabled] = useState(false);

    {/* For low stock */}
    const [lowStockOption, setLowStockOption] = useState<string | null>("Number of Items");
  
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

    {/* For discount */}
    const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.value === discountOption){
            setDiscountOption(null);
        }else{
            setDiscountOption(event.target.value);
        }
    };

    {/* For low stock */}
    const handleLowStockChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.value === lowStockOption){
            setLowStockOption(null);
        }else{
            setLowStockOption(event.target.value);
        }
    };


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">

        <h1 className="text-2xl md:text-3xl font-bold mt-2">Add New Product</h1>
        <p className="text-gray-500 mt-2 mb-6">Create a new product for your store</p>

        <Card className="flex flex-col gap-4 bg-white">
            <CardContent className="py-2">
            <form className="space-y-6">
                {/* Product Info */}
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
                        <div className="flex-1 space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <Input
                                id="sku"
                                name="sku"
                                placeholder="Select Category"
                                className="w-full"
                            />
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
                
                {/* Pricing Section */}
                <div className="space-y-4">
                    <div className="mb-2">
                        <CardTitle className="font-bold">Pricing</CardTitle>
                        <p className="text-gray-500">Enter the details for stock level availabile </p>
                    </div>
                    
                    {/* Product Price and Production Cost */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        {/* Product Price */}
                        <div className="flex-1 space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Price <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="price"
                                name="price"
                                placeholder="e.g. 250"
                                className="w-full"
                                required
                            />
                        </div>
                        {/* Product Production Cost */}
                        <div className="flex-1 space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Production Cost <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="productionCost"
                                name="productionCost"
                                placeholder="e.g. 125"
                                className="w-full"
                                required
                            />
                        </div>
                    </div>

                    {/* Toggle Discount */}
                    <div className="flex items-center gap-4">
                        <Switch
                            id="enableDiscount"
                            checked={discountEnabled}
                            onCheckedChange={() => {
                                setDiscountEnabled(!discountEnabled);
                                setDiscountOption(null);
                            }}
                            className="data-[state=checked]:bg-logo-dark-button"
                        />
                        <label htmlFor="enableDiscount" className="text-sm font-medium text-gray-700">
                            Enable Discount
                        </label>
                    </div>

                    {/* Product Discount */}
                    {discountEnabled && (
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            {/* Discount Type */}
                            <div className="flex-1 space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Discount Type
                                </label>
                                <div className="flex gap-10">
                                    <label className="flex gap-2">
                                        <input
                                            type="radio"
                                            value="Percentage"
                                            checked={discountOption === 'Percentage'}
                                            onChange={handleDiscountChange}
                                        />
                                        Percentage
                                    </label>
                                    <label className="flex gap-2">
                                        <input
                                        type="radio"
                                        value="Amount"
                                        checked={discountOption === 'Amount'}
                                        onChange={handleDiscountChange}
                                    />
                                        Amount
                                    </label>
                                </div>
                            </div>

                            {/* Discount Value */}
                            <div className="flex-1 space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Discount Value <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="discountValue"
                                    name="discountValue"
                                    placeholder="e.g. 10, 100"
                                    className="w-full"
                                    required
                                />
                            </div>
                        </div>
                    )}
                    
                </div>
                
                {/* Low Stock Settings Section */}
                <div className="space-y-4">
                    <div className="mb-2">
                        <CardTitle className="font-bold">Low Stock Settings</CardTitle>
                        <p className="text-gray-500">Enter the details for stock level availabile in your inventory you want to be noified at</p>
                    </div>

                    {/* Settings type and value */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        {/* Settings Type */}
                        <div className="flex-1 space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Settings Type
                            </label>
                            <div className="flex gap-10">
                                <label className="flex gap-2">
                                    <input
                                        type="radio"
                                        value="Number of Items"
                                        checked={lowStockOption === 'Number of Items'}
                                        onChange={handleLowStockChange}
                                    />
                                    Number of Items
                                </label>
                                <label className="flex gap-2">
                                    <input
                                    type="radio"
                                    value="Percentage"
                                    checked={lowStockOption === 'Percentage'}
                                    onChange={handleLowStockChange}
                                />
                                    Percentage
                                </label>
                            </div>
                        </div>

                        {/* Settings Value */}
                        <div className="flex-1 space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Settings Value <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="settingsValue"
                                name="settingsValue"
                                placeholder="e.g. 10"
                                className="w-full"
                                required
                            />
                        </div>
                    </div>

                    {/* Max Cap and Min Available */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        {/* Minimum inventory available */}
                        <div className="flex-1 space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Minimum Inventory Available <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="minAvailable"
                                name="minAvailable"
                                placeholder="e.g. 5"
                                className="w-full"
                                required
                            />
                        </div>

                        {/* Maximum inventory capacity */}
                        {lowStockOption === 'Percentage' && (
                            <div className="flex-1 space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Maximum Inventory Capacity <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="maxCapacity"
                                    name="maxCapacity"
                                    placeholder="e.g. 90"
                                    className="w-full"
                                    required
                                />
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button 
                        type="submit" 
                        className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
                    >
                        Save Product
                    </Button>
                    <Link href="/dashboard/products">
                        <Button 
                            variant="outline" 
                            className="w-full sm:w-auto text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
                        >
                        Cancel
                        </Button>
                    </Link>
                </div>
            </form>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}