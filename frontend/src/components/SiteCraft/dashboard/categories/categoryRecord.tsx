/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/SiteCraft/ui/button";
import { Category, deleteCategory } from "@/lib/categories";
import { useState } from "react";
import { DeleteConfirmationDialog } from "@/components/SiteCraft/ui/deleteConfirmationDialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle } from "lucide-react";

interface CategoryRecordProps {
  category: Category;
  onDelete?: (categoryId: number) => void;
}

export function CategoryRecord({ category, onDelete }: CategoryRecordProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      await deleteCategory(parseInt(category.id));
      
      // Call the parent's onDelete callback if provided
      if (onDelete) {
        onDelete(parseInt(category.id));
      }
      
      setShowDeleteDialog(false);
      
      // Show success message briefly
      setTimeout(() => {
        // You could add a toast notification here
      }, 1000);
      
    } catch (error) {
      console.error('💥 Error deleting category:', error);
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    // Navigate to edit page with category ID
    router.push(`/dashboard/categories/edit/${category.id}`);
  };

  return (
    <>
      <tr>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="text-sm font-medium text-gray-900">
              {category.title}
            </div>
          </div>
        </td>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">{category.numOfProducts}</div>
        </td>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
          <div className="text-sm text-gray-500">{category.createdAt}</div>
        </td>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              category.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {category.status}
          </span>
        </td>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
          <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-900"
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            className="text-red-600 hover:text-red-900"
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </td>
      </tr>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        itemName={category.title}
        isLoading={isDeleting}
        error={deleteError}
      />
    </>
  );
}
