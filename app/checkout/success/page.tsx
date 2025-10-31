'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle,
  Package,
  Truck,
  Clock,
  ArrowRight,
  Copy,
  ExternalLink,
  Home,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const paymentMethod = searchParams.get('payment');
  const transactionId = searchParams.get('tx');

  useEffect(() => {
    // Simulate order details fetch
    const fetchOrderDetails = async () => {
      try {
        // In a real app, you'd fetch order details from your API
        await new Promise(resolve => setTimeout(resolve, 1000));

        setOrderDetails({
          orderId: `ORDER-${Date.now()}`,
          transactionId: transactionId || `TX-${Date.now()}`,
          paymentMethod: paymentMethod || 'hedera',
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          trackingNumber: `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          items: [
            { name: 'Fresh Tomatoes', quantity: 2, farmer: 'John Doe Farm' },
            { name: 'Organic Carrots', quantity: 1, farmer: 'Green Valley Farm' }
          ]
        });
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [paymentMethod, transactionId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Transaction ID copied to clipboard",
    });
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'hedera':
        return { name: 'Hedera HBAR', icon: '🔗', color: 'text-purple-600' };
      case 'metamask':
        return { name: 'MetaMask', icon: '🦊', color: 'text-orange-600' };
      case 'stripe':
        return { name: 'Credit Card', icon: '💳', color: 'text-blue-600' };
      default:
        return { name: 'Blockchain Payment', icon: '⛓️', color: 'text-green-600' };
    }
  };

  const paymentDisplay = getPaymentMethodDisplay(paymentMethod || 'hedera');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 text-lg">
            Your order has been confirmed and payment sent directly to farmers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Order ID</span>
                <span className="text-sm font-mono font-medium">{orderDetails?.orderId}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Payment Method</span>
                <div className="flex items-center">
                  <span className="text-sm mr-2">{paymentDisplay.icon}</span>
                  <span className={`text-sm font-medium ${paymentDisplay.color}`}>
                    {paymentDisplay.name}
                  </span>
                </div>
              </div>

              {orderDetails?.transactionId && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Transaction ID</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(orderDetails.transactionId)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`https://hashscan.io/testnet/transaction/${orderDetails.transactionId}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-gray-800 break-all">
                    {orderDetails.transactionId}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Tracking Number</span>
                <span className="text-sm font-mono font-medium">{orderDetails?.trackingNumber}</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Estimated Delivery</p>
                  <p className="text-sm text-blue-700">
                    {orderDetails?.estimatedDelivery?.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Order Items</h4>
                {orderDetails?.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-600">From: {item.farmer}</p>
                    </div>
                    <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 font-medium">✅ Payment sent directly to farmers</p>
                <p className="text-xs text-green-700 mt-1">
                  Your payment has been distributed to the individual farmers based on your order
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Order Processing</h3>
                <p className="text-sm text-gray-600">Farmers are preparing your items for shipment</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Truck className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Shipment Tracking</h3>
                <p className="text-sm text-gray-600">You'll receive tracking updates via email</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Delivery</h3>
                <p className="text-sm text-gray-600">Fresh products delivered to your door</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Link href="/listings/browse">
            <Button className="bg-green-600 hover:bg-green-700">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <Link href="/dashboard/buyer">
            <Button variant="outline">
              <Package className="w-4 h-4 mr-2" />
              View Orders
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Support Information */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Need help with your order? Contact our support team
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <a href="mailto:support@lovtiti.com" className="text-green-600 hover:text-green-700">
              Email Support
            </a>
            <span className="text-gray-400">|</span>
            <a href="tel:+1234567890" className="text-green-600 hover:text-green-700">
              Call Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}