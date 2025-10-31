import { NextRequest, NextResponse } from 'next/server';
import { applicationStartupService } from '@/utils/applicationStartupService';

/**
 * POST /api/system/initialize
 * Initialize all application services
 */
export async function POST(request: NextRequest) {
  try {
    await applicationStartupService.initialize();
    
    return NextResponse.json({
      success: true,
      message: 'Application services initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing application services:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to initialize services' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/system/status
 * Get application service status
 */
export async function GET(request: NextRequest) {
  try {
    const status = await applicationStartupService.getServiceStatus();
    
    return NextResponse.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Error getting service status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get service status' 
      },
      { status: 500 }
    );
  }
}


