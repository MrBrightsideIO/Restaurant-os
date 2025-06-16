// Enhanced main application with bar dashboard and improved navigation
import React, { useState } from 'react';
import { TableSelection } from './pages/guest/TableSelection';
import { MenuBrowser } from './pages/guest/MenuBrowser';
import { OrderStatus } from './pages/guest/OrderStatus';
import { WaiterDashboard } from './pages/waiter/WaiterDashboard';
import { KitchenDashboard } from './pages/kitchen/KitchenDashboard';
import { BarDashboard } from './pages/bar/BarDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { BackgroundWrapper } from './components/ui/BackgroundWrapper';
import { GlobalHeader } from './components/ui/GlobalHeader';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Users, ChefHat, Wine, Settings, Utensils, Star } from 'lucide-react';

type UserRole = 'guest' | 'waiter' | 'kitchen' | 'bar' | 'admin' | 'home';
type GuestFlow = 'table-selection' | 'menu' | 'order-status';

function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('home');
  const [guestFlow, setGuestFlow] = useState<GuestFlow>('table-selection');
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');

  const handleTableSelected = (tableId: string) => {
    setSelectedTableId(tableId);
    setGuestFlow('menu');
  };

  const handleOrderPlaced = () => {
    setOrderId('1');
    setGuestFlow('order-status');
  };

  const handleBackToMenu = () => {
    setGuestFlow('menu');
  };

  const handleBackToHome = () => {
    setCurrentRole('home');
    setGuestFlow('table-selection');
    setSelectedTableId('');
    setOrderId('');
  };

  const renderGuestContent = () => {
    switch (guestFlow) {
      case 'table-selection':
        return <TableSelection onTableSelected={handleTableSelected} />;
      case 'menu':
        return <MenuBrowser tableId={selectedTableId} onOrderPlaced={handleOrderPlaced} />;
      case 'order-status':
        return <OrderStatus orderId={orderId} onBackToMenu={handleBackToMenu} />;
      default:
        return <TableSelection onTableSelected={handleTableSelected} />;
    }
  };

  const renderRoleSelection = () => (
    <BackgroundWrapper variant="restaurant">
      <GlobalHeader 
        title="RestaurantOS" 
        subtitle="Digital Restaurant Management System"
        icon={Utensils}
        variant="guest"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Hero */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-3xl shadow-2xl mb-6 relative">
              <Utensils className="w-12 h-12 text-white" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-800" />
              </div>
            </div>
            
            <div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
                Welcome to RestaurantOS
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                Choose your role to access the appropriate dashboard and tools
              </p>
            </div>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Guest */}
            <Card 
              hover 
              className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => setCurrentRole('guest')}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Guest</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Browse menu and place orders</p>
              <Button className="w-full">Start Ordering</Button>
            </Card>

            {/* Waiter */}
            <Card 
              hover 
              className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => setCurrentRole('waiter')}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Waiter</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Manage tables and serve customers</p>
              <Button variant="secondary" className="w-full">Access Dashboard</Button>
            </Card>

            {/* Kitchen */}
            <Card 
              hover 
              className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => setCurrentRole('kitchen')}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Kitchen</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Manage food orders and preparation</p>
              <Button variant="success" className="w-full">View Orders</Button>
            </Card>

            {/* Bar */}
            <Card 
              hover 
              className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => setCurrentRole('bar')}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Wine className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Bar</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Handle drink orders and beverages</p>
              <Button variant="secondary" className="w-full">View Drink Orders</Button>
            </Card>

            {/* Admin */}
            <Card 
              hover 
              className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl transition-all duration-300 hover:scale-105 md:col-span-2 lg:col-span-1"
              onClick={() => setCurrentRole('admin')}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Admin</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Manage restaurant operations</p>
              <Button variant="secondary" className="w-full">Admin Panel</Button>
            </Card>
          </div>

          {/* Features */}
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-6 py-3 rounded-full inline-block border border-white/50 dark:border-gray-700/50">
              🚀 Modern restaurant management with real-time order tracking and seamless workflow
            </p>
          </div>
        </div>
      </div>
    </BackgroundWrapper>
  );

  const renderContent = () => {
    switch (currentRole) {
      case 'home':
        return renderRoleSelection();
      case 'guest':
        return renderGuestContent();
      case 'waiter':
        return <WaiterDashboard onBack={handleBackToHome} />;
      case 'kitchen':
        return <KitchenDashboard onBack={handleBackToHome} />;
      case 'bar':
        return <BarDashboard onBack={handleBackToHome} />;
      case 'admin':
        return <AdminDashboard onBack={handleBackToHome} />;
      default:
        return renderRoleSelection();
    }
  };

  return renderContent();
}

export default App;