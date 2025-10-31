// Service to initialize and manage contract event monitoring
import { ContractEventMonitor, createContractEventMonitor } from './contractEventMonitor';
import { ContractEventHandlers } from './contractEventHandlers';

export class ContractMonitoringService {
  private static instance: ContractMonitoringService;
  private eventMonitor: ContractEventMonitor | null = null;
  private eventHandlers: ContractEventHandlers;
  private isInitialized: boolean = false;

  private constructor() {
    this.eventHandlers = new ContractEventHandlers();
  }

  static getInstance(): ContractMonitoringService {
    if (!ContractMonitoringService.instance) {
      ContractMonitoringService.instance = new ContractMonitoringService();
    }
    return ContractMonitoringService.instance;
  }

  /**
   * Initialize contract event monitoring
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('Contract monitoring service already initialized');
      return;
    }

    try {
      const contractAddress = process.env.AGRO_CONTRACT_ADDRESS;
      const rpcUrl = process.env.RPC_URL || process.env.NEXT_PUBLIC_RPC_URL;

      if (!contractAddress) {
        throw new Error('AGRO_CONTRACT_ADDRESS environment variable is required');
      }

      if (!rpcUrl) {
        throw new Error('RPC_URL environment variable is required');
      }

      console.log('Initializing contract event monitoring...');
      console.log(`Contract Address: ${contractAddress}`);
      console.log(`RPC URL: ${rpcUrl}`);

      // Create event monitor
      this.eventMonitor = createContractEventMonitor(
        contractAddress,
        rpcUrl,
        this.eventHandlers
      );

      // Start monitoring
      await this.eventMonitor.startMonitoring();

      this.isInitialized = true;
      console.log('Contract monitoring service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize contract monitoring service:', error);
      throw error;
    }
  }

  /**
   * Stop contract event monitoring
   */
  async stop(): Promise<void> {
    if (!this.isInitialized || !this.eventMonitor) {
      return;
    }

    try {
      await this.eventMonitor.stopMonitoring();
      this.isInitialized = false;
      console.log('Contract monitoring service stopped');
    } catch (error) {
      console.error('Error stopping contract monitoring service:', error);
      throw error;
    }
  }

  /**
   * Get contract statistics
   */
  async getStats(): Promise<any> {
    if (!this.eventMonitor) {
      throw new Error('Contract monitoring service not initialized');
    }

    const [monitorStats, handlerStats] = await Promise.all([
      this.eventMonitor.getContractStats(),
      this.eventHandlers.getContractStats()
    ]);

    return {
      ...monitorStats,
      ...handlerStats
    };
  }

  /**
   * Get contract events
   */
  async getEvents(eventType?: string, limit?: number, offset?: number): Promise<any[]> {
    if (!this.eventMonitor) {
      throw new Error('Contract monitoring service not initialized');
    }

    return await this.eventMonitor.getEvents(eventType, limit, offset);
  }

  /**
   * Process unprocessed events manually
   */
  async processUnprocessedEvents(): Promise<void> {
    if (!this.eventHandlers) {
      throw new Error('Event handlers not initialized');
    }

    await this.eventHandlers.processUnprocessedEvents();
  }

  /**
   * Check if service is initialized
   */
  isServiceInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Restart monitoring service
   */
  async restart(): Promise<void> {
    await this.stop();
    await this.initialize();
  }
}

// Export singleton instance
export const contractMonitoringService = ContractMonitoringService.getInstance();

// Helper functions
export const initializeContractMonitoring = () => contractMonitoringService.initialize();
export const stopContractMonitoring = () => contractMonitoringService.stop();
export const getContractStats = () => contractMonitoringService.getStats();
export const getContractEvents = (eventType?: string, limit?: number, offset?: number) => 
  contractMonitoringService.getEvents(eventType, limit, offset);
export const processUnprocessedEvents = () => contractMonitoringService.processUnprocessedEvents();






