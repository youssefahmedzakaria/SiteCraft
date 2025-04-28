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
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Format month names based on screen size
  const getTickFormatter = () => {
    return (value: string) => {
      // For mobile screens
      if (windowWidth < 640) {
        // Show first 3 letters of month name
        return value.substring(0, 3);
      }
      return value;
    };
  };

  // Determine interval and angle based on screen size
  const getXAxisProps = () => {
    if (windowWidth < 480) {
      // Small mobile: show every other month
      return { interval: 1, angle: -45, dy: 10 };
    } else if (windowWidth < 640) {
      // Mobile: show abbreviated month names at an angle
      return { interval: 0, angle: -45, dy: 10 };
    } else if (windowWidth < 768) {
      // Tablet: show all months at an angle
      return { interval: 0, angle: -45, dy: 10 };
    } else {
      // Desktop: normal display
      return { interval: 0, angle: 0, dy: 0 };
    }
  };

  const xAxisProps = getXAxisProps();

  return (
    <div className="p-4 md:p-6 border rounded-lg border-logo-border bg-white">
      <p className="text-base md:text-lg font-semibold mb-1 text-logo-txt">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
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
              textAnchor={xAxisProps.angle !== 0 ? "end" : "middle"}
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
            <Legend 
              wrapperStyle={{ fontSize: windowWidth < 640 ? 10 : 12 }}
              iconSize={windowWidth < 640 ? 8 : 10}
            />
            {dataKeys.map((key, index) => (
              <Line 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={colors[index % colors.length]}
                strokeWidth={windowWidth < 640 ? 1.5 : 2}
                dot={{ 
                  fill: colors[index % colors.length], 
                  r: windowWidth < 640 ? 2 : 3 
                }}
                name={key.charAt(0).toUpperCase() + key.slice(1)}
                // Optionally hide dots completely on very small screens with many lines
                // dot={windowWidth < 480 && dataKeys.length > 2 ? false : { fill: colors[index % colors.length], r: windowWidth < 640 ? 2 : 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}