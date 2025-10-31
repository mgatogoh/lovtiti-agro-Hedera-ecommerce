'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Currency, 
  ChevronDown, 
  Globe, 
  RefreshCw,
  Check
} from 'lucide-react';
import { 
  SUPPORTED_CURRENCIES, 
  CRYPTO_CURRENCIES, 
  getCurrencyByCode, 
  convertCurrency,
  formatCurrency 
} from '@/utils/currency';

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  amount?: number;
  showCrypto?: boolean;
  className?: string;
}

export default function CurrencySelector({
  selectedCurrency,
  onCurrencyChange,
  amount = 0,
  showCrypto = true,
  className = ''
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversionAmount, setConversionAmount] = useState(amount);
  const [showConversion, setShowConversion] = useState(false);

  const currentCurrency = getCurrencyByCode(selectedCurrency);
  const currencies = showCrypto 
    ? [...SUPPORTED_CURRENCIES, ...CRYPTO_CURRENCIES]
    : SUPPORTED_CURRENCIES;

  const handleCurrencySelect = (currencyCode: string) => {
    onCurrencyChange(currencyCode);
    setIsOpen(false);
  };

  const handleConversion = () => {
    if (conversionAmount > 0) {
      setShowConversion(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 min-w-[120px]"
      >
        <Currency className="w-4 h-4" />
        <span className="font-medium">{currentCurrency?.symbol}</span>
        <span className="text-sm">{selectedCurrency}</span>
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Select Currency</span>
              </CardTitle>
              <CardDescription>
                Choose your preferred currency for transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Currency Conversion Tool */}
              {amount > 0 && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <RefreshCw className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Currency Converter</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {formatCurrency(amount, selectedCurrency)} converts to:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {currencies.slice(0, 4).map((currency) => {
                      const converted = convertCurrency(amount, selectedCurrency, currency.code);
                      return (
                        <div key={currency.code} className="flex justify-between">
                          <span>{currency.symbol}</span>
                          <span className="font-medium">
                            {formatCurrency(converted, currency.code)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Fiat Currencies */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Fiat Currencies</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {SUPPORTED_CURRENCIES.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencySelect(currency.code)}
                      className={`w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-colors ${
                        selectedCurrency === currency.code ? 'bg-green-50 border border-green-200' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{currency.flag}</span>
                        <div className="text-left">
                          <div className="font-medium text-sm">{currency.name}</div>
                          <div className="text-xs text-gray-500">{currency.country}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{currency.symbol}</span>
                        {selectedCurrency === currency.code && (
                          <Check className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cryptocurrencies */}
              {showCrypto && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Cryptocurrencies</h4>
                  <div className="space-y-1">
                    {CRYPTO_CURRENCIES.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => handleCurrencySelect(currency.code)}
                        className={`w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-colors ${
                          selectedCurrency === currency.code ? 'bg-green-50 border border-green-200' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{currency.flag}</span>
                          <div className="text-left">
                            <div className="font-medium text-sm">{currency.name}</div>
                            <div className="text-xs text-gray-500">{currency.country}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{currency.symbol}</span>
                          {selectedCurrency === currency.code && (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Exchange Rate Info */}
              <div className="pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500 text-center">
                  Exchange rates are updated in real-time
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
