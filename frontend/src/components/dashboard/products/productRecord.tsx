"use client";

import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/ui/deleteConfirmationDialog";
import { Product, products } from "@/lib/products";
import Link from "next/link";
import { useState } from "react";

export function ProductRecord({ product }: { product: Product }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    // Implement actual delete logic here
    console.log(`Deleting product: ${product.name}`);
    setShowDeleteDialog(false);
  };

  return (
    <tr>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">{product.id}</div>
        </div>
      </td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{product.name}</div>
      </td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
        <div className="text-sm text-gray-500">{product.category}</div>
      </td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
        <div className="text-sm text-gray-500">{product.price}</div>
      </td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
        <div className="text-sm text-gray-500">{product.stock}</div>
      </td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            product.status === "In Stock"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {product.status}
        </span>
      </td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
        <Link href="/dashboard/products/edit">
          <Button variant="ghost" className="text-blue-600 hover:text-blue-900">
            Edit
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="text-red-600 hover:text-red-900"
          onClick={() => setShowDeleteDialog(true)}
        >
          Delete
        </Button>

        <DeleteConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          title="Delete Product"
          description="Are you sure you want to delete this product?"
          itemName={product.name}
        />
      </td>
    </tr>
  );
}
