'use client'

import { Sidebar } from '@/components/sidebar/sidebar'
import { dashboardAnalytics } from '@/lib/dashboardAnalytics'
import { GeneralAnalyticsCard } from '@/components/dashboard/generalAnalyticsCard'
import { TimeSpanDropdown } from '@/components/TimeSpanDropdown'
import { AnimatedChartWrapper } from '@/components/dashboard/charts/AnimatedChartWrapper'


import {
  LineChartCard,
  BarChartCard,
  PieChartCard,
  RadarChartCard,
  HorizontalBarChartCard,
  MultiLineChartCard
} from '@/components/dashboard/charts'

import {
  salesData,
  salesByCategoryData,
  customerAcquisitionData,
  topSellingProductsData,
  wishlistTrendsData,
  salesByProductData,
  NetProfitData
} from '@/lib/chartData'

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 lg:ml-80 pt-20 md:pt-20 lg:pt-6 bg-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
            <p className="text-gray-500 mt-2">Track your store's performance and customer insights</p>
          </div>
          <TimeSpanDropdown />
        </div>

        {/* Metrics cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {dashboardAnalytics.map((item) => (
            <GeneralAnalyticsCard key={item.id} analytic={item} />
          ))}
        </div>

        {/* Charts section */}
        <div className="grid gap-6 sm:grid-cols-2 mb-8">
          <AnimatedChartWrapper delay={0}>
            <LineChartCard
              data={salesData}
              dataKey="sales"
              nameKey="month"
              title="Revenue Overview"
              subtitle="Total by EGP x100"
            />
          </AnimatedChartWrapper>

          <AnimatedChartWrapper delay={40}>
            <BarChartCard
              data={NetProfitData}
              dataKey="sales"
              nameKey="month"
              title="Net Profit"
              subtitle="Total by EGP x100"
            />
          </AnimatedChartWrapper>

          <AnimatedChartWrapper delay={80}>
            <PieChartCard
              data={salesByCategoryData}
              dataKey="value"
              nameKey="status"
              title="Sales by Category"
              subtitle="Distribution by percentage"
            />
          </AnimatedChartWrapper>

          <AnimatedChartWrapper delay={120}>
            <RadarChartCard
              data={customerAcquisitionData}
              dataKey="value"
              nameKey="source"
              title="Customer Acquisition"
              subtitle="Individuals x100"
            />
          </AnimatedChartWrapper>

          <AnimatedChartWrapper delay={160}>
            <HorizontalBarChartCard
              data={topSellingProductsData}
              dataKey="units"
              nameKey="product"
              title="Top Selling Products"
              subtitle="Units Sold x10"
            />
          </AnimatedChartWrapper>

          <AnimatedChartWrapper delay={200}>
            <HorizontalBarChartCard
              data={wishlistTrendsData}
              dataKey="units"
              nameKey="item"
              title="Wish-list Trends"
              subtitle="Saves count x10"
            />
          </AnimatedChartWrapper>

          {/* Multi-Line Chart spans both columns */}
          <div className="sm:col-span-2">
            <AnimatedChartWrapper delay={240}>
              <MultiLineChartCard
                data={salesByProductData}
                dataKeys={['Baggy Pants', 'Fit Pants', 'Shorts']}
                nameKey="month"
                title="Sales by Product"
                subtitle="Units Sold x10"
              />
            </AnimatedChartWrapper>
          </div>
        </div>
      </main>
    </div>
  )
}