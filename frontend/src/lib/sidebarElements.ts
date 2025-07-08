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
    titleKey: string
    destination: string
}

export const sidebarElements: SidebarElement[] = [
  {
    id: '1',
    iconName: 'Home',
    titleKey: 'sidebar.overview',
    destination: '/dashboard',
  },
  {
    id: '2',
    iconName: 'Layout',
    titleKey: 'sidebar.customizeTemplate',
    destination: '/dashboard/customize',
  },
  {
    id: '3',
    iconName: 'Tags',
    titleKey: 'sidebar.categories',
    destination: '/dashboard/categories',
  },
  {
    id: '4',
    iconName: 'ShoppingBag',
    titleKey: 'sidebar.products',
    destination: '/dashboard/products',
  },
  {
    id: '5',
    iconName: 'ShoppingCart',
    titleKey: 'sidebar.orders',
    destination: '/dashboard/orders',
  },
  {
    id: '6',
    iconName: 'Users',
    titleKey: 'sidebar.customers',
    destination: '/dashboard/customers',
  },
  {
    id: '7',
    iconName: 'BarChart2',
    titleKey: 'sidebar.analytics',
    destination: '/dashboard/analytics',
  },
  {
    id: '8',
    iconName: 'Store',
    titleKey: 'sidebar.storeInfo',
    destination: '/dashboard/store-info',
  },
  {
    id: '9',
    iconName: 'Truck',
    titleKey: 'sidebar.shippingInfo',
    destination: '/dashboard/shipping',
  },
  {
    id: '10',
    iconName: 'Settings',
    titleKey: 'sidebar.accountSettings',
    destination: '/dashboard/account-settings',
  },
  {
    id: '11',
    iconName: 'LogOut',
    titleKey: 'sidebar.logOut',
    destination: '/',
  },
]

export function getFilteredSidebarElements(role: string | null): SidebarElement[] {
  if (role === 'staff') {
    // Staff users can access specific pages
    return sidebarElements.filter(element => 
      ['sidebar.categories', 'sidebar.products', 'sidebar.orders', 'sidebar.customers', 'sidebar.storeInfo', 'sidebar.shippingInfo', 'sidebar.logOut'].includes(element.titleKey)
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
