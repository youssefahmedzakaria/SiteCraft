/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { CustomerTableHeader } from "@/components/dashboard/customers/customerHeader";
import { CustomerRecord } from "@/components/dashboard/customers/customerRecord";
import { customers } from "@/lib/customers";
import { SearchBar } from "@/components/ui/searchBar";
import { Button } from "@/components/ui/button";
import { UserCheck, UserX, Users } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Suspended">("All");

  // Filter customers based on search query and status filter
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus =
      statusFilter === "All" || customer.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  // Count customers by status
  const activeCount = customers.filter(c => c.status === "Active").length;
  const suspendedCount = customers.filter(c => c.status === "Suspended").length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100 min-h-screen">
        {/* Header section with title and subtitle */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Customers</h1>
          <h2 className="text-lg md:text-xl font-semibold mt-2 text-gray-600">Manage your customer relationships and accounts</h2>
        </div>

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
        <div className="border-t border-logo-border mt-6 mb-3 space-y-2 pt-3  ">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            {/* Search Bar - Using the SearchBar component like in products page */}
            <SearchBar placeholder="Search by name or email..." />

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
                >
                  <span className="ml-2">
                    {statusFilter}
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
        </div>

        {/* Customers table  */}
        <div className="border rounded-lg border-logo-border overflow-y-auto overflow-x-auto">
          <table className="min-w-full divide-y divide-logo-border">
            <CustomerTableHeader />
            <tbody className="bg-white divide-y divide-logo-border">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <CustomerRecord key={customer.id} customer={customer} />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No customers found matching your search criteria.
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