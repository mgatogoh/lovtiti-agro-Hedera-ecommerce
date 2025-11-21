'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugUserPage() {
  const { user, isLoaded } = useUser();
  const [databaseUser, setDatabaseUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const checkDatabaseUser = async () => {
    if (!user) return;

    setIsLoading(true);
    addLog('🔍 Checking user in database...');

    try {
      const response = await fetch('/api/auth/sync-user');
      const data = await response.json();

      if (data.success) {
        setDatabaseUser(data.user);
        addLog(`✅ User found in database: ${data.user.email} (${data.user.role})`);
      } else {
        addLog(`❌ User not found in database: ${data.message}`);
      }
    } catch (error) {
      addLog(`❌ Error checking database: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const syncUser = async () => {
    if (!user) return;

    setIsLoading(true);
    addLog('🔄 Syncing user to database...');

    try {
      const response = await fetch('/api/auth/sync-user', {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        setDatabaseUser(data.user);
        addLog(`✅ User synced successfully: ${data.user.email} (${data.user.role})`);
      } else {
        addLog(`❌ Sync failed: ${data.message}`);
      }
    } catch (error) {
      addLog(`❌ Error syncing user: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const assignRole = async (role: string) => {
    if (!user) return;

    setIsLoading(true);
    addLog(`🎯 Assigning role: ${role}`);

    try {
      const response = await fetch('/api/auth/assign-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });
      const data = await response.json();

      if (data.success) {
        addLog(`✅ Role assigned successfully: ${data.role}`);
        // Refresh user data
        window.location.reload();
      } else {
        addLog(`❌ Role assignment failed: ${data.error}`);
      }
    } catch (error) {
      addLog(`❌ Error assigning role: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      addLog(`👤 Clerk user loaded: ${user.emailAddresses[0]?.emailAddress} (${user.publicMetadata?.role || 'No role'})`);
      checkDatabaseUser();
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Debug User Page</CardTitle>
            <CardDescription>Please sign in to debug user data</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Debug Information</h1>
          <p className="text-gray-600 mt-2">Debug user sync and role assignment issues</p>
        </div>

        {/* Clerk User Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Clerk User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}</p>
              <p><strong>First Name:</strong> {user.firstName}</p>
              <p><strong>Last Name:</strong> {user.lastName}</p>
              <p><strong>Role (Metadata):</strong> {String(user.publicMetadata?.role) || 'Not set'}</p>
              <p><strong>Created:</strong> {user.createdAt?.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Database User Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Database User Information</CardTitle>
          </CardHeader>
          <CardContent>
            {databaseUser ? (
              <div className="space-y-2">
                <p><strong>ID:</strong> {databaseUser.id}</p>
                <p><strong>Email:</strong> {databaseUser.email}</p>
                <p><strong>Role:</strong> {databaseUser.role}</p>
                <p><strong>Created:</strong> {new Date(databaseUser.createdAt).toLocaleString()}</p>
                <p><strong>Updated:</strong> {new Date(databaseUser.updatedAt).toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-red-600">No user found in database</p>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={checkDatabaseUser} disabled={isLoading} variant="outline">
                Check Database User
              </Button>
              <Button onClick={syncUser} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                Sync User to Database
              </Button>

              <div className="flex gap-2">
                <Button onClick={() => assignRole('BUYER')} disabled={isLoading} size="sm">
                  Set Buyer
                </Button>
                <Button onClick={() => assignRole('FARMER')} disabled={isLoading} size="sm">
                  Set Farmer
                </Button>
                <Button onClick={() => assignRole('TRANSPORTER')} disabled={isLoading} size="sm">
                  Set Transporter
                </Button>
                <Button onClick={() => assignRole('AGROEXPERT')} disabled={isLoading} size="sm">
                  Set Agro Expert
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <p>No logs yet...</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))
              )}
            </div>
            <Button
              onClick={() => setLogs([])}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Clear Logs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


