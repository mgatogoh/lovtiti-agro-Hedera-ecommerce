'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import DashboardGuard from "@/components/DashboardGuard";
import { 
  Package, 
  TrendingUp, 
  Users, 
  MapPin, 
  Search, 
  Filter, 
  Plus,
  BarChart3,
  Truck,
  ShoppingCart,
  Star,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

function DistributorDashboardContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Distributor Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your inventory, suppliers, and distribution network</p>
            </div>
            <div className="flex space-x-3">
              <Button className="bg-blue-600 hover:bg-blue-700">
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
              <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                +8 new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,230</div>
              <p className="text-xs text-muted-foreground">
                +18% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders Fulfilled</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                98.5% success rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inventory Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Inventory Management</CardTitle>
                    <CardDescription>Manage your product inventory and stock levels</CardDescription>
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
                  {/* Sample inventory items */}
                  {[
                    { name: "Premium Maize Seeds", category: "Seeds", stock: 150, price: "$25/kg", status: "In Stock" },
                    { name: "Organic Fertilizer", category: "Fertilizers", stock: 45, price: "$15/kg", status: "Low Stock" },
                    { name: "Pesticide Spray", category: "Chemicals", stock: 200, price: "$8/liter", status: "In Stock" },
                    { name: "Irrigation Pipes", category: "Equipment", stock: 0, price: "$12/meter", status: "Out of Stock" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="font-medium">{item.stock} units</p>
                          <p className="text-sm text-gray-500">{item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                            item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.status}
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

          {/* Supplier Connections */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Supplier Network</CardTitle>
                <CardDescription>Manage your supplier relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Green Valley Farms", location: "Lagos, Nigeria", rating: 4.8, orders: 45, status: "Active" },
                    { name: "Agro Solutions Ltd", location: "Abuja, Nigeria", rating: 4.6, orders: 32, status: "Active" },
                    { name: "Farm Fresh Co", location: "Kano, Nigeria", rating: 4.9, orders: 28, status: "Active" },
                    { name: "Rural Farmers Coop", location: "Ibadan, Nigeria", rating: 4.4, orders: 15, status: "Pending" },
                  ].map((supplier, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{supplier.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{supplier.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-sm ml-1">{supplier.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">• {supplier.orders} orders</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          supplier.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {supplier.status}
                        </span>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest order activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: "ORD-001", customer: "Fresh Market Co", amount: "$2,450", status: "Shipped", time: "2 hours ago" },
                    { id: "ORD-002", customer: "Urban Grocers", amount: "$1,890", status: "Processing", time: "4 hours ago" },
                    { id: "ORD-003", customer: "Farm to Table", amount: "$3,200", status: "Delivered", time: "1 day ago" },
                  ].map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-gray-500">{order.customer}</p>
                        <p className="text-sm text-gray-400">{order.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.amount}</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Market Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
            <CardDescription>Trends and analytics for your distribution business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Top Performing Products</h3>
                <p className="text-sm text-gray-600">Maize seeds and organic fertilizers are your best sellers this month</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Geographic Expansion</h3>
                <p className="text-sm text-gray-600">Consider expanding to Northern regions where demand is growing</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="font-semibold mb-2">Inventory Alerts</h3>
                <p className="text-sm text-gray-600">3 products are running low and need restocking</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DistributorDashboard() {
  return (
    // <DashboardGuard
    //   allowedRoles={['DISTRIBUTOR', 'ADMIN']}
    //   dashboardName="Distributor Dashboard"
    //   dashboardDescription="Manage your inventory, suppliers, and distribution network"
    // >
      <DistributorDashboardContent />
    // </DashboardGuard>
  );
}
