'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, Database, Globe, Users } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: Database,
      content: [
        {
          subtitle: 'Personal Information',
          text: 'We collect information you provide directly to us, such as when you create an account, complete KYC verification, or contact us for support. This may include your name, email address, phone number, address, and identification documents.'
        },
        {
          subtitle: 'Transaction Information',
          text: 'We collect information about your transactions on our platform, including product listings, orders, payments, and communications between buyers and sellers.'
        },
        {
          subtitle: 'Usage Information',
          text: 'We automatically collect certain information about your use of our services, including device information, IP address, browser type, pages visited, and time spent on our platform.'
        },
        {
          subtitle: 'Blockchain Data',
          text: 'We collect information from Hedera blockchain transactions, including wallet addresses, transaction hashes, and smart contract interactions.'
        }
      ]
    },
    {
      id: 'how-we-use',
      title: 'How We Use Your Information',
      icon: Eye,
      content: [
        {
          subtitle: 'Service Provision',
          text: 'We use your information to provide, maintain, and improve our marketplace services, including processing transactions, facilitating communications, and ensuring platform security.'
        },
        {
          subtitle: 'Verification and Security',
          text: 'We use your information to verify your identity, prevent fraud, and maintain the security and integrity of our platform.'
        },
        {
          subtitle: 'Communication',
          text: 'We use your contact information to send you important updates about your account, transactions, and our services.'
        },
        {
          subtitle: 'Legal Compliance',
          text: 'We may use your information to comply with applicable laws, regulations, and legal processes.'
        }
      ]
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing',
      icon: Users,
      content: [
        {
          subtitle: 'With Other Users',
          text: 'We share certain information with other users as necessary for the marketplace to function, such as seller information with buyers and vice versa.'
        },
        {
          subtitle: 'Service Providers',
          text: 'We may share your information with third-party service providers who assist us in operating our platform, such as payment processors, cloud storage providers, and analytics services.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose your information if required by law, court order, or government request, or to protect our rights, property, or safety.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.'
        }
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: Lock,
      content: [
        {
          subtitle: 'Encryption',
          text: 'We use industry-standard encryption to protect your personal information both in transit and at rest.'
        },
        {
          subtitle: 'Access Controls',
          text: 'We implement strict access controls and authentication measures to ensure only authorized personnel can access your information.'
        },
        {
          subtitle: 'Blockchain Security',
          text: 'We leverage Hedera blockchain technology for secure, transparent transactions and data integrity.'
        },
        {
          subtitle: 'Regular Audits',
          text: 'We conduct regular security audits and assessments to identify and address potential vulnerabilities.'
        }
      ]
    },
    {
      id: 'your-rights',
      title: 'Your Rights',
      icon: Shield,
      content: [
        {
          subtitle: 'Access and Portability',
          text: 'You have the right to access your personal information and request a copy of your data in a portable format.'
        },
        {
          subtitle: 'Correction',
          text: 'You can update or correct your personal information at any time through your account settings.'
        },
        {
          subtitle: 'Deletion',
          text: 'You may request deletion of your personal information, subject to certain legal and operational requirements.'
        },
        {
          subtitle: 'Opt-out',
          text: 'You can opt out of certain communications and data processing activities, though this may limit some platform functionality.'
        }
      ]
    },
    {
      id: 'cookies-tracking',
      title: 'Cookies and Tracking',
      icon: Globe,
      content: [
        {
          subtitle: 'Essential Cookies',
          text: 'We use essential cookies to provide basic platform functionality, such as maintaining your login session and remembering your preferences.'
        },
        {
          subtitle: 'Analytics Cookies',
          text: 'We use analytics cookies to understand how users interact with our platform and improve our services.'
        },
        {
          subtitle: 'Marketing Cookies',
          text: 'We may use marketing cookies to deliver relevant advertisements and measure their effectiveness.'
        },
        {
          subtitle: 'Cookie Management',
          text: 'You can manage your cookie preferences through your browser settings or our cookie consent banner.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-green-600" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Privacy Policy
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: September 29, 2024
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <p className="text-gray-700 leading-relaxed">
              At Lovtiti Agro Mart, we are committed to protecting your privacy and ensuring the security 
              of your personal information. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our decentralized agricultural marketplace platform.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              By using our services, you agree to the collection and use of information in accordance 
              with this policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </CardContent>
        </Card>

        {/* Policy Sections */}
        <div className="space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 text-green-600" />
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {section.content.map((item, index) => (
                      <div key={index}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.subtitle}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, 
              please contact us:
            </p>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@lovittiagro.com
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong> Lagos Business District, Victoria Island, Lagos, Nigeria
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong> +234 800 LOVITTI
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Policy Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date. 
              You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
