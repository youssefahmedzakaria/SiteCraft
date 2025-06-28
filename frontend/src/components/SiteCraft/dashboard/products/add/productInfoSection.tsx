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

      {/* Product Images */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Product Images
        </label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <button
              type="button"
              onClick={handleBrowseClick}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Browse files
            </button>
            <span className="text-gray-500"> or drag and drop</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            PNG, JPG, GIF up to 10MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Image Previews */}
        {imageFiles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {imageFiles.map((file, index) => (
              <div
                key={index}
                className="relative group"
                draggable
                onDragStart={() => handleImageDragStart(index)}
                onDragEnter={() => handleImageDragEnter(index)}
                onDragEnd={handleImageDragEnd}
              >
                <Image
                  src={imagePreviews[index] || URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
