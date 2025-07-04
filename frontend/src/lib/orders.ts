import { Product } from "@/lib/products";

export interface Order {
  id: number;
  price: number;
  status: string;
  issueDate: string;
  customer?: Customer;
  orderProducts?: OrderProduct[];
  paymentLog?: PaymentLog;
  shipping?: Shipping;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  status: string;
}

export interface OrderProduct {
  id: number;
  sku: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface PaymentLog {
  id: number;
  method: string;
  transactionId?: string;
}

export interface Shipping {
  id: number;
  cost: number;
  status: string;
  address?: Address;
}

export interface Address {
  id: number;
  title: string;
  city: string;
  streetNum: string;
  buildingNum: string;
  floorNum?: string;
  apartmentNum?: string;
  landmark?: string;
}

// API Functions
export const getOrders = async (): Promise<Order[]> => {
  try {
    console.log('📞 Fetching orders from backend...');
    const response = await fetch('http://localhost:8080/order/getAllOrders', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Orders fetched successfully:', data);
    
    if (data.success && data.orders) {
      return data.orders;
    } else {
      throw new Error(data.message || 'Failed to fetch orders');
    }
  } catch (error) {
    console.error('💥 Error fetching orders:', error);
    throw error;
  }
};

export const getOrder = async (orderId: number): Promise<Order> => {
  try {
    console.log('📞 Fetching order:', orderId);
    const response = await fetch(`http://localhost:8080/order/getOrder/${orderId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Order fetched successfully:', data);
    
    if (data.success && data.order) {
      return data.order;
    } else {
      throw new Error(data.message || 'Failed to fetch order');
    }
  } catch (error) {
    console.error('💥 Error fetching order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: number, status: string): Promise<Order> => {
  try {
    console.log('📞 Updating order status:', orderId, status);
    const response = await fetch(`http://localhost:8080/order/updateOrderStatus/${orderId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Order status updated successfully:', data);
    
    if (data.success && data.orders) {
      return data.orders;
    } else {
      throw new Error(data.message || 'Failed to update order status');
    }
  } catch (error) {
    console.error('💥 Error updating order status:', error);
    throw error;
  }
};

// Helper function to transform backend order to frontend format
export const transformOrder = (order: any): Order => {
  return {
    id: order.id,
    price: order.price || 0,
    status: order.status || 'Pending',
    issueDate: order.issueDate || new Date().toISOString(),
    customer: order.customer ? {
      id: order.customer.id,
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone,
      gender: order.customer.gender,
      status: order.customer.status
    } : undefined,
    orderProducts: order.orderProducts
      ? order.orderProducts.map((op: any) => ({
          ...op,
          product: op.product
            ? op.product
            : (op.productId
                ? { id: op.productId, name: op.sku, description: '', variants: [], images: [] }
                : undefined)
        }))
      : [],
    paymentLog: order.paymentLog,
    shipping: order.shipping
  };
};

// Mock data for fallback
export const mockOrders: Order[] = [
  {
    id: 1,
    price: 1250.00,
    status: 'Delivered',
    issueDate: '2024-01-15T10:30:00',
    customer: {
      id: 11,
      name: 'Ahmed Mohamed',
      email: 'ahmed.mohamed@example.com',
      phone: '+20 100 123 4567',
      gender: 'Male',
      status: 'active'
    }
  },
  {
    id: 2,
    price: 890.50,
    status: 'Shipped',
    issueDate: '2024-02-20T14:15:00',
    customer: {
      id: 11,
      name: 'Ahmed Mohamed',
      email: 'ahmed.mohamed@example.com',
      phone: '+20 100 123 4567',
      gender: 'Male',
      status: 'active'
    }
  },
  {
    id: 3,
    price: 2100.00,
    status: 'Delivered',
    issueDate: '2024-01-10T09:45:00',
    customer: {
      id: 12,
      name: 'Sara Ali',
      email: 'sara.ali@example.com',
      phone: '+20 111 234 5678',
      gender: 'Female',
      status: 'active'
    }
  },
  {
    id: 4,
    price: 750.25,
    status: 'Processing',
    issueDate: '2024-03-05T16:20:00',
    customer: {
      id: 12,
      name: 'Sara Ali',
      email: 'sara.ali@example.com',
      phone: '+20 111 234 5678',
      gender: 'Female',
      status: 'active'
    }
  },
  {
    id: 5,
    price: 1800.75,
    status: 'Delivered',
    issueDate: '2024-02-08T11:30:00',
    customer: {
      id: 13,
      name: 'Mahmoud Ibrahim',
      email: 'mahmoud.ibrahim@example.com',
      phone: '+20 122 345 6789',
      gender: 'Male',
      status: 'active'
    }
  }
]; 