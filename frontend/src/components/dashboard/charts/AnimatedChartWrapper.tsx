'use client'

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { ReactNode } from 'react'

interface AnimatedChartWrapperProps {
  children: ReactNode
  delay?: number
}

export const AnimatedChartWrapper = ({ children, delay = 0 }: AnimatedChartWrapperProps) => {
  const [ref, isVisible] = useIntersectionObserver()

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-1000 ease-in-out`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${delay}ms`,
        transitionProperty: 'opacity, transform'
      }}
    >
      {children}
    </div>
  )
} 