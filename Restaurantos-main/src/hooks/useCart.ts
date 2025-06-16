// Custom hook for cart management
import { useState, useCallback } from 'react';
import { CartItem, MenuItem } from '../types';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((menuItem: MenuItem, quantity: number = 1, specialInstructions?: string) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => 
        item.menuItem.id === menuItem.id && item.specialInstructions === specialInstructions
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updated = [...prev];
        updated[existingItemIndex].quantity += quantity;
        return updated;
      } else {
        // Add new item
        return [...prev, { menuItem, quantity, specialInstructions }];
      }
    });
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }

    setCartItems(prev => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = cartItems.reduce((total, item) => 
    total + (item.menuItem.price * item.quantity), 0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount
  };
}