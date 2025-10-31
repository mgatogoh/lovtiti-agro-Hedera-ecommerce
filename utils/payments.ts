// Payment utilities for Lovtiti Agro Mart
import { AgroContractService, createAgroContractService } from './agroContract';
import { BuyProductParams } from '../types/agro-contract';

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'stripe' | 'mpesa' | 'crypto' | 'agro-contract';
  currency: string;
  icon: string;
  description: string;
  enabled: boolean;
  fees: {
    percentage: number;
    fixed: number;
  };
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethod: string;
  orderId: string;
  customerInfo: {
    email: string;
    phone?: string;
    name: string;
  };
  metadata?: Record<string, any>;
  // Agro contract specific fields
  productId?: string;
  walletAddress?: string;
  privateKey?: string;
  userId?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  error?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'stripe_card',
    name: 'Credit/Debit Card',
    type: 'stripe',
    currency: 'USD',
    icon: '💳',
    description: 'Pay with Visa, Mastercard, or American Express',
    enabled: true,
    fees: { percentage: 2.9, fixed: 0.30 }
  },
  {
    id: 'stripe_bank',
    name: 'Bank Transfer',
    type: 'stripe',
    currency: 'USD',
    icon: '🏦',
    description: 'Direct bank transfer (ACH)',
    enabled: true,
    fees: { percentage: 0.8, fixed: 0.00 }
  },
  {
    id: 'mpesa_kenya',
    name: 'MPESA (Kenya)',
    type: 'mpesa',
    currency: 'KES',
    icon: '📱',
    description: 'Mobile money payment via MPESA',
    enabled: true,
    fees: { percentage: 0.0, fixed: 0.00 }
  },
  {
    id: 'mpesa_tanzania',
    name: 'M-Pesa (Tanzania)',
    type: 'mpesa',
    currency: 'TZS',
    icon: '📱',
    description: 'Mobile money payment via M-Pesa',
    enabled: true,
    fees: { percentage: 0.0, fixed: 0.00 }
  },
  {
    id: 'mpesa_uganda',
    name: 'MTN Mobile Money (Uganda)',
    type: 'mpesa',
    currency: 'UGX',
    icon: '📱',
    description: 'Mobile money payment via MTN',
    enabled: true,
    fees: { percentage: 0.0, fixed: 0.00 }
  },
  {
    id: 'hbar',
    name: 'Hedera HBAR',
    type: 'crypto',
    currency: 'HBAR',
    icon: '🔗',
    description: 'Pay with Hedera Hashgraph HBAR',
    enabled: true,
    fees: { percentage: 0.0, fixed: 0.00 }
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    type: 'crypto',
    currency: 'BTC',
    icon: '₿',
    description: 'Pay with Bitcoin',
    enabled: true,
    fees: { percentage: 0.0, fixed: 0.00 }
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    type: 'crypto',
    currency: 'ETH',
    icon: 'Ξ',
    description: 'Pay with Ethereum',
    enabled: true,
    fees: { percentage: 0.0, fixed: 0.00 }
  },
  {
    id: 'usdt',
    name: 'Tether USD',
    type: 'crypto',
    currency: 'USDT',
    icon: '₮',
    description: 'Pay with Tether USD (USDT)',
    enabled: true,
    fees: { percentage: 0.0, fixed: 0.00 }
  },
  {
    id: 'agro_contract',
    name: 'Agro Contract (ETH)',
    type: 'agro-contract',
    currency: 'ETH',
    icon: '🌾',
    description: 'Pay directly through the Agro smart contract',
    enabled: true,
    fees: { percentage: 0.0, fixed: 0.00 }
  }
];

export const getPaymentMethodsByCurrency = (currency: string): PaymentMethod[] => {
  return PAYMENT_METHODS.filter(method =>
    method.currency === currency ||
    method.type === 'crypto' ||
    method.type === 'stripe'
  );
};

export const getPaymentMethodsByType = (type: 'stripe' | 'mpesa' | 'crypto' | 'agro-contract'): PaymentMethod[] => {
  return PAYMENT_METHODS.filter(method => method.type === type && method.enabled);
};

