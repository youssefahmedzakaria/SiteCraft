'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface SessionProviderProps {
  children: React.ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const { checkSession } = useAuth()

  useEffect(() => {
    // Check for existing session on app startup
    checkSession()
  }, [checkSession])

  return <>{children}</>
} 