// Dark mode toggle switch component
import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export function DarkModeToggle({ isDarkMode, onToggle }: DarkModeToggleProps) {
  return (
    <button
      onClick={onToggle}
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
  );
}