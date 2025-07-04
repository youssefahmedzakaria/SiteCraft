import { useState, useEffect } from 'react'
import { Customer, getCustomers, suspendCustomer } from '@/lib/customers'
import { getOrders, Order } from '@/lib/orders'

export const useCustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSuspending, setIsSuspending] = useState<number | null>(null)

  const fetchCustomers = async () => {
    try {
      console.log('📝 Fetching customers...');
      setIsLoading(true)
      setError('')
      
      const [fetchedCustomers, fetchedOrders] = await Promise.all([
        getCustomers(),
        getOrders()
      ]);
      // Aggregate orderCount and totalSpent for each customer
      const customersWithStats = fetchedCustomers.map((customer: Customer) => {
        const customerOrders = fetchedOrders.filter((order: Order) => order.customer?.id === customer.id);
        const totalSpent = customerOrders.reduce((sum, order) => sum + (order.price || 0), 0);
        return {
          ...customer,
          orderCount: customerOrders.length,
          totalSpent,
        };
      });
      setCustomers(customersWithStats)
      console.log('✅ Customers loaded successfully');
    } catch (err: any) {
      console.error('💥 Error fetching customers:', err);
      setError(err.message || 'Failed to fetch customers')
      // Fallback to mock data
      console.log('🔄 Falling back to mock data...');
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuspendCustomer = async (customerId: number) => {
    try {
      console.log('📝 Suspending customer:', customerId);
      setIsSuspending(customerId)
      setError('')
      
      await suspendCustomer(customerId)
      
      // Update the customer status in the local state
      setCustomers(prev => prev.map(customer => 
        customer.id === customerId 
          ? { ...customer, status: 'inactive' }
          : customer
      ))
      
      console.log('✅ Customer suspended successfully');
    } catch (err: any) {
      console.error('💥 Error suspending customer:', err);
      setError(err.message || 'Failed to suspend customer')
    } finally {
      setIsSuspending(null)
    }
  }

  const clearError = () => setError('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  return {
    customers,
    isLoading,
    error,
    isSuspending,
    clearError,
    handleSuspendCustomer,
    refetchCustomers: fetchCustomers
  }
} 