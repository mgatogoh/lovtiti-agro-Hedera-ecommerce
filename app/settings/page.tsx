'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CurrencySelector from '@/components/CurrencySelector';
import LanguageSelector from '@/components/LanguageSelector';
import PaymentMethodSelector from '@/components/PaymentMethodSelector';
import { 
  Settings, 
  Globe, 
  Currency, 
  CreditCard, 
  MapPin, 
  Bell, 
  Shield, 
  Save,
  Check,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { 
  SUPPORTED_CURRENCIES, 
  getCurrencyByCode, 
  formatCurrency 
} from '@/utils/currency';
import { 
  SUPPORTED_LANGUAGES, 
  getLanguageByCode, 
  getCurrentLanguage,
  setCurrentLanguage,
  getTranslation 
} from '@/utils/language';
import { PAYMENT_METHODS } from '@/utils/payments';

export default function SettingsPage() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('stripe_card');
  const [userLocation, setUserLocation] = useState('Nigeria');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    marketing: false
  });
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+234 123 456 7890',
    country: 'Nigeria'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Load user preferences from localStorage or API
    const savedCurrency = localStorage.getItem('selectedCurrency') || 'USD';
    const savedLanguage = getCurrentLanguage();
    const savedPaymentMethod = localStorage.getItem('selectedPaymentMethod') || 'stripe_card';
    const savedLocation = localStorage.getItem('userLocation') || 'Nigeria';
    
    setSelectedCurrency(savedCurrency);
    setSelectedLanguage(savedLanguage);
    setSelectedPaymentMethod(savedPaymentMethod);
    setUserLocation(savedLocation);
  }, []);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Save preferences to localStorage and API
      localStorage.setItem('selectedCurrency', selectedCurrency);
      localStorage.setItem('selectedPaymentMethod', selectedPaymentMethod);
      localStorage.setItem('userLocation', userLocation);
      setCurrentLanguage(selectedLanguage);
      
      // In a real app, you would also save to your API
      // await fetch('/api/user/preferences', {
      //   method: 'PUT',
      //   body: JSON.stringify({
      //     currency: selectedCurrency,
      //     language: selectedLanguage,
      //     paymentMethod: selectedPaymentMethod,
      //     location: userLocation,
      //     notifications
      //   })
      // });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentCurrency = getCurrencyByCode(selectedCurrency);
  const currentLanguage = getLanguageByCode(selectedLanguage);
  const currentPaymentMethod = PAYMENT_METHODS.find(method => method.id === selectedPaymentMethod);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-gray-600">
            Manage your account preferences, currency, language, and payment methods
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Settings saved successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={profile.country}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                  placeholder="Enter your country"
                />
              </div>
            </CardContent>
          </Card>

          {/* Currency & Language */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Regional Settings</span>
              </CardTitle>
              <CardDescription>
                Set your preferred currency and language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="flex items-center space-x-2 mb-2">
                  <Currency className="w-4 h-4" />
                  <span>Currency</span>
                </Label>
                <CurrencySelector
                  selectedCurrency={selectedCurrency}
                  onCurrencyChange={setSelectedCurrency}
                  amount={1000}
                  showCrypto={true}
                />
                <div className="mt-2 text-sm text-gray-500">
                  Current: {currentCurrency?.flag} {currentCurrency?.name} ({currentCurrency?.symbol})
                </div>
              </div>
              
              <div>
                <Label className="flex items-center space-x-2 mb-2">
                  <Globe className="w-4 h-4" />
                  <span>Language</span>
                </Label>
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                />
                <div className="mt-2 text-sm text-gray-500">
                  Current: {currentLanguage?.flag} {currentLanguage?.nativeName} ({currentLanguage?.name})
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Payment Preferences</span>
              </CardTitle>
              <CardDescription>
                Set your default payment method and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="flex items-center space-x-2 mb-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Default Payment Method</span>
                </Label>
                <PaymentMethodSelector
                  selectedMethod={selectedPaymentMethod}
                  onMethodChange={setSelectedPaymentMethod}
                  currency={selectedCurrency}
                  amount={1000}
                />
                <div className="mt-2 text-sm text-gray-500">
                  Current: {currentPaymentMethod?.icon} {currentPaymentMethod?.name}
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">Payment Fees</div>
                <div className="text-sm text-gray-600">
                  {currentPaymentMethod && currentPaymentMethod.fees.percentage > 0 && (
                    <div>{currentPaymentMethod.fees.percentage}% + {formatCurrency(currentPaymentMethod.fees.fixed, selectedCurrency)} per transaction</div>
                  )}
                  {currentPaymentMethod && currentPaymentMethod.fees.percentage === 0 && currentPaymentMethod.fees.fixed === 0 && (
                    <div className="text-green-600">No fees</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Email Notifications</div>
                    <div className="text-xs text-gray-500">Receive updates via email</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">SMS Notifications</div>
                    <div className="text-xs text-gray-500">Receive updates via SMS</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Push Notifications</div>
                    <div className="text-xs text-gray-500">Receive browser notifications</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Marketing Updates</div>
                    <div className="text-xs text-gray-500">Receive promotional content</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.marketing}
                    onChange={(e) => setNotifications({ ...notifications, marketing: e.target.checked })}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 px-8 py-3"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
