'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import {
  Leaf,
  ShoppingCart,
  Menu,
  X,
  Package,
  Truck,
  Stethoscope,
  Users,
  Shield,
  Lock,
  Settings
} from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user } = useUser();
  const { totalItems } = useCart();

  // Get user role from metadata or user object
  const getUserRole = () => {
    if (!user) return null;

    // Get role from Clerk metadata
    const role = user.publicMetadata?.role as string;

    // If no role in metadata, try to get from database via API
    if (!role || role === 'UserRole') {
      // Fallback to 'BUYER' for now, but we should fetch from database
      return 'BUYER';
    }

    return role;
  };

  const userRole = getUserRole();

  // Get display name for role
  const getRoleDisplayName = (role: string | null) => {
    if (!role) return 'User';

    switch (role) {
      case 'BUYER': return 'Buyer';
      case 'FARMER': return 'Farmer';
      case 'DISTRIBUTOR': return 'Distributor';
      case 'TRANSPORTER': return 'Transporter';
      case 'AGROEXPERT': return 'Agro Expert';
      case 'ADMIN': return 'Admin';
      default: return role;
    }
  };

  const navigation = [
    { name: 'Marketplace', href: '/listings/browse', public: true },
    { name: 'Services', href: '/services', public: true },
    { name: 'Pricing', href: '/pricing', public: true },
    { name: 'Learn More', href: '/learn-more', public: true },
  ];



  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const getUserDashboard = () => {
    if (!userRole) return null;

    const roleToPath: { [key: string]: string } = {
      'FARMER': '/dashboard/farmer',
      'BUYER': '/dashboard/buyer',
      'DISTRIBUTOR': '/dashboard/distributor',
      'TRANSPORTER': '/dashboard/transporter',
      'AGROEXPERT': '/dashboard/agro-vet',
      'ADMIN': '/dashboard/farmer' // Default to farmer for admin
    };

    return roleToPath[userRole] || '/dashboard/buyer';
  };

  const getDashboardName = () => {
    if (!userRole) return 'Dashboard';

    const roleToName: { [key: string]: string } = {
      'FARMER': 'Farmer Dashboard',
      'BUYER': 'Buyer Dashboard',
      'DISTRIBUTOR': 'Distributor Dashboard',
      'TRANSPORTER': 'Transporter Dashboard',
      'AGROEXPERT': 'Agro Expert Dashboard',
      'ADMIN': 'Admin Dashboard'
    };

    return roleToName[userRole] || 'Dashboard';
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-green-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Leaf className="h-8 w-8 text-green-600 group-hover:text-green-700 transition-colors" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold text-green-800 group-hover:text-green-900 transition-colors">
              Lovtiti Agro Mart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive(item.href)
                  ? 'text-green-600 bg-green-50 shadow-sm'
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50 hover:shadow-sm'
                  }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Dashboard Link */}
            {user && userRole && (
              <Link
                href={getUserDashboard() || '/dashboard/buyer'}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${pathname.startsWith('/dashboard')
                  ? 'text-green-600 bg-green-50 shadow-sm'
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50 hover:shadow-sm'
                  }`}
              >
                <Users className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            )}


            {/* Cart Button */}
            <Link href="/cart">
              <Button
                variant="outline"
                size="sm"
                className="relative flex items-center space-x-2 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Cart</span>
                {totalItems > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                    {totalItems > 99 ? '99+' : totalItems}
                  </div>
                )}
              </Button>
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedOut>
              <Link href="/auth/login">
                <Button variant="outline" className="hover:bg-green-50 hover:border-green-300 transition-all duration-200">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-sm">
                  Get Started
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center space-x-3">
                <Link href="/settings">
                  <Button variant="outline" size="sm" className="hidden lg:flex items-center justify-center w-10 h-10 p-0">
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getRoleDisplayName(userRole)}
                  </p>
                </div>
                <UserButton />
              </div>
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-green-50 hover:border-green-300 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-green-200 py-4 bg-white/95 backdrop-blur-md">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive(item.href)
                    ? 'text-green-600 bg-green-50 shadow-sm'
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Dashboard Link */}
              {user && userRole && (
                <div className="pt-4 border-t border-green-200">
                  <Link
                    href={getUserDashboard() || '/dashboard/buyer'}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${pathname.startsWith('/dashboard')
                      ? 'text-green-600 bg-green-50 shadow-sm'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </div>
              )}

              {/* Mobile Cart */}
              <Link href="/cart" className="block">
                <Button
                  variant="outline"
                  size="sm"
                  className="relative w-full mt-4 flex items-center justify-center space-x-2 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Cart</span>
                  {totalItems > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                      {totalItems > 99 ? '99+' : totalItems}
                    </div>
                  )}
                </Button>
              </Link>

              {/* Mobile Auth */}
              <div className="mt-4 pt-4 border-t border-green-200 space-y-2">
                <SignedOut>
                  <Link href="/auth/login" className="block">
                    <Button variant="outline" className="w-full hover:bg-green-50 hover:border-green-300 transition-all duration-200">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="block">
                    <Button className="w-full bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-sm">
                      Get Started
                    </Button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getRoleDisplayName(userRole)}
                      </p>
                    </div>
                    <UserButton />
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}