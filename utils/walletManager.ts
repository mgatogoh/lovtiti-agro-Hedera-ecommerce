// Wallet connection utilities for Agro Contract integration
import { ethers } from 'ethers';
import { AgroContractService, createAgroContractService } from './agroContract';
import { CreateFarmerParams } from '../types/agro-contract';

export interface WalletConnection {
  address: string;
  privateKey: string;
  provider: ethers.Provider;
  signer: ethers.Signer;
  isConnected: boolean;
}

export interface WalletConnectionResult {
  success: boolean;
  wallet?: WalletConnection;
  error?: string;
}

export class WalletManager {
  private static instance: WalletManager;
  private currentWallet: WalletConnection | null = null;
  private contractService: AgroContractService;

  constructor() {
    this.contractService = createAgroContractService(
      process.env.NEXT_PUBLIC_AGRO_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
      (process.env.NEXT_PUBLIC_NETWORK as 'mainnet' | 'testnet' | 'local') || 'testnet'
    );
  }

  static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
    }
    return WalletManager.instance;
  }

  /**
   * Connect to MetaMask wallet
   */
  async connectMetaMask(): Promise<WalletConnectionResult> {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        return {
          success: false,
          error: 'MetaMask not detected. Please install MetaMask.'
        };
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        return {
          success: false,
          error: 'No accounts found. Please connect your wallet.'
        };
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Get private key (this is a simplified approach - in production, you'd handle this more securely)
      const privateKey = await this.getPrivateKeyFromSigner(signer);

      const wallet: WalletConnection = {
        address,
        privateKey,
        provider,
        signer,
        isConnected: true
      };

      this.currentWallet = wallet;

      return {
        success: true,
        wallet
      };

    } catch (error) {
      console.error('MetaMask connection error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to connect to MetaMask'
      };
    }
  }

  /**
   * Connect using private key (for testing or server-side operations)
   */
  async connectWithPrivateKey(privateKey: string, network: 'mainnet' | 'testnet' | 'local' = 'testnet'): Promise<WalletConnectionResult> {
    try {
      let provider: ethers.Provider;

      switch (network) {
        case 'mainnet':
          provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_KEY');
          break;
        case 'testnet':
          provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_INFURA_KEY');
          break;
        case 'local':
          provider = new ethers.JsonRpcProvider('http://localhost:8545');
          break;
        default:
          throw new Error('Unsupported network');
      }

      const wallet = new ethers.Wallet(privateKey, provider);
      const address = await wallet.getAddress();

      const walletConnection: WalletConnection = {
        address,
        privateKey,
        provider,
        signer: wallet,
        isConnected: true
      };

      this.currentWallet = walletConnection;

      return {
        success: true,
        wallet: walletConnection
      };

    } catch (error) {
      console.error('Private key connection error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to connect with private key'
      };
    }
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.currentWallet = null;
  }

  /**
   * Get current wallet
   */
  getCurrentWallet(): WalletConnection | null {
    return this.currentWallet;
  }

  /**
   * Check if wallet is connected
   */
  isWalletConnected(): boolean {
    return this.currentWallet?.isConnected || false;
  }

  /**
   * Create farmer account on the contract
   */
  async createFarmerAccount(userId: string): Promise<{ success: boolean; error?: string; transactionHash?: string }> {
    if (!this.currentWallet) {
      return {
        success: false,
        error: 'No wallet connected'
      };
    }

    try {
      const params: CreateFarmerParams = {
        walletAddress: this.currentWallet.address,
        privateKey: this.currentWallet.privateKey
      };

      const result = await this.contractService.createFarmer(params);

      if (result.success) {
        // Log the farmer creation
        console.log(`Farmer created: ${this.currentWallet.address} for user: ${userId}`, {
          transactionHash: result.transactionHash,
          gasUsed: result.gasUsed?.toString()
        });

        return {
          success: true,
          transactionHash: result.transactionHash
        };
      } else {
        return {
          success: false,
          error: result.error
        };
      }

    } catch (error) {
      console.error('Error creating farmer account:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create farmer account'
      };
    }
  }

  /**
   * Check if current wallet is a registered farmer
   */
  async isFarmer(): Promise<{ success: boolean; isFarmer: boolean; error?: string }> {
    if (!this.currentWallet) {
      return {
        success: false,
        isFarmer: false,
        error: 'No wallet connected'
      };
    }

    try {
      const result = await this.contractService.isFarmer(this.currentWallet.address);

      return {
        success: result.success,
        isFarmer: result.data || false,
        error: result.error
      };

    } catch (error) {
      console.error('Error checking farmer status:', error);
      return {
        success: false,
        isFarmer: false,
        error: error instanceof Error ? error.message : 'Failed to check farmer status'
      };
    }
  }

  /**
   * Get farmer information
   */
  async getFarmerInfo(): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!this.currentWallet) {
      return {
        success: false,
        error: 'No wallet connected'
      };
    }

    try {
      const result = await this.contractService.getFarmerInfo(this.currentWallet.address);

      return {
        success: result.success,
        data: result.data,
        error: result.error
      };

    } catch (error) {
      console.error('Error getting farmer info:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get farmer information'
      };
    }
  }

  /**
   * Get farmer's products
   */
  async getFarmerProducts(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    if (!this.currentWallet) {
      return {
        success: false,
        error: 'No wallet connected'
      };
    }

    try {
      const result = await this.contractService.getFarmerProducts(this.currentWallet.address);

      return {
        success: result.success,
        data: result.data,
        error: result.error
      };

    } catch (error) {
      console.error('Error getting farmer products:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get farmer products'
      };
    }
  }

  /**
   * Helper method to get private key from signer (simplified - not for production)
   */
  private async getPrivateKeyFromSigner(signer: ethers.Signer): Promise<string> {
    // This is a simplified approach. In production, you should handle private keys more securely
    // For MetaMask, you typically can't access the private key directly
    // This would need to be handled differently in a real application

    try {
      // For testing purposes, we'll generate a random private key
      // In production, you'd need to implement a secure key management system
      const randomWallet = ethers.Wallet.createRandom();
      return randomWallet.privateKey;
    } catch (error) {
      throw new Error('Unable to get private key from signer');
    }
  }

  /**
   * Listen for account changes
   */
  onAccountChange(callback: (accounts: string[]) => void): void {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', callback);
    }
  }

  /**
   * Listen for network changes
   */
  onNetworkChange(callback: (chainId: string) => void): void {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('chainChanged', callback);
    }
  }

  /**
   * Remove event listeners
   */
  removeListeners(): void {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    }
  }
}

// Export singleton instance
export const walletManager = WalletManager.getInstance();

// Helper functions for easy use
export const connectWallet = () => walletManager.connectMetaMask();
export const connectWithPrivateKey = (privateKey: string, network?: 'mainnet' | 'testnet' | 'local') =>
  walletManager.connectWithPrivateKey(privateKey, network);
export const disconnectWallet = () => walletManager.disconnect();
export const getCurrentWallet = () => walletManager.getCurrentWallet();
export const isWalletConnected = () => walletManager.isWalletConnected();
export const createFarmerAccount = (userId: string) => walletManager.createFarmerAccount(userId);
export const checkFarmerStatus = () => walletManager.isFarmer();
export const getFarmerInfo = () => walletManager.getFarmerInfo();
export const getFarmerProducts = () => walletManager.getFarmerProducts();

// Type declarations for window.ethereum
// Global window interface declaration removed to avoid conflicts
