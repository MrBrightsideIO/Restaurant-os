// Enhanced order status page with dark mode support
import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, ChefHat, Truck } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DarkModeToggle } from '../../components/ui/DarkModeToggle';
import { Order, OrderStatus as OrderStatusType } from '../../types';
import { OrderService } from '../../services/OrderService';
import { useDarkMode } from '../../hooks/useDarkMode';

interface OrderStatusProps {
  orderId: string;
  onBackToMenu: () => void;
}

export function OrderStatus({ orderId, onBackToMenu }: OrderStatusProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const statusConfig = {
    pending: { icon: Clock, label: 'Order Received', color: 'warning', description: 'Your order has been received and is being reviewed' },
    confirmed: { icon: CheckCircle, label: 'Order Confirmed', color: 'info', description: 'Your order has been confirmed and sent to the kitchen' },
    preparing: { icon: ChefHat, label: 'Being Prepared', color: 'warning', description: 'The chef is preparing your delicious meal' },
    ready: { icon: Truck, label: 'Ready for Pickup', color: 'success', description: 'Your order is ready! A waiter will bring it to your table' },
    served: { icon: CheckCircle, label: 'Served', color: 'success', description: 'Enjoy your meal!' },
    paid: { icon: CheckCircle, label: 'Complete', color: 'success', description: 'Thank you for dining with us!' }
  };

  useEffect(() => {
    const loadOrderStatus = async () => {
      try {
        const orderData = await OrderService.getOrderStatus(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to load order status:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrderStatus();

    // TODO: Set up real-time status updates via WebSocket
    const interval = setInterval(loadOrderStatus, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading order status...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Order not found</p>
          <Button onClick={onBackToMenu}>Back to Menu</Button>
        </div>
      </div>
    );
  }

  const currentStatus = statusConfig[order.status];
  const StatusIcon = currentStatus.icon;
  
  const statusSteps: (keyof typeof statusConfig)[] = ['pending', 'confirmed', 'preparing', 'ready', 'served'];
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header with dark mode toggle */}
      <div className="absolute top-6 right-6 z-10">
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl shadow-2xl flex items-center justify-center">
              <StatusIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order #{order.id}</h1>
            <Badge variant={currentStatus.color as any} size="md" className="mb-2">
              {currentStatus.label}
            </Badge>
            <p className="text-gray-600 dark:text-gray-400">{currentStatus.description}</p>
          </div>

          {/* Progress steps */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Order Progress</h3>
            <div className="space-y-4">
              {statusSteps.map((status, index) => {
                const config = statusConfig[status];
                const Icon = config.icon;
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={status} className={`flex items-center space-x-3 ${
                    isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${isCurrent ? 'text-gray-900 dark:text-white' : ''}`}>
                        {config.label}
                      </p>
                      {isCurrent && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{config.description}</p>
                      )}
                    </div>
                    {isCompleted && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Order details */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Order Details</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.menuItem.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                    {item.specialInstructions && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">Note: {item.specialInstructions}</p>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${(item.menuItem.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-semibold text-lg text-gray-900 dark:text-white">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Estimated time */}
          {order.estimatedTime && order.status !== 'served' && order.status !== 'paid' && (
            <Card className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl">
              <Clock className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="font-medium text-gray-900 dark:text-white">Estimated time: {order.estimatedTime} minutes</p>
            </Card>
          )}

          <div className="text-center">
            <Button onClick={onBackToMenu} variant="ghost" className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}