// Waiter dashboard for table and order management
import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, CheckCircle, Clock, Bell } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, Order } from '../../types';
import { TableService } from '../../services/TableService';
import { OrderService } from '../../services/OrderService';

export function WaiterDashboard() {
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const tableStatusConfig = {
    available: { icon: CheckCircle, color: 'success', label: 'Available' },
    occupied: { icon: Users, color: 'info', label: 'Occupied' },
    'needs-service': { icon: Bell, color: 'warning', label: 'Needs Service' },
    'needs-cleaning': { icon: AlertCircle, color: 'danger', label: 'Needs Cleaning' }
  };

  const orderStatusConfig = {
    pending: { color: 'warning', label: 'New Order' },
    confirmed: { color: 'info', label: 'Confirmed' },
    preparing: { color: 'warning', label: 'Preparing' },
    ready: { color: 'success', label: 'Ready' },
    served: { color: 'success', label: 'Served' },
    paid: { color: 'default', label: 'Paid' }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tablesData, ordersData] = await Promise.all([
          TableService.getAllTables(),
          OrderService.getAllOrders()
        ]);
        setTables(tablesData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // TODO: Set up real-time updates via WebSocket
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleTableStatusUpdate = async (tableId: string, status: Table['status']) => {
    try {
      await TableService.updateTableStatus(tableId, status);
      setTables(prev => prev.map(table => 
        table.id === tableId ? { ...table, status } : table
      ));
    } catch (error) {
      console.error('Failed to update table status:', error);
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, status: Order['status']) => {
    try {
      await OrderService.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getTableOrder = (tableId: string) => {
    return orders.find(order => 
      order.tableId === tableId && 
      !['served', 'paid'].includes(order.status)
    );
  };

  const readyOrders = orders.filter(order => order.status === 'ready');
  const activeOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing'].includes(order.status)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold text-gray-900">{tables.filter(t => t.status === 'occupied').length}</p>
          <p className="text-gray-600">Occupied Tables</p>
        </Card>
        
        <Card className="text-center">
          <Bell className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
          <p className="text-2xl font-bold text-gray-900">{tables.filter(t => t.status === 'needs-service').length}</p>
          <p className="text-gray-600">Need Service</p>
        </Card>
        
        <Card className="text-center">
          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold text-gray-900">{readyOrders.length}</p>
          <p className="text-gray-600">Ready Orders</p>
        </Card>
        
        <Card className="text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <p className="text-2xl font-bold text-gray-900">{activeOrders.length}</p>
          <p className="text-gray-600">Active Orders</p>
        </Card>
      </div>

      {/* Ready orders alert */}
      {readyOrders.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Orders Ready for Delivery</h3>
          </div>
          <div className="space-y-2">
            {readyOrders.map(order => {
              const table = tables.find(t => t.id === order.tableId);
              return (
                <div key={order.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">Table {table?.number} - {table?.name}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleOrderStatusUpdate(order.id, 'served')}
                  >
                    Mark as Served
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Tables grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Table Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tables.map(table => {
            const statusConfig = tableStatusConfig[table.status];
            const StatusIcon = statusConfig.icon;
            const tableOrder = getTableOrder(table.id);

            return (
              <Card key={table.id} className="relative">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-700">{table.number}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{table.name}</h3>
                  <p className="text-sm text-gray-600">{table.seatCount} seats</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <Badge variant={statusConfig.color as any}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>

                  {tableOrder && (
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-xs font-medium">Current Order</p>
                      <Badge variant={orderStatusConfig[tableOrder.status].color as any} size="sm">
                        {orderStatusConfig[tableOrder.status].label}
                      </Badge>
                    </div>
                  )}

                  <div className="flex flex-col space-y-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleTableStatusUpdate(table.id, 'needs-service')}
                      disabled={table.status === 'needs-service'}
                    >
                      Request Service
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleTableStatusUpdate(table.id, 'needs-cleaning')}
                      disabled={table.status === 'needs-cleaning'}
                    >
                      Needs Cleaning
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleTableStatusUpdate(table.id, 'available')}
                      disabled={table.status === 'available'}
                    >
                      Mark Available
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}