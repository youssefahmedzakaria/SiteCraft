export interface SidebarElement {
    id: string
    icon: string
    title: string
    destination: string
    isOpen: boolean
}

export const sidebarElements: SidebarElement[] = [
  {
    id: '1',
    icon: '/icons/home.svg',
    title: 'Overview',
    destination: '/dashboard/overview',
    isOpen: false
  },
  {
    id: '2',
    icon: '/icons/template.svg',
    title: 'Customize Template',
    destination: '/dashboard/customize',
    isOpen: false
  },
  {
    id: '3',
    icon: '/icons/category.svg',
    title: 'Categories',
    destination: '/dashboard/categories',
    isOpen: false
  },
  {
    id: '4',
    icon: '/icons/products.svg',
    title: 'Products',
    destination: '/dashboard/products',
    isOpen: false
  },
  {
    id: '5',
    icon: '/icons/orders.svg',
    title: 'Orders',
    destination: '/dashboard/orders',
    isOpen: false
  },
  {
    id: '6',
    icon: '/icons/customers.svg',
    title: 'Customers',
    destination: '/dashboard/customers',
    isOpen: false
  },
  {
    id: '7',
    icon: '/icons/analytics.svg',
    title: 'Analytics',
    destination: '/dashboard/analytics',
    isOpen: false
  },
  {
    id: '8',
    icon: '/icons/info.svg',
    title: 'Store Info',
    destination: '/dashboard/store-info',
    isOpen: false
  },
  {
    id: '9',
    icon: '/icons/shipping.svg',
    title: 'Shipping Info',
    destination: '/dashboard/shipping',
    isOpen: false
  },
]