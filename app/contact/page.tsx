'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle,
  Headphones,
  FileText
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'sales', label: 'Sales Question' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'media', label: 'Media Inquiry' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for your message! We\'ll get back to you within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '', type: 'general' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to help! Reach out to us for support, questions, or partnerships.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Send us a Message</span>
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="type">Inquiry Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {contactTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief description of your inquiry"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please provide details about your inquiry..."
                    className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Reach us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">support@lovittiagro.com</p>
                    <p className="text-gray-600">info@lovittiagro.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+234 800 LOVITTI</p>
                    <p className="text-gray-600">+234 1 234 5678</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">
                      Lagos Business District<br />
                      Victoria Island, Lagos<br />
                      Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Headphones className="h-5 w-5" />
                  <span>Support Options</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Live Chat</h4>
                      <p className="text-sm text-gray-600">Available 24/7</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Start Chat</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Help Center</h4>
                      <p className="text-sm text-gray-600">Browse articles & FAQs</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Visit Help</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Phone Support</h4>
                      <p className="text-sm text-gray-600">Mon-Fri 8AM-6PM</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Call Now</Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
                <CardDescription>
                  Stay updated with our latest news and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm">Twitter</Button>
                  <Button variant="outline" size="sm">LinkedIn</Button>
                  <Button variant="outline" size="sm">Facebook</Button>
                  <Button variant="outline" size="sm">Instagram</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
