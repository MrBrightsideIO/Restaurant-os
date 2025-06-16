// Enhanced table selection page with restaurant floor plan
import React, { useState, useEffect } from 'react';
import { QrCode, Smartphone, MapPin } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DarkModeToggle } from '../../components/ui/DarkModeToggle';
import { RestaurantFloorPlan } from '../../components/guest/RestaurantFloorPlan';
import { Table } from '../../types';
import { TableService } from '../../services/TableService';
import { useDarkMode } from '../../hooks/useDarkMode';

interface TableSelectionProps {
  onTableSelected: (tableId: string) => void;
}

export function TableSelection({ onTableSelected }: TableSelectionProps) {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'floorplan' | 'list'>('floorplan');
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    // Check if table ID is in URL (simulating QR code scan)
    const urlParams = new URLSearchParams(window.location.search);
    const tableFromQR = urlParams.get('table');
    
    if (tableFromQR) {
      setSelectedTable(tableFromQR);
    }

    // Load available tables
    const loadTables = async () => {
      try {
        const allTables = await TableService.getAllTables();
        setTables(allTables);
      } catch (error) {
        console.error('Failed to load tables:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTables();
  }, []);

  const handleTableSelect = (tableId: string) => {
    setSelectedTable(tableId);
    onTableSelected(tableId);
  };

  const handleContinue = () => {
    if (selectedTable) {
      onTableSelected(selectedTable);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading restaurant layout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header with dark mode toggle */}
      <div className="absolute top-6 right-6 z-10">
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl shadow-2xl mb-4">
            <QrCode className="w-10 h-10 text-white" />
          </div>
          
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Welcome to RestaurantOS
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {selectedTable ? 'Table selected from QR code!' : 'Select your table from our interactive floor plan to start your dining experience'}
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant={viewMode === 'floorplan' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('floorplan')}
              icon={MapPin}
            >
              Floor Plan
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List View
            </Button>
          </div>
        </div>

        {/* QR Code confirmation */}
        {selectedTable && window.location.search.includes('table') && (
          <Card className="max-w-md mx-auto text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-2xl">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">QR Code Scanned</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You've selected Table {tables.find(t => t.id === selectedTable)?.number}
                </p>
              </div>
              <Button onClick={handleContinue} className="w-full" size="lg">
                Continue to Menu
              </Button>
            </div>
          </Card>
        )}

        {/* Main content */}
        {!selectedTable || !window.location.search.includes('table') ? (
          <div className="space-y-8">
            {viewMode === 'floorplan' ? (
              /* Interactive floor plan */
              <div className="max-w-4xl mx-auto">
                <RestaurantFloorPlan
                  tables={tables}
                  onTableSelected={handleTableSelect}
                />
              </div>
            ) : (
              /* List view fallback */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {tables.filter(table => table.status === 'available').map((table) => (
                  <Card
                    key={table.id}
                    hover
                    className={`text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl transition-all duration-300 ${
                      selectedTable === table.id ? 'ring-2 ring-orange-500 bg-orange-50/80 dark:bg-orange-900/20' : ''
                    }`}
                    onClick={() => handleTableSelect(table.id)}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">{table.number}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{table.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{table.seatCount} seats</p>
                    {selectedTable === table.id && (
                      <div className="text-orange-600 dark:text-orange-400 font-medium">Selected</div>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {/* Continue button for list view */}
            {selectedTable && viewMode === 'list' && (
              <div className="text-center">
                <Button onClick={handleContinue} size="lg" className="shadow-xl">
                  Continue to Menu
                </Button>
              </div>
            )}
          </div>
        ) : null}

        {/* Help text */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full inline-block border border-white/50 dark:border-gray-700/50">
            💡 Tip: In production, customers scan QR codes at their table to skip this step
          </p>
        </div>
      </div>
    </div>
  );
}