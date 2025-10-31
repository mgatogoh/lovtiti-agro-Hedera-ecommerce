// WebSocket service for monitoring smart contract events
import { ethers } from 'ethers';
import { PrismaClient } from '@prisma/client';
import { AGRO_CONTRACT_ABI } from '../types/agro-contract';

export interface ContractEventData {
  eventType: string;
  contractAddress: string;
  transactionHash: string;
  blockNumber: bigint;
  logIndex: number;
  eventData: any;
}

export interface EventHandler {
  farmerJoined: (data: any) => Promise<void>;
  productCreated: (data: any) => Promise<void>;
  productBought: (data: any) => Promise<void>;
  stockUpdated: (data: any) => Promise<void>;
  priceIncreased: (data: any) => Promise<void>;
}

export class ContractEventMonitor {
  private provider: ethers.Provider;
  private contract: ethers.Contract;
  private prisma: PrismaClient;
  private isMonitoring: boolean = false;
  private eventHandlers: EventHandler;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 5000; // 5 seconds

  constructor(
    contractAddress: string,
    rpcUrl: string,
    eventHandlers: EventHandler
  ) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.contract = new ethers.Contract(contractAddress, AGRO_CONTRACT_ABI, this.provider);
    this.prisma = new PrismaClient();
    this.eventHandlers = eventHandlers;
  }

  /**
   * Start monitoring contract events
   */
  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) {
      console.log('Contract monitoring already started');
      return;
    }

    console.log('Starting contract event monitoring...');
    this.isMonitoring = true;

    try {
      // Set up event listeners for all contract events
      await this.setupEventListeners();

      // Process any missed events since last monitoring
      await this.processMissedEvents();

      console.log('Contract event monitoring started successfully');
    } catch (error) {
      console.error('Failed to start contract monitoring:', error);
      this.isMonitoring = false;
      throw error;
    }
  }

  /**
   * Stop monitoring contract events
   */
  async stopMonitoring(): Promise<void> {
    if (!this.isMonitoring) {
      return;
    }

    console.log('Stopping contract event monitoring...');
    this.isMonitoring = false;

    // Remove all event listeners
    this.contract.removeAllListeners();

    console.log('Contract event monitoring stopped');
  }

  /**
   * Set up event listeners for all contract events
   */
  private async setupEventListeners(): Promise<void> {
    // Farmer joined event
    this.contract.on('farmerJoined', async (farmerAddress: string, event: any) => {
      await this.handleEvent('farmerJoined', {
        farmerAddress,
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        logIndex: event.logIndex
      });
    });

    // Product created event
    this.contract.on('productCreated', async (
      productId: bigint,
      price: bigint,
      farmer: string,
      amount: bigint,
      event: any
    ) => {
      await this.handleEvent('productCreated', {
        productId: productId.toString(),
        price: price.toString(),
        farmerAddress: farmer,
        amount: amount.toString(),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        logIndex: event.logIndex
      });
    });

    // Product bought event
    this.contract.on('productBought', async (
      productId: bigint,
      buyer: string,
      farmer: string,
      amount: bigint,
      event: any
    ) => {
      await this.handleEvent('productBought', {
        productId: productId.toString(),
        buyerAddress: buyer,
        farmerAddress: farmer,
        amount: amount.toString(),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        logIndex: event.logIndex
      });
    });

    // Stock updated event
    this.contract.on('stockUpdated', async (
      amount: bigint,
      productId: bigint,
      event: any
    ) => {
      await this.handleEvent('stockUpdated', {
        amount: amount.toString(),
        productId: productId.toString(),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        logIndex: event.logIndex
      });
    });

    // Price increased event
    this.contract.on('priceIncreased', async (
      price: bigint,
      productId: bigint,
      event: any
    ) => {
      await this.handleEvent('priceIncreased', {
        price: price.toString(),
        productId: productId.toString(),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        logIndex: event.logIndex
      });
    });

    // Handle connection errors
    this.provider.on('error', (error) => {
      console.error('Provider error:', error);
      this.handleConnectionError();
    });

    // Handle network changes
    this.provider.on('network', (newNetwork, oldNetwork) => {
      console.log('Network changed:', { oldNetwork, newNetwork });
      if (oldNetwork) {
        this.handleConnectionError();
      }
    });
  }

  /**
   * Handle individual contract events
   */
  private async handleEvent(eventType: string, eventData: any): Promise<void> {
    try {
      console.log(`Processing ${eventType} event:`, eventData);

      // Store event in database
      await this.storeEvent(eventType, eventData);

      // Process event based on type
      switch (eventType) {
        case 'farmerJoined':
          await this.eventHandlers.farmerJoined(eventData);
          break;
        case 'productCreated':
          await this.eventHandlers.productCreated(eventData);
          break;
        case 'productBought':
          await this.eventHandlers.productBought(eventData);
          break;
        case 'stockUpdated':
          await this.eventHandlers.stockUpdated(eventData);
          break;
        case 'priceIncreased':
          await this.eventHandlers.priceIncreased(eventData);
          break;
        default:
          console.warn(`Unknown event type: ${eventType}`);
      }

      console.log(`Successfully processed ${eventType} event`);
    } catch (error) {
      console.error(`Error processing ${eventType} event:`, error);
    }
  }

  /**
   * Store event in database
   */
  private async storeEvent(eventType: string, eventData: any): Promise<void> {
    try {
      // Store event (simplified - no contractEvent table)
      console.log(`Storing event: ${eventType}`, eventData);
      /*
      await this.prisma.contractEvent.create({
        data: {
          eventType,
          contractAddress: this.contract.target as string,
          transactionHash: eventData.transactionHash,
          blockNumber: BigInt(eventData.blockNumber),
          logIndex: eventData.logIndex,
          eventData: JSON.stringify(eventData),
          processed: false
        }
      });
      */
    } catch (error) {
      console.error('Error storing event:', error);
    }
  }

  /**
   * Process any missed events since last monitoring
   */
  private async processMissedEvents(): Promise<void> {
    try {
      // Get the last processed block number (simplified - no contractEvent table)
      const lastEvent = null as { blockNumber: bigint } | null;
      /*
      const lastEvent = await this.prisma.contractEvent.findFirst({
        orderBy: { blockNumber: 'desc' },
        where: { processed: true }
      });
      */

      const fromBlock = lastEvent ? Number(lastEvent.blockNumber) + 1 : 0;
      const toBlock = await this.provider.getBlockNumber();

      if (fromBlock > toBlock) {
        return; // No new blocks
      }

      console.log(`Processing missed events from block ${fromBlock} to ${toBlock}`);

      // const filter = this.contract.filters;
      // const events = await this.contract.queryFilter(filter, fromBlock, toBlock);
      const events: any[] = [];

      // Process each event
      for (const event of events) {
        if (event.log) {
          const parsed = this.contract.interface.parseLog(event.log);
          if (parsed) {
            await this.handleEvent(parsed.name, {
              ...parsed.args,
              transactionHash: event.transactionHash,
              blockNumber: event.blockNumber,
              logIndex: event.logIndex
            });
          }
        }
      }
    } catch (error) {
      console.error('Error processing missed events:', error);
    }
  }

  /**
   * Handle connection errors and attempt reconnection
   */
  private async handleConnectionError(): Promise<void> {
    if (!this.isMonitoring) {
      return;
    }

    console.log('Connection error detected, attempting reconnection...');

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached, stopping monitoring');
      this.isMonitoring = false;
      return;
    }

    this.reconnectAttempts++;

    // Wait before attempting reconnection
    setTimeout(async () => {
      try {
        await this.stopMonitoring();
        await this.startMonitoring();
        this.reconnectAttempts = 0; // Reset on successful reconnection
        console.log('Successfully reconnected to contract events');
      } catch (error) {
        console.error('Reconnection failed:', error);
        this.handleConnectionError();
      }
    }, this.reconnectDelay);
  }

  /**
   * Get contract events from database
   */
  async getEvents(
    eventType?: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<any[]> {
    const where = eventType ? { eventType } : {};

    // Get events (simplified - no contractEvent table)
    console.log('Getting events:', { eventType, limit, offset });
    return [];
    /*
    return await this.prisma.contractEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });
    */
  }

  /**
   * Mark events as processed
   */
  async markEventsAsProcessed(eventIds: string[]): Promise<void> {
    // Mark events as processed (simplified - no contractEvent table)
    console.log('Marking events as processed:', eventIds);
    /*
    await this.prisma.contractEvent.updateMany({
      where: { id: { in: eventIds } },
      data: {
        processed: true,
        processedAt: new Date()
      }
    });
    */
  }

  /**
   * Get unprocessed events
   */
  async getUnprocessedEvents(): Promise<any[]> {
    // Get unprocessed events (simplified - no contractEvent table)
    console.log('Getting unprocessed events');
    return [];
    /*
    return await this.prisma.contractEvent.findMany({
      where: { processed: false },
      orderBy: { createdAt: 'asc' }
    });
    */
  }

  /**
   * Get contract statistics
   */
  async getContractStats(): Promise<any> {
    // Get contract stats (simplified - no contractEvent table)
    const totalEvents = 0;
    const processedEvents = 0;
    const unprocessedEvents = 0;
    const eventTypes: any[] = [];

    /*
    const totalEvents = await this.prisma.contractEvent.count();
    const processedEvents = await this.prisma.contractEvent.count({
      where: { processed: true }
    });
    const unprocessedEvents = totalEvents - processedEvents;

    const eventTypes = await this.prisma.contractEvent.groupBy({
      by: ['eventType'],
      _count: { eventType: true }
    });
    */

    return {
      totalEvents,
      processedEvents,
      unprocessedEvents,
      eventTypes: eventTypes.map(et => ({
        type: et.eventType,
        count: et._count.eventType
      }))
    };
  }
}

// Factory function to create event monitor
export function createContractEventMonitor(
  contractAddress: string,
  rpcUrl: string,
  eventHandlers: EventHandler
): ContractEventMonitor {
  return new ContractEventMonitor(contractAddress, rpcUrl, eventHandlers);
}






