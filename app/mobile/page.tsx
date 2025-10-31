'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Smartphone, 
  Phone, 
  MessageSquare, 
  Package, 
  Truck, 
  Stethoscope,
  Users,
  BarChart3,
  Settings,
  Menu,
  Search,
  Bell,
  User,
  Home,
  ShoppingCart,
  Heart,
  MapPin,
  Clock,
  CheckCircle
} from 'lucide-react';

interface MobileMenuItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  href: string;
  ussdCode?: string;
}

function MobileContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);

  // Mock data for mobile-optimized interface
  const menuItems: MobileMenuItem[] = [
    {
      id: 'browse',
      title: 'Browse Products',
      description: 'Find fresh agricultural products',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/listings/browse',
      ussdCode: '*123*1#'
    },
    {
      id: 'orders',
      title: 'My Orders',
      description: 'Track your orders',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/dashboard/buyer',
      ussdCode: '*123*2#'
    },
    {
      id: 'tracking',
      title: 'Track Delivery',
      description: 'Real-time delivery tracking',
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/tracking',
      ussdCode: '*123*3#'
    },
    {
      id: 'agro-vet',
      title: 'Agro Expert Services',
      description: 'Expert advice and products',
      icon: Stethoscope,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      href: '/dashboard/agro-vet',
      ussdCode: '*123*4#'
    },
    {
      id: 'messaging',
      title: 'Messages',
      description: 'Chat with farmers and experts',
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/messaging',
      ussdCode: '*123*5#'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'View your performance',
      icon: BarChart3,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      href: '/analytics'
    }
  ];

  const recentOrders = [
    { id: '1', product: 'Fresh Tomatoes', status: 'Delivered', date: '2 hours ago' },
    { id: '2', product: 'Organic Rice', status: 'In Transit', date: '1 day ago' },
    { id: '3', product: 'Cocoa Beans', status: 'Processing', date: '2 days ago' }
  ];

  const quickActions = [
    { title: 'Call Support', icon: Phone, action: 'tel:+2348001234567' },
    { title: 'USSD Menu', icon: MessageSquare, action: 'ussd' },
    { title: 'Emergency', icon: Bell, action: 'emergency' }
  ];

  const handleUSSD = () => {
    // In production, this would initiate USSD session
    alert('USSD Menu: Dial *123# to access Lovtiti Agro Mart services');
  };

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Lovitti Agro</h1>
                <p className="text-xs text-gray-600">Mobile App</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 bg-white border-b">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search products, farmers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex-col space-y-2"
                  onClick={() => {
                    if (action.action === 'ussd') {
                      handleUSSD();
                    } else if (action.action.startsWith('tel:')) {
                      handleCall(action.action.replace('tel:', ''));
                    } else {
                      alert(`${action.title} feature coming soon!`);
                    }
                  }}
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-xs text-center">{action.title}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Menu */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Services</CardTitle>
            <CardDescription className="text-sm">Access all platform features</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="outline"
                    className="h-24 flex-col space-y-2 p-3"
                    onClick={() => {
                      if (item.href) {
                        window.location.href = item.href;
                      }
                    }}
                  >
                    <div className={`w-10 h-10 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                      {item.ussdCode && (
                        <p className="text-xs text-green-600 font-mono">{item.ussdCode}</p>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <CardDescription className="text-sm">Your latest purchases</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{order.product}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* USSD Information */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="text-center">
              <Phone className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900 mb-1">USSD Access</h3>
              <p className="text-sm text-green-700 mb-3">
                Access Lovtiti Agro Mart via USSD on any phone
              </p>
              <div className="bg-white rounded-lg p-3 mb-3">
                <p className="text-lg font-mono font-bold text-green-800">*123#</p>
                <p className="text-xs text-green-600">Dial this code on your phone</p>
              </div>
              <Button 
                onClick={handleUSSD}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Try USSD Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 py-2">
          <Button
            variant="ghost"
            className={`h-12 flex-col space-y-1 ${
              activeTab === 'home' ? 'text-green-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('home')}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            className={`h-12 flex-col space-y-1 ${
              activeTab === 'browse' ? 'text-green-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('browse')}
          >
            <Package className="h-5 w-5" />
            <span className="text-xs">Browse</span>
          </Button>
          <Button
            variant="ghost"
            className={`h-12 flex-col space-y-1 ${
              activeTab === 'orders' ? 'text-green-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-xs">Orders</span>
          </Button>
          <Button
            variant="ghost"
            className={`h-12 flex-col space-y-1 ${
              activeTab === 'messages' ? 'text-green-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('messages')}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">Messages</span>
          </Button>
          <Button
            variant="ghost"
            className={`h-12 flex-col space-y-1 ${
              activeTab === 'profile' ? 'text-green-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-16"></div>
    </div>
  );
}

export default function MobilePage() {
  return <MobileContent />;
}
