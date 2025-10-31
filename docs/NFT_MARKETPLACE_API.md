# 🌾 NFT Marketplace API Documentation - Lovtiti Agro Mart

## Overview
The NFT Marketplace API extends the core Lovtiti Agro Mart platform with comprehensive Web3 functionality, enabling users to create, trade, and manage agricultural products, services, and equipment as Non-Fungible Tokens (NFTs) on Hedera Hashgraph.

## Base URL
```
Production: https://lovittiagro.com/api/nft
Development: http://localhost:3000/api/nft
```

## Authentication
All NFT API endpoints require authentication via Clerk JWT tokens and Hedera wallet connection:
```
Authorization: Bearer <clerk_jwt_token>
X-Hedera-Account: <hedera_account_id>
X-Hedera-Signature: <signed_message>
```

## NFT Standards
- **Token Standard**: HTS-721 (Hedera Token Service - Non-Fungible)
- **Metadata Storage**: IPFS with JSON-LD format
- **Smart Contracts**: Deployed on Hedera Testnet/Mainnet

---

## 🎯 Core NFT Operations

### NFT Management

#### POST /mint
Mint a new NFT for agricultural products, services, or equipment
```json
{
  "category": "PRODUCT", // "PRODUCT" | "SERVICE" | "EQUIPMENT"
  "metadata": {
    "name": "Premium Organic Tomatoes",
    "description": "Fresh organic tomatoes from certified farm",
    "image": "ipfs://QmHash...",
    "attributes": {
      "productType": "CROP",
      "variety": "Cherry Tomatoes",
      "quantity": 100,
      "unit": "kg",
      "harvestDate": "2024-01-15T00:00:00Z",
      "expiryDate": "2024-01-25T00:00:00Z",
      "qualityGrade": "A",
      "certifications": ["Organic", "Fair Trade"],
      "location": {
        "latitude": 6.5244,
        "longitude": 3.3792,
        "address": "Lagos, Nigeria",
        "farmId": "farm_123"
      },
      "sustainability": {
        "waterUsage": "Low",
        "carbonFootprint": "Minimal",
        "pesticideFree": true
      }
    }
  },
  "royalties": {
    "percentage": 2.5,
    "recipient": "0.0.123456"
  }
}
```

