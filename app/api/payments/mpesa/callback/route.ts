import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('MPESA Callback received:', JSON.stringify(body, null, 2));

    // Extract callback data
    const {
      Body: {
        stkCallback: {
          CheckoutRequestID,
          ResultCode,
          ResultDesc,
          CallbackMetadata,
        }
      }
    } = body;

    // Handle successful payment
    if (ResultCode === 0) {
      const metadata = CallbackMetadata?.Item || [];
      
      const paymentData = {
        checkoutRequestId: CheckoutRequestID,
        resultCode: ResultCode,
        resultDesc: ResultDesc,
        amount: metadata.find((item: any) => item.Name === 'Amount')?.Value,
        mpesaReceiptNumber: metadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value,
        transactionDate: metadata.find((item: any) => item.Name === 'TransactionDate')?.Value,
        phoneNumber: metadata.find((item: any) => item.Name === 'PhoneNumber')?.Value,
        status: 'completed',
        processedAt: new Date(),
      };

      console.log('MPESA Payment successful:', paymentData);

      // TODO: Update order status in database
      // TODO: Send confirmation email to customer
      // TODO: Notify seller
      // TODO: Create supply chain tracking record
      // TODO: Release funds from escrow (if applicable)

      return NextResponse.json({
        success: true,
        message: 'Payment processed successfully',
        data: paymentData,
      });
    } else {
      // Handle failed payment
      const failureData = {
        checkoutRequestId: CheckoutRequestID,
        resultCode: ResultCode,
        resultDesc: ResultDesc,
        status: 'failed',
        failedAt: new Date(),
      };

      console.log('MPESA Payment failed:', failureData);

      // TODO: Update order status to failed
      // TODO: Send failure notification to customer
      // TODO: Log failure reason

      return NextResponse.json({
        success: false,
        message: 'Payment failed',
        data: failureData,
      });
    }

  } catch (error) {
    console.error('MPESA Callback error:', error);
    return NextResponse.json(
      { 
        error: 'Callback processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests for testing
export async function GET() {
  return NextResponse.json({
    message: 'MPESA Callback endpoint is active',
    timestamp: new Date().toISOString(),
  });
}
