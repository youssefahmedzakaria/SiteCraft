// frontend/src/app/dashboard/overview/page.tsx
"use client";

import React, { FC, useEffect, useState } from "react";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import type { Order, TopProduct, DailySale } from "@/lib/overview";
import { AnimatedChartWrapper } from "@/components/SiteCraft/dashboard/analytics/charts/AnimatedChartWrapper";
import { BarChartCard } from "@/components/SiteCraft/dashboard/analytics/charts/BarChartCard";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { getFirstAccessiblePage } from "@/lib/sidebarElements";
import { useProductStatistics } from "@/hooks/useProductStatistics";
import { useCategoryManagement } from "@/hooks/useCategoryManagement";
import { useOverview } from "@/hooks/useOverview";
import { getProductAnalyticsFromStats, getCategoryAnalyticsFromStats } from "@/lib/generalAnalytics";
import { GeneralAnalyticsCard } from "@/components/SiteCraft/dashboard/analytics/generalAnalyticsCard";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/SiteCraft/ui/button";
import { useStoreStatus } from "@/hooks/useStoreStatus";

// ─── Table Headers ─────────────────────────────────────────────────────────────

const OrdersTableHeader: FC = () => (
  <thead>
    <tr className="min-w-full divide-y">
      {["Order ", "Customer", "Total", "Status"].map((label) => (
        <th
          key={label}
          scope="col"
          className="px-4 py-4 text-center text-xs font-semibold text-logo-txt uppercase tracking-wider"
        >
          {label}
        </th>
      ))}
    </tr>
  </thead>
);

const ProductsTableHeader: FC = () => (
  <thead>
    <tr className="min-w-full divide-y">
      {/* Center 'Product', keep 'Sales' left */}
      <th
        scope="col"
        className="px-4 py-4 text-center text-xs font-semibold text-logo-txt uppercase tracking-wider"
      >
        Product
      </th>
      <th
        scope="col"
        className="px-4 py-4 text-left  text-xs font-semibold text-logo-txt uppercase tracking-wider"
      >
        Sales
      </th>
    </tr>
  </thead>
);

// ─── Row Components ────────────────────────────────────────────────────────────

const getStatusClass = (status: Order["status"]): string => {
  switch (status.toLowerCase()) {
    case "shipped":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800";
    case "pending":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800";
    case "processing":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800";
    case "cancelled":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800";
    default:
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800";
  }
};

const OrderRecord: FC<{ order: Order }> = ({ order }) => (
  <tr className="hover:bg-logo-light-button-hover">
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
      {order.id}
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
      {order.customer || 'N/A'}
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
      e£{(order.total || 0).toFixed(2)}
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
      <span className={getStatusClass(order.status)}>{order.status}</span>
    </td>
  </tr>
);

const ProductRecord: FC<{ product: TopProduct }> = ({ product }) => (
  <tr className="hover:bg-logo-light-button-hover">
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
      {product.product}
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
      {product.sales}
    </td>
  </tr>
);

// ─── Page Component ────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { isInactive } = useStoreStatus();
  const router = useRouter();
  const { stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useProductStatistics();
  const { statistics: categoryStats, isLoading: categoryStatsLoading, error: categoryStatsError, fetchCategories: refetchCategoryStats } = useCategoryManagement();
  const { 
    orderCount, 
    salesTotal, 
    topProducts, 
    todayOrders, 
    dailySales, 
    isLoading: overviewLoading, 
    error: overviewError, 
    clearError: clearOverviewError, 
    refetch: refetchOverview 
  } = useOverview();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Handle client-side rendering to avoid hydration mismatch
    setIsClient(true);
    
    // If user is staff, redirect to their first accessible page
    if (user && user.role === 'staff') {
      const firstPage = getFirstAccessiblePage(user.role);
      router.push(firstPage);
    }
  }, [user, router]);

  // Show loading while checking authentication
  if (authLoading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please log in to view the overview dashboard.</p>
            <Button 
              onClick={() => router.push('/login')}
              className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has owner role
  if (user?.role !== 'owner') {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to access this page.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Check if store is inactive
  if (isInactive) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Store Inactive</h2>
              <p className="text-gray-600 mb-4">Your store is inactive. Please subscribe to activate your store.</p>
              <Button 
                onClick={() => router.push('/pricing')}
                className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
              >
                Subscribe Now
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show loading state
  if (overviewLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600">Loading overview data...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100 space-y-6">
        {/* Header section with title and subtitle */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Overview</h1>
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-semibold text-gray-600">
              Get an overview of your store's performance
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={refetchOverview}
              disabled={overviewLoading}
              className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${overviewLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {overviewError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{overviewError}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearOverviewError}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        {/* Overview Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <GeneralAnalyticsCard
            analytic={{
              id: 'orders',
              title: "Today's Orders",
              value: orderCount?.toString() ?? '-',
              subtitle: 'Placed today',
            }}
          />
          <GeneralAnalyticsCard
            analytic={{
              id: 'sales',
              title: "Today's Sales",
              value: `EGP ${salesTotal?.toFixed(2) ?? '-'}`,
              subtitle: 'Revenue today',
            }}
          />
        </div>

        {/* 1) Today's Orders */}
        <section>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Today's Orders</h2>
          </div>
          <div className="border rounded-lg border-logo-border overflow-x-auto">
            <table className="min-w-full divide-y divide-logo-border">
              <OrdersTableHeader />
              <tbody className="bg-white divide-y divide-logo-border">
                {todayOrders.length > 0 ? (
                  todayOrders.map((order) => (
                    <OrderRecord key={order.id} order={order} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      No orders today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex flex-col gap-4 md:flex-row">
          {/* Last 7 Days Sales */}
          <section className="flex-1 flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Last 7 Days</h2>
            <div className="flex-1 border rounded-lg border-logo-border bg-white p-1 md:p-2 flex items-center justify-center">
              <div className="w-full max-w-md">
                {dailySales.length === 0 ? (
                  <div className="w-full h-64 flex items-center justify-center text-gray-500 text-lg">
                    No Sales to preview
                  </div>
                ) : (
                  <AnimatedChartWrapper delay={0}>
                    <BarChartCard
                      hideContainerBorder
                      data={dailySales.map((s) => ({
                        date: s.date,
                        sales: s.sales,
                      }))}
                      dataKey="sales"
                      nameKey="date"
                      title=""
                      subtitle=""
                    />
                  </AnimatedChartWrapper>
                )}
              </div>
            </div>
          </section>

          {/* Top Selling Products */}
          <section className="flex-1 flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Top Selling Products</h2>
            <div className="flex-1 border rounded-lg border-logo-border overflow-x-auto">
              <table className="min-w-full divide-y divide-logo-border">
                <ProductsTableHeader />
                <tbody className="bg-white divide-y divide-logo-border">
                  {topProducts.length > 0 ? (
                    topProducts.map((prod) => (
                      <ProductRecord key={prod.product} product={prod} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="h-64">
                        <div className="flex items-center justify-center h-full w-full text-gray-500 text-lg">
                          No products sold yet
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
