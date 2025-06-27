// frontend/src/components/dashboard/charts/MultiLineChartCard.tsx
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
import { useEffect, useState, FC } from 'react'
import type { Datum } from '@/lib/chartData'

interface MultiLineChartCardProps {
  data: Datum[]
  dataKeys: string[]
  nameKey: string
  title: string
  subtitle?: string
  colors?: string[]
}

export const MultiLineChartCard: FC<MultiLineChartCardProps> = ({
  data,
  dataKeys,
  nameKey,
  title,
  subtitle,
  colors = ['#cc7860', '#5d8aa8', '#6b8e23', '#b8860b', '#8b4513']
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

  // abbreviate month names on very small screens
  const tickFormatter = (value: string) =>
    nameKey === 'month' && windowWidth < 640
      ? value.substring(0, 3)
      : value

  // tilt & interval on smaller/tablet sizes
  const xAxisProps =
    windowWidth < 1025
      ? { interval: 1, angle: -45, dy: 10 }
      : { interval: 0, angle: 0, dy: 0 }

  // snug legend spacing on mobile
  const bottomMargin = windowWidth < 768 ? 5 : 20

  // dynamic left margin so Y labels never clip
  const yAxisWidth = windowWidth < 480 ? 30 : 40
  const leftMargin = yAxisWidth + 10

  // hide every other Y tick on narrow screens
  const yAxisInterval = windowWidth < 640 ? 1 : 0

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
              top: 20,         // ↑ increased from 5 to 20
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
              interval={yAxisInterval}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid rgb(229, 231, 235)',
                borderRadius: '0.375rem'
              }}
            />
            <Legend
              iconSize={windowWidth < 640 ? 8 : 10}
              wrapperStyle={{ marginTop: windowWidth < 768 ? -15 : 0 }}
            />
            {dataKeys.map((key, idx) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[idx % colors.length]}
                strokeWidth={windowWidth < 640 ? 1.5 : 2}
                dot={{
                  fill: colors[idx % colors.length],
                  r: windowWidth < 640 ? 2 : 3
                }}
                name={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
