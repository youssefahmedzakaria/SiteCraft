/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/ui/button";
import { Category } from "@/lib/categories";
import { use, useState } from "react";
import { DeleteConfirmationDialog } from "@/components/ui/deleteConfirmationDialog";

export function CategoryRecord({ category }: { category: Category }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    // Implement actual delete logic here
    console.log(`Deleting category: ${category.title}`);
    setShowDeleteDialog(false);
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
          <div className="text-sm text-gray-500">{category.numOfProducts}</div>
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
          <Button variant="ghost" className="text-blue-600 hover:text-blue-900">
            Edit
          </Button>
          <Button
            variant="ghost"
            className="text-red-600 hover:text-red-900"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
          </Button>
        </td>
      </tr>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? All products in this category will be moved to 'Uncategorized'."
        itemName={category.title}
      />
    </>
  );
}
