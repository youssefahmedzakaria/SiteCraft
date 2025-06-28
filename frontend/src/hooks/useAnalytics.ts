import { useState, useEffect, useCallback } from 'react';
import { 
  AnalyticsService, 
  DateRangeDTO,
  createAnalyticsMetrics,
  mapDailySalesToChartData,
  mapDailyNetProfitToChartData,
  mapCategorySalesToChartData,
  mapTopProductsToChartData,
  mapCustomerAcquisitionToChartData,
  mapWishlistTrendsToChartData
} from '@/lib/analytics';
import { GeneralAnalytic } from '@/lib/generalAnalytics';
import { Datum } from '@/lib/chartData';

export interface AnalyticsData {
  metrics: GeneralAnalytic[];
  salesData: Datum[];
  netProfitData: Datum[];
  salesByCategoryData: Datum[];
  topSellingProductsData: Datum[];
  customerAcquisitionData: Datum[];
  wishlistTrendsData: Datum[];
}

export interface UseAnalyticsReturn {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  dateRange: { from: Date; to: Date } | undefined;
  setDateRange: (dateRange: { from: Date; to: Date } | undefined) => void;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>(() => {
    // Default to last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    return { from: startDate, to: endDate };
  });

  const fetchAnalyticsData = useCallback(async (range: { from: Date; to: Date } | undefined) => {
    try {
      setIsLoading(true);
      setError(null);

      const dateRangeDTO = range 
        ? AnalyticsService.convertDateRange(range)
        : AnalyticsService.createDefaultDateRange();

      console.log('🚀 Starting analytics data fetch with dateRangeDTO:', dateRangeDTO);

      // Fetch all data in parallel
      const [
        orderCount,
        totalSales,
        dailySales,
        dailyNetProfit,
        categorySales,
        topProducts,
        customerAcquisition,
        newCustomers,
        returningCustomers,
        wishlistTrends
      ] = await Promise.all([
        AnalyticsService.getOrderCount(dateRangeDTO),
        AnalyticsService.getTotalSales(dateRangeDTO),
        AnalyticsService.getDailySales(dateRangeDTO),
        AnalyticsService.getDailyNetProfit(dateRangeDTO),
        AnalyticsService.getSalesByCategory(dateRangeDTO),
        AnalyticsService.getTopProducts(dateRangeDTO),
        AnalyticsService.getCustomerAcquisition(dateRangeDTO),
        AnalyticsService.getNewCustomers(dateRangeDTO),
        AnalyticsService.getReturningCustomers(dateRangeDTO),
        AnalyticsService.getWishlistTrends(dateRangeDTO)
      ]);

      console.log('📊 Raw analytics data received:', {
        orderCount,
        totalSales,
        dailySales,
        dailyNetProfit,
        categorySales,
        topProducts,
        customerAcquisition,
        newCustomers,
        returningCustomers,
        wishlistTrends
      });

      // Map data to frontend format
      const metrics = createAnalyticsMetrics(
        orderCount,
        totalSales,
        newCustomers,
        returningCustomers,
        range
      );

      const salesData = mapDailySalesToChartData(dailySales);
      const netProfitData = mapDailyNetProfitToChartData(dailyNetProfit);
      const salesByCategoryData = mapCategorySalesToChartData(categorySales);
      const topSellingProductsData = mapTopProductsToChartData(topProducts);
      const customerAcquisitionData = mapCustomerAcquisitionToChartData(customerAcquisition);
      const wishlistTrendsData = mapWishlistTrendsToChartData(wishlistTrends);

      console.log('🎯 Final processed analytics data:', {
        metrics,
        salesData,
        netProfitData,
        salesByCategoryData,
        topSellingProductsData,
        customerAcquisitionData,
        wishlistTrendsData
      });

      setData({
        metrics,
        salesData,
        netProfitData,
        salesByCategoryData,
        topSellingProductsData,
        customerAcquisitionData,
        wishlistTrendsData
      });

    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData(dateRange);
  }, [dateRange, fetchAnalyticsData]);

  const refetch = useCallback(async () => {
    await fetchAnalyticsData(dateRange);
  }, [fetchAnalyticsData, dateRange]);

  return {
    data,
    isLoading,
    error,
    refetch,
    dateRange,
    setDateRange
  };
}; 