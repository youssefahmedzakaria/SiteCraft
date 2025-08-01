// frontend/src/app/dashboard/analytics/page.tsx
"use client";

import { useState } from "react";
import { Sidebar } from "@/components/SiteCraft/sidebar/sidebar";
import { GeneralAnalyticsCard } from "@/components/SiteCraft/dashboard/analytics/generalAnalyticsCard";
import { AnimatedChartWrapper } from "@/components/SiteCraft/dashboard/analytics/charts/AnimatedChartWrapper";
import {
  LineChartCard,
  BarChartCard,
  PieChartCard,
  RadarChartCard,
  HorizontalBarChartCard,
  MultiLineChartCard,
} from "@/components/SiteCraft/dashboard/analytics/charts";

import { DateRangeFilter } from "@/components/SiteCraft/dashboard/analytics/DateRangeFilter";
import { Button } from "@/components/SiteCraft/ui/button";
import { RefreshCw, AlertCircle, X } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useStoreStatus } from "@/hooks/useStoreStatus";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const { 
    data, 
    isLoading, 
    error, 
    refetch, 
    dateRange, 
    setDateRange 
  } = useAnalytics();

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { isInactive } = useStoreStatus();
  const router = useRouter();

  // Show loading while checking authentication
  if (authLoading) {
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
            <p className="text-gray-600 mb-4">Please log in to view the analytics dashboard.</p>
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
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600">Loading analytics data...</span>
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
        {/* Page header */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-600">
              Track your store's performance and customer insights
            </h2>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                disabled={isLoading}
                className="text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <DateRangeFilter
                initialDateRange={dateRange}
                onApply={setDateRange}
              />
            </div>
          </div>

          {/* Date Range Display */}
          {dateRange && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Showing data for:</span>
              <div className="flex bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm gap-1 items-center">
                <span>
                  {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                  {format(dateRange.to, "MMM dd, yyyy")}
                </span>
                <button
                  onClick={() => setDateRange(undefined)}
                  className="ml-1 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Metric cards */}
        {data && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {data.metrics.map((item) => (
                <GeneralAnalyticsCard key={item.id} analytic={item} />
              ))}
            </div>

            {/* Charts grid */}
            <div className="grid gap-6 sm:grid-cols-2 mb-8">
              {/* Revenue Overview */}
              {data.salesData.length === 0 ? (
                <div className="w-full h-64 flex items-center justify-center text-gray-500 text-lg border rounded-lg border-logo-border bg-white">
                  No sales data to display.
                </div>
              ) : (
                <AnimatedChartWrapper delay={0}>
                  <LineChartCard
                    data={data.salesData}
                    dataKey="sales"
                    nameKey="day"
                    title="Revenue Overview"
                    subtitle="Total sales by period"
                  />
                </AnimatedChartWrapper>
              )}

              {/* Net Profit */}
              {data.netProfitData.length === 0 ? (
                <div className="w-full h-64 flex items-center justify-center text-gray-500 text-lg border rounded-lg border-logo-border bg-white">
                  No profit data to display.
                </div>
              ) : (
                <AnimatedChartWrapper delay={40}>
                  <LineChartCard
                    data={data.netProfitData}
                    dataKey="sales"
                    nameKey="day"
                    title="Net Profit"
                    subtitle="Profit by period"
                  />
                </AnimatedChartWrapper>
              )}

              {/* Sales by Category */}
              {data.salesByCategoryData.length === 0 ? (
                <div className="w-full h-64 flex items-center justify-center text-gray-500 text-lg border rounded-lg border-logo-border bg-white">
                  No category sales data to display.
                </div>
              ) : (
                <AnimatedChartWrapper delay={80}>
                  <PieChartCard
                    data={data.salesByCategoryData}
                    dataKey="value"
                    nameKey="status"
                    title="Sales by Category"
                    subtitle="Distribution by percentage"
                  />
                </AnimatedChartWrapper>
              )}

              {/* Customer Acquisition */}
              {data.customerAcquisitionData.length === 0 ? (
                <div className="w-full h-64 flex items-center justify-center text-gray-500 text-lg border rounded-lg border-logo-border bg-white">
                  No customer acquisition data to display.
                </div>
              ) : (
                <AnimatedChartWrapper delay={120}>
                  <RadarChartCard
                    data={data.customerAcquisitionData}
                    dataKey="value"
                    nameKey="source"
                    title="Customer Acquisition"
                    subtitle="Customers by source"
                  />
                </AnimatedChartWrapper>
              )}

              {/* Top Selling Products */}
              {data.topSellingProductsData.length === 0 ? (
                <div className="w-full h-64 flex items-center justify-center text-gray-500 text-lg border rounded-lg border-logo-border bg-white">
                  No top selling products to display.
                </div>
              ) : (
                <AnimatedChartWrapper delay={160}>
                  <HorizontalBarChartCard
                    data={data.topSellingProductsData}
                    dataKey="units"
                    nameKey="product"
                    title="Top Selling Products"
                    subtitle="Units sold"
                  />
                </AnimatedChartWrapper>
              )}

              {/* Wishlist Trends */}
              {data.wishlistTrendsData.length === 0 ? (
                <div className="w-full h-64 flex items-center justify-center text-gray-500 text-lg border rounded-lg border-logo-border bg-white">
                  No wishlist data to display.
                </div>
              ) : (
                <AnimatedChartWrapper delay={200}>
                  <BarChartCard
                    data={data.wishlistTrendsData}
                    dataKey="units"
                    nameKey="item"
                    title="Wishlist Trends"
                    subtitle="Most wished items"
                  />
                </AnimatedChartWrapper>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
