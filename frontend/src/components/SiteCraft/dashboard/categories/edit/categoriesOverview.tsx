import { Input } from "@/components/SiteCraft/ui/input";
import { Textarea } from "@/components/SiteCraft/ui/textarea";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/SiteCraft/ui/button";
import { Upload } from "lucide-react";
// import { Category } from "@/lib/categories";

const BACKEND_BASE_URL = "http://localhost:8080"; // Change if your backend runs elsewhere

function getFullImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  // Always prefix backend for /uploads
  if (url.startsWith("/uploads")) {
    return BACKEND_BASE_URL.replace(/\/$/, "") + url;
  }
  // Otherwise, treat as relative to backend
  return BACKEND_BASE_URL.replace(/\/$/, "") + "/" + url;
}

interface CategorysOverviewProps {
  categoryName?: string;
  setCategoryName?: (name: string) => void;
  categoryDescription?: string;
  setCategoryDescription?: (description: string) => void;
  imageFile?: File | null;
  setImageFile?: (file: File | null) => void;
  imagePreview?: string | null;
  setImagePreview?: (preview: string | null) => void;
  existingImageUrl?: string | null;
}

export default function CategorysOverview({
  categoryName,
  setCategoryName,
  categoryDescription,
  setCategoryDescription,
  imageFile,
  setImageFile,
  imagePreview,
  setImagePreview,
  existingImageUrl
}: CategorysOverviewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleImageChange triggered'); // Debug log
    const file = e.target.files?.[0] || null;
    if (file) {
      console.log('File selected:', file.name, file.size); // Debug log
      setImageFile?.(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview?.(reader.result as string);
        console.log('Image preview set'); // Debug log
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrowseClick = () => {
    console.log('Browse clicked'); // Debug log
    console.log('File input ref:', fileInputRef.current); // Debug log
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error('File input ref is null');
    }
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

  const handleChangeImage = () => {
    console.log('Change Image button clicked'); // Debug log
    console.log('File input ref:', fileInputRef.current); // Debug log
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error('File input ref is null');
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName?.(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCategoryDescription?.(e.target.value);
  };

  // Determine which image to show
  const displayImage = imagePreview || getFullImageUrl(existingImageUrl);
  const displayImageName = imageFile?.name || 'Current image';

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
          {isClient && displayImage ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32">
                <Image
                  src={displayImage}
                  alt="Category preview"
                  fill
                  className="object-contain rounded-md"
                />
              </div>
              <p className="text-sm text-gray-500">{displayImageName}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleChangeImage}
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
          value={categoryDescription}
          onChange={handleDescriptionChange}
        />
        <p className="text-xs text-gray-400">
          A brief description of this category to help customers understand what
          products to expect.
        </p>
      </div>
    </>
  );
}
