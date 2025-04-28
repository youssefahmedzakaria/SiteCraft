export interface Product {
    id: string
    name: string
    category: string
    price: string
    stock: number
    status: string
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Ergonomic Desk Chair',
    category: 'Home & Kitchen',
    price: "15,000 EGP",
    stock: 45,
    status: 'In Stock',
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: "2,000 EGP",
    stock: 0,
    status: 'Out Of Stock',
  },
  {
    id: '3',
    name: 'Cotton T-Shirt',
    category: 'Clothing',
    price: "500 EGP",
    stock: 156,
    status: 'In Stock',
  },
]