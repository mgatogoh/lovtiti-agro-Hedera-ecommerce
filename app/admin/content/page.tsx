'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardGuard from '@/components/DashboardGuard';
import {
  FileText,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Package,
  Truck,
  ShoppingCart,
  Stethoscope,
  Building,
  Shield,
  Flag,
  Clock,
  User
} from 'lucide-react';

function ContentModerationContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'FLAGGED' | 'SUSPENDED'>('ALL');
  const [selectedType, setSelectedType] = useState<'ALL' | 'PRODUCT' | 'SERVICE'>('ALL');

  // Mock content data - in real app, this would come from API
  const contentItems = [
    {
      id: '1',
      type: 'PRODUCT',
      title: 'Fresh Organic Tomatoes',
      description: 'Premium organic tomatoes from our certified farm',
      seller: {
        id: 'user_1',
        name: 'John Farmer',
        role: 'FARMER',
        email: 'john@example.com'
      },
      status: 'ACTIVE',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      price: 500,
      currency: 'HBAR',
      category: 'Vegetables',
      location: 'Lagos, Nigeria',
      flags: 0,
      views: 1250,
      sales: 45,
      images: ['tomato1.jpg', 'tomato2.jpg'],
      tags: ['organic', 'fresh', 'certified'],
      moderationNotes: null
    },
    {
      id: '2',
      type: 'SERVICE',
      title: 'Cold Chain Transportation Services',
      description: 'Professional cold chain transportation for perishable goods',
      seller: {
        id: 'user_2',
        name: 'Lisa Transporter',
        role: 'TRANSPORTER',
        email: 'lisa@example.com'
      },
      status: 'PENDING',
      createdAt: '2024-01-16T09:15:00Z',
      updatedAt: '2024-01-16T09:15:00Z',
      price: 15000,
      currency: 'HBAR',
      category: 'Transportation',
      location: 'Abuja, Nigeria',
      flags: 0,
      views: 0,
      sales: 0,
      images: ['truck1.jpg', 'truck2.jpg'],
      tags: ['cold-chain', 'transportation', 'perishable'],
      moderationNotes: 'Awaiting vehicle documentation verification'
    },
    {
      id: '3',
      type: 'PRODUCT',
      title: 'Premium Rice - Bulk Order',
      description: 'High-quality rice grains, perfect for cooking and processing',
      seller: {
        id: 'user_3',
        name: 'Mike Distributor',
        role: 'DISTRIBUTOR',
        email: 'mike@example.com'
      },
      status: 'FLAGGED',
      createdAt: '2024-01-14T16:20:00Z',
      updatedAt: '2024-01-17T11:30:00Z',
      price: 800,
      currency: 'HBAR',
      category: 'Grains',
      location: 'Kano, Nigeria',
      flags: 3,
      views: 890,
      sales: 12,
      images: ['rice1.jpg', 'rice2.jpg'],
      tags: ['premium', 'bulk', 'rice'],
      moderationNotes: 'Multiple user reports of quality issues. Under review.'
    },
    {
      id: '4',
      type: 'SERVICE',
      title: 'Veterinary Consultation Services',
      description: 'Professional veterinary services for livestock health and management',
      seller: {
        id: 'user_4',
        name: 'Dr. Ahmed Vet',
        role: 'AGROEXPERT',
        email: 'ahmed@example.com'
      },
      status: 'ACTIVE',
      createdAt: '2024-01-12T14:00:00Z',
      updatedAt: '2024-01-12T14:00:00Z',
      price: 8000,
      currency: 'HBAR',
      category: 'Veterinary Services',
      location: 'Ibadan, Nigeria',
      flags: 0,
      views: 650,
      sales: 8,
      images: ['vet1.jpg', 'vet2.jpg'],
      tags: ['veterinary', 'consultation', 'livestock'],
      moderationNotes: null
    },
    {
      id: '5',
      type: 'PRODUCT',
      title: 'Fresh Cocoa Beans - Export Quality',
      description: 'Premium cocoa beans for chocolate production and export',
      seller: {
        id: 'user_5',
        name: 'Sarah Buyer',
        role: 'BUYER',
        email: 'sarah@example.com'
      },
      status: 'SUSPENDED',
      createdAt: '2024-01-13T12:15:00Z',
      updatedAt: '2024-01-18T08:45:00Z',
      price: 1200,
      currency: 'HBAR',
      category: 'Spices',
      location: 'Ondo, Nigeria',
      flags: 5,
      views: 420,
      sales: 0,
      images: ['cocoa1.jpg', 'cocoa2.jpg'],
      tags: ['cocoa', 'export', 'premium'],
      moderationNotes: 'Suspended due to multiple quality complaints and misleading descriptions'
    }
  ];

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.seller.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
    const matchesType = selectedType === 'ALL' || item.type === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FLAGGED':
        return 'bg-orange-100 text-orange-800';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PRODUCT':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'SERVICE':
        return <Truck className="w-4 h-4 text-green-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'FARMER':
        return <Package className="w-4 h-4 text-green-600" />;
      case 'BUYER':
        return <ShoppingCart className="w-4 h-4 text-blue-600" />;
      case 'DISTRIBUTOR':
        return <Building className="w-4 h-4 text-purple-600" />;
      case 'TRANSPORTER':
        return <Truck className="w-4 h-4 text-orange-600" />;
      case 'AGROEXPERT':
        return <Stethoscope className="w-4 h-4 text-red-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleApprove = (itemId: string) => {
    console.log(`Approving content ${itemId}`);
    // In real app, this would make an API call
  };

  const handleSuspend = (itemId: string) => {
    console.log(`Suspending content ${itemId}`);
    // In real app, this would make an API call
  };

  const handleViewDetails = (itemId: string) => {
    console.log(`Viewing details for content ${itemId}`);
    // In real app, this would open a detailed view modal
  };

  const handleEdit = (itemId: string) => {
    console.log(`Editing content ${itemId}`);
    // In real app, this would open an edit modal
  };

  const handleDelete = (itemId: string) => {
    console.log(`Deleting content ${itemId}`);
    // In real app, this would make an API call
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
              <p className="text-gray-600 mt-1">Manage listings and content across the platform</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contentItems.length}</div>
              <p className="text-xs text-muted-foreground">
                All time listings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {contentItems.filter(c => c.status === 'ACTIVE').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Live on platform
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {contentItems.filter(c => c.status === 'PENDING').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {contentItems.filter(c => c.status === 'FLAGGED' || c.status === 'SUSPENDED').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Under review
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search by title, description, or seller name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="FLAGGED">Flagged</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="ALL">All Types</option>
                <option value="PRODUCT">Products</option>
                <option value="SERVICE">Services</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Content List */}
        <div className="space-y-6">
          {filteredContent.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    {getTypeIcon(item.type)}
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        {item.flags > 0 && (
                          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            {item.flags} flags
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Created: {new Date(item.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">Updated: {new Date(item.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Seller Information */}
                <div className="flex items-center space-x-3">
                  {getRoleIcon(item.seller.role)}
                  <div>
                    <p className="text-sm font-medium">{item.seller.name}</p>
                    <p className="text-xs text-gray-500">{item.seller.role} • {item.seller.email}</p>
                  </div>
                </div>

                {/* Content Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Pricing & Category</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Price:</span> {item.currency} {item.price.toLocaleString()}</p>
                      <p><span className="font-medium">Category:</span> {item.category}</p>
                      <p><span className="font-medium">Location:</span> {item.location}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Performance</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Views:</span> {item.views.toLocaleString()}</p>
                      <p><span className="font-medium">Sales:</span> {item.sales}</p>
                      <p><span className="font-medium">Images:</span> {item.images.length}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Moderation Notes */}
                {item.moderationNotes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Moderation Notes</h4>
                        <p className="text-sm text-yellow-700 mt-1">{item.moderationNotes}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleViewDetails(item.id)}
                    className="flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </Button>

                  <div className="flex space-x-2">
                    {item.status === 'PENDING' && (
                      <>
                        <Button
                          onClick={() => handleApprove(item.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleSuspend(item.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Suspend
                        </Button>
                      </>
                    )}
                    {item.status === 'FLAGGED' && (
                      <>
                        <Button
                          onClick={() => handleApprove(item.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Clear Flags
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleSuspend(item.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Suspend
                        </Button>
                      </>
                    )}
                    {item.status === 'SUSPENDED' && (
                      <Button
                        onClick={() => handleApprove(item.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Reactivate
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(item.id)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(item.id)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContentModerationPage() {
  return <ContentModerationContent />;
}
