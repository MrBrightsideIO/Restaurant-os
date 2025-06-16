// Core type definitions for the restaurant ordering system

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'drink' | 'special';
  image: string;
  ingredients: string[];
  allergens: string[];
  available: boolean;
  prepTime: number; // in minutes
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface Table {
  id: string;
  number: number;
  name: string;
  seatCount: number;
  status: 'available' | 'occupied' | 'needs-service' | 'needs-cleaning';
  currentOrder?: Order;
}

export interface Order {
  id: string;
  tableId: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'paid';
  timestamp: Date;
  total: number;
  specialRequests?: string;
  estimatedTime?: number;
}

export interface User {
  id: string;
  name: string;
  role: 'guest' | 'waiter' | 'kitchen' | 'admin';
  email?: string;
}

export type OrderStatus = Order['status'];
export type TableStatus = Table['status'];