// Menu service with mock data and future backend integration placeholders
import { MenuItem } from '../types';

// Mock menu data - replace with actual API calls in production
const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Truffle Mushroom Risotto',
    description: 'Creamy arborio rice with wild mushrooms, truffle oil, and parmesan',
    price: 28.99,
    category: 'main',
    image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=400',
    ingredients: ['Arborio Rice', 'Wild Mushrooms', 'Truffle Oil', 'Parmesan', 'White Wine'],
    allergens: ['Dairy', 'Alcohol'],
    available: true,
    prepTime: 25
  },
  {
    id: '2',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with lemon herb butter and seasonal vegetables',
    price: 32.99,
    category: 'main',
    image: 'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=400',
    ingredients: ['Atlantic Salmon', 'Lemon', 'Herbs', 'Butter', 'Seasonal Vegetables'],
    allergens: ['Fish', 'Dairy'],
    available: true,
    prepTime: 20
  },
  {
    id: '3',
    name: 'Burrata Caprese',
    description: 'Fresh burrata with heirloom tomatoes, basil, and balsamic reduction',
    price: 16.99,
    category: 'appetizer',
    image: 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=400',
    ingredients: ['Burrata Cheese', 'Heirloom Tomatoes', 'Fresh Basil', 'Balsamic Vinegar'],
    allergens: ['Dairy'],
    available: true,
    prepTime: 10
  },
  {
    id: '4',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
    price: 12.99,
    category: 'dessert',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
    ingredients: ['Dark Chocolate', 'Butter', 'Eggs', 'Sugar', 'Vanilla Ice Cream'],
    allergens: ['Dairy', 'Eggs', 'Gluten'],
    available: true,
    prepTime: 15
  },
  {
    id: '5',
    name: 'Craft Beer Selection',
    description: 'Local IPA with citrus notes and hoppy finish',
    price: 8.99,
    category: 'drink',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    ingredients: ['Hops', 'Malt', 'Yeast', 'Water'],
    allergens: ['Gluten'],
    available: true,
    prepTime: 2
  },
  {
    id: '6',
    name: 'House Wine - Pinot Noir',
    description: 'Smooth red wine with berry notes from local vineyard',
    price: 11.99,
    category: 'drink',
    image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=400',
    ingredients: ['Pinot Noir Grapes', 'Sulfites'],
    allergens: ['Sulfites'],
    available: true,
    prepTime: 2
  }
];

export class MenuService {
  // TODO: Replace with actual API endpoint
  static async getMenuItems(): Promise<MenuItem[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMenuItems;
  }

  static async getMenuItemsByCategory(category: MenuItem['category']): Promise<MenuItem[]> {
    const items = await this.getMenuItems();
    return items.filter(item => item.category === category);
  }

  static async getMenuItem(id: string): Promise<MenuItem | null> {
    const items = await this.getMenuItems();
    return items.find(item => item.id === id) || null;
  }

  // TODO: Admin functionality - add/edit/delete menu items
  static async updateMenuItem(item: MenuItem): Promise<boolean> {
    // Placeholder for backend integration
    console.log('Updating menu item:', item);
    return true;
  }

  static async deleteMenuItem(id: string): Promise<boolean> {
    // Placeholder for backend integration
    console.log('Deleting menu item:', id);
    return true;
  }
}