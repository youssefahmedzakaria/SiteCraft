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

