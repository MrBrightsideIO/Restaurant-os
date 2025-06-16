// Ticket card component for kitchen and bar orders
import React from 'react';
import { Clock, ChefHat, Wine, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Order, Table } from '../../types';

interface TicketCardProps {
  order: Order;
  table?: Table;
  type: 'kitchen' | 'bar';
  onStatusUpdate: (orderId: string, status: Order['status']) => void;
}

export function TicketCard({ order, table, type, onStatusUpdate }: TicketCardProps) {
  // Filter items based on ticket type
  const relevantItems = order.items.filter(item => {
    if (type === 'kitchen') {
      return !['drink'].includes(item.menuItem.category);
    } else {
      return ['drink'].includes(item.menuItem.category);
    }
  });

  // Don't render if no relevant items
  if (relevantItems.length === 0) return null;

  const getOrderAge = (timestamp: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    return diffMinutes;
  };

  const isOrderUrgent = (order: Order) => {
    const age = getOrderAge(order.timestamp);
    return age > 30;
  };

  const age = getOrderAge(order.timestamp);
  const isUrgent = isOrderUrgent(order);

  const statusConfig = {
    pending: { color: 'warning' as const, label: 'New Order' },
    confirmed: { color: 'info' as const, label: 'Confirmed' },
    preparing: { color: 'warning' as const, label: 'In Progress' },
    ready: { color: 'success' as const, label: 'Ready' }
  };

  const currentStatus = statusConfig[order.status as keyof typeof statusConfig];
  const TypeIcon = type === 'kitchen' ? ChefHat : Wine;

  return (
    <Card className={`transition-all duration-300 ${
      isUrgent ? 'border-red-300 bg-red-50 dark:bg-red-900/20 animate-pulse-slow' : 
      'bg-white/80 dark:bg-gray-800/80'
    } backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              type === 'kitchen' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-purple-100 dark:bg-purple-900/30'
            }`}>
              <TypeIcon className={`w-5 h-5 ${
                type === 'kitchen' ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'
              }`} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {type === 'kitchen' ? 'Kitchen' : 'Bar'} Ticket
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Order #{order.id} • Table {table?.number}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <Badge 
              variant={currentStatus?.color}
              className={isUrgent ? 'animate-pulse' : ''}
            >
              {currentStatus?.label}
            </Badge>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {age} min ago
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3">
          {relevantItems.map((item, index) => (
            <div key={index} className="border-l-4 border-orange-300 dark:border-orange-600 pl-4 py-2 bg-orange-50/50 dark:bg-orange-900/20 rounded-r-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{item.menuItem.name}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <Badge variant="info" size="sm">
                      Qty: {item.quantity}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.menuItem.prepTime}min
                    </span>
                  </div>
                  {item.specialInstructions && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded border-l-2 border-blue-300 dark:border-blue-600">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-300">Special Instructions:</p>
                      <p className="text-sm text-blue-800 dark:text-blue-400">{item.specialInstructions}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Special requests for entire order */}
        {order.specialRequests && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300 mb-1">Order Notes:</p>
            <p className="text-sm text-yellow-800 dark:text-yellow-400">{order.specialRequests}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex space-x-2">
          {order.status === 'pending' && (
            <Button
              onClick={() => onStatusUpdate(order.id, 'confirmed')}
              variant="success"
              size="sm"
              className="flex-1"
              icon={CheckCircle}
            >
              Accept Order
            </Button>
          )}
          
          {order.status === 'confirmed' && (
            <Button
              onClick={() => onStatusUpdate(order.id, 'preparing')}
              variant="warning"
              size="sm"
              className="flex-1"
              icon={ChefHat}
            >
              Start Preparing
            </Button>
          )}
          
          {order.status === 'preparing' && (
            <Button
              onClick={() => onStatusUpdate(order.id, 'ready')}
              variant="success"
              size="sm"
              className="flex-1"
              icon={CheckCircle}
            >
              Mark Ready
            </Button>
          )}
          
          {order.status === 'ready' && (
            <div className="flex-1 text-center py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded font-medium text-sm border border-green-200 dark:border-green-700">
              ✅ Ready for Pickup
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}