import { Input } from "@/components/SiteCraft/ui/input";
import { Textarea } from "@/components/SiteCraft/ui/textarea";
import React, { useState, useRef, forwardRef } from "react";
import Image from "next/image";
import { Button } from "@/components/SiteCraft/ui/button";
import { Upload } from "lucide-react";

interface CategorysOverviewProps {
  nameRef?: React.RefObject<HTMLInputElement | null>;
  descriptionRef?: React.RefObject<HTMLTextAreaElement | null>;
  imageRef?: React.RefObject<HTMLInputElement | null>;
  imageFile?: File | null;
  setImageFile?: (file: File | null) => void;
  imagePreview?: string | null;
  setImagePreview?: (preview: string | null) => void;
  categoryName?: string;
  setCategoryName?: (name: string) => void;
  categoryDescription?: string;
  setCategoryDescription?: (description: string) => void;
}

const CategorysOverview = forwardRef<HTMLDivElement, CategorysOverviewProps>(
  ({ 
    nameRef, 
    descriptionRef, 
    imageRef, 
    imageFile, 
    setImageFile, 
    imagePreview, 
    setImagePreview,
    categoryName,
    setCategoryName,
    categoryDescription,
    setCategoryDescription
  }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (file) {
        setImageFile?.(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview?.(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleBrowseClick = () => {
      const inputRef = imageRef?.current || fileInputRef.current;
      inputRef?.click();
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0] || null;
      if (file) {
        setImageFile?.(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview?.(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleClearImage = () => {
      setImageFile?.(null);
      setImagePreview?.(null);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCategoryName?.(e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCategoryDescription?.(e.target.value);
    };

    return (
      <div ref={ref}>
        {/* Category Name */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Category Name <span className="text-red-500">*</span>
          </label>
          <Input
            ref={nameRef}
            id="name"
            name="name"
            placeholder="e.g. Home & Kitchen"
            className="w-full"
            required
            value={categoryName}
            onChange={handleNameChange}
          />
        </div>

        {/* Category Image */}
        <div className="space-y-2">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Category Image
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32">
                  <Image
                    src={imagePreview}
                    alt="Category preview"
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
                <p className="text-sm text-gray-500">{imageFile?.name}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearImage}
                >
                  Change Image
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload size={40} />
                <p className="text-sm text-gray-500">
                  Drag and drop your image here, or{" "}
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
            )}
            <input
              ref={imageRef || fileInputRef}
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Category Description */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <Textarea
            ref={descriptionRef}
            id="description"
            name="description"
            placeholder="Describe this category..."
            rows={4}
            className="w-full"
            value={categoryDescription}
            onChange={handleDescriptionChange}
          />
          <p className="text-xs text-gray-400">
            A brief description of this category to help customers understand what
            products to expect.
          </p>
        </div>
      </div>
    );
  }
);

CategorysOverview.displayName = "CategorysOverview";

export default CategorysOverview;
