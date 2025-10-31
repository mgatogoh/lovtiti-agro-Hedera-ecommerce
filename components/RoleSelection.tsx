'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  ShoppingCart, 
  Truck, 
  Stethoscope, 
  Shield,
  CheckCircle
} from 'lucide-react';
import { UserRole, getRoleDisplayName, getRoleDescription, getRoleColor } from '@/utils/roleManager';

interface RoleSelectionProps {
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
  onContinue: () => void;
  isLoading?: boolean;
}

const roles: { role: UserRole; icon: any; description: string; features: string[] }[] = [
  {
    role: 'BUYER',
    icon: ShoppingCart,
    description: 'Individual or business that purchases agricultural products from farmers and distributors',
    features: ['Browse products', 'Place orders', 'Track purchases', 'Rate farmers']
  },
  {
    role: 'FARMER',
    icon: Package,
    description: 'Agricultural producer who grows and sells crops, livestock, and other farm products',
    features: ['List products', 'Manage orders', 'Track sales', 'Access analytics']
  },
  {
    role: 'DISTRIBUTOR',
    icon: Package,
    description: 'Supply chain intermediary who manages inventory and connects farmers with buyers',
    features: ['Manage inventory', 'Connect suppliers', 'Track distribution', 'Market insights']
  },
  {
    role: 'TRANSPORTER',
    icon: Truck,
    description: 'Logistics provider who handles transportation and delivery of agricultural products',
    features: ['Route optimization', 'Cargo tracking', 'Fleet management', 'Delivery analytics']
  },
  {
    role: 'AGROEXPERT',
    icon: Stethoscope,
    description: 'Agricultural expert who sells products, leases equipment, and provides expert advice',
    features: ['Sell products', 'Lease equipment', 'Expert consultations', 'Knowledge sharing']
  },
  {
    role: 'ADMIN',
    icon: Shield,
    description: 'Platform administrator with full access to all features and user management',
    features: ['User management', 'System oversight', 'Analytics', 'Platform control']
  }
];

export default function RoleSelection({ selectedRole, onRoleSelect, onContinue, isLoading = false }: RoleSelectionProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Role</h2>
        <p className="text-lg text-gray-600">
          Select the role that best describes your primary function on the platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {roles.map(({ role, icon: Icon, description, features }) => {
          const isSelected = selectedRole === role;
          const roleColors = getRoleColor(role);
          
          return (
            <Card
              key={role}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected 
                  ? 'ring-2 ring-green-500 shadow-lg bg-green-50' 
                  : 'hover:shadow-md hover:border-green-300'
              }`}
              onClick={() => onRoleSelect(role)}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full ${roleColors.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-8 h-8 ${roleColors.text}`} />
                </div>
                <CardTitle className="text-xl">{getRoleDisplayName(role)}</CardTitle>
                <CardDescription className="text-sm">{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-900 mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                {isSelected && (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="flex items-center text-green-600 font-medium">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Selected
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button
          onClick={onContinue}
          disabled={!selectedRole || isLoading}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Account...
            </div>
          ) : (
            'Continue with Registration'
          )}
        </Button>
        {!selectedRole && (
          <p className="text-sm text-gray-500 mt-2">
            Please select a role to continue
          </p>
        )}
      </div>
    </div>
  );
}
