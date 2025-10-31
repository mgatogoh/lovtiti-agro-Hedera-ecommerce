'use client';

import { useState } from 'react';
import SafeImage from '@/components/ui/safe-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Minus, 
  Plus, 
  Trash2, 
  MapPin, 
  Calendar,
  Package,
  Leaf,
  Stethoscope,
  Truck
} from 'lucide-react';
import { CartItem as CartItemType } from '@/hooks/useCart';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      onUpdateQuantity(item.id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      onRemove(item.id);
    } finally {
      setIsUpdating(false);
    }
  };

  const getSellerIcon = (sellerType: string) => {
    switch (sellerType) {
      case 'FARMER':
        return <Leaf className="w-4 h-4 text-green-600" />;
      case 'DISTRIBUTOR':
        return <Package className="w-4 h-4 text-purple-600" />;
      case 'AGRO_VET':
        return <Stethoscope className="w-4 h-4 text-red-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {/* Product Image */}
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <SafeImage
              src={item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=80&h=80&fit=crop&crop=center'}
              alt={item.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {item.description}
                </p>
                
                {/* Seller Info */}
                <div className="flex items-center space-x-2 mt-2">
                  {getSellerIcon(item.sellerType)}
                  <span className="text-sm text-gray-500 capitalize">
                    {item.sellerType.toLowerCase().replace('_', ' ')}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-1 mt-1">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{item.location}</span>
                </div>

                {/* Harvest/Expiry Date */}
                {item.harvestDate && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Harvested: {formatDate(item.harvestDate)}
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="text-right ml-4">
                <div className="text-lg font-bold text-green-600">
                  {item.currency} {item.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  per {item.unit}
                </div>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                  className="w-8 h-8 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                
                <span className="text-sm font-medium min-w-[2rem] text-center">
                  {item.quantity}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isUpdating}
                  className="w-8 h-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Total Price */}
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {item.currency} {(item.price * item.quantity).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  {item.quantity} × {item.unit}
                </div>
              </div>

              {/* Remove Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={isUpdating}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Certifications */}
            {item.certifications && item.certifications.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {item.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
