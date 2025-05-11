// frontend/src/app/dashboard/overview/page.tsx
"use client";

import React, { FC } from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import type { Order, TopProduct } from "@/lib/overviewData";
import {
  todaysOrders,
  dailySales,
  topSellingProducts,
} from "@/lib/overviewData";
import { AnimatedChartWrapper } from "@/components/dashboard/charts/AnimatedChartWrapper";
import { BarChartCard } from "@/components/dashboard/charts/BarChartCard";

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
    case "completed":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800";
    case "pending":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800";
    case "processing":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800";
    case "cancelled":
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800";
    default:
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800";
  }
};

const OrderRecord: FC<{ order: Order }> = ({ order }) => (
  <tr className="hover:bg-logo-light-button-hover">
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
      {order.id}
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
      {order.customer}
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
      e£{order.total.toFixed(2)}
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
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        {/* Header section with title and subtitle */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Overview</h1>
          <h2 className="text-lg md:text-xl font-semibold text-gray-600">
            Get an overview of your store's performance
          </h2>
        </div>

        {/* 1) Today's Orders */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Today's Orders</h2>
          <div className="border rounded-lg border-logo-border overflow-x-auto">
            <table className="min-w-full divide-y divide-logo-border">
              <OrdersTableHeader />
              <tbody className="bg-white divide-y divide-logo-border">
                {todaysOrders.map((order) => (
                  <OrderRecord key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2) Daily Sales */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Daily Sales</h2>
          {/* Reduced padding to let the chart fill more space */}
          <div className="border rounded-lg border-logo-border bg-white p-1 md:p-2">
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
          </div>
        </section>

        {/* 3) Top Selling Products */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Top Selling Products</h2>
          <div className="border rounded-lg border-logo-border overflow-x-auto">
            <table className="min-w-full divide-y divide-logo-border">
              <ProductsTableHeader />
              <tbody className="bg-white divide-y divide-logo-border">
                {topSellingProducts.map((prod) => (
                  <ProductRecord key={prod.product} product={prod} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