**Response:**
```json
{
  "success": true,
  "nft": {
    "tokenId": "0.0.789012",
    "contractAddress": "0.0.345678",
    "transactionHash": "0xabcdef1234567890",
    "ipfsHash": "QmHash...",
    "owner": "0.0.123456",
    "creator": "0.0.123456",
    "metadata": {
      "name": "Premium Organic Tomatoes",
      "description": "Fresh organic tomatoes from certified farm",
      "image": "ipfs://QmHash...",
      "attributes": { /* ... */ }
    },
    "royalties": {
      "percentage": 2.5,
      "recipient": "0.0.123456"
    },
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

#### GET /:tokenId
Get detailed information about a specific NFT
```json
{
  "success": true,
  "nft": {
    "tokenId": "0.0.789012",
    "contractAddress": "0.0.345678",
    "owner": "0.0.123456",
    "creator": "0.0.123456",
    "category": "PRODUCT",
    "metadata": {
      "name": "Premium Organic Tomatoes",
      "description": "Fresh organic tomatoes from certified farm",
      "image": "ipfs://QmHash...",
      "attributes": {
        "productType": "CROP",
        "variety": "Cherry Tomatoes",
        "quantity": 100,
        "unit": "kg",
        "harvestDate": "2024-01-15T00:00:00Z",
        "expiryDate": "2024-01-25T00:00:00Z",
        "qualityGrade": "A",
        "certifications": ["Organic", "Fair Trade"],
        "location": {
          "latitude": 6.5244,
          "longitude": 3.3792,
          "address": "Lagos, Nigeria",
          "farmId": "farm_123"
        }
      }
    },
    "royalties": {
      "percentage": 2.5,
      "recipient": "0.0.123456"
    },
    "supplyChain": [
      {
        "step": 1,
        "action": "Harvested",
        "location": "Farm Field A",
        "timestamp": "2024-01-15T08:00:00Z",
        "actor": "0.0.123456",
        "verified": true
      },
      {
        "step": 2,
        "action": "Quality Check",
        "location": "Quality Control Center",
        "timestamp": "2024-01-15T10:00:00Z",
        "actor": "0.0.456789",
        "verified": true
      }
    ],
    "listing": {
      "isListed": true,
      "price": 50.0,
      "currency": "HBAR",
      "listingTime": "2024-01-15T11:00:00Z",
      "expiryTime": "2024-01-25T11:00:00Z"
    },
    "tradingHistory": [
      {
        "transactionHash": "0xabcdef1234567890",
        "from": "0.0.123456",
        "to": "0.0.789012",
        "price": 45.0,
        "timestamp": "2024-01-10T14:30:00Z"
      }
    ],
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

#### PUT /:tokenId/metadata
Update NFT metadata (only by owner)
```json
{
  "metadata": {
    "description": "Updated description",
    "attributes": {
      "quantity": 80,
      "qualityGrade": "A+",
      "certifications": ["Organic", "Fair Trade", "Rainforest Alliance"]
    }
  }
}
```

#### DELETE /:tokenId
Burn (destroy) an NFT (only by owner)
```json
{
  "success": true,
  "message": "NFT burned successfully",
  "transactionHash": "0xabcdef1234567890"
}
```

---

## 🏪 Marketplace Operations

### Listing Management

#### POST /marketplace/list
List an NFT for sale on the marketplace
```json
{
  "tokenId": "0.0.789012",
  "contractAddress": "0.0.345678",
  "price": 50.0,
  "currency": "HBAR", // "HBAR" | "USD"
  "expiryTime": "2024-01-25T00:00:00Z",
  "category": "PRODUCT",
  "description": "Fresh organic tomatoes for sale"
}
```

**Response:**
```json
{
  "success": true,
  "listing": {
    "id": "listing_123",
    "tokenId": "0.0.789012",
    "contractAddress": "0.0.345678",
    "seller": "0.0.123456",
    "price": 50.0,
    "currency": "HBAR",
    "isActive": true,
    "listingTime": "2024-01-15T11:00:00Z",
    "expiryTime": "2024-01-25T00:00:00Z",
    "transactionHash": "0xabcdef1234567890"
  }
}
```

#### GET /marketplace/listings
Browse NFT listings with advanced filtering
**Query Parameters:**
- `category` - Filter by category (PRODUCT, SERVICE, EQUIPMENT)
- `productType` - Filter by product type (CROP, LIVESTOCK, FISHERY, etc.)
- `serviceType` - Filter by service type (TRANSPORT, CONSULTATION, etc.)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `currency` - Currency filter (HBAR, USD)
- `location` - Location filter
- `qualityGrade` - Quality grade filter (A, B, C)
- `certifications` - Certification filter
- `search` - Text search
- `sortBy` - Sort by (newest, price-low, price-high, rating)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "listings": [
    {
      "id": "listing_123",
      "tokenId": "0.0.789012",
      "contractAddress": "0.0.345678",
      "category": "PRODUCT",
      "seller": {
        "address": "0.0.123456",
        "name": "John Farmer",
        "rating": 4.8,
        "verified": true
      },
      "nft": {
        "metadata": {
          "name": "Premium Organic Tomatoes",
          "image": "ipfs://QmHash...",
          "attributes": {
            "productType": "CROP",
            "variety": "Cherry Tomatoes",
            "quantity": 100,
            "unit": "kg",
            "qualityGrade": "A",
            "certifications": ["Organic", "Fair Trade"],
            "location": {
              "address": "Lagos, Nigeria"
            }
          }
        }
      },
      "price": 50.0,
      "currency": "HBAR",
      "isActive": true,
      "listingTime": "2024-01-15T11:00:00Z",
      "expiryTime": "2024-01-25T00:00:00Z",
      "views": 125,
      "favorites": 8
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  },
  "filters": {
    "categories": ["PRODUCT", "SERVICE", "EQUIPMENT"],
    "priceRange": {
      "min": 1.0,
      "max": 1000.0
    },
    "locations": ["Lagos, Nigeria", "Accra, Ghana", "Nairobi, Kenya"]
  }
}
```

#### PUT /marketplace/listings/:listingId
Update listing details (only by seller)
```json
{
  "price": 55.0,
  "description": "Updated description",
  "expiryTime": "2024-01-30T00:00:00Z"
}
```

#### DELETE /marketplace/listings/:listingId
Cancel a listing (only by seller)
```json
{
  "success": true,
  "message": "Listing cancelled successfully",
  "transactionHash": "0xabcdef1234567890"
}
```

### Trading Operations

#### POST /marketplace/buy
Purchase an NFT from the marketplace
```json
{
  "listingId": "listing_123",
  "paymentMethod": "HBAR", // "HBAR" | "USD"
  "deliveryAddress": {
    "street": "123 Buyer Street",
    "city": "Lagos",
    "state": "Lagos State",
    "country": "Nigeria",
    "postalCode": "100001"
  },
  "deliveryInstructions": "Leave at front door",
  "insurance": true
}
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "id": "tx_456",
    "listingId": "listing_123",
    "buyer": "0.0.789012",
    "seller": "0.0.123456",
    "tokenId": "0.0.789012",
    "price": 50.0,
    "currency": "HBAR",
    "escrowId": "escrow_789",
    "status": "PENDING",
    "transactionHash": "0xabcdef1234567890",
    "createdAt": "2024-01-16T10:00:00Z"
  },
  "nextSteps": {
    "escrowCreated": true,
    "paymentRequired": true,
    "estimatedDelivery": "2024-01-20T00:00:00Z"
  }
}
```

#### POST /marketplace/auction/create
Create an auction for an NFT
```json
{
  "tokenId": "0.0.789012",
  "contractAddress": "0.0.345678",
  "startingPrice": 10.0,
  "reservePrice": 50.0,
  "currency": "HBAR",
  "duration": 86400, // seconds (24 hours)
  "description": "Rare vintage wine collection auction"
}
```

#### POST /marketplace/auction/:auctionId/bid
Place a bid on an auction
```json
{
  "amount": 45.0,
  "currency": "HBAR"
}
```

---

## 🔒 Escrow System

### Escrow Management

#### GET /escrow/:transactionId
Get escrow transaction details
```json
{
  "success": true,
  "escrow": {
    "id": "escrow_789",
    "transactionId": "tx_456",
    "buyer": "0.0.789012",
    "seller": "0.0.123456",
    "tokenId": "0.0.789012",
    "amount": 50.0,
    "currency": "HBAR",
    "status": "PENDING_DELIVERY", // "PENDING_PAYMENT", "PENDING_DELIVERY", "DELIVERED", "RELEASED", "DISPUTED"
    "deliveryStatus": {
      "isShipped": false,
      "trackiHBARumber": null,
      "estimatedDelivery": "2024-01-20T00:00:00Z",
      "actualDelivery": null
    },
    "paymentStatus": {
      "isPaid": true,
      "paymentHash": "0xabcdef1234567890",
      "paidAt": "2024-01-16T10:30:00Z"
    },
    "createdAt": "2024-01-16T10:00:00Z",
    "expiresAt": "2024-01-23T10:00:00Z"
  }
}
```

#### POST /escrow/:transactionId/delivery
Update delivery status (seller only)
```json
{
  "status": "SHIPPED",
  "trackiHBARumber": "TRK123456789",
  "carrier": "Fast Logistics",
  "estimatedDelivery": "2024-01-19T00:00:00Z",
  "notes": "Package shipped, tracking available"
}
```

#### POST /escrow/:transactionId/confirm-delivery
Confirm delivery received (buyer only)
```json
{
  "confirmed": true,
  "rating": 5,
  "feedback": "Excellent quality, fast delivery!"
}
```

#### POST /escrow/:transactionId/release
Release escrow funds to seller (buyer only)
```json
{
  "reason": "DELIVERY_CONFIRMED",
  "rating": 5,
  "feedback": "Perfect transaction"
}
```

#### POST /escrow/:transactionId/dispute
Create a dispute for escrow transaction
```json
{
  "reason": "QUALITY_ISSUE",
  "description": "Product quality does not match description",
  "evidence": [
    "ipfs://QmEvidence1...",
    "ipfs://QmEvidence2..."
  ]
}
```

---

## 🔗 Supply Chain Integration

### Supply Chain Tracking

#### POST /supply-chain/:tokenId/step
Add a new step to NFT supply chain
```json
{
  "action": "Quality Check",
  "location": "Quality Control Center, Lagos",
  "actor": "0.0.456789",
  "metadata": {
    "qualityScore": 95,
    "temperature": 4.5,
    "humidity": 65,
    "inspector": "Dr. Jane Smith",
    "certificate": "ipfs://QmCertificate..."
  },
  "timestamp": "2024-01-15T10:00:00Z"
}
```

#### GET /supply-chain/:tokenId
Get complete supply chain history for an NFT
```json
{
  "success": true,
  "tokenId": "0.0.789012",
  "supplyChain": [
    {
      "step": 1,
      "action": "Harvested",
      "location": "Farm Field A, Lagos",
      "actor": "0.0.123456",
      "metadata": {
        "harvestMethod": "Hand Picked",
        "weather": "Sunny",
        "temperature": 28
      },
      "timestamp": "2024-01-15T08:00:00Z",
      "verified": true,
      "verifiedBy": "0.0.456789",
      "verifiedAt": "2024-01-15T08:15:00Z"
    },
    {
      "step": 2,
      "action": "Quality Check",
      "location": "Quality Control Center, Lagos",
      "actor": "0.0.456789",
      "metadata": {
        "qualityScore": 95,
        "temperature": 4.5,
        "humidity": 65,
        "inspector": "Dr. Jane Smith",
        "certificate": "ipfs://QmCertificate..."
      },
      "timestamp": "2024-01-15T10:00:00Z",
      "verified": true,
      "verifiedBy": "0.0.456789",
      "verifiedAt": "2024-01-15T10:05:00Z"
    }
  ],
  "totalSteps": 2,
  "verificationRate": 100.0,
  "lastUpdated": "2024-01-15T10:05:00Z"
}
```

#### POST /supply-chain/:tokenId/verify
Verify a supply chain step
```json
{
  "stepIndex": 1,
  "verified": true,
  "notes": "Quality check passed with excellent results"
}
```

---

## 🚛 Service NFT Management

### Service Bookings

#### POST /services/:tokenId/book
Book a service NFT
```json
{
  "serviceType": "TRANSPORT", // "TRANSPORT" | "CONSULTATION" | "EQUIPMENT_LEASE" | "VETERINARY"
  "startTime": "2024-01-20T09:00:00Z",
  "endTime": "2024-01-20T17:00:00Z",
  "location": {
    "pickup": "Farm Location, Lagos",
    "delivery": "Market Location, Lagos"
  },
  "requirements": {
    "capacity": 1000, // kg
    "temperature": 4, // Celsius
    "specialInstructions": "Handle with care"
  },
  "paymentMethod": "HBAR"
}
```

#### GET /services/:tokenId/bookings
Get service booking history
```json
{
  "success": true,
  "tokenId": "0.0.789012",
  "serviceType": "TRANSPORT",
  "bookings": [
    {
      "id": "booking_123",
      "client": "0.0.789012",
      "startTime": "2024-01-20T09:00:00Z",
      "endTime": "2024-01-20T17:00:00Z",
      "status": "COMPLETED",
      "amount": 25.0,
      "currency": "HBAR",
      "rating": 5,
      "feedback": "Excellent service, on time delivery",
      "createdAt": "2024-01-19T10:00:00Z"
    }
  ],
  "totalBookings": 1,
  "averageRating": 5.0,
  "completionRate": 100.0
}
```

#### POST /services/:tokenId/complete
Complete a service booking
```json
{
  "bookingId": "booking_123",
  "completionNotes": "Service completed successfully",
  "evidence": [
    "ipfs://QmDeliveryPhoto1...",
    "ipfs://QmDeliveryPhoto2..."
  ],
  "clientSatisfaction": "EXCELLENT"
}
```

---

## 📊 Analytics & Reporting

### Trading Analytics

#### GET /analytics/market
Get NFT marketplace analytics
```json
{
  "success": true,
  "marketOverview": {
    "totalNFTs": 15000,
    "totalListings": 8500,
    "totalVolume": 2500000.0,
    "currency": "HBAR",
    "averagePrice": 45.5,
    "tradingVolume24h": 125000.0,
    "tradingVolume7d": 750000.0,
    "tradingVolume30d": 2500000.0
  },
  "categories": {
    "PRODUCT": {
      "count": 12000,
      "volume": 2000000.0,
      "averagePrice": 42.5,
      "topProducts": ["Tomatoes", "Maize", "Rice"]
    },
    "SERVICE": {
      "count": 2500,
      "volume": 350000.0,
      "averagePrice": 58.0,
      "topServices": ["Transport", "Consultation", "Veterinary"]
    },
    "EQUIPMENT": {
      "count": 500,
      "volume": 150000.0,
      "averagePrice": 125.0,
      "topEquipment": ["Tractors", "Harvesters", "Irrigation"]
    }
  },
  "trends": {
    "priceTrends": [
      {"date": "2024-01-01", "averagePrice": 40.0},
      {"date": "2024-01-02", "averagePrice": 42.0},
      {"date": "2024-01-03", "averagePrice": 45.5}
    ],
    "volumeTrends": [
      {"date": "2024-01-01", "volume": 50000.0},
      {"date": "2024-01-02", "volume": 75000.0},
      {"date": "2024-01-03", "volume": 125000.0}
    ]
  }
}
```

#### GET /analytics/user/:address
Get user-specific analytics
```json
{
  "success": true,
  "user": "0.0.123456",
  "portfolio": {
    "ownedNFTs": 25,
    "createdNFTs": 150,
    "totalSales": 75,
    "totalRevenue": 3750.0,
    "averageSalePrice": 50.0,
    "royaltiesEarned": 93.75
  },
  "tradingActivity": {
    "totalPurchases": 45,
    "totalSpent": 2250.0,
    "averagePurchasePrice": 50.0,
    "favoriteCategories": ["PRODUCT", "EQUIPMENT"],
    "tradingVolume": 6000.0
  },
  "performance": {
    "rating": 4.8,
    "totalRatings": 125,
    "completionRate": 98.5,
    "responseTime": "2.5 hours",
    "disputeRate": 1.2
  }
}
```

---

## 🔧 Wallet Integration

### MetaMask Integration

#### POST /wallet/connect
Connect MetaMask wallet and create Hedera account
```json
{
  "ethereumAddress": "0x742d35Cc6634C0532925a3b8D8C2a5e2E7C8e9f0",
  "signature": "0x1234567890abcdef...",
  "message": "Connect to Lovtiti Agro Mart NFT Marketplace"
}
```

**Response:**
```json
{
  "success": true,
  "wallet": {
    "ethereumAddress": "0x742d35Cc6634C0532925a3b8D8C2a5e2E7C8e9f0",
    "hederaAccountId": "0.0.123456",
    "hederaAccountKey": "302e020100300506032b657004220420...",
    "isConnected": true,
    "balance": {
      "ethereum": "2.5 ETH",
      "hbar": "1000.0 HBAR"
    }
  },
  "bridgeStatus": {
    "isBridged": true,
    "bridgeTransaction": "0xabcdef1234567890",
    "bridgedAt": "2024-01-15T10:00:00Z"
  }
}
```

#### GET /wallet/balance
Get wallet balances
```json
{
  "success": true,
  "balances": {
    "ethereum": {
      "address": "0x742d35Cc6634C0532925a3b8D8C2a5e2E7C8e9f0",
      "balance": "2.5",
      "currency": "ETH"
    },
    "hedera": {
      "accountId": "0.0.123456",
      "balance": "1000.0",
      "currency": "HBAR"
    },
    "nftHoldings": {
      "owned": 25,
      "created": 150,
      "listed": 12
    }
  }
}
```

### Cross-Chain Bridge

#### POST /bridge/to-hedera
Bridge NFT from Ethereum to Hedera
```json
{
  "ethereumTokenId": "123",
  "ethereumContract": "0x1234567890abcdef...",
  "hederaAccountId": "0.0.123456"
}
```

#### POST /bridge/to-ethereum
Bridge NFT from Hedera to Ethereum
```json
{
  "hederaTokenId": "0.0.789012",
  "hederaContract": "0.0.345678",
  "ethereumAddress": "0x742d35Cc6634C0532925a3b8D8C2a5e2E7C8e9f0"
}
```

---

## 🎯 Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "NFT_NOT_FOUND",
    "message": "NFT with token ID 0.0.789012 not found",
    "details": "The requested NFT may have been burned or transferred",
    "timestamp": "2024-01-16T10:00:00Z"
  }
}
```

