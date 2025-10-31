import { NextRequest, NextResponse } from 'next/server';
import { deliveryTrackingService } from '@/utils/deliveryTrackingService';

/**
 * GET /api/delivery/tracking/[orderId]
 * Get delivery tracking for a specific order
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    if (!orderId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order ID is required' 
        },
        { status: 400 }
      );
    }

    const tracking = await deliveryTrackingService.getOrderTracking(orderId);

    return NextResponse.json({
      success: true,
      data: tracking
    });

  } catch (error) {
    console.error('Error getting order tracking:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get order tracking' 
      },
      { status: 500 }
    );
  }
}


