// Kitchen dashboard for order management
import React, { useState, useEffect } from 'react';
import { Clock, ChefHat, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Order, Table } from '../../types';
import { OrderService } from '../../services/OrderService';
import { TableService } from '../../services/TableService';

export function KitchenDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  const orderStatusConfig = {
    pending: { color: 'warning', label: 'New', priority: 1 },
    confirmed: { color: 'info', label: 'Confirmed', priority: 2 },
    preparing: { color: 'warning', label: 'In Progress', priority: 3 },
    ready: { color: 'success', label: 'Ready', priority: 4 }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, tablesData] = await Promise.all([
          OrderService.getKitchenOrders(),
          TableService.getAllTables()
        ]);
        
        // Sort orders by timestamp (oldest first)
        const sortedOrders = ordersData.sort((a, b) => 
          a.timestamp.getTime() - b.timestamp.getTime()
        );
        
        setOrders(sortedOrders);
        setTables(tablesData);
      } catch (error) {
        console.error('Failed to load kitchen data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // TODO: Set up real-time updates via WebSocket
    const interval = setInterval(loadData, 15000); // More frequent updates for kitchen
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
    try {
      await OrderService.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getTable = (tableId: string) => {
    return tables.find(table => table.id === tableId);
  };

  const getOrderAge = (timestamp: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    return diffMinutes;
  };

  const isOrderUrgent = (order: Order) => {
    const age = getOrderAge(order.timestamp);
    return age > 30; // Orders older than 30 minutes are urgent
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading kitchen orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="text-2xl font-bold text-gray-900">
            {orders.filter(order => order.status === 'pending').length}
          </p>
          <p className="text-gray-600">New Orders</p>
        </Card>
        
        <Card className="text-center">
          <ChefHat className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
          <p className="text-2xl font-bold text-gray-900">
            {orders.filter(order => order.status === 'preparing').length}
          </p>
          <p className="text-gray-600">In Progress</p>
        </Card>
        
        <Card className="text-center">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold text-gray-900">
            {orders.filter(order => order.status === 'ready').length}
          </p>
          <p className="text-gray-600">Ready</p>
        </Card>
        
        <Card className="text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <p className="text-2xl font-bold text-gray-900">
            {orders.filter(isOrderUrgent).length}
          </p>
          <p className="text-gray-600">Urgent</p>
        </Card>
      </div>

      {/* Orders */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Kitchen Orders</h2>
        
        {orders.length === 0 ? (
          <Card className="text-center py-12">
            <ChefHat className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders to prepare</h3>
            <p className="text-gray-600">All caught up! New orders will appear here.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {orders.map(order => {
              const table = getTable(order.tableId);
              const age = getOrderAge(order.timestamp);
              const isUrgent = isOrderUrgent(order);
              const statusConfig = orderStatusConfig[order.status as keyof typeof orderStatusConfig];

              return (
                <Card 
                  key={order.id} 
                  className={`${isUrgent ? 'border-red-300 bg-red-50' : ''}`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">
                          Table {table?.number} - {table?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={statusConfig?.color as any}
                          className={isUrgent ? 'animate-pulse' : ''}
                        >
                          {statusConfig?.label}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {age} min ago
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="border-l-4 border-gray-200 pl-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{item.menuItem.name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              {item.specialInstructions && (
                                <p className="text-sm text-blue-600 mt-1">
                                  ⚠️ {item.specialInstructions}
                                </p>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {item.menuItem.prepTime}min
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Special requests */}
                    {order.specialRequests && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-1">Special Requests:</p>
                        <p className="text-sm text-blue-800">{order.specialRequests}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2">
                      {order.status === 'pending' && (
                        <Button
                          onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                          variant="success"
                          size="sm"
                          className="flex-1"
                        >
                          Accept Order
                        </Button>
                      )}
                      
                      {order.status === 'confirmed' && (
                        <Button
                          onClick={() => handleStatusUpdate(order.id, 'preparing')}
                          variant="warning"
                          size="sm"
                          className="flex-1"
                        >
                          Start Preparing
                        </Button>
                      )}
                      
                      {order.status === 'preparing' && (
                        <Button
                          onClick={() => handleStatusUpdate(order.id, 'ready')}
                          variant="success"
                          size="sm"
                          className="flex-1"
                        >
                          Mark Ready
                        </Button>
                      )}
                      
                      {order.status === 'ready' && (
                        <div className="flex-1 text-center py-2 bg-green-100 text-green-800 rounded font-medium text-sm">
                          Ready for Pickup
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}