// Main application component with role switching
import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { TableSelection } from './pages/guest/TableSelection';
import { MenuBrowser } from './pages/guest/MenuBrowser';
import { OrderStatus } from './pages/guest/OrderStatus';
import { WaiterDashboard } from './pages/waiter/WaiterDashboard';
import { KitchenDashboard } from './pages/kitchen/KitchenDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

type UserRole = 'guest' | 'waiter' | 'kitchen' | 'admin';
type GuestFlow = 'table-selection' | 'menu' | 'order-status';

function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('guest');
  const [guestFlow, setGuestFlow] = useState<GuestFlow>('table-selection');
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');

  const handleTableSelected = (tableId: string) => {
    setSelectedTableId(tableId);
    setGuestFlow('menu');
  };

  const handleOrderPlaced = () => {
    // In a real app, this would come from the order service
    setOrderId('1');
    setGuestFlow('order-status');
  };

  const handleBackToMenu = () => {
    setGuestFlow('menu');
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

  const renderContent = () => {
    switch (currentRole) {
      case 'guest':
        return renderGuestContent();
      case 'waiter':
        return <WaiterDashboard />;
      case 'kitchen':
        return <KitchenDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return renderGuestContent();
    }
  };

  return (
    <Layout role={currentRole} onRoleChange={setCurrentRole}>
      {renderContent()}
    </Layout>
  );
}

export default App;