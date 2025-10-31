'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardGuard from '@/components/DashboardGuard';
import {
  Shield,
  Users,
  FileText,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  Settings,
  Eye,
  MessageSquare,
  Package,
  Truck,
  Stethoscope,
  ShoppingCart,
  UserCheck,
  AlertCircle,
  DollarSign,
  Globe
} from 'lucide-react';
import Link from 'next/link';

function AdminDashboardContent() {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data - in real app, this would come from API
  const stats = {
    totalUsers: 16750,
    activeUsers: 15200,
    pendingKyc: 45,
    totalTransactions: 12500,
    monthlyRevenue: 485000,
    activeListings: 3200,
    pendingDisputes: 12,
    systemUptime: 99.9
  };

  const recentActivity = [
    {
      id: '1',
      type: 'kyc_approved',
      user: 'John Farmer',
      role: 'FARMER',
      timestamp: '2 minutes ago',
      status: 'approved'
    },
    {
      id: '2',
      type: 'dispute_resolved',
      user: 'Sarah Buyer',
      role: 'BUYER',
      timestamp: '15 minutes ago',
      status: 'resolved'
    },
    {
      id: '3',
      type: 'listing_flagged',
      user: 'Mike Distributor',
      role: 'DISTRIBUTOR',
      timestamp: '1 hour ago',
      status: 'under_review'
    },
    {
      id: '4',
      type: 'user_suspended',
      user: 'Lisa Transporter',
      role: 'TRANSPORTER',
      timestamp: '2 hours ago',
      status: 'suspended'
    },
    {
      id: '5',
      type: 'kyc_submitted',
      user: 'Dr. Ahmed Vet',
      role: 'AGROEXPERT',
      timestamp: '3 hours ago',
      status: 'pending'
    }
  ];

  const userBreakdown = [
    { role: 'FARMER', count: 5000, percentage: 30, color: 'bg-green-500' },
    { role: 'BUYER', count: 10000, percentage: 60, color: 'bg-blue-500' },
    { role: 'DISTRIBUTOR', count: 500, percentage: 3, color: 'bg-purple-500' },
    { role: 'TRANSPORTER', count: 1000, percentage: 6, color: 'bg-orange-500' },
    { role: 'AGROEXPERT', count: 200, percentage: 1, color: 'bg-red-500' },
    { role: 'ADMIN', count: 50, percentage: 0.3, color: 'bg-gray-500' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'kyc_approved':
      case 'kyc_submitted':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'dispute_resolved':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'listing_flagged':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'user_suspended':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'resolved':
        return 'text-green-600';
      case 'pending':
      case 'under_review':
        return 'text-yellow-600';
      case 'suspended':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Platform oversight and management</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
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
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.systemUptime}%</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/kyc">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">KYC Verification</CardTitle>
                <CardDescription>Review and verify user submissions</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.pendingKyc}</div>
                <p className="text-sm text-gray-500">Pending Reviews</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/disputes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-lg">Dispute Management</CardTitle>
                <CardDescription>Resolve order disputes</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.pendingDisputes}</div>
                <p className="text-sm text-gray-500">Active Disputes</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/roles">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">User Management</CardTitle>
                <CardDescription>Manage roles and permissions</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-sm text-gray-500">Total Users</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Analytics</CardTitle>
                <CardDescription>Platform insights and metrics</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalTransactions.toLocaleString()}</div>
                <p className="text-sm text-gray-500">Total Transactions</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
              <CardDescription>Breakdown of users by role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userBreakdown.map((item) => (
                  <div key={item.role} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-medium">{item.role}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{item.count.toLocaleString()}</span>
                      <span className="text-sm text-gray-400">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{activity.user}</p>
                        <span className={`text-xs ${getActivityColor(activity.status)}`}>
                          {activity.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{activity.role} • {activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Health */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
            <CardDescription>System status and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{stats.systemUptime}%</div>
                <p className="text-sm text-gray-600">System Uptime</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.activeListings.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Active Listings</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalTransactions.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Total Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return <AdminDashboardContent />;
}