### NFT-Specific Error Codes
- `NFT_NOT_FOUND` - NFT does not exist or has been burned
- `NFT_NOT_OWNED` - User does not own the NFT
- `NFT_ALREADY_LISTED` - NFT is already listed for sale
- `NFT_NOT_LISTED` - NFT is not currently listed
- `INSUFFICIENT_BALANCE` - Insufficient HBAR balance for transaction
- `INVALID_METADATA` - NFT metadata is invalid or corrupted
- `ROYALTY_TOO_HIGH` - Royalty percentage exceeds maximum allowed
- `ESCROW_EXPIRED` - Escrow transaction has expired
- `DISPUTE_ACTIVE` - Transaction is under dispute
- `BRIDGE_FAILED` - Cross-chain bridge operation failed

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
- `503` - Service Unavailable (Blockchain maintenance)

---

## 🔄 WebSocket Events

### Real-time Updates
Connect to WebSocket for real-time NFT marketplace updates:

```javascript
const ws = new WebSocket('wss://lovittiagro.com/api/nft/ws');

// Listen for events
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch(data.type) {
    case 'NFT_MINTED':
      console.log('New NFT minted:', data.nft);
      break;
    case 'NFT_LISTED':
      console.log('NFT listed for sale:', data.listing);
      break;
    case 'NFT_SOLD':
      console.log('NFT sold:', data.transaction);
      break;
    case 'ESCROW_UPDATED':
      console.log('Escrow status updated:', data.escrow);
      break;
    case 'SUPPLY_CHAIN_UPDATE':
      console.log('Supply chain updated:', data.update);
      break;
  }
};
```

