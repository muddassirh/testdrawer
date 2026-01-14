export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  status: 'active' | 'inactive' | 'pending';
  sales: number;
  createdAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface Stats {
  total: number;
  active: number;
  totalSales: number;
  revenue: number;
}