export const calculatePaymentFees = (
  amount: number,
  paymentMethod: PaymentMethod
): { total: number; fees: number; net: number } => {
  const fees = (amount * paymentMethod.fees.percentage / 100) + paymentMethod.fees.fixed;
  const total = amount + fees;
  const net = amount;

  return { total, fees, net };
};

// Stripe Payment Integration
export const processStripePayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const response = await fetch('/api/payments/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(request.amount * 100), // Convert to cents
        currency: request.currency.toLowerCase(),
        payment_method: request.paymentMethod,
        order_id: request.orderId,
        customer_email: request.customerInfo.email,
        customer_name: request.customerInfo.name,
        metadata: request.metadata
      })
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        transactionId: data.transaction_id,
        paymentUrl: data.payment_url,
        status: 'pending'
      };
    } else {
      return {
        success: false,
        error: data.error || 'Payment failed',
        status: 'failed'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error',
      status: 'failed'
    };
  }
};

// MPESA Payment Integration
export const processMpesaPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const response = await fetch('/api/payments/mpesa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: request.amount,
        currency: request.currency,
        phone_number: request.customerInfo.phone,
        order_id: request.orderId,
        customer_name: request.customerInfo.name,
        metadata: request.metadata
      })
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        transactionId: data.transaction_id,
        status: 'pending'
      };
    } else {
      return {
        success: false,
        error: data.error || 'Payment failed',
        status: 'failed'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error',
      status: 'failed'
    };
  }
};

// Agro Contract Payment Integration
export const processAgroContractPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  try {
    // Validate required fields for agro contract payment
    if (!request.productId || !request.walletAddress || !request.privateKey || !request.userId) {
      return {
        success: false,
        error: 'Missing required fields for agro contract payment: productId, walletAddress, privateKey, userId',
        status: 'failed'
      };
    }

    const response = await fetch('/api/agro/purchase/buy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: request.productId,
        amount: request.amount,
        value: request.amount, // Assuming amount is in wei/ETH
        walletAddress: request.walletAddress,
        privateKey: request.privateKey,
        userId: request.userId,
        orderId: request.orderId,
        metadata: request.metadata
      })
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        transactionId: data.data.transactionHash,
        status: 'completed'
      };
    } else {
      return {
        success: false,
        error: data.error || 'Agro contract payment failed',
        status: 'failed'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error',
      status: 'failed'
    };
  }
};

// Main payment processor
export const processPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  const paymentMethod = PAYMENT_METHODS.find(method => method.id === request.paymentMethod);

  if (!paymentMethod) {
    return {
      success: false,
      error: 'Invalid payment method',
      status: 'failed'
    };
  }

  switch (paymentMethod.type) {
    case 'stripe':
      return await processStripePayment(request);
    case 'mpesa':
      return await processMpesaPayment(request);
    case 'crypto':
      return await processPayment(request);
    case 'agro-contract':
      return await processAgroContractPayment(request);
    default:
      return {
        success: false,
        error: 'Unsupported payment method',
        status: 'failed'
      };
  }
};

// Payment status checker
export const checkPaymentStatus = async (transactionId: string): Promise<PaymentResponse> => {
  try {
    const response = await fetch(`/api/payments/status/${transactionId}`);
    const data = await response.json();

    return {
      success: data.success,
      transactionId: data.transaction_id,
      status: data.status,
      error: data.error
    };
  } catch (error) {
    return {
      success: false,
      error: 'Network error',
      status: 'failed'
    };
  }
};

// Get supported currencies for each payment method
export const getSupportedCurrencies = (paymentMethod: string): string[] => {
  const method = PAYMENT_METHODS.find(m => m.id === paymentMethod);
  if (!method) return [];

  switch (method.type) {
    case 'stripe':
      return ['USD', 'EUR', 'GBP', 'HBAR', 'KES', 'GHS', 'ZAR'];
    case 'mpesa':
      return ['KES', 'TZS', 'UGX'];
    case 'crypto':
      return ['HBAR', 'BTC', 'ETH', 'USDT'];
    default:
      return [];
  }
};
