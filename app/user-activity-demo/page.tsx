'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { userActivityLogger, logUserLogin, logCartActivity, logDashboardAccess, logListingActivity } from '@/utils/userActivityLogger';
import { authLogger } from '@/utils/authLogger';

export default function UserActivityDemoPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  // Simulate user registration and login
  const simulateUserRegistration = () => {
    const userId = 'user-' + Date.now();
    const userRole = 'FARMER';
    const userEmail = 'farmer@example.com';

    console.log('🆕 USER REGISTRATION EVENT:');
    console.log('User ID:', userId);
    console.log('Role:', userRole);
    console.log('Email:', userEmail);
    console.log('Timestamp:', new Date().toISOString());

    // Log registration activity
    logUserLogin(userId, userRole, userEmail, {
      registrationMethod: 'clerk',
      timestamp: new Date().toISOString(),
      webhookEvent: 'user.created'
    });

    // Log login activity
    authLogger.logLogin(userId, userRole, userEmail, {
      loginMethod: 'clerk',
      browser: 'Chrome',
      timestamp: new Date().toISOString()
    });

    refreshData();
  };

  // Simulate cart interactions
  const simulateCartInteraction = () => {
    const userId = 'user-' + Date.now();
    const userRole = 'BUYER';
    const userEmail = 'buyer@example.com';

    console.log('🛒 CART INTERACTION EVENT:');
    console.log('User ID:', userId);
    console.log('Role:', userRole);
    console.log('Email:', userEmail);
    console.log('Action: Add to Cart');
    console.log('Product: Fresh Organic Tomatoes');
    console.log('Quantity: 5 kg');
    console.log('Price: ℏ2,500');
    console.log('Seller: John Farmer');
    console.log('Timestamp:', new Date().toISOString());

    logCartActivity(userId, userRole, userEmail, 'CART_ADD', {
      productId: 'prod-tomatoes-001',
      listingId: 'listing-tomatoes-001',
      sellerId: 'seller-john-farmer',
      sellerType: 'FARMER',
      productName: 'Fresh Organic Tomatoes',
      quantity: 5,
      price: 2500,
      currency: 'HBAR',
      category: 'Vegetables',
      location: 'Lagos, Nigeria',
      timestamp: new Date().toISOString()
    });

    refreshData();
  };

  // Simulate listing creation
  const simulateListingCreation = () => {
    const userId = 'user-' + Date.now();
    const userRole = 'FARMER';
    const userEmail = 'farmer@example.com';

    console.log('📝 LISTING CREATION EVENT:');
    console.log('User ID:', userId);
    console.log('Role:', userRole);
    console.log('Email:', userEmail);
    console.log('Action: Create Listing');
    console.log('Product: Organic Maize');
    console.log('Category: Grains');
    console.log('Price: ℏ1,800/kg');
    console.log('Quantity: 100 kg');
    console.log('Location: Kano, Nigeria');
    console.log('Timestamp:', new Date().toISOString());

    logListingActivity(userId, userRole, userEmail, 'LISTING_CREATE', {
      listingId: 'listing-maize-001',
      productName: 'Organic Maize',
      category: 'Grains',
      price: 1800,
      currency: 'HBAR',
      quantity: 100,
      unit: 'kg',
      location: 'Kano, Nigeria',
      harvestDate: '2024-01-15',
      timestamp: new Date().toISOString()
    });

    refreshData();
  };

  // Simulate dashboard access
  const simulateDashboardAccess = () => {
    const userId = 'user-' + Date.now();
    const userRole = 'DISTRIBUTOR';
    const userEmail = 'distributor@example.com';

    console.log('📊 DASHBOARD ACCESS EVENT:');
    console.log('User ID:', userId);
    console.log('Role:', userRole);
    console.log('Email:', userEmail);
    console.log('Dashboard: Distributor Dashboard');
    console.log('Section: Inventory Management');
    console.log('Timestamp:', new Date().toISOString());

    logDashboardAccess(userId, userRole, userEmail, 'Distributor Dashboard', {
      section: 'inventory',
      timestamp: new Date().toISOString()
    });

    refreshData();
  };

  // Simulate admin action
  const simulateAdminAction = () => {
    const userId = 'admin-' + Date.now();
    const userRole = 'ADMIN';
    const userEmail = 'admin@lovittiagro.com';

    console.log('🔧 ADMIN ACTION EVENT:');
    console.log('User ID:', userId);
    console.log('Role:', userRole);
    console.log('Email:', userEmail);
    console.log('Action: KYC Approval');
    console.log('Target User: farmer@example.com');
    console.log('Status: Approved');
    console.log('Timestamp:', new Date().toISOString());

    userActivityLogger.logActivity({
      userId,
      userRole,
      userEmail,
      activityType: 'ADMIN_ACTION',
      description: 'Admin approved KYC submission for farmer@example.com',
      metadata: {
        action: 'kyc_approval',
        targetUserId: 'farmer-user-001',
        targetUserEmail: 'farmer@example.com',
        approvalStatus: 'APPROVED',
        timestamp: new Date().toISOString()
      }
    });

    refreshData();
  };

  const refreshData = () => {
    const recentActivities = userActivityLogger.getRecentActivities(10);
    const activityStats = userActivityLogger.getActivityStats();
    const sessionStats = authLogger.getSessionStats();

    setActivities(recentActivities);
    setStats({
      activity: activityStats,
      session: sessionStats
    });
  };

  const clearAllData = () => {
    userActivityLogger.clearActivities();
    authLogger.clearAllSessions();
    refreshData();
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Activity Logging Demo</h1>
          <p className="text-gray-600 mt-2">
            This page demonstrates user interaction logging in the Lovtiti Agro Mart platform.
            Check the browser console to see detailed logs of user activities.
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activity.totalActivities}</div>
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
                <div className="text-2xl font-bold">{stats.activity.recentActivityCount}</div>
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
                <div className="text-2xl font-bold">{stats.session.totalActiveSessions}</div>
                <p className="text-xs text-muted-foreground">
                  Currently logged in
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Roles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.keys(stats.activity.activitiesByRole).length}</div>
                <p className="text-xs text-muted-foreground">
                  Different roles active
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Simulation Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Simulate User Interactions</CardTitle>
            <CardDescription>
              Click the buttons below to simulate different user activities.
              Check the browser console (F12) to see detailed logging output.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button onClick={simulateUserRegistration} className="bg-green-600 hover:bg-green-700">
                🆕 Simulate User Registration
              </Button>
              <Button onClick={simulateCartInteraction} className="bg-blue-600 hover:bg-blue-700">
                🛒 Simulate Cart Interaction
              </Button>
              <Button onClick={simulateListingCreation} className="bg-purple-600 hover:bg-purple-700">
                📝 Simulate Listing Creation
              </Button>
              <Button onClick={simulateDashboardAccess} className="bg-orange-600 hover:bg-orange-700">
                📊 Simulate Dashboard Access
              </Button>
              <Button onClick={simulateAdminAction} className="bg-red-600 hover:bg-red-700">
                🔧 Simulate Admin Action
              </Button>
              <Button onClick={clearAllData} variant="outline" className="text-red-600 hover:text-red-700">
                🗑️ Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Console Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Console Logging Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-medium mb-2">To view detailed activity logs:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Open your browser's Developer Tools (F12 or right-click → Inspect)</li>
                <li>Go to the "Console" tab</li>
                <li>Click any of the simulation buttons above</li>
                <li>Watch the detailed activity logs appear in the console</li>
                <li>Each log includes user ID, role, email, activity type, and metadata</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities Display */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities (In-Memory Cache)</CardTitle>
            <CardDescription>
              These are the activities stored in the application's memory cache.
              In a production environment, these would be saved to the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No activities logged yet. Click the simulation buttons above to generate activities.</p>
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







