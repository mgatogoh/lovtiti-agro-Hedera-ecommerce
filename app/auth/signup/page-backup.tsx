'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSignUp } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Building,
  Truck,
  Stethoscope,
  Leaf,
  ShoppingCart,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const USER_ROLES = [
  {
    id: 'FARMER',
    title: 'Farmer',
    description: 'Sell your agricultural products directly to buyers',
    icon: Leaf,
    color: 'green',
    features: ['List products', 'Manage inventory', 'Track sales', 'Withdraw earnings']
  },
  {
    id: 'BUYER',
    title: 'Buyer',
    description: 'Source quality agricultural products from verified farmers',
    icon: ShoppingCart,
    color: 'blue',
    features: ['Browse products', 'Secure payments', 'Track orders', 'Quality assurance']
  },
  {
    id: 'DISTRIBUTOR',
    title: 'Distributor',
    description: 'Connect farmers with retailers and manage supply chains',
    icon: Building,
    color: 'purple',
    features: ['Bulk purchasing', 'Inventory management', 'Logistics coordination', 'Market analytics']
  },
  {
    id: 'TRANSPORTER',
    title: 'Transporter',
    description: 'Provide logistics and delivery services',
    icon: Truck,
    color: 'orange',
    features: ['Delivery requests', 'Route optimization', 'Real-time tracking', 'Payment processing']
  },
  {
    id: 'AGROEXPERT',
    title: 'Agro Expert',
    description: 'Offer veterinary services and agricultural expertise',
    icon: Stethoscope,
    color: 'red',
    features: ['Consultation services', 'Product sales', 'Expert advice', 'Equipment leasing']
  }
];

