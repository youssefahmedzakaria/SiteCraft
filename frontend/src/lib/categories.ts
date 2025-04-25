export interface Category {
    id: string
    title: string
    numOfProducts: number
    createdAt: string
    status: string
}

export const categories: Category[] = [
  {
    id: '1',
    title: 'Electronics',
    numOfProducts: 64,
    createdAt: '2023-10-15',
    status: 'Active',
  },
  {
    id: '2',
    title: 'Clothing',
    numOfProducts: 45,
    createdAt: '2023-09-22',
    status: 'Active',
  },
  {
    id: '3',
    title: 'Home & Kitchen',
    numOfProducts: 32,
    createdAt: '2023-11-03',
    status: 'Active',
  },
  {
    id: '4',
    title: 'Beauty',
    numOfProducts: 0,
    createdAt: '2023-12-01',
    status: 'Empty',
  },
]

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
    value: '12',
    subtitle: '+3 from last month',
  },
  {
    id: '2',
    title: 'Most Popular',
    value: 'Electronics',
    subtitle: '64 products',
  },
  {
    id: '3',
    title: 'Empty Categories',
    value: '1',
    subtitle: 'Action suggested',
  },
]