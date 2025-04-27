import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// import { Category } from "@/lib/categories";

export default function CategorysOverview() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      {/* Category Name */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Category Name<span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          name="name"
          placeholder="e.g. Home & Kitchen"
          className="w-full"
          required
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
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
              >
                Change Image
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src="/icons/upload.svg"
                alt="Upload"
                width={40}
                height={40}
                className="mx-auto"
              />
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
            ref={fileInputRef}
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
          id="description"
          name="description"
          placeholder="Describe this category..."
          rows={4}
          className="w-full"
        />
        <p className="text-xs text-gray-400">
          A brief description of this category to help customers understand what
          products to expect.
        </p>
      </div>
    </>
  );
}
