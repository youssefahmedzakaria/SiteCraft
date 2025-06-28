import { useState, useEffect } from 'react';
import { 
  getTodayOrderCount, 
  getTodaySalesTotal, 
  getTopProducts, 
  getTodayOrders, 
  getLast7DaysSales,
  Order,
  DailySale,
  TopProduct
} from '@/lib/overview';
import { useAuth } from './useAuth';

export const useOverview = () => {
  const [orderCount, setOrderCount] = useState<number>(0);
  const [salesTotal, setSalesTotal] = useState<number>(0);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [todayOrders, setTodayOrders] = useState<Order[]>([]);
  const [dailySales, setDailySales] = useState<DailySale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  const fetchOverviewData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        setError('User not authenticated. Please log in.');
        return;
      }

      console.log('🔐 User authenticated for overview:', { userId: user.userId, storeId: user.storeId, role: user.role });
      
      // Fetch all overview data in parallel
      const [
        orderCountData,
        salesTotalData,
        topProductsData,
        todayOrdersData,
        dailySalesData
      ] = await Promise.all([
        getTodayOrderCount(),
        getTodaySalesTotal(),
        getTopProducts(5),
        getTodayOrders(),
        getLast7DaysSales()
      ]);

      setOrderCount(orderCountData);
      setSalesTotal(salesTotalData);
      setTopProducts(topProductsData);
      setTodayOrders(todayOrdersData);
      setDailySales(dailySalesData);
      
    } catch (err) {
      console.error('💥 Error in fetchOverviewData:', err);
      if (err instanceof Error) {
        if (err.message.includes('401')) {
          setError('Authentication failed. Please log in again.');
        } else if (err.message.includes('403')) {
          setError('Access denied. You don\'t have permission to view overview data.');
        } else {
          setError(err.message || 'Failed to fetch overview data');
        }
      } else {
        setError('Failed to fetch overview data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    // Only fetch overview data if user is authenticated
    if (isAuthenticated && user) {
      fetchOverviewData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  return {
    orderCount,
    salesTotal,
    topProducts,
    todayOrders,
    dailySales,
    isLoading,
    error,
    clearError,
    refetch: fetchOverviewData,
  };
}; 