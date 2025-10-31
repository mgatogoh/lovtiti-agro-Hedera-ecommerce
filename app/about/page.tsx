'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Navbar is already included in the root layout
import {
  Leaf,
  Users,
  Globe,
  Shield,
  TrendingUp,
  Heart,
  Award,
  Target,
  Lightbulb,
  Handshake,
  Star,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Facebook,
  Instagram
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'CEO & Co-Founder',
      image: '/api/placeholder/300/300',
      bio: 'Agricultural economist with 15+ years experience in African farming systems. PhD from University of California, Davis.',
      expertise: ['Agricultural Economics', 'Supply Chain Management', 'Policy Development'],
      location: 'Lagos, Nigeria',
      social: {
        linkedin: 'https://linkedin.com/in/sarah-johnson',
        twitter: 'https://twitter.com/sarah_johnson'
      }
    },
    {
      name: 'Ahmed Hassan',
      role: 'CTO & Co-Founder',
      image: '/api/placeholder/300/300',
      bio: 'Blockchain technology expert and software architect. Former senior engineer at Microsoft with expertise in distributed systems.',
      expertise: ['Blockchain Technology', 'Software Architecture', 'Distributed Systems'],
      location: 'Cairo, Egypt',
      social: {
        linkedin: 'https://linkedin.com/in/ahmed-hassan',
        twitter: 'https://twitter.com/ahmed_hassan'
      }
    },
    {
      name: 'Dr. Fatima Okafor',
      role: 'Head of Agricultural Services',
      image: '/api/placeholder/300/300',
      bio: 'AGROEXPERT and agricultural consultant with extensive experience in livestock management and crop production across West Africa.',
      expertise: ['Veterinary Medicine', 'Livestock Management', 'Crop Production'],
      location: 'Abuja, Nigeria',
      social: {
        linkedin: 'https://linkedin.com/in/fatima-okafor',
        twitter: 'https://twitter.com/fatima_okafor'
      }
    },
    {
      name: 'Kwame Asante',
      role: 'Head of Operations',
      image: '/api/placeholder/300/300',
      bio: 'Supply chain and logistics expert with 12+ years in agricultural distribution across multiple African countries.',
      expertise: ['Supply Chain Management', 'Logistics', 'Distribution Networks'],
      location: 'Accra, Ghana',
      social: {
        linkedin: 'https://linkedin.com/in/kwame-asante',
        twitter: 'https://twitter.com/kwame_asante'
      }
    },
    {
      name: 'Dr. Maryam Ibrahim',
      role: 'Head of Technology',
      image: '/api/placeholder/300/300',
      bio: 'Software engineer and AI researcher specializing in agricultural technology solutions and data analytics.',
      expertise: ['Artificial Intelligence', 'Data Analytics', 'Agricultural Technology'],
      location: 'Nairobi, Kenya',
      social: {
        linkedin: 'https://linkedin.com/in/maryam-ibrahim',
        twitter: 'https://twitter.com/maryam_ibrahim'
      }
    },
    {
      name: 'John Mwangi',
      role: 'Head of Business Development',
      image: '/api/placeholder/300/300',
      bio: 'Business development specialist with extensive experience in African markets and agricultural partnerships.',
      expertise: ['Business Development', 'Market Analysis', 'Partnership Building'],
      location: 'Kampala, Uganda',
      social: {
        linkedin: 'https://linkedin.com/in/john-mwangi',
        twitter: 'https://twitter.com/john_mwangi'
      }
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Empowering Farmers',
      description: 'We believe in empowering African farmers with the tools and knowledge they need to succeed in the global market.'
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Our blockchain technology ensures complete transparency in all transactions, building trust across the supply chain.'
    },
    {
      icon: Handshake,
      title: 'Fair Trade',
      description: 'We promote fair trade practices that benefit all stakeholders, from smallholder farmers to end consumers.'
    },
    {
      icon: Globe,
      title: 'Sustainability',
      description: 'We are committed to sustainable agricultural practices that protect the environment for future generations.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We build strong communities that support each other and share knowledge for mutual growth.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We continuously innovate to provide cutting-edge solutions that address real-world agricultural challenges.'
    }
  ];

  const milestones = [
    { year: '2020', title: 'Company Founded', description: 'Lovtiti Agro Mart was established with a vision to transform African agriculture.' },
    { year: '2021', title: 'First 100 Farmers', description: 'We onboarded our first 100 farmers across Nigeria and Ghana.' },
    { year: '2022', title: 'Blockchain Integration', description: 'Successfully integrated Hedera Hashgraph for transparent transactions.' },
    { year: '2023', title: 'Multi-Country Expansion', description: 'Expanded operations to Kenya, Uganda, and Tanzania.' },
    { year: '2024', title: 'Agro Expert Services', description: 'Launched comprehensive agricultural expert services and equipment leasing.' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
              <Leaf className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-green-600">Lovtiti Agro Mart</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We are revolutionizing African agriculture through blockchain technology,
            connecting farmers, distributors, transporters, buyers, and agro experts
            in a transparent, efficient, and sustainable ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-6 bg-green-600 hover:bg-green-700">
                Join Our Mission
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-green-200">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To empower African farmers and agricultural stakeholders by providing a
                  transparent, efficient, and sustainable marketplace that connects producers
                  with buyers while ensuring fair trade practices and environmental sustainability.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <Lightbulb className="w-8 h-8 text-blue-600" />
                  <CardTitle className="text-2xl">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To become the leading blockchain-powered agricultural ecosystem in Africa,
                  transforming how agricultural products are traded, distributed, and consumed
                  while promoting sustainable farming practices and economic growth.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">
              The passionate individuals driving agricultural innovation across Africa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-16 h-16 text-gray-400" />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-lg font-medium text-green-600">
                    {member.role}
                  </CardDescription>
                  <div className="flex items-center justify-center space-x-1 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{member.location}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{member.bio}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Expertise:</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">
              Key milestones in our mission to transform African agriculture
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{milestone.year}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-green-100">
              Numbers that reflect our commitment to African agriculture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-green-100">Active Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-green-100">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$2M+</div>
              <div className="text-green-100">Transactions Processed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-green-100">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Join Our Mission?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Whether you're a farmer, buyer, distributor, transporter, or agro expert,
            there's a place for you in our ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-6 bg-green-600 hover:bg-green-700">
                Get Started Today
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-8 w-8 text-green-400" />
                <span className="text-2xl font-bold">Lovtiti Agro Mart</span>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting African farmers with global buyers through blockchain technology.
                A comprehensive agricultural ecosystem for all stakeholders.
              </p>
              <div className="flex space-x-4">
                <Link href="/auth/signup" className="text-green-400 hover:text-green-300">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Get Started
                  </Button>
                </Link>
                <Link href="/learn-more" className="text-gray-400 hover:text-white">
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/listings/browse" className="hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/learn-more" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Connect</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Lovtiti Agro Mart. All rights reserved.</p>
            <p className="mt-2 text-sm">Empowering African agriculture through blockchain technology</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
