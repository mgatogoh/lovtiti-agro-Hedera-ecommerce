'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Truck,
  Package,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Users,
  CheckCircle
} from 'lucide-react';

// Mock service providers data
const mockServiceProviders = [
  {
    id: '1',
    name: 'AgroLogistics Pro',
    type: 'TRANSPORTER',
    description: 'Professional agricultural logistics and transportation services across Nigeria',
    location: 'Lagos, Nigeria',
    rating: 4.8,
    reviewCount: 156,
    services: ['Cold Chain Transport', 'Bulk Cargo', 'Express Delivery', 'Warehousing'],
    contact: {
      phone: '+234 801 234 5678',
      email: 'contact@agrologisticspro.com'
    },
    availability: '24/7',
    pricing: 'Competitive rates',
    experience: '5+ years',
    fleetSize: '50+ vehicles',
    specializations: ['Fresh Produce', 'Livestock', 'Equipment Transport'],
    certifications: ['ISO 9001', 'HACCP', 'Organic Certified'],
    responseTime: '< 2 hours'
  },
  {
    id: '2',
    name: 'FarmConnect Distribution',
    type: 'DISTRIBUTOR',
    description: 'Connecting farmers with buyers through efficient supply chain management',
    location: 'Kano, Nigeria',
    rating: 4.6,
    reviewCount: 89,
    services: ['Supply Chain Management', 'Inventory Management', 'Market Access', 'Quality Control'],
    contact: {
      phone: '+234 802 345 6789',
      email: 'info@farmconnect.com'
    },
    availability: 'Mon-Fri 8AM-6PM',
    pricing: 'Volume discounts available',
    experience: '8+ years',
    fleetSize: '25+ vehicles',
    specializations: ['Grains', 'Vegetables', 'Fruits'],
    certifications: ['ISO 14001', 'Organic Certified'],
    responseTime: '< 4 hours'
  },
  {
    id: '3',
    name: 'Swift Agro Transport',
    type: 'TRANSPORTER',
    description: 'Fast and reliable transportation for agricultural products',
    location: 'Abuja, Nigeria',
    rating: 4.7,
    reviewCount: 203,
    services: ['Express Transport', 'Refrigerated Transport', 'Heavy Equipment', 'Insurance'],
    contact: {
      phone: '+234 803 456 7890',
      email: 'hello@swiftagro.com'
    },
    availability: '24/7',
    pricing: 'Transparent pricing',
    experience: '3+ years',
    fleetSize: '30+ vehicles',
    specializations: ['Perishables', 'Machinery', 'Seeds'],
    certifications: ['ISO 9001', 'Cold Chain Certified'],
    responseTime: '< 1 hour'
  },
  {
    id: '4',
    name: 'Green Supply Solutions',
    type: 'DISTRIBUTOR',
    description: 'Sustainable supply chain solutions for the agricultural sector',
    location: 'Port Harcourt, Nigeria',
    rating: 4.9,
    reviewCount: 67,
    services: ['Sustainable Distribution', 'Carbon Neutral Transport', 'Organic Certification', 'Fair Trade'],
    contact: {
      phone: '+234 804 567 8901',
      email: 'sustainability@greensupply.com'
    },
    availability: 'Mon-Sat 7AM-7PM',
    pricing: 'Eco-friendly premium',
    experience: '6+ years',
    fleetSize: '15+ electric vehicles',
    specializations: ['Organic Products', 'Sustainable Agriculture', 'Fair Trade'],
    certifications: ['Fair Trade Certified', 'Carbon Neutral', 'Organic Certified'],
    responseTime: '< 3 hours'
  }
];

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'TRANSPORTER' | 'DISTRIBUTOR'>('ALL');
  const [selectedLocation, setSelectedLocation] = useState('');

  const filteredProviders = mockServiceProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'ALL' || provider.type === selectedType;
    const matchesLocation = !selectedLocation || provider.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const transporterCount = mockServiceProviders.filter(p => p.type === 'TRANSPORTER').length;
  const distributorCount = mockServiceProviders.filter(p => p.type === 'DISTRIBUTOR').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Directory</h1>
            <p className="text-xl text-gray-600 mb-8">
              Find Transporters and Distributors to support your agricultural business
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Card>
                <CardContent className="text-center p-6">
                  <Truck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">{transporterCount}</h3>
                  <p className="text-gray-600">Transporters</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="text-center p-6">
                  <Package className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">{distributorCount}</h3>
                  <p className="text-gray-600">Distributors</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search service providers, services, or specializations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="ALL">All Services</option>
              <option value="TRANSPORTER">Transporters</option>
              <option value="DISTRIBUTOR">Distributors</option>
            </select>
            <Input
              placeholder="Location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full lg:w-48"
            />
          </div>
        </div>

        {/* Service Providers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      provider.type === 'TRANSPORTER' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {provider.type === 'TRANSPORTER' ? (
                        <Truck className="w-6 h-6 text-blue-600" />
                      ) : (
                        <Package className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {provider.type === 'TRANSPORTER' ? 'Transportation Services' : 'Distribution Services'}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{provider.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{provider.reviewCount} reviews</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">{provider.description}</p>
                
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{provider.location}</span>
                </div>

                {/* Services */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Services Offered:</h4>
                  <div className="flex flex-wrap gap-1">
                    {provider.services.map((service, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-700"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Specializations:</h4>
                  <div className="flex flex-wrap gap-1">
                    {provider.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-xs rounded-full text-green-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{provider.availability}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{provider.fleetSize}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{provider.experience}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{provider.pricing}</span>
                  </div>
                </div>

                {/* Certifications */}
                {provider.certifications.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Certifications:</h4>
                    <div className="flex flex-wrap gap-1">
                      {provider.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-xs rounded-full text-blue-700"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Actions */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button size="sm" className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No service providers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}











