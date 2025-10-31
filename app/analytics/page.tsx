'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Target,
  Zap,
  Globe
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    activeUsers: number;
    conversionRate: number;
    revenueChange: number;
    ordersChange: number;
    usersChange: number;
    conversionChange: number;
  };
  salesData: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  userMetrics: Array<{
    role: string;
    count: number;
    growth: number;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
    growth: number;
  }>;
  geographicData: Array<{
    region: string;
    orders: number;
    revenue: number;
  }>;
  performanceMetrics: {
    averageOrderValue: number;
    customerRetention: number;
    supplyChainEfficiency: number;
    deliveryTime: number;
  };
}

function AnalyticsContent() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedRole, setSelectedRole] = useState('all');

  // Mock data - in production, this would come from Elasticsearch/API
  useEffect(() => {
    const mockData: AnalyticsData = {
      overview: {
        totalRevenue: 1250000,
        totalOrders: 2847,
        activeUsers: 1256,
        conversionRate: 12.5,
        revenueChange: 18.2,
        ordersChange: 15.7,
        usersChange: 22.1,
        conversionChange: -2.3
      },
      salesData: [
        { month: 'Jan', revenue: 85000, orders: 180 },
        { month: 'Feb', revenue: 92000, orders: 195 },
        { month: 'Mar', revenue: 105000, orders: 220 },
        { month: 'Apr', revenue: 98000, orders: 210 },
        { month: 'May', revenue: 115000, orders: 240 },
        { month: 'Jun', revenue: 125000, orders: 260 }
      ],
      userMetrics: [
        { role: 'Farmers', count: 456, growth: 25.3 },
        { role: 'Buyers', count: 678, growth: 18.7 },
        { role: 'Distributors', count: 89, growth: 12.4 },
        { role: 'Transporters', count: 156, growth: 31.2 },
        { role: 'Agro Experts', count: 45, growth: 8.9 }
      ],
      topProducts: [
        { name: 'Fresh Tomatoes', sales: 1250, revenue: 187500, growth: 15.2 },
        { name: 'Organic Rice', sales: 980, revenue: 156800, growth: 22.1 },
        { name: 'Cocoa Beans', sales: 750, revenue: 225000, growth: 8.7 },
        { name: 'Maize Seeds', sales: 650, revenue: 97500, growth: 18.9 },
        { name: 'Livestock Feed', sales: 420, revenue: 84000, growth: 12.3 }
      ],
      geographicData: [
        { region: 'Lagos', orders: 1250, revenue: 312500 },
        { region: 'Abuja', orders: 980, revenue: 245000 },
        { region: 'Kano', orders: 750, revenue: 187500 },
        { region: 'Port Harcourt', orders: 650, revenue: 162500 },
        { region: 'Ibadan', orders: 580, revenue: 145000 }
      ],
      performanceMetrics: {
        averageOrderValue: 439.2,
        customerRetention: 78.5,
        supplyChainEfficiency: 92.3,
        deliveryTime: 2.4
      }
    };

    setData(mockData);
    setIsLoading(false);
  }, [selectedPeriod, selectedRole]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'HBAR'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-NG').format(num);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600">Unable to load analytics data.</p>
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
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-sm text-gray-600">Comprehensive insights and reporting</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Roles</option>
                <option value="farmer">Farmers</option>
                <option value="buyer">Buyers</option>
                <option value="distributor">Distributors</option>
                <option value="transporter">Transporters</option>
                <option value="agro-vet">Agro Experts</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
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
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(data.overview.totalRevenue)}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">
                      +{data.overview.revenueChange}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(data.overview.totalOrders)}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">
                      +{data.overview.ordersChange}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(data.overview.activeUsers)}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">
                      +{data.overview.usersChange}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.overview.conversionRate}%
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-600">
                      {data.overview.conversionChange}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Monthly revenue and order volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Revenue chart will be displayed here</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Integration with charting library (Chart.js/D3.js)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
              <CardDescription>Active users by role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.userMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">{metric.role}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatNumber(metric.count)}</p>
                      <p className="text-xs text-green-600">+{metric.growth}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products and Geographic Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best selling products by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-600">
                        {formatNumber(product.sales)} sales
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(product.revenue)}</p>
                      <p className="text-xs text-green-600">+{product.growth}%</p>
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
              <CardDescription>Orders and revenue by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.geographicData.map((region, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">{region.region}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatNumber(region.orders)} orders</p>
                      <p className="text-xs text-gray-600">{formatCurrency(region.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Average Order Value</h3>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(data.performanceMetrics.averageOrderValue)}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Customer Retention</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {data.performanceMetrics.customerRetention}%
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Supply Chain Efficiency</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {data.performanceMetrics.supplyChainEfficiency}%
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Avg Delivery Time</h3>
                <p className="text-2xl font-bold text-orange-600">
                  {data.performanceMetrics.deliveryTime} days
                </p>
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
