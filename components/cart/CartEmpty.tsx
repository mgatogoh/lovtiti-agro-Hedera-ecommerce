'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, ArrowRight, Heart, Package } from 'lucide-react';

export default function CartEmpty() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="text-center py-12 px-6">
          {/* Empty Cart Icon */}
          <div className="relative mb-6">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-400">0</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          
          {/* Description */}
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet. 
            Start exploring our marketplace to find fresh agricultural products!
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/listings/browse" className="block">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Package className="w-4 h-4 mr-2" />
                Browse Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <Link href="/listings/browse?category=organic" className="block">
              <Button variant="outline" className="w-full">
                <Heart className="w-4 h-4 mr-2" />
                View Organic Products
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Why shop with us?
            </h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Fresh products directly from farms</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Blockchain-verified supply chain</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Secure payments with multiple options</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
