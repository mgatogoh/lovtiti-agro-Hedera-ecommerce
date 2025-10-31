import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const { transactionId } = params;

    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID required" },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Query your database for the transaction
    // 2. Check with the payment provider (Stripe, MPESA, etc.)
    // 3. Return the current status

    // Mock implementation
    const mockStatus = {
      success: true,
      transaction_id: transactionId,
      status: 'completed', // 'pending', 'completed', 'failed', 'cancelled'
      amount: 1000,
      currency: 'USD',
      payment_method: 'stripe_card',
      order_id: 'order_123',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer_email: 'customer@example.com',
      metadata: {}
    };

    // Simulate different statuses based on transaction ID
    if (transactionId.includes('pending')) {
      mockStatus.status = 'pending';
    } else if (transactionId.includes('failed')) {
      mockStatus.status = 'failed';
    } else if (transactionId.includes('cancelled')) {
      mockStatus.status = 'cancelled';
    }

    return NextResponse.json(mockStatus);

  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: "Status check failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
