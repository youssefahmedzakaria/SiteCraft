import { useState, useEffect } from 'react'
import { Order, getOrders, updateOrderStatus } from '@/lib/orders'
import { useAuth } from './useAuth'

export const useOrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isUpdating, setIsUpdating] = useState<number | null>(null)
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const fetchOrders = async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      setIsLoading(false)
      return
    }

    try {
      console.log('📝 Fetching orders...');
      setIsLoading(true)
      setError('')

      const fetchedOrders = await getOrders()
      setOrders(fetchedOrders)
      console.log('✅ Orders loaded successfully');
    } catch (err: any) {
      console.error('💥 Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders')
      // Fallback to mock data
      console.log('🔄 Falling back to mock data...');
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      console.log('📝 Updating order status:', orderId, newStatus);
      setIsUpdating(orderId)
      setError('')

      const updatedOrder = await updateOrderStatus(orderId, newStatus)

      // Update the order in the local state
      setOrders(prev => prev.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      ))

      console.log('✅ Order status updated successfully');
      return updatedOrder
    } catch (err: any) {
      console.error('💥 Error updating order status:', err);
      setError(err.message || 'Failed to update order status')
      throw err
    } finally {
      setIsUpdating(null)
    }
  }

  const clearError = () => setError('')

  useEffect(() => {
    // Only fetch orders if authenticated and auth loading is complete
    if (!authLoading && isAuthenticated) {
      fetchOrders()
    } else if (!authLoading && !isAuthenticated) {
      // If not authenticated, stop loading
      setIsLoading(false)
    }
  }, [isAuthenticated, authLoading])

  return {
    orders,
    isLoading: isLoading || authLoading,
    error,
    isUpdating,
    clearError,
    handleUpdateOrderStatus,
    refetchOrders: fetchOrders
  }
} 