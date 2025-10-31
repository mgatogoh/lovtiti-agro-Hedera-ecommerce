'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CreateMyAccountPage() {
  const [formData, setFormData] = useState({
    email: '',
    role: 'BUYER'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createAccount = async () => {
    if (!formData.email) {
      alert('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/create-user', {
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
        setFormData({ email: '', role: 'BUYER' });
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

  const fillWithGoogleEmail = () => {
    // You can replace this with your actual Google email
    setFormData(prev => ({
      ...prev,
      email: 'your-email@gmail.com'
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Account</h1>
          <p className="text-gray-600 mt-2">
            Since the Clerk webhook isn't configured yet, you can manually create your account in the database.
          </p>
        </div>

        {/* Account Creation Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Enter your Google email and select your role to create your account in the database.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address (from Google)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your-email@gmail.com"
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="BUYER">Buyer - Purchase agricultural products</option>
                <option value="FARMER">Farmer - Sell agricultural products</option>
                <option value="DISTRIBUTOR">Distributor - Distribute products</option>
                <option value="TRANSPORTER">Transporter - Transport goods</option>
                <option value="AGROEXPERT">Agro Expert - Provide agricultural expertise and services</option>
                <option value="ADMIN">Admin - Platform management</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={createAccount}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 flex-1"
              >
                {isLoading ? 'Creating Account...' : 'Create My Account'}
              </Button>
              <Button onClick={fillWithGoogleEmail} variant="outline">
                Use My Google Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result Display */}
        {result && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className={result.success ? 'text-green-600' : 'text-red-600'}>
                {result.success ? '✅ Account Created Successfully!' : '❌ Error'}
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
                  <div className="text-green-800 text-sm">
                    <p><strong>User ID:</strong> {result.data.id}</p>
                    <p><strong>Email:</strong> {result.data.email}</p>
                    <p><strong>Role:</strong> {result.data.role}</p>
                    <p><strong>Created:</strong> {new Date(result.data.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Success Instructions */}
        {result?.success && (
          <Card className="mb-8 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-green-700">
                <p><strong>✅ Your account has been created in the database!</strong></p>
                <p>1. You can now sign in with your Google account</p>
                <p>2. Your user data will be logged in the console</p>
                <p>3. You can access your role-specific dashboard</p>
                <p>4. All your activities will be tracked and logged</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Why This is Needed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>The Issue:</strong> When you sign in with Google, Clerk should automatically create a user in the database via webhook, but the webhook isn't configured yet.</p>
              <p><strong>The Solution:</strong> This page manually creates your user account in the database so you can use the platform.</p>
              <p><strong>Permanent Fix:</strong> Configure the Clerk webhook in your Clerk dashboard (see CLERK_WEBHOOK_SETUP.md)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


