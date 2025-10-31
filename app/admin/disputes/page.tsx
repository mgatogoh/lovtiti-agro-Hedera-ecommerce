'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardGuard from '@/components/DashboardGuard';
import {
  AlertTriangle,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MessageSquare,
  DollarSign,
  Package,
  Truck,
  User,
  Calendar,
  FileText,
  Scale,
  Gavel
} from 'lucide-react';

function DisputeManagementContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<'ALL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('ALL');

  // Mock dispute data - in real app, this would come from API
  const disputes = [
    {
      id: '1',
      orderId: 'ORD-2024-001',
      disputeType: 'QUALITY_ISSUE',
      priority: 'HIGH',
      status: 'OPEN',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      complainant: {
        id: 'user_1',
        name: 'Sarah Buyer',
        role: 'BUYER',
        email: 'sarah@example.com'
      },
      respondent: {
        id: 'user_2',
        name: 'John Farmer',
        role: 'FARMER',
        email: 'john@example.com'
      },
      orderDetails: {
        product: 'Fresh Organic Tomatoes',
        quantity: 50,
        unit: 'kg',
        price: 25000,
        currency: 'HBAR',
        orderDate: '2024-01-10T08:00:00Z',
        deliveryDate: '2024-01-12T15:30:00Z'
      },
      issue: {
        title: 'Product Quality Below Standard',
        description: 'The tomatoes delivered were not fresh and many were bruised. The quality does not match the description in the listing.',
        evidence: ['photo_1.jpg', 'photo_2.jpg', 'receipt.pdf'],
        requestedResolution: 'REFUND',
        requestedAmount: 25000
      },
      resolution: {
        status: 'PENDING',
        proposedSolution: null,
        adminNotes: null,
        finalDecision: null
      },
      messages: [
        {
          id: 'msg_1',
          sender: 'Sarah Buyer',
          senderRole: 'BUYER',
          content: 'I received the tomatoes but they are not fresh as described. Many are bruised and some are already spoiled.',
          timestamp: '2024-01-15T10:30:00Z',
          attachments: ['photo_1.jpg']
        },
        {
          id: 'msg_2',
          sender: 'John Farmer',
          senderRole: 'FARMER',
          content: 'I apologize for the quality issue. The tomatoes were fresh when shipped. This might be due to transportation delays.',
          timestamp: '2024-01-15T11:45:00Z'
        }
      ]
    },
    {
      id: '2',
      orderId: 'ORD-2024-002',
      disputeType: 'PAYMENT_ISSUE',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      createdAt: '2024-01-14T16:20:00Z',
      updatedAt: '2024-01-16T09:15:00Z',
      complainant: {
        id: 'user_3',
        name: 'Mike Distributor',
        role: 'DISTRIBUTOR',
        email: 'mike@example.com'
      },
      respondent: {
        id: 'user_4',
        name: 'Lisa Transporter',
        role: 'TRANSPORTER',
        email: 'lisa@example.com'
      },
      orderDetails: {
        product: 'Transportation Services',
        quantity: 1,
        unit: 'trip',
        price: 15000,
        currency: 'HBAR',
        orderDate: '2024-01-12T10:00:00Z',
        deliveryDate: '2024-01-13T14:00:00Z'
      },
      issue: {
        title: 'Late Delivery and Additional Charges',
        description: 'The delivery was 2 hours late and the transporter is demanding additional charges not agreed upon.',
        evidence: ['contract.pdf', 'delivery_receipt.pdf'],
        requestedResolution: 'PARTIAL_REFUND',
        requestedAmount: 5000
      },
      resolution: {
        status: 'IN_PROGRESS',
        proposedSolution: 'Partial refund of ℏ3,000 for the delay',
        adminNotes: 'Reviewing transportation contract terms',
        finalDecision: null
      },
      messages: [
        {
          id: 'msg_3',
          sender: 'Mike Distributor',
          senderRole: 'DISTRIBUTOR',
          content: 'The delivery was late and the transporter is asking for extra money not in our agreement.',
          timestamp: '2024-01-14T16:20:00Z',
          attachments: ['contract.pdf']
        },
        {
          id: 'msg_4',
          sender: 'Lisa Transporter',
          senderRole: 'TRANSPORTER',
          content: 'There was heavy traffic and additional fuel costs. The extra charges are reasonable.',
          timestamp: '2024-01-15T08:30:00Z'
        }
      ]
    },
    {
      id: '3',
      orderId: 'ORD-2024-003',
      disputeType: 'SERVICE_ISSUE',
      priority: 'LOW',
      status: 'RESOLVED',
      createdAt: '2024-01-13T12:15:00Z',
      updatedAt: '2024-01-16T11:00:00Z',
      complainant: {
        id: 'user_5',
        name: 'Dr. Ahmed Vet',
        role: 'AGROEXPERT',
        email: 'ahmed@example.com'
      },
      respondent: {
        id: 'user_6',
        name: 'Green Fields Farm',
        role: 'FARMER',
        email: 'greenfields@example.com'
      },
      orderDetails: {
        product: 'Veterinary Consultation',
        quantity: 1,
        unit: 'session',
        price: 8000,
        currency: 'HBAR',
        orderDate: '2024-01-10T14:00:00Z',
        deliveryDate: '2024-01-11T10:00:00Z'
      },
      issue: {
        title: 'Consultation Not Provided',
        description: 'The AGROEXPERT consultation was scheduled but the farmer was not available at the agreed time.',
        evidence: ['appointment_confirmation.pdf'],
        requestedResolution: 'RESCHEDULE',
        requestedAmount: 0
      },
      resolution: {
        status: 'RESOLVED',
        proposedSolution: 'Rescheduled consultation for next week',
        adminNotes: 'Both parties agreed to reschedule',
        finalDecision: 'RESCHEDULED'
      },
      messages: [
        {
          id: 'msg_5',
          sender: 'Dr. Ahmed Vet',
          senderRole: 'AGROEXPERT',
          content: 'I arrived at the scheduled time but the farmer was not available.',
          timestamp: '2024-01-13T12:15:00Z',
          attachments: ['appointment_confirmation.pdf']
        },
        {
          id: 'msg_6',
          sender: 'Green Fields Farm',
          senderRole: 'FARMER',
          content: 'I apologize for the confusion. I had an emergency. Can we reschedule?',
          timestamp: '2024-01-13T15:30:00Z'
        }
      ]
    }
  ];

  const filteredDisputes = disputes.filter(dispute => {
    const matchesSearch = dispute.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.complainant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.respondent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.issue.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || dispute.status === selectedStatus;
    const matchesPriority = selectedPriority === 'ALL' || dispute.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDisputeTypeIcon = (type: string) => {
    switch (type) {
      case 'QUALITY_ISSUE':
        return <Package className="w-4 h-4 text-red-600" />;
      case 'PAYMENT_ISSUE':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'SERVICE_ISSUE':
        return <Truck className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleResolve = (disputeId: string) => {
    console.log(`Resolving dispute ${disputeId}`);
    // In real app, this would open a resolution modal
  };

  const handleViewDetails = (disputeId: string) => {
    console.log(`Viewing details for dispute ${disputeId}`);
    // In real app, this would open a detailed view modal
  };

  const handleAssign = (disputeId: string) => {
    console.log(`Assigning dispute ${disputeId}`);
    // In real app, this would open an assignment modal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dispute Management</h1>
              <p className="text-gray-600 mt-1">Manage order disputes and resolutions</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Export Reports
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
              <CardTitle className="text-sm font-medium">Total Disputes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{disputes.length}</div>
              <p className="text-xs text-muted-foreground">
                All time disputes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Disputes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {disputes.filter(d => d.status === 'OPEN').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting resolution
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {disputes.filter(d => d.status === 'IN_PROGRESS').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Being resolved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {disputes.filter(d => d.status === 'RESOLVED').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully resolved
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search by order ID, user name, or issue title..."
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
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="ALL">All Priority</option>
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Disputes List */}
        <div className="space-y-6">
          {filteredDisputes.map((dispute) => (
            <Card key={dispute.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    {getDisputeTypeIcon(dispute.disputeType)}
                    <div>
                      <h3 className="text-lg font-semibold">{dispute.orderId}</h3>
                      <p className="text-sm text-gray-500">{dispute.issue.title}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(dispute.priority)}`}>
                          {dispute.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(dispute.status)}`}>
                          {dispute.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Created: {new Date(dispute.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">Updated: {new Date(dispute.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Parties Involved */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Complainant</h4>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{dispute.complainant.name}</p>
                        <p className="text-xs text-gray-500">{dispute.complainant.role} • {dispute.complainant.email}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Respondent</h4>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{dispute.respondent.name}</p>
                        <p className="text-xs text-gray-500">{dispute.respondent.role} • {dispute.respondent.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p><span className="font-medium">Product:</span> {dispute.orderDetails.product}</p>
                      <p><span className="font-medium">Quantity:</span> {dispute.orderDetails.quantity} {dispute.orderDetails.unit}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Price:</span> {dispute.orderDetails.currency} {dispute.orderDetails.price.toLocaleString()}</p>
                      <p><span className="font-medium">Order Date:</span> {new Date(dispute.orderDetails.orderDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Delivery Date:</span> {new Date(dispute.orderDetails.deliveryDate).toLocaleDateString()}</p>
                      <p><span className="font-medium">Requested Amount:</span> {dispute.orderDetails.currency} {dispute.issue.requestedAmount?.toLocaleString() || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Issue Description */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Issue Description</h4>
                  <p className="text-sm text-gray-600 mb-2">{dispute.issue.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span><span className="font-medium">Resolution Requested:</span> {dispute.issue.requestedResolution}</span>
                    <span><span className="font-medium">Evidence:</span> {dispute.issue.evidence.length} files</span>
                  </div>
                </div>

                {/* Resolution Status */}
                {dispute.resolution.status !== 'PENDING' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Resolution Status</h4>
                    <p className="text-sm text-blue-800 mb-2">{dispute.resolution.proposedSolution}</p>
                    {dispute.resolution.adminNotes && (
                      <p className="text-sm text-blue-700"><span className="font-medium">Admin Notes:</span> {dispute.resolution.adminNotes}</p>
                    )}
                  </div>
                )}

                {/* Recent Messages */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recent Messages ({dispute.messages.length})</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {dispute.messages.slice(-2).map((message) => (
                      <div key={message.id} className="text-sm p-2 bg-gray-50 rounded">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{message.sender}</span>
                          <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-600 mt-1">{message.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleViewDetails(dispute.id)}
                    className="flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </Button>

                  <div className="flex space-x-2">
                    {dispute.status === 'OPEN' && (
                      <>
                        <Button
                          onClick={() => handleAssign(dispute.id)}
                          variant="outline"
                        >
                          <Scale className="w-4 h-4 mr-2" />
                          Assign
                        </Button>
                        <Button
                          onClick={() => handleResolve(dispute.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Gavel className="w-4 h-4 mr-2" />
                          Resolve
                        </Button>
                      </>
                    )}
                    {dispute.status === 'IN_PROGRESS' && (
                      <Button
                        onClick={() => handleResolve(dispute.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Gavel className="w-4 h-4 mr-2" />
                        Finalize Resolution
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDisputes.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No disputes found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDisputesPage() {
  return <DisputeManagementContent />;
}
