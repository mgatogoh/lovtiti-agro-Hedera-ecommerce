import { NextRequest, NextResponse } from 'next/server';
import { contractMonitoringService } from '@/utils/contractMonitoringService';

/**
 * GET /api/contract/stats
 * Get contract statistics
 */
export async function GET(request: NextRequest) {
  try {
    const stats = await contractMonitoringService.getStats();
    
    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting contract stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get contract statistics' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/contract/process-events
 * Manually process unprocessed events
 */
export async function POST(request: NextRequest) {
  try {
    await contractMonitoringService.processUnprocessedEvents();
    
    return NextResponse.json({
      success: true,
      message: 'Unprocessed events processed successfully'
    });
  } catch (error) {
    console.error('Error processing unprocessed events:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process unprocessed events' 
      },
      { status: 500 }
    );
  }
}


