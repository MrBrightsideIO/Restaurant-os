// Admin dashboard with analytics and management tools
import React, { useState, useEffect } from 'react';
import { BarChart3, Users, UtensilsCrossed, Settings, TrendingUp, DollarSign } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Order, Table, MenuItem } from '../../types';
import { OrderService } from '../../services/OrderService';
import { TableService } from '../../services/TableService';
import { MenuService } from '../../services/MenuService';

type AdminView = 'overview' | 'tables' | 'menu' | 'analytics';

export function AdminDashboard() {
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
          <p className="text-2xl font-bold text-gray-900">${todayRevenue.toFixed(2)}</p>
          <p className="text-gray-600">Today's Revenue</p>
        </Card>
        
        <Card className="text-center">
          <BarChart3 className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold text-gray-900">{todayOrders.length}</p>
          <p className="text-gray-600">Today's Orders</p>
        </Card>
        
        <Card className="text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <p className="text-2xl font-bold text-gray-900">{occupancyRate.toFixed(0)}%</p>
          <p className="text-gray-600">Table Occupancy</p>
        </Card>
        
        <Card className="text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-500" />
          <p className="text-2xl font-bold text-gray-900">${averageOrderValue.toFixed(2)}</p>
          <p className="text-gray-600">Avg. Order Value</p>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {todayOrders.slice(0, 5).map(order => {
              const table = tables.find(t => t.id === order.tableId);
              return (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">Table {table?.number}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total.toFixed(2)}</p>
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

        <Card>
          <h3 className="text-lg font-semibold mb-4">Table Status</h3>
          <div className="space-y-3">
            {tables.slice(0, 6).map(table => (
              <div key={table.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium">Table {table.number}</p>
                  <p className="text-sm text-gray-600">{table.name}</p>
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
        <h3 className="text-lg font-semibold">Table Management</h3>
        <Button>Add New Table</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map(table => (
          <Card key={table.id}>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-700">{table.number}</span>
                </div>
                <h4 className="font-semibold">{table.name}</h4>
                <p className="text-sm text-gray-600">{table.seatCount} seats</p>
              </div>
              
              <Badge variant={
                table.status === 'available' ? 'success' :
                table.status === 'occupied' ? 'info' :
                table.status === 'needs-service' ? 'warning' : 'danger'
              }>
                {table.status.replace('-', ' ')}
              </Badge>
              
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="flex-1">Edit</Button>
                <Button variant="ghost" size="sm" className="flex-1">QR Code</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMenu = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Menu Management</h3>
        <Button>Add Menu Item</Button>
      </div>
      
      <div className="space-y-4">
        {menuItems.map(item => (
          <Card key={item.id}>
            <div className="flex space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-lg">{item.name}</h4>
                    <p className="text-gray-600">{item.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="info" size="sm">{item.category}</Badge>
                      <span className="text-sm text-gray-500">{item.prepTime} min</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">${item.price.toFixed(2)}</p>
                    <Badge variant={item.available ? 'success' : 'danger'} size="sm">
                      {item.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">
                    {item.available ? 'Disable' : 'Enable'}
                  </Button>
                  <Button variant="ghost" size="sm">Delete</Button>
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
      <h3 className="text-lg font-semibold">Analytics & Reports</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h4 className="font-semibold mb-4">Revenue Trends</h4>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart placeholder - integrate with charting library</p>
          </div>
        </Card>
        
        <Card>
          <h4 className="font-semibold mb-4">Popular Items</h4>
          <div className="space-y-3">
            {menuItems.slice(0, 5).map((item, index) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="text-gray-600">{Math.floor(Math.random() * 50) + 10} orders</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      <Card>
        <h4 className="font-semibold mb-4">Performance Metrics</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{Math.floor(Math.random() * 30) + 15} min</p>
            <p className="text-gray-600">Avg. Prep Time</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{Math.floor(Math.random() * 20) + 80}%</p>
            <p className="text-gray-600">Customer Satisfaction</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{Math.floor(Math.random() * 10) + 95}%</p>
            <p className="text-gray-600">Order Accuracy</p>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex space-x-2 border-b border-gray-200">
        {navigation.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as AdminView)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                currentView === item.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
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
  );
}