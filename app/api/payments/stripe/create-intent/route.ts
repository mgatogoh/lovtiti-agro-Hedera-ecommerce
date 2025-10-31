import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, deliveryInfo, totals } = body;

    // Validate required fields
    if (!items || !deliveryInfo || !totals) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'HBAR', // Nigerian Naira
        product_data: {
          name: item.name,
          description: item.description,
          images: item.images,
          metadata: {
            productId: item.productId,
            listingId: item.listingId,
            sellerId: item.sellerId,
            sellerType: item.sellerType,
            category: item.category,
            location: item.location,
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to kobo (cents)
      },
      quantity: item.quantity,
    }));

    // Add delivery fee
    lineItems.push({
      price_data: {
        currency: 'HBAR',
        product_data: {
          name: 'Delivery Fee',
          description: 'Standard delivery to your location',
        },
        unit_amount: Math.round(totals.deliveryFee * 100),
      },
      quantity: 1,
    });

    // Add service fee
    lineItems.push({
      price_data: {
        currency: 'HBAR',
        product_data: {
          name: 'Service Fee',
          description: 'Platform service fee (2.5%)',
        },
        unit_amount: Math.round(totals.serviceFee * 100),
      },
      quantity: 1,
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totals.total * 100), // Convert to kobo
      currency: 'HBAR',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderType: 'agricultural_products',
        deliveryAddress: `${deliveryInfo.address}, ${deliveryInfo.city}, ${deliveryInfo.state}`,
        customerEmail: deliveryInfo.email,
        customerPhone: deliveryInfo.phone,
        itemCount: items.length.toString(),
        totalItems: items.reduce((sum: number, item: any) => sum + item.quantity, 0).toString(),
      },
      shipping: {
        name: deliveryInfo.fullName,
        address: {
          line1: deliveryInfo.address,
          city: deliveryInfo.city,
          state: deliveryInfo.state,
          postal_code: deliveryInfo.postalCode,
          country: deliveryInfo.country,
        },
        phone: deliveryInfo.phone,
      },
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('Stripe payment intent creation error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: 'Payment processing error',
          message: error.message,
          type: error.type
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
