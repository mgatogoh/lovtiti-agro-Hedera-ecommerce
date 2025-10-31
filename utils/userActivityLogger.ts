// User Activity Logger for Lovtiti Agro Mart
// Tracks and logs user interactions across the platform

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type ActivityType = 
  | 'LOGIN'
  | 'LOGOUT'
  | 'REGISTER'
  | 'PROFILE_UPDATE'
  | 'KYC_SUBMIT'
  | 'KYC_APPROVE'
  | 'KYC_REJECT'
  | 'LISTING_CREATE'
  | 'LISTING_UPDATE'
  | 'LISTING_DELETE'
  | 'LISTING_VIEW'
  | 'ORDER_CREATE'
  | 'ORDER_UPDATE'
  | 'ORDER_CANCEL'
  | 'CART_ADD'
  | 'CART_REMOVE'
  | 'CART_CLEAR'
  | 'MESSAGE_SEND'
  | 'MESSAGE_RECEIVE'
  | 'DISPUTE_CREATE'
  | 'DISPUTE_RESOLVE'
  | 'PAYMENT_INITIATE'
  | 'PAYMENT_COMPLETE'
  | 'SEARCH_PERFORM'
  | 'FILTER_APPLY'
  | 'DASHBOARD_ACCESS'
  | 'ADMIN_ACTION'
  | 'ERROR_OCCURRED';

