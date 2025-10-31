'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import DashboardGuard from "@/components/DashboardGuard";
import { 
  Truck, 
  MapPin, 
  Clock, 
  Package, 
  Search, 
  Filter, 
  Plus,
  BarChart3,
  Navigation,
  Fuel,
  CheckCircle,
  AlertCircle,
  Route,
  Users,
  TrendingUp
} from "lucide-react";

function TransporterDashboardContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transporter Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your routes, cargo, and delivery operations</p>
            </div>
            <div className="flex space-x-3">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                New Route
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
              <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +3 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">
                95% on-time delivery
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
              <Route className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247 km</div>
              <p className="text-xs text-muted-foreground">
                +12% efficiency
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
              <Fuel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.2 L/100km</div>
              <p className="text-xs text-muted-foreground">
                -5% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Deliveries */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Active Deliveries</CardTitle>
                    <CardDescription>Track your current delivery routes and cargo</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input placeholder="Search deliveries..." className="pl-10 w-64" />
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
                  {/* Sample delivery items */}
                  {[
                    { 
                      id: "DEL-001", 
                      cargo: "Fresh Tomatoes", 
                      from: "Lagos Farm", 
                      to: "Abuja Market", 
                      distance: "450 km", 
                      status: "In Transit",
                      eta: "2 hours",
                      driver: "John Doe"
                    },
                    { 
                      id: "DEL-002", 
                      cargo: "Maize Seeds", 
                      from: "Ibadan Warehouse", 
                      to: "Kano Distribution", 
                      distance: "320 km", 
                      status: "Loading",
                      eta: "30 minutes",
                      driver: "Sarah Johnson"
                    },
                    { 
                      id: "DEL-003", 
                      cargo: "Organic Fertilizer", 
                      from: "Port Harcourt", 
                      to: "Enugu Farm", 
                      distance: "180 km", 
                      status: "Delivered",
                      eta: "Completed",
                      driver: "Mike Wilson"
                    },
                    { 
                      id: "DEL-004", 
                      cargo: "Livestock Feed", 
                      from: "Kaduna Mill", 
                      to: "Jos Ranch", 
                      distance: "95 km", 
                      status: "Scheduled",
                      eta: "4 hours",
                      driver: "Ahmed Hassan"
                    },
                  ].map((delivery, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Truck className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{delivery.id} - {delivery.cargo}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {delivery.from} → {delivery.to}
                            </div>
                            <div className="flex items-center">
                              <Route className="w-3 h-3 mr-1" />
                              {delivery.distance}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {delivery.driver}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">{delivery.eta}</p>
                          <p className="text-sm text-gray-500">ETA</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            delivery.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            delivery.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                            delivery.status === 'Loading' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {delivery.status}
                          </span>
                          <Button variant="outline" size="sm">Track</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Route Optimization & Fleet */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Route Optimization</CardTitle>
                <CardDescription>AI-powered route suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Navigation className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Optimized Route</span>
                    </div>
                    <p className="text-sm text-blue-700">Lagos → Ibadan → Abuja</p>
                    <p className="text-xs text-blue-600 mt-1">Saves 45 minutes and 12L fuel</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-900">Efficiency Score</span>
                    </div>
                    <p className="text-sm text-green-700">92% - Excellent</p>
                    <p className="text-xs text-green-600 mt-1">Above average performance</p>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-900">Traffic Alert</span>
                    </div>
                    <p className="text-sm text-yellow-700">Lagos-Ibadan Expressway</p>
                    <p className="text-xs text-yellow-600 mt-1">Heavy traffic expected</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fleet Management */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Fleet Status</CardTitle>
                <CardDescription>Your vehicle fleet overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { vehicle: "Truck-001", type: "Heavy Duty", status: "Active", location: "Lagos", fuel: "85%" },
                    { vehicle: "Truck-002", type: "Medium", status: "Maintenance", location: "Garage", fuel: "0%" },
                    { vehicle: "Van-003", type: "Light", status: "Active", location: "Abuja", fuel: "60%" },
                    { vehicle: "Truck-004", type: "Heavy Duty", status: "Active", location: "Kano", fuel: "90%" },
                  ].map((vehicle, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{vehicle.vehicle}</p>
                        <p className="text-sm text-gray-500">{vehicle.type}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-500">{vehicle.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          vehicle.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {vehicle.status}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">Fuel: {vehicle.fuel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>This month's performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">On-time Delivery</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fuel Efficiency</span>
                    <span className="font-medium">8.2 L/100km</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Customer Rating</span>
                    <span className="font-medium">4.8/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                <Plus className="w-6 h-6" />
                <span>New Delivery</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Navigation className="w-6 h-6" />
                <span>Plan Route</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Truck className="w-6 h-6" />
                <span>Fleet Status</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <BarChart3 className="w-6 h-6" />
                <span>Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function TransporterDashboard() {
  return (
    // <DashboardGuard
    //   allowedRoles={['TRANSPORTER', 'ADMIN']}
    //   dashboardName="Transporter Dashboard"
    //   dashboardDescription="Manage your routes, cargo, and delivery operations"
    // >
      <TransporterDashboardContent />
    // </DashboardGuard>
  );
}
