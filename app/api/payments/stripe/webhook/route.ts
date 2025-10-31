import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'payment_intent.canceled':
        await handlePaymentCancellation(event.data.object as Stripe.PaymentIntent);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment succeeded:', paymentIntent.id);
    
    // Here you would typically:
    // 1. Create an order record in your database
    // 2. Send confirmation email to customer
    // 3. Notify the seller
    // 4. Create supply chain tracking record
    // 5. Release funds from escrow (if applicable)
    
    const orderData = {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'paid',
      customerEmail: paymentIntent.metadata.customerEmail,
      deliveryAddress: paymentIntent.metadata.deliveryAddress,
      itemCount: paymentIntent.metadata.itemCount,
      totalItems: paymentIntent.metadata.totalItems,
      paidAt: new Date(),
    };

    // TODO: Save to database
    console.log('Order created:', orderData);
    
    // TODO: Send confirmation email
    // TODO: Notify seller
    // TODO: Create supply chain record
    
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment failed:', paymentIntent.id);
    
    // Here you would typically:
    // 1. Update order status to failed
    // 2. Send failure notification to customer
    // 3. Log the failure reason
    
    const failureData = {
      paymentIntentId: paymentIntent.id,
      status: 'failed',
      failureReason: paymentIntent.last_payment_error?.message || 'Unknown error',
      failedAt: new Date(),
    };

    // TODO: Update database
    console.log('Payment failure logged:', failureData);
    
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handlePaymentCancellation(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Payment canceled:', paymentIntent.id);
    
    // Here you would typically:
    // 1. Update order status to canceled
    // 2. Send cancellation notification to customer
    // 3. Restore inventory if applicable
    
    const cancellationData = {
      paymentIntentId: paymentIntent.id,
      status: 'canceled',
      canceledAt: new Date(),
    };

    // TODO: Update database
    console.log('Payment cancellation logged:', cancellationData);
    
  } catch (error) {
    console.error('Error handling payment cancellation:', error);
  }
}
