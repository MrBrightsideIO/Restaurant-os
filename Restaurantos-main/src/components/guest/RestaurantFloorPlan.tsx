// Interactive restaurant floor plan with clickable tables
import React, { useState } from 'react';
import { Table } from '../../types';
import { TableConfirmationModal } from './TableConfirmationModal';

interface RestaurantFloorPlanProps {
  tables: Table[];
  onTableSelected: (tableId: string) => void;
}

export function RestaurantFloorPlan({ tables, onTableSelected }: RestaurantFloorPlanProps) {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Define table positions on the floor plan (percentage-based for responsiveness)
  const tablePositions: Record<string, { x: number; y: number; rotation?: number }> = {
    '1': { x: 15, y: 20 },
    '2': { x: 15, y: 45 },
    '3': { x: 15, y: 70 },
    '4': { x: 40, y: 15 },
    '5': { x: 40, y: 40 },
    '6': { x: 40, y: 65 },
    '7': { x: 65, y: 20 },
    '8': { x: 65, y: 50 },
    '9': { x: 85, y: 30, rotation: 45 },
    '10': { x: 85, y: 60, rotation: 45 }
  };

  const handleTableClick = (table: Table) => {
    if (table.status === 'available') {
      setSelectedTable(table);
      setShowModal(true);
    }
  };

  const handleConfirm = () => {
    if (selectedTable) {
      onTableSelected(selectedTable.id);
      setShowModal(false);
    }
  };

  const handleClose = () => {
    setSelectedTable(null);
    setShowModal(false);
  };

  const getTableStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'bg-gradient-to-br from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 shadow-green-200 dark:shadow-green-900/30';
      case 'occupied':
        return 'bg-gradient-to-br from-red-400 to-red-500 shadow-red-200 dark:shadow-red-900/30 cursor-not-allowed';
      case 'needs-service':
        return 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-yellow-200 dark:shadow-yellow-900/30 cursor-not-allowed';
      case 'needs-cleaning':
        return 'bg-gradient-to-br from-gray-400 to-gray-500 shadow-gray-200 dark:shadow-gray-900/30 cursor-not-allowed';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-orange-200/50 dark:border-gray-700/50">
      {/* Restaurant background elements */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute top-10 left-10 w-32 h-8 bg-amber-600 rounded-lg"></div> {/* Bar */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-amber-600 rounded-full"></div> {/* Kitchen */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-amber-600 rounded-lg"></div> {/* Entrance */}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-6 left-6 text-xs font-medium text-amber-700 dark:text-amber-300 bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full backdrop-blur-sm">
        Bar
      </div>
      <div className="absolute top-6 right-6 text-xs font-medium text-amber-700 dark:text-amber-300 bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full backdrop-blur-sm">
        Kitchen
      </div>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-amber-700 dark:text-amber-300 bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full backdrop-blur-sm">
        Entrance
      </div>

      {/* Tables */}
      {tables.map((table) => {
        const position = tablePositions[table.id] || { x: 50, y: 50 };
        const isAvailable = table.status === 'available';
        
        return (
          <div
            key={table.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              isAvailable ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed'
            }`}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: `translate(-50%, -50%) ${position.rotation ? `rotate(${position.rotation}deg)` : ''}`
            }}
            onClick={() => handleTableClick(table)}
          >
            {/* Table card */}
            <div className={`
              w-16 h-16 rounded-2xl shadow-xl border-2 border-white/50 dark:border-gray-700/50
              flex items-center justify-center backdrop-blur-sm
              transition-all duration-300 hover:shadow-2xl
              ${getTableStatusColor(table.status)}
              ${isAvailable ? 'animate-pulse-slow' : ''}
            `}>
              <span className="text-white font-bold text-lg drop-shadow-sm">
                {table.number}
              </span>
            </div>

            {/* Table info tooltip */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg border border-white/50 dark:border-gray-700/50 text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {table.name} • {table.seatCount} seats
              </div>
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 dark:border-gray-700/50">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Table Status</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-green-400 to-green-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-red-400 to-red-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Occupied</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-yellow-400 to-yellow-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Service Needed</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedTable && (
        <TableConfirmationModal
          table={selectedTable}
          isOpen={showModal}
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}