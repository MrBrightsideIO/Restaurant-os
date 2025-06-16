// Enhanced table selection page with improved welcome design
import React, { useState, useEffect } from 'react';
import { QrCode, Smartphone, MapPin, Utensils, Star } from 'lucide-react';
import { BackgroundWrapper } from '../../components/ui/BackgroundWrapper';
import { GlobalHeader } from '../../components/ui/GlobalHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RestaurantFloorPlan } from '../../components/guest/RestaurantFloorPlan';
import { Table } from '../../types';
import { TableService } from '../../services/TableService';

interface TableSelectionProps {
  onTableSelected: (tableId: string) => void;
}

export function TableSelection({ onTableSelected }: TableSelectionProps) {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'floorplan' | 'list'>('floorplan');

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
      <BackgroundWrapper variant="restaurant">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading restaurant layout...</p>
          </div>
        </div>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper variant="restaurant">
      <GlobalHeader 
        title="RestaurantOS" 
        subtitle="Guest Experience"
        icon={Utensils}
        variant="guest"
      />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Hero Section */}
        <div className="text-center space-y-6">
          {/* Brand Logo Area */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-3xl shadow-2xl mb-6 relative">
            <Utensils className="w-12 h-12 text-white" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-yellow-800" />
            </div>
          </div>
          
          {/* Welcome Text */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Welcome to Bella Vista
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {selectedTable ? 
                '🎉 Table selected from QR code! Ready to explore our menu?' : 
                '✨ Select your table from our interactive floor plan to begin your culinary journey'
              }
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 dark:border-gray-700/50">
              <QrCode className="w-4 h-4" />
              <span>QR Code Ordering</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 dark:border-gray-700/50">
              <Smartphone className="w-4 h-4" />
              <span>Mobile Optimized</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50 dark:border-gray-700/50">
              <MapPin className="w-4 h-4" />
              <span>Interactive Floor Plan</span>
            </div>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant={viewMode === 'floorplan' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('floorplan')}
              icon={MapPin}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/50 dark:border-gray-700/50"
            >
              Floor Plan
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/50 dark:border-gray-700/50"
            >
              List View
            </Button>
          </div>
        </div>

        {/* QR Code confirmation */}
        {selectedTable && window.location.search.includes('table') && (
          <Card className="max-w-md mx-auto text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-2xl">
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center shadow-lg">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">QR Code Scanned Successfully!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You've selected <span className="font-semibold text-orange-600 dark:text-orange-400">
                    Table {tables.find(t => t.id === selectedTable)?.number}
                  </span>
                </p>
              </div>
              <Button onClick={handleContinue} className="w-full" size="lg">
                Continue to Menu 🍽️
              </Button>
            </div>
          </Card>
        )}

        {/* Main content */}
        {!selectedTable || !window.location.search.includes('table') ? (
          <div className="space-y-8">
            {viewMode === 'floorplan' ? (
              /* Interactive floor plan */
              <div className="max-w-5xl mx-auto">
                <RestaurantFloorPlan
                  tables={tables}
                  onTableSelected={handleTableSelect}
                />
              </div>
            ) : (
              /* List view fallback */
              <div className="max-w-6xl mx-auto">
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-gray-700/50 p-6 shadow-xl">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                    Choose Your Table
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tables.filter(table => table.status === 'available').map((table) => (
                      <Card
                        key={table.id}
                        hover
                        className={`text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl transition-all duration-300 hover:scale-105 ${
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
                          <div className="text-orange-600 dark:text-orange-400 font-medium">✓ Selected</div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Continue button for list view */}
            {selectedTable && viewMode === 'list' && (
              <div className="text-center">
                <Button onClick={handleContinue} size="lg" className="shadow-xl">
                  Continue to Menu 🍽️
                </Button>
              </div>
            )}
          </div>
        ) : null}

        {/* Help text */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-6 py-3 rounded-full inline-block border border-white/50 dark:border-gray-700/50">
            💡 Pro tip: In production, customers scan QR codes at their table to skip this step entirely
          </p>
        </div>
      </div>
    </BackgroundWrapper>
  );
}