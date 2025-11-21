# Lovtiti Agro Mart - Project Analysis

## 🎯 Project Overview

**Lovtiti Agro Mart** is a decentralized agricultural marketplace built on **Hedera Hashgraph** that connects African farmers with global buyers. The platform enables secure, transparent trading with blockchain-based escrow payments using USDC/HBAR.

---

## 🏗️ Current Architecture

### Authentication System

**Current State: HYBRID (Clerk + JWT)**
- ✅ **Clerk Authentication** - Currently active in production
- ✅ **JWT Authentication** - Fully implemented but not yet integrated
- ⚠️ **Wallet Integration** - Partially implemented

#### Clerk Implementation (Active)
- `app/auth/signup/page.tsx` - Full Clerk signup with wallet connection
- `app/auth/login/page.tsx` - Clerk login with offline Hedera option
- `components/Navbar.tsx` - Uses Clerk's `useUser()` and `UserButton`
- `app/cart/page.tsx` - Uses Clerk's `useUser()` for auth checks
- `app/checkout/page.tsx` - Uses Clerk's `useUser()` for user data

#### JWT Implementation (Ready but Not Active)
- ✅ `lib/auth.ts` - Complete JWT utilities (create, verify, refresh)
- ✅ `hooks/useAuth.ts` - Client-side auth hook (NOT wallet-integrated yet)
- ✅ `app/api/auth/register/route.ts` - JWT registration endpoint
- ✅ `app/api/auth/login/route.ts` - JWT login endpoint
- ✅ `app/api/auth/logout/route.ts` - JWT logout endpoint
- ✅ `app/api/auth/me/route.ts` - Get current user endpoint

#### Wallet Integration
- ✅ `utils/walletManager.ts` - MetaMask/Ethereum wallet connection
- ✅ Wallet connection in signup flow (Clerk-based)
- ⚠️ **Missing**: HashPack integration in JWT auth
- ⚠️ **Missing**: Wallet linking API for JWT users

---

## 📊 Database Schema

### Core Models

