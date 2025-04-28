"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { CustomerTableHeader } from "@/components/dashboard/customers/customerHeader";
import { CustomerRecord } from "@/components/dashboard/customers/customerRecord";
import { customers } from "@/lib/customers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserCheck, UserX, Users } from "lucide-react";

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

      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Customers</h1>

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
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "All" ? "default" : "outline"}
                onClick={() => setStatusFilter("All")}
                className={statusFilter === "All" ? "bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover" : ""}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "Active" ? "default" : "outline"}
                onClick={() => setStatusFilter("Active")}
                className={statusFilter === "Active" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "Suspended" ? "default" : "outline"}
                onClick={() => setStatusFilter("Suspended")}
                className={statusFilter === "Suspended" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                Suspended
              </Button>
            </div>
          </div>
        </div>

        {/* Customers table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <CustomerTableHeader />
              <tbody className="bg-white divide-y divide-gray-200">
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
        </div>
      </main>
    </div>
  );
}