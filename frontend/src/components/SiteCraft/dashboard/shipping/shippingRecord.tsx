"use client";
import { Button } from "@/components/SiteCraft/ui/button";
import { ShippingInfo } from "@/lib/shipping";
import { DeleteConfirmationDialog } from "@/components/SiteCraft/ui/deleteConfirmationDialog";
import Link from "next/link";
import { useState } from "react";

interface ShippingRecordProps {
  shipping: ShippingInfo;
  onDelete: (shippingId: number) => Promise<void>;
}

export function ShippingRecord({ shipping, onDelete }: ShippingRecordProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      console.log('🗑️ Deleting shipping info:', shipping);
      
      await onDelete(shipping.id!);
      console.log('✅ Shipping info deleted successfully');
      
    } catch (error) {
      console.error('❌ Failed to delete shipping info:', error);
      alert(`Failed to delete shipping info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <tr>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-1/12">
        <div className="text-sm font-medium text-gray-900">{shipping.id}</div>
      </td>

      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-3/12">
        <div className="text-sm text-gray-900">{shipping.governmentName}</div>
      </td>

      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell w-2/12">
        <div className="text-sm text-gray-500">EGP {shipping.shippingPrice}</div>
      </td>

      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell w-3/12">
        <div className="text-sm text-gray-500">
          {shipping.estimatedDeliveryTime}
        </div>
      </td>

      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-3/12">
        <div className="flex items-center justify-center space-x-3">
          <Link href={`/dashboard/shipping/edit?id=${shipping.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-900"
            >
              Edit
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-900"
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>

          <DeleteConfirmationDialog
            isOpen={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            onConfirm={handleDelete}
            title="Delete Shipping Location"
            description="Are you sure you want to delete this shipping location? This action cannot be undone."
            itemName={shipping.governmentName}
          />
        </div>
      </td>
    </tr>
  );
}
