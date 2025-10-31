import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield, Users, Scale } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">
            Please read these terms carefully before using our platform
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-6 h-6 mr-2 text-green-600" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Welcome to Lovtiti Agro Mart, a blockchain-powered agricultural marketplace connecting 
                African farmers with global buyers. These Terms of Service ("Terms") govern your use 
                of our platform and services.
              </p>
              <p>
                By accessing or using our platform, you agree to be bound by these Terms. If you 
                disagree with any part of these terms, you may not access the service.
              </p>
            </CardContent>
          </Card>

          {/* Acceptance of Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                By creating an account, browsing products, or using any of our services, you 
                acknowledge that you have read, understood, and agree to be bound by these Terms 
                and our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-6 h-6 mr-2 text-green-600" />
                User Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <ul>
                <li>Provide accurate and complete information during registration</li>
                <li>Maintain the security of your account credentials</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Respect other users and maintain professional conduct</li>
                <li>Report any suspicious or fraudulent activity</li>
                <li>Ensure product listings are accurate and comply with quality standards</li>
              </ul>
            </CardContent>
          </Card>

          {/* Platform Services */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Services</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Lovtiti Agro Mart provides a decentralized marketplace platform that includes:
              </p>
              <ul>
                <li>Product listing and browsing capabilities</li>
                <li>Secure payment processing through blockchain technology</li>
                <li>Supply chain tracking and verification</li>
                <li>Communication tools for buyers and sellers</li>
                <li>Logistics and delivery coordination</li>
                <li>Veterinary and agricultural advisory services</li>
              </ul>
            </CardContent>
          </Card>

          {/* Payment and Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Payment and Transactions</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                All transactions on our platform are processed through secure blockchain technology 
                using Hedera Hashgraph. We support multiple payment methods including:
              </p>
              <ul>
                <li>Cryptocurrency payments (HBAR, Bitcoin, Ethereum)</li>
                <li>Traditional payment methods (Stripe, MPESA)</li>
                <li>Escrow services for secure transactions</li>
              </ul>
              <p>
                Transaction fees and payment processing fees are clearly disclosed before 
                completing any purchase.
              </p>
            </CardContent>
          </Card>

          {/* Prohibited Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Prohibited Activities</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>The following activities are strictly prohibited:</p>
              <ul>
                <li>Fraudulent or deceptive practices</li>
                <li>Listing counterfeit or illegal products</li>
                <li>Manipulating prices or engaging in price fixing</li>
                <li>Harassment or abuse of other users</li>
                <li>Violation of intellectual property rights</li>
                <li>Attempting to circumvent platform security measures</li>
                <li>Using the platform for money laundering or other illegal activities</li>
              </ul>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-6 h-6 mr-2 text-green-600" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Lovtiti Agro Mart acts as an intermediary platform. We are not responsible for:
              </p>
              <ul>
                <li>Product quality or condition</li>
                <li>Delivery delays or issues</li>
                <li>Disputes between buyers and sellers</li>
                <li>Losses due to market fluctuations</li>
                <li>Technical issues beyond our control</li>
              </ul>
              <p>
                Our liability is limited to the amount of fees collected for the specific transaction.
              </p>
            </CardContent>
          </Card>

          {/* Dispute Resolution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="w-6 h-6 mr-2 text-green-600" />
                Dispute Resolution
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                We encourage users to resolve disputes amicably. For unresolved disputes:
              </p>
              <ul>
                <li>Contact our support team within 30 days</li>
                <li>Provide detailed documentation of the issue</li>
                <li>We will mediate and provide a resolution within 14 days</li>
                <li>Arbitration may be required for complex disputes</li>
              </ul>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                We reserve the right to modify these Terms at any time. Users will be notified 
                of significant changes via email or platform notification. Continued use of the 
                platform after changes constitutes acceptance of the new Terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> legal@lovittiagromart.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Agricultural Street, Tech City, TC 12345</p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center py-8 border-t border-gray-200">
            <p className="text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <div className="mt-4">
              <Link href="/">
                <Button>Return to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
