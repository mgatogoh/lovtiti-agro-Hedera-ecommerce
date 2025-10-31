'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Leaf,
  Globe,
  Shield,
  Users,
  Zap,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Smartphone,
  CreditCard,
  BarChart3
} from 'lucide-react';

export default function LearnMorePage() {
  const features = [
    {
      icon: Globe,
      title: 'Global Marketplace',
      description: 'Connect with buyers and sellers worldwide, expanding your market reach beyond local boundaries.'
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'All transactions are secured by Hedera Hashgraph blockchain technology, ensuring transparency and trust.'
    },
    {
      icon: Users,
      title: 'Verified Community',
      description: 'KYC-verified farmers and buyers create a trusted environment for agricultural trade.'
    },
    {
      icon: Zap,
      title: 'Instant Payments',
      description: 'Fast settlement times with HBAR cryptocurrency, eliminating traditional banking delays.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Access',
      description: 'Access our platform through mobile apps or USSD for feature phones, ensuring everyone can participate.'
    },
    {
      icon: CreditCard,
      title: 'Escrow Protection',
      description: 'Smart contract escrow ensures secure transactions with automatic fund release upon order completion.'
    }
  ];

  const benefits = [
    {
      title: 'For Farmers',
      icon: Leaf,
      items: [
        'Direct access to global buyers',
        'Fair pricing without middlemen',
        'Secure payment processing',
        'Transparent transaction history',
        'Reduced post-harvest losses',
        'Access to market insights'
      ]
    },
    {
      title: 'For Buyers',
      icon: Users,
      items: [
        'Fresh products from verified farmers',
        'Transparent supply chain tracking',
        'Competitive pricing',
        'Quality assurance',
        'Direct farmer relationships',
        'Sustainable sourcing options'
      ]
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Farmers', icon: Leaf },
    { number: '50,000+', label: 'Products Listed', icon: BarChart3 },
    { number: 'ℏ500M+', label: 'Transaction Volume', icon: TrendingUp },
    { number: '99.9%', label: 'Uptime Guarantee', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Hero Section */}
      <div className="bg-white border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transforming Agriculture Through
              <span className="text-green-600 block">Blockchain Technology</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Lovtiti Agro Mart is revolutionizing agricultural trade by connecting African farmers
              with global buyers through a secure, transparent, and efficient marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                Join Our Platform
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Icon className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Lovtiti Agro Mart?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with agricultural expertise
              to create the future of farming commerce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-green-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Icon className="h-6 w-6 text-green-600" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Benefits for Everyone
            </h2>
            <p className="text-xl text-gray-600">
              Our platform creates value for all participants in the agricultural ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <Icon className="h-6 w-6 text-green-600" />
                      <span>{benefit.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {benefit.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Technology Section */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold">
                Powered by Hedera Hashgraph
              </CardTitle>
              <CardDescription className="text-center text-xl">
                The most advanced blockchain technology for enterprise applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">10,000+</div>
                  <div className="text-gray-600">Transactions per second</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">&lt;3s</div>
                  <div className="text-gray-600">Finality time</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">$0.0001</div>
                  <div className="text-gray-600">Average transaction cost</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to start trading on our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your account as a farmer or buyer</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Verify Identity</h3>
              <p className="text-gray-600">Complete KYC verification for security</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Start Trading</h3>
              <p className="text-gray-600">List products or browse marketplace</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Complete transactions with blockchain security</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Join the Future of Agriculture?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your journey with Lovtiti Agro Mart today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
