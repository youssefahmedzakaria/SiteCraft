export interface Customer {
    id: string;
    name: string;
    email: string;
    orders: number;
    totalSpent: number;
    status: 'Active' | 'Suspended';
  }
  
  export const customers: Customer[] = [
    {
      id: "1",
      name: "Aisha Mohamed",
      email: "aisha.mohamed@example.com",
      orders: 8,
      totalSpent: 2450,
      status: "Active"
    },
    {
      id: "2",
      name: "Omar Ahmed",
      email: "omar.ahmed@example.com",
      orders: 4,
      totalSpent: 1280,
      status: "Active"
    },
    {
      id: "3",
      name: "Sara Hassan",
      email: "sara.hassan@example.com",
      orders: 12,
      totalSpent: 3680,
      status: "Active"
    },
    {
      id: "4",
      name: "Mahmoud Ali",
      email: "mahmoud.ali@example.com",
      orders: 0,
      totalSpent: 0,
      status: "Suspended"
    },
    {
      id: "5",
      name: "Nadia Ibrahim",
      email: "nadia.ibrahim@example.com",
      orders: 6,
      totalSpent: 1950,
      status: "Active"
    },
    {
      id: "6",
      name: "Khaled Hamdy",
      email: "khaled.hamdy@example.com",
      orders: 3,
      totalSpent: 860,
      status: "Active"
    },
    {
      id: "7",
      name: "Layla Mostafa",
      email: "layla.mostafa@example.com",
      orders: 9,
      totalSpent: 2780,
      status: "Active"
    },
    {
      id: "8",
      name: "Youssef Kamal",
      email: "youssef.kamal@example.com",
      orders: 2,
      totalSpent: 590,
      status: "Suspended"
    }
  ];