"use client";
import { Button } from "@/components/SiteCraft/ui/button";
import { Order } from "@/lib/orders";
import Link from "next/link";
import { format } from "date-fns";

export function OrderRecord({ order }: { order: Order }) {
  return (
    <>
      <tr>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap">{order.id}</td>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
          {order.customer?.name || 'N/A'}
        </td>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
          {order.issueDate ? 
            (() => {
              try {
                const date = new Date(order.issueDate);
                return isNaN(date.getTime()) ? 'N/A' : format(date, "MMM dd, yyyy");
              } catch (error) {
                return 'N/A';
              }
            })() 
            : 'N/A'
          }
        </td>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap">
          {(order.price || 0).toFixed(2)} EGP
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              order.status === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : order.status === "Processing"
                ? "bg-blue-100 text-blue-800"
                : order.status === "Shipped"
                ? "bg-purple-100 text-purple-800"
                : order.status === "Delivered"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {order.status}
          </span>
        </td>
        <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
          <Link href={`/dashboard/orders/${order.id}`}>
            <Button
              variant="ghost"
              className="text-green-600 hover:text-green-900"
            >
              View
            </Button>
          </Link>
          <Link href={`/dashboard/orders/${order.id}/edit`}>
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-900"
            >
              Edit Status
            </Button>
          </Link>
        </td>
      </tr>
    </>
  );
}
