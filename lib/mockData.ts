import { Product } from '@/types';

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    description: "High-quality audio with active noise cancellation",
    price: "$299.99",
    category: "Electronics",
    status: "active",
    sales: 1234,
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    description: "Track your health and fitness goals",
    price: "$199.99",
    category: "Wearables",
    status: "active",
    sales: 856,
    createdAt: "2024-01-20"
  },
  {
    id: 3,
    name: "Ergonomic Office Chair",
    description: "Comfortable seating for long work hours",
    price: "$449.99",
    category: "Furniture",
    status: "pending",
    sales: 423,
    createdAt: "2024-02-01"
  },
  {
    id: 4,
    name: "4K Ultra HD Camera",
    description: "Professional photography and videography",
    price: "$1,299.99",
    category: "Electronics",
    status: "active",
    sales: 312,
    createdAt: "2024-02-10"
  },
  {
    id: 5,
    name: "Minimalist Desk Lamp",
    description: "Modern design with adjustable brightness",
    price: "$79.99",
    category: "Home",
    status: "inactive",
    sales: 167,
    createdAt: "2024-02-15"
  }
];
