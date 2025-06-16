// Cart sidebar component for order review and checkout
import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, CreditCard } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CartItem } from '../../types';
import { OrderService } from '../../services/OrderService';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  tableId: string;
  onOrderPlaced: () => void;
}

export function CartSidebar({ 
  isOpen, 
  onClose, 
  cartItems, 
  cartTotal, 
  tableId, 
  onOrderPlaced 
}: CartSidebarProps) {
  const [specialRequests, setSpecialRequests] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      await OrderService.placeOrder(tableId, cartItems, specialRequests || undefined);
      onOrderPlaced();
      onClose();
    } catch (error) {
      console.error('Failed to place order:', error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-semibold">Your Order</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <Card key={`${item.menuItem.id}-${index}`} padding="sm">
                    <div className="flex space-x-3">
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.menuItem.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          ${item.menuItem.price.toFixed(2)} each
                        </p>
                        {item.specialInstructions && (
                          <p className="text-xs text-gray-500 mb-2">
                            Note: {item.specialInstructions}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {/* TODO: Implement quantity update */}}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {/* TODO: Implement quantity update */}}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <span className="font-semibold">
                            ${(item.menuItem.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Special requests */}
                <div className="mt-6">
                  <label htmlFor="special-requests" className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    id="special-requests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any special requests for your order..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer with total and checkout */}
          {cartItems.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              
              <Button
                onClick={handlePlaceOrder}
                className="w-full"
                size="lg"
                icon={CreditCard}
                loading={isPlacingOrder}
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Your order will be sent to the kitchen immediately
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}