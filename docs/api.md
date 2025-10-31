# API Documentation - Lovtiti Agro Mart

## Overview
Lovtiti Agro Mart provides a comprehensive REST API for managing agricultural supply chain operations across multiple stakeholder types: farmers, distributors, transporters, buyers, and agro experts.

## Base URL
```
Production: https://lovittiagro.com/api
Development: http://localhost:3000/api
```

## Authentication
All API endpoints require authentication via Clerk JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <clerk_jwt_token>
```

## User Roles & Permissions

### Role Types
- `FARMER` - Agricultural producers
- `DISTRIBUTOR` - Supply chain intermediaries
- `TRANSPORTER` - Logistics service providers
- `BUYER` - Product purchasers
- `AGROEXPERT` - Animal health professionals
- `ADMIN` - Platform administrators

### Role-Based Access Control
Each endpoint validates user roles and permissions before processing requests.

## API Endpoints

### Authentication & User Management

#### POST /auth/clerk
Webhook endpoint for Clerk user events
```json
{
  "type": "user.created",
  "data": {
    "id": "user_123",
    "email_addresses": [{"email_address": "user@example.com"}],
    "created_at": 1234567890
  }
}
```

#### GET /auth/profile
Get current user profile
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "role": "FARMER",
  "kycStatus": "APPROVED",
  "profile": {
    "fullName": "John Farmer",
    "country": "Nigeria",
    "address": "Lagos, Nigeria",
    "phone": "+2348000000000",
    "hederaWallet": "0.0.123456"
  }
}
```

### KYC Verification

#### POST /kyc/submit
Submit KYC verification documents
```json
{
  "role": "FARMER",
  "fullName": "John Farmer",
  "country": "Nigeria",
  "address": "Lagos, Nigeria",
  "phone": "+2348000000000",
  "idNumber": "1234567890",
  "hederaWallet": "0.0.123456",
  "documents": {
    "idDocument": "base64_encoded_image",
    "businessLicense": "base64_encoded_image",
    "certifications": ["cert1.pdf", "cert2.pdf"]
  }
}
```

#### GET /kyc/status
Check KYC verification status
```json
{
  "status": "APPROVED",
  "submittedAt": "2024-01-15T10:00:00Z",
  "reviewedAt": "2024-01-16T14:30:00Z",
  "reviewer": "admin_123",
  "notes": "All documents verified successfully"
}
```

### Product & Service Listings

