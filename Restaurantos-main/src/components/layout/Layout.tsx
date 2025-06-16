// Main layout component with navigation
import React from 'react';
import { ChefHat, Users, UtensilsCrossed, Settings } from 'lucide-react';
import { Button } from '../ui/Button';

interface LayoutProps {
  children: React.ReactNode;
  role?: 'guest' | 'waiter' | 'kitchen' | 'admin';
  onRoleChange?: (role: 'guest' | 'waiter' | 'kitchen' | 'admin') => void;
}

export function Layout({ children, role = 'guest', onRoleChange }: LayoutProps) {
  const roleConfig = {
    guest: { title: 'RestaurantOS', subtitle: 'Guest Ordering', icon: UtensilsCrossed, color: 'text-orange-600' },
    waiter: { title: 'RestaurantOS', subtitle: 'Waiter Dashboard', icon: Users, color: 'text-blue-600' },
    kitchen: { title: 'RestaurantOS', subtitle: 'Kitchen Display', icon: ChefHat, color: 'text-green-600' },
    admin: { title: 'RestaurantOS', subtitle: 'Admin Panel', icon: Settings, color: 'text-purple-600' }
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Icon className={`w-8 h-8 ${config.color}`} />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{config.title}</h1>
                <p className="text-sm text-gray-500">{config.subtitle}</p>
              </div>
            </div>

            {/* Role switcher for demo purposes */}
            {onRoleChange && (
              <div className="flex space-x-2">
                <Button
                  variant={role === 'guest' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => onRoleChange('guest')}
                >
                  Guest
                </Button>
                <Button
                  variant={role === 'waiter' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => onRoleChange('waiter')}
                >
                  Waiter
                </Button>
                <Button
                  variant={role === 'kitchen' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => onRoleChange('kitchen')}
                >
                  Kitchen
                </Button>
                <Button
                  variant={role === 'admin' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => onRoleChange('admin')}
                >
                  Admin
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}