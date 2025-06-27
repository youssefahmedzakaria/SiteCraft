// frontend/src/components/dashboard/charts/LineChartCard.tsx
'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import { useEffect, useState } from 'react'
import type { FC } from 'react'
import type { Datum } from '@/lib/chartData'

interface LineChartCardProps {
  data: Datum[]
  dataKey: string
  nameKey: string
  title: string
  subtitle?: string
  colors?: string[]
}

export const LineChartCard: FC<LineChartCardProps> = ({
  data,
  dataKey,
  nameKey,
  title,
  subtitle,
  colors = ['#4dbf38', '#3da32e', '#2d8724', '#1d6b1a', '#0d4f10']
}) => {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // abbreviate month names on small screens
  const tickFormatter = (val: string) => {
    if (nameKey === 'month' && windowWidth < 640) {
      return val.substring(0, 3)
    }
    return val
  }

  // snug legend spacing mobile vs desktop
  const bottomMargin = windowWidth < 768 ? 5 : 20

  // tilt labels on tablet/phone
  const xAxisProps =
    windowWidth < 1025
      ? { interval: 1, angle: -45, dy: 10 }
      : { interval: 0, angle: 0, dy: 0 }

  // compute Y-axis width & left margin
  const yAxisWidth = windowWidth < 480 ? 30 : 40
  const leftMargin = yAxisWidth + 10

  return (
    <div className="p-4 md:p-6 border rounded-lg border-logo-border bg-white">
      <p className="text-base md:text-lg font-semibold mb-1 text-logo-txt">
        {title}
      </p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>
      )}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: leftMargin,
              bottom: bottomMargin
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(229, 231, 235)" />
            <XAxis
              dataKey={nameKey}
              stroke="rgb(107, 114, 128)"
              tick={{
                fill: 'rgb(107, 114, 128)',
                fontSize: windowWidth < 640 ? 10 : 12
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
                borderRadius: '0.375rem'
              }}
            />
            <Legend wrapperStyle={{ marginTop: windowWidth < 768 ? 0 : undefined }} />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={colors[0]}
              strokeWidth={windowWidth < 640 ? 1.5 : 2}
              dot={{ fill: colors[0], r: windowWidth < 640 ? 2 : 3 }}
              name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