export default function SignupPage() {
  const { toast } = useToast();
  const { isLoaded, signUp, setActive } = useSignUp();
  const searchParams = useSearchParams();
  const preselectedRole = searchParams.get('role');

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(preselectedRole || '');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    location: '',
    walletId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (preselectedRole) {
      // Convert to uppercase to match our role IDs
      const normalizedRole = preselectedRole.toUpperCase();
      const roleExists = USER_ROLES.find(role => role.id === normalizedRole);

      if (roleExists) {
        setSelectedRole(normalizedRole);
        setStep(2); // Skip role selection and go directly to form
      }
    }
  }, [preselectedRole]);

  const connectMetaMask = async () => {
    try {
      setConnecting(true);
      if (!window.ethereum) {
        setError('MetaMask not detected. Please install MetaMask.');
        return;
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setFormData(prev => ({ ...prev, walletId: accounts[0] }));
        setError('');
        toast({
          title: "Wallet Connected",
          description: `Connected wallet: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to MetaMask.');
    } finally {
      setConnecting(false);
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setStep(2);
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.email) errors.push('Email is required');
    if (!formData.password) errors.push('Password is required');
    if (formData.password.length < 6) errors.push('Password must be at least 6 characters');
    if (!formData.fullName) errors.push('Full name is required');
    if (!formData.phone) errors.push('Phone number is required');
    if (!formData.location) errors.push('Location is required');
    if (!formData.walletId) errors.push('Wallet connection is required');

    return errors;
  };

  const handleNext = () => {
    if (step === 2) {
      const errors = validateForm();
      if (errors.length > 0) {
        toast({
          title: "Validation Error",
          description: errors.join(', '),
          variant: "destructive"
        });
        return;
      }
      // Proceed to submit
      handleSubmit();
      return;
    }

    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!isLoaded) return;

    setIsLoading(true);

    try {
      // Create the user with Clerk and set role metadata immediately
      const result = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.fullName.split(' ')[0] || formData.fullName,
        lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
      });

      // Send email verification
      await result.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
      setStep(3); // Move to verification step

      toast({
        title: "Verification Email Sent!",
        description: "Please check your email and enter the verification code.",
      });

    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Registration Failed",
        description: error.errors?.[0]?.message || error.message || "Failed to create account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!isLoaded) return;

    setIsLoading(true);

    try {
      // Verify the email code
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === 'complete') {
        // Set the active session
        await setActive({ session: completeSignUp.createdSessionId });

        // Create user profile in our database
        const response = await fetch('/api/auth/create-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: completeSignUp.createdUserId,
            email: formData.email,
            role: selectedRole,
            firstName: formData.fullName.split(' ')[0] || formData.fullName,
            lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
            profileData: {
              fullName: formData.fullName,
              phone: formData.phone,
              address: formData.location,
              hederaWallet: formData.walletId || 'Not provided'
            }
          }),

        });

        if (!response.ok) {
          console.warn('Failed to create user profile in database');
        }
        await fetch('/api/auth/sync-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: completeSignUp.createdUserId }),
        });

        toast({
          title: "Account Created Successfully!",
          description: "Welcome to Lovtiti Agro Mart!",
        });

        // Redirect to dashboard based on role
        window.location.href = `/dashboard/${selectedRole.toLowerCase()}`;
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.errors?.[0]?.message || "Invalid verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRoleData = USER_ROLES.find(role => role.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col items-center">

        {/* Header */}
        <div className="text-center mb-8 w-full">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Join Lovtiti Agro Mart</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">Create your account and start trading on Africa's premier agricultural marketplace</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8 w-full">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${step >= stepNumber
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {step > stepNumber ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-8 sm:w-12 h-1 mx-1 sm:mx-2 transition-colors ${step > stepNumber ? 'bg-green-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="w-full max-w-5xl">
            <Card className="w-full shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-6 px-6 pt-8">
                <CardTitle className="text-2xl font-bold text-gray-900">Choose Your Role</CardTitle>
                <CardDescription className="text-base text-gray-600 mt-2">
                  Select how you want to participate in our agricultural ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {USER_ROLES.map((role) => (
                    <Card
                      key={role.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col ${selectedRole === role.id ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50'
                        }`}
                      onClick={() => handleRoleSelect(role.id)}
                    >
                      <CardHeader className="text-center pb-3 flex-shrink-0">
                        <role.icon className={`h-12 w-12 mx-auto mb-3 text-${role.color}-600`} />
                        <CardTitle className="text-lg font-semibold">{role.title}</CardTitle>
                        <CardDescription className="text-sm text-gray-600 leading-relaxed">
                          {role.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 flex-grow flex flex-col justify-between">
                        <ul className="space-y-2">
                          {role.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Basic Information */}
        {step === 2 && selectedRoleData && (
          <div className="w-full max-w-2xl">
            <Card className="w-full shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center px-6 pt-8 pb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <selectedRoleData.icon className={`h-6 w-6 text-${selectedRoleData.color}-600`} />
                  <Badge variant="outline">{selectedRoleData.title}</Badge>
                  {preselectedRole && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep(1)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Change Role
                    </Button>
                  )}
                </div>
                <CardTitle className="text-2xl">Basic Information</CardTitle>
                <CardDescription>
                  {preselectedRole
                    ? `Complete your ${selectedRoleData.title.toLowerCase()} account setup`
                    : "Tell us about yourself to get started"
                  }
                </CardDescription>
                {preselectedRole && (
                  <div className="text-xs text-gray-500 mt-2">
                    Role preselected from dashboard link
                  </div>
                )}
              </CardHeader>
              <CardContent className="px-6 pb-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password (min 6 characters)"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        name="location"
                        type="text"
                        placeholder="City, Country"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  {/* Wallet Connection */}
                  <div className="space-y-2">
                    <Label htmlFor="walletId">Wallet *</Label>
                    {formData.walletId ? (
                      <div className="p-3 rounded-lg bg-green-50 flex items-center justify-between">
                        <span className="text-sm text-green-800 truncate">
                          Connected: {formData.walletId.slice(0, 8)}...{formData.walletId.slice(-6)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, walletId: '' }))}
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <Button
                          type="button"
                          onClick={connectMetaMask}
                          disabled={connecting}
                          className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          {connecting ? 'Connecting...' : 'Connect MetaMask'}
                        </Button>
                        <p className="text-sm text-gray-600">
                          Don’t have a wallet?{' '}
                          <a
                            href="https://portal.hedera.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 underline hover:text-green-700"
                          >
                            Create one here
                          </a>
                        </p>
                      </div>
                    )}
                    {error && <p className="text-sm text-red-600">{error}</p>}
                  </div>

                </div>

                {/* Platform Info */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-green-900 mb-1">Welcome to Lovtiti Agro Mart!</p>
                      <p className="text-green-700">
                        You can start using the platform immediately. Wallet connection is only required when creating product listings or making purchases.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-gray-700">
                        By creating an account, you agree to our{' '}
                        <Link href="/terms" className="text-green-600 hover:text-green-700 underline">Terms of Service</Link> and{' '}
                        <Link href="/privacy" className="text-green-600 hover:text-green-700 underline">Privacy Policy</Link>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  {!preselectedRole && (
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    disabled={isLoading}
                    className={preselectedRole ? "w-full" : "flex-1"}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <CheckCircle className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Email Verification */}
        {step === 3 && pendingVerification && (
          <div className="w-full max-w-2xl">
            <Card className="w-full shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center px-6 pt-8 pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">Verify Your Email</CardTitle>
                <CardDescription className="text-base text-gray-600 mt-2">
                  We've sent a verification code to {formData.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="verificationCode"
                      name="verificationCode"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="pl-10 text-center text-lg tracking-widest"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-blue-700">
                        Didn't receive the code? Check your spam folder or{' '}
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="text-blue-600 hover:text-blue-800 underline font-medium"
                          disabled={isLoading}
                        >
                          resend verification email
                        </button>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep(2);
                      setPendingVerification(false);
                    }}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleVerification}
                    disabled={isLoading || verificationCode.length !== 6}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify & Create Account
                        <CheckCircle className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Login Link */}
        <div className="text-center mt-8 w-full">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}