### Available Events
- `NFT_MINTED` - New NFT created
- `NFT_LISTED` - NFT listed for sale
- `NFT_UNLISTED` - NFT listing removed
- `NFT_SOLD` - NFT purchase completed
- `NFT_TRANSFERRED` - NFT ownership transferred
- `AUCTION_CREATED` - New auction started
- `AUCTION_BID` - New bid placed
- `AUCTION_ENDED` - Auction completed
- `ESCROW_CREATED` - Escrow transaction created
- `ESCROW_UPDATED` - Escrow status changed
- `ESCROW_RELEASED` - Escrow funds released
- `ESCROW_DISPUTED` - Escrow dispute created
- `SUPPLY_CHAIN_UPDATE` - Supply chain step added
- `SERVICE_BOOKED` - Service booking created
- `SERVICE_COMPLETED` - Service completed

---

## 📚 SDK & Libraries

### JavaScript/TypeScript SDK
```bash
npm install @lovittiagro/nft-sdk
```

```typescript
import { LovittiNFT } from '@lovittiagro/nft-sdk';

const nft = new LovittiNFT({
  apiKey: 'your-api-key',
  network: 'testnet' // or 'mainnet'
});

// Mint an NFT
const result = await nft.mint({
  category: 'PRODUCT',
  metadata: {
    name: 'Premium Organic Tomatoes',
    // ... other metadata
  }
});

// List for sale
await nft.listForSale(result.tokenId, 50.0, 'HBAR');

// Buy an NFT
await nft.buy('listing_123');
```

