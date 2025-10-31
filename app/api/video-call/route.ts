import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { participants, type = 'video' } = body;

    // In production, this would create a STREAM video call session
    // For now, generate a mock session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const session = {
      id: sessionId,
      type,
      participants,
      status: 'created',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      token: `token_${sessionId}` // Mock token
    };

    return NextResponse.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Error creating video call session:', error);
    return NextResponse.json(
      { error: 'Failed to create video call session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // In production, this would fetch session details from STREAM API
    // For now, return mock data
    const session = {
      id: sessionId,
      type: 'video',
      participants: [
        { id: 'farmer1', name: 'John Farmer', role: 'farmer' },
        { id: 'vet1', name: 'Dr. Ahmed Vet', role: 'AGROEXPERT' }
      ],
      status: 'active',
      createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      token: `token_${sessionId}`
    };

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error fetching video call session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video call session' },
      { status: 500 }
    );
  }
}
