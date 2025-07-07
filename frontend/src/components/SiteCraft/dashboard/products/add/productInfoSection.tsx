"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/SiteCraft/ui/input";
import { Textarea } from "@/components/SiteCraft/ui/textarea";
import { CardTitle } from "@/components/SiteCraft/ui/card";
import Image from "next/image";
import { ChevronDown, ChevronUp, Upload } from "lucide-react";
import { deleteProductImage, getCategories } from "@/lib/products";

interface BasicFormData {
  name: string;
  description: string;
  categoryIds?: number[];
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
  setExistingImages,
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
      } catch {
        setCategoriesError("Failed to fetch categories");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Form field handlers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ name: e.target.value });
  };
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateFormData({ description: e.target.value });
  };
  const handleCategoryChange = (categoryId: number) => {
    const current = formData.categoryIds || [];
    const updated = current.includes(categoryId)
      ? current.filter((id) => id !== categoryId)
      : [...current, categoryId];
    updateFormData({ categoryIds: updated });
  };

  // Image addition & preview
  const addImageFiles = (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    updateImageFiles([...imageFiles, ...files]);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      addImageFiles(Array.from(e.target.files));
    }
  };
  const handleBrowseClick = () => fileInputRef.current?.click();
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      addImageFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Remove a newly added image
  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    updateImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  // Drag & drop reordering (new images only)
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
      // 1) clone state arrays
      const newImageFiles = [...imageFiles];
      const newImagePreviews = [...imagePreviews];

      // 2) remove the dragged item
      const [movedFile] = newImageFiles.splice(draggedIndex, 1);
      const [movedPreview] = newImagePreviews.splice(draggedIndex, 1);

      // 3) re-insert at the new index
      newImageFiles.splice(dragOverIndex, 0, movedFile);
      newImagePreviews.splice(dragOverIndex, 0, movedPreview);

      // 4) update component state
      updateImageFiles(newImageFiles);
      setImagePreviews(newImagePreviews);
    }

    // reset drag indices
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Category display helpers
  const getSelectedCategoryNames = () => {
    const ids = formData.categoryIds || [];
    if (!ids.length) return "Select categories";
    const sel = categories.filter((c) => ids.includes(c.id));
    if (!sel.length) return "Select categories";
    return sel.length === 1
      ? sel[0].name || sel[0].title
      : `${sel.length} categories selected`;
  };
  const isCategorySelected = (id: number) =>
    (formData.categoryIds || []).includes(id);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-2">
        <CardTitle className="font-bold">Product Info</CardTitle>
        <p className="text-gray-500">Enter the details of your new product</p>
      </div>

      {/* Name & Category Select */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.name}
            onChange={handleNameChange}
            placeholder="e.g. T-Shirt"
            className="w-full"
            required
          />
        </div>
        <div className="relative flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Categories <span className="text-red-500">*</span>
          </label>
          <div
            className="flex w-full border border-input bg-white rounded h-9 px-3 py-1 items-center justify-between cursor-pointer"
            onClick={() => setOpenCategories(!openCategories)}
          >
            <span
              className={!formData.categoryIds?.length ? "text-gray-500" : ""}
            >
              {getSelectedCategoryNames()}
            </span>
            {openCategories ? (
              <ChevronUp className="h-4 w-4 opacity-50" />
            ) : (
              <ChevronDown className="h-4 w-4 opacity-50" />
            )}
          </div>
          {openCategories && (
            <div className="absolute mt-2 w-full bg-white border border-input rounded shadow z-10 max-h-60 overflow-y-auto">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={isCategorySelected(cat.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span>{cat.name || cat.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>
        <Textarea
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
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex flex-wrap gap-4">
            {/* Existing Images */}
            {existingImages.map((img, idx) => (
              <div key={img.id} className="relative w-24 h-24 group">
                <img
                  src={img.imageUrl}
                  alt={img.alt || `Product image ${idx + 1}`}
                  className="object-cover w-full h-full rounded-md"
                />
                {productId && setExistingImages && (
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={async () => {
                      try {
                        await deleteProductImage(productId, img.id);
                        setExistingImages(
                          existingImages.filter((i) => i.id !== img.id)
                        );
                      } catch {
                        alert("Failed to delete image");
                      }
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {/* New Images */}
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
                  alt={`Product image ${existingImages.length + index + 1}`}
                  fill
                  className="object-cover rounded-md"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Add Image Button */}
            {existingImages.length !== 0 ||
              (imageFiles.length !== 0 && (
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
              ))}
          </div>

          {/* Drop Area when no images */}
          {existingImages.length === 0 && imageFiles.length === 0 && (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload size={40} />
                <p className="text-sm text-gray-500">
                  Drag and drop your images here, or{" "}
                  <span
                    className="text-blue-600 cursor-pointer"
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
        <p className="text-xs text-gray-400">
          You can upload multiple images. The first image will be used as the
          main product image.
        </p>
      </div>
    </div>
  );
}
