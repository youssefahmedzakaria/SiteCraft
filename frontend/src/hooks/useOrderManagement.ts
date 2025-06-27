import { useState, useEffect } from 'react'
import { Order, getOrders, updateOrderStatus } from '@/lib/orders'

export const useOrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isUpdating, setIsUpdating] = useState<number | null>(null)

  const fetchOrders = async () => {
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
    fetchOrders()
  }, [])

  return {
    orders,
    isLoading,
    error,
    isUpdating,
    clearError,
    handleUpdateOrderStatus,
    refetchOrders: fetchOrders
  }
} 