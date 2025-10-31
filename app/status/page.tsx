import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Clock, Server, Database, Globe } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    name: "API Services",
    status: "operational",
    uptime: "99.9%",
    lastIncident: "No incidents in the past 30 days",
    responseTime: "45ms"
  },
  {
    name: "Authentication",
    status: "operational",
    uptime: "99.8%",
    lastIncident: "No incidents in the past 30 days",
    responseTime: "32ms"
  },
  {
    name: "Payment Processing",
    status: "operational",
    uptime: "99.7%",
    lastIncident: "No incidents in the past 30 days",
    responseTime: "120ms"
  },
  {
    name: "Blockchain Services",
    status: "operational",
    uptime: "99.5%",
    lastIncident: "No incidents in the past 30 days",
    responseTime: "2.1s"
  },
  {
    name: "Database",
    status: "operational",
    uptime: "99.9%",
    lastIncident: "No incidents in the past 30 days",
    responseTime: "15ms"
  },
  {
    name: "CDN",
    status: "operational",
    uptime: "99.9%",
    lastIncident: "No incidents in the past 30 days",
    responseTime: "25ms"
  }
];

const incidents = [
  {
    id: 1,
    title: "Scheduled Maintenance - Database Optimization",
    status: "resolved",
    date: "2024-01-10",
    duration: "2 hours",
    description: "Routine database maintenance to improve performance and optimize queries."
  },
  {
    id: 2,
    title: "Payment Gateway Update",
    status: "resolved",
    date: "2024-01-05",
    duration: "30 minutes",
    description: "Updated payment gateway integration to support new MPESA features."
  },
  {
    id: 3,
    title: "Blockchain Network Congestion",
    status: "resolved",
    date: "2024-01-01",
    duration: "1 hour",
    description: "Temporary delays in blockchain transactions due to network congestion."
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "operational":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "degraded":
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case "outage":
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Clock className="w-5 h-5 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "operational":
      return "text-green-600 bg-green-100";
    case "degraded":
      return "text-yellow-600 bg-yellow-100";
    case "outage":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">System Status</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Real-time status of all Lovtiti Agro Mart services. We're committed to providing 
            reliable, high-performance services for our agricultural marketplace.
          </p>
        </div>

        {/* Overall Status */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                  All Systems Operational
                </CardTitle>
                <CardDescription>
                  All services are running normally
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">99.8%</p>
                <p className="text-sm text-gray-600">Overall Uptime</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Service Status */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Status</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    {getStatusIcon(service.status)}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Uptime:</span>
                      <span className="font-medium">{service.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Time:</span>
                      <span className="font-medium">{service.responseTime}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600">{service.lastIncident}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Incidents</h2>
          <div className="space-y-4">
            {incidents.map((incident) => (
              <Card key={incident.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{incident.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                          {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{incident.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Date: {incident.date}</span>
                        <span>Duration: {incident.duration}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Server className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">API Response Time</h3>
                <p className="text-2xl font-bold text-green-600">45ms</p>
                <p className="text-sm text-gray-600">Average</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Database className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Database Queries</h3>
                <p className="text-2xl font-bold text-blue-600">15ms</p>
                <p className="text-sm text-gray-600">Average</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Globe className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Global CDN</h3>
                <p className="text-2xl font-bold text-purple-600">25ms</p>
                <p className="text-sm text-gray-600">Average</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Success Rate</h3>
                <p className="text-2xl font-bold text-green-600">99.8%</p>
                <p className="text-sm text-gray-600">Last 30 days</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Monitoring */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Monitoring & Alerts</CardTitle>
            <CardDescription>
              We continuously monitor our services to ensure optimal performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">24/7 Monitoring</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Real-time performance monitoring</li>
                  <li>• Automated alerting system</li>
                  <li>• Proactive issue detection</li>
                  <li>• Instant notification to our team</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Incident Response</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Average response time: 5 minutes</li>
                  <li>• 24/7 on-call engineering team</li>
                  <li>• Automated failover systems</li>
                  <li>• Regular status updates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscribe to Updates */}
        <Card className="mb-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Informed</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Subscribe to status updates and get notified immediately when there are any 
              service disruptions or maintenance windows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Button>Subscribe</Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            Questions about our status? Contact our technical support team.
          </p>
          <div className="space-x-4">
            <Link href="/contact">
              <Button variant="outline">Contact Support</Button>
            </Link>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
