// NFT Types and Interfaces for Lovtiti Agro Mart Marketplace

export type NFTStandard = "HTS-721"; // Hedera Token Service - Non-Fungible
export type NFTCategory = "PRODUCT" | "SERVICE" | "EQUIPMENT";
export type ProductType = "CROP" | "LIVESTOCK" | "FISHERY" | "HONEY" | "PROCESSED";
export type ServiceType = "TRANSPORT" | "CONSULTATION" | "VETERINARY" | "STORAGE" | "PROCESSING";
export type EquipmentType = "TRACTOR" | "HARVESTER" | "IRRIGATION" | "ANALYTICAL" | "STOCKPILING";
export type QualityGrade = "A" | "B" | "C" | "PREMIUM" | "ORGANIC";

// Base NFT Interface
export interface BaseNFT {
  tokenId: string;
  contractAddress: string;
  tokenStandard: NFTStandard;
  category: NFTCategory;
  owner: string;
  creator: string;
  metadata: NFTMetadata;
  royalties: RoyaltyInfo;
  isBurned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// NFT Metadata Interface
export interface NFTMetadata {
  name: string;
  description: string;
  image: string; // IPFS hash
  externalUrl?: string;
  attributes: NFTAttributes;
  animationUrl?: string;
  background_color?: string;
  youtube_url?: string;
}

// NFT Attributes (Discriminated Union based on category)
export type NFTAttributes = ProductAttributes | ServiceAttributes | EquipmentAttributes;

// Product NFT Attributes
export interface ProductAttributes {
  type: "PRODUCT";
  productType: ProductType;
  variety: string;
  quantity: number;
  unit: string;
  harvestDate: string;
  expiryDate: string;
  qualityGrade: QualityGrade;
  certifications: string[];
  location: LocationInfo;
  supplyChain: SupplyChainStep[];
  sustainability: SustainabilityMetrics;
  pricing: PricingInfo;
  images?: string[];
  video?: string;
}

// Service NFT Attributes
export interface ServiceAttributes {
  type: "SERVICE";
  serviceType: ServiceType;
  provider: ProviderInfo;
  capacity?: CapacityInfo;
  pricing: PricingInfo;
  availability: AvailabilityInfo;
  terms: ServiceTerms;
  coverage: CoverageArea[];
  specializations: string[];
}

// Equipment NFT Attributes
export interface EquipmentAttributes {
  type: "EQUIPMENT";
  equipmentType: EquipmentType;
  specifications: EquipmentSpecs;
  ownership: OwnershipInfo;
  leaseTerms: LeaseTerms;
  maintenance: MaintenanceRecord[];
  insurance: InsuranceInfo;
  condition: "NEW" | "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
}

// Supporting Interfaces
export interface LocationInfo {
  latitude: number;
  longitude: number;
  address: string;
  farmId?: string;
  region: string;
  country: string;
}

export interface SupplyChainStep {
  step: number;
  action: string;
  location: string;
  actor: string;
  timestamp: string;
  metadata?: Record<string, any>;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface SustainabilityMetrics {
  waterUsage: "LOW" | "MEDIUM" | "HIGH";
  carbonFootprint: "MINIMAL" | "LOW" | "MEDIUM" | "HIGH";
  pesticideFree: boolean;
  organicCertified: boolean;
  fairTrade: boolean;
  energySource: "RENEWABLE" | "MIXED" | "FOSSIL";
  wasteReduction: number; // percentage
}

export interface PricingInfo {
  basePrice: number;
  currency: "HBAR" | "USD" | "EUR";
  unit: "per_kg" | "per_unit" | "per_hour" | "per_day" | "per_km";
  bulkDiscounts?: BulkDiscount[];
  seasonalPricing?: SeasonalPrice[];
}

export interface BulkDiscount {
  minQuantity: number;
  discountPercentage: number;
}

export interface SeasonalPrice {
  season: string;
  multiplier: number;
  startDate: string;
  endDate: string;
}

export interface ProviderInfo {
  name: string;
  license: string;
  rating: number;
  experience: number; // years
  specializations: string[];
  certifications: string[];
}

export interface CapacityInfo {
  maxVolume?: number;
  maxWeight?: number;
  maxDistance?: number;
  unit: string;
}

export interface AvailabilityInfo {
  schedule: TimeSlot[];
  location: string;
  advanceBookingDays: number;
  minimumBookingHours: number;
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface ServiceTerms {
  cancellationPolicy: string;
  paymentTerms: string;
  liabilityCoverage: string;
  insuranceRequired: boolean;
  specialRequirements?: string[];
}

export interface CoverageArea {
  region: string;
  cities: string[];
  radius?: number; // km
}

export interface EquipmentSpecs {
  model: string;
  year: number;
  brand: string;
  capacity: string;
  features: string[];
  fuelType?: string;
  powerSource?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
}

export interface OwnershipInfo {
  owner: string;
  title: string;
  purchaseDate: string;
  purchasePrice: number;
  depreciationRate: number;
}

export interface LeaseTerms {
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  minimumPeriod: number; // days
  deposit: number;
  insurance: boolean;
  maintenance: boolean;
  delivery: boolean;
  training: boolean;
}

export interface MaintenanceRecord {
  date: string;
  type: "ROUTINE" | "REPAIR" | "INSPECTION";
  description: string;
  cost: number;
  nextDue: string;
  technician: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  coverage: string[];
  expiryDate: string;
  premium: number;
}

export interface RoyaltyInfo {
  percentage: number; // 0-10%
  recipient: string;
  perpetual: boolean;
}

// NFT Listing Interface
export interface NFTListing {
  id: string;
  tokenId: string;
  contractAddress: string;
  seller: string;
  price: number;
  currency: "HBAR" | "USD" | "EUR";
  isActive: boolean;
  listingTime: Date;
  expiryTime?: Date;
  category: NFTCategory;
  description?: string;
  tags: string[];
  views: number;
  favorites: number;
  isAuction: boolean;
  auctionEndTime?: Date;
  reservePrice?: number;
  currentBid?: number;
  bidCount: number;
}

// NFT Transaction Interface
export interface NFTTransaction {
  id: string;
  tokenId: string;
  contractAddress: string;
  from: string;
  to: string;
  price: number;
  currency: string;
  transactionHash: string;
  blockNumber: number;
  gasUsed: number;
  status: "PENDING" | "CONFIRMED" | "FAILED";
  timestamp: Date;
  type: "MINT" | "TRANSFER" | "SALE" | "BURN";
  royalties?: {
    amount: number;
    recipient: string;
  };
}

// Escrow Transaction Interface
export interface EscrowTransaction {
  id: string;
  tokenId: string;
  contractAddress: string;
  buyer: string;
  seller: string;
  amount: number;
  currency: string;
  status: "PENDING_PAYMENT" | "PENDING_DELIVERY" | "DELIVERED" | "RELEASED" | "DISPUTED";
  deliveryStatus: DeliveryStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  expiresAt: Date;
  disputeReason?: string;
  disputeEvidence?: string[];
}

export interface DeliveryStatus {
  isShipped: boolean;
  trackiHBARumber?: string;
  carrier?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  deliveryNotes?: string;
}

export interface PaymentStatus {
  isPaid: boolean;
  paymentHash?: string;
  paidAt?: Date;
  paymentMethod?: string;
}

// Service Booking Interface
export interface ServiceBooking {
  id: string;
  serviceTokenId: string;
  client: string;
  startTime: Date;
  endTime: Date;
  amount: number;
  currency: string;
  status: "BOOKED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  feedback?: string;
  rating?: number;
  location?: string;
  requirements?: string;
  createdAt: Date;
}

// Equipment Lease Interface
export interface EquipmentLease {
  id: string;
  equipmentTokenId: string;
  lessee: string;
  startDate: Date;
  endDate: Date;
  dailyRate: number;
  totalAmount: number;
  deposit: number;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  deliveryAddress: string;
  pickupAddress: string;
  insurance: boolean;
  training: boolean;
  maintenance: boolean;
  createdAt: Date;
}

// Marketplace Analytics Interface
export interface MarketplaceAnalytics {
  totalNFTs: number;
  totalListings: number;
  totalVolume: number;
  averagePrice: number;
  tradingVolume24h: number;
  tradingVolume7d: number;
  tradingVolume30d: number;
  categories: {
    PRODUCT: CategoryStats;
    SERVICE: CategoryStats;
    EQUIPMENT: CategoryStats;
  };
  trends: {
    priceTrends: PriceTrend[];
    volumeTrends: VolumeTrend[];
  };
}

export interface CategoryStats {
  count: number;
  volume: number;
  averagePrice: number;
  topItems: string[];
}

export interface PriceTrend {
  date: string;
  averagePrice: number;
}

export interface VolumeTrend {
  date: string;
  volume: number;
}

// User Portfolio Interface
export interface UserPortfolio {
  user: string;
  ownedNFTs: number;
  createdNFTs: number;
  totalSales: number;
  totalRevenue: number;
  averageSalePrice: number;
  royaltiesEarned: number;
  tradingActivity: TradingActivity;
  performance: UserPerformance;
}

export interface TradingActivity {
  totalPurchases: number;
  totalSpent: number;
  averagePurchasePrice: number;
  favoriteCategories: NFTCategory[];
  tradingVolume: number;
}

export interface UserPerformance {
  rating: number;
  totalRatings: number;
  completionRate: number;
  responseTime: string;
  disputeRate: number;
}

// API Request/Response Types
export interface MintNFTRequest {
  category: NFTCategory;
  metadata: NFTMetadata;
  royalties: RoyaltyInfo;
}

export interface MintNFTResponse {
  success: boolean;
  nft: BaseNFT;
  transactionHash: string;
  ipfsHash: string;
}

export interface ListNFTRequest {
  tokenId: string;
  contractAddress: string;
  price: number;
  currency: "HBAR" | "USD" | "EUR";
  expiryTime?: Date;
  category: NFTCategory;
  description?: string;
  tags?: string[];
  isAuction?: boolean;
  auctionEndTime?: Date;
  reservePrice?: number;
}

export interface BuyNFTRequest {
  listingId: string;
  paymentMethod: "HBAR" | "USD" | "EUR";
  deliveryAddress?: AddressInfo;
  deliveryInstructions?: string;
  insurance?: boolean;
}

export interface AddressInfo {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Error Types
export interface NFTError {
  code: string;
  message: string;
  details?: string;
  timestamp: Date;
}

// WebSocket Event Types
export type NFTEventType =
  | "NFT_MINTED"
  | "NFT_LISTED"
  | "NFT_UNLISTED"
  | "NFT_SOLD"
  | "NFT_TRANSFERRED"
  | "AUCTION_CREATED"
  | "AUCTION_BID"
  | "AUCTION_ENDED"
  | "ESCROW_CREATED"
  | "ESCROW_UPDATED"
  | "ESCROW_RELEASED"
  | "ESCROW_DISPUTED"
  | "SUPPLY_CHAIN_UPDATE"
  | "SERVICE_BOOKED"
  | "SERVICE_COMPLETED";

export interface NFTEvent {
  type: NFTEventType;
  data: any;
  timestamp: Date;
  userId?: string;
}

// Utility Types
export type NFTSortBy = "newest" | "price-low" | "price-high" | "rating" | "popularity";
export type NFTFilter = {
  category?: NFTCategory;
  productType?: ProductType;
  serviceType?: ServiceType;
  equipmentType?: EquipmentType;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  location?: string;
  qualityGrade?: QualityGrade;
  certifications?: string[];
  search?: string;
  sortBy?: NFTSortBy;
  page?: number;
  limit?: number;
};

export type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
