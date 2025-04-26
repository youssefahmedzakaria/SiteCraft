// frontend/src/lib/chartData.ts
export interface Datum {
    [key: string]: string | number
  }  
export const salesData: Datum[] = [
    { month: 'Jan', sales: 400 },
    { month: 'Feb', sales: 500 },
    { month: 'Mar', sales: 450 },
    { month: 'Apr', sales: 600 },
    { month: 'May', sales: 700 },
    { month: 'Jun', sales: 650 },
    { month: 'Jul', sales: 800 },
    { month: 'Aug', sales: 750 },
    { month: 'Sep', sales: 900 },
    { month: 'Oct', sales: 850 },
    { month: 'Nov', sales: 950 },
    { month: 'Dec', sales: 1000 },
  ]
  
  export const NetProfitData = [
    { month: 'Jan', sales: 400 },
    { month: 'Feb', sales: 500 },
    { month: 'Mar', sales: 450 },
    { month: 'Apr', sales: 600 },
    { month: 'May', sales: 700 },
    { month: 'Jun', sales: 650 },
    { month: 'Jul', sales: 800 },
    { month: 'Aug', sales: 750 },
    { month: 'Sep', sales: 900 },
    { month: 'Oct', sales: 850 },
    { month: 'Nov', sales: 950 },
    { month: 'Dec', sales: 1000 },
  ] 
  // Order status distribution for Pie Chart
  export const salesByCategoryData: Datum[] = [
    { status: 'Pants', value: 35 },
    { status: 'Hoodies', value: 25 },
    { status: 'Homewear', value: 20 },
    { status: 'Makeup', value: 15 },
    { status: 'Jackets', value: 5 },
  ]  
  // Customer Acquisition for RadarChart
export const customerAcquisitionData: Datum[] = [
    { source: 'Facebook Ads', value: 30 },
    { source: 'Instagram Ads', value: 20 },
    { source: 'X Ads', value: 10 },
    { source: 'Google Ads', value: 15 },
    { source: 'Email Marketing', value: 25 }
  ]
  
  
  // Top Selling Products for horizontal BarChart
  export const topSellingProductsData: Datum[] = [
    { product: 'Micky Shirt', units: 65 },
    { product: 'F1 Pants', units: 55 },
    { product: 'Chante Bag', units: 47 },
    { product: 'Crocs Bracelet', units: 34 },
  ]
  
  // Wish-list Trends for horizontal BarChart
  export const wishlistTrendsData: Datum[] = [
    { item: 'Avatar Hoodie', units: 65 },
    { item: 'Baggy Blue Pants', units: 55 },
    { item: 'Black Bracelet', units: 47 },
    { item: 'Crop Top', units: 34 },
    { item: 'Spanish Pump', units: 21 },
  ]
  
  // Sales by Product for Multi-Line Chart
  export const salesByProductData: Datum[] = [
    { month: 'Jan', 'Baggy Pants': 50, 'Fit Pants': 40, 'Shorts': 60 },
    { month: 'Feb', 'Baggy Pants': 30, 'Fit Pants': 60, 'Shorts': 50 },
    { month: 'Mar', 'Baggy Pants': 40, 'Fit Pants': 20, 'Shorts': 70 },
    { month: 'Apr', 'Baggy Pants': 20, 'Fit Pants': 80, 'Shorts': 90 },
    { month: 'May', 'Baggy Pants': 60, 'Fit Pants': 50, 'Shorts': 100 },
    { month: 'Jun', 'Baggy Pants': 30, 'Fit Pants': 70, 'Shorts': 80 },
    { month: 'Jul', 'Baggy Pants': 40, 'Fit Pants': 60, 'Shorts': 110 },
    { month: 'Aug', 'Baggy Pants': 70, 'Fit Pants': 90, 'Shorts': 120 },
    { month: 'Sep', 'Baggy Pants': 50, 'Fit Pants': 100,'Shorts': 130 },
    { month: 'Oct', 'Baggy Pants': 80, 'Fit Pants': 70, 'Shorts': 140 },
    { month: 'Nov', 'Baggy Pants': 60, 'Fit Pants': 120,'Shorts': 150 },
    { month: 'Dec', 'Baggy Pants': 90, 'Fit Pants': 80, 'Shorts': 160 },
  ]