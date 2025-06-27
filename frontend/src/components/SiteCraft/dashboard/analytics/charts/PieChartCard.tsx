'use client'

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts'
import type { FC } from 'react'
import type { Datum } from '@/lib/chartData'

interface PieChartCardProps {
  data: Datum[]
  dataKey: string
  nameKey: string
  title: string
  subtitle?: string
  colors?: string[]
}

export const PieChartCard: FC<PieChartCardProps> = ({
  data,
  dataKey,
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
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="rgb(136, 132, 216)"
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid rgb(229, 231, 235)',
                borderRadius: '0.375rem'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}