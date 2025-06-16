// Enhanced waiter dashboard with improved UI and filtering
import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, CheckCircle, Clock, Bell, Filter } from 'lucide-react';
import { BackgroundWrapper } from '../../components/ui/BackgroundWrapper';
import { GlobalHeader } from '../../components/ui/GlobalHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TableGrid } from '../../components/ui/TableGrid';
import { Table, Order } from '../../types';
import { TableService } from '../../services/TableService';
import { OrderService } from '../../services/OrderService';

interface WaiterDashboardProps {
  onBack: () => void;
}

export function WaiterDashboard({ onBack }: WaiterDashboardProps) {
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'occupied' | 'needs-service' | 'ready-orders'>('all');

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

    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleTableAction = async (tableId: string, action: string) => {
    try {
      let newStatus: Table['status'];
      switch (action) {
        case 'service':
          newStatus = 'needs-service';
          break;
        case 'cleaning':
          newStatus = 'needs-cleaning';
          break;
        case 'available':
          newStatus = 'available';
          break;
        default:
          return;
      }
      
      await TableService.updateTableStatus(tableId, newStatus);
      setTables(prev => prev.map(table => 
        table.id === tableId ? { ...table, status: newStatus } : table
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

  const readyOrders = orders.filter(order => order.status === 'ready');
  const activeOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing'].includes(order.status)
  );

  const filteredTables = tables.filter(table => {
    switch (filter) {
      case 'occupied':
        return table.status === 'occupied';
      case 'needs-service':
        return table.status === 'needs-service';
      case 'ready-orders':
        return readyOrders.some(order => order.tableId === table.id);
      default:
        return true;
    }
  });

  const filters = [
    { id: 'all', label: 'All Tables', count: tables.length },
    { id: 'occupied', label: 'Occupied', count: tables.filter(t => t.status === 'occupied').length },
    { id: 'needs-service', label: 'Need Service', count: tables.filter(t => t.status === 'needs-service').length },
    { id: 'ready-orders', label: 'Ready Orders', count: readyOrders.length }
  ];

  if (loading) {
    return (
      <BackgroundWrapper variant="default">
        <GlobalHeader 
          title="Waiter Dashboard" 
          subtitle="Table & Order Management"
          icon={Users}
          variant="waiter"
          showBackButton
          onBack={onBack}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper variant="default">
      <GlobalHeader 
        title="Waiter Dashboard" 
        subtitle="Table & Order Management"
        icon={Users}
        variant="waiter"
        showBackButton
        onBack={onBack}
      />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{tables.filter(t => t.status === 'occupied').length}</p>
            <p className="text-gray-600 dark:text-gray-400">Occupied Tables</p>
          </Card>
          
          <Card className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50">
            <Bell className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{tables.filter(t => t.status === 'needs-service').length}</p>
            <p className="text-gray-600 dark:text-gray-400">Need Service</p>
          </Card>
          
          <Card className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{readyOrders.length}</p>
            <p className="text-gray-600 dark:text-gray-400">Ready Orders</p>
          </Card>
          
          <Card className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50">
            <Clock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeOrders.length}</p>
            <p className="text-gray-600 dark:text-gray-400">Active Orders</p>
          </Card>
        </div>

        {/* Ready orders alert */}
        {readyOrders.length > 0 && (
          <Card className="bg-green-50/80 dark:bg-green-900/20 border-green-200 dark:border-green-800 backdrop-blur-xl">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-300">🍽️ Orders Ready for Delivery</h3>
            </div>
            <div className="space-y-3">
              {readyOrders.map(order => {
                const table = tables.find(t => t.id === order.tableId);
                return (
                  <div key={order.id} className="flex items-center justify-between bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg backdrop-blur-sm">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Order #{order.id}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Table {table?.number} - {table?.name}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleOrderStatusUpdate(order.id, 'served')}
                    >
                      Mark as Served ✅
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
          </div>
          {filters.map(filterOption => (
            <Button
              key={filterOption.id}
              variant={filter === filterOption.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(filterOption.id as any)}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/50 dark:border-gray-700/50"
            >
              {filterOption.label} ({filterOption.count})
            </Button>
          ))}
        </div>

        {/* Tables grid */}
        <TableGrid
          tables={filteredTables}
          orders={orders}
          onTableAction={handleTableAction}
          showActions={true}
          variant="waiter"
        />
      </div>
    </BackgroundWrapper>
  );
}