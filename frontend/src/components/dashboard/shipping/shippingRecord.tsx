"use client"
import { Button } from '@/components/ui/button'
import { Shipping } from '@/lib/shipping'
import { DeleteConfirmationDialog } from "@/components/ui/deleteConfirmationDialog";
import Link from "next/link";
import { useState } from "react";


export function ShippingRecord({ shipping }: { shipping: Shipping }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDelete = () => {
        console.log(`Deleting shipping area: ${shipping.governorate}`);
        setShowDeleteDialog(false);
    };
    return (
        <tr>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-1/12">
                <div className="text-sm font-medium text-gray-900">{shipping.id}</div>
            </td>

            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-3/12">
                <div className="text-sm text-gray-900">{shipping.governorate}</div>
            </td>

            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell w-2/12">
                <div className="text-sm text-gray-500">EGP {shipping.price}</div>
            </td>

            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell w-3/12">
                <div className="text-sm text-gray-500">{shipping.estimatedDeliveryDays}</div>
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
          >
            Delete
          </Button>

          <DeleteConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          title="Delete Product"
          description="Are you sure you want to delete this shipping area?"
          itemName={shipping.governorate}
        />
                </div>
            </td>
        </tr>
    );
}