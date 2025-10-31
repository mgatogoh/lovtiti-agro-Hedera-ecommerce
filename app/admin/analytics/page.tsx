'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardGuard from '@/components/DashboardGuard';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Truck,
  ShoppingCart,
  Calendar,
  Download,
  Filter,
  Globe,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react';

function AnalyticsContent() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock analytics data - in real app, this would come from API
  const analyticsData = {
    overview: {
      totalUsers: 16750,
      activeUsers: 15200,
      totalTransactions: 12500,
      totalRevenue: 485000,
      averageOrderValue: 38.8,
      userRetention: 85.2,
      systemUptime: 99.9
    },
    userGrowth: [
      { month: 'Jan', users: 12000, growth: 8.5 },
      { month: 'Feb', users: 13500, growth: 12.5 },
      { month: 'Mar', users: 14800, growth: 9.6 },
      { month: 'Apr', users: 15200, growth: 2.7 },
      { month: 'May', users: 16750, growth: 10.2 }
    ],
    revenueByRole: [
      { role: 'FARMER', revenue: 185000, percentage: 38.1 },
      { role: 'BUYER', revenue: 165000, percentage: 34.0 },
      { role: 'DISTRIBUTOR', revenue: 75000, percentage: 15.5 },
      { role: 'TRANSPORTER', revenue: 45000, percentage: 9.3 },
      { role: 'AGROEXPERT', revenue: 15000, percentage: 3.1 }
    ],
    transactionVolume: [
      { date: '2024-01-01', transactions: 450, revenue: 18500 },
      { date: '2024-01-02', transactions: 520, revenue: 21200 },
      { date: '2024-01-03', transactions: 480, revenue: 19800 },
      { date: '2024-01-04', transactions: 610, revenue: 24500 },
      { date: '2024-01-05', transactions: 580, revenue: 23200 },
      { date: '2024-01-06', transactions: 650, revenue: 26800 },
      { date: '2024-01-07', transactions: 720, revenue: 29500 }
    ],
    topProducts: [
      { name: 'Fresh Organic Tomatoes', category: 'Vegetables', sales: 1250, revenue: 62500 },
      { name: 'Premium Rice', category: 'Grains', sales: 980, revenue: 78400 },
      { name: 'Fresh Cocoa Beans', category: 'Spices', sales: 750, revenue: 90000 },
      { name: 'Organic Maize', category: 'Grains', sales: 680, revenue: 34000 },
      { name: 'Fresh Vegetables Mix', category: 'Vegetables', sales: 520, revenue: 26000 }
    ],
    geographicDistribution: [
      { region: 'Lagos', users: 4200, transactions: 3500, revenue: 145000 },
      { region: 'Abuja', users: 2800, transactions: 2200, revenue: 95000 },
      { region: 'Kano', users: 2100, transactions: 1800, revenue: 78000 },
      { region: 'Port Harcourt', users: 1800, transactions: 1500, revenue: 65000 },
      { region: 'Ibadan', users: 1500, transactions: 1200, revenue: 52000 },
      { region: 'Other', users: 4350, transactions: 2300, revenue: 45000 }
    ],
    userEngagement: {
      dailyActiveUsers: 8500,
      weeklyActiveUsers: 12000,
      monthlyActiveUsers: 15200,
      averageSessionDuration: '12.5 minutes',
      pagesPerSession: 4.2,
      bounceRate: 28.5
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'FARMER':
        return 'bg-green-500';
      case 'BUYER':
        return 'bg-blue-500';
      case 'DISTRIBUTOR':
        return 'bg-purple-500';
      case 'TRANSPORTER':
        return 'bg-orange-500';
      case 'AGROEXPERT':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'FARMER':
        return <Package className="w-4 h-4" />;
      case 'BUYER':
        return <ShoppingCart className="w-4 h-4" />;
      case 'DISTRIBUTOR':
        return <Package className="w-4 h-4" />;
      case 'TRANSPORTER':
        return <Truck className="w-4 h-4" />;
      case 'AGROEXPERT':
        return <Package className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Platform insights and performance metrics</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analyticsData.overview.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.totalTransactions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analyticsData.overview.averageOrderValue}</div>
              <p className="text-xs text-muted-foreground">
                +3% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly user growth and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.userGrowth.map((item, index) => (
                  <div key={item.month} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">{item.month}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{item.users.toLocaleString()}</span>
                      <span className="text-sm text-green-600">+{item.growth}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue by Role */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by User Role</CardTitle>
              <CardDescription>Revenue distribution across user types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.revenueByRole.map((item) => (
                  <div key={item.role} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getRoleColor(item.role)}`}></div>
                      <span className="text-sm font-medium">{item.role}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">${item.revenue.toLocaleString()}</span>
                      <span className="text-sm text-gray-400">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Volume */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Transaction Volume (Last 7 Days)</CardTitle>
            <CardDescription>Daily transaction count and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.transactionVolume.map((item) => (
                <div key={item.date} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium">{item.transactions}</p>
                      <p className="text-xs text-gray-500">Transactions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">${item.revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best selling products by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${product.revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Users and revenue by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.geographicDistribution.map((region) => (
                  <div key={region.region} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{region.region}</p>
                        <p className="text-xs text-gray-500">{region.users.toLocaleString()} users</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${region.revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{region.transactions} transactions</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Engagement Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>User Engagement Metrics</CardTitle>
            <CardDescription>Platform usage and engagement statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {analyticsData.userEngagement.dailyActiveUsers.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Daily Active Users</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analyticsData.userEngagement.weeklyActiveUsers.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Weekly Active Users</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {analyticsData.userEngagement.monthlyActiveUsers.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Monthly Active Users</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {analyticsData.userEngagement.averageSessionDuration}
                </div>
                <p className="text-sm text-gray-600">Avg Session Duration</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {analyticsData.userEngagement.pagesPerSession}
                </div>
                <p className="text-sm text-gray-600">Pages per Session</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600 mb-2">
                  {analyticsData.userEngagement.bounceRate}%
                </div>
                <p className="text-sm text-gray-600">Bounce Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return <AnalyticsContent />;
}
