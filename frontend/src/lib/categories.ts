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