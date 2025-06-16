// Enhanced kitchen dashboard with ticket system
import React, { useState, useEffect } from 'react';
import { Clock, ChefHat, CheckCircle, AlertCircle } from 'lucide-react';
import { BackgroundWrapper } from '../../components/ui/BackgroundWrapper';
import { GlobalHeader } from '../../components/ui/GlobalHeader';
import { Card } from '../../components/ui/Card';
import { TicketCard } from '../../components/tickets/TicketCard';
import { Order, Table } from '../../types';
import { OrderService } from '../../services/OrderService';
import { TableService } from '../../services/TableService';

interface KitchenDashboardProps {
  onBack: () => void;
}

export function KitchenDashboard({ onBack }: KitchenDashboardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, tablesData] = await Promise.all([
          OrderService.getKitchenOrders(),
          TableService.getAllTables()
        ]);
        
        // Filter orders that have food items (non-drink items)
        const foodOrders = ordersData.filter(order => 
          order.items.some(item => item.menuItem.category !== 'drink')
        );
        
        setOrders(foodOrders.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()));
        setTables(tablesData);
      } catch (error) {
        console.error('Failed to load kitchen data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const interval = setInterval(loadData, 15000);
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

  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const preparingOrders = orders.filter(order => order.status === 'preparing').length;
  const readyOrders = orders.filter(order => order.status === 'ready').length;
  const urgentOrders = orders.filter(order => {
    const age = Math.floor((new Date().getTime() - order.timestamp.getTime()) / (1000 * 60));
    return age > 30;
  }).length;

  if (loading) {
    return (
      <BackgroundWrapper variant="kitchen">
        <GlobalHeader 
          title="Kitchen Dashboard" 
          subtitle="Food Orders & Preparation"
          icon={ChefHat}
          variant="kitchen"
          showBackButton
          onBack={onBack}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-4 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading kitchen orders...</p>
            </div>
          </div>
        </div>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper variant="kitchen">
      <GlobalHeader 
        title="Kitchen Dashboard" 
        subtitle="Food Orders & Preparation"
        icon={ChefHat}
        variant="kitchen"
        showBackButton
        onBack={onBack}
      />
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingOrders}</p>
            <p className="text-gray-600 dark:text-gray-400">New Orders</p>
          </Card>
          
          <Card className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50">
            <ChefHat className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{preparingOrders}</p>
            <p className="text-gray-600 dark:text-gray-400">In Progress</p>
          </Card>
          
          <Card className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{readyOrders}</p>
            <p className="text-gray-600 dark:text-gray-400">Ready</p>
          </Card>
          
          <Card className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50">
            <Clock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{urgentOrders}</p>
            <p className="text-gray-600 dark:text-gray-400">Urgent</p>
          </Card>
        </div>

        {/* Orders */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Kitchen Tickets</h2>
          
          {orders.length === 0 ? (
            <Card className="text-center py-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50">
              <ChefHat className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders to prepare</h3>
              <p className="text-gray-600 dark:text-gray-400">All caught up! New food orders will appear here.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {orders.map(order => (
                <TicketCard
                  key={order.id}
                  order={order}
                  table={getTable(order.tableId)}
                  type="kitchen"
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </BackgroundWrapper>
  );
}