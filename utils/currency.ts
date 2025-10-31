// Currency utilities for Lovtiti Agro Mart

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  country: string;
  flag: string;
  exchangeRate: number; // Base rate against USD
  decimalPlaces: number;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    country: 'United States',
    flag: '🇺🇸',
    exchangeRate: 1.0,
    decimalPlaces: 2
  },
  {
    code: 'HBAR',
    name: 'Nigerian Naira',
    symbol: 'ℏ',
    country: 'Nigeria',
    flag: '🇳🇬',
    exchangeRate: 1600.0,
    decimalPlaces: 2
  },
  {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    country: 'Kenya',
    flag: '🇰🇪',
    exchangeRate: 130.0,
    decimalPlaces: 2
  },
  {
    code: 'GHS',
    name: 'Ghanaian Cedi',
    symbol: '₵',
    country: 'Ghana',
    flag: '🇬🇭',
    exchangeRate: 12.0,
    decimalPlaces: 2
  },
  {
    code: 'UGX',
    name: 'Ugandan Shilling',
    symbol: 'USh',
    country: 'Uganda',
    flag: '🇺🇬',
    exchangeRate: 3700.0,
    decimalPlaces: 0
  },
  {
    code: 'TZS',
    name: 'Tanzanian Shilling',
    symbol: 'TSh',
    country: 'Tanzania',
    flag: '🇹🇿',
    exchangeRate: 2500.0,
    decimalPlaces: 2
  },
  {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    country: 'South Africa',
    flag: '🇿🇦',
    exchangeRate: 18.0,
    decimalPlaces: 2
  },
  {
    code: 'EGP',
    name: 'Egyptian Pound',
    symbol: 'E£',
    country: 'Egypt',
    flag: '🇪🇬',
    exchangeRate: 50.0,
    decimalPlaces: 2
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    country: 'European Union',
    flag: '🇪🇺',
    exchangeRate: 0.85,
    decimalPlaces: 2
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    country: 'United Kingdom',
    flag: '🇬🇧',
    exchangeRate: 0.73,
    decimalPlaces: 2
  }
];

export const CRYPTO_CURRENCIES: Currency[] = [
  {
    code: 'HBAR',
    name: 'Hedera Hashgraph',
    symbol: 'ℏ',
    country: 'Global',
    flag: '🔗',
    exchangeRate: 0.05,
    decimalPlaces: 8
  },
  {
    code: 'BTC',
    name: 'Bitcoin',
    symbol: '₿',
    country: 'Global',
    flag: '₿',
    exchangeRate: 0.000025,
    decimalPlaces: 8
  },
  {
    code: 'ETH',
    name: 'Ethereum',
    symbol: 'Ξ',
    country: 'Global',
    flag: 'Ξ',
    exchangeRate: 0.0004,
    decimalPlaces: 6
  },
  {
    code: 'USDT',
    name: 'Tether USD',
    symbol: '₮',
    country: 'Global',
    flag: '₮',
    exchangeRate: 1.0,
    decimalPlaces: 2
  }
];

export const getCurrencyByCode = (code: string): Currency | undefined => {
  return [...SUPPORTED_CURRENCIES, ...CRYPTO_CURRENCIES].find(currency => currency.code === code);
};

export const getCurrencyByCountry = (country: string): Currency | undefined => {
  return SUPPORTED_CURRENCIES.find(currency =>
    currency.country.toLowerCase().includes(country.toLowerCase())
  );
};

export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number => {
  const from = getCurrencyByCode(fromCurrency);
  const to = getCurrencyByCode(toCurrency);

  if (!from || !to) return amount;

  // Convert to USD first, then to target currency
  const usdAmount = amount / from.exchangeRate;
  const convertedAmount = usdAmount * to.exchangeRate;

  return convertedAmount;
};

export const formatCurrency = (
  amount: number,
  currencyCode: string,
  locale: string = 'en-US'
): string => {
  const currency = getCurrencyByCode(currencyCode);
  if (!currency) return amount.toString();

  const formattedAmount = amount.toFixed(currency.decimalPlaces);

  // For crypto currencies, use custom formatting
  if (CRYPTO_CURRENCIES.some(crypto => crypto.code === currencyCode)) {
    return `${currency.symbol}${formattedAmount}`;
  }

  // For fiat currencies, use Intl.NumberFormat
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currency.decimalPlaces,
      maximumFractionDigits: currency.decimalPlaces
    }).format(amount);
  } catch (error) {
    // Fallback formatting
    return `${currency.symbol}${formattedAmount}`;
  }
};

export const getDefaultCurrency = (country: string): Currency => {
  const currency = getCurrencyByCountry(country);
  return currency || SUPPORTED_CURRENCIES[0]; // Default to USD
};

export const getCurrencyOptions = (): Array<{ value: string; label: string; flag: string }> => {
  return SUPPORTED_CURRENCIES.map(currency => ({
    value: currency.code,
    label: `${currency.flag} ${currency.name} (${currency.code})`,
    flag: currency.flag
  }));
};

export const getCryptoOptions = (): Array<{ value: string; label: string; flag: string }> => {
  return CRYPTO_CURRENCIES.map(currency => ({
    value: currency.code,
    label: `${currency.flag} ${currency.name} (${currency.code})`,
    flag: currency.flag
  }));
};

export const getAllPaymentCurrencies = (): Array<{ value: string; label: string; flag: string; type: 'fiat' | 'crypto' }> => {
  const fiatOptions = SUPPORTED_CURRENCIES.map(currency => ({
    value: currency.code,
    label: `${currency.flag} ${currency.name} (${currency.code})`,
    flag: currency.flag,
    type: 'fiat' as const
  }));

  const cryptoOptions = CRYPTO_CURRENCIES.map(currency => ({
    value: currency.code,
    label: `${currency.flag} ${currency.name} (${currency.code})`,
    flag: currency.flag,
    type: 'crypto' as const
  }));

  return [...fiatOptions, ...cryptoOptions];
};
