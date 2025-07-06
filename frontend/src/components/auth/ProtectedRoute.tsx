'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading, checkSession } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // Check session on mount
    checkSession()
  }, [checkSession])

  // Debug logging
  useEffect(() => {
    console.log('🔒 ProtectedRoute Debug:', {
      isAuthenticated,
      user,
      isLoading,
      pathname: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
    })
  }, [isAuthenticated, user, isLoading])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null
  }

  // If user is authenticated but doesn't have a store yet, redirect to branding
  if (isAuthenticated && user && !user.storeId && !user.role) {
    router.push('/branding')
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">Setting up your store...</h1>
          <p className="text-gray-600">Redirecting you to create your store.</p>
        </div>
      </div>
    )
  }

  // If user is authenticated and has a store, check if it's inactive
  const hasStore = user?.storeId && user?.role === 'owner';
  const isInactive = user?.storeStatus === 'inactive' || (hasStore && user?.storeStatus === null);
  const isOnPricing = typeof window !== 'undefined' && window.location.pathname === '/pricing';
  
  console.log('🔒 Store Status Check:', {
    hasStore,
    storeStatus: user?.storeStatus,
    isInactive,
    isOnPricing,
    pathname: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
  });

  if (isAuthenticated && hasStore && isInactive && !isOnPricing) {
    console.log('🔒 Redirecting to pricing due to inactive store');
    router.push('/pricing');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">Store Inactive</h1>
          <p className="text-gray-600">Your store is inactive. Please subscribe to activate your store.</p>
        </div>
      </div>
    );
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 