"use client";

import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import { Button } from "@/components/SiteCraft/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/SiteCraft/ui/select";
import { getOrder, updateOrderStatus, Order } from "@/lib/orders";

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
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError("");
      try {
        const fetchedOrder = await getOrder(Number(orderId));
        setOrder(fetchedOrder);
        setStatus(fetchedOrder.status);
      } catch (err: any) {
        setError(err.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const handleSave = async () => {
    if (!order) return;
    setSaving(true);
    setError("");
    try {
      await updateOrderStatus(Number(orderId), status);
      router.push(`/dashboard/orders`);
    } catch (err: any) {
      setError(err.message || "Failed to update order status");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <span className="text-lg text-gray-600">Loading order...</span>
          </div>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <span className="text-lg text-red-600">{error || "Order not found."}</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        {/* Header section */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Edit Order Status</h1>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-lg md:text-xl text-gray-600">Order ID: {orderId}</h2>
            <div className="flex flex-wrap gap-2 md:flex-col lg:flex-row md:items-center justify-end">
              <Button
                className="w-full sm:w-auto bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
                onClick={() => router.push(`/dashboard/orders`)}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
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
              <h3 className="text-yellow-800 font-semibold mb-2">Status Guidelines</h3>
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
