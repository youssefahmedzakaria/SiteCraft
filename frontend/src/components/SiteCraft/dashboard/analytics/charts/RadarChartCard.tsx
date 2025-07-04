// frontend/src/components/dashboard/charts/RadarChartCard.tsx
'use client'

import React, { FC, useState, useEffect } from 'react'
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip
} from 'recharts'
import type { Datum } from '@/lib/chartData'

interface RadarChartCardProps {
  data: Datum[]
  dataKey: string
  nameKey: string
  title: string
  subtitle?: string
  colors?: string[]
}

export const RadarChartCard: FC<RadarChartCardProps> = ({
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

  const isMobile = windowWidth < 640
  const isFold = windowWidth < 420

  // pick outer radius
  const outerRadius = isFold ? '50%' : isMobile ? '70%' : '50%'

  return (
    <div className="p-4 md:p-6 border rounded-lg border-logo-border bg-white">
      <p className="text-base md:text-lg font-semibold mb-1 text-logo-txt">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={outerRadius}
            margin={{
              top: isMobile ? 10 : 5,
              right: isMobile ? 20 : 0,
              bottom: isMobile ? 10 : 0,
              left: isMobile ? 20 : 0,
            }}
          >
            <PolarGrid stroke="rgb(229, 231, 235)" />
            <PolarAngleAxis
              dataKey={nameKey}
              stroke="rgb(107, 114, 128)"
              tick={{
                fill: 'rgb(107, 114, 128)',
                fontSize: isMobile ? 10 : 12
              }}
            />
            <PolarRadiusAxis angle={90} tick={false} axisLine={false} />
            <Radar
              name="Individuals"
              dataKey={dataKey}
              stroke={colors[0]}
              fill={colors[0]}
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid rgb(229, 231, 235)',
                borderRadius: '0.375rem'
              }}
            />
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{
                fontSize: isMobile ? 10 : 12,
                marginTop: isMobile ? -10 : 0
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}