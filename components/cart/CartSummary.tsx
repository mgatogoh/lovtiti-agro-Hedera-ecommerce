'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CartItem } from '@/hooks/useCart';

interface CartSummaryProps {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  onClearCart: () => void;
  isLoading?: boolean;
}

export default function CartSummary({
  items,
  totalItems,
  totalPrice,
  onClearCart,
  isLoading = false
}: CartSummaryProps) {
  const subtotal = totalPrice;
  const deliveryFee = totalPrice > 0 ? 500 : 0; // Fixed delivery fee
  const serviceFee = totalPrice * 0.025; // 2.5% service fee
  const total = subtotal + deliveryFee + serviceFee;

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart? This action cannot be undone.')) {
      onClearCart();
    }
  };

  if (totalItems === 0) {
    return (
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <span>Cart Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link href="/listings/browse">
              <Button className="w-full">
                Start Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5" />
            <span>Cart Summary</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCart}
            disabled={isLoading}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items Count */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Items ({totalItems})</span>
          <span className="font-medium">{items[0]?.currency || 'HBAR'} {subtotal.toLocaleString()}</span>
        </div>

        {/* Delivery Fee */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-medium">{items[0]?.currency || 'HBAR'} {deliveryFee.toLocaleString()}</span>
        </div>

        {/* Service Fee */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Service Fee (2.5%)</span>
          <span className="font-medium">{items[0]?.currency || 'HBAR'} {serviceFee.toFixed(2)}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-green-600">{items[0]?.currency || 'HBAR'} {total.toLocaleString()}</span>
        </div>

        {/* Checkout Button */}
        <Link href="/checkout" className="block">
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>

        {/* Continue Shopping */}
        <Link href="/listings/browse" className="block">
          <Button variant="outline" className="w-full">
            Continue Shopping
          </Button>
        </Link>

        {/* Security Notice */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
          <p>🔒 Secure checkout with blockchain verification</p>
          <p>📦 Supply chain tracking included</p>
        </div>
      </CardContent>
    </Card>
  );
}
