'use client';

import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Heart, RefreshCw, Trash2 } from 'lucide-react';

export default function TestCartPersistence() {
  const {
    items,
    likedItems,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    clearCart,
    toggleLike,
    isInCart,
    isLiked,
    isLoading,
  } = useCart();

  const testProduct = {
    productId: 'test-product-1',
    listingId: 'test-listing-1',
    sellerId: 'test-seller-1',
    sellerType: 'FARMER' as const,
    name: 'Test Organic Tomatoes',
    description: 'Fresh organic tomatoes for testing',
    price: 5000,
    currency: 'HBAR',
    quantity: 1,
    unit: 'kg',
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea'],
    category: 'Vegetables',
    location: 'Lagos, Nigeria',
    certifications: ['Organic', 'Fair Trade'],
  };

  const handleAddToCart = () => {
    addToCart(testProduct);
  };

  const handleToggleLike = () => {
    toggleLike(testProduct.productId, testProduct.listingId, {
      category: testProduct.category,
      price: testProduct.price,
      sellerType: testProduct.sellerType,
    });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Cart Persistence Test
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Test Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleAddToCart}
                className="w-full"
                disabled={isInCart(testProduct.productId, testProduct.listingId)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isInCart(testProduct.productId, testProduct.listingId)
                  ? '✅ Added to Cart'
                  : 'Add Test Product to Cart'}
              </Button>

              <Button
                onClick={handleToggleLike}
                variant="outline"
                className="w-full"
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${isLiked(testProduct.productId, testProduct.listingId)
                      ? 'fill-red-500 text-red-500'
                      : ''
                    }`}
                />
                {isLiked(testProduct.productId, testProduct.listingId)
                  ? '❤️ Liked'
                  : 'Like Test Product'}
              </Button>

              <Button
                onClick={handleRefresh}
                variant="outline"
                className="w-full bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                🔄 Refresh Page (Test Persistence)
              </Button>

              <Button
                onClick={clearCart}
                variant="outline"
                className="w-full bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                disabled={items.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            </CardContent>
          </Card>

          {/* Cart Status */}
          <Card>
            <CardHeader>
              <CardTitle>Cart Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cart Items:</span>
                  <span className="font-bold text-green-600">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Price:</span>
                  <span className="font-bold text-green-600">
                    HBAR {totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Liked Items:</span>
                  <span className="font-bold text-red-600">{likedItems.length}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Items in Cart:</h3>
                {items.length === 0 ? (
                  <p className="text-gray-500 text-sm">No items in cart</p>
                ) : (
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item.id} className="text-sm bg-green-50 p-2 rounded">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-gray-600">
                          Qty: {item.quantity} × {item.currency} {item.price.toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Liked Items:</h3>
                {likedItems.length === 0 ? (
                  <p className="text-gray-500 text-sm">No liked items</p>
                ) : (
                  <ul className="space-y-1">
                    {likedItems.map((item) => (
                      <li key={item.id} className="text-sm bg-red-50 p-2 rounded">
                        ❤️ Product ID: {item.productId.substring(0, 15)}...
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📋 Test Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Click "Add Test Product to Cart" button above</li>
              <li>Click "Like Test Product" button above</li>
              <li>Verify the cart shows 1 item and 1 liked item</li>
              <li>Click the "🔄 Refresh Page" button</li>
              <li>✅ <strong>SUCCESS:</strong> If cart and likes are still there after refresh!</li>
              <li>❌ <strong>FAIL:</strong> If cart or likes are empty after refresh</li>
            </ol>

            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                💡 <strong>Expected Result:</strong> Cart and likes should persist after page refresh!
              </p>
              <p className="text-xs text-green-700 mt-2">
                The cart data is stored in localStorage with key: <code className="bg-green-100 px-1 rounded">lovtiti-agro-cart-v2</code>
              </p>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">
                🔍 <strong>Debug Info:</strong>
              </p>
              <p className="text-xs text-blue-700 mt-2">
                Check browser console for cart activity logs (🛒, ❤️, 💾 emojis)
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Open DevTools → Application → Local Storage → localhost:3000
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}





