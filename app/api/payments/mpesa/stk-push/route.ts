import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface MpesaConfig {
  businessShortCode: string;
  passkey: string;
  consumerKey: string;
  consumerSecret: string;
  environment: 'sandbox' | 'production';
}

const mpesaConfig: MpesaConfig = {
  businessShortCode: process.env.MPESA_SHORTCODE!,
  passkey: process.env.MPESA_PASSKEY!,
  consumerKey: process.env.MPESA_CONSUMER_KEY!,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
  environment: (process.env.MPESA_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
};

const baseUrl = mpesaConfig.environment === 'production' 
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, deliveryInfo, totals, phoneNumber } = body;

    // Validate required fields
    if (!items || !deliveryInfo || !totals || !phoneNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate phone number format (should be 254XXXXXXXXX)
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('254') 
      ? cleanPhone 
      : `254${cleanPhone.substring(cleanPhone.length - 9)}`;

    // Get access token
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error('Failed to get MPESA access token');
    }

    // Generate password
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(
      `${mpesaConfig.businessShortCode}${mpesaConfig.passkey}${timestamp}`
    ).toString('base64');

    // Prepare STK Push request
    const stkPushRequest = {
      BusinessShortCode: mpesaConfig.businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(totals.total), // Amount in KES
      PartyA: formattedPhone,
      PartyB: mpesaConfig.businessShortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/mpesa/callback`,
      AccountReference: `AGRO-${Date.now()}`,
      TransactionDesc: `Payment for ${items.length} agricultural products`,
    };

    // Make STK Push request
    const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushRequest),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('MPESA STK Push error:', result);
      return NextResponse.json(
        { 
          error: 'MPESA payment failed',
          message: result.errorMessage || 'Unknown error',
          requestId: result.requestId 
        },
        { status: 400 }
      );
    }

    // Store payment request for tracking
    const paymentRequest = {
      checkoutRequestId: result.CheckoutRequestID,
      merchantRequestId: result.MerchantRequestID,
      customerMessage: result.CustomerMessage,
      responseCode: result.ResponseCode,
      responseDescription: result.ResponseDescription,
      phoneNumber: formattedPhone,
      amount: totals.total,
      items: items,
      deliveryInfo: deliveryInfo,
      createdAt: new Date(),
    };

    // TODO: Save payment request to database for tracking
    console.log('MPESA payment request stored:', paymentRequest);

    return NextResponse.json({
      success: true,
      checkoutRequestId: result.CheckoutRequestID,
      merchantRequestId: result.MerchantRequestID,
      customerMessage: result.CustomerMessage,
      message: 'STK Push initiated successfully. Please check your phone to complete the payment.',
    });

  } catch (error) {
    console.error('MPESA STK Push error:', error);
    return NextResponse.json(
      { 
        error: 'Payment processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function getAccessToken(): Promise<string | null> {
  try {
    const auth = Buffer.from(`${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`).toString('base64');
    
    const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('MPESA auth error:', result);
      return null;
    }

    return result.access_token;
  } catch (error) {
    console.error('Error getting MPESA access token:', error);
    return null;
  }
}
