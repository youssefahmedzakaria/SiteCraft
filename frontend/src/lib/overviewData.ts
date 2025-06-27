// frontend/src/lib/overviewData.ts

// 1) Orders interface + mock data
export interface Order {
    id: number
    customer: string
    total: number
    status: 'Delivered' | 'Cancelled' | 'Processing' | 'Shipped' | 'Pending'
  }
  
  export const todaysOrders: Order[] = [
    { id: 1, customer: 'Ali Tareq',    total: 99.99,  status: 'Delivered'  },
    { id: 2, customer: 'Jane Hamdy',  total: 149.99, status: 'Processing' },
    { id: 3, customer: 'Bob Zaki', total: 79.99,  status: 'Shipped'    },
    { id: 4, customer: 'Zakaria Brown', total: 199.99, status: 'Pending'    },
    { id: 5, customer: 'Yehia Zamel', total: 59.99, status: 'Cancelled' },
  ]
  
  // 2) Daily sales interface + mock data
  export interface DailySale {
    date: string  // use MM-DD
    sales: number
  }
  
  export const dailySales: DailySale[] = [
    { date: '05-01', sales: 1200 },
    { date: '05-02', sales: 1500 },
    { date: '05-03', sales: 900  },
    { date: '05-04', sales: 1700 },
    { date: '05-05', sales: 1850 },
    { date: '05-06', sales: 1600 },
    { date: '05-07', sales: 1450 },
  ]
  
  // 3) Top-selling products interface + mock data
  export interface TopProduct {
    product: string
    sales: number
  }
  
  export const topSellingProducts: TopProduct[] = [
    { product: 'Wireless Phone Charger', sales: 150 },
    { product: 'Dumb Watch',       sales: 120 },
    { product: 'Bluetooth screen', sales: 100 },
    { product: 'Laptop Stand',      sales:  80 },
    { product: 'Laptop Lenovo',        sales:  75 },
  ]  