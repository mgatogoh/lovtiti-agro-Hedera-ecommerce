'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Leaf, DollarSign, Shield, Users, Zap } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Farmer Starter',
      price: 'Free',
      description: 'Perfect for small-scale farmers getting started',
      features: [
        'Up to 10 product listings',
        'Basic marketplace access',
        'Standard support',
        'Mobile app access',
        'Basic analytics'
      ],
      popular: false,
      cta: 'Get Started Free',
      icon: Leaf
    },
    {
      name: 'Farmer Pro',
      price: 'ℏ2,500',
      period: '/month',
      description: 'For growing farms with more products',
      features: [
        'Unlimited product listings',
        'Priority marketplace placement',
        'Advanced analytics & insights',
        'Direct buyer messaging',
        'Premium support',
        'Video product showcases',
        'Bulk listing tools'
      ],
      popular: true,
      cta: 'Start Pro Trial',
      icon: Zap
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large agricultural businesses',
      features: [
        'Everything in Pro',
        'Custom integrations',
        'Dedicated account manager',
        'White-label options',
        'API access',
        'Custom reporting',
        'Priority dispute resolution',
        'Volume discounts'
      ],
      popular: false,
      cta: 'Contact Sales',
      icon: Users
    }
  ];

  const buyerFeatures = [
    {
      title: 'No Buyer Fees',
      description: 'Browse and purchase products without any additional fees',
      icon: DollarSign
    },
    {
      title: 'Secure Payments',
      description: 'All transactions protected by blockchain technology',
      icon: Shield
    },
    {
      title: 'Verified Farmers',
      description: 'Connect with KYC-verified farmers and suppliers',
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your farming business. No hidden fees, no surprises.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.name}
                className={`relative ${plan.popular ? 'border-green-500 shadow-lg scale-105' : 'border-gray-200'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${plan.popular ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Icon className={`h-8 w-8 ${plan.popular ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-600 ml-1">{plan.period}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${plan.popular ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Buyer Benefits */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Free for Buyers
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Buyers can browse and purchase products without any fees
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {buyerFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <Icon className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How does payment processing work?
              </h3>
              <p className="text-gray-600">
                We use Hedera Hashgraph blockchain for secure, transparent payments.
                All transactions are processed through smart contracts with automatic escrow.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time.
                Changes take effect immediately and billing is prorated.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept HBAR (Hedera's native cryptocurrency) and traditional
                payment methods like bank transfers and mobile money.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! Farmer Pro comes with a 14-day free trial.
                No credit card required to get started.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to grow your farming business?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of farmers already using Lovtiti Agro Mart
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Free Trial
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
