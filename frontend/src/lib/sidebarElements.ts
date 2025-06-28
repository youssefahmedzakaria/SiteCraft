export type IconName = 
  | 'Home' 
  | 'Layout' 
  | 'Tags' 
  | 'ShoppingBag' 
  | 'ShoppingCart' 
  | 'Users' 
  | 'BarChart2' 
  | 'Store' 
  | 'Truck'
  | 'Settings'
  | 'LogOut';

export interface SidebarElement {
    id: string
    iconName: IconName 
    title: string
    destination: string
}

export const sidebarElements: SidebarElement[] = [
  {
    id: '1',
    iconName: 'Home',
    title: 'Overview',
    destination: '/dashboard',
  },
  {
    id: '2',
    iconName: 'Layout',
    title: 'Customize Template',
    destination: '/dashboard/customize',
  },
  {
    id: '3',
    iconName: 'Tags',
    title: 'Categories',
    destination: '/dashboard/categories',
  },
  {
    id: '4',
    iconName: 'ShoppingBag',
    title: 'Products',
    destination: '/dashboard/products',
  },
  {
    id: '5',
    iconName: 'ShoppingCart',
    title: 'Orders',
    destination: '/dashboard/orders',
  },
  {
    id: '6',
    iconName: 'Users',
    title: 'Customers',
    destination: '/dashboard/customers',
  },
  {
    id: '7',
    iconName: 'BarChart2',
    title: 'Analytics',
    destination: '/dashboard/analytics',
  },
  {
    id: '8',
    iconName: 'Store',
    title: 'Store Info',
    destination: '/dashboard/store-info',
  },
  {
    id: '9',
    iconName: 'Truck',
    title: 'Shipping Info',
    destination: '/dashboard/shipping',
  },
  {
    id: '10',
    iconName: 'Settings',
    title: 'Account Settings',
    destination: '/dashboard/account-settings',
  },
  {
    id: '11',
    iconName: 'LogOut',
    title: 'Log Out',
    destination: '/',
  },
]

export function getFilteredSidebarElements(role: string | null): SidebarElement[] {
  if (role === 'staff') {
    // Staff users can access specific pages
    return sidebarElements.filter(element => 
      ['Categories', 'Products', 'Orders', 'Customers', 'Store Info', 'Shipping Info', 'Log Out'].includes(element.title)
    );
  }
  
  // Owner/admin users can access all pages
  return sidebarElements;
}

export function getFirstAccessiblePage(role: string): string {
  // For staff users, return the first accessible page
  // You can customize this logic based on your role-based access requirements
  if (role === 'staff') {
    // Return the first page that staff can access
    return '/dashboard/products'; // or any other appropriate first page
  }
  // For other roles, return dashboard overview
  return '/dashboard';
}
