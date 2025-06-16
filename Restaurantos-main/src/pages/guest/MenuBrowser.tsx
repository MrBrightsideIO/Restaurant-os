// Enhanced menu browser with dark mode support
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Search, Filter, Moon, Sun } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DarkModeToggle } from '../../components/ui/DarkModeToggle';
import { MenuItem } from '../../types';
import { MenuService } from '../../services/MenuService';
import { useCart } from '../../hooks/useCart';
import { useDarkMode } from '../../hooks/useDarkMode';
import { MenuItemModal } from '../../components/guest/MenuItemModal';
import { CartSidebar } from '../../components/guest/CartSidebar';

interface MenuBrowserProps {
  tableId: string;
  onOrderPlaced: () => void;
}

export function MenuBrowser({ tableId, onOrderPlaced }: MenuBrowserProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);

  const { cartItems, addToCart, cartCount, cartTotal } = useCart();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'appetizer', name: 'Appetizers' },
    { id: 'main', name: 'Main Courses' },
    { id: 'dessert', name: 'Desserts' },
    { id: 'drink', name: 'Beverages' }
  ];

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const items = await MenuService.getMenuItems();
        setMenuItems(items.filter(item => item.available));
      } catch (error) {
        console.error('Failed to load menu:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  useEffect(() => {
    let filtered = menuItems;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [menuItems, selectedCategory, searchQuery]);

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    // Optional: Show a brief success message
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header with dark mode toggle */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/50 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Menu</h1>
            <div className="flex items-center space-x-4">
              <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
              <Button
                onClick={() => setShowCart(true)}
                className="relative shadow-lg"
                disabled={cartCount === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Cart ({cartCount})
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
              />
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/50 dark:border-gray-700/50"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Menu items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              hover 
              className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/50 dark:border-gray-700/50 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <div 
                className="aspect-w-16 aspect-h-9 mb-4 cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{item.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{item.description}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant="info" size="sm">
                    {item.category}
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.prepTime} min</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ${item.price.toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    icon={Plus}
                    onClick={() => handleAddToCart(item)}
                    className="shadow-lg"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/50 dark:border-gray-700/50">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No items found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or category filter</p>
          </div>
        )}

        {/* Menu item detail modal */}
        {selectedItem && (
          <MenuItemModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onAddToCart={addToCart}
          />
        )}

        {/* Cart sidebar */}
        {showCart && (
          <CartSidebar
            isOpen={showCart}
            onClose={() => setShowCart(false)}
            cartItems={cartItems}
            cartTotal={cartTotal}
            tableId={tableId}
            onOrderPlaced={onOrderPlaced}
          />
        )}

        {/* Floating cart button for mobile */}
        {cartCount > 0 && (
          <div className="fixed bottom-6 right-6 z-40 sm:hidden">
            <Button
              onClick={() => setShowCart(true)}
              className="w-14 h-14 rounded-full shadow-2xl relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-sm rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}