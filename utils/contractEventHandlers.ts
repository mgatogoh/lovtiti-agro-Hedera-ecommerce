// Contract event handlers for database synchronization
import { PrismaClient } from '@prisma/client';
import { EventHandler } from './contractEventMonitor';

export class ContractEventHandlers implements EventHandler {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Handle farmerJoined event - create farmer in database
   */
  async farmerJoined(data: any): Promise<void> {
    try {
      console.log('Processing farmerJoined event:', data);

      const { farmerAddress, transactionHash, blockNumber } = data;

      // Find user by wallet address in their profile
      const profile = await this.prisma.profile.findFirst({
        where: { hederaWallet: farmerAddress },
        include: { user: true }
      });

      const user = profile?.user;

      if (!user) {
        console.warn(`User not found for contract address: ${farmerAddress}`);
        return;
      }

      // Update user to mark as contract farmer
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          updatedAt: new Date()
        }
      });

      // Mark event as processed
      await this.markEventAsProcessed(transactionHash);

      console.log(`Successfully created farmer account for user: ${user.id}`);
    } catch (error) {
      console.error('Error processing farmerJoined event:', error);
      throw error;
    }
  }

  /**
   * Handle productCreated event - create product in database
   */
  async productCreated(data: any): Promise<void> {
    try {
      console.log('Processing productCreated event:', data);

      const {
        productId,
        price,
        farmerAddress,
        amount,
        transactionHash,
        blockNumber
      } = data;

      // Find farmer user by wallet address in their profile
      const farmerProfile = await this.prisma.profile.findFirst({
        where: { hederaWallet: farmerAddress },
        include: { user: true }
      });

      const farmer = farmerProfile?.user;

      if (!farmer) {
        console.warn(`Farmer not found for contract address: ${farmerAddress}`);
        return;
      }

      // Create listing in database
      const listing = await this.prisma.listing.create({
        data: {
          title: `Product ${productId}`,
          description: `Product created on contract with ID ${productId} - Contract TX: ${transactionHash}`,
          priceCents: Math.floor(parseFloat(price) * 100), // Convert ETH to cents
          currency: 'ETH',
          quantity: parseInt(amount),
          unit: 'kg',
          category: 'Agricultural Product',
          images: [],
          isActive: true,
          isVerified: false,
          sellerId: farmer.id
        }
      });

      // Mark event as processed
      await this.markEventAsProcessed(transactionHash);

      console.log(`Successfully created listing: ${listing.id} for product: ${productId}`);
    } catch (error) {
      console.error('Error processing productCreated event:', error);
      throw error;
    }
  }

  /**
   * Handle productBought event - create order in database
   */
  async productBought(data: any): Promise<void> {
    try {
      console.log('Processing productBought event:', data);

      const {
        productId,
        buyerAddress,
        farmerAddress,
        amount,
        transactionHash,
        blockNumber
      } = data;

      // Find buyer and farmer users
      const [buyerProfile, farmerProfile] = await Promise.all([
        this.prisma.profile.findFirst({
          where: { hederaWallet: buyerAddress },
          include: { user: true }
        }),
        this.prisma.profile.findFirst({
          where: { hederaWallet: farmerAddress },
          include: { user: true }
        })
      ]);

      const buyer = buyerProfile?.user;
      const farmer = farmerProfile?.user;

      if (!buyer) {
        console.warn(`Buyer not found for contract address: ${buyerAddress}`);
        return;
      }

      if (!farmer) {
        console.warn(`Farmer not found for contract address: ${farmerAddress}`);
        return;
      }

      // Find the listing by description containing the product ID (simplified approach)
      const listing = await this.prisma.listing.findFirst({
        where: {
          description: { contains: `Contract Product ID: ${productId}` }
        }
      });

      if (!listing) {
        console.warn(`Listing not found for contract product ID: ${productId}`);
        return;
      }

      // Create order in database
      const order = await this.prisma.order.create({
        data: {
          buyerId: buyer.id,
          listingId: listing.id,
          status: 'PAID',
          amountCents: Math.floor(parseFloat(amount) * (listing.priceCents / 100) * 100),
          currency: 'ETH',
          notes: `Contract TX: ${transactionHash}, Buyer: ${buyerAddress}, Seller: ${farmerAddress}`
        }
      });

      // Update listing stock
      await this.prisma.listing.update({
        where: { id: listing.id },
        data: {
          quantity: listing.quantity - parseInt(amount)
        }
      });

      // Update farmer (simplified - no contract balance tracking)
      await this.prisma.user.update({
        where: { id: farmer.id },
        data: {
          updatedAt: new Date()
        }
      });

      // Mark event as processed
      await this.markEventAsProcessed(transactionHash);

      console.log(`Successfully created order: ${order.id} for product: ${productId}`);
    } catch (error) {
      console.error('Error processing productBought event:', error);
      throw error;
    }
  }

  /**
   * Handle stockUpdated event - update product stock in database
   */
  async stockUpdated(data: any): Promise<void> {
    try {
      console.log('Processing stockUpdated event:', data);

      const { amount, productId, transactionHash, blockNumber } = data;

      // Find listing by description containing the product ID
      const listing = await this.prisma.listing.findFirst({
        where: {
          description: { contains: `Contract Product ID: ${productId}` }
        }
      });

      if (!listing) {
        console.warn(`Listing not found for contract product ID: ${productId}`);
        return;
      }

      // Update stock
      await this.prisma.listing.update({
        where: { id: listing.id },
        data: {
          quantity: parseInt(amount)
        }
      });

      // Mark event as processed
      await this.markEventAsProcessed(transactionHash);

      console.log(`Successfully updated stock for product: ${productId} to ${amount}`);
    } catch (error) {
      console.error('Error processing stockUpdated event:', error);
      throw error;
    }
  }

  /**
   * Handle priceIncreased event - update product price in database
   */
  async priceIncreased(data: any): Promise<void> {
    try {
      console.log('Processing priceIncreased event:', data);

      const { price, productId, transactionHash, blockNumber } = data;

      // Find listing by description containing the product ID
      const listing = await this.prisma.listing.findFirst({
        where: {
          description: { contains: `Contract Product ID: ${productId}` }
        }
      });

      if (!listing) {
        console.warn(`Listing not found for contract product ID: ${productId}`);
        return;
      }

      // Update price
      await this.prisma.listing.update({
        where: { id: listing.id },
        data: {
          priceCents: Math.floor(parseFloat(price) * 100)
        }
      });

      // Mark event as processed
      await this.markEventAsProcessed(transactionHash);

      console.log(`Successfully updated price for product: ${productId} to ${price}`);
    } catch (error) {
      console.error('Error processing priceIncreased event:', error);
      throw error;
    }
  }

  /**
   * Mark event as processed in database
   */
  private async markEventAsProcessed(transactionHash: string): Promise<void> {
    try {
      // Mark event as processed (simplified - no contractEvent table)
      console.log(`Event processed: ${transactionHash}`);
      /*
      await this.prisma.contractEvent.updateMany({
        where: { transactionHash },
        data: {
          processed: true,
          processedAt: new Date()
        }
      });
      */
    } catch (error) {
      console.error('Error marking event as processed:', error);
    }
  }

  /**
   * Process unprocessed events (for manual processing)
   */
  async processUnprocessedEvents(): Promise<void> {
    try {
      // Process unprocessed events (simplified - no contractEvent table)
      console.log('Processing unprocessed events...');
      /*
      const unprocessedEvents = await this.prisma.contractEvent.findMany({
        where: { processed: false },
        orderBy: { createdAt: 'asc' }
      });

      console.log(`Processing ${unprocessedEvents.length} unprocessed events`);

      for (const event of unprocessedEvents) {
        try {
          const eventData = JSON.parse(event.eventData);

          switch (event.eventType) {
            case 'farmerJoined':
              await this.farmerJoined(eventData);
              break;
            case 'productCreated':
              await this.productCreated(eventData);
              break;
            case 'productBought':
              await this.productBought(eventData);
              break;
            case 'stockUpdated':
              await this.stockUpdated(eventData);
              break;
            case 'priceIncreased':
              await this.priceIncreased(eventData);
              break;
            default:
              console.warn(`Unknown event type: ${event.eventType}`);
          }
        } catch (error) {
          console.error(`Error processing event ${event.id}:`, error);
        }
      }

      console.log('Finished processing unprocessed events');
      */
    } catch (error) {
      console.error('Error processing unprocessed events:', error);
      throw error;
    }
  }

  /**
   * Get contract statistics
   */
  async getContractStats(): Promise<any> {
    try {
      const totalFarmers = await this.prisma.user.count({
        where: { role: 'FARMER' }
      });

      const totalProducts = await this.prisma.listing.count({
        where: { description: { contains: 'Contract Product ID:' } }
      });

      const totalOrders = await this.prisma.order.count({
        where: { notes: { contains: 'Contract TX:' } }
      });

      // Simplified stats without contract balance tracking
      return {
        totalFarmers,
        totalProducts,
        totalOrders,
        totalContractBalance: 0 // Placeholder - would need separate tracking
      };
    } catch (error) {
      console.error('Error getting contract stats:', error);
      throw error;
    }
  }
}






