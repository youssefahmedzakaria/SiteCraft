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
import type { FC } from 'react'
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
  return (
    <div className="p-4 md:p-6 border rounded-lg border-logo-border bg-white">
      <p className="text-base md:text-lg font-semibold mb-1 text-logo-txt">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(229, 231, 235)" />
            <XAxis 
              dataKey={nameKey}
              stroke="rgb(107, 114, 128)"
              tick={{ fill: 'rgb(107, 114, 128)' }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="rgb(107, 114, 128)"
              tick={{ fill: 'rgb(107, 114, 128)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid rgb(229, 231, 235)',
                borderRadius: '0.375rem'
              }}
            />
            <Legend />
            {dataKeys.map((key, index) => (
              <Line 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ fill: colors[index % colors.length] }}
                name={key.charAt(0).toUpperCase() + key.slice(1)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}