import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      amount,
      currency,
      phone_number,
      order_id,
      customer_name,
      metadata
    } = await req.json();

    // Validate required fields
    if (!amount || !currency || !phone_number || !order_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^(\+254|254|0)?[0-9]{9}$/; // Kenyan phone format
    if (!phoneRegex.test(phone_number.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Initialize MPESA Daraja API with your credentials
    // 2. Generate access token
    // 3. Initiate STK Push
    // 4. Handle the callback
    // 5. Return the appropriate response

    // Mock implementation for now
    const mockResponse = {
      success: true,
      transaction_id: `mpesa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      amount: amount,
      currency: currency,
      phone_number: phone_number,
      order_id: order_id,
      customer_name: customer_name,
      metadata: metadata || {},
      message: "STK Push sent to your phone. Please complete the payment on your mobile device."
    };

    console.log('MPESA payment initiated:', mockResponse);

    return NextResponse.json(mockResponse);

  } catch (error) {
    console.error('MPESA payment error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: "Payment processing failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// MPESA callback handler
export async function PUT(req: NextRequest) {
  try {
    const callbackData = await req.json();
    
    // In a real implementation, you would:
    // 1. Validate the callback signature
    // 2. Process the payment result
    // 3. Update your database
    // 4. Send notifications

    console.log('MPESA callback received:', callbackData);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('MPESA callback error:', error);
    return NextResponse.json(
      { error: "Callback processing failed" },
      { status: 500 }
    );
  }
}
