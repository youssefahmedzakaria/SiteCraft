export interface Order {
  id: string;
  customer: Customer;
  issueDate: Date;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;

  trackingNumber: string;

  paymentMethod: string;
  items: Product[];
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: {
      name: "Amira Ashraf",
      email: "amira.ashraf@example.com",
      phone: "0119535899",
      address: "October",
    },
    issueDate: new Date("2024-03-15"),
    status: "Pending",
    items: [
      {
        id: "ITEM-001",
        name: "Product 1",
        quantity: 2,
        price: 99.99,
        total: 199.98,
      },
      {
        id: "ITEM-002",
        name: "Product 2",
        quantity: 1,
        price: 100.01,
        total: 100.01,
      },
    ],
    subtotal: 299.99,
    shipping: 10.0,
    total: 339.99,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-123456789",
  },
  {
    id: "ORD-002",
    customer: {
      name: "Yehia Zakaria",
      email: "yehia.zakaria@example.com",
      phone: "01150888345",
      address: "Embaba",
    },
    issueDate: new Date("2024-03-15"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-001",
        name: "Product 1",
        quantity: 2,
        price: 99.99,
        total: 199.98,
      },
      {
        id: "ITEM-002",
        name: "Product 2",
        quantity: 1,
        price: 100.01,
        total: 100.01,
      },
    ],
    subtotal: 299.99,
    shipping: 10.0,
    total: 339.99,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-123456789",
  },
];
