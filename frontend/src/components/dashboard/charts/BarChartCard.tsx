// frontend/src/components/dashboard/charts/BarChartCard.tsx
'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import { useEffect, useState } from 'react'
import type { FC } from 'react'
import type { Datum } from '@/lib/chartData'

interface BarChartCardProps {
  data: Datum[]
  dataKey: string
  nameKey: string
  title: string
  subtitle?: string
  colors?: string[]
  /** When true, skip this card’s own border/padding wrapper */
  hideContainerBorder?: boolean
}

export const BarChartCard: FC<BarChartCardProps> = ({
  data,
  dataKey,
  nameKey,
  title,
  subtitle,
  colors = ['#cc7860', '#5d8aa8', '#6b8e23', '#b8860b', '#8b4513'],
  hideContainerBorder = false,
}) => {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Only abbreviate month names on narrow screens
  const tickFormatter = (value: string) => {
    if (nameKey === 'month' && windowWidth < 640) {
      return value.substring(0, 3)
    }
    return value
  }

  // Tilt labels on smaller/tablet sizes
  const xAxisProps =
    windowWidth < 1025
      ? { interval: 1, angle: -45, dy: 10 }
      : { interval: 0, angle: 0, dy: 0 }

  // Pull legend down tighter on mobile
  const bottomMargin = windowWidth < 768 ? 5 : 20

  // Derive Y-axis width and ensure left margin is wide enough
  const yAxisWidth = windowWidth < 480 ? 30 : 40
  const leftMargin = yAxisWidth + 10

  // Choose wrapper classes based on hideContainerBorder
  const wrapperClasses = hideContainerBorder
    ? 'bg-white'
    : 'p-4 md:p-6 border rounded-lg border-logo-border bg-white'

  return (
    <div className={wrapperClasses}>
      <p className="text-base md:text-lg font-semibold mb-1 text-logo-txt">
        {title}
      </p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>
      )}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: leftMargin,
              bottom: bottomMargin,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(229, 231, 235)" />
            <XAxis
              dataKey={nameKey}
              stroke="rgb(107, 114, 128)"
              tick={{
                fill: 'rgb(107, 114, 128)',
                fontSize: windowWidth < 640 ? 10 : 12,
              }}
              tickFormatter={tickFormatter}
              interval={xAxisProps.interval}
              angle={xAxisProps.angle}
              textAnchor={xAxisProps.angle !== 0 ? 'end' : 'middle'}
              height={xAxisProps.angle !== 0 ? 60 : 30}
              dy={xAxisProps.dy}
            />
            <YAxis
              stroke="rgb(107, 114, 128)"
              tick={{ fill: 'rgb(107, 114, 128)' }}
              width={yAxisWidth}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid rgb(229, 231, 235)',
                borderRadius: '0.375rem',
              }}
            />
            <Legend wrapperStyle={{ marginTop: windowWidth < 768 ? 0 : undefined }} />
            <Bar
              dataKey={dataKey}
              fill={colors[0]}
              radius={[4, 4, 0, 0]}
              name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
              barSize={windowWidth < 640 ? 12 : 20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