### Python SDK
```bash
pip install lovittiagro-nft
```

```python
from lovittiagro import NFTClient

client = NFTClient(api_key='your-api-key', network='testnet')

# Mint an NFT
result = client.mint_nft(
    category='PRODUCT',
    metadata={
        'name': 'Premium Organic Tomatoes',
        # ... other metadata
    }
)

# List for sale
client.list_for_sale(result['token_id'], 50.0, 'HBAR')

# Buy an NFT
client.buy_nft('listing_123')
```

---

## 🚀 Getting Started

### 1. Authentication Setup
```bash
# Get your API key from the dashboard
export LOVITTI_API_KEY="your-api-key"

# Connect your MetaMask wallet
# The SDK will handle Hedera account creation automatically
```

### 2. Mint Your First NFT
```typescript
import { LovittiNFT } from '@lovittiagro/nft-sdk';

const nft = new LovittiNFT({
  apiKey: process.env.LOVITTI_API_KEY,
  network: 'testnet'
});

const result = await nft.mint({
  category: 'PRODUCT',
  metadata: {
    name: 'My First Agricultural Product',
    description: 'Fresh organic produce from my farm',
    image: 'ipfs://QmHash...',
    attributes: {
      productType: 'CROP',
      variety: 'Tomatoes',
      quantity: 100,
      unit: 'kg',
      qualityGrade: 'A'
    }
  }
});

console.log('NFT minted:', result.tokenId);
```

### 3. List for Sale
```typescript
await nft.listForSale(result.tokenId, 25.0, 'HBAR');
console.log('NFT listed for sale!');
```

### 4. Monitor Activity
```typescript
// Subscribe to real-time updates
nft.subscribe('NFT_SOLD', (data) => {
  console.log('NFT sold!', data);
});
```

---

## 📞 Support

For NFT marketplace API support:
- **Email**: nft-support@lovittiagro.com
- **Documentation**: https://docs.lovittiagro.com/nft
- **Discord**: https://discord.gg/lovittiagro
- **Status Page**: https://status.lovittiagro.com

---

*This NFT Marketplace API documentation provides comprehensive coverage of all Web3 functionality for the Lovtiti Agro Mart platform. The API enables true ownership, provenance tracking, and decentralized trading of agricultural products, services, and equipment as NFTs on Hedera Hashgraph.*
