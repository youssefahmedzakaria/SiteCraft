"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/SiteCraft/ui/input";
import { Textarea } from "@/components/SiteCraft/ui/textarea";
import { CardTitle } from "@/components/SiteCraft/ui/card";
import Image from "next/image";
import { ChevronDown, ChevronUp, Upload } from "lucide-react";
import { deleteProductImage, getCategories } from '@/lib/products';

interface BasicFormData {
  name: string;
  description: string;
  categoryId: number;
}

interface ProductInfoSectionProps {
  formData: BasicFormData;
  updateFormData: (updates: Partial<BasicFormData>) => void;
  imageFiles: File[];
  updateImageFiles: (files: File[]) => void;
  existingImages?: { id: number; imageUrl: string; alt?: string }[];
  productId?: number;
  setExistingImages?: (images: any[]) => void;
}

export function ProductInfoSection({ 
  formData, 
  updateFormData, 
  imageFiles, 
  updateImageFiles,
  existingImages = [],
  productId,
  setExistingImages
}: ProductInfoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [openCategories, setOpenCategories] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setCategoriesError('Failed to fetch categories');
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle form field changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ name: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ description: e.target.value });
  };

  const handleCategoryChange = (categoryId: number) => {
    updateFormData({ categoryId });
    setOpenCategories(false);
  };

  // Image handling
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      addImageFiles(Array.from(files));
    }
  };

  const addImageFiles = (newFiles: File[]) => {
    // Process each new file
    newFiles.forEach((file) => {
      // Create a preview for the file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Add files to state
    updateImageFiles([...imageFiles, ...newFiles]);
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
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
    updateImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);
  };

  const handleImageDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleImageDragEnter = (index: number) => {
    setDragOverIndex(index);
  };

  const handleImageDragEnd = () => {
    if (
      draggedIndex !== null &&
      dragOverIndex !== null &&
      draggedIndex !== dragOverIndex
    ) {
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
      updateImageFiles(newImageFiles);
      setImagePreviews(newImagePreviews);
    }

    // Reset drag states
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Get selected category name
  const getSelectedCategoryName = () => {
    if (formData.categoryId === 0) return "Select category";
    const category = categories.find(c => c.id === formData.categoryId);
    return category ? category.name || category.title : "Select category";
  };

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <CardTitle className="font-bold">Product Info</CardTitle>
        <p className="text-gray-500">Enter the details of your new product</p>
      </div>

      {/* Existing Images (from backend) */}
      {existingImages.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {existingImages.map((img, idx) => (
            <div key={img.id || idx} className="relative w-24 h-24 border rounded overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.imageUrl?.startsWith('http') ? img.imageUrl : `http://localhost:8080${img.imageUrl}`}
                alt={img.alt || `Product image ${idx + 1}`}
                className="object-cover w-full h-full"
              />
              {productId && setExistingImages && (
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  title="Delete image"
                  onClick={async () => {
                    try {
                      await deleteProductImage(productId, img.id);
                      setExistingImages(existingImages.filter((image) => image.id !== img.id));
                    } catch (err) {
                      alert('Failed to delete image');
                    }
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Product Name and Category */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {/* Product Name */}
        <div className="flex-1 space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="e.g. T-Shirt"
            className="w-full"
            required
          />
        </div>

        {/* Product Category */}
        <div className="relative flex-1 space-y-2">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <div
            className="flex w-full border border-input bg-white rounded flex h-9 px-3 py-1 gap-2 items-center justify-between cursor-pointer"
            onClick={() => setOpenCategories(!openCategories)}
          >
            <span className={formData.categoryId === 0 ? "text-gray-500" : ""}>
              {getSelectedCategoryName()}
            </span>
            {openCategories ? (
              <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </div>

          {openCategories && (
            <div className="absolute mt-2 w-full bg-white border border-input rounded shadow z-10">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCategoryChange(parseInt(category.id))}
                >
                  {category.name || category.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Description */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleDescriptionChange}
          placeholder="Describe your product..."
          className="w-full min-h-[100px]"
          required
        />
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
            {imageFiles.map((file, index) => (
              <div
                key={index}
                className={`relative w-24 h-24 group cursor-move ${
                  dragOverIndex === index ? "border-2 border-blue-500" : ""
                }`}
                draggable
                onDragStart={() => handleImageDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => handleImageDragEnter(index)}
                onDragEnd={handleImageDragEnd}
              >
                <Image
                  src={imagePreviews[index] || URL.createObjectURL(file)}
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
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
                {index === 0 && (
                  <div className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                    Main
                  </div>
                )}
              </div>
            ))}

            {/* Add Image Button */}
            {imageFiles.length !== 0 && (
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
          {imageFiles.length === 0 && (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload size={40} />
                <p className="text-sm text-gray-500">
                  Drag and drop your images here, or{" "}
                  <span
                    className="text-blue-600 cursor-pointer hover:text-blue-800"
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
          You can upload multiple images. The first image will be used as the
          main product image.
        </p>
      </div>
    </div>
  );
}
