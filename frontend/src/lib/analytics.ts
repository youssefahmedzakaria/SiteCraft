import { GeneralAnalytic } from './generalAnalytics';
import { Datum } from './chartData';

// Backend DTOs
export interface DateRangeDTO {
  startDate: string; // YYYY-MM-DD format
  endDate: string;   // YYYY-MM-DD format
  limit?: number;
}

export interface DailySales {
  date: string;
  totalSales: number; // Backend returns 'totalSales', not 'sales'
}

export interface DailyNetProfit {
  date: string;
  netProfit: number; // Backend returns 'netProfit', not 'profit'
}

export interface CategorySales {
  categoryName: string;
  totalSales: number;
  percentage?: number; // Optional since backend doesn't return this
}

export interface ProductSales {
  product: {
    id: number;
    name: string;
    description: string;
    discountType: string | null;
    discountValue: number | null;
    minCap: number | null;
    percentageMax: number | null;
    maxCap: number | null;
    images: any[];
    variants: any[];
    attributes: any[];
    reviews: any[];
    categoryId: number;
    categoryName: string;
  };
  quantitySold: number; // Backend returns 'quantitySold', not 'unitsSold'
}

export interface SalesByProduct {
  date: string;
  productName: string;
  unitsSold: number;
}

export interface SourceCount {
  source: string;
  count: number;
}

export interface WishlistTrend {
  productName: string;
  wishlistCount: number;
}

// Fallback data for when backend returns empty or no data
const fallbackDailySales: DailySales[] = [
  { date: '2024-01-01', totalSales: 0 },
  { date: '2024-01-02', totalSales: 0 },
  { date: '2024-01-03', totalSales: 0 },
  { date: '2024-01-04', totalSales: 0 },
  { date: '2024-01-05', totalSales: 0 },
  { date: '2024-01-06', totalSales: 0 },
  { date: '2024-01-07', totalSales: 0 },
];

const fallbackDailyNetProfit: DailyNetProfit[] = [
  { date: '2024-01-01', netProfit: 0 },
  { date: '2024-01-02', netProfit: 0 },
  { date: '2024-01-03', netProfit: 0 },
  { date: '2024-01-04', netProfit: 0 },
  { date: '2024-01-05', netProfit: 0 },
  { date: '2024-01-06', netProfit: 0 },
  { date: '2024-01-07', netProfit: 0 },
];

const fallbackCategorySales: CategorySales[] = [
  { categoryName: 'No Data', totalSales: 0, percentage: 100 },
];

const fallbackProductSales: ProductSales[] = [
  { product: { id: 0, name: 'No Products', description: '', discountType: null, discountValue: null, minCap: null, percentageMax: null, maxCap: null, images: [], variants: [], attributes: [], reviews: [], categoryId: 0, categoryName: '' }, quantitySold: 0 },
];

const fallbackSourceCount: SourceCount[] = [
  { source: 'No Data', count: 0 },
];

const fallbackWishlistTrends: WishlistTrend[] = [
  { productName: 'No Items', wishlistCount: 0 },
];

// Analytics Service
export class AnalyticsService {
  private static baseUrl = 'http://localhost:8080/api/analytics';

