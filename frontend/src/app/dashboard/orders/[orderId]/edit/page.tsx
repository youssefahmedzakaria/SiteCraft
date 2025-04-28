"use client";

import { Sidebar } from "@/components/sidebar/sidebar";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockOrders } from "@/lib/orders";

const orderStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function EditOrderStatusPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const mockOrder = mockOrders.find((order) => order.id === orderId);
  const [status, setStatus] = useState(mockOrder!.status);

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the order status
    console.log(`Updating order ${orderId} status to ${status}`);
    router.push(`/dashboard/orders`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        <h1 className="text-2xl md:text-3xl font-bold mt-2">
          Edit Order Status
        </h1>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-1 mb-4 gap-4">
          <h2 className="text-lg md:text-xl font-semibold">
            Order ID: {orderId}
          </h2>
          <div className="flex flex-wrap gap-2 md:flex-col lg:flex-row md:items-center justify-end">
            <Button
              className="w-full sm:w-auto bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
              onClick={handleSave}
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
              onClick={() => router.push(`/dashboard/orders`)}
            >
              Cancel
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow w-full">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Current Status</h2>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : status === "Processing"
                    ? "bg-blue-100 text-blue-800"
                    : status === "Shipped"
                    ? "bg-purple-100 text-purple-800"
                    : status === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {status}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Update Status</h2>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {orderStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-yellow-800 font-semibold mb-2">
                Status Guidelines
              </h3>
              <ul className="list-disc list-inside text-yellow-700 space-y-1">
                <li>Pending: Order received but not yet processed</li>
                <li>Processing: Order is being prepared for shipment</li>
                <li>Shipped: Order has been dispatched</li>
                <li>Delivered: Order has been received by the customer</li>
                <li>Cancelled: Order has been cancelled</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
