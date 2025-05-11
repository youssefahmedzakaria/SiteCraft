// frontend/src/app/dashboard/analytics/page.tsx
'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar/sidebar'
//import { dashboardAnalyticsByTimespan } from '@/lib/dashboardAnalytics'
import { GeneralAnalyticsCard } from '@/components/dashboard/generalAnalyticsCard'
import { AnimatedChartWrapper } from '@/components/dashboard/charts/AnimatedChartWrapper'
//import { chartDataByTimespan } from '@/lib/chartData'
import { chartDataByTimespan, Timespan } from '@/lib/chartData'
import { dashboardAnalyticsByTimespan } from '@/lib/dashboardAnalytics'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'

import {
  LineChartCard,
  BarChartCard,
  PieChartCard,
  RadarChartCard,
  HorizontalBarChartCard,
  MultiLineChartCard
} from '@/components/dashboard/charts'

import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
export default function AnalyticsPage() {
  
const [selectedSpan, setSelectedSpan] = useState<Timespan>('30')
const currentCharts = chartDataByTimespan[selectedSpan]
const currentMetrics = dashboardAnalyticsByTimespan[selectedSpan]

const axisKey =
  selectedSpan === '7'  ? 'day' :
  selectedSpan === '30' ? 'week' :
                          'month'

const labels: Record<Timespan, string> = {
  '7':   'Last week',
  '30':  'Last month',
  '90':  'Last quarter',
  '365': 'Last year',
}

  // track the chosen date range
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>()
  
  // for now, fall back to “30” if no range (you can wire real lookup later)
  const fallbackSpan = dateRange
    ? undefined
    : '30'
  


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 min-h-screen bg-gray-100 pt-20 md:pt-20 lg:pt-6 lg:ml-80 overflow-auto">
        <div className="container mx-auto px-4 md:px-6">

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Analytics</h1>

          {/* Subtitle + date-range filter button */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-500">
              Track your store's performance and customer insights
            </p>
            {/* <DateRangeFilter
              initialDateRange={dateRange}
              onApply={setDateRange}
            /> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white border-logo-border text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover px-3 py-2 text-sm font-medium flex items-center"
                >
                  {labels[selectedSpan]}
                  <ChevronDown className="ml-2 w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedSpan('7')}>
                  Last week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSpan('30')}>
                  Last month
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSpan('90')}>
                  Last quarter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSpan('365')}>
                  Last year
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Metric cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {currentMetrics.map(item => (
              <GeneralAnalyticsCard key={item.id} analytic={item} />
            ))}
          </div>

          {/* Charts grid */}
          <div className="grid gap-6 sm:grid-cols-2 mb-8">
            <AnimatedChartWrapper delay={0}>
              <LineChartCard
                data={currentCharts.salesData}
                dataKey="sales"
                nameKey={axisKey}
                title="Revenue Overview"
                subtitle="Total by EGP x100"
              />
            </AnimatedChartWrapper>

            <AnimatedChartWrapper delay={40}>
              <BarChartCard
                data={currentCharts.NetProfitData}
                dataKey="sales"
                nameKey={axisKey}
                title="Net Profit"
                subtitle="Total by EGP x100"
              />
            </AnimatedChartWrapper>

            <AnimatedChartWrapper delay={80}>
              <PieChartCard
                data={currentCharts.salesByCategoryData}
                dataKey="value"
                nameKey="status"
                title="Sales by Category"
                subtitle="Distribution by percentage"
              />
            </AnimatedChartWrapper>

            <AnimatedChartWrapper delay={120}>
              <RadarChartCard
                data={currentCharts.customerAcquisitionData}
                dataKey="value"
                nameKey="source"
                title="Customer Acquisition"
                subtitle="Individuals x100"
              />
            </AnimatedChartWrapper>

            <AnimatedChartWrapper delay={160}>
              <HorizontalBarChartCard
                data={currentCharts.topSellingProductsData}
                dataKey="units"
                nameKey="product"
                title="Top Selling Products"
                subtitle="Units Sold x10"
              />
            </AnimatedChartWrapper>

            <AnimatedChartWrapper delay={200}>
              <HorizontalBarChartCard
                data={currentCharts.wishlistTrendsData}
                dataKey="units"
                nameKey="item"
                title="Wish-list Trends"
                subtitle="Saves count x10"
              />
            </AnimatedChartWrapper>

            <div className="sm:col-span-2">
              <AnimatedChartWrapper delay={240}>
                <MultiLineChartCard
                  data={currentCharts.salesByProductData}
                  dataKeys={['Baggy Pants', 'Fit Pants', 'Shorts']}
                  nameKey={axisKey}
                  title="Sales by Product"
                  subtitle="Units Sold x10"
                />
              </AnimatedChartWrapper>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
