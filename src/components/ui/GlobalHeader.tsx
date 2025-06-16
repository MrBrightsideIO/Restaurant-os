// Global header with dark mode toggle and back button
import React from 'react';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { Button } from './Button';
import { useDarkMode } from '../../hooks/useDarkMode';

interface GlobalHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'guest' | 'waiter' | 'kitchen' | 'admin';
}

export function GlobalHeader({ 
  title, 
  subtitle, 
  showBackButton = false, 
  onBack, 
  icon: Icon,
  variant = 'guest' 
}: GlobalHeaderProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const variantColors = {
    guest: 'text-orange-600 dark:text-orange-400',
    waiter: 'text-blue-600 dark:text-blue-400',
    kitchen: 'text-green-600 dark:text-green-400',
    admin: 'text-purple-600 dark:text-purple-400'
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/50 dark:border-gray-700/50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Back button and title */}
          <div className="flex items-center space-x-4">
            {showBackButton && onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                icon={ArrowLeft}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/50 dark:border-gray-700/50"
              >
                Back
              </Button>
            )}
            
            <div className="flex items-center space-x-3">
              {Icon && <Icon className={`w-8 h-8 ${variantColors[variant]}`} />}
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
                {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>}
              </div>
            </div>
          </div>

          {/* Right side - Dark mode toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="relative inline-flex items-center justify-center w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Toggle dark mode"
            >
              {/* Toggle background */}
              <div
                className={`absolute w-5 h-5 bg-white dark:bg-gray-300 rounded-full shadow-md transform transition-transform duration-300 ${
                  isDarkMode ? 'translate-x-3' : '-translate-x-3'
                }`}
              />
              
              {/* Icons */}
              <Sun className={`absolute left-1 w-3 h-3 text-yellow-500 transition-opacity duration-300 ${
                isDarkMode ? 'opacity-0' : 'opacity-100'
              }`} />
              <Moon className={`absolute right-1 w-3 h-3 text-blue-400 transition-opacity duration-300 ${
                isDarkMode ? 'opacity-100' : 'opacity-0'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}