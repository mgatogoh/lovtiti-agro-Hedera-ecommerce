'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CreditCard, 
  Smartphone, 
  Coins, 
  ChevronDown, 
  Check,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import { 
  PAYMENT_METHODS, 
  getPaymentMethodsByCurrency,
  calculatePaymentFees
} from '@/utils/payments';
import { getCurrencyByCode, formatCurrency } from '@/utils/currency';

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  currency: string;
  amount: number;
  className?: string;
}

export default function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  currency,
  amount,
  className = ''
}: PaymentMethodSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentMethod = PAYMENT_METHODS.find(method => method.id === selectedMethod);
  const availableMethods = getPaymentMethodsByCurrency(currency);

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'stripe':
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'mpesa':
        return <Smartphone className="w-5 h-5 text-green-600" />;
      case 'crypto':
        return <Coins className="w-5 h-5 text-orange-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-600" />;
    }
  };

  const getMethodTypeIcon = (type: string) => {
    switch (type) {
      case 'stripe':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'mpesa':
        return <Zap className="w-4 h-4 text-green-500" />;
      case 'crypto':
        return <Globe className="w-4 h-4 text-orange-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleMethodSelect = (methodId: string) => {
    onMethodChange(methodId);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 min-w-[140px]"
      >
        {currentMethod && getMethodIcon(currentMethod.type)}
        <span className="font-medium">{currentMethod?.name || 'Select Payment'}</span>
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Payment Methods</span>
              </CardTitle>
              <CardDescription>
                Choose how you'd like to pay for your order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Payment Amount Info */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Order Total:</div>
                <div className="text-lg font-semibold">
                  {formatCurrency(amount, currency)}
                </div>
              </div>

              {/* Available Payment Methods */}
              <div className="space-y-2">
                {availableMethods.map((method) => {
                  const fees = calculatePaymentFees(amount, method);
                  const isSelected = selectedMethod === method.id;
                  
                  return (
                    <button
                      key={method.id}
                      onClick={() => handleMethodSelect(method.id)}
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        isSelected 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            {getMethodIcon(method.type)}
                            {getMethodTypeIcon(method.type)}
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-sm">{method.name}</div>
                            <div className="text-xs text-gray-500">{method.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {formatCurrency(fees.total, currency)}
                            </div>
                            {fees.fees > 0 && (
                              <div className="text-xs text-gray-500">
                                +{formatCurrency(fees.fees, currency)} fees
                              </div>
                            )}
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Payment Security Info */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>All payments are secured with industry-standard encryption</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
