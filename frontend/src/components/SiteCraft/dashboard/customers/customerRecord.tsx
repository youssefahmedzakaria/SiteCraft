import { Button } from "@/components/SiteCraft/ui/button";
import { Customer } from "@/lib/customers";
import { useState } from "react";
import { SuspendConfirmationDialog } from "@/components/SiteCraft/ui/SuspendConfirmationDialog";
import Link from "next/link";

interface CustomerRecordProps {
  customer: Customer;
  onSuspend: (customerId: number) => Promise<void>;
  isSuspending: boolean;
}

export function CustomerRecord({ customer, onSuspend, isSuspending }: CustomerRecordProps) {
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);

  const handleSuspendCustomer = async () => {
    try {
      await onSuspend(customer.id);
      setSuspendDialogOpen(false);
    } catch (error) {
      console.error('Error suspending customer:', error);
    }
  };

  const getStatusDisplay = (status: string) => {
    return status === 'active' ? 'Active' : 'Suspended';
  };

  const getStatusClass = (status: string) => {
    return status === 'active'
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
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
        <div className="text-sm text-gray-500">{customer.orderCount || 0}</div>
      </td>

      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center hidden sm:table-cell w-2/12">
        <div className="text-sm text-gray-500">
          EGP {(customer.totalSpent || 0).toLocaleString()}
        </div>
      </td>

      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-1/12">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(customer.status)}`}
        >
          {getStatusDisplay(customer.status)}
        </span>
      </td>

      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center w-3/12">
        <div className="flex items-center justify-center space-x-3">
          <Link href={`/dashboard/customers/${customer.id}`} passHref>
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
            disabled={customer.status === "inactive" || isSuspending}
          >
            {isSuspending ? "Suspending..." : "Suspend"}
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
