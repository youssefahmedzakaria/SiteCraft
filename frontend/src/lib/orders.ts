export interface Order {
  id: string;
  customerId: string;
  date: string;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';
  total: number;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Sample order data for demo purposes
export const orders: Order[] = [
  {
    id: "ORD-001",
    customerId: "1", // Aisha Mohamed
    date: "2025-04-15",
    status: "Delivered",
    total: 450,
    items: [
      { id: "ITEM001", name: "Premium Website Template", price: 300, quantity: 1 },
      { id: "ITEM002", name: "Custom Logo Design", price: 150, quantity: 1 }
    ]
  },
  {
    id: "ORD-002",
    customerId: "1", // Aisha Mohamed
    date: "2025-03-22",
    status: "Delivered",
    total: 600,
    items: [
      { id: "ITEM003", name: "E-commerce Plugin", price: 200, quantity: 1 },
      { id: "ITEM004", name: "SEO Package", price: 400, quantity: 1 }
    ]
  },
  {
    id: "ORD-003",
    customerId: "1", // Aisha Mohamed
    date: "2025-02-05",
    status: "Delivered",
    total: 1400,
    items: [
      { id: "ITEM005", name: "Custom Website Development", price: 1400, quantity: 1 }
    ]
  },
  {
    id: "ORD-004",
    customerId: "2", // Omar Ahmed
    date: "2025-04-10",
    status: "Processing",
    total: 500,
    items: [
      { id: "ITEM006", name: "Business Website Template", price: 250, quantity: 1 },
      { id: "ITEM007", name: "Content Writing Package", price: 250, quantity: 1 }
    ]
  },
  {
    id: "ORD-005",
    customerId: "2", // Omar Ahmed
    date: "2025-03-01",
    status: "Delivered",
    total: 780,
    items: [
      { id: "ITEM008", name: "E-commerce Setup", price: 780, quantity: 1 }
    ]
  },
  {
    id: "ORD-006",
    customerId: "3", // Sara Hassan
    date: "2025-04-25",
    status: "Processing",
    total: 880,
    items: [
      { id: "ITEM009", name: "Custom Theme Development", price: 880, quantity: 1 }
    ]
  },
  {
    id: "ORD-007",
    customerId: "3", // Sara Hassan
    date: "2025-04-18",
    status: "Shipped",
    total: 1200,
    items: [
      { id: "ITEM010", name: "Advanced E-commerce Package", price: 1200, quantity: 1 }
    ]
  },
  {
    id: "ORD-008",
    customerId: "3", // Sara Hassan
    date: "2025-03-15",
    status: "Delivered",
    total: 1600,
    items: [
      { id: "ITEM011", name: "Complete Business Solution", price: 1600, quantity: 1 }
    ]
  },
  {
    id: "ORD-009",
    customerId: "5", // Nadia Ibrahim
    date: "2025-04-20",
    status: "Processing",
    total: 350,
    items: [
      { id: "ITEM012", name: "Portfolio Template", price: 350, quantity: 1 }
    ]
  },
  {
    id: "ORD-010",
    customerId: "5", // Nadia Ibrahim
    date: "2025-03-10",
    status: "Delivered",
    total: 1600,
    items: [
      { id: "ITEM013", name: "Full Website Redesign", price: 1600, quantity: 1 }
    ]
  }
];