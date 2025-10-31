'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardGuard from '@/components/DashboardGuard';
import {
  UserCheck,
  FileText,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  AlertTriangle,
  Shield,
  Building,
  Truck,
  Stethoscope,
  ShoppingCart,
  Package
} from 'lucide-react';

function KycVerificationContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'ALL' | 'FARMER' | 'BUYER' | 'DISTRIBUTOR' | 'TRANSPORTER' | 'AGROEXPERT'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  // Mock KYC data - in real app, this would come from API
  const kycSubmissions = [
    {
      id: '1',
      userId: 'user_1',
      name: 'John Farmer',
      email: 'john@example.com',
      role: 'FARMER',
      status: 'PENDING',
      submittedAt: '2024-01-15T10:30:00Z',
      documents: {
        id: 'verified',
        businessLicense: 'pending',
        landOwnership: 'verified',
        farmingCertification: 'pending'
      },
      location: 'Lagos, Nigeria',
      phone: '+234 801 234 5678',
      businessName: 'Green Fields Farm',
      yearsExperience: 5,
      specializations: ['Vegetables', 'Grains'],
      additionalInfo: 'Smallholder farmer with 5 hectares of land'
    },
    {
      id: '2',
      userId: 'user_2',
      name: 'Sarah Buyer',
      email: 'sarah@example.com',
      role: 'BUYER',
      status: 'APPROVED',
      submittedAt: '2024-01-14T14:20:00Z',
      documents: {
        id: 'verified',
        businessRegistration: 'verified',
        taxCertificate: 'verified',
        bankStatement: 'verified'
      },
      location: 'Abuja, Nigeria',
      phone: '+234 802 345 6789',
      businessName: 'Fresh Market Co.',
      yearsExperience: 3,
      specializations: ['Retail', 'Restaurant Supply'],
      additionalInfo: 'Restaurant chain owner purchasing fresh produce'
    },
    {
      id: '3',
      userId: 'user_3',
      name: 'Mike Distributor',
      email: 'mike@example.com',
      role: 'DISTRIBUTOR',
      status: 'PENDING',
      submittedAt: '2024-01-16T09:15:00Z',
      documents: {
        id: 'verified',
        businessLicense: 'verified',
        warehouseCertification: 'pending',
        distributionNetwork: 'pending'
      },
      location: 'Kano, Nigeria',
      phone: '+234 803 456 7890',
      businessName: 'Agro Distribution Ltd',
      yearsExperience: 8,
      specializations: ['Bulk Distribution', 'Cold Chain'],
      additionalInfo: 'Established distributor with 3 warehouses across Northern Nigeria'
    },
    {
      id: '4',
      userId: 'user_4',
      name: 'Lisa Transporter',
      email: 'lisa@example.com',
      role: 'TRANSPORTER',
      status: 'REJECTED',
      submittedAt: '2024-01-13T16:45:00Z',
      documents: {
        id: 'verified',
        vehicleRegistration: 'verified',
        driverLicense: 'rejected',
        insuranceCoverage: 'pending'
      },
      location: 'Port Harcourt, Nigeria',
      phone: '+234 804 567 8901',
      businessName: 'Swift Logistics',
      yearsExperience: 2,
      specializations: ['Cold Chain Transport', 'Express Delivery'],
      additionalInfo: 'Transportation company with 5 vehicles',
      rejectionReason: 'Driver license expired. Please provide valid license.'
    },
    {
      id: '5',
      userId: 'user_5',
      name: 'Dr. Ahmed Vet',
      email: 'ahmed@example.com',
      role: 'AGROEXPERT',
      status: 'PENDING',
      submittedAt: '2024-01-17T11:30:00Z',
      documents: {
        id: 'verified',
        professionalLicense: 'verified',
        veterinaryCertification: 'pending',
        practicePermit: 'pending'
      },
      location: 'Ibadan, Nigeria',
      phone: '+234 805 678 9012',
      businessName: 'AgroVet Services',
      yearsExperience: 12,
      specializations: ['Livestock Health', 'Equipment Leasing', 'Expert Consultation'],
      additionalInfo: 'Licensed AGROEXPERT with 12 years experience in livestock health'
    }
  ];

  const filteredSubmissions = kycSubmissions.filter(submission => {
    const matchesSearch = submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'ALL' || submission.role === selectedRole;
    const matchesStatus = selectedStatus === 'ALL' || submission.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

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
        return <Shield className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleApprove = (submissionId: string) => {
    console.log(`Approving KYC submission ${submissionId}`);
    // In real app, this would make an API call
  };

  const handleReject = (submissionId: string) => {
    console.log(`Rejecting KYC submission ${submissionId}`);
    // In real app, this would make an API call
  };

  const handleViewDocuments = (submissionId: string) => {
    console.log(`Viewing documents for submission ${submissionId}`);
    // In real app, this would open a modal or navigate to document viewer
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">KYC Verification</h1>
              <p className="text-gray-600 mt-1">Review and verify user KYC submissions</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Data
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
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kycSubmissions.length}</div>
              <p className="text-xs text-muted-foreground">
                All time submissions
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
                {kycSubmissions.filter(s => s.status === 'PENDING').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting verification
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {kycSubmissions.filter(s => s.status === 'APPROVED').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Verified users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {kycSubmissions.filter(s => s.status === 'REJECTED').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Failed verification
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or business name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="ALL">All Roles</option>
                <option value="FARMER">Farmers</option>
                <option value="BUYER">Buyers</option>
                <option value="DISTRIBUTOR">Distributors</option>
                <option value="TRANSPORTER">Transporters</option>
                <option value="AGROEXPERT">Agro Experts</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* KYC Submissions */}
        <div className="space-y-6">
          {filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-gray-600">
                        {submission.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{submission.name}</h3>
                      <p className="text-sm text-gray-500">{submission.email}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        {getRoleIcon(submission.role)}
                        <span className="text-sm font-medium">{submission.role}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(submission.status)}`}>
                          {submission.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">{submission.location}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Business Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Business Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Business Name:</span> {submission.businessName}</p>
                      <p><span className="font-medium">Experience:</span> {submission.yearsExperience} years</p>
                      <p><span className="font-medium">Phone:</span> {submission.phone}</p>
                      <p><span className="font-medium">Specializations:</span> {submission.specializations.join(', ')}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
                    <p className="text-sm text-gray-600">{submission.additionalInfo}</p>
                  </div>
                </div>

                {/* Document Status */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Document Verification Status</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(submission.documents).map(([docType, status]) => (
                      <div key={docType} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${status === 'verified' ? 'bg-green-500' :
                            status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                        <span className="text-sm capitalize">{docType.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className={`text-xs ${getDocumentStatusColor(status)}`}>
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rejection Reason */}
                {submission.status === 'REJECTED' && submission.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-red-800">Rejection Reason</h4>
                        <p className="text-sm text-red-700 mt-1">{submission.rejectionReason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleViewDocuments(submission.id)}
                    className="flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Documents</span>
                  </Button>

                  <div className="flex space-x-2">
                    {submission.status === 'PENDING' && (
                      <>
                        <Button
                          onClick={() => handleApprove(submission.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReject(submission.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    {submission.status === 'REJECTED' && (
                      <Button
                        onClick={() => handleApprove(submission.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Re-approve
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No KYC submissions found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminKycPage() {
  return <KycVerificationContent />;
}
