import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Code, BookOpen, Zap, Shield, Globe, Database } from 'lucide-react';
import Link from 'next/link';

const apiEndpoints = [
  {
    category: "Authentication",
    endpoints: [
      { method: "POST", path: "/api/auth/signup", description: "Create a new user account" },
      { method: "POST", path: "/api/auth/login", description: "Authenticate user login" },
      { method: "POST", path: "/api/auth/assign-role", description: "Assign user role" },
      { method: "GET", path: "/api/auth/profile", description: "Get user profile" }
    ]
  },
  {
    category: "Listings",
    endpoints: [
      { method: "GET", path: "/api/listings", description: "Get all product listings" },
      { method: "POST", path: "/api/listings", description: "Create new product listing" },
      { method: "GET", path: "/api/listings/[id]", description: "Get specific listing" },
      { method: "PUT", path: "/api/listings/[id]", description: "Update listing" },
      { method: "DELETE", path: "/api/listings/[id]", description: "Delete listing" }
    ]
  },
  {
    category: "Payments",
    endpoints: [
      { method: "POST", path: "/api/payments/stripe", description: "Process Stripe payment" },
      { method: "POST", path: "/api/payments/mpesa", description: "Process MPESA payment" },
      { method: "POST", path: "/api/payments/crypto", description: "Process crypto payment" },
      { method: "POST", path: "/api/payments/hedera/escrow", description: "Create escrow payment" },
      { method: "GET", path: "/api/payments/status/[id]", description: "Get payment status" }
    ]
  },
  {
    category: "Supply Chain",
    endpoints: [
      { method: "POST", path: "/api/tracking", description: "Add supply chain step" },
      { method: "GET", path: "/api/tracking/[orderId]", description: "Get tracking info" },
      { method: "POST", path: "/api/analytics", description: "Submit analytics data" }
    ]
  },
  {
    category: "Communication",
    endpoints: [
      { method: "POST", path: "/api/messaging", description: "Send message" },
      { method: "GET", path: "/api/messaging", description: "Get messages" },
      { method: "POST", path: "/api/video-call", description: "Initiate video call" },
      { method: "POST", path: "/api/notifications", description: "Send notification" }
    ]
  },
  {
    category: "USSD",
    endpoints: [
      { method: "POST", path: "/api/ussd", description: "Process USSD request" },
      { method: "GET", path: "/api/ussd/menu", description: "Get USSD menu" }
    ]
  }
];

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Real-time Processing",
    description: "Fast and efficient API responses with real-time data processing"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure Authentication",
    description: "JWT-based authentication with role-based access control"
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "RESTful Design",
    description: "Clean, intuitive REST API following industry best practices"
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "Blockchain Integration",
    description: "Seamless integration with Hedera Hashgraph blockchain"
  }
];

export default function APIPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">API Documentation</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Integrate with Lovtiti Agro Mart's powerful API to build custom applications, 
            manage listings, process payments, and access real-time agricultural data.
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="w-6 h-6 mr-2 text-green-600" />
              Quick Start
            </CardTitle>
            <CardDescription>
              Get started with our API in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Get Your API Key</h4>
                <p className="text-gray-600 mb-2">
                  Sign up for an account and generate your API key from the settings page.
                </p>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  API_KEY=your_api_key_here
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2. Make Your First Request</h4>
                <p className="text-gray-600 mb-2">
                  Test the API with a simple request to get all listings:
                </p>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm block">
                  curl -H "Authorization: Bearer YOUR_API_KEY" https://api.lovittiagromart.com/listings
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3. Explore the Endpoints</h4>
                <p className="text-gray-600">
                  Use our interactive API explorer to test endpoints and see responses in real-time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">API Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="text-green-600 mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* API Endpoints */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">API Endpoints</h2>
          <div className="space-y-8">
            {apiEndpoints.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.endpoints.map((endpoint, endpointIndex) => (
                      <div key={endpointIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                            endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                            endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {endpoint.method}
                          </span>
                          <code className="text-sm font-mono">{endpoint.path}</code>
                        </div>
                        <p className="text-gray-600 text-sm">{endpoint.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Authentication */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>
              All API requests require authentication using your API key
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Header Authentication</h4>
                <p className="text-gray-600 mb-2">
                  Include your API key in the Authorization header:
                </p>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm block">
                  Authorization: Bearer YOUR_API_KEY
                </code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Rate Limits</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• 1000 requests per hour for free tier</li>
                  <li>• 10000 requests per hour for premium tier</li>
                  <li>• Rate limit headers included in responses</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SDKs and Libraries */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>SDKs and Libraries</CardTitle>
            <CardDescription>
              Official libraries for popular programming languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">JavaScript/Node.js</h4>
                <code className="text-sm text-gray-600">npm install @lovitti/agro-api</code>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Python</h4>
                <code className="text-sm text-gray-600">pip install lovtiti-agro-api</code>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">PHP</h4>
                <code className="text-sm text-gray-600">composer require lovitti/agro-api</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Get support and connect with our developer community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Documentation</h4>
                <p className="text-gray-600 mb-4">
                  Comprehensive guides, tutorials, and examples
                </p>
                <Button variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Full Docs
                </Button>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Support</h4>
                <p className="text-gray-600 mb-4">
                  Get help from our technical support team
                </p>
                <Link href="/contact">
                  <Button variant="outline">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            Ready to start building? Get your API key and start integrating today.
          </p>
          <div className="space-x-4">
            <Link href="/settings">
              <Button>Get API Key</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