#### GET /listings
Get all listings with filtering and pagination
**Query Parameters:**
- `category` - Filter by category (Vegetables, Fruits, Logistics, Veterinary, etc.)
- `role` - Filter by listing creator role
- `location` - Filter by location
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `search` - Text search
- `sortBy` - Sort by (newest, price-low, price-high, rating)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "listings": [
    {
      "id": "listing_123",
      "title": "Fresh Organic Tomatoes",
      "description": "Premium organic tomatoes",
      "productDescription": "Detailed product information",
      "priceCents": 50000,
      "quantity": 100,
      "unit": "kg",
      "category": "Vegetables",
      "location": "Lagos, Nigeria",
      "images": ["image1.jpg", "image2.jpg"],
      "video": "product_video.mp4",
      "harvestDate": "2024-01-15T00:00:00Z",
      "expiryDate": "2024-01-25T00:00:00Z",
      "isActive": true,
      "isVerified": true,
      "seller": {
        "id": "user_123",
        "email": "farmer@example.com",
        "profiles": [{
          "fullName": "John Farmer",
          "country": "Nigeria"
        }]
      },
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

#### POST /listings
Create a new listing (requires appropriate role)
```json
{
  "title": "Fresh Organic Tomatoes",
  "description": "Premium organic tomatoes",
  "productDescription": "Detailed product information",
  "priceCents": 50000,
  "quantity": 100,
  "unit": "kg",
  "category": "Vegetables",
  "location": "Lagos, Nigeria",
  "harvestDate": "2024-01-15T00:00:00Z",
  "expiryDate": "2024-01-25T00:00:00Z",
  "images": ["image1.jpg", "image2.jpg"],
  "video": "product_video.mp4"
}
```

#### GET /listings/[id]
Get specific listing details
```json
{
  "id": "listing_123",
  "title": "Fresh Organic Tomatoes",
  "description": "Premium organic tomatoes",
  "productDescription": "Detailed product information",
  "priceCents": 50000,
  "quantity": 100,
  "unit": "kg",
  "category": "Vegetables",
  "location": "Lagos, Nigeria",
  "images": ["image1.jpg", "image2.jpg"],
  "video": "product_video.mp4",
  "harvestDate": "2024-01-15T00:00:00Z",
  "expiryDate": "2024-01-25T00:00:00Z",
  "isActive": true,
  "isVerified": true,
  "seller": {
    "id": "user_123",
    "email": "farmer@example.com",
    "profiles": [{
      "fullName": "John Farmer",
      "country": "Nigeria",
      "address": "Lagos, Nigeria",
      "phone": "+2348000000000",
      "kycStatus": "APPROVED"
    }]
  },
  "orders": [
    {
      "id": "order_456",
      "status": "COMPLETED",
      "amountCents": 50000,
      "createdAt": "2024-01-16T10:00:00Z"
    }
  ],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

#### PUT /listings/[id]
Update listing (only by owner)
```json
{
  "title": "Updated Product Title",
  "description": "Updated description",
  "priceCents": 55000,
  "quantity": 80
}
```

#### DELETE /listings/[id]
Soft delete listing (only by owner)
```json
{
  "message": "Listing deleted successfully"
}
```

### Order Management

#### POST /orders
Create a new order
```json
{
  "listingId": "listing_123",
  "quantity": 10,
  "deliveryAddress": "Buyer Address, Lagos, Nigeria",
  "deliveryDate": "2024-01-20T00:00:00Z",
  "paymentMethod": "HBAR",
  "notes": "Special delivery instructions"
}
```

#### GET /orders
Get user's orders
**Query Parameters:**
- `status` - Filter by order status
- `role` - Filter by user role (buyer/seller)
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "orders": [
    {
      "id": "order_456",
      "listingId": "listing_123",
      "buyerId": "user_789",
      "sellerId": "user_123",
      "quantity": 10,
      "totalAmountCents": 500000,
      "status": "PENDING",
      "paymentMethod": "HBAR",
      "hederaEscrow": "0x1234567890abcdef",
      "deliveryAddress": "Buyer Address, Lagos, Nigeria",
      "deliveryDate": "2024-01-20T00:00:00Z",
      "createdAt": "2024-01-16T10:00:00Z",
      "updatedAt": "2024-01-16T10:00:00Z",
      "listing": {
        "title": "Fresh Organic Tomatoes",
        "seller": {
          "profiles": [{
            "fullName": "John Farmer"
          }]
        }
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "pages": 2
  }
}
```

#### PUT /orders/[id]/status
Update order status
```json
{
  "status": "SHIPPED",
  "trackiHBARumber": "TRK123456789",
  "notes": "Package shipped via logistics partner"
}
```

### Supply Chain Tracking

#### GET /tracking/[orderId]
Get real-time order tracking information
```json
{
  "orderId": "order_456",
  "status": "IN_TRANSIT",
  "currentLocation": {
    "latitude": 6.5244,
    "longitude": 3.3792,
    "address": "Lagos, Nigeria",
    "timestamp": "2024-01-18T14:30:00Z"
  },
  "route": [
    {
      "location": "Farm Location",
      "timestamp": "2024-01-17T08:00:00Z",
      "status": "PICKED_UP"
    },
    {
      "location": "Distribution Center",
      "timestamp": "2024-01-17T12:00:00Z",
      "status": "IN_TRANSIT"
    },
    {
      "location": "Buyer Address",
      "timestamp": null,
      "status": "PENDING_DELIVERY"
    }
  ],
  "estimatedDelivery": "2024-01-20T16:00:00Z",
  "transporter": {
    "id": "user_456",
    "name": "Fast Logistics Ltd",
    "phone": "+2348000000001"
  }
}
```

#### POST /tracking/[orderId]/update
Update tracking information (transporters only)
```json
{
  "location": {
    "latitude": 6.5244,
    "longitude": 3.3792,
    "address": "Current Location"
  },
  "status": "IN_TRANSIT",
  "notes": "Making good progress, on schedule"
}
```

### Messaging & Communication (STREAM API)

#### GET /messages
Get user's messages from STREAM API
**Query Parameters:**
- `conversationId` - Filter by conversation
- `unread` - Filter unread messages only
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "messages": [
    {
      "id": "msg_123",
      "conversationId": "conv_456",
      "senderId": "user_123",
      "recipientId": "user_789",
      "content": "Hello, I'm interested in your tomatoes",
      "messageType": "TEXT",
      "attachments": [],
      "isRead": false,
      "createdAt": "2024-01-16T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "pages": 1
  }
}
```

#### POST /messages
Send a new message via STREAM API
```json
{
  "recipientId": "user_789",
  "content": "Hello, I'm interested in your tomatoes",
  "messageType": "TEXT",
  "attachments": []
}
```

#### POST /video-call/start
Start a video call session
```json
{
  "recipientId": "user_789",
  "callType": "CONSULTATION",
  "description": "Agricultural advice consultation"
}
```

#### GET /video-call/token
Get STREAM video call token
**Query Parameters:**
- `channelId` - STREAM channel ID
- `userId` - User ID for token generation

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-01-16T11:00:00Z"
}
```

### Agro Expert Services

#### GET /agro-vet/products
Get agro expert products (seeds, vaccines, pesticides, equipment)
**Query Parameters:**
- `productType` - Filter by product type (SEEDS, VACCINES, PESTICIDES, EQUIPMENT, FERTILIZERS, TOOLS)
- `category` - Filter by category
- `location` - Filter by location
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `search` - Text search
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "products": [
    {
      "id": "product_123",
      "productType": "SEEDS",
      "title": "High-Yield Maize Seeds",
      "description": "Premium quality maize seeds for optimal yield",
      "priceCents": 15000,
      "quantity": 100,
      "unit": "kg",
      "category": "Cereals",
      "images": ["seed1.jpg", "seed2.jpg"],
      "location": "Lagos, Nigeria",
      "isActive": true,
      "isVerified": true,
      "agroVet": {
        "id": "user_456",
        "profiles": [{
          "fullName": "Dr. John AgroVet",
          "country": "Nigeria"
        }]
      },
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

#### POST /agro-vet/products
Create agro expert product listing
```json
{
  "productType": "SEEDS",
  "title": "High-Yield Maize Seeds",
  "description": "Premium quality maize seeds for optimal yield",
  "priceCents": 15000,
  "quantity": 100,
  "unit": "kg",
  "category": "Cereals",
  "images": ["seed1.jpg", "seed2.jpg"],
  "location": "Lagos, Nigeria"
}
```

#### GET /agro-vet/equipment
Get available equipment for lease
**Query Parameters:**
- `equipment` - Filter by equipment type
- `location` - Filter by location
- `minRate` - Minimum daily rate
- `maxRate` - Maximum daily rate
- `available` - Filter available equipment only

**Response:**
```json
{
  "equipment": [
    {
      "id": "equipment_123",
      "equipment": "Tractor",
      "description": "John Deere 5055D Tractor",
      "dailyRate": 50000,
      "currency": "USD",
      "location": "Lagos, Nigeria",
      "agroVet": {
        "id": "user_456",
        "profiles": [{
          "fullName": "Dr. John AgroVet"
        }]
      },
      "isAvailable": true,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

#### POST /agro-vet/equipment/lease
Request equipment lease
```json
{
  "equipmentId": "equipment_123",
  "startDate": "2024-01-20T00:00:00Z",
  "endDate": "2024-01-25T00:00:00Z",
  "notes": "Need for maize planting season"
}
```

#### GET /agro-vet/advice
Get expert agricultural advice
**Query Parameters:**
- `adviceType` - Filter by advice type (CROP_MANAGEMENT, PEST_CONTROL, SOIL_HEALTH, LIVESTOCK_CARE, EQUIPMENT_USAGE)
- `isPublic` - Filter public advice only
- `search` - Text search
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "advice": [
    {
      "id": "advice_123",
      "title": "Maize Planting Best Practices",
      "description": "Comprehensive guide for optimal maize cultivation",
      "adviceType": "CROP_MANAGEMENT",
      "content": "Detailed advice content...",
      "attachments": ["guide.pdf", "video.mp4"],
      "isPublic": true,
      "agroVet": {
        "id": "user_456",
        "profiles": [{
          "fullName": "Dr. John AgroVet"
        }]
      },
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "pages": 2
  }
}
```

#### POST /agro-vet/advice
Request expert agricultural advice
```json
{
  "title": "Pest Control for Tomatoes",
  "description": "Need advice on managing aphids in tomato plants",
  "adviceType": "PEST_CONTROL",
  "content": "Detailed description of the problem...",
  "attachments": ["pest_photo.jpg"]
}
```

### Analytics & Reporting

#### GET /analytics/dashboard
Get dashboard analytics for current user
```json
{
  "userRole": "FARMER",
  "metrics": {
    "totalListings": 25,
    "activeOrders": 12,
    "completedOrders": 150,
    "totalRevenue": 2500000,
    "averageRating": 4.8,
    "responseTime": "2.5 hours"
  },
  "charts": {
    "revenueTrend": [
      {"date": "2024-01-01", "revenue": 100000},
      {"date": "2024-01-02", "revenue": 120000}
    ],
    "orderStatus": {
      "pending": 5,
      "shipped": 3,
      "delivered": 4
    }
  }
}
```

#### GET /analytics/supply-chain
Get supply chain analytics
```json
{
  "totalOrders": 1250,
  "averageDeliveryTime": "3.2 days",
  "onTimeDeliveryRate": 94.5,
  "supplyChainEfficiency": 87.2,
  "geographicDistribution": {
    "Nigeria": 45,
    "Ghana": 25,
    "Kenya": 20,
    "Other": 10
  }
}
```

### Hedera Blockchain Integration

#### POST /transactions/transfer
Execute HBAR transfer
```json
{
  "to": "0.0.123456",
  "amountTinybar": "1000000000"
}
```

#### GET /transactions/history
Get transaction history
```json
{
  "transactions": [
    {
      "id": "tx_123",
      "type": "TRANSFER",
      "from": "0.0.123456",
      "to": "0.0.789012",
      "amount": "1000000000",
      "status": "SUCCESS",
      "timestamp": "2024-01-16T10:00:00Z",
      "hash": "0xabcdef1234567890"
    }
  ]
}
```

## Error Responses

### Standard Error Format
```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": "Additional error details",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-16T10:00:00Z"
}
```

### Common Error Codes
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request data
- `RATE_LIMITED` - Too many requests
- `BLOCKCHAIN_ERROR` - Hedera transaction failed
- `PAYMENT_ERROR` - Payment processing failed

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

## Rate Limiting
- **Standard Users:** 100 requests per minute
- **Premium Users:** 500 requests per minute
- **Admin Users:** 1000 requests per minute

## Webhooks
The API supports webhooks for real-time notifications:
- Order status changes
- Payment confirmations
- Supply chain updates
- New messages

Configure webhook endpoints in your account settings.

## SDKs & Libraries
- **JavaScript/TypeScript:** `@lovittiagro/sdk`
- **Python:** `lovittiagro-python`
- **PHP:** `lovittiagro-php`
- **Java:** `lovittiagro-java`

## Support
For API support and questions:
- **Email:** api-support@lovittiagro.com
- **Documentation:** https://docs.lovittiagro.com
- **Status Page:** https://status.lovittiagro.com