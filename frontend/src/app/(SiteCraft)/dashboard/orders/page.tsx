"use client";

import { Button } from "@/components/SiteCraft/ui/button";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import { SearchBar } from "@/components/SiteCraft/ui/searchBar";
import { useState } from "react";
import { mockOrders } from "@/lib/orders";
import { OrderRecord } from "@/components/SiteCraft/dashboard/orders/orderRecord";
import { OrderTableHeader } from "@/components/SiteCraft/dashboard/orders/orderTableHeader";
import { FilterButton } from "@/components/SiteCraft/dashboard/orders/ordersFilter";
import { format } from "date-fns";
import { X } from "lucide-react";

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("All Statuses");
  const [dateRange, setDateRange] = useState<
    { from: Date; to: Date } | undefined
  >();

  const orderStatuses = [
    "All Statuses",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const handleFiltersApply = (filters: {
    status: string;
    dateRange: { from: Date; to: Date } | undefined;
  }) => {
    setStatusFilter(filters.status);
    setDateRange(filters.dateRange);
  };

  // Filter orders based on selected filters
  const filteredOrders = mockOrders.filter((order) => {
    // Filter by status
    if (statusFilter !== "All Statuses" && order.status !== statusFilter) {
      return false;
    }

    // Filter by date range
    if (dateRange?.from && dateRange?.to) {
      const orderDate = new Date(order.issueDate);
      if (orderDate < dateRange.from || orderDate > dateRange.to) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        {/* Header section */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Order Management</h1>
          <h2 className="text-lg md:text-xl font-semibold text-gray-600">
            Manage and view your store's orders
          </h2>
        </div>

        <div className="border-t border-logo-border mt-6 space-y-2 pt-3">
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            {/* Search Bar */}
            <SearchBar placeholder="Search orders" />

            {/* Filter Button */}
            <FilterButton
              onApplyFilters={handleFiltersApply}
              statuses={orderStatuses}
              initialStatus={statusFilter}
              initialDateRange={dateRange}
            />

            {/* Export button */}
            <Button className="w-full sm:w-auto bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover">
              <span>Export Orders</span>
            </Button>
          </div>

          {/* Active filter indicators */}
          {(statusFilter !== "All Statuses" || dateRange) && (
            <div className="flex items-center gap-2">
              {statusFilter !== "All Statuses" && (
                <div
                  className={`flex px-3 py-1 rounded-full text-sm gap-1 items-center ${
                    statusFilter === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : statusFilter === "Processing"
                      ? "bg-blue-100 text-blue-800"
                      : statusFilter === "Shipped"
                      ? "bg-purple-100 text-purple-800"
                      : statusFilter === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <span>{statusFilter}</span>
                  <button
                    onClick={() => {
                      const resetFilters = {
                        status: "All Statuses",
                        dateRange: dateRange,
                      };

                      setStatusFilter(resetFilters.status);

                      // Apply the reset filters immediately
                      handleFiltersApply(resetFilters);
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              {dateRange && (
                <div className="flex bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm gap-1 items-center">
                  <span>
                    {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                    {format(dateRange.to, "MMM dd, yyyy")}
                  </span>
                  <button
                    onClick={() => {
                      const resetFilters = {
                        status: statusFilter,
                        dateRange: undefined,
                      };

                      setDateRange(resetFilters.dateRange);

                      // Apply the reset filters immediately
                      handleFiltersApply(resetFilters);
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Order listing table */}
          <div className="border rounded-lg border-logo-border overflow-y-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-logo-border">
              <OrderTableHeader />
              <tbody className="bg-white divide-y divide-logo-border">
                {/* Sample order rows */}
                {filteredOrders.map((order) => (
                  <OrderRecord key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
