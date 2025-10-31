'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { userActivityLogger, logUserLogin, logCartActivity, logDashboardAccess, logListingActivity } from '@/utils/userActivityLogger';
import { authLogger } from '@/utils/authLogger';

export default function TestActivityPage() {
  const [activities, setActivities] = useState<any[]>([]);

  const simulateUserLogin = () => {
    const userId = 'test-user-' + Date.now();
    const userRole = 'FARMER';
    const userEmail = 'test@example.com';

    logUserLogin(userId, userRole, userEmail, {
      loginMethod: 'test',
      browser: 'Chrome',
      timestamp: new Date().toISOString()
    });

    authLogger.logLogin(userId, userRole, userEmail, {
      loginMethod: 'test',
      browser: 'Chrome'
    });

    refreshActivities();
  };

  const simulateCartActivity = () => {
    const userId = 'test-user-' + Date.now();
    const userRole = 'BUYER';
    const userEmail = 'buyer@example.com';

    logCartActivity(userId, userRole, userEmail, 'CART_ADD', {
      productId: 'prod-123',
      productName: 'Fresh Tomatoes',
      quantity: 5,
      price: 2500,
      currency: 'HBAR',
      category: 'Vegetables',
      sellerType: 'FARMER'
    });

    refreshActivities();
  };

  const simulateListingActivity = () => {
    const userId = 'test-user-' + Date.now();
    const userRole = 'FARMER';
    const userEmail = 'farmer@example.com';

    logListingActivity(userId, userRole, userEmail, 'LISTING_CREATE', {
      listingId: 'listing-456',
      productName: 'Organic Maize',
      category: 'Grains',
      price: 1800,
      currency: 'HBAR',
      quantity: 100,
      unit: 'kg'
    });

    refreshActivities();
  };

  const simulateDashboardAccess = () => {
    const userId = 'test-user-' + Date.now();
    const userRole = 'DISTRIBUTOR';
    const userEmail = 'distributor@example.com';

    logDashboardAccess(userId, userRole, userEmail, 'Distributor Dashboard', {
      section: 'inventory',
      timestamp: new Date().toISOString()
    });

    refreshActivities();
  };

  const refreshActivities = () => {
    const recentActivities = userActivityLogger.getRecentActivities(10);
    setActivities(recentActivities);
  };

  const getActivityStats = () => {
    return userActivityLogger.getActivityStats();
  };

  const clearActivities = () => {
    userActivityLogger.clearActivities();
    setActivities([]);
  };

  const getSessionStats = () => {
    return authLogger.getSessionStats();
  };

  const stats = getActivityStats();
  const sessionStats = getSessionStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Activity Logging Test</h1>
          <p className="text-gray-600 mt-2">Test and monitor user interactions on the platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalActivities}</div>
              <p className="text-xs text-muted-foreground">
                All time activities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentActivityCount}</div>
              <p className="text-xs text-muted-foreground">
                Last hour
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessionStats.totalActiveSessions}</div>
              <p className="text-xs text-muted-foreground">
                Currently logged in
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activities by Role</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(stats.activitiesByRole).length}</div>
              <p className="text-xs text-muted-foreground">
                Different user roles
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Test Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Simulate User Activities</CardTitle>
            <CardDescription>Click buttons to simulate different user interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button onClick={simulateUserLogin} className="bg-green-600 hover:bg-green-700">
                Simulate Login
              </Button>
              <Button onClick={simulateCartActivity} className="bg-blue-600 hover:bg-blue-700">
                Simulate Cart Add
              </Button>
              <Button onClick={simulateListingActivity} className="bg-purple-600 hover:bg-purple-700">
                Simulate Listing Create
              </Button>
              <Button onClick={simulateDashboardAccess} className="bg-orange-600 hover:bg-orange-700">
                Simulate Dashboard Access
              </Button>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button onClick={refreshActivities} variant="outline">
                Refresh Activities
              </Button>
              <Button onClick={clearActivities} variant="outline" className="text-red-600 hover:text-red-700">
                Clear Activities
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest user interactions logged by the system</CardDescription>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No activities logged yet. Click the buttons above to simulate activities.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {activity.userRole} - {activity.activityType}
                        </h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          User: {activity.userEmail} | Time: {activity.timestamp}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {activity.activityType}
                      </span>
                    </div>
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="mt-2">
                        <details className="text-xs">
                          <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                            View Metadata
                          </summary>
                          <pre className="mt-2 p-2 bg-white rounded border text-xs overflow-x-auto">
                            {JSON.stringify(activity.metadata, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}











