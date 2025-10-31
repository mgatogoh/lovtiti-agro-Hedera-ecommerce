'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart,
  Heart,
  Check,
  Loader2,
  Plus,
  Minus,
  LogIn
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
// import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { canUserBuyFrom, getBusinessRulesForUser } from '@/utils/businessLogic';

interface ProductActionsProps {
  productId: string;
  listingId: string;
  sellerId: string;
  sellerType: 'FARMER' | 'DISTRIBUTOR' | 'AGROEXPERT';
  name: string;
  description: string;
  price: number;
  currency: string;
  unit: string;
  images: string[];
  category: string;
  location: string;
  harvestDate?: Date;
  expiryDate?: Date;
  certifications?: string[];
  className?: string;
}

export default function ProductActions({
  productId,
  listingId,
  sellerId,
  sellerType,
  name,
  description,
  price,
  currency,
  unit,
  images,
  category,
  location,
  harvestDate,
  expiryDate,
  certifications = [],
  className = '',
}: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingLike, setIsTogglingLike] = useState(false);

  // const { user, isSignedIn } = useUser();
  const user = null; // Temporary for development
  const isSignedIn = false; // Temporary for development
  const router = useRouter();

  // Get user role (default to BUYER for now)
  const userRole = 'BUYER' as any; // Default role for development

  // Check if user can buy from this seller based on business logic
  const canBuy = canUserBuyFrom(userRole as any, sellerType);

  const {
    addToCart,
    toggleLike,
    isInCart,
    isLiked,
  } = useCart();

  const handleAddToCart = async () => {
    // Allow cart functionality without authentication for now
    // if (!isSignedIn) {
    //   router.push('/auth/login');
    //   return;
    // }

    setIsAddingToCart(true);
    try {
      await addToCart({
        productId,
        listingId,
        sellerId,
        sellerType,
        name,
        description,
        price,
        currency,
        quantity,
        unit,
        images,
        category,
        location,
        harvestDate,
        expiryDate,
        certifications,
      });

      // Show success feedback
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAddingToCart(false);
    }
  };

  const handleToggleLike = async () => {
    // Allow like functionality without authentication for now
    // if (!isSignedIn) {
    //   router.push('/auth/login');
    //   return;
    // }

    setIsTogglingLike(true);
    try {
      await toggleLike(productId, listingId);
      setTimeout(() => {
        setIsTogglingLike(false);
      }, 500);
    } catch (error) {
      console.error('Error toggling like:', error);
      setIsTogglingLike(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 100) {
      setQuantity(newQuantity);
    }
  };

  const isInCartStatus = isInCart(productId, listingId);
  const isLikedStatus = isLiked(productId, listingId);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Quantity Selector */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="w-8 h-8 p-0"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[2rem] text-center">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= 100}
            className="w-8 h-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isAddingToCart || isInCartStatus || !canBuy}
          className={`flex-1 ${isInCartStatus
            ? 'bg-green-600 text-white cursor-not-allowed'
            : !canBuy
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
            }`}
        >
          {isAddingToCart ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : isInCartStatus ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Added to Cart
            </>
          ) : !canBuy ? (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Not Available
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>

        {/* Like Button */}
        <Button
          variant="outline"
          onClick={handleToggleLike}
          disabled={isTogglingLike}
          className={`w-12 h-10 p-0 ${isLikedStatus
            ? 'text-red-600 border-red-300 bg-red-50 hover:bg-red-100'
            : 'text-gray-600 border-gray-300 hover:border-red-300 hover:text-red-600'
            }`}
        >
          {isTogglingLike ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Heart
              className={`w-4 h-4 ${isLikedStatus ? 'fill-current' : ''
                }`}
            />
          )}
        </Button>
      </div>

      {/* Price Display */}
      <div className="text-center pt-2 border-t border-gray-100">
        <div className="text-lg font-bold text-green-600">
          {currency} {price.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500">
          per {unit}
        </div>
        {quantity > 1 && (
          <div className="text-sm text-gray-600 mt-1">
            Total: {currency} {(price * quantity).toLocaleString()}
          </div>
        )}
      </div>

      {/* Status Messages */}
      {isInCartStatus && (
        <div className="text-center">
          <p className="text-sm text-green-600 font-medium">
            ✓ Item added to cart
          </p>
          <p className="text-xs text-gray-500">
            You can adjust quantity in your cart
          </p>
        </div>
      )}

      {isLikedStatus && (
        <div className="text-center">
          <p className="text-sm text-red-600 font-medium">
            ♥ Item liked
          </p>
          <p className="text-xs text-gray-500">
            View your liked items in your profile
          </p>
        </div>
      )}

      {/* Business Logic Information */}
      {!canBuy && (
        <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium">
            Purchase Not Available
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            {userRole === 'FARMER' && sellerType === 'FARMER' && 'Farmers cannot buy from other farmers'}
            {userRole === 'DISTRIBUTOR' && sellerType === 'DISTRIBUTOR' && 'Distributors cannot buy from other distributors'}
            {userRole === 'TRANSPORTER' && 'Transporters cannot buy products'}
            {userRole === 'AGROEXPERT' && sellerType === 'AGROEXPERT' && 'Agro Experts cannot buy from other Agro Experts'}
            {userRole === 'BUYER' && 'Buyers can buy from any seller'}
          </p>
        </div>
      )}
    </div>
  );
}
