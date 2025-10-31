// Delivery tracking service for orders
import { PrismaClient } from '@prisma/client';

export interface DeliveryUpdate {
  orderId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED_DELIVERY' | 'RETURNED';
  location?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  deliveryProof?: string[];
  carrier?: string;
  trackiHBARumber?: string;
}

export interface DeliveryStats {
  totalDeliveries: number;
  pendingDeliveries: number;
  inTransitDeliveries: number;
  deliveredCount: number;
  failedDeliveries: number;
  averageDeliveryTime: number; // in hours
}

export class DeliveryTrackingService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Update delivery status for an order
   */
  async updateDeliveryStatus(update: DeliveryUpdate): Promise<any> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: update.orderId },
        include: { buyer: true, listing: { include: { seller: true } } }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // Update order delivery status (using available fields)
      const updatedOrder = await this.prisma.order.update({
        where: { id: update.orderId },
        data: {
          deliveryDate: update.estimatedDelivery,
          trackiHBARumber: update.trackiHBARumber,
          notes: update.notes ? `${order.notes || ''}\nDelivery: ${update.notes}`.trim() : order.notes,
          updatedAt: new Date()
        }
      });

      // Create tracking update
      await this.prisma.trackingUpdate.create({
        data: {
          orderId: update.orderId,
          location: update.location || 'Unknown',
          latitude: update.latitude,
          longitude: update.longitude,
          status: update.status,
          notes: update.notes
        }
      });

      // If delivered, update order status
      if (update.status === 'DELIVERED') {
        await this.prisma.order.update({
          where: { id: update.orderId },
          data: {
            status: 'DELIVERED',
            deliveryDate: update.actualDelivery || new Date()
          }
        });
      }

      return updatedOrder;
    } catch (error) {
      console.error('Error updating delivery status:', error);
      throw error;
    }
  }

  /**
   * Get delivery tracking for an order
   */
  async getOrderTracking(orderId: string): Promise<any> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          trackingUpdates: {
            orderBy: { timestamp: 'asc' }
          },
          buyer: true,
          listing: { include: { seller: true } }
        }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      return order;
    } catch (error) {
      console.error('Error getting order tracking:', error);
      throw error;
    }
  }

  /**
   * Get all deliveries for a user (buyer or seller)
   */
  async getUserDeliveries(userId: string, userType: 'buyer' | 'seller'): Promise<any[]> {
    try {
      const where = userType === 'buyer'
        ? { buyerId: userId }
        : { listing: { sellerId: userId } };

      const orders = await this.prisma.order.findMany({
        where,
        include: {
          trackingUpdates: {
            orderBy: { timestamp: 'desc' },
            take: 1
          },
          buyer: true,
          listing: { include: { seller: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      return orders;
    } catch (error) {
      console.error('Error getting user deliveries:', error);
      throw error;
    }
  }

  /**
   * Get delivery statistics
   */
  async getDeliveryStats(): Promise<DeliveryStats> {
    try {
      const [
        totalDeliveries,
        pendingDeliveries,
        inTransitDeliveries,
        deliveredOrders,
        failedDeliveries,
        completedDeliveries
      ] = await Promise.all([
        this.prisma.order.count(),
        this.prisma.order.count({
          where: { status: 'PENDING' }
        }),
        this.prisma.order.count({
          where: { status: 'IN_TRANSIT' }
        }),
        this.prisma.order.count({
          where: { status: 'DELIVERED' }
        }),
        this.prisma.order.count({
          where: { status: 'CANCELLED' }
        }),
        this.prisma.order.findMany({
          where: {
            status: 'DELIVERED',
            deliveryDate: { not: null },
            createdAt: { not: null as any }
          },
          select: {
            createdAt: true,
            deliveryDate: true
          }
        })
      ]);

      // Calculate average delivery time
      let averageDeliveryTime = 0;
      if (completedDeliveries.length > 0) {
        const totalHours = completedDeliveries.reduce((sum, order) => {
          if (order.deliveryDate && order.createdAt) {
            const hours = (order.deliveryDate.getTime() - order.createdAt.getTime()) / (1000 * 60 * 60);
            return sum + hours;
          }
          return sum;
        }, 0);
        averageDeliveryTime = totalHours / completedDeliveries.length;
      }

      return {
        totalDeliveries,
        pendingDeliveries,
        inTransitDeliveries,
        deliveredCount: deliveredOrders,
        failedDeliveries,
        averageDeliveryTime: Math.round(averageDeliveryTime * 100) / 100
      };
    } catch (error) {
      console.error('Error getting delivery stats:', error);
      throw error;
    }
  }

  /**
   * Add delivery proof (photos/videos)
   */
  async addDeliveryProof(orderId: string, proofUrls: string[]): Promise<any> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // Store delivery proof in notes field (simplified approach)
      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          notes: `${order.notes || ''}\nDelivery Proof: ${proofUrls.join(', ')}`.trim()
        }
      });

      return updatedOrder;
    } catch (error) {
      console.error('Error adding delivery proof:', error);
      throw error;
    }
  }

  /**
   * Rate delivery and add feedback
   */
  async rateDelivery(orderId: string, rating: number, feedback?: string): Promise<any> {
    try {
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const order = await this.prisma.order.findUnique({
        where: { id: orderId }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // Store rating and feedback in notes field (simplified approach)
      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          notes: `${order.notes || ''}\nRating: ${rating}/5${feedback ? `, Feedback: ${feedback}` : ''}`.trim()
        }
      });

      return updatedOrder;
    } catch (error) {
      console.error('Error rating delivery:', error);
      throw error;
    }
  }

  /**
   * Get delivery analytics for admin dashboard
   */
  async getDeliveryAnalytics(): Promise<any> {
    try {
      const [
        stats,
        recentDeliveries,
        topSellers,
        deliveryTrends
      ] = await Promise.all([
        this.getDeliveryStats(),
        this.prisma.order.findMany({
          where: { notes: { contains: 'Contract TX:' } },
          include: {
            buyer: true,
            listing: { include: { seller: true } }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }),
        this.prisma.order.groupBy({
          by: ['listingId'],
          where: { notes: { contains: 'Contract TX:' } },
          _count: { listingId: true },
          orderBy: { _count: { listingId: 'desc' } },
          take: 5
        }),
        this.prisma.order.groupBy({
          by: ['status'],
          _count: { status: true }
        })
      ]);

      return {
        stats,
        recentDeliveries,
        topSellers,
        deliveryTrends
      };
    } catch (error) {
      console.error('Error getting delivery analytics:', error);
      throw error;
    }
  }

  /**
   * Update order status based on delivery status
   */
  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    try {
      const order = await this.prisma.order.update({
        where: { id: orderId },
        data: { status: status as any }
      });

      return order;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  /**
   * Get orders by delivery status
   */
  async getOrdersByDeliveryStatus(status: string): Promise<any[]> {
    try {
      const orders = await this.prisma.order.findMany({
        where: { status: status as any },
        include: {
          buyer: true,
          listing: { include: { seller: true } },
          trackingUpdates: {
            orderBy: { timestamp: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return orders;
    } catch (error) {
      console.error('Error getting orders by delivery status:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const deliveryTrackingService = new DeliveryTrackingService();






