// frontend/src/lib/dashboardAnalytics.ts
import type { GeneralAnalytic } from '@/lib/generalAnalytics'
import type { Timespan } from '@/lib/chartData'

export const dashboardAnalyticsByTimespan: Record<Timespan, GeneralAnalytic[]> = {
  // Last 7 days
  '7': [
    {
      id: '1',
      title: 'Total Sales',
      value: 'e£3,500',
      subtitle: '+5% from last week',
    },
    {
      id: '2',
      title: 'Total Orders',
      value: '150',
      subtitle: '+3% from last week',
    },
    {
      id: '3',
      title: 'Total Visitors',
      value: '1,200',
      subtitle: '+8% from last week',
    },
    {
      id: '4',
      title: 'Conversion Rate',
      value: '2.5%',
      subtitle: '+0.5% from last week',
    },
    {
      id: '5',
      title: 'Average Order Value',
      value: 'e£23.33',
      subtitle: '+1% from last week',
    },
    {
      id: '6',
      title: 'Returning Customer Rate',
      value: '60%',
      subtitle: '+2% from last week',
    },
  ],

  // Last 30 days
  '30': [
    {
      id: '1',
      title: 'Total Sales',
      value: 'e£45,231.89',
      subtitle: '+20.1% from last month',
    },
    {
      id: '2',
      title: 'Total Orders',
      value: '2,350',
      subtitle: '+10.5% from last month',
    },
    {
      id: '3',
      title: 'Total Visitors',
      value: '573',
      subtitle: '+12.0% from last month',
    },
    {
      id: '4',
      title: 'Conversion Rate',
      value: '3.24%',
      subtitle: '+1.2% from last month',
    },
    {
      id: '5',
      title: 'Average Order Value',
      value: 'e£568.80',
      subtitle: '+10.5% from last month',
    },
    {
      id: '6',
      title: 'Returning Customer Rate',
      value: '71.4%',
      subtitle: '+2.1% from last month',
    },
  ],

  // Last 90 days
  '90': [
    {
      id: '1',
      title: 'Total Sales',
      value: 'e£120,000',
      subtitle: '+15% from last quarter',
    },
    {
      id: '2',
      title: 'Total Orders',
      value: '7,800',
      subtitle: '+9% from last quarter',
    },
    {
      id: '3',
      title: 'Total Visitors',
      value: '20,000',
      subtitle: '+12% from last quarter',
    },
    {
      id: '4',
      title: 'Conversion Rate',
      value: '3.0%',
      subtitle: '+0.8% from last quarter',
    },
    {
      id: '5',
      title: 'Average Order Value',
      value: 'e£55.00',
      subtitle: '+5% from last quarter',
    },
    {
      id: '6',
      title: 'Returning Customer Rate',
      value: '68%',
      subtitle: '+1.5% from last quarter',
    },
  ],

  // Last 365 days
  '365': [
    {
      id: '1',
      title: 'Total Sales',
      value: 'e£550,000',
      subtitle: '+30% from last year',
    },
    {
      id: '2',
      title: 'Total Orders',
      value: '28,000',
      subtitle: '+15% from last year',
    },
    {
      id: '3',
      title: 'Total Visitors',
      value: '250,000',
      subtitle: '+20% from last year',
    },
    {
      id: '4',
      title: 'Conversion Rate',
      value: '3.5%',
      subtitle: '+1.0% from last year',
    },
    {
      id: '5',
      title: 'Average Order Value',
      value: 'e£62.50',
      subtitle: '+8% from last year',
    },
    {
      id: '6',
      title: 'Returning Customer Rate',
      value: '75%',
      subtitle: '+3% from last year',
    },
  ],
}
