'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Clock,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Share,
  Download,
  MessageCircle,
  Phone,
  Video
} from 'lucide-react';

interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: Date;
  description: string;
  actor: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface OrderDetails {
  id: string;
  product: string;
  quantity: number;
  farmer: string;
  buyer: string;
  transporter: string;
  status: string;
  totalValue: number;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  events: TrackingEvent[];
}

function TrackingContent({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Mock data - in production, this would come from API
  useEffect(() => {
    const mockOrder: OrderDetails = {
      id: orderId,
      product: 'Fresh Organic Tomatoes',
      quantity: 50,
      farmer: 'Green Valley Farm',
      buyer: 'Fresh Market Co',
      transporter: 'Fast Logistics Ltd',
      status: 'In Transit',
      totalValue: 25000,
      estimatedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 4), // 4 hours from now
      events: [
        {
          id: '1',
          status: 'Order Placed',
          location: 'Green Valley Farm, Lagos',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
          description: 'Order placed and confirmed by farmer',
          actor: 'Green Valley Farm',
          coordinates: { lat: 6.5244, lng: 3.3792 }
        },
        {
          id: '2',
          status: 'Quality Check',
          location: 'Green Valley Farm, Lagos',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
          description: 'Quality inspection completed - Grade A tomatoes',
          actor: 'Dr. Ahmed Vet',
          coordinates: { lat: 6.5244, lng: 3.3792 }
        },
        {
          id: '3',
          status: 'Picked Up',
          location: 'Green Valley Farm, Lagos',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
          description: 'Package picked up by transporter',
          actor: 'Fast Logistics Ltd',
          coordinates: { lat: 6.5244, lng: 3.3792 }
        },
        {
          id: '4',
          status: 'In Transit',
          location: 'Lagos-Ibadan Expressway',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          description: 'Package in transit to destination',
          actor: 'Fast Logistics Ltd',
          coordinates: { lat: 6.4474, lng: 3.3903 }
        }
      ]
    };

    setOrder(mockOrder);
    setIsLoading(false);
  }, [orderId]);

  const refreshTracking = async () => {
    setIsRefreshing(true);
    // In production, this would fetch real-time updates
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Order Placed':
      case 'Quality Check':
      case 'Picked Up':
        return 'text-blue-600 bg-blue-100';
      case 'In Transit':
        return 'text-yellow-600 bg-yellow-100';
      case 'Delivered':
        return 'text-green-600 bg-green-100';
      case 'Delayed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Order Placed':
        return <Package className="w-4 h-4" />;
      case 'Quality Check':
        return <CheckCircle className="w-4 h-4" />;
      case 'Picked Up':
      case 'In Transit':
        return <Truck className="w-4 h-4" />;
      case 'Delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'Delayed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600">The order you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Package className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Order Tracking</h1>
                <p className="text-sm text-gray-600">Order #{order.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshTracking}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Complete order information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{order.product}</h4>
                  <p className="text-sm text-gray-600">Quantity: {order.quantity} units</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Farmer:</span>
                    <span className="text-sm font-medium">{order.farmer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Buyer:</span>
                    <span className="text-sm font-medium">{order.buyer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Transporter:</span>
                    <span className="text-sm font-medium">{order.transporter}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Value:</span>
                    <span className="text-sm font-medium">ℏ{order.totalValue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Estimated Delivery:</span>
                    <span className="text-sm text-gray-600">
                      {order.estimatedDelivery.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{order.farmer}</p>
                    <p className="text-sm text-gray-600">Farmer</p>
                  </div>
                  <div className="flex space-x-1 ml-auto">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{order.transporter}</p>
                    <p className="text-sm text-gray-600">Transporter</p>
                  </div>
                  <div className="flex space-x-1 ml-auto">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tracking Timeline */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Tracking Timeline</CardTitle>
                <CardDescription>Real-time updates of your order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {order.events.map((event, index) => (
                    <div key={event.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(event.status)}`}>
                          {getStatusIcon(event.status)}
                        </div>
                        {index < order.events.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-200 ml-4 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{event.status}</h4>
                          <span className="text-sm text-gray-500">
                            {event.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{event.location}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">by {event.actor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Map View */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Location Tracking</CardTitle>
                <CardDescription>Current location and route</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Interactive map will be displayed here</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Real-time GPS tracking integration
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  return <TrackingContent orderId={orderId} />;
}
