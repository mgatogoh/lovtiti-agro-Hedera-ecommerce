'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Leaf,
    AlertCircle,
    Loader2
} from 'lucide-react';

export default function LoginPage() {
    const { toast } = useToast();
    const { signIn } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await signIn(formData.email, formData.password);
            const userRole = (result.user?.role || 'buyer').toLowerCase();

            if (result.success) {
                toast({
                    title: "Welcome Back!",
                    description: "You have successfully signed in.",
                });

                // Redirect to intended page or dashboard
                const redirect = searchParams.get('redirect') || `/dashboard/${userRole}`;
                router.push(redirect);
            } else {
                setError(result.error || 'Login failed');
                toast({
                    title: "Login Failed",
                    description: result.error || "Invalid email or password. Please try again.",
                    variant: "destructive"
                });
            }
        } catch (error: any) {
            console.error('Login error:', error);
            setError(error.message || 'Login failed');
            toast({
                title: "Login Failed",
                description: error.message || "An error occurred. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Leaf className="h-8 w-8 text-green-600" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome Back</h1>
                    </div>
                    <p className="text-gray-600">Sign in to your Lovtiti Agro Mart account</p>
                </div>

                {/* Login Card */}
                <Card className="w-full shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                    <CardHeader className="text-center px-6 pt-8 pb-6">
                        <CardTitle className="text-2xl">Sign In</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-8">
                        {error && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-red-800">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    {error}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
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
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="pl-10 pr-10"
                                        required
                                        autoComplete="current-password"
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

                            <Button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-white text-gray-500 font-medium">or</span>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-4">
                                Don't have an account?
                            </p>
                            <Link href="/auth/signup-jwt">
                                <Button variant="outline" className="w-full hover:bg-green-50 hover:border-green-300">
                                    Create Account
                                </Button>
                            </Link>
                        </div>

                        {/* Features */}
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="text-xs text-green-800">
                                <p className="font-medium mb-2">🌾 Lovtiti Agro Mart Features:</p>
                                <ul className="space-y-1">
                                    <li>• Trade agricultural products with USDC</li>
                                    <li>• Escrow-protected transactions</li>
                                    <li>• Direct farmer-to-buyer connections</li>
                                    <li>• Blockchain-verified supply chain</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Links */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    <Link href="/help" className="hover:text-green-600 transition-colors">
                        Need help?
                    </Link>
                    {' • '}
                    <Link href="/privacy" className="hover:text-green-600 transition-colors">
                        Privacy Policy
                    </Link>
                    {' • '}
                    <Link href="/terms" className="hover:text-green-600 transition-colors">
                        Terms of Service
                    </Link>
                </div>
            </div>
        </div>
    );
}
