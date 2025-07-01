import { useState, useEffect } from 'react';
import { getProductStatistics, getLowStockNotificationStatistics, ProductStatistics } from '@/lib/products';
import { useAuth } from './useAuth';

export const useProductStatistics = () => {
  const [stats, setStats] = useState<ProductStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        setError('User not authenticated. Please log in.');
        return;
      }

      // Check if user has storeId
      if (!user.storeId) {
        setError('User not assigned to a store. Please contact administrator.');
        return;
      }

      // Fetch both regular statistics and low stock notification statistics
      const [regularStats, lowStockStats] = await Promise.all([
        getProductStatistics(),
        getLowStockNotificationStatistics()
      ]);
      
      // Combine the statistics, using low stock notification count for lowStockCount
      const combinedStats: ProductStatistics = {
        totalProducts: regularStats.totalProducts,
        lowStockCount: lowStockStats.lowStockCount, // Use the low stock notification count
        outOfStockCount: regularStats.outOfStockCount
      };
      
      setStats(combinedStats);
    } catch (err) {
      console.error('💥 Error in fetchStats:', err);
      if (err instanceof Error) {
        if (err.message.includes('401')) {
          setError('Authentication failed. Please log in again.');
        } else if (err.message.includes('403')) {
          setError('Access denied. You don\'t have permission to view statistics.');
        } else {
          setError(err.message || 'Failed to fetch product statistics');
        }
      } else {
        setError('Failed to fetch product statistics');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch stats if user is authenticated
    if (isAuthenticated && user) {
      fetchStats();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}; 