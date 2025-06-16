// Glassmorphism confirmation modal for table selection
import React from 'react';
import { X, Users, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Table } from '../../types';

interface TableConfirmationModalProps {
  table: Table;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function TableConfirmationModal({ table, isOpen, onClose, onConfirm }: TableConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Content */}
        <div className="text-center space-y-6">
          {/* Table icon */}
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">{table.number}</span>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Select Table {table.number}?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {table.name}
            </p>
          </div>

          {/* Table details */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{table.seatCount} seats</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Available</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1 bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg"
            >
              Confirm Selection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}