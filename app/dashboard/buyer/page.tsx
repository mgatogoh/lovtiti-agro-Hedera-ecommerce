'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
// import DashboardGuard from '@/components/DashboardGuard';
import {
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  Heart,
  Search,
  Star,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  Bell,
  Settings
} from 'lucide-react';

function BuyerDashboardContent() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const stats = {
    totalOrders: 15,
    totalSpent: 85000,
    favoriteFarmers: 8,
    pendingOrders: 3
  };

  const recentOrders = [
    {
      id: 1,
      farmer: 'Sarah Okafor',
      product: 'Fresh Tomatoes',
      quantity: 20,
      total: 10000,
      status: 'Delivered',
      date: '2024-01-15',
      rating: 5
    },
    {
      id: 2,
      farmer: 'John Mwangi',
      product: 'Organic Rice',
      quantity: 10,
      total: 8000,
      status: 'Shipped',
      date: '2024-01-14',
      rating: null
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'search', label: 'Browse', icon: Search },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Buyer Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">ℏ{stats.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Favorite Farmers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.favoriteFarmers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search for products, farmers, or categories..."
              className="pl-10 pr-4 py-3 text-lg"
            />
            <Button className="absolute right-2 top-1.5" size="sm">
              Search
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <div>
                          <h4 className="font-medium">{order.product}</h4>
                          <p className="text-sm text-gray-600">by {order.farmer}</p>
                          <p className="text-sm text-gray-500">{order.quantity} units • {order.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">ℏ{order.total.toLocaleString()}</p>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View All Orders
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="h-20 flex-col">
                    <Search className="h-6 w-6 mb-2" />
                    Browse Products
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Heart className="h-6 w-6 mb-2" />
                    View Favorites
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Package className="h-6 w-6 mb-2" />
                    Track Orders
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Star className="h-6 w-6 mb-2" />
                    Leave Reviews
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Track and manage your orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <h4 className="font-medium">Order #{order.id}</h4>
                        <p className="text-sm text-gray-600">{order.product} by {order.farmer}</p>
                        <p className="text-sm text-gray-500">{order.quantity} units • {order.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">ℏ{order.total.toLocaleString()}</p>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        {order.status}
                      </span>
                    </div>
                    <div className="ml-4">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'favorites' && (
          <Card>
            <CardHeader>
              <CardTitle>Favorite Farmers</CardTitle>
              <CardDescription>Farmers you trust and love</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No favorite farmers yet</p>
                <p className="text-sm text-gray-400">Start exploring and add farmers to your favorites</p>
                <Button className="mt-4">Browse Farmers</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Browse by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Vegetables', 'Grains', 'Fruits', 'Spices', 'Nuts', 'Herbs', 'Dairy', 'Meat'].map((category) => (
                    <Button key={category} variant="outline" className="h-20 flex-col">
                      <span className="text-sm">{category}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Products */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Products</CardTitle>
                <CardDescription>Popular products from trusted farmers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No products available yet</p>
                  <p className="text-sm text-gray-400">Products will appear here as farmers add listings</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BuyerDashboard() {
  return (
    // <DashboardGuard
    //   allowedRoles={['BUYER', 'ADMIN']}
    //   dashboardName="Buyer Dashboard"
    //   dashboardDescription="Browse products, manage orders, and track purchases"
    // >
    <BuyerDashboardContent />
    // </DashboardGuard>
  );
}