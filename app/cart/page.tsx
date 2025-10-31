'use client';

import { useCart } from '@/hooks/useCart';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import CartEmpty from '@/components/cart/CartEmpty';
import { Loader2, LogIn } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CartPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading,
  } = useCart();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/auth/login');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LogIn className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-4">Please log in to view your cart</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (totalItems === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            Review your items and proceed to checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary
              items={items}
              totalItems={totalItems}
              totalPrice={totalPrice}
              onClearCart={clearCart}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
