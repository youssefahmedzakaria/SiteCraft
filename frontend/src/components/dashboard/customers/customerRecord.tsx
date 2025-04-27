import { Button } from "@/components/ui/button";
import { Customer } from "@/lib/customers";
import { useState } from "react";
import { DeleteConfirmationDialog } from "@/components/ui/deleteConfirmationDialog";
import Link from "next/link";

export function CustomerRecord({ customer }: { customer: Customer }) {
    const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);

    const handleSuspendCustomer = () => {
        // In a real app, this would make an API call
        console.log("Suspending customer:", customer.id);
        setSuspendDialogOpen(false);
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <tr>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-1/12">
                <div className="text-sm font-medium text-gray-900">#{customer.id}</div>
            </td>

            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-2/12">
                <div className="flex items-center justify-center">
                    <div className="h-8 w-8 mr-2 rounded-full flex items-center justify-center bg-logo-light-button text-logo-txt">
                        {getInitials(customer.name)}
                    </div>
                    <div className="text-sm font-medium">{customer.name}</div>
                </div>
            </td>

            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-2/12">
                <div className="text-sm text-gray-500">{customer.email}</div>
            </td>

            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell w-1/12">
                <div className="text-sm text-gray-500">{customer.orders}</div>
            </td>

            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell w-2/12">
                <div className="text-sm text-gray-500">EGP {customer.totalSpent.toLocaleString()}</div>
            </td>

            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-1/12">
                <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                >
                    {customer.status}
                </span>
            </td>

            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-3/12">
                <div className="flex items-center justify-center space-x-3">
                    <Link href={`/dashboard/customers/order-history/${customer.id}`} passHref>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-900"
                        >
                            View Details
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-900"
                        onClick={() => setSuspendDialogOpen(true)}
                        disabled={customer.status === "Suspended"}
                    >
                        Suspend
                    </Button>
                </div>
            </td>

            {/* Suspend Confirmation Dialog */}
            <DeleteConfirmationDialog
                isOpen={suspendDialogOpen}
                onClose={() => setSuspendDialogOpen(false)}
                onConfirm={handleSuspendCustomer}
                title="Suspend Customer"
                description="Are you sure you want to suspend this customer? They will no longer be able to place orders or access their account."
                itemName={`${customer.name} (${customer.email})`}
            />
        </tr>
    );
}