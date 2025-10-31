'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestUserCreationPage() {
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    role: 'BUYER'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createUser = async () => {
    if (!formData.id || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        // Clear form
        setFormData({ id: '', email: '', role: 'BUYER' });
        // Refresh users list
        fetchUsers();
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users/create');
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const generateTestUser = () => {
    const timestamp = Date.now();
    setFormData({
      id: `user_${timestamp}`,
      email: `testuser${timestamp}@example.com`,
      role: 'BUYER'
    });
  };

  const generateGoogleUser = () => {
    const timestamp = Date.now();
    setFormData({
      id: `google_user_${timestamp}`,
      email: `user@gmail.com`,
      role: 'BUYER'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Test User Creation</h1>
          <p className="text-gray-600 mt-2">
            Test user creation in the Neon database and verify that users are being recorded properly.
          </p>
        </div>

        {/* User Creation Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create Test User</CardTitle>
            <CardDescription>
              Create a test user to verify database connectivity and user recording.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="id">User ID</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  placeholder="user_12345"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="BUYER">Buyer</option>
                <option value="FARMER">Farmer</option>
                <option value="DISTRIBUTOR">Distributor</option>
                <option value="TRANSPORTER">Transporter</option>
                <option value="AGROEXPERT">Agro Expert</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={createUser}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Creating...' : 'Create User'}
              </Button>
              <Button onClick={generateTestUser} variant="outline">
                Generate Test User
              </Button>
              <Button onClick={generateGoogleUser} variant="outline">
                Generate Google User
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result Display */}
        {result && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className={result.success ? 'text-green-600' : 'text-red-600'}>
                {result.success ? '✅ Success' : '❌ Error'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{result.message}</p>
              {result.error && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-red-800 text-sm">{result.error}</p>
                </div>
              )}
              {result.data && (
                <div className="bg-green-50 border border-green-200 rounded p-3 mt-2">
                  <pre className="text-green-800 text-sm overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Users in Database</CardTitle>
                <CardDescription>
                  Current users stored in the Neon database ({users.length} users)
                </CardDescription>
              </div>
              <Button onClick={fetchUsers} variant="outline">
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No users found in database. Create a test user above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user, index) => (
                  <div key={user.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{user.email}</h4>
                        <p className="text-sm text-gray-600">ID: {user.id}</p>
                        <p className="text-sm text-gray-600">Role: {user.role}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created: {new Date(user.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                          user.role === 'FARMER' ? 'bg-green-100 text-green-800' :
                            user.role === 'BUYER' ? 'bg-blue-100 text-blue-800' :
                              user.role === 'DISTRIBUTOR' ? 'bg-purple-100 text-purple-800' :
                                user.role === 'TRANSPORTER' ? 'bg-orange-100 text-orange-800' :
                                  user.role === 'AGROEXPERT' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                        }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>1. Test Database Connection:</strong> Click "Generate Test User" and "Create User" to test if the database is working.</p>
              <p><strong>2. Check Console Logs:</strong> Open browser console (F12) to see detailed logging of user creation.</p>
              <p><strong>3. Verify in Database:</strong> Check your Neon database console to see if the user appears in the User table.</p>
              <p><strong>4. Fix Clerk Webhook:</strong> If manual creation works but Clerk sign-in doesn't, the webhook needs to be configured in Clerk dashboard.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


