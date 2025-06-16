// Background wrapper component with customizable backgrounds
import React from 'react';

interface BackgroundWrapperProps {
  children: React.ReactNode;
  variant?: 'default' | 'restaurant' | 'kitchen' | 'admin';
  className?: string;
}

export function BackgroundWrapper({ children, variant = 'default', className = '' }: BackgroundWrapperProps) {
  const backgroundVariants = {
    default: 'bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
    restaurant: 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
    kitchen: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
    admin: 'bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${backgroundVariants[variant]} ${className}`}>
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}