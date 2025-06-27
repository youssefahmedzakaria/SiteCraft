export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  status: string;
  orders?: Order[];
  totalSpent?: number;
  orderCount?: number;
}

export interface Order {
  id: number;
  price: number;
  status: string;
  issueDate: string;
}

// API Functions
export const getCustomers = async (): Promise<Customer[]> => {
  try {
    console.log('📞 Fetching customers from backend...');
    const response = await fetch('http://localhost:8080/customer', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const customers = await response.json();
    console.log('✅ Customers fetched successfully:', customers);
    
    // Transform customers to include order count and total spent
    const transformedCustomers = customers.map((customer: any) => ({
      ...customer,
      orderCount: customer.orders ? customer.orders.length : 0,
      totalSpent: customer.orders 
        ? customer.orders.reduce((sum: number, order: Order) => sum + order.price, 0)
        : 0
    }));

    return transformedCustomers;
  } catch (error) {
    console.error('💥 Error fetching customers:', error);
    throw error;
  }
};

export const getCustomer = async (customerId: number): Promise<Customer> => {
  try {
    console.log('📞 Fetching customer:', customerId);
    const response = await fetch(`http://localhost:8080/customer/${customerId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const customer = await response.json();
    console.log('✅ Customer fetched successfully:', customer);
    
    // Transform customer to include order count and total spent
    const transformedCustomer = {
      ...customer,
      orderCount: customer.orders ? customer.orders.length : 0,
      totalSpent: customer.orders 
        ? customer.orders.reduce((sum: number, order: Order) => sum + order.price, 0)
        : 0
    };

    return transformedCustomer;
  } catch (error) {
    console.error('💥 Error fetching customer:', error);
    throw error;
  }
};

export const suspendCustomer = async (customerId: number): Promise<void> => {
  try {
    console.log('📞 Suspending customer:', customerId);
    const response = await fetch(`http://localhost:8080/customer/suspend/${customerId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('✅ Customer suspended successfully');
  } catch (error) {
    console.error('💥 Error suspending customer:', error);
    throw error;
  }
};

// Mock data for fallback
export const customers: Customer[] = [
  {
    id: 1,
    name: "Aisha Mohamed",
    email: "aisha.mohamed@example.com",
    phone: "+201234567890",
    gender: "Female",
    status: "active",
    orderCount: 8,
    totalSpent: 2450
  },
  {
    id: 2,
    name: "Omar Ahmed",
    email: "omar.ahmed@example.com",
    phone: "+201234567891",
    gender: "Male",
    status: "active",
    orderCount: 4,
    totalSpent: 1280
  },
  {
    id: 3,
    name: "Sara Hassan",
    email: "sara.hassan@example.com",
    phone: "+201234567892",
    gender: "Female",
    status: "active",
    orderCount: 12,
    totalSpent: 3680
  },
  {
    id: 4,
    name: "Mahmoud Ali",
    email: "mahmoud.ali@example.com",
    phone: "+201234567893",
    gender: "Male",
    status: "inactive",
    orderCount: 0,
    totalSpent: 0
  },
  {
    id: 5,
    name: "Nadia Ibrahim",
    email: "nadia.ibrahim@example.com",
    phone: "+201234567894",
    gender: "Female",
    status: "active",
    orderCount: 6,
    totalSpent: 1950
  },
  {
    id: 6,
    name: "Khaled Hamdy",
    email: "khaled.hamdy@example.com",
    phone: "+201234567895",
    gender: "Male",
    status: "active",
    orderCount: 3,
    totalSpent: 860
  },
  {
    id: 7,
    name: "Layla Mostafa",
    email: "layla.mostafa@example.com",
    phone: "+201234567896",
    gender: "Female",
    status: "active",
    orderCount: 9,
    totalSpent: 2780
  },
  {
    id: 8,
    name: "Youssef Kamal",
    email: "youssef.kamal@example.com",
    phone: "+201234567897",
    gender: "Male",
    status: "inactive",
    orderCount: 2,
    totalSpent: 590
  }
];