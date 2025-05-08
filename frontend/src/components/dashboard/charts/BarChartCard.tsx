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

  const getTickFormatter = () => (value: string) =>
    windowWidth < 640 ? value.substring(0, 3) : value

  const getXAxisProps = () => {
    if (windowWidth < 480) {
      return { interval: 1, angle: -45, dy: 10 }
    } else if (windowWidth < 640) {
      return { interval: 1, angle: -45, dy: 10 }
    } else if (windowWidth < 1025) {
      return { interval: 1, angle: -45, dy: 10 }
    } else {
      return { interval: 0, angle: 0, dy: 0 }
    }
  }
  const xAxisProps = getXAxisProps()

  // Choose wrapper classes based on hideContainerBorder
  const wrapperClasses = hideContainerBorder
    ? 'bg-white'
    : 'p-4 md:p-6 border rounded-lg border-logo-border bg-white'

  return (
    <div className={wrapperClasses}>
      <p className="text-base md:text-lg font-semibold mb-1 text-logo-txt">{title}</p>
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
              left: 10,
              bottom: windowWidth < 768 ? 50 : 20
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
              tickFormatter={getTickFormatter()}
              interval={xAxisProps.interval}
              angle={xAxisProps.angle}
              textAnchor={xAxisProps.angle !== 0 ? 'end' : 'middle'}
              height={xAxisProps.angle !== 0 ? 60 : 30}
              dy={xAxisProps.dy}
            />
            <YAxis
              stroke="rgb(107, 114, 128)"
              tick={{ fill: 'rgb(107, 114, 128)' }}
              width={windowWidth < 480 ? 30 : 40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid rgb(229, 231, 235)',
                borderRadius: '0.375rem'
              }}
            />
            <Legend />
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