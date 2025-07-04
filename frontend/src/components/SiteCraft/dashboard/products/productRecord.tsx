/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/SiteCraft/ui/button";
import { DeleteConfirmationDialog } from "@/components/SiteCraft/ui/deleteConfirmationDialog";
import type { SimplifiedProduct } from "@/lib/products";
import { deleteProduct } from "@/lib/products";
import Link from "next/link";
import { useState } from "react";

export function ProductRecord({
  product,
  categories = [],
  isSelected = false,
  onSelect,
  fetchProducts
}: {
  product: SimplifiedProduct;
  categories?: any[];
  isSelected?: boolean;
  onSelect?: (id: number) => void;
  fetchProducts?: () => void;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(product.id);
      setShowDeleteDialog(false);
      if (fetchProducts) fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  // Get category name from categoryId
  const getCategoryName = (categoryId: number) => {
    if (!categoryId) return 'Unknown Category';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  // Format price with EGP currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (originalPrice: number, discountType?: string, discountValue?: number) => {
    if (!discountType || !discountValue) return null;
    
    if (discountType.toLowerCase() === 'percentage') {
      return originalPrice * (1 - discountValue / 100);
    } else if (discountType.toLowerCase() === 'amount') {
      return Math.max(0, originalPrice - discountValue);
    }
    return null;
  };

  // Format price with discount display
  const formatPriceWithDiscount = () => {
    const originalPrice = product.price;
    const discountedPrice = calculateDiscountedPrice(originalPrice, product.discountType, product.discountValue);
    
    if (discountedPrice !== null) {
      return (
        <span>
          {formatPrice(originalPrice)} <span className="text-green-600">({formatPrice(discountedPrice)})</span>
        </span>
      );
    }
    
    return formatPrice(originalPrice);
  };

  // Get status based on stock
  const getStatus = (stock: number) => {
    return stock > 0 ? 'In Stock' : 'Out of Stock';
  };

  return (
    <tr className={isSelected ? "bg-blue-50" : ""}>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          className="form-checkbox h-4 w-4 text-blue-600"
          checked={isSelected}
          onChange={() => onSelect && onSelect(product.id)}
        />
      </td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">{product.id}</div>
        </div>
      </td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{product.name}</div>
      </td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
        <div className="text-sm text-gray-500">{getCategoryName(product.categoryId)}</div>
      </td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
        <div className="text-sm text-gray-500">{formatPriceWithDiscount()}</div>
      </td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
        <div className="text-sm text-gray-500">{product.stock}</div>
      </td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            getStatus(product.stock) === "In Stock"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {getStatus(product.stock)}
        </span>
      </td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
        <Link href={`/dashboard/products/edit/${product.id}`}>
          <Button variant="ghost" className="text-blue-600 hover:text-blue-900">
            Edit
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="text-red-600 hover:text-red-900"
          onClick={() => setShowDeleteDialog(true)}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
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
