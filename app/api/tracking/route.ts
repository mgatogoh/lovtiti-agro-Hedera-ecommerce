import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // In production, this would fetch real-time tracking data from Redis/database
    // For now, return mock data
    const trackingData = {
      orderId,
      status: 'In Transit',
      currentLocation: {
        lat: 6.4474,
        lng: 3.3903,
        address: 'Lagos-Ibadan Expressway'
      },
      events: [
        {
          id: '1',
          status: 'Order Placed',
          location: 'Green Valley Farm, Lagos',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
          description: 'Order placed and confirmed by farmer',
          actor: 'Green Valley Farm',
          coordinates: { lat: 6.5244, lng: 3.3792 }
        },
        {
          id: '2',
          status: 'Quality Check',
          location: 'Green Valley Farm, Lagos',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
          description: 'Quality inspection completed - Grade A tomatoes',
          actor: 'Dr. Ahmed Vet',
          coordinates: { lat: 6.5244, lng: 3.3792 }
        },
        {
          id: '3',
          status: 'Picked Up',
          location: 'Green Valley Farm, Lagos',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
          description: 'Package picked up by transporter',
          actor: 'Fast Logistics Ltd',
          coordinates: { lat: 6.5244, lng: 3.3792 }
        },
        {
          id: '4',
          status: 'In Transit',
          location: 'Lagos-Ibadan Expressway',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          description: 'Package in transit to destination',
          actor: 'Fast Logistics Ltd',
          coordinates: { lat: 6.4474, lng: 3.3903 }
        }
      ],
      estimatedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 4),
      lastUpdated: new Date()
    };

    return NextResponse.json({ tracking: trackingData });
  } catch (error) {
    console.error('Error fetching tracking data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracking data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status, location, description, actor, coordinates } = body;

    // In production, this would update tracking data in Redis/database
    // and send real-time updates via WebSocket
    const trackingEvent = {
      id: Date.now().toString(),
      orderId,
      status,
      location,
      description,
      actor,
      coordinates,
      timestamp: new Date()
    };

    // Simulate WebSocket broadcast to connected clients
    // In production, this would use Redis pub/sub or WebSocket server
    console.log('Broadcasting tracking update:', trackingEvent);

    return NextResponse.json({ 
      success: true, 
      event: trackingEvent 
    });
  } catch (error) {
    console.error('Error updating tracking data:', error);
    return NextResponse.json(
      { error: 'Failed to update tracking data' },
      { status: 500 }
    );
  }
}