  // Helper to create default date range (last 30 days)
  static createDefaultDateRange(): DateRangeDTO {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      limit: 10
    };
  }

  // Helper to convert frontend date range to backend format
  static convertDateRange(dateRange: { from: Date; to: Date }): DateRangeDTO {
    return {
      startDate: dateRange.from.toISOString().split('T')[0],
      endDate: dateRange.to.toISOString().split('T')[0],
      limit: 10
    };
  }

  // Get order count
  static async getOrderCount(dateRange: DateRangeDTO): Promise<number> {
    try {
      console.log('🔍 Fetching order count with dateRange:', dateRange);
      const response = await fetch(`${this.baseUrl}/orders/count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dateRange),
      });

      if (!response.ok) {
        console.warn('Failed to fetch order count, using fallback');
        return 0;
      }

      const data = await response.json();
      console.log('📊 Order count response:', data);
      return data;
    } catch (error) {
      console.warn('Error fetching order count:', error);
      return 0;
    }
  }

  // Get total sales
  static async getTotalSales(dateRange: DateRangeDTO): Promise<number> {
    try {
      console.log('🔍 Fetching total sales with dateRange:', dateRange);
      const response = await fetch(`${this.baseUrl}/sales/total`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dateRange),
      });

      if (!response.ok) {
        console.warn('Failed to fetch total sales, using fallback');
        return 0;
      }

      const data = await response.json();
      console.log('📊 Total sales response:', data);
      return data;
    } catch (error) {
      console.warn('Error fetching total sales:', error);
      return 0;
    }
  }

  // Get daily sales
  static async getDailySales(dateRange: DateRangeDTO): Promise<DailySales[]> {
    try {
      console.log('🔍 Fetching daily sales with dateRange:', dateRange);
      const response = await fetch(`${this.baseUrl}/sales/daily`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dateRange),
      });

      if (!response.ok) {
        console.warn('Failed to fetch daily sales, using fallback');
        return fallbackDailySales;
      }

      const data = await response.json();
      console.log('📊 Daily sales response:', data);
      return data && data.length > 0 ? data : fallbackDailySales;
    } catch (error) {
      console.warn('Error fetching daily sales:', error);
      return fallbackDailySales;
    }
  }

  // Get daily net profit
  static async getDailyNetProfit(dateRange: DateRangeDTO): Promise<DailyNetProfit[]> {
    try {
      console.log('🔍 Fetching daily net profit with dateRange:', dateRange);
      const response = await fetch(`${this.baseUrl}/profit/daily`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dateRange),
      });

      if (!response.ok) {
        console.warn('Failed to fetch daily net profit, using fallback');
        return fallbackDailyNetProfit;
      }

      const data = await response.json();
      console.log('📊 Daily net profit response:', data);
      return data && data.length > 0 ? data : fallbackDailyNetProfit;
    } catch (error) {
      console.warn('Error fetching daily net profit:', error);
      return fallbackDailyNetProfit;
    }
  }

  // Get sales by category
  static async getSalesByCategory(dateRange: DateRangeDTO): Promise<CategorySales[]> {
    try {
      const response = await fetch(`${this.baseUrl}/sales/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dateRange),
      });

      if (!response.ok) {
        console.warn('Failed to fetch sales by category, using fallback');
        return fallbackCategorySales;
      }

      const data = await response.json();
      return data && data.length > 0 ? data : fallbackCategorySales;
    } catch (error) {
      console.warn('Error fetching sales by category:', error);
      return fallbackCategorySales;
    }
  }

  // Get top products
  static async getTopProducts(dateRange: DateRangeDTO): Promise<ProductSales[]> {
    try {
      console.log('🔍 Fetching top products with dateRange:', dateRange);
      const response = await fetch(`${this.baseUrl}/products/top`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...dateRange, limit: 5 }), // Limit to top 5 products
      });

      if (!response.ok) {
        console.warn('Failed to fetch top products, using fallback');
        return fallbackProductSales;
      }

      const data = await response.json();
      console.log('📊 Top products response:', data);
      return data && data.length > 0 ? data : fallbackProductSales;
    } catch (error) {
      console.warn('Error fetching top products:', error);
      return fallbackProductSales;
    }
  }

  // Get customer acquisition
  static async getCustomerAcquisition(dateRange: DateRangeDTO): Promise<SourceCount[]> {
    try {
      const response = await fetch(`${this.baseUrl}/customers/acquisition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dateRange),
      });

      if (!response.ok) {
        console.warn('Failed to fetch customer acquisition, using fallback');
        return fallbackSourceCount;
      }

      const data = await response.json();
      return data && data.length > 0 ? data : fallbackSourceCount;
    } catch (error) {
      console.warn('Error fetching customer acquisition:', error);
      return fallbackSourceCount;
    }
  }

  // Get new customers
  static async getNewCustomers(dateRange: DateRangeDTO): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/customers/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dateRange),
      });

      if (!response.ok) {
        console.warn('Failed to fetch new customers, using fallback');
        return 0;
      }

      return response.json();
    } catch (error) {
      console.warn('Error fetching new customers:', error);
      return 0;
    }
  }

  // Get returning customers
  static async getReturningCustomers(dateRange: DateRangeDTO): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/customers/returning`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dateRange),
      });

      if (!response.ok) {
        console.warn('Failed to fetch returning customers, using fallback');
        return 0;
      }

      return response.json();
    } catch (error) {
      console.warn('Error fetching returning customers:', error);
      return 0;
    }
  }

  // Get wishlist trends
  static async getWishlistTrends(dateRange: DateRangeDTO): Promise<WishlistTrend[]> {
    try {
      const response = await fetch(`${this.baseUrl}/wishlist/trends`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dateRange),
      });

      if (!response.ok) {
        console.warn('Failed to fetch wishlist trends, using fallback');
        return fallbackWishlistTrends;
      }

      const data = await response.json();
      // Map backend saveCount to wishlistCount and limit to top 4
      const mapped = (data && data.length > 0)
        ? data.slice(0, 4).map((item: any) => ({
            productName: item.productName,
            wishlistCount: item.saveCount,
          }))
        : fallbackWishlistTrends;
      return mapped;
    } catch (error) {
      console.warn('Error fetching wishlist trends:', error);
      return fallbackWishlistTrends;
    }
  }
}

