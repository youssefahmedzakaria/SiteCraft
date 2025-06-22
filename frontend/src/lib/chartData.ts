// frontend/src/lib/chartData.ts

// Timespan keys
export type Timespan = '7' | '30' | '90' | '365'

export interface Datum {
  [key: string]: string | number
}

// —•• Weekly (last 7 days) — use weekdays on x-axis
export const salesData7: Datum[] = [
  { day: 'Mon', sales: 150 },
  { day: 'Tue', sales: 170 },
  { day: 'Wed', sales: 160 },
  { day: 'Thu', sales: 180 },
  { day: 'Fri', sales: 200 },
  { day: 'Sat', sales: 220 },
  { day: 'Sun', sales: 210 },
]

export const netProfitData7: Datum[] = [
  { day: 'Mon', sales: 50 },
  { day: 'Tue', sales: 60 },
  { day: 'Wed', sales: 55 },
  { day: 'Thu', sales: 65 },
  { day: 'Fri', sales: 70 },
  { day: 'Sat', sales: 75 },
  { day: 'Sun', sales: 80 },
]

export const salesByProductData7: Datum[] = [
  { day: 'Mon', 'Baggy Pants': 30, 'Fit Pants': 20, Shorts: 25 },
  { day: 'Tue', 'Baggy Pants': 35, 'Fit Pants': 25, Shorts: 30 },
  { day: 'Wed', 'Baggy Pants': 32, 'Fit Pants': 28, Shorts: 27 },
  { day: 'Thu', 'Baggy Pants': 40, 'Fit Pants': 30, Shorts: 35 },
  { day: 'Fri', 'Baggy Pants': 45, 'Fit Pants': 35, Shorts: 40 },
  { day: 'Sat', 'Baggy Pants': 50, 'Fit Pants': 40, Shorts: 45 },
  { day: 'Sun', 'Baggy Pants': 48, 'Fit Pants': 38, Shorts: 43 },
]

// —•• Monthly (last 30 days) — group into 4 weeks
export const salesData30: Datum[] = [
  { week: 'Week 1', sales: 5000 },
  { week: 'Week 2', sales: 7000 },
  { week: 'Week 3', sales: 8000 },
  { week: 'Week 4', sales: 6500 },
]

export const netProfitData30: Datum[] = [
  { week: 'Week 1', sales: 1000 },
  { week: 'Week 2', sales: 1200 },
  { week: 'Week 3', sales: 1500 },
  { week: 'Week 4', sales: 1300 },
]

export const salesByProductData30: Datum[] = [
  { week: 'Week 1', 'Baggy Pants': 100, 'Fit Pants': 80, Shorts: 90 },
  { week: 'Week 2', 'Baggy Pants': 150, 'Fit Pants': 100, Shorts: 120 },
  { week: 'Week 3', 'Baggy Pants': 200, 'Fit Pants': 150, Shorts: 180 },
  { week: 'Week 4', 'Baggy Pants': 180, 'Fit Pants': 140, Shorts: 160 },
]

// —•• Quarterly (last 90 days) — three months
export const salesData90: Datum[] = [
  { month: 'Month 1', sales: 12000 },
  { month: 'Month 2', sales: 15000 },
  { month: 'Month 3', sales: 18000 },
]

export const netProfitData90: Datum[] = [
  { month: 'Month 1', sales: 3000 },
  { month: 'Month 2', sales: 3500 },
  { month: 'Month 3', sales: 4000 },
]

export const salesByProductData90: Datum[] = [
  { month: 'Month 1', 'Baggy Pants': 400, 'Fit Pants': 300, Shorts: 350 },
  { month: 'Month 2', 'Baggy Pants': 500, 'Fit Pants': 400, Shorts: 450 },
  { month: 'Month 3', 'Baggy Pants': 600, 'Fit Pants': 450, Shorts: 550 },
]

// —•• Yearly (last 365 days) — all 12 months
export const salesData365: Datum[] = [
  { month: 'Jan', sales: 35000 },
  { month: 'Feb', sales: 38000 },
  { month: 'Mar', sales: 42000 },
  { month: 'Apr', sales: 44000 },
  { month: 'May', sales: 46000 },
  { month: 'Jun', sales: 48000 },
  { month: 'Jul', sales: 50000 },
  { month: 'Aug', sales: 52000 },
  { month: 'Sep', sales: 54000 },
  { month: 'Oct', sales: 56000 },
  { month: 'Nov', sales: 58000 },
  { month: 'Dec', sales: 60000 },
]

export const netProfitData365: Datum[] = [
  { month: 'Jan', sales: 9000 },
  { month: 'Feb', sales: 9500 },
  { month: 'Mar', sales: 10000 },
  { month: 'Apr', sales: 10500 },
  { month: 'May', sales: 11000 },
  { month: 'Jun', sales: 11500 },
  { month: 'Jul', sales: 12000 },
  { month: 'Aug', sales: 12500 },
  { month: 'Sep', sales: 13000 },
  { month: 'Oct', sales: 13500 },
  { month: 'Nov', sales: 14000 },
  { month: 'Dec', sales: 14500 },
]

