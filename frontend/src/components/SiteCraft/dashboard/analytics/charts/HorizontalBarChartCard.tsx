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
import type { FC } from 'react'
import type { Datum } from '@/lib/chartData'

interface HorizontalBarChartCardProps {
  data: Datum[]
  dataKey: string
  nameKey: string
  title: string
  subtitle?: string
  colors?: string[]
  legendName?: string
}

export const HorizontalBarChartCard: FC<HorizontalBarChartCardProps> = ({
  data,
  dataKey,
  nameKey,
  title,
  subtitle,
  colors = ['#cc7860', '#5d8aa8', '#6b8e23', '#b8860b', '#8b4513'],
  legendName
}) => {
  return (
    <div className="p-4 md:p-6 border rounded-lg border-logo-border bg-white">
      <p className="text-base md:text-lg font-semibold mb-1 text-logo-txt">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout="vertical"
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(229, 231, 235)" />
            <XAxis 
              type="number"
              stroke="rgb(107, 114, 128)"
              tick={{ fill: 'rgb(107, 114, 128)' }}
            />
            <YAxis 
              dataKey={nameKey}
              type="category"
              stroke="rgb(107, 114, 128)"
              tick={{ fill: 'rgb(107, 114, 128)' }}
              width={90}
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
              radius={[0, 4, 4, 0]}
              name={legendName ? legendName.charAt(0).toUpperCase() + legendName.slice(1) : dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}