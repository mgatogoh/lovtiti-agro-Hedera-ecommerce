import { NextRequest, NextResponse } from 'next/server';
import { deliveryTrackingService, DeliveryUpdate } from '@/utils/deliveryTrackingService';

/**
 * POST /api/delivery/update
 * Update delivery status for an order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status, location, latitude, longitude, notes, estimatedDelivery, actualDelivery, deliveryProof, carrier, trackiHBARumber } = body;

    // Validate required fields
    if (!orderId || !status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: orderId, status'
        },
        { status: 400 }
      );
    }

    const update: DeliveryUpdate = {
      orderId,
      status,
      location,
      latitude,
      longitude,
      notes,
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined,
      actualDelivery: actualDelivery ? new Date(actualDelivery) : undefined,
      deliveryProof,
      carrier,
      trackiHBARumber
    };

    const result = await deliveryTrackingService.updateDeliveryStatus(update);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error updating delivery status:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update delivery status'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/delivery/stats
 * Get delivery statistics
 */
export async function GET(request: NextRequest) {
  try {
    const stats = await deliveryTrackingService.getDeliveryStats();

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting delivery stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get delivery statistics'
      },
      { status: 500 }
    );
  }
}


