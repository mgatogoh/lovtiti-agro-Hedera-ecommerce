'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import DashboardGuard from "@/components/DashboardGuard";
import {
  Stethoscope,
  Package,
  Wrench,
  MessageCircle,
  Search,
  Filter,
  Plus,
  BarChart3,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  MapPin,
  Video,
  BookOpen,
  ShoppingCart
} from "lucide-react";

function AgroVetDashboardContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agro Expert Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your products, equipment leasing, and expert services</p>
            </div>
            <div className="flex space-x-3">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
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
              <CardTitle className="text-sm font-medium">Products Listed</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">
                +5 new this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipment Leases</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                8 active, 4 completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultations</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                +15 this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-muted-foreground">
                +22% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>Manage your agricultural products and services</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input placeholder="Search products..." className="pl-10 w-64" />
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
                  {/* Sample products */}
                  {[
                    {
                      name: "High-Yield Maize Seeds",
                      type: "SEEDS",
                      price: "$25/kg",
                      stock: 150,
                      status: "Active",
                      category: "Cereals"
                    },
                    {
                      name: "Organic Pesticide Spray",
                      type: "PESTICIDES",
                      price: "$12/liter",
                      stock: 45,
                      status: "Active",
                      category: "Chemicals"
                    },
                    {
                      name: "Tractor Rental",
                      type: "EQUIPMENT",
                      price: "$50/day",
                      stock: 2,
                      status: "Leased",
                      category: "Machinery"
                    },
                    {
                      name: "Livestock Vaccines",
                      type: "VACCINES",
                      price: "$8/dose",
                      stock: 0,
                      status: "Out of Stock",
                      category: "Veterinary"
                    },
                  ].map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${product.type === 'SEEDS' ? 'bg-green-100' :
                            product.type === 'PESTICIDES' ? 'bg-red-100' :
                              product.type === 'EQUIPMENT' ? 'bg-blue-100' :
                                'bg-purple-100'
                          }`}>
                          {product.type === 'SEEDS' ? <Package className="w-6 h-6 text-green-600" /> :
                            product.type === 'PESTICIDES' ? <Package className="w-6 h-6 text-red-600" /> :
                              product.type === 'EQUIPMENT' ? <Wrench className="w-6 h-6 text-blue-600" /> :
                                <Stethoscope className="w-6 h-6 text-purple-600" />}
                        </div>
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{product.type}</span>
                            <span>•</span>
                            <span>{product.category}</span>
                            <span>•</span>
                            <span>{product.stock} units</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">{product.price}</p>
                          <p className="text-sm text-gray-500">{product.stock} in stock</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${product.status === 'Active' ? 'bg-green-100 text-green-800' :
                              product.status === 'Leased' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                            {product.status}
                          </span>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Equipment Leasing & Consultations */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Equipment Leasing</CardTitle>
                <CardDescription>Manage your equipment rental services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      equipment: "John Deere Tractor",
                      client: "Green Valley Farm",
                      rate: "$50/day",
                      status: "Active",
                      duration: "5 days"
                    },
                    {
                      equipment: "Irrigation System",
                      client: "Sunrise Agriculture",
                      rate: "$30/day",
                      status: "Completed",
                      duration: "3 days"
                    },
                    {
                      equipment: "Harvesting Machine",
                      client: "Crop Masters Ltd",
                      rate: "$75/day",
                      status: "Scheduled",
                      duration: "7 days"
                    },
                  ].map((lease, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{lease.equipment}</h4>
                        <p className="text-sm text-gray-500">{lease.client}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-500">{lease.rate}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-500">{lease.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${lease.status === 'Active' ? 'bg-green-100 text-green-800' :
                            lease.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                          }`}>
                          {lease.status}
                        </span>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Expert Consultations */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Expert Consultations</CardTitle>
                <CardDescription>Manage your consultation services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      client: "Farm Fresh Co",
                      type: "Crop Management",
                      status: "Scheduled",
                      time: "2:00 PM",
                      method: "Video Call"
                    },
                    {
                      client: "Rural Farmers Group",
                      type: "Pest Control",
                      status: "Completed",
                      time: "10:00 AM",
                      method: "On-site"
                    },
                    {
                      client: "Organic Growers",
                      type: "Soil Health",
                      status: "In Progress",
                      time: "4:00 PM",
                      method: "Phone Call"
                    },
                  ].map((consultation, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{consultation.client}</p>
                        <p className="text-sm text-gray-500">{consultation.type}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-500">{consultation.time}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-500">{consultation.method}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${consultation.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            consultation.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                          }`}>
                          {consultation.status}
                        </span>
                        {consultation.method === 'Video Call' && (
                          <Video className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Product
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Wrench className="w-4 h-4 mr-2" />
                    List Equipment
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Video className="w-4 h-4 mr-2" />
                    Schedule Consultation
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Share Expert Advice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Expert Advice & Knowledge Sharing */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Expert Advice & Knowledge Sharing</CardTitle>
            <CardDescription>Share your agricultural expertise with the community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Published Articles</h3>
                <p className="text-sm text-gray-600">12 articles on crop management, pest control, and soil health</p>
                <Button className="mt-3" size="sm">View Articles</Button>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Video Consultations</h3>
                <p className="text-sm text-gray-600">89 successful video consultations this month</p>
                <Button className="mt-3" size="sm" variant="outline">Schedule Call</Button>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Expert Rating</h3>
                <p className="text-sm text-gray-600">4.9/5 average rating from 156 clients</p>
                <Button className="mt-3" size="sm" variant="outline">View Reviews</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest business activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "New product listed",
                  item: "High-Yield Maize Seeds",
                  time: "2 hours ago",
                  type: "product"
                },
                {
                  action: "Equipment lease completed",
                  item: "Tractor rental to Green Valley Farm",
                  time: "4 hours ago",
                  type: "lease"
                },
                {
                  action: "Consultation completed",
                  item: "Crop management advice for Farm Fresh Co",
                  time: "6 hours ago",
                  type: "consultation"
                },
                {
                  action: "New client registered",
                  item: "Sunrise Agriculture joined your network",
                  time: "1 day ago",
                  type: "client"
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'product' ? 'bg-green-100' :
                      activity.type === 'lease' ? 'bg-blue-100' :
                        activity.type === 'consultation' ? 'bg-purple-100' :
                          'bg-yellow-100'
                    }`}>
                    {activity.type === 'product' ? <Package className="w-4 h-4 text-green-600" /> :
                      activity.type === 'lease' ? <Wrench className="w-4 h-4 text-blue-600" /> :
                        activity.type === 'consultation' ? <MessageCircle className="w-4 h-4 text-purple-600" /> :
                          <Users className="w-4 h-4 text-yellow-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.item}</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AgroVetDashboard() {
  return (
    // <DashboardGuard
    //   allowedRoles={['AGROEXPERT', 'ADMIN']}
    //   dashboardName="Agro Expert Dashboard"
    //   dashboardDescription="Manage your products, equipment leasing, and expert services"
    // >
    <AgroVetDashboardContent />
    // </DashboardGuard>
  );
}