// Data mapping functions to convert backend data to frontend format

export const mapDailySalesToChartData = (data: DailySales[]): Datum[] => {
  console.log('🔄 Mapping daily sales data:', data);
  
  if (!data || data.length === 0) {
    console.log('⚠️ No daily sales data, using fallback');
    return fallbackDailySales.map(item => ({
      day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
      sales: item.totalSales
    }));
  }

  const mappedData = data.map(item => {
    const date = new Date(item.date);
    const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    return {
      day: label,
      sales: item.totalSales
    };
  });
  
  console.log('✅ Mapped daily sales data:', mappedData);
  return mappedData;
};

export const mapDailyNetProfitToChartData = (data: DailyNetProfit[]): Datum[] => {
  console.log('🔄 Mapping daily net profit data:', data);
  
  if (!data || data.length === 0) {
    console.log('⚠️ No daily net profit data, using fallback');
    return fallbackDailyNetProfit.map(item => ({
      day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
      sales: item.netProfit
    }));
  }

  const mappedData = data.map(item => {
    const date = new Date(item.date);
    const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    return {
      day: label,
      sales: item.netProfit
    };
  });
  
  console.log('✅ Mapped daily net profit data:', mappedData);
  return mappedData;
};

export const mapCategorySalesToChartData = (data: CategorySales[]): Datum[] => {
  if (!data || data.length === 0) {
    return fallbackCategorySales.map(item => ({
      status: item.categoryName,
      value: 100 // Default percentage
    }));
  }

  // Calculate total sales to compute percentages
  const totalSales = data.reduce((sum, item) => sum + item.totalSales, 0);

  return data.map(item => ({
    status: item.categoryName,
    value: totalSales > 0 ? Math.round((item.totalSales / totalSales) * 100) : 0
  }));
};

export const mapTopProductsToChartData = (data: ProductSales[]): Datum[] => {
  if (!data || data.length === 0) {
    return fallbackProductSales.map(item => ({
      product: item.product.name,
      units: item.quantitySold
    }));
  }

  return data.map(item => ({
    product: item.product.name,
    units: item.quantitySold
  }));
};

export const mapCustomerAcquisitionToChartData = (data: SourceCount[]): Datum[] => {
  if (!data || data.length === 0) {
    return fallbackSourceCount.map(item => ({
      source: item.source,
      value: item.count
    }));
  }

  return data.map(item => ({
    source: item.source,
    value: item.count
  }));
};

export const mapWishlistTrendsToChartData = (data: WishlistTrend[]): Datum[] => {
  if (!data || data.length === 0) {
    return fallbackWishlistTrends.map(item => ({
      item: item.productName,
      units: item.wishlistCount
    }));
  }

  return data.map(item => ({
    item: item.productName,
    units: item.wishlistCount
  }));
};

// Function to create analytics metrics from backend data
export const createAnalyticsMetrics = (
  orderCount: number,
  totalSales: number,
  newCustomers: number,
  returningCustomers: number,
  dateRange?: { from: Date; to: Date }
): GeneralAnalytic[] => {
  const totalCustomers = newCustomers + returningCustomers;
  const conversionRate = orderCount > 0 ? ((totalCustomers / orderCount) * 100).toFixed(1) : '0';
  const avgOrderValue = orderCount > 0 ? (totalSales / orderCount).toFixed(2) : '0';
  const returningRate = totalCustomers > 0 ? ((returningCustomers / totalCustomers) * 100).toFixed(1) : '0';

  const dateRangeText = dateRange 
    ? `${dateRange.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${dateRange.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    : 'Last 30 days';

  return [
    {
      id: '1',
      title: 'Total Sales',
      value: `e£${totalSales.toLocaleString()}`,
      subtitle: dateRangeText,
    },
    {
      id: '2',
      title: 'Total Orders',
      value: orderCount.toString(),
      subtitle: dateRangeText,
    },
    {
      id: '3',
      title: 'Total Visitors',
      value: totalCustomers.toString(),
      subtitle: dateRangeText,
    },
    {
      id: '4',
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      subtitle: 'Orders per visitor',
    },
    {
      id: '5',
      title: 'Average Order Value',
      value: `e£${avgOrderValue}`,
      subtitle: 'Revenue per order',
    },
    {
      id: '6',
      title: 'Returning Customer Rate',
      value: `${returningRate}%`,
      subtitle: 'Repeat customers',
    },
  ];
}; 