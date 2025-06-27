"use client";

import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import { Button } from "@/components/SiteCraft/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrder, Order } from "@/lib/orders";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError("");
      try {
        const fetchedOrder = await getOrder(Number(orderId));
        setOrder(fetchedOrder);
      } catch (err: any) {
        setError(err.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

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
          <h1 className="text-2xl md:text-3xl font-bold">Order Details</h1>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-lg md:text-xl text-gray-600">Order ID: {orderId}</h2>
            <div className="flex flex-wrap gap-2 md:flex-col lg:flex-row md:items-center justify-end">
              <Link href={`/dashboard/orders/${orderId}/edit`} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover">
                  Edit Status
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "Processing"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "Shipped"
                    ? "bg-purple-100 text-purple-800"
                    : order.status === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span>{format(new Date(order.issueDate), "MMM dd, yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span>{order.paymentLog?.method || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tracking Number:</span>
                <span>N/A</span>
              </div>
            </div>
          </div>
          {/* Customer Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="text-gray-600">Name:</span>
                <p>{order.customer?.name || "N/A"}</p>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-600">Email:</span>
                <p>{order.customer?.email || "N/A"}</p>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-600">Phone:</span>
                <p>{order.customer?.phone || "N/A"}</p>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-600">Address:</span>
                <p>{order.shipping?.address?.title || "N/A"}</p>
              </div>
            </div>
          </div>
          {/* Order Items */}
          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Item</th>
                    <th className="text-right py-2">Quantity</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderProducts && order.orderProducts.length > 0 ? (
                    order.orderProducts.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2">{item.product?.name || "N/A"}</td>
                        <td className="text-right py-2">{item.quantity}</td>
                        <td className="text-right py-2">{item.price.toFixed(2)} EGP</td>
                        <td className="text-right py-2">{(item.price * item.quantity).toFixed(2)} EGP</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="text-center py-4">No items found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