#### User Model
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // For JWT auth
  firstName     String?
  lastName      String?
  role          Role      // FARMER, BUYER, DISTRIBUTOR, TRANSPORTER, AGROEXPERT, ADMIN
  
  // Relations
  profiles      Profile[]
  listings      Listing[]
  ordersAsBuyer Order[]
  sentMessages  Message[]
  receivedMessages Message[]
}
```

**⚠️ MISSING**: `walletAddress` and `walletType` fields in User model

#### Profile Model
```prisma
model Profile {
  id           String      @id @default(cuid())
  userId       String
  type         ProfileType
  fullName     String
  kycStatus    KycStatus   @default(PENDING)
  hederaWallet String      // ✅ Wallet stored here
  phone        String
  address      String
  country      String
}
```

#### Listing Model
```prisma
model Listing {
  id                 String    @id
  title              String
  description        String
  priceCents         Int
  currency           String    @default("HBAR")
  quantity           Int
  unit               String    @default("kg")
  category           String
  images             String[]
  seller             User      @relation(fields: [sellerId])
  sellerId           String
  isActive           Boolean   @default(true)
  isVerified         Boolean   @default(false)
}
```

#### Order Model
```prisma
model Order {
  id              String      @id
  buyerId         String
  listingId       String
  status          OrderStatus @default(PENDING)
  amountCents     Int
  currency        String      @default("HBAR")
  hederaEscrow    String?     // ✅ Escrow contract address
  deliveryAddress String?
  trackingUpdates TrackingUpdate[]
}
```

#### Payment Model
```prisma
model Payment {
  id              String        @id
  amount          Int           // Amount in cents
  currency        String        @default("HBAR")
  status          PaymentStatus @default(PENDING)
  paymentMethod   String        // HEDERA, METAMASK, STRIPE, MPESA
  fromWallet      String?
  toWallet        String?
  transactionHash String?
  metadata        Json?
}
```

---

## 🔗 Smart Contract Integration

### Contract Location
- `contracts/contracts/main.sol` - Main Solidity contract

### Available Utilities
- ✅ `utils/agroContract.ts` - Contract service wrapper
- ✅ `utils/walletManager.ts` - Wallet connection manager
- ✅ `utils/contractEventHandlers.ts` - Event handling
- ✅ `utils/contractEventMonitor.ts` - Real-time monitoring
- ✅ `utils/businessLogic.ts` - Business logic layer

### Key Functions (from walletManager.ts)
```typescript
- connectMetaMask() - Connect MetaMask wallet
- connectWithPrivateKey() - Server-side wallet connection
- createFarmerAccount() - Register farmer on contract
- isFarmer() - Check farmer status
- getFarmerInfo() - Get farmer details
- getFarmerProducts() - Get farmer's products
```

---

## 🛒 E-Commerce Flow

### Product Listing
- ✅ `components/farmer/CreateProduct.tsx` - Product creation form
- ✅ `components/farmer/FarmerListings.tsx` - Farmer's product list
- ✅ `app/listings/create/` - Create listing page
- ✅ `app/listings/browse/` - Browse products page
- ✅ `app/api/listings/route.ts` - Listings API

### Shopping Cart
- ✅ `hooks/useCart.ts` - Cart management hook
- ✅ `app/cart/page.tsx` - Cart page
- ✅ `components/cart/CartItem.tsx` - Cart item component
- ✅ `components/cart/CartSummary.tsx` - Cart summary
- ✅ `components/cart/CartEmpty.tsx` - Empty cart state
- ✅ `app/api/cart/sync/route.ts` - Cart sync API

### Checkout & Payment
- ✅ `app/checkout/page.tsx` - Checkout page with multi-step flow
- ✅ `components/checkout/HederaPaymentModal.tsx` - Hedera payment UI
- ✅ Payment methods supported:
  - Hedera HBAR (Recommended)
  - MetaMask Wallet
  - Credit/Debit Card (Stripe)
  - MPESA (Mobile money)

### Payment Flow
```
1. User adds products to cart
2. Proceeds to checkout
3. Enters delivery information
4. Selects payment method
5. Connects wallet (HashPack/MetaMask)
6. Payment sent to escrow contract
7. Funds held until delivery confirmed
8. Both parties confirm → Payment released to farmer
```

---

## 🎨 UI Components

### Core Components
- ✅ `components/Navbar.tsx` - Main navigation (Clerk-based)
- ✅ `components/RoleSelection.tsx` - Role selection UI
- ✅ `components/DashboardGuard.tsx` - Route protection
- ✅ `components/UserSync.tsx` - User data synchronization
- ✅ `components/CartSync.tsx` - Cart synchronization

### UI Library (Shadcn)
- ✅ `components/ui/button.tsx`
- ✅ `components/ui/card.tsx`
- ✅ `components/ui/input.tsx`
- ✅ `components/ui/label.tsx`
- ✅ `components/ui/select.tsx`
- ✅ `components/ui/dialog.tsx`
- ✅ `components/ui/badge.tsx`
- ✅ `components/ui/toast.tsx`

### Payment Components
- ✅ `components/checkout/HederaPaymentModal.tsx` - Hedera payment flow
- ✅ `components/PaymentMethodSelector.tsx` - Payment method selection
- ✅ `components/CurrencySelector.tsx` - Currency selection

---

## 📱 User Roles & Dashboards

### Available Roles
1. **FARMER** - Sell agricultural products
   - Dashboard: `app/dashboard/farmer/`
   - Create listings, manage inventory, track sales

2. **BUYER** - Purchase products
   - Dashboard: `app/dashboard/buyer/`
   - Browse products, manage orders, track deliveries

3. **DISTRIBUTOR** - Wholesale trading
   - Dashboard: `app/dashboard/distributor/`
   - Bulk purchasing, inventory management

4. **TRANSPORTER** - Logistics services
   - Dashboard: `app/dashboard/transporter/`
   - Delivery requests, route optimization

5. **AGROEXPERT** - Veterinary & consulting
   - Dashboard: `app/dashboard/agro-vet/`
   - Consultation services, product sales, equipment leasing

6. **ADMIN** - Platform management
   - Dashboard: `app/admin/`
   - User management, KYC approval, dispute resolution

### Onboarding Pages
- ✅ `app/onboarding/farmer/page.tsx`
- ✅ `app/onboarding/buyer/page.tsx`
- ✅ `app/onboarding/distributor/page.tsx`
- ✅ `app/onboarding/transporter/page.tsx`
- ✅ `app/onboarding/veterinarian/page.tsx`

---

## 🔌 API Routes

### Authentication
- ✅ `/api/auth/register` - User registration
- ✅ `/api/auth/login` - User login
- ✅ `/api/auth/logout` - User logout
- ✅ `/api/auth/me` - Get current user
- ✅ `/api/auth/create-user` - Create user profile
- ✅ `/api/auth/sync-user` - Sync user data
- ✅ `/api/auth/assign-role` - Assign user role

### Listings
- ✅ `/api/listings` - CRUD operations for listings
- ✅ `/api/listings/[id]/contract` - Contract integration

### Cart & Orders
- ✅ `/api/cart/sync` - Sync cart data
- ✅ `/api/orders` - Order management

### Payments
- ✅ `/api/payments/hedera` - Hedera payments
- ✅ `/api/payments/stripe` - Stripe payments
- ✅ `/api/payments/mpesa` - MPESA payments

### Users
- ✅ `/api/users/[id]/wallet` - Get user wallet info
- ✅ `/api/users/update-contract` - Update contract data

### Other
- ✅ `/api/kyc/submit` - KYC submission
- ✅ `/api/delivery` - Delivery tracking
- ✅ `/api/messaging` - Messaging system
- ✅ `/api/tracking` - Order tracking

---

## 🔧 Utility Services

### Blockchain & Wallet
- ✅ `utils/hedera.ts` - Hedera SDK utilities
- ✅ `utils/walletManager.ts` - Wallet management
- ✅ `utils/walletService.ts` - Wallet service layer
- ✅ `utils/agroContract.ts` - Smart contract service

### Business Logic
- ✅ `utils/businessLogic.ts` - Core business logic
- ✅ `utils/roleManager.ts` - Role management
- ✅ `utils/deliveryTrackingService.ts` - Delivery tracking
- ✅ `utils/contractEventHandlers.ts` - Event handling
- ✅ `utils/contractEventMonitor.ts` - Event monitoring

### Payments
- ✅ `utils/payments.ts` - Payment utilities
- ✅ `utils/stripe.ts` - Stripe integration
- ✅ `utils/currency.ts` - Currency conversion

### Other
- ✅ `utils/validators.ts` - Input validation
- ✅ `utils/formatters.ts` - Data formatting
- ✅ `utils/language.ts` - Internationalization
- ✅ `utils/pinata.ts` - IPFS integration
- ✅ `utils/aiService.ts` - AI features
- ✅ `utils/nftService.ts` - NFT functionality
- ✅ `utils/defiService.ts` - DeFi features
- ✅ `utils/daoService.ts` - DAO governance

---

## 🚨 Key Issues & Missing Features

### Critical Issues

1. **Authentication Confusion**
   - ❌ Project uses Clerk but JWT system is implemented
   - ❌ Navbar and most pages use Clerk
   - ❌ JWT auth not integrated with wallet connection
   - ❌ No clear migration path

2. **Wallet Integration Incomplete**
   - ❌ User model missing `walletAddress` and `walletType` fields
   - ❌ JWT auth doesn't include wallet connection
   - ❌ No `/api/auth/link-wallet` endpoint
   - ❌ HashPack integration not in JWT flow

3. **Database Schema Mismatch**
   - ❌ Wallet stored in Profile, not User
   - ❌ JWT auth expects wallet in User model
   - ❌ Need migration to add wallet fields to User

### Missing Components

1. **Wallet Components**
   - ❌ No `WalletConnection.tsx` component
   - ❌ No `WalletStatus.tsx` component
   - ❌ No wallet linking UI for existing users

2. **Enhanced Auth Pages**
   - ❌ No `/auth/signup-hedera` page (JWT + wallet)
   - ❌ No `/auth/login-hedera` page (JWT + wallet)
   - ❌ Current signup uses Clerk, not JWT

3. **Payment Integration**
   - ⚠️ Checkout uses Clerk for user data
   - ⚠️ Payment modal needs JWT integration
   - ⚠️ Escrow contract integration incomplete

---

## 📋 Recommended Next Steps

### Phase 1: Database Migration
1. Add `walletAddress` and `walletType` to User model
2. Run Prisma migration
3. Migrate existing wallet data from Profile to User

### Phase 2: Complete JWT + Wallet Auth
1. Update `hooks/useAuth.ts` to include wallet functions
2. Create `/api/auth/link-wallet` endpoint
3. Build `WalletConnection.tsx` component
4. Create enhanced signup/login pages

### Phase 3: Migrate from Clerk to JWT
1. Update Navbar to use JWT auth
2. Update all pages using Clerk to use JWT
3. Update checkout flow to use JWT
4. Test end-to-end flow

### Phase 4: Smart Contract Integration
1. Complete escrow payment flow
2. Add delivery confirmation
3. Implement payment release mechanism
4. Add dispute resolution

---

## 🎯 Current State Summary

### ✅ What's Working
- Clerk authentication (active)
- Product listing and browsing
- Shopping cart functionality
- Checkout flow (Clerk-based)
- Payment modal UI
- Smart contract utilities
- Database schema (mostly complete)
- Role-based dashboards
- Onboarding flows

### ⚠️ What's Partially Working
- JWT authentication (implemented but not integrated)
- Wallet connection (Clerk signup only)
- Payment processing (UI ready, backend incomplete)
- Escrow contracts (utilities exist, not fully integrated)

### ❌ What's Missing
- JWT + Wallet integration
- Wallet fields in User model
- Enhanced auth pages for JWT
- Complete escrow payment flow
- Delivery confirmation system
- Payment release mechanism
- Migration from Clerk to JWT

---

## 🔍 File Structure Overview

```
lovtiti-agro-mart/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Auth pages (Clerk-based)
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout flow
│   ├── dashboard/        # Role-based dashboards
│   ├── listings/         # Product listings
│   ├── onboarding/       # User onboarding
│   └── page.tsx          # Landing page
├── components/
│   ├── cart/             # Cart components
│   ├── checkout/         # Checkout components
│   ├── farmer/           # Farmer components
│   ├── ui/               # UI library (Shadcn)
│   └── Navbar.tsx        # Main navigation
├── contracts/
│   └── contracts/
│       └── main.sol      # Smart contract
├── hooks/
│   ├── useAuth.ts        # JWT auth hook
│   ├── useCart.ts        # Cart hook
│   └── useWallet.ts      # Wallet hook
├── lib/
│   └── auth.ts           # JWT utilities
├── prisma/
│   └── schema.prisma     # Database schema
├── utils/
│   ├── agroContract.ts   # Contract service
│   ├── walletManager.ts  # Wallet management
│   ├── hedera.ts         # Hedera utilities
│   └── ...               # Other utilities
└── types/                # TypeScript types
```

---

## 📝 Notes

- The project is well-structured with clear separation of concerns
- Smart contract integration is partially complete
- Authentication system needs consolidation (Clerk vs JWT)
- Wallet integration needs to be completed in JWT flow
- Database schema is comprehensive but needs wallet fields in User model
- Payment flow UI is excellent but backend integration incomplete
- Role-based access control is well implemented
- Comprehensive utility services available

---

**Last Updated**: Analysis completed on current codebase
**Status**: Ready for JWT + Wallet integration phase
