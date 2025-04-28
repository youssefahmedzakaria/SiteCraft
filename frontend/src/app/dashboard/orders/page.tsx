"use client";

import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar/sidebar";
import Image from "next/image";
import { SearchBar } from "@/components/ui/searchBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { mockOrders } from "@/lib/orders";
import { OrderRecord } from "@/components/dashboard/orders/orderRecord";
import { OrderTableHeader } from "@/components/dashboard/orders/orderTableHeader";

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

  const handleStatusSelect = (title: string) => {
    setStatusFilter(title);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        <h1 className="text-2xl md:text-3xl font-bold mt-2">
          Order Management
        </h1>

        {/* Header section */}
        <h2 className="text-lg md:text-xl font-semibold">
          Manage and view your store's orders
        </h2>

        {/* Search and filters */}
        <div className="border-t border-logo-border mt-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              {/* Search Bar */}
              <SearchBar placeholder="Search orders" />

              {/* Date Range Picker */}
              {/* <DateRangePicker
                date={dateRange}
                onDateChange={setDateRange}
                className="w-full sm:w-auto"
              /> */}

              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
                  >
                    <span className="ml-2">
                      {orderStatuses.find((status) => statusFilter === status)}
                    </span>
                    <Image
                      src="/icons/dropdown-colored.svg"
                      alt="Dropdown Icon"
                      width={20}
                      height={20}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {orderStatuses.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => handleStatusSelect(status)}
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* Export button */}
            <Button className="w-full sm:w-auto bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover">
              <span>Export Orders</span>
            </Button>
          </div>

          {/* Order listing table */}
          <div className="mt-6 border rounded-lg border-logo-border overflow-y-auto overflow-x-auto">
            <table className="min-w-full divide-y divide-logo-border">
              <OrderTableHeader />
              <tbody className="bg-white divide-y divide-logo-border">
                {/* Sample order rows */}
                {mockOrders.map((order) => (
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
