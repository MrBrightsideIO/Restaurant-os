// Enhanced admin dashboard with improved UI
import React, { useState, useEffect } from 'react';
import { BarChart3, Users, UtensilsCrossed, Settings, TrendingUp, DollarSign } from 'lucide-react';
import { BackgroundWrapper } from '../../components/ui/BackgroundWrapper';
import { GlobalHeader } from '../../components/ui/GlobalHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TableGrid } from '../../components/ui/TableGrid';
import { Order, Table, MenuItem } from '../../types';
import { OrderService } from '../../services/OrderService';
import { TableService } from '../../services/TableService';
import { MenuService } from '../../services/MenuService';

type AdminView = 'overview' | 'tables' | 'menu' | 'analytics';

interface AdminDashboardProps {
  onBack: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, tablesData, menuData] = await Promise.all([
          OrderService.getAllOrders(),
          TableService.getAllTables(),
          MenuService.getMenuItems()
        ]);
        setOrders(ordersData);
        setTables(tablesData);
        setMenuItems(menuData);
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleTableAction = async (tableId: string, action: string) => {
    console.log(`Admin action: ${action} on table ${tableId}`);
    // TODO: Implement admin table actions
  };

  const navigation = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'tables', label: 'Tables', icon: Users },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  // Calculate analytics
  const todayOrders = orders.filter(order => {
    const today = new Date();
    const orderDate = new Date(order.timestamp);
    return orderDate.toDateString() === today.toDateString();
  });

  const totalRevenue = orders
    .filter(order => order.status === 'paid')
    .reduce((sum, order) => sum + order.total, 0);

  const todayRevenue = todayOrders
    .filter(order => order.status === 'paid')
    .reduce((sum, order) => sum + order.total, 0);

  const averageOrderValue = orders.length > 0 
    ? totalRevenue / orders.filter(order => order.status === 'paid').length 
    : 0;

  const occupiedTables = tables.filter(table => table.status === 'occupied').length;
  const occupancyRate = tables.length > 0 ? (occupiedTables / tables.length) * 100 : 0;

  if (loading) {
    return (
      <BackgroundWrapper variant="admin">
        <GlobalHeader 
          title="Admin Dashboard" 
          subtitle="Restaurant Management"
          icon={Settings}
          variant="admin"
          showBackButton
          onBack={onBack}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-4 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
            </div>
          </div>
        </div>
      </BackgroundWrapper>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50">
          <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${todayRevenue.toFixed(2)}</p>
          <p className="text-gray-600 dark:text-gray-400">Today's Revenue</p>
        </Card>
        
        <Card className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50">
          <BarChart3 className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayOrders.length}</p>
          <p className="text-gray-600 dark:text-gray-400">Today's Orders</p>
        </Card>
        
        <Card className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50">
          <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{occupancyRate.toFixed(0)}%</p>
          <p className="text-gray-600 dark:text-gray-400">Table Occupancy</p>
        </Card>
        
        <Card className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${averageOrderValue.toFixed(2)}</p>
          <p className="text-gray-600 dark:text-gray-400">Avg. Order Value</p>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Orders</h3>
          <div className="space-y-3">
            {todayOrders.slice(0, 5).map(order => {
              const table = tables.find(t => t.id === order.tableId);
              return (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Order #{order.id}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Table {table?.number}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">${order.total.toFixed(2)}</p>
                    <Badge variant={
                      order.status === 'paid' ? 'success' :
                      order.status === 'ready' ? 'success' :
                      order.status === 'preparing' ? 'warning' : 'info'
                    } size="sm">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Table Status Overview</h3>
          <div className="space-y-3">
            {tables.slice(0, 6).map(table => (
              <div key={table.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Table {table.number}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{table.name}</p>
                </div>
                <Badge variant={
                  table.status === 'available' ? 'success' :
                  table.status === 'occupied' ? 'info' :
                  table.status === 'needs-service' ? 'warning' : 'danger'
                }>
                  {table.status.replace('-', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderTables = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Table Management</h3>
        <Button className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/50 dark:border-gray-700/50">
          Add New Table
        </Button>
      </div>
      
      <TableGrid
        tables={tables}
        orders={orders}
        onTableAction={handleTableAction}
        showActions={true}
        variant="admin"
      />
    </div>
  );

  const renderMenu = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Menu Management</h3>
        <Button className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/50 dark:border-gray-700/50">
          Add Menu Item
        </Button>
      </div>
      
      <div className="space-y-4">
        {menuItems.map(item => (
          <Card key={item.id} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50">
            <div className="flex space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{item.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="info" size="sm">{item.category}</Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{item.prepTime} min</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">${item.price.toFixed(2)}</p>
                    <Badge variant={item.available ? 'success' : 'danger'} size="sm">
                      {item.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="ghost" size="sm" className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">Edit</Button>
                  <Button variant="ghost" size="sm" className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
                    {item.available ? 'Disable' : 'Enable'}
                  </Button>
                  <Button variant="ghost" size="sm" className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">Delete</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics & Reports</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50">
          <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Revenue Trends</h4>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">📊 Chart placeholder - integrate with charting library</p>
          </div>
        </Card>
        
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50">
          <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Popular Items</h4>
          <div className="space-y-3">
            {menuItems.slice(0, 5).map((item, index) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                </div>
                <span className="text-gray-600 dark:text-gray-400">{Math.floor(Math.random() * 50) + 10} orders</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/50 dark:border-gray-700/50">
        <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Performance Metrics</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg backdrop-blur-sm">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.floor(Math.random() * 30) + 15} min</p>
            <p className="text-gray-600 dark:text-gray-400">Avg. Prep Time</p>
          </div>
          <div className="text-center p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg backdrop-blur-sm">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.floor(Math.random() * 20) + 80}%</p>
            <p className="text-gray-600 dark:text-gray-400">Customer Satisfaction</p>
          </div>
          <div className="text-center p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg backdrop-blur-sm">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.floor(Math.random() * 10) + 95}%</p>
            <p className="text-gray-600 dark:text-gray-400">Order Accuracy</p>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <BackgroundWrapper variant="admin">
      <GlobalHeader 
        title="Admin Dashboard" 
        subtitle="Restaurant Management"
        icon={Settings}
        variant="admin"
        showBackButton
        onBack={onBack}
      />
      
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Navigation */}
        <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-2">
          {navigation.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as AdminView)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  currentView === item.id
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {currentView === 'overview' && renderOverview()}
        {currentView === 'tables' && renderTables()}
        {currentView === 'menu' && renderMenu()}
        {currentView === 'analytics' && renderAnalytics()}
      </div>
    </BackgroundWrapper>
  );
}