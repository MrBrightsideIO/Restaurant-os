// Order service with mock data and real-time integration placeholders
import { Order, CartItem, Table } from '../types';

// Mock orders data
let mockOrders: Order[] = [];
let orderIdCounter = 1;

export class OrderService {
  // Guest functionality - place new order
  static async placeOrder(tableId: string, items: CartItem[], specialRequests?: string): Promise<Order> {
    const total = items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
    const estimatedTime = Math.max(...items.map(item => item.menuItem.prepTime * item.quantity));
    
    const order: Order = {
      id: (orderIdCounter++).toString(),
      tableId,
      items,
      status: 'pending',
      timestamp: new Date(),
      total,
      specialRequests,
      estimatedTime
    };

    mockOrders.push(order);
    
    // TODO: Send to backend and notify kitchen via WebSocket
    console.log('New order placed:', order);
    
    // TODO: Replace with WebSocket real-time updates
    // socket.emit('new-order', order);
    
    return order;
  }

  // Kitchen functionality - get orders for kitchen display
  static async getKitchenOrders(): Promise<Order[]> {
    return mockOrders.filter(order => 
      ['pending', 'confirmed', 'preparing'].includes(order.status)
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Kitchen/Waiter functionality - update order status
  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    const orderIndex = mockOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return false;

    mockOrders[orderIndex].status = status;
    
    // TODO: Broadcast status update via WebSocket
    console.log(`Order ${orderId} status updated to: ${status}`);
    
    return true;
  }

  // Waiter functionality - get orders by table
  static async getOrdersByTable(tableId: string): Promise<Order[]> {
    return mockOrders.filter(order => order.tableId === tableId);
  }

  // Guest functionality - get order status
  static async getOrderStatus(orderId: string): Promise<Order | null> {
    return mockOrders.find(order => order.id === orderId) || null;
  }

  // Admin functionality - get all orders for analytics
  static async getAllOrders(): Promise<Order[]> {
    return mockOrders;
  }

  // TODO: Integration with real-time updates
  static onOrderUpdate(callback: (order: Order) => void): () => void {
    // Placeholder for WebSocket subscription
    console.log('Subscribing to order updates');
    
    // Return unsubscribe function
    return () => console.log('Unsubscribed from order updates');
  }
}