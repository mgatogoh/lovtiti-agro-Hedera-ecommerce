'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DashboardGuard from '@/components/DashboardGuard';
import {
  Shield,
  Users,
  Search,
  Filter,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Settings
} from 'lucide-react';
import { UserRole, getRoleDisplayName, getRoleDescription, getRoleColor, getRoleIcon } from '@/utils/roleManager';

function RoleManagementContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('FARMER');

  // Mock data - in real app, this would come from API
  const users = [
    {
      id: '1',
      name: 'John Farmer',
      email: 'john@example.com',
      role: 'FARMER' as UserRole,
      status: 'active',
      joinedAt: '2024-01-15',
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Sarah Buyer',
      email: 'sarah@example.com',
      role: 'BUYER' as UserRole,
      status: 'active',
      joinedAt: '2024-01-20',
      lastActive: '1 hour ago'
    },
    {
      id: '3',
      name: 'Mike Distributor',
      email: 'mike@example.com',
      role: 'DISTRIBUTOR' as UserRole,
      status: 'active',
      joinedAt: '2024-01-18',
      lastActive: '30 minutes ago'
    },
    {
      id: '4',
      name: 'Lisa Transporter',
      email: 'lisa@example.com',
      role: 'TRANSPORTER' as UserRole,
      status: 'active',
      joinedAt: '2024-01-22',
      lastActive: '5 minutes ago'
    },
    {
      id: '5',
      name: 'Dr. Ahmed Vet',
      email: 'ahmed@example.com',
      role: 'AGROEXPERT' as UserRole,
      status: 'active',
      joinedAt: '2024-01-25',
      lastActive: '1 day ago'
    },
  ];

  const roles: UserRole[] = ['FARMER', 'BUYER', 'DISTRIBUTOR', 'TRANSPORTER', 'AGROEXPERT', 'ADMIN'];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    // In real app, this would make an API call
    console.log(`Changing user ${userId} role to ${newRole}`);
    setEditingUser(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
              <p className="text-gray-600 mt-1">Manage user roles and permissions across the platform</p>
            </div>
            <div className="flex space-x-3">
              <Button className="bg-green-600 hover:bg-green-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</div>
              <p className="text-xs text-muted-foreground">
                95% of total users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Farmers</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter(u => u.role === 'FARMER').length}</div>
              <p className="text-xs text-muted-foreground">
                Primary producers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Buyers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter(u => u.role === 'BUYER').length}</div>
              <p className="text-xs text-muted-foreground">
                Product purchasers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user roles and permissions</CardDescription>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const roleColors = getRoleColor(user.role);
                return (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-gray-600">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${roleColors.bg} ${roleColors.text}`}>
                            {getRoleDisplayName(user.role)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Joined: {user.joinedAt}</p>
                        <p className="text-sm text-gray-500">Last active: {user.lastActive}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {editingUser === user.id ? (
                          <div className="flex items-center space-x-2">
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value as UserRole)}
                              className="px-3 py-1 border rounded-md text-sm"
                            >
                              {roles.map((role) => (
                                <option key={role} value={role}>
                                  {getRoleDisplayName(role)}
                                </option>
                              ))}
                            </select>
                            <Button
                              size="sm"
                              onClick={() => handleRoleChange(user.id, newRole)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingUser(null)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingUser(user.id);
                              setNewRole(user.role);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Role
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Role Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Role Overview</CardTitle>
            <CardDescription>Understanding different user roles and their permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => {
                const roleColors = getRoleColor(role);
                const roleUsers = users.filter(u => u.role === role).length;
                return (
                  <div key={role} className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg ${roleColors.bg} flex items-center justify-center`}>
                        <Shield className={`w-5 h-5 ${roleColors.text}`} />
                      </div>
                      <div>
                        <h3 className="font-medium">{getRoleDisplayName(role)}</h3>
                        <p className="text-sm text-gray-500">{roleUsers} users</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {getRoleDescription(role)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Permissions</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {role === 'ADMIN' && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RoleManagement() {
  return (
    <DashboardGuard
      allowedRoles={['ADMIN']}
      dashboardName="Role Management"
      dashboardDescription="Manage user roles and permissions across the platform"
    >
      <RoleManagementContent />
    </DashboardGuard>
  );
}
