// Service to initialize contract monitoring on application startup
import { contractMonitoringService } from './contractMonitoringService';

export class ApplicationStartupService {
  private static instance: ApplicationStartupService;
  private isInitialized: boolean = false;

  private constructor() {}

  static getInstance(): ApplicationStartupService {
    if (!ApplicationStartupService.instance) {
      ApplicationStartupService.instance = new ApplicationStartupService();
    }
    return ApplicationStartupService.instance;
  }

  /**
   * Initialize all services on application startup
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('Application services already initialized');
      return;
    }

    try {
      console.log('Initializing application services...');

      // Initialize contract monitoring
      await contractMonitoringService.initialize();

      this.isInitialized = true;
      console.log('Application services initialized successfully');
    } catch (error) {
      console.error('Failed to initialize application services:', error);
      throw error;
    }
  }

  /**
   * Gracefully shutdown all services
   */
  async shutdown(): Promise<void> {
    if (!this.isInitialized) {
      return;
    }

    try {
      console.log('Shutting down application services...');

      // Stop contract monitoring
      await contractMonitoringService.stop();

      this.isInitialized = false;
      console.log('Application services shut down successfully');
    } catch (error) {
      console.error('Error shutting down application services:', error);
      throw error;
    }
  }

  /**
   * Check if services are initialized
   */
  isServiceInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get service status
   */
  async getServiceStatus(): Promise<any> {
    try {
      const contractStats = await contractMonitoringService.getStats();
      
      return {
        initialized: this.isInitialized,
        contractMonitoring: {
          initialized: contractMonitoringService.isServiceInitialized(),
          stats: contractStats
        }
      };
    } catch (error) {
      console.error('Error getting service status:', error);
      return {
        initialized: this.isInitialized,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const applicationStartupService = ApplicationStartupService.getInstance();

// Helper functions
export const initializeApplication = () => applicationStartupService.initialize();
export const shutdownApplication = () => applicationStartupService.shutdown();
export const getServiceStatus = () => applicationStartupService.getServiceStatus();






