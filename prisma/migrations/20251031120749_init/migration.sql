-- CreateEnum
CREATE TYPE "Role" AS ENUM ('FARMER', 'DISTRIBUTOR', 'TRANSPORTER', 'BUYER', 'AGROEXPERT', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProfileType" AS ENUM ('FARMER', 'DISTRIBUTOR', 'TRANSPORTER', 'BUYER', 'AGROEXPERT');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED', 'DISPUTED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'DOCUMENT', 'LOCATION');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LeaseStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ProfileType" NOT NULL,
    "fullName" TEXT NOT NULL,
    "kycStatus" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "country" TEXT,
    "address" TEXT,
    "phone" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "hederaWallet" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "productDescription" TEXT,
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'HBAR',
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'kg',
    "category" TEXT NOT NULL,
    "images" TEXT[],
    "video" TEXT,
    "location" TEXT,
    "harvestDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "sellerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'HBAR',
    "hederaEscrow" TEXT,
    "deliveryAddress" TEXT,
    "deliveryDate" TIMESTAMP(3),
    "trackiHBARumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingUpdate" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackingUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "conversationId" TEXT,
    "content" TEXT NOT NULL,
    "messageType" "MessageType" NOT NULL DEFAULT 'TEXT',
    "attachments" TEXT[],
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceBooking" (
    "id" TEXT NOT NULL,
    "agroVetId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nFTId" TEXT,

    CONSTRAINT "ServiceBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthRecord" (
    "id" TEXT NOT NULL,
    "agroVetId" TEXT NOT NULL,
    "animalOwnerId" TEXT NOT NULL,
    "animalType" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "treatment" TEXT NOT NULL,
    "medication" TEXT,
    "vaccination" TEXT,
    "notes" TEXT,
    "attachments" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HealthRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgroVetProduct" (
    "id" TEXT NOT NULL,
    "agroVetId" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'piece',
    "category" TEXT NOT NULL,
    "images" TEXT[],
    "video" TEXT,
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgroVetProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentLease" (
    "id" TEXT NOT NULL,
    "agroVetId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dailyRate" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "LeaseStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nFTId" TEXT,

    CONSTRAINT "EquipmentLease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpertAdvice" (
    "id" TEXT NOT NULL,
    "agroVetId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "adviceType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachments" TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpertAdvice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NFT" (
    "id" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "ownerAddress" TEXT NOT NULL,
    "creatorAddress" TEXT NOT NULL,
    "tokenStandard" TEXT NOT NULL DEFAULT 'HTS-721',
    "metadataUri" TEXT NOT NULL,
    "metadataHash" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "metadata" TEXT NOT NULL,
    "royalties" TEXT NOT NULL,
    "isBurned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NFT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NFTListing" (
    "id" TEXT NOT NULL,
    "nftId" TEXT NOT NULL,
    "sellerAddress" TEXT NOT NULL,
    "price" DECIMAL(20,8) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'HBAR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "listingTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryTime" TIMESTAMP(3),
    "category" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "favorites" INTEGER NOT NULL DEFAULT 0,
    "isAuction" BOOLEAN NOT NULL DEFAULT false,
    "auctionEndTime" TIMESTAMP(3),
    "reservePrice" DECIMAL(20,8),
    "currentBid" DECIMAL(20,8),
    "currentBidder" TEXT,
    "bidCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NFTListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NFTTransaction" (
    "id" TEXT NOT NULL,
    "nftId" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT NOT NULL,
    "price" DECIMAL(20,8) NOT NULL,
    "currency" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "blockNumber" BIGINT,
    "gasUsed" BIGINT,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "royalties" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NFTTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplyChainStep" (
    "id" TEXT NOT NULL,
    "nftId" TEXT NOT NULL,
    "stepIndex" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "actorAddress" TEXT NOT NULL,
    "metadata" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifierAddress" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verificationNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupplyChainStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualityCheck" (
    "id" TEXT NOT NULL,
    "nftId" TEXT NOT NULL,
    "checkType" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "score" INTEGER NOT NULL,
    "notes" TEXT,
    "inspector" TEXT NOT NULL,
    "evidence" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QualityCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscrowTransaction" (
    "id" TEXT NOT NULL,
    "buyerAddress" TEXT NOT NULL,
    "sellerAddress" TEXT NOT NULL,
    "nftContract" TEXT NOT NULL,
    "nftTokenId" TEXT NOT NULL,
    "amount" DECIMAL(20,8) NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "deliveryStatus" TEXT NOT NULL DEFAULT 'PENDING_DELIVERY',
    "trackiHBARumber" TEXT,
    "carrier" TEXT,
    "estimatedDelivery" TIMESTAMP(3),
    "actualDelivery" TIMESTAMP(3),
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentHash" TEXT,
    "paidAt" TIMESTAMP(3),
    "isDisputed" BOOLEAN NOT NULL DEFAULT false,
    "disputeReason" TEXT,
    "disputeEvidence" TEXT[],
    "rating" INTEGER,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EscrowTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_type_key" ON "Profile"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "NFT_tokenId_key" ON "NFT"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "NFTTransaction_transactionHash_key" ON "NFTTransaction"("transactionHash");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingUpdate" ADD CONSTRAINT "TrackingUpdate_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceBooking" ADD CONSTRAINT "ServiceBooking_agroVetId_fkey" FOREIGN KEY ("agroVetId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceBooking" ADD CONSTRAINT "ServiceBooking_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceBooking" ADD CONSTRAINT "ServiceBooking_nFTId_fkey" FOREIGN KEY ("nFTId") REFERENCES "NFT"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthRecord" ADD CONSTRAINT "HealthRecord_agroVetId_fkey" FOREIGN KEY ("agroVetId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthRecord" ADD CONSTRAINT "HealthRecord_animalOwnerId_fkey" FOREIGN KEY ("animalOwnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgroVetProduct" ADD CONSTRAINT "AgroVetProduct_agroVetId_fkey" FOREIGN KEY ("agroVetId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentLease" ADD CONSTRAINT "EquipmentLease_agroVetId_fkey" FOREIGN KEY ("agroVetId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentLease" ADD CONSTRAINT "EquipmentLease_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentLease" ADD CONSTRAINT "EquipmentLease_nFTId_fkey" FOREIGN KEY ("nFTId") REFERENCES "NFT"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpertAdvice" ADD CONSTRAINT "ExpertAdvice_agroVetId_fkey" FOREIGN KEY ("agroVetId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpertAdvice" ADD CONSTRAINT "ExpertAdvice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFTListing" ADD CONSTRAINT "NFTListing_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "NFT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFTTransaction" ADD CONSTRAINT "NFTTransaction_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "NFT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplyChainStep" ADD CONSTRAINT "SupplyChainStep_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "NFT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualityCheck" ADD CONSTRAINT "QualityCheck_nftId_fkey" FOREIGN KEY ("nftId") REFERENCES "NFT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
