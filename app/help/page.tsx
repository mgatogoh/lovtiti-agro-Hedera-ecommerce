'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  HelpCircle,
  BookOpen,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Leaf,
  ShoppingCart,
  CreditCard,
  Shield,
  Smartphone
} from 'lucide-react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const faqSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Leaf,
      articles: [
        {
          question: 'How do I create an account?',
          answer: 'Click the "Sign Up" button on our homepage and follow the registration process. You can choose to register as a farmer or buyer.'
        },
        {
          question: 'What is KYC verification?',
          answer: 'KYC (Know Your Customer) verification is required for farmers to ensure platform security and trust. It includes identity verification and address confirmation.'
        },
        {
          question: 'How do I set up my Hedera wallet?',
          answer: 'You can create a Hedera wallet through our platform or use an existing one. We provide step-by-step instructions during the onboarding process.'
        }
      ]
    },
    {
      id: 'for-farmers',
      title: 'For Farmers',
      icon: Leaf,
      articles: [
        {
          question: 'How do I list my products?',
          answer: 'Go to your farmer dashboard and click "Create Listing". Fill in product details, upload images, set pricing, and publish your listing.'
        },
        {
          question: 'What are the listing fees?',
          answer: 'We offer a free starter plan with up to 10 listings. Pro plans start at ℏ2,500/month for unlimited listings and premium features.'
        },
        {
          question: 'How do I receive payments?',
          answer: 'Payments are processed through Hedera blockchain using HBAR cryptocurrency. Funds are held in escrow until order completion.'
        },
        {
          question: 'Can I edit my listings?',
          answer: 'Yes, you can edit your listings anytime from your dashboard. Changes are reflected immediately on the marketplace.'
        }
      ]
    },
    {
      id: 'for-buyers',
      title: 'For Buyers',
      icon: ShoppingCart,
      articles: [
        {
          question: 'How do I browse products?',
          answer: 'Use our marketplace search and filter options to find products by category, location, price range, and other criteria.'
        },
        {
          question: 'Are there any buyer fees?',
          answer: 'No! Buyers can browse and purchase products without any additional fees. You only pay the product price.'
        },
        {
          question: 'How do I place an order?',
          answer: 'Add products to your cart, review your order, and proceed to checkout. You can pay using HBAR or traditional payment methods.'
        },
        {
          question: 'What if I have issues with my order?',
          answer: 'Contact our support team or use the dispute resolution system. We have a comprehensive dispute process to protect both buyers and sellers.'
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payments & Security',
      icon: CreditCard,
      articles: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept HBAR (Hedera cryptocurrency), bank transfers, mobile money, and other traditional payment methods.'
        },
        {
          question: 'How does the escrow system work?',
          answer: 'When you place an order, funds are held in a smart contract escrow. They are released to the farmer only after order completion.'
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Yes, we use blockchain technology and encryption to ensure all transactions are secure and transparent.'
        },
        {
          question: 'Can I get a refund?',
          answer: 'Refunds are processed through our dispute resolution system. Contact support if you need assistance with a refund.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: Smartphone,
      articles: [
        {
          question: 'Do you have a mobile app?',
          answer: 'Yes, we have mobile apps for both iOS and Android. You can also access our platform through USSD for basic phones.'
        },
        {
          question: 'What browsers are supported?',
          answer: 'We support all modern browsers including Chrome, Firefox, Safari, and Edge. For best experience, use the latest version.'
        },
        {
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page and follow the instructions sent to your email.'
        },
        {
          question: 'Can I use the platform offline?',
          answer: 'Some features require internet connection, but you can view saved listings and basic information offline.'
        }
      ]
    }
  ];

  const popularArticles = [
    'How to create your first product listing',
    'Setting up your Hedera wallet',
    'Understanding KYC verification',
    'How to place an order',
    'Payment methods and security',
    'Mobile app download and setup',
    'Dispute resolution process',
    'Account security best practices'
  ];

  const filteredSections = faqSections.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.articles.length > 0);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find answers to common questions and get the support you need.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Popular Articles</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {popularArticles.map((article, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-sm text-gray-600 hover:text-green-600 hover:underline"
                      >
                        {article}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Still Need Help?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="sm">
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Live Chat
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Schedule Call
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {searchQuery ? (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Search Results for "{searchQuery}"
                </h2>
                <p className="text-gray-600">
                  Found {filteredSections.reduce((total, section) => total + section.articles.length, 0)} articles
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-600">
                  Browse our comprehensive FAQ sections to find answers to common questions.
                </p>
              </div>
            )}

            <div className="space-y-6">
              {(searchQuery ? filteredSections : faqSections).map((section) => {
                const Icon = section.icon;
                const isExpanded = expandedSection === section.id;

                return (
                  <Card key={section.id}>
                    <CardHeader>
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-6 w-6 text-green-600" />
                          <CardTitle>{section.title}</CardTitle>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent>
                        <div className="space-y-4">
                          {section.articles.map((article, index) => (
                            <div key={index} className="border-l-2 border-green-200 pl-4">
                              <h4 className="font-semibold text-gray-900 mb-2">
                                {article.question}
                              </h4>
                              <p className="text-gray-600">
                                {article.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>

            {searchQuery && filteredSections.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No articles found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms or browse our FAQ sections.
                  </p>
                  <Button onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
