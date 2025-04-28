import { Button } from "@/components/ui/button";
import { Customer } from "@/lib/customers";
import { useState } from "react";
import { SuspendConfirmationDialog } from "@/components/ui/SuspendConfirmationDialog";
import Link from "next/link";

export function CustomerRecord({ customer }: { customer: Customer }) {
    const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);

    const handleSuspendCustomer = () => {
        // Logic to suspend the customer goes here
        console.log(`Suspending customer: ${customer.name}`);
        setSuspendDialogOpen(false);
    };


    return (
        <tr>
            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-1/12">
                <div className="text-sm font-medium text-gray-900">{customer.id}</div>
            </td>

            <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-2/12">
                <div className="flex items-center justify-center">
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
            <SuspendConfirmationDialog
                isOpen={suspendDialogOpen}
                onClose={() => setSuspendDialogOpen(false)}
                onConfirm={handleSuspendCustomer}
                customerName={customer.name}
                customerEmail={customer.email}
            />
        </tr>
    );
}