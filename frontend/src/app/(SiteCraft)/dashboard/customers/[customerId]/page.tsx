/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import { Button } from "@/components/SiteCraft/ui/button";
import { Customer, getCustomers } from "@/lib/customers";
import { Order, getOrders } from "@/lib/orders";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Search,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { CustomerDetailsTableHeader } from "@/components/SiteCraft/dashboard/customers/customerDetailsTableHeader";
import { CustomerOrderRecord } from "@/components/SiteCraft/dashboard/customers/customerOrderRecord";
import { SearchBar } from "@/components/SiteCraft/ui/searchBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/SiteCraft/ui/dropdown-menu";
import { FilterButton } from "@/components/SiteCraft/dashboard/orders/ordersFilter";

export default function CustomerDetailsPage({
  params,
}: {
  params: { customerId: string };
}) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All Statuses");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [dateRange, setDateRange] = useState<
    { from: Date; to: Date } | undefined
  >(undefined);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const ordersPerPage = 10;

  const { customerId } = React.use(params as any) as { customerId: string };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");
        
        // Fetch all customers from API and find the specific one
        try {
          const allCustomers = await getCustomers();
          const foundCustomer = allCustomers.find(c => c.id === parseInt(customerId));
          if (foundCustomer) {
            setCustomer(foundCustomer);
          } else {
            setError('Customer not found.');
            setIsLoading(false);
            return;
          }
        } catch (err: any) {
          console.error('Error fetching customers:', err);
          setError('Failed to load customer details. Please check if the backend server is running.');
          setIsLoading(false);
          return;
        }

        // Fetch orders from API
        try {
          const orders = await getOrders();
          setAllOrders(orders);
          
          // Filter orders for this customer
          const filteredOrders = orders.filter(
            (order) => order.customer?.id === parseInt(customerId)
          );
          setCustomerOrders(filteredOrders);
        } catch (err: any) {
          console.error('Error fetching orders:', err);
          setError('Failed to load orders. Using empty order list.');
          // Fallback to empty array - no mock orders for specific customer
          setCustomerOrders([]);
        }
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [customerId]);

  const handleBack = () => {
    router.push("/dashboard/customers");
  };

  const filteredOrders = useMemo(() => {
    return customerOrders
      .filter((order) => {
        if (statusFilter !== "All Statuses" && order.status !== statusFilter) {
          return false;
        }
        if (
          searchQuery &&
          !order.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) &&
          !(order.paymentLog?.method || '').toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        if (
          dateRange &&
          (new Date(order.issueDate) < dateRange.from || new Date(order.issueDate) > dateRange.to)
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "date-desc") {
          return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
        } else if (sortBy === "date-asc") {
          return new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
        } else if (sortBy === "value-desc") {
          return (b.price || 0) - (a.price || 0);
        } else if (sortBy === "value-asc") {
          return (a.price || 0) - (b.price || 0);
        }
        return 0;
      });
  }, [customerOrders, statusFilter, searchQuery, sortBy, dateRange]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (page - 1) * ordersPerPage;
    return filteredOrders.slice(startIndex, startIndex + ordersPerPage);
  }, [filteredOrders, page, ordersPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchQuery, sortBy, dateRange]);

  const handleFiltersApply = (filters: {
    status: string;
    dateRange: { from: Date; to: Date } | undefined;
  }) => {
    setStatusFilter(
      filters.status === "All Statuses" ? "All Statuses" : filters.status
    );
    setDateRange(filters.dateRange);
  };

  const orderStatuses = [
    "All Statuses",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const clearError = () => setError("");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading customer details...</span>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Customer not found</h2>
          <Button onClick={handleBack} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Customer Details</h1>
          <h2 className="text-lg md:text-xl text-gray-600">
            {customer.name} - {customer.email}
          </h2>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden mb-6 flex items-center justify-between py-6 px-10">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-semibold">{customerOrders.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-lg font-semibold">
              EGP {customerOrders.reduce((sum, order) => sum + (order.price || 0), 0).toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Avg. Order Value</p>
            <p className="text-lg font-semibold">
              {customerOrders.length > 0
                ? `EGP ${(customerOrders.reduce((sum, order) => sum + (order.price || 0), 0) / customerOrders.length).toFixed(2)}`
                : "EGP 0.00"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Recent Order</p>
            <p className="text-lg font-semibold">
              {customerOrders.length > 0
                ? format(
                    new Date(
                      Math.max(
                        ...customerOrders.map((o) => new Date(o.issueDate).getTime())
                      )
                    ),
                    "MMM d, yyyy"
                  )
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Order History</h3>

          <div className="border-t border-logo-border mt-6 mb-3 space-y-2 pt-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <SearchBar 
                placeholder="Search orders..." 
                value={searchQuery}
                onChange={setSearchQuery}
              />
              <FilterButton
                onApplyFilters={handleFiltersApply}
                statuses={orderStatuses}
                initialStatus={statusFilter}
                initialDateRange={dateRange}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
                  >
                    <span className="ml-2">
                      {sortBy === "date-desc"
                        ? "Newest First"
                        : sortBy === "date-asc"
                        ? "Oldest First"
                        : sortBy === "value-desc"
                        ? "Highest Value"
                        : "Lowest Value"}
                    </span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy("date-desc")}>
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("date-asc")}>
                    Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("value-desc")}>
                    Highest Value
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("value-asc")}>
                    Lowest Value
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {(statusFilter !== "All Statuses" ||
              searchQuery ||
              sortBy !== "date-desc" ||
              dateRange) && (
              <div className="flex items-center gap-2 mt-4">
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
                        setStatusFilter("All Statuses");
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                {searchQuery && (
                  <div className="flex bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm gap-1 items-center">
                    <span>Search: {searchQuery}</span>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                {dateRange && (
                  <div className="flex bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm gap-1 items-center">
                    <span>
                      Date: {format(dateRange.from, "MMM d, yyyy")} -{" "}
                      {format(dateRange.to, "MMM d, yyyy")}
                    </span>
                    <button
                      onClick={() => {
                        const resetFilters = {
                          status: statusFilter,
                          dateRange: undefined,
                        };
                        setDateRange(undefined);
                        handleFiltersApply(resetFilters);
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border rounded-lg border-logo-border overflow-hidden">
            <table className="min-w-full divide-y divide-logo-border">
              <CustomerDetailsTableHeader />
              <tbody className="bg-white divide-y divide-logo-border">
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <CustomerOrderRecord key={order.id} order={order} />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      {customerOrders.length > 0
                        ? "No orders match your filters."
                        : "No orders found for this customer."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredOrders.length > 0 && (
            <div className="py-4 px-6 border-b border-t border-logo-border bg-white rounded-b-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium">
                  {filteredOrders.length > 0
                    ? (page - 1) * ordersPerPage + 1
                    : 0}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(page * ordersPerPage, filteredOrders.length)}
                </span>{" "}
                of <span className="font-medium">{filteredOrders.length}</span>{" "}
                orders
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5 && page > 3) {
                    pageNum = Math.min(page - 2 + i, totalPages - 4 + i);
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      className="h-8 w-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages || totalPages === 0}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
