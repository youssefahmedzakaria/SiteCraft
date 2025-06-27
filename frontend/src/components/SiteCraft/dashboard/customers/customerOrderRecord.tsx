"use client";
import { Button } from "@/components/SiteCraft/ui/button";
import { Order } from "@/lib/orders";
import Link from "next/link";
import { format } from "date-fns";
import { Eye } from "lucide-react";

export function CustomerOrderRecord({ order }: { order: Order }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-3 md:px-6 py-4 whitespace-nowrap">{order.id}</td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
        {format(order.issueDate, "MMM dd, yyyy")}
      </td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
        {order.total.toFixed(2)}EGP
      </td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
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
      <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
        {order.paymentMethod}
      </td>
      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
        <Link href={`/dashboard/orders/${order.id}`}>
          <Button variant="ghost" className="text-blue-600 hover:text-blue-900">
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
        </Link>
      </td>
    </tr>
  );
}
