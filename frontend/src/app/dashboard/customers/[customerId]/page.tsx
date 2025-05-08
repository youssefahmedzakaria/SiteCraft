'use client';

import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { Sidebar } from "@/components/sidebar/sidebar";
import { Button } from "@/components/ui/button";
import { Customer, customers } from "@/lib/customers";
import { mockOrders, Order } from "@/lib/orders";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye, Search, X, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { CustomerDetailsTableHeader } from "@/components/dashboard/customers/customerDetailsTableHeader";
import { CustomerOrderRecord } from "@/components/dashboard/customers/customerOrderRecord";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CustomerDetailsPage({ params }: { params: { customerId: string } }) {
    const router = useRouter();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [customerOrders, setCustomerOrders] = useState<Order[]>([]);

    // Filter states
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("date-desc");

    // Pagination states
    const [page, setPage] = useState(1);
    const ordersPerPage = 10;

    // Fix the TypeScript error by adding proper type annotation
    const { customerId } = React.use(params as any) as { customerId: string };

    useEffect(() => {
        const foundCustomer = customers.find(c => c.id === customerId);

        if (foundCustomer) {
            setCustomer(foundCustomer);

            // Filter orders that belong to this customer using the customerId field we added
            const filteredOrders = mockOrders.filter(order => order.customerId === customerId);
            setCustomerOrders(filteredOrders);
        } else {
            notFound();
        }
    }, [customerId]);

    const handleBack = () => {
        router.push('/dashboard/customers');
    };

    // Apply filters to orders
    const filteredOrders = useMemo(() => {
        return customerOrders.filter(order => {
            // Apply status filter
            if (statusFilter !== "all" && order.status !== statusFilter) {
                return false;
            }

            // Apply search query (on order ID or payment method)
            if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !order.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            return true;
        }).sort((a, b) => {
            // Apply sorting
            if (sortBy === "date-desc") {
                return b.issueDate.getTime() - a.issueDate.getTime();
            } else if (sortBy === "date-asc") {
                return a.issueDate.getTime() - b.issueDate.getTime();
            } else if (sortBy === "value-desc") {
                return b.total - a.total;
            } else if (sortBy === "value-asc") {
                return a.total - b.total;
            }
            return 0;
        });
    }, [customerOrders, statusFilter, searchQuery, sortBy]);

    // Paginate filtered orders
    const paginatedOrders = useMemo(() => {
        const startIndex = (page - 1) * ordersPerPage;
        return filteredOrders.slice(startIndex, startIndex + ordersPerPage);
    }, [filteredOrders, page, ordersPerPage]);

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [statusFilter, searchQuery, sortBy]);

    if (!customer) {
        return <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-logo-dark-button"></div>
        </div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Customer Details</h1>
                        <h2 className="text-lg md:text-xl text-muted-foreground mt-1">
                            {customer.name} - {customer.email}
                        </h2>
                    </div>
                </div>

                {/* Combined customer info and stats card */}
                <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                    {/* Stats grid with 5 sections */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 border-b border-logo-border">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Customer ID</p>
                            <p className="text-lg font-semibold">#{customer.id}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Total Orders</p>
                            <p className="text-2xl font-semibold">{customer.orders}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Total Spent</p>
                            <p className="text-lg font-semibold">EGP {customer.totalSpent.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                            <p className="text-lg font-semibold">
                                {customerOrders.length > 0
                                    ? `EGP ${(customerOrders.reduce((sum, order) => sum + order.total, 0) / customerOrders.length).toFixed(2)}`
                                    : 'EGP 0.00'
                                }
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Recent Order</p>
                            <p className="text-lg font-semibold">
                                {customerOrders.length > 0
                                    ? format(new Date(Math.max(...customerOrders.map(o => o.issueDate.getTime()))), "MMM d, yyyy")
                                    : 'N/A'
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Orders List Section */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">Order History</h3>

                    {/* Filters and search - styled like customer page */}
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search orders..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Button
                                    variant="outline"
                                    onClick={() => setStatusFilter("all")}
                                    className={statusFilter === "all"
                                        ? "bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
                                        : "text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"}
                                >
                                    All
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setStatusFilter("Pending")}
                                    className={statusFilter === "Pending"
                                        ? "bg-yellow-600 text-white hover:bg-yellow-700"
                                        : "text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"}
                                >
                                    Pending
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setStatusFilter("Processing")}
                                    className={statusFilter === "Processing"
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"}
                                >
                                    Processing
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setStatusFilter("Shipped")}
                                    className={statusFilter === "Shipped"
                                        ? "bg-purple-600 text-white hover:bg-purple-700"
                                        : "text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"}
                                >
                                    Shipped
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setStatusFilter("Delivered")}
                                    className={statusFilter === "Delivered"
                                        ? "bg-green-600 text-white hover:bg-green-700"
                                        : "text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"}
                                >
                                    Delivered
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="date-desc">Newest First</SelectItem>
                                        <SelectItem value="date-asc">Oldest First</SelectItem>
                                        <SelectItem value="value-desc">Highest Value</SelectItem>
                                        <SelectItem value="value-asc">Lowest Value</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {(statusFilter !== "all" || searchQuery || sortBy !== "date-desc") && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setStatusFilter("all");
                                        setSearchQuery("");
                                        setSortBy("date-desc");
                                    }}
                                    className="w-full sm:w-auto"
                                >
                                    Reset Filters
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Orders Table */}
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
                                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                            {customerOrders.length > 0 ? 'No orders match your filters.' : 'No orders found for this customer.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredOrders.length > 0 && (
                        <div className="py-4 px-6 border-b border-t border-logo-border bg-white rounded-b-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-muted-foreground">
                                Showing <span className="font-medium">{filteredOrders.length > 0 ? (page - 1) * ordersPerPage + 1 : 0}</span> to{" "}
                                <span className="font-medium">
                                    {Math.min(page * ordersPerPage, filteredOrders.length)}
                                </span>{" "}
                                of <span className="font-medium">{filteredOrders.length}</span> orders
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
                                    // Show pagination numbers centered around current page
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