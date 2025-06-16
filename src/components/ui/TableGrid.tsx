// Enhanced table grid component for manager and waiter dashboards
import React from 'react';
import { Users, Clock, CheckCircle, AlertTriangle, Utensils } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Table, Order } from '../../types';

interface TableGridProps {
  tables: Table[];
  orders?: Order[];
  onTableAction?: (tableId: string, action: string) => void;
  showActions?: boolean;
  variant?: 'waiter' | 'admin';
}

export function TableGrid({ tables, orders = [], onTableAction, showActions = true, variant = 'waiter' }: TableGridProps) {
  const getTableOrder = (tableId: string) => {
    return orders.find(order => 
      order.tableId === tableId && 
      !['served', 'paid'].includes(order.status)
    );
  };

  const getStatusConfig = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return { 
          icon: CheckCircle, 
          color: 'success' as const, 
          label: 'Available',
          bgColor: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        };
      case 'occupied':
        return { 
          icon: Users, 
          color: 'info' as const, 
          label: 'Occupied',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
        };
      case 'needs-service':
        return { 
          icon: AlertTriangle, 
          color: 'warning' as const, 
          label: 'Service Needed',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        };
      case 'needs-cleaning':
        return { 
          icon: Clock, 
          color: 'danger' as const, 
          label: 'Needs Cleaning',
          bgColor: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        };
      default:
        return { 
          icon: Users, 
          color: 'default' as const, 
          label: 'Unknown',
          bgColor: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        };
    }
  };

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-gray-700/50 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Utensils className="w-5 h-5 mr-2 text-orange-500" />
          Restaurant Floor Plan
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {tables.length} tables total
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map(table => {
          const statusConfig = getStatusConfig(table.status);
          const StatusIcon = statusConfig.icon;
          const tableOrder = getTableOrder(table.id);

          return (
            <Card 
              key={table.id} 
              className={`relative transition-all duration-300 hover:scale-105 hover:shadow-xl ${statusConfig.bgColor}`}
              hover
            >
              <div className="text-center space-y-4">
                {/* Table number and icon */}
                <div className="relative">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">{table.number}</span>
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      statusConfig.color === 'success' ? 'bg-green-500' :
                      statusConfig.color === 'info' ? 'bg-blue-500' :
                      statusConfig.color === 'warning' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      <StatusIcon className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>

                {/* Table info */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{table.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{table.seatCount} seats</p>
                </div>

                {/* Status badge */}
                <Badge variant={statusConfig.color} className="animate-pulse-slow">
                  {statusConfig.label}
                </Badge>

                {/* Current order info */}
                {tableOrder && (
                  <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Current Order</p>
                    <Badge variant="info" size="sm">
                      Order #{tableOrder.id}
                    </Badge>
                  </div>
                )}

                {/* Action buttons */}
                {showActions && onTableAction && (
                  <div className="space-y-2">
                    {variant === 'waiter' && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onTableAction(table.id, 'service')}
                          disabled={table.status === 'needs-service'}
                          className="w-full bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                        >
                          Request Service
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onTableAction(table.id, 'cleaning')}
                          disabled={table.status === 'needs-cleaning'}
                          className="w-full bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                        >
                          Mark for Cleaning
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onTableAction(table.id, 'available')}
                          disabled={table.status === 'available'}
                          className="w-full bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                        >
                          Mark Available
                        </Button>
                      </>
                    )}
                    
                    {variant === 'admin' && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onTableAction(table.id, 'edit')}
                          className="w-full bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                        >
                          Edit Table
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onTableAction(table.id, 'qr')}
                          className="w-full bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                        >
                          Generate QR
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}