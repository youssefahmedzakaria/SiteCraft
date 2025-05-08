import { Product } from "@/lib/products";

export interface Order {
  id: string;
  customer: Customer;
  customerId: string; // Added customerId to link orders to customers
  issueDate: Date;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  trackingNumber: string;
  paymentMethod: string;
  items: OrderItem[];
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

// Enhanced mockOrders with proper customerId to match customer.id from customers.ts
export const mockOrders: Order[] = [
  // Orders for Aisha Mohamed (id: "1", 8 orders)
  {
    id: "ORD-001",
    customer: {
      name: "Aisha Mohamed",
      email: "aisha.mohamed@example.com",
      phone: "01123456789",
      address: "Cairo, Egypt"
    },
    customerId: "1",
    issueDate: new Date("2024-04-15"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-001",
        name: "Smart Watch",
        quantity: 1,
        price: 299.99,
        total: 299.99
      }
    ],
    subtotal: 299.99,
    shipping: 15.0,
    total: 314.99,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-123456"
  },
  {
    id: "ORD-002",
    customer: {
      name: "Aisha Mohamed",
      email: "aisha.mohamed@example.com",
      phone: "01123456789",
      address: "Cairo, Egypt"
    },
    customerId: "1",
    issueDate: new Date("2024-03-22"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-003",
        name: "Wireless Headphones",
        quantity: 1,
        price: 150.0,
        total: 150.0
      }
    ],
    subtotal: 150.0,
    shipping: 10.0,
    total: 160.0,
    paymentMethod: "PayPal",
    trackingNumber: "TRK-789012"
  },
  {
    id: "ORD-003",
    customer: {
      name: "Aisha Mohamed",
      email: "aisha.mohamed@example.com",
      phone: "01123456789",
      address: "Cairo, Egypt"
    },
    customerId: "1",
    issueDate: new Date("2024-03-10"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-005",
        name: "Smartphone Case",
        quantity: 2,
        price: 25.0,
        total: 50.0
      }
    ],
    subtotal: 50.0,
    shipping: 5.0,
    total: 55.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-345678"
  },
  {
    id: "ORD-004",
    customer: {
      name: "Aisha Mohamed",
      email: "aisha.mohamed@example.com",
      phone: "01123456789",
      address: "Cairo, Egypt"
    },
    customerId: "1",
    issueDate: new Date("2024-02-28"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-007",
        name: "Bluetooth Speaker",
        quantity: 1,
        price: 120.0,
        total: 120.0
      }
    ],
    subtotal: 120.0,
    shipping: 15.0,
    total: 135.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-901234"
  },
  {
    id: "ORD-005",
    customer: {
      name: "Aisha Mohamed",
      email: "aisha.mohamed@example.com",
      phone: "01123456789",
      address: "Cairo, Egypt"
    },
    customerId: "1",
    issueDate: new Date("2024-02-15"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-009",
        name: "USB-C Cable Pack",
        quantity: 3,
        price: 15.0,
        total: 45.0
      }
    ],
    subtotal: 45.0,
    shipping: 5.0,
    total: 50.0,
    paymentMethod: "PayPal",
    trackingNumber: "TRK-567890"
  },
  {
    id: "ORD-006",
    customer: {
      name: "Aisha Mohamed",
      email: "aisha.mohamed@example.com",
      phone: "01123456789",
      address: "Cairo, Egypt"
    },
    customerId: "1",
    issueDate: new Date("2024-01-20"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-011",
        name: "Power Bank",
        quantity: 1,
        price: 85.0,
        total: 85.0
      }
    ],
    subtotal: 85.0,
    shipping: 10.0,
    total: 95.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-123789"
  },
  {
    id: "ORD-007",
    customer: {
      name: "Aisha Mohamed",
      email: "aisha.mohamed@example.com",
      phone: "01123456789",
      address: "Cairo, Egypt"
    },
    customerId: "1",
    issueDate: new Date("2023-12-15"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-013",
        name: "Wireless Mouse",
        quantity: 1,
        price: 40.0,
        total: 40.0
      }
    ],
    subtotal: 40.0,
    shipping: 10.0,
    total: 50.0,
    paymentMethod: "PayPal",
    trackingNumber: "TRK-456123"
  },
  {
    id: "ORD-008",
    customer: {
      name: "Aisha Mohamed",
      email: "aisha.mohamed@example.com",
      phone: "01123456789",
      address: "Cairo, Egypt"
    },
    customerId: "1",
    issueDate: new Date("2023-11-30"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-015",
        name: "Smart Bulb Set",
        quantity: 4,
        price: 25.0,
        total: 100.0
      }
    ],
    subtotal: 100.0,
    shipping: 20.0,
    total: 120.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-789456"
  },
  
  // Orders for Omar Ahmed (id: "2", 4 orders)
  {
    id: "ORD-009",
    customer: {
      name: "Omar Ahmed",
      email: "omar.ahmed@example.com",
      phone: "01187654321",
      address: "Alexandria, Egypt"
    },
    customerId: "2",
    issueDate: new Date("2024-04-05"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-017",
        name: "Gaming Mouse",
        quantity: 1,
        price: 180.0,
        total: 180.0
      }
    ],
    subtotal: 180.0,
    shipping: 15.0,
    total: 195.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-012345"
  },
  {
    id: "ORD-010",
    customer: {
      name: "Omar Ahmed",
      email: "omar.ahmed@example.com",
      phone: "01187654321",
      address: "Alexandria, Egypt"
    },
    customerId: "2",
    issueDate: new Date("2024-03-15"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-019",
        name: "Mechanical Keyboard",
        quantity: 1,
        price: 250.0,
        total: 250.0
      }
    ],
    subtotal: 250.0,
    shipping: 20.0,
    total: 270.0,
    paymentMethod: "PayPal",
    trackingNumber: "TRK-678901"
  },
  {
    id: "ORD-011",
    customer: {
      name: "Omar Ahmed",
      email: "omar.ahmed@example.com",
      phone: "01187654321",
      address: "Alexandria, Egypt"
    },
    customerId: "2",
    issueDate: new Date("2024-02-25"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-021",
        name: "Gaming Headset",
        quantity: 1,
        price: 220.0,
        total: 220.0
      }
    ],
    subtotal: 220.0,
    shipping: 15.0,
    total: 235.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-234567"
  },
  {
    id: "ORD-012",
    customer: {
      name: "Omar Ahmed",
      email: "omar.ahmed@example.com",
      phone: "01187654321",
      address: "Alexandria, Egypt"
    },
    customerId: "2",
    issueDate: new Date("2024-01-20"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-023",
        name: "Mouse Pad XL",
        quantity: 2,
        price: 30.0,
        total: 60.0
      }
    ],
    subtotal: 60.0,
    shipping: 10.0,
    total: 70.0,
    paymentMethod: "PayPal",
    trackingNumber: "TRK-890123"
  },
  
  // Orders for Sara Hassan (id: "3", 12 orders)
  {
    id: "ORD-013",
    customer: {
      name: "Sara Hassan",
      email: "sara.hassan@example.com",
      phone: "01198765432",
      address: "Giza, Egypt"
    },
    customerId: "3",
    issueDate: new Date("2024-05-01"),
    status: "Processing",
    items: [
      {
        id: "ITEM-025",
        name: "Laptop Sleeve",
        quantity: 1,
        price: 45.0,
        total: 45.0
      }
    ],
    subtotal: 45.0,
    shipping: 10.0,
    total: 55.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-456789"
  },
  {
    id: "ORD-014",
    customer: {
      name: "Sara Hassan",
      email: "sara.hassan@example.com",
      phone: "01198765432",
      address: "Giza, Egypt"
    },
    customerId: "3",
    issueDate: new Date("2024-04-20"),
    status: "Shipped",
    items: [
      {
        id: "ITEM-027",
        name: "External SSD 1TB",
        quantity: 1,
        price: 350.0,
        total: 350.0
      }
    ],
    subtotal: 350.0,
    shipping: 20.0,
    total: 370.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-012789"
  },
  {
    id: "ORD-015",
    customer: {
      name: "Sara Hassan",
      email: "sara.hassan@example.com",
      phone: "01198765432",
      address: "Giza, Egypt"
    },
    customerId: "3",
    issueDate: new Date("2024-04-10"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-029",
        name: "Webcam HD",
        quantity: 1,
        price: 120.0,
        total: 120.0
      }
    ],
    subtotal: 120.0,
    shipping: 15.0,
    total: 135.0,
    paymentMethod: "PayPal",
    trackingNumber: "TRK-345012"
  },
  // Additional 9 orders for Sara Hassan to match her total of 12 orders
  {
    id: "ORD-016",
    customerId: "3",
    customer: {
      name: "Sara Hassan",
      email: "sara.hassan@example.com",
      phone: "01198765432",
      address: "Giza, Egypt"
    },
    issueDate: new Date("2024-03-25"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-031",
        name: "Smart Watch",
        quantity: 1,
        price: 300.0,
        total: 300.0
      }
    ],
    subtotal: 300.0,
    shipping: 15.0,
    total: 315.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-678234"
  },
  {
    id: "ORD-017",
    customerId: "3",
    customer: {
      name: "Sara Hassan",
      email: "sara.hassan@example.com",
      phone: "01198765432",
      address: "Giza, Egypt"
    },
    issueDate: new Date("2025-03-15"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-033",
        name: "Tablet Case",
        quantity: 1,
        price: 35.0,
        total: 35.0
      }
    ],
    subtotal: 35.0,
    shipping: 10.0,
    total: 45.0,
    paymentMethod: "PayPal",
    trackingNumber: "TRK-901567"
  },
  {
    id: "ORD-018",
    customerId: "3",
    customer: {
      name: "Sara Hassan",
      email: "sara.hassan@example.com",
      phone: "01198765432",
      address: "Giza, Egypt"
    },
    issueDate: new Date("2024-03-01"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-035",
        name: "Wireless Earbuds",
        quantity: 1,
        price: 180.0,
        total: 180.0
      }
    ],
    subtotal: 180.0,
    shipping: 15.0,
    total: 195.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-234890"
  },
  {
    id: "ORD-019",
    customerId: "3",
    customer: {
      name: "Sara Hassan",
      email: "sara.hassan@example.com",
      phone: "01198765432",
      address: "Giza, Egypt"
    },
    issueDate: new Date("2024-02-15"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-037",
        name: "Smartphone Charger",
        quantity: 2,
        price: 25.0,
        total: 50.0
      }
    ],
    subtotal: 50.0,
    shipping: 10.0,
    total: 60.0,
    paymentMethod: "PayPal",
    trackingNumber: "TRK-567123"
  },
  {
    id: "ORD-020",
    customerId: "3",
    customer: {
      name: "Sara Hassan",
      email: "sara.hassan@example.com",
      phone: "01198765432",
      address: "Giza, Egypt"
    },
    issueDate: new Date("2024-02-01"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-039",
        name: "Screen Protector",
        quantity: 3,
        price: 15.0,
        total: 45.0
      }
    ],
    subtotal: 45.0,
    shipping: 5.0,
    total: 50.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-890456"
  },
  {
    id: "ORD-021",
    customerId: "3",
    customer: {
      name: "Sara Hassan",
      email: "sara.hassan@example.com",
      phone: "01198765432",
      address: "Giza, Egypt"
    },
    issueDate: new Date("2024-01-20"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-041",
        name: "External Hard Drive",
        quantity: 1,
        price: 250.0,
        total: 250.0
      }
    ],
    subtotal: 250.0,
    shipping: 20.0,
    total: 270.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-123456"
  },
  {
    id: "ORD-022",
    customerId: "3",
    customer: {
      name: "Sara Hassan",
      email: "sara.hassan@example.com",
      phone: "01198765432",
      address: "Giza, Egypt"
    },
    issueDate: new Date("2024-01-10"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-043",
        name: "Bluetooth Keyboard",
        quantity: 1,
        price: 120.0,
        total: 120.0
      }
    ],
    subtotal: 120.0,
    shipping: 15.0,
    total: 135.0,
    paymentMethod: "PayPal",
    trackingNumber: "TRK-456789"
  },
  {
    id: "ORD-023",
    customerId: "3",
    customer: {
      name: "Sara Hassan",
      email: "sara.hassan@example.com",
      phone: "01198765432",
      address: "Giza, Egypt"
    },
    issueDate: new Date("2023-12-20"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-045",
        name: "USB Hub",
        quantity: 1,
        price: 45.0,
        total: 45.0
      }
    ],
    subtotal: 45.0,
    shipping: 10.0,
    total: 55.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-789012"
  },
  {
    id: "ORD-024",
    customerId: "3",
    customer: {
      name: "Sara Hassan",
      email: "sara.hassan@example.com",
      phone: "01198765432",
      address: "Giza, Egypt"
    },
    issueDate: new Date("2023-12-05"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-047",
        name: "Wireless Charging Pad",
        quantity: 1,
        price: 60.0,
        total: 60.0
      }
    ],
    subtotal: 60.0,
    shipping: 10.0,
    total: 70.0,
    paymentMethod: "PayPal",
    trackingNumber: "TRK-012345"
  },
  
  // Orders for Nadia Ibrahim (id: "5", 6 orders)
  {
    id: "ORD-025",
    customerId: "5",
    customer: {
      name: "Nadia Ibrahim",
      email: "nadia.ibrahim@example.com",
      phone: "01112345678",
      address: "Port Said, Egypt"
    },
    issueDate: new Date("2024-04-25"),
    status: "Shipped",
    items: [
      {
        id: "ITEM-049",
        name: "Digital Camera",
        quantity: 1,
        price: 450.0,
        total: 450.0
      }
    ],
    subtotal: 450.0,
    shipping: 25.0,
    total: 475.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-345678"
  },
  {
    id: "ORD-026",
    customerId: "5",
    customer: {
      name: "Nadia Ibrahim",
      email: "nadia.ibrahim@example.com",
      phone: "01112345678",
      address: "Port Said, Egypt"
    },
    issueDate: new Date("2024-04-10"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-051",
        name: "Camera Lens",
        quantity: 1,
        price: 350.0,
        total: 350.0
      }
    ],
    subtotal: 350.0,
    shipping: 20.0,
    total: 370.0,
    paymentMethod: "PayPal",
    trackingNumber: "TRK-678901"
  },
  {
    id: "ORD-027",
    customerId: "5",
    customer: {
      name: "Nadia Ibrahim",
      email: "nadia.ibrahim@example.com",
      phone: "01112345678",
      address: "Port Said, Egypt"
    },
    issueDate: new Date("2024-03-20"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-053",
        name: "Camera Bag",
        quantity: 1,
        price: 85.0,
        total: 85.0
      }
    ],
    subtotal: 85.0,
    shipping: 15.0,
    total: 100.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-901234"
  },
  {
    id: "ORD-028",
    customerId: "5",
    customer: {
      name: "Nadia Ibrahim",
      email: "nadia.ibrahim@example.com",
      phone: "01112345678",
      address: "Port Said, Egypt"
    },
    issueDate: new Date("2024-03-05"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-055",
        name: "SD Card 128GB",
        quantity: 2,
        price: 45.0,
        total: 90.0
      }
    ],
    subtotal: 90.0,
    shipping: 10.0,
    total: 100.0,
    paymentMethod: "PayPal",
    trackingNumber: "TRK-234567"
  },
  {
    id: "ORD-029",
    customerId: "5",
    customer: {
      name: "Nadia Ibrahim",
      email: "nadia.ibrahim@example.com",
      phone: "01112345678",
      address: "Port Said, Egypt"
    },
    issueDate: new Date("2024-02-15"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-057",
        name: "Tripod",
        quantity: 1,
        price: 120.0,
        total: 120.0
      }
    ],
    subtotal: 120.0,
    shipping: 20.0,
    total: 140.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-567890"
  },
  {
    id: "ORD-030",
    customerId: "5",
    customer: {
      name: "Nadia Ibrahim",
      email: "nadia.ibrahim@example.com",
      phone: "01112345678",
      address: "Port Said, Egypt"
    },
    issueDate: new Date("2024-01-20"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-059",
        name: "Camera Cleaning Kit",
        quantity: 1,
        price: 35.0,
        total: 35.0
      }
    ],
    subtotal: 35.0,
    shipping: 10.0,
    total: 45.0,
    paymentMethod: "PayPal",
    trackingNumber: "TRK-890123"
  },
  
  // Orders for Khaled Hamdy (id: "6", 3 orders)
  {
    id: "ORD-031",
    customerId: "6",
    customer: {
      name: "Khaled Hamdy",
      email: "khaled.hamdy@example.com",
      phone: "01167890123",
      address: "Luxor, Egypt"
    },
    issueDate: new Date("2024-04-20"),
    status: "Shipped",
    items: [
      {
        id: "ITEM-061",
        name: "Coffee Maker",
        quantity: 1,
        price: 220.0,
        total: 220.0
      }
    ],
    subtotal: 220.0,
    shipping: 30.0,
    total: 250.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-456789"
  },
  {
    id: "ORD-032",
    customerId: "6",
    customer: {
      name: "Khaled Hamdy",
      email: "khaled.hamdy@example.com",
      phone: "01167890123",
      address: "Luxor, Egypt"
    },
    issueDate: new Date("2024-03-15"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-063",
        name: "Coffee Beans Premium",
        quantity: 3,
        price: 40.0,
        total: 120.0
      }
    ],
    subtotal: 120.0,
    shipping: 15.0,
    total: 135.0,
    paymentMethod: "PayPal",
    trackingNumber: "TRK-789012"
  },
  {
    id: "ORD-033",
    customerId: "6",
    customer: {
      name: "Khaled Hamdy",
      email: "khaled.hamdy@example.com",
      phone: "01167890123",
      address: "Luxor, Egypt"
    },
    issueDate: new Date("2024-02-10"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-065",
        name: "Milk Frother",
        quantity: 1,
        price: 75.0,
        total: 75.0
      }
    ],
    subtotal: 75.0,
    shipping: 15.0,
    total: 90.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-012345"
  },
  
  // Orders for Layla Mostafa (id: "7", 9 orders)
  {
    id: "ORD-034",
    customerId: "7",
    customer: {
      name: "Layla Mostafa",
      email: "layla.mostafa@example.com",
      phone: "01190123456",
      address: "Aswan, Egypt"
    },
    issueDate: new Date("2024-05-01"),
    status: "Processing",
    items: [
      {
        id: "ITEM-067",
        name: "Yoga Mat",
        quantity: 1,
        price: 55.0,
        total: 55.0
      }
    ],
    subtotal: 55.0,
    shipping: 15.0,
    total: 70.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-234567"
  },
  // Add 8 more orders for Layla Mostafa to match her total of 9 orders
  {
    id: "ORD-035",
    customerId: "7",
    customer: {
      name: "Layla Mostafa",
      email: "layla.mostafa@example.com",
      phone: "01190123456",
      address: "Aswan, Egypt"
    },
    issueDate: new Date("2024-04-15"),
    status: "Shipped",
    items: [
      {
        id: "ITEM-069",
        name: "Resistance Bands Set",
        quantity: 1,
        price: 65.0,
        total: 65.0
      }
    ],
    subtotal: 65.0,
    shipping: 15.0,
    total: 80.0,
    paymentMethod: "PayPal",
    trackingNumber: "TRK-567890"
  },
  {
    id: "ORD-036",
    customerId: "7",
    customer: {
      name: "Layla Mostafa",
      email: "layla.mostafa@example.com",
      phone: "01190123456",
      address: "Aswan, Egypt"
    },
    issueDate: new Date("2024-04-01"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-071",
        name: "Fitness Tracker",
        quantity: 1,
        price: 199.0,
        total: 199.0
      }
    ],
    subtotal: 199.0,
    shipping: 20.0,
    total: 219.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-890123"
  },
  {
    id: "ORD-037",
    customerId: "7",
    customer: {
      name: "Layla Mostafa",
      email: "layla.mostafa@example.com",
      phone: "01190123456",
      address: "Aswan, Egypt"
    },
    issueDate: new Date("2024-03-15"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-073",
        name: "Sports Water Bottle",
        quantity: 2,
        price: 30.0,
        total: 60.0
      }
    ],
    subtotal: 60.0,
    shipping: 15.0,
    total: 75.0,
    paymentMethod: "PayPal",
    trackingNumber: "TRK-123456"
  },
  {
    id: "ORD-038",
    customerId: "7",
    customer: {
      name: "Layla Mostafa",
      email: "layla.mostafa@example.com",
      phone: "01190123456",
      address: "Aswan, Egypt"
    },
    issueDate: new Date("2024-03-01"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-075",
        name: "Running Shoes",
        quantity: 1,
        price: 180.0,
        total: 180.0
      }
    ],
    subtotal: 180.0,
    shipping: 25.0,
    total: 205.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-456789"
  },
  {
    id: "ORD-039",
    customerId: "7",
    customer: {
      name: "Layla Mostafa",
      email: "layla.mostafa@example.com",
      phone: "01190123456",
      address: "Aswan, Egypt"
    },
    issueDate: new Date("2024-02-15"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-077",
        name: "Gym Gloves",
        quantity: 1,
        price: 45.0,
        total: 45.0
      }
    ],
    subtotal: 45.0,
    shipping: 10.0,
    total: 55.0,
    paymentMethod: "PayPal",
    trackingNumber: "TRK-789012"
  },
  {
    id: "ORD-040",
    customerId: "7",
    customer: {
      name: "Layla Mostafa",
      email: "layla.mostafa@example.com",
      phone: "01190123456",
      address: "Aswan, Egypt"
    },
    issueDate: new Date("2024-02-01"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-079",
        name: "Protein Powder",
        quantity: 2,
        price: 80.0,
        total: 160.0
      }
    ],
    subtotal: 160.0,
    shipping: 15.0,
    total: 175.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-012345"
  },
  {
    id: "ORD-041",
    customerId: "7",
    customer: {
      name: "Layla Mostafa",
      email: "layla.mostafa@example.com",
      phone: "01190123456",
      address: "Aswan, Egypt"
    },
    issueDate: new Date("2024-01-15"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-081",
        name: "Fitness Mat",
        quantity: 1,
        price: 65.0,
        total: 65.0
      }
    ],
    subtotal: 65.0,
    shipping: 15.0,
    total: 80.0,
    paymentMethod: "PayPal",
    trackingNumber: "TRK-345678"
  },
  {
    id: "ORD-042",
    customerId: "7",
    customer: {
      name: "Layla Mostafa",
      email: "layla.mostafa@example.com",
      phone: "01190123456",
      address: "Aswan, Egypt"
    },
    issueDate: new Date("2024-01-01"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-083",
        name: "Jump Rope",
        quantity: 1,
        price: 35.0,
        total: 35.0
      }
    ],
    subtotal: 35.0,
    shipping: 10.0,
    total: 45.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-678901"
  },
  
  // Orders for Youssef Kamal (id: "8", 2 orders)
  {
    id: "ORD-043",
    customerId: "8",
    customer: {
      name: "Youssef Kamal",
      email: "youssef.kamal@example.com",
      phone: "01178901234",
      address: "Hurghada, Egypt"
    },
    issueDate: new Date("2024-02-10"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-085",
        name: "Desk Lamp",
        quantity: 1,
        price: 75.0,
        total: 75.0
      }
    ],
    subtotal: 75.0,
    shipping: 15.0,
    total: 90.0,
    paymentMethod: "Credit Card",
    trackingNumber: "TRK-901234"
  },
  {
    id: "ORD-044",
    customerId: "8",
    customer: {
      name: "Youssef Kamal",
      email: "youssef.kamal@example.com",
      phone: "01178901234",
      address: "Hurghada, Egypt"
    },
    issueDate: new Date("2024-01-15"),
    status: "Delivered",
    items: [
      {
        id: "ITEM-087",
        name: "Office Chair",
        quantity: 1,
        price: 350.0,
        total: 350.0
      }
    ],
    subtotal: 350.0,
    shipping: 50.0,
    total: 400.0,
    paymentMethod: "PayPal",
    trackingNumber: "TRK-234567"
  }
];
