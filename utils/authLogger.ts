// Authentication Logger for tracking user login/logout activities
// This integrates with Clerk authentication events

import { logUserLogin, logUserLogout, logDashboardAccess } from './userActivityLogger';

export interface AuthEvent {
  userId: string;
  userRole: string;
  userEmail: string;
  eventType: 'LOGIN' | 'LOGOUT' | 'SESSION_ACTIVE';
  metadata?: Record<string, any>;
}

export class AuthLogger {
  private static instance: AuthLogger;
  private activeSessions: Map<string, AuthEvent> = new Map();

  private constructor() {}

  public static getInstance(): AuthLogger {
    if (!AuthLogger.instance) {
      AuthLogger.instance = new AuthLogger();
    }
    return AuthLogger.instance;
  }

  public logLogin(userId: string, userRole: string, userEmail: string, metadata?: Record<string, any>): void {
    console.log('🔐 LOGIN EVENT:', {
      userId,
      userRole,
      userEmail,
      timestamp: new Date().toISOString(),
      metadata
    });

    // Log the login activity
    logUserLogin(userId, userRole, userEmail, {
      loginMethod: 'clerk',
      timestamp: new Date().toISOString(),
      ...metadata
    });

    // Track active session
    this.activeSessions.set(userId, {
      userId,
      userRole,
      userEmail,
      eventType: 'SESSION_ACTIVE',
      metadata
    });

    console.log(`✅ User ${userEmail} (${userRole}) logged in successfully`);
    console.log(`📊 Active sessions: ${this.activeSessions.size}`);
  }

  public logLogout(userId: string, userRole: string, userEmail: string, metadata?: Record<string, any>): void {
    console.log('🚪 LOGOUT EVENT:', {
      userId,
      userRole,
      userEmail,
      timestamp: new Date().toISOString(),
      metadata
    });

    // Log the logout activity
    logUserLogout(userId, userRole, userEmail, {
      logoutMethod: 'clerk',
      timestamp: new Date().toISOString(),
      ...metadata
    });

    // Remove from active sessions
    this.activeSessions.delete(userId);

    console.log(`✅ User ${userEmail} (${userRole}) logged out successfully`);
    console.log(`📊 Active sessions: ${this.activeSessions.size}`);
  }

  public logDashboardAccess(userId: string, userRole: string, userEmail: string, dashboardType: string, metadata?: Record<string, any>): void {
    console.log('📊 DASHBOARD ACCESS:', {
      userId,
      userRole,
      userEmail,
      dashboardType,
      timestamp: new Date().toISOString(),
      metadata
    });

    // Log dashboard access
    logDashboardAccess(userId, userRole, userEmail, dashboardType, {
      timestamp: new Date().toISOString(),
      ...metadata
    });
  }

  public getActiveSessions(): AuthEvent[] {
    return Array.from(this.activeSessions.values());
  }

  public getActiveSessionCount(): number {
    return this.activeSessions.size;
  }

  public isUserActive(userId: string): boolean {
    return this.activeSessions.has(userId);
  }

  public getUserSession(userId: string): AuthEvent | undefined {
    return this.activeSessions.get(userId);
  }

  public clearAllSessions(): void {
    console.log(`🧹 Clearing all active sessions (${this.activeSessions.size} sessions)`);
    this.activeSessions.clear();
  }

  public getSessionStats(): {
    totalActiveSessions: number;
    sessionsByRole: Record<string, number>;
    oldestSession: AuthEvent | null;
    newestSession: AuthEvent | null;
  } {
    const sessions = this.getActiveSessions();
    const sessionsByRole = sessions.reduce((acc, session) => {
      acc[session.userRole] = (acc[session.userRole] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedSessions = sessions.sort((a, b) => {
      const aTime = new Date(a.metadata?.timestamp || 0).getTime();
      const bTime = new Date(b.metadata?.timestamp || 0).getTime();
      return aTime - bTime;
    });

    return {
      totalActiveSessions: sessions.length,
      sessionsByRole,
      oldestSession: sortedSessions[0] || null,
      newestSession: sortedSessions[sortedSessions.length - 1] || null
    };
  }
}

// Export the singleton instance
export const authLogger = AuthLogger.getInstance();











