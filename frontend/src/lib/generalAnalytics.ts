export interface GeneralAnalytic{
    id: string
    title: string
    value: string
    subtitle: string
}

export const categoryAnalytics: GeneralAnalytic[] = [
  {
    id: '1',
    title: 'Total Categories',
    value: '4',
    subtitle: '+3 from last month',
  },
  {
    id: '2',
    title: 'Most Popular',
    value: 'Electronics',
    subtitle: '54 products',
  },
  {
    id: '3',
    title: 'Empty Categories',
    value: '1',
    subtitle: 'Action suggested',
  },
]

export const productAnalytics: GeneralAnalytic[] = [
    {
      id: '1',
      title: 'Total Products',
      value: '3',
      subtitle: '+1 from last month',
    },
    {
      id: '2',
      title: 'Low Stock Items',
      value: '1',
      subtitle: 'Needs attention',
    },
    {
      id: '3',
      title: 'Out of Stock',
      value: '1',
      subtitle: 'Action suggested',
    },
]

// Function to convert real product statistics to analytics format
export const getProductAnalyticsFromStats = (stats: { totalProducts: number; lowStockCount: number; outOfStockCount: number }): GeneralAnalytic[] => [
  {
    id: '1',
    title: 'Total Products',
    value: stats.totalProducts.toString(),
    subtitle: 'All products in inventory',
  },
  {
    id: '2',
    title: 'Low Stock Items',
    value: stats.lowStockCount.toString(),
    subtitle: stats.lowStockCount > 0 ? 'Needs attention' : 'All good',
  },
  {
    id: '3',
    title: 'Out of Stock',
    value: stats.outOfStockCount.toString(),
    subtitle: stats.outOfStockCount > 0 ? 'Action suggested' : 'All in stock',
  },
]

// Function to convert real category statistics to analytics format
export const getCategoryAnalyticsFromStats = (stats: { 
  totalCategories: number; 
  categoriesWithProducts: number; 
  categoriesWithoutProducts: number;
  topPerformingCategory?: { name: string; productCount: number }
}): GeneralAnalytic[] => [
  {
    id: '1',
    title: 'Total Categories',
    value: stats.totalCategories.toString(),
    subtitle: 'All categories in store',
  },
  {
    id: '2',
    title: 'Most Popular',
    value: stats.topPerformingCategory?.name || 'None',
    subtitle: stats.topPerformingCategory ? `${stats.topPerformingCategory.productCount} products` : 'No products yet',
  },
  {
    id: '3',
    title: 'Empty Categories',
    value: stats.categoriesWithoutProducts.toString(),
    subtitle: stats.categoriesWithoutProducts > 0 ? 'Action suggested' : 'All categories have products',
  },
]

