// frontend/src/app/dashboard/overview/page.tsx
'use client'

import React, { FC } from 'react'
import { Sidebar } from '@/components/sidebar/sidebar'
import type { Order, TopProduct } from '@/lib/overviewData'
import { todaysOrders, dailySales, topSellingProducts } from '@/lib/overviewData'
import { AnimatedChartWrapper } from '@/components/dashboard/charts/AnimatedChartWrapper'
import { BarChartCard } from '@/components/dashboard/charts/BarChartCard'

// ─── Table Headers ─────────────────────────────────────────────────────────────

const OrdersTableHeader: FC = () => (
  <thead>
    <tr className="min-w-full divide-y">
      {['Order #', 'Customer', 'Total', 'Status'].map(label => (
        <th
          key={label}
          scope="col"
          className="px-4 py-4 text-left text-xs font-semibold text-logo-txt uppercase tracking-wider"
        >
          {label}
        </th>
      ))}
    </tr>
  </thead>
)

const ProductsTableHeader: FC = () => (
  <thead>
    <tr className="min-w-full divide-y">
      {['Product', 'Sales'].map(label => (
        <th
          key={label}
          scope="col"
          className="px-4 py-4 text-left text-xs font-semibold text-logo-txt uppercase tracking-wider"
        >
          {label}
        </th>
      ))}
    </tr>
  </thead>
)

// ─── Row Components ────────────────────────────────────────────────────────────

const getStatusClass = (status: Order['status']): string => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
    case 'pending':
      return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'
    case 'processing':
      return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
    case 'cancelled':
      return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'
    default:
      return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
  }
}

const OrderRecord: FC<{ order: Order }> = ({ order }) => (
  <tr className="hover:bg-logo-light-button-hover">
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
      e£{order.total.toFixed(2)}
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-sm">
      <span className={getStatusClass(order.status)}>
        {order.status}
      </span>
    </td>
  </tr>
)

const ProductRecord: FC<{ product: TopProduct }> = ({ product }) => (
  <tr className="hover:bg-logo-light-button-hover">
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{product.product}</td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{product.sales}</td>
  </tr>
)

// ─── Page Component ────────────────────────────────────────────────────────────

export default function OverviewPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-6 bg-gray-100">
        <div className="container mx-auto px-4 md:px-6 space-y-8 pb-4 md:pb-8">

          {/* Page Title */}
          <h1 className="text-2xl md:text-3xl font-bold">Overview</h1>

          {/* Today's Orders */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Today's Orders</h2>
            <div className="border rounded-lg border-logo-border overflow-x-auto">
              <table className="min-w-full divide-y divide-logo-border">
                <OrdersTableHeader />
                <tbody className="bg-white divide-y divide-logo-border">
                  {todaysOrders.map(o => <OrderRecord key={o.id} order={o} />)}
                </tbody>
              </table>
            </div>
          </section>

          {/* Daily Sales */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Daily Sales</h2>
            <div className="border rounded-lg border-logo-border bg-white p-4 md:p-6">
              <AnimatedChartWrapper delay={0}>
                <BarChartCard
                  hideContainerBorder
                  data={dailySales.map(s => ({ date: s.date, sales: s.sales }))}
                  dataKey="sales"
                  nameKey="date"
                  title=""
                  subtitle=""
                />
              </AnimatedChartWrapper>
            </div>
          </section>

          {/* Top Selling Products */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Top Selling Products</h2>
            <div className="border rounded-lg border-logo-border overflow-x-auto">
              <table className="min-w-full divide-y divide-logo-border">
                <ProductsTableHeader />
                <tbody className="bg-white divide-y divide-logo-border">
                  {topSellingProducts.map(p => <ProductRecord key={p.product} product={p} />)}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}