export interface UserActivity {
  userId: string;
  userRole: string;
  userEmail: string;
  activityType: ActivityType;
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export class UserActivityLogger {
  private static instance: UserActivityLogger;
  private activities: UserActivity[] = [];
  private isLoggingEnabled: boolean = true;

  private constructor() {}

  public static getInstance(): UserActivityLogger {
    if (!UserActivityLogger.instance) {
      UserActivityLogger.instance = new UserActivityLogger();
    }
    return UserActivityLogger.instance;
  }

  public enableLogging(): void {
    this.isLoggingEnabled = true;
    console.log('🔍 User activity logging enabled');
  }

  public disableLogging(): void {
    this.isLoggingEnabled = false;
    console.log('🔇 User activity logging disabled');
  }

  public logActivity(activity: Omit<UserActivity, 'timestamp'>): void {
    if (!this.isLoggingEnabled) return;

    const fullActivity: UserActivity = {
      ...activity,
      timestamp: new Date()
    };

    // Add to memory cache
    this.activities.push(fullActivity);

    // Console log the activity
    this.consoleLogActivity(fullActivity);

    // In production, you might want to batch save to database
    // For now, we'll log to console and store in memory
  }

  private consoleLogActivity(activity: UserActivity): void {
    const timestamp = activity.timestamp.toISOString();
    const logMessage = `[${timestamp}] 👤 USER_ACTIVITY: ${activity.userRole} (${activity.userEmail}) - ${activity.activityType}`;
    
    console.log('='.repeat(80));
    console.log(logMessage);
    console.log(`📝 Description: ${activity.description}`);
    
    if (activity.metadata && Object.keys(activity.metadata).length > 0) {
      console.log('📊 Metadata:', JSON.stringify(activity.metadata, null, 2));
    }
    
    if (activity.ipAddress) {
      console.log(`🌐 IP Address: ${activity.ipAddress}`);
    }
    
    console.log('='.repeat(80));
  }

  public async saveToDatabase(activity: UserActivity): Promise<void> {
    try {
      // In a real implementation, you would save to a UserActivity table
      // For now, we'll just log that we would save it
      console.log(`💾 Would save activity to database: ${activity.activityType} for user ${activity.userId}`);
      
      // Example of what the database save would look like:
      /*
      await prisma.userActivity.create({
        data: {
          userId: activity.userId,
          userRole: activity.userRole,
          userEmail: activity.userEmail,
          activityType: activity.activityType,
          description: activity.description,
          metadata: activity.metadata,
          ipAddress: activity.ipAddress,
          userAgent: activity.userAgent,
          timestamp: activity.timestamp
        }
      });
      */
    } catch (error) {
      console.error('❌ Error saving user activity to database:', error);
    }
  }

  public getRecentActivities(limit: number = 50): UserActivity[] {
    return this.activities
      .slice(-limit)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getActivitiesByUser(userId: string, limit: number = 20): UserActivity[] {
    return this.activities
      .filter(activity => activity.userId === userId)
      .slice(-limit)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public getActivitiesByType(activityType: ActivityType, limit: number = 20): UserActivity[] {
    return this.activities
      .filter(activity => activity.activityType === activityType)
      .slice(-limit)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public clearActivities(): void {
    this.activities = [];
    console.log('🗑️ User activity cache cleared');
  }

  public getActivityStats(): {
    totalActivities: number;
    activitiesByType: Record<ActivityType, number>;
    activitiesByRole: Record<string, number>;
    recentActivityCount: number;
  } {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const recentActivities = this.activities.filter(
      activity => activity.timestamp >= oneHourAgo
    );

    const activitiesByType = this.activities.reduce((acc, activity) => {
      acc[activity.activityType] = (acc[activity.activityType] || 0) + 1;
      return acc;
    }, {} as Record<ActivityType, number>);

    const activitiesByRole = this.activities.reduce((acc, activity) => {
      acc[activity.userRole] = (acc[activity.userRole] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalActivities: this.activities.length,
      activitiesByType,
      activitiesByRole,
      recentActivityCount: recentActivities.length
    };
  }
}

// Helper functions for common activities
export const logUserLogin = (userId: string, userRole: string, userEmail: string, metadata?: Record<string, any>) => {
  const logger = UserActivityLogger.getInstance();
  logger.logActivity({
    userId,
    userRole,
    userEmail,
    activityType: 'LOGIN',
    description: `User logged into the platform`,
    metadata
  });
};

export const logUserLogout = (userId: string, userRole: string, userEmail: string, metadata?: Record<string, any>) => {
  const logger = UserActivityLogger.getInstance();
  logger.logActivity({
    userId,
    userRole,
    userEmail,
    activityType: 'LOGOUT',
    description: `User logged out of the platform`,
    metadata
  });
};

export const logUserRegistration = (userId: string, userRole: string, userEmail: string, metadata?: Record<string, any>) => {
  const logger = UserActivityLogger.getInstance();
  logger.logActivity({
    userId,
    userRole,
    userEmail,
    activityType: 'REGISTER',
    description: `New user registered with role: ${userRole}`,
    metadata
  });
};

export const logCartActivity = (userId: string, userRole: string, userEmail: string, activityType: 'CART_ADD' | 'CART_REMOVE' | 'CART_CLEAR', metadata?: Record<string, any>) => {
  const logger = UserActivityLogger.getInstance();
  logger.logActivity({
    userId,
    userRole,
    userEmail,
    activityType,
    description: `User ${activityType.toLowerCase().replace('_', ' ')} activity`,
    metadata
  });
};

export const logListingActivity = (userId: string, userRole: string, userEmail: string, activityType: 'LISTING_CREATE' | 'LISTING_UPDATE' | 'LISTING_DELETE' | 'LISTING_VIEW', metadata?: Record<string, any>) => {
  const logger = UserActivityLogger.getInstance();
  logger.logActivity({
    userId,
    userRole,
    userEmail,
    activityType,
    description: `User ${activityType.toLowerCase().replace('_', ' ')} activity`,
    metadata
  });
};

export const logOrderActivity = (userId: string, userRole: string, userEmail: string, activityType: 'ORDER_CREATE' | 'ORDER_UPDATE' | 'ORDER_CANCEL', metadata?: Record<string, any>) => {
  const logger = UserActivityLogger.getInstance();
  logger.logActivity({
    userId,
    userRole,
    userEmail,
    activityType,
    description: `User ${activityType.toLowerCase().replace('_', ' ')} activity`,
    metadata
  });
};

export const logDashboardAccess = (userId: string, userRole: string, userEmail: string, dashboardType: string, metadata?: Record<string, any>) => {
  const logger = UserActivityLogger.getInstance();
  logger.logActivity({
    userId,
    userRole,
    userEmail,
    activityType: 'DASHBOARD_ACCESS',
    description: `User accessed ${dashboardType} dashboard`,
    metadata: { dashboardType, ...metadata }
  });
};

export const logAdminAction = (userId: string, userRole: string, userEmail: string, action: string, metadata?: Record<string, any>) => {
  const logger = UserActivityLogger.getInstance();
  logger.logActivity({
    userId,
    userRole,
    userEmail,
    activityType: 'ADMIN_ACTION',
    description: `Admin action: ${action}`,
    metadata: { action, ...metadata }
  });
};

export const logError = (userId: string, userRole: string, userEmail: string, error: string, metadata?: Record<string, any>) => {
  const logger = UserActivityLogger.getInstance();
  logger.logActivity({
    userId,
    userRole,
    userEmail,
    activityType: 'ERROR_OCCURRED',
    description: `Error occurred: ${error}`,
    metadata: { error, ...metadata }
  });
};

// Export the singleton instance
export const userActivityLogger = UserActivityLogger.getInstance();







