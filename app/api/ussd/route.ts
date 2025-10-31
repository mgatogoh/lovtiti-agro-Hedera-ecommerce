import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, text, sessionId } = body;

    // Parse USSD input
    const input = text ? text.split('*').filter(Boolean) : [];
    const step = input.length;

    let response = '';

    switch (step) {
      case 0:
        // Initial menu
        response = `CON Welcome to Lovtiti Agro Mart
1. Browse Products
2. My Orders
3. Track Delivery
4. Agro Expert Services
5. Messages
6. Account Info
0. Exit`;
        break;

      case 1:
        const choice = input[0];
        switch (choice) {
          case '1':
            response = `CON Browse Products
1. Vegetables
2. Fruits
3. Grains
4. Livestock
5. Seeds
6. Equipment
0. Back`;
            break;
          case '2':
            response = `CON My Orders
1. Recent Orders
2. Order History
3. Track Order
0. Back`;
            break;
          case '3':
            response = `CON Track Delivery
Enter your order number to track delivery status.`;
            break;
          case '4':
            response = `CON Agro Expert Services
1. Expert Advice
2. Equipment Lease
3. Health Records
4. Consultations
0. Back`;
            break;
          case '5':
            response = `CON Messages
1. Send Message
2. View Messages
3. Call Support
0. Back`;
            break;
          case '6':
            response = `CON Account Info
1. Profile
2. Settings
3. Help
0. Back`;
            break;
          case '0':
            response = 'END Thank you for using Lovtiti Agro Mart!';
            break;
          default:
            response = 'END Invalid option. Please try again.';
        }
        break;

      case 2:
        const category = input[0];
        const subChoice = input[1];

        if (category === '1') {
          // Browse Products
          switch (subChoice) {
            case '1':
              response = `CON Vegetables Available
1. Tomatoes - ℏ500/kg
2. Onions - ℏ300/kg
3. Carrots - ℏ400/kg
4. Order Now
0. Back`;
              break;
            case '2':
              response = `CON Fruits Available
1. Mangoes - ℏ800/kg
2. Bananas - ℏ200/kg
3. Oranges - ℏ350/kg
4. Order Now
0. Back`;
              break;
            case '3':
              response = `CON Grains Available
1. Rice - ℏ800/kg
2. Maize - ℏ600/kg
3. Wheat - ℏ700/kg
4. Order Now
0. Back`;
              break;
            case '4':
              response = `CON Livestock Available
1. Cattle - ℏ150,000
2. Goats - ℏ25,000
3. Poultry - ℏ5,000
4. Order Now
0. Back`;
              break;
            case '5':
              response = `CON Seeds Available
1. Tomato Seeds - ℏ2,500
2. Rice Seeds - ℏ3,000
3. Maize Seeds - ℏ2,000
4. Order Now
0. Back`;
              break;
            case '6':
              response = `CON Equipment Available
1. Tractor - ℏ50,000/day
2. Irrigation - ℏ30,000/day
3. Harvesting - ℏ75,000/day
4. Lease Now
0. Back`;
              break;
            case '0':
              response = `CON Browse Products
1. Vegetables
2. Fruits
3. Grains
4. Livestock
5. Seeds
6. Equipment
0. Back`;
              break;
            default:
              response = 'END Invalid option. Please try again.';
          }
        } else if (category === '2') {
          // My Orders
          switch (subChoice) {
            case '1':
              response = `CON Recent Orders
1. Order #12345 - Tomatoes - Delivered
2. Order #12346 - Rice - In Transit
3. Order #12347 - Seeds - Processing
4. View Details
0. Back`;
              break;
            case '2':
              response = `CON Order History
1. Last 7 days
2. Last 30 days
3. All time
0. Back`;
              break;
            case '3':
              response = `CON Track Order
Enter your order number to track delivery status.`;
              break;
            case '0':
              response = `CON My Orders
1. Recent Orders
2. Order History
3. Track Order
0. Back`;
              break;
            default:
              response = 'END Invalid option. Please try again.';
          }
        } else if (category === '3') {
          // Track Delivery
          response = `CON Track Delivery
Enter your order number to track delivery status.`;
        } else if (category === '4') {
          // Agro Expert Services
          switch (subChoice) {
            case '1':
              response = `CON Expert Advice
1. Crop Management
2. Pest Control
3. Soil Health
4. Livestock Care
0. Back`;
              break;
            case '2':
              response = `CON Equipment Lease
1. Tractor Rental
2. Irrigation Systems
3. Harvesting Equipment
4. Soil Testing Kits
0. Back`;
              break;
            case '3':
              response = `CON Health Records
1. View Records
2. Add New Record
3. Update Record
0. Back`;
              break;
            case '4':
              response = `CON Consultations
1. Schedule Consultation
2. View Appointments
3. Emergency Contact
0. Back`;
              break;
            case '0':
              response = `CON Agro Expert Services
1. Expert Advice
2. Equipment Lease
3. Health Records
4. Consultations
0. Back`;
              break;
            default:
              response = 'END Invalid option. Please try again.';
          }
        } else if (category === '5') {
          // Messages
          switch (subChoice) {
            case '1':
              response = `CON Send Message
1. To Farmer
2. To Agro Expert
3. To Transporter
4. To Support
0. Back`;
              break;
            case '2':
              response = `CON View Messages
1. Inbox
2. Sent
3. Important
0. Back`;
              break;
            case '3':
              response = `CON Call Support
Support: +234-800-123-4567
Hours: 8AM - 6PM
0. Back`;
              break;
            case '0':
              response = `CON Messages
1. Send Message
2. View Messages
3. Call Support
0. Back`;
              break;
            default:
              response = 'END Invalid option. Please try again.';
          }
        } else if (category === '6') {
          // Account Info
          switch (subChoice) {
            case '1':
              response = `CON Profile
Name: John Farmer
Role: Farmer
Location: Lagos
Status: Active
0. Back`;
              break;
            case '2':
              response = `CON Settings
1. Change Language
2. Notifications
3. Privacy
0. Back`;
              break;
            case '3':
              response = `CON Help
1. FAQ
2. Contact Support
3. Tutorial
0. Back`;
              break;
            case '0':
              response = `CON Account Info
1. Profile
2. Settings
3. Help
0. Back`;
              break;
            default:
              response = 'END Invalid option. Please try again.';
          }
        }
        break;

      case 3:
        // Handle deeper menu levels
        response = 'END Thank you for using Lovtiti Agro Mart! For more options, visit our website or call support.';
        break;

      default:
        response = 'END Session expired. Please dial *123# to start again.';
    }

    return NextResponse.json({
      response,
      sessionId: sessionId || `session_${Date.now()}`,
      phoneNumber,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('USSD processing error:', error);
    return NextResponse.json(
      {
        response: 'END Sorry, there was an error processing your request. Please try again later.',
        error: 'USSD processing failed'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return USSD service status
    return NextResponse.json({
      status: 'active',
      service: 'Lovtiti Agro Mart USSD',
      code: '*123#',
      description: 'Agricultural marketplace USSD service',
      features: [
        'Browse Products',
        'Order Management',
        'Delivery Tracking',
        'Agro Expert Services',
        'Messaging',
        'Account Management'
      ],
      supportedNetworks: ['MTN', 'Airtel', 'Glo', '9mobile'],
      hours: '24/7',
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('USSD status error:', error);
    return NextResponse.json(
      { error: 'Failed to get USSD status' },
      { status: 500 }
    );
  }
}