export const salesByProductData365: Datum[] = [
  { month: 'Jan', 'Baggy Pants': 1200, 'Fit Pants': 900, Shorts: 1050 },
  { month: 'Feb', 'Baggy Pants': 1250, 'Fit Pants': 950, Shorts: 1100 },
  { month: 'Mar', 'Baggy Pants': 1300, 'Fit Pants': 1000, Shorts: 1150 },
  { month: 'Apr', 'Baggy Pants': 1350, 'Fit Pants': 1050, Shorts: 1200 },
  { month: 'May', 'Baggy Pants': 1400, 'Fit Pants': 1100, Shorts: 1250 },
  { month: 'Jun', 'Baggy Pants': 1450, 'Fit Pants': 1150, Shorts: 1300 },
  { month: 'Jul', 'Baggy Pants': 1500, 'Fit Pants': 1200, Shorts: 1350 },
  { month: 'Aug', 'Baggy Pants': 1550, 'Fit Pants': 1250, Shorts: 1400 },
  { month: 'Sep', 'Baggy Pants': 1600, 'Fit Pants': 1300, Shorts: 1450 },
  { month: 'Oct', 'Baggy Pants': 1650, 'Fit Pants': 1350, Shorts: 1500 },
  { month: 'Nov', 'Baggy Pants': 1700, 'Fit Pants': 1400, Shorts: 1550 },
  { month: 'Dec', 'Baggy Pants': 1750, 'Fit Pants': 1450, Shorts: 1600 },
]

// Datasets that don’t vary with timespan
export const topSellingProductsData: Datum[] = [
  { product: 'Micky Shirt', units: 65 },
  { product: 'F1 Pants', units: 55 },
  { product: 'Chante Bag', units: 47 },
  { product: 'Crocs Bracelet', units: 34 },
]

export const wishlistTrendsData: Datum[] = [
  { item: 'Avatar Hoodie', units: 65 },
  { item: 'Baggy Blue Pants', units: 55 },
  { item: 'Black Bracelet', units: 47 },
  { item: 'Crop Top', units: 34 },
  { item: 'Spanish Pump', units: 21 },
]

// —•• Pie data per timespan (sum = 100)
export const salesByCategoryData7: Datum[] = [
  { status: 'Pants',    value: 15 },
  { status: 'Hoodies',  value: 20 },
  { status: 'Homewear', value: 30 },
  { status: 'Makeup',   value: 25 },
  { status: 'Jackets',  value: 10 },
]

export const salesByCategoryData30: Datum[] = [
  { status: 'Pants',    value: 25 },
  { status: 'Hoodies',  value: 20 },
  { status: 'Homewear', value: 20 },
  { status: 'Makeup',   value: 15 },
  { status: 'Jackets',  value: 20 },
]

export const salesByCategoryData90: Datum[] = [
  { status: 'Pants',    value: 30 },
  { status: 'Hoodies',  value: 25 },
  { status: 'Homewear', value: 20 },
  { status: 'Makeup',   value: 15 },
  { status: 'Jackets',  value: 10 },
]

export const salesByCategoryData365: Datum[] = [
  { status: 'Pants',    value: 35 },
  { status: 'Hoodies',  value: 25 },
  { status: 'Homewear', value: 20 },
  { status: 'Makeup',   value: 10 },
  { status: 'Jackets',  value: 10 },
]

// —•• Radar data per timespan
export const customerAcquisitionData7: Datum[] = [
  { source: 'Facebook Ads',    value: 5  },
  { source: 'Instagram Ads',   value: 8  },
  { source: 'X Ads',           value: 3  },
  { source: 'Google Ads',      value: 6  },
  { source: 'Email Marketing', value: 10 },
]

export const customerAcquisitionData30: Datum[] = [
  { source: 'Facebook Ads',    value: 20 },
  { source: 'Instagram Ads',   value: 30 },
  { source: 'X Ads',           value: 10 },
  { source: 'Google Ads',      value: 15 },
  { source: 'Email Marketing', value: 25 },
]

export const customerAcquisitionData90: Datum[] = [
  { source: 'Facebook Ads',    value: 60 },
  { source: 'Instagram Ads',   value: 90 },
  { source: 'X Ads',           value: 30 },
  { source: 'Google Ads',      value: 45 },
  { source: 'Email Marketing', value: 75 },
]

export const customerAcquisitionData365: Datum[] = [
  { source: 'Facebook Ads',    value: 240 },
  { source: 'Instagram Ads',   value: 360 },
  { source: 'X Ads',           value: 120 },
  { source: 'Google Ads',      value: 180 },
  { source: 'Email Marketing', value: 300 },
]

// —•• Group by timespan for easy lookup
export const chartDataByTimespan: Record<Timespan, Record<string, Datum[]>> = {
  '7': {
    salesData: salesData7,
    NetProfitData: netProfitData7,
    salesByCategoryData: salesByCategoryData7,
    customerAcquisitionData: customerAcquisitionData7,
    topSellingProductsData,
    wishlistTrendsData,
    salesByProductData: salesByProductData7
  },
  '30': {
    salesData: salesData30,
    NetProfitData: netProfitData30,
    salesByCategoryData: salesByCategoryData30,
    customerAcquisitionData: customerAcquisitionData30,
    topSellingProductsData,
    wishlistTrendsData,
    salesByProductData: salesByProductData30
  },
  '90': {
    salesData: salesData90,
    NetProfitData: netProfitData90,
    salesByCategoryData: salesByCategoryData90,
    customerAcquisitionData: customerAcquisitionData90,
    topSellingProductsData,
    wishlistTrendsData,
    salesByProductData: salesByProductData90
  },
  '365': {
    salesData: salesData365,
    NetProfitData: netProfitData365,
    salesByCategoryData: salesByCategoryData365,
    customerAcquisitionData: customerAcquisitionData365,
    topSellingProductsData,
    wishlistTrendsData,
    salesByProductData: salesByProductData365
  }
}
