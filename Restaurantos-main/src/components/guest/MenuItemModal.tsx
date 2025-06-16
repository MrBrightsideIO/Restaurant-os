// Modal component for detailed menu item view
import React, { useState } from 'react';
import { X, Plus, Minus, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { MenuItem } from '../../types';

interface MenuItemModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, specialInstructions?: string) => void;
}

export function MenuItemModal({ item, onClose, onAddToCart }: MenuItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleAddToCart = () => {
    onAddToCart(item, quantity, specialInstructions || undefined);
    onClose();
  };

  const adjustQuantity = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="space-y-6">
            {/* Item image */}
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            {/* Item details */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h2>
                <p className="text-gray-600 text-lg">{item.description}</p>
              </div>

              <div className="flex items-center space-x-4">
                <Badge variant="info">{item.category}</Badge>
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">{item.prepTime} minutes</span>
                </div>
              </div>

              <div className="text-3xl font-bold text-gray-900">
                ${item.price.toFixed(2)}
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {item.ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="default" size="sm">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Allergens */}
              {item.allergens.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-gray-900">Allergen Information</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.allergens.map((allergen, index) => (
                      <Badge key={index} variant="warning" size="sm">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Special instructions */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Special Instructions</h3>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requests or dietary requirements..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  rows={3}
                />
              </div>

              {/* Quantity and add to cart */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => adjustQuantity(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => adjustQuantity(1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button onClick={handleAddToCart} size="lg">
                  Add to Cart - ${(item.price * quantity).toFixed(2)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}