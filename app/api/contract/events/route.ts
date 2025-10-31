import { NextRequest, NextResponse } from 'next/server';
import { contractMonitoringService } from '@/utils/contractMonitoringService';

/**
 * GET /api/contract/events
 * Get contract events with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get('eventType') || undefined;
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const events = await contractMonitoringService.getEvents(eventType, limit, offset);
    
    return NextResponse.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error getting contract events:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get contract events' 
      },
      { status: 500 }
    );
  }
}


