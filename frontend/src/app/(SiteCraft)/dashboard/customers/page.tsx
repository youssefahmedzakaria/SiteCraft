/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import { CustomerTableHeader } from "@/components/SiteCraft/dashboard/customers/customerHeader";
import { CustomerRecord } from "@/components/SiteCraft/dashboard/customers/customerRecord";
import { useCustomerManagement } from "@/hooks/useCustomerManagement";
import { SearchBar } from "@/components/SiteCraft/ui/searchBar";
import { Button } from "@/components/SiteCraft/ui/button";
import { ChevronDown, UserCheck, UserX, Users, AlertCircle, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/SiteCraft/ui/dropdown-menu";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Suspended"
  >("All");

  const {
    customers,
    isLoading,
    error,
    isSuspending,
    clearError,
    handleSuspendCustomer,
    refetchCustomers
  } = useCustomerManagement();

  // Filter customers based on search query and status filter
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || 
      (statusFilter === "Active" && customer.status === "active") ||
      (statusFilter === "Suspended" && customer.status === "inactive");

    return matchesSearch && matchesStatus;
  });

  // Count customers by status
  const activeCount = customers.filter((c) => c.status === "active").length;
  const suspendedCount = customers.filter((c) => c.status === "inactive").length;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600">Loading customers...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        {/* Header section with title and subtitle */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Customers</h1>
          <h2 className="text-lg md:text-xl font-semibold text-gray-600">
            Manage your customer relationships and accounts
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

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold">{customers.length}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Customers</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Suspended Customers</p>
              <p className="text-2xl font-bold">{suspendedCount}</p>
            </div>
          </div>
        </div>

        {/* Filters and search */}
        <div className="border-t border-logo-border mt-6 mb-3 space-y-2 pt-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Search Bar */}
            <div className="flex-grow">
              <SearchBar 
                placeholder="Search by name or email..." 
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            {/* Status Filter */}
            <div className="flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
                  >
                    <span className="ml-2">{statusFilter}</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter("All")}> 
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("Active")}> 
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("Suspended")}> 
                    Suspended
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* Refresh Button */}
            <div className="flex-shrink-0">
              <Button
                onClick={refetchCustomers}
                variant="outline"
                className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Customers table */}
        <div className="border rounded-lg border-logo-border overflow-y-auto overflow-x-auto">
          <table className="min-w-full divide-y divide-logo-border">
            <CustomerTableHeader />
            <tbody className="bg-white divide-y divide-logo-border">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <CustomerRecord 
                    key={customer.id} 
                    customer={customer}
                    onSuspend={handleSuspendCustomer}
                    isSuspending={isSuspending === customer.id}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    {customers.length === 0 
                      ? "No customers found. Try refreshing the page."
                      : "No customers found matching your search criteria."
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
