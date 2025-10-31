// React hook for wallet management and agro contract integration
import { useState, useEffect, useCallback } from 'react';
import { walletManager, WalletConnection } from '../utils/walletManager';
import { processAgroContractPayment, PaymentRequest, PaymentResponse } from '../utils/payments';

export interface UseWalletResult {
  // Wallet state
  wallet: WalletConnection | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;

  // Wallet actions
  connectWallet: () => Promise<void>;
  connectWithPrivateKey: (privateKey: string, network?: 'mainnet' | 'testnet' | 'local') => Promise<void>;
  disconnectWallet: () => void;

  // Farmer actions
  isFarmer: boolean | null;
  farmerInfo: any | null;
  farmerProducts: any[] | null;
  createFarmerAccount: (userId: string) => Promise<{ success: boolean; error?: string; transactionHash?: string }>;
  checkFarmerStatus: () => Promise<void>;
  getFarmerInfo: () => Promise<void>;
  getFarmerProducts: () => Promise<void>;

  // Product actions
  buyProduct: (productId: string, amount: number, value: string, userId: string) => Promise<PaymentResponse>;
  addProduct: (price: string, amount: number, userId: string) => Promise<{ success: boolean; error?: string; transactionHash?: string }>;
  updateStock: (productId: string, stock: number, userId: string) => Promise<{ success: boolean; error?: string; transactionHash?: string }>;
  increasePrice: (productId: string, price: string, userId: string) => Promise<{ success: boolean; error?: string; transactionHash?: string }>;
  withdrawBalance: (userId: string) => Promise<{ success: boolean; error?: string; transactionHash?: string }>;

  // Loading states
  isCreatingFarmer: boolean;
  isBuyingProduct: boolean;
  isAddingProduct: boolean;
  isUpdatingStock: boolean;
  isIncreasingPrice: boolean;
  isWithdrawing: boolean;
}

export const useWallet = (): UseWalletResult => {
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Farmer state
  const [isFarmer, setIsFarmer] = useState<boolean | null>(null);
  const [farmerInfo, setFarmerInfo] = useState<any | null>(null);
  const [farmerProducts, setFarmerProducts] = useState<any[] | null>(null);

  // Loading states
  const [isCreatingFarmer, setIsCreatingFarmer] = useState(false);
  const [isBuyingProduct, setIsBuyingProduct] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);
  const [isIncreasingPrice, setIsIncreasingPrice] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Initialize wallet state
  useEffect(() => {
    const currentWallet = walletManager.getCurrentWallet();
    if (currentWallet) {
      setWallet(currentWallet);
      setIsConnected(true);
      checkFarmerStatus();
    }
  }, []);

  // Set up event listeners
  useEffect(() => {
    const handleAccountChange = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        setWallet(null);
        setIsConnected(false);
        setIsFarmer(null);
        setFarmerInfo(null);
        setFarmerProducts(null);
      } else {
        // Account changed
        const currentWallet = walletManager.getCurrentWallet();
        if (currentWallet) {
          setWallet(currentWallet);
          setIsConnected(true);
          checkFarmerStatus();
        }
      }
    };

    const handleNetworkChange = (chainId: string) => {
      console.log('Network changed to:', chainId);
      // You might want to refresh contract connection or show a warning
    };

    walletManager.onAccountChange(handleAccountChange);
    walletManager.onNetworkChange(handleNetworkChange);

    return () => {
      walletManager.removeListeners();
    };
  }, []);

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const result = await walletManager.connectMetaMask();
      
      if (result.success && result.wallet) {
        setWallet(result.wallet);
        setIsConnected(true);
        await checkFarmerStatus();
      } else {
        setError(result.error || 'Failed to connect wallet');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const connectWithPrivateKey = useCallback(async (privateKey: string, network?: 'mainnet' | 'testnet' | 'local') => {
    setIsConnecting(true);
    setError(null);

    try {
      const result = await walletManager.connectWithPrivateKey(privateKey, network);
      
      if (result.success && result.wallet) {
        setWallet(result.wallet);
        setIsConnected(true);
        await checkFarmerStatus();
      } else {
        setError(result.error || 'Failed to connect with private key');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect with private key');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    walletManager.disconnect();
    setWallet(null);
    setIsConnected(false);
    setIsFarmer(null);
    setFarmerInfo(null);
    setFarmerProducts(null);
    setError(null);
  }, []);

  const createFarmerAccount = useCallback(async (userId: string) => {
    if (!wallet) {
      return { success: false, error: 'No wallet connected' };
    }

    setIsCreatingFarmer(true);
    setError(null);

    try {
      const result = await walletManager.createFarmerAccount(userId);
      
      if (result.success) {
        setIsFarmer(true);
        await getFarmerInfo();
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create farmer account';
      setError(error);
      return { success: false, error };
    } finally {
      setIsCreatingFarmer(false);
    }
  }, [wallet]);

  const checkFarmerStatus = useCallback(async () => {
    if (!wallet) return;

    try {
      const result = await walletManager.isFarmer();
      setIsFarmer(result.isFarmer);
    } catch (err) {
      console.error('Error checking farmer status:', err);
    }
  }, [wallet]);

  const getFarmerInfo = useCallback(async () => {
    if (!wallet) return;

    try {
      const result = await walletManager.getFarmerInfo();
      if (result.success) {
        setFarmerInfo(result.data);
      }
    } catch (err) {
      console.error('Error getting farmer info:', err);
    }
  }, [wallet]);

  const getFarmerProducts = useCallback(async () => {
    if (!wallet) return;

    try {
      const result = await walletManager.getFarmerProducts();
      if (result.success) {
        setFarmerProducts(result.data || []);
      }
    } catch (err) {
      console.error('Error getting farmer products:', err);
    }
  }, [wallet]);

  const buyProduct = useCallback(async (productId: string, amount: number, value: string, userId: string): Promise<PaymentResponse> => {
    if (!wallet) {
      return { success: false, error: 'No wallet connected', status: 'failed' };
    }

    setIsBuyingProduct(true);
    setError(null);

    try {
      const paymentRequest: PaymentRequest = {
        amount: parseFloat(value),
        currency: 'ETH',
        paymentMethod: 'agro_contract',
        orderId: `order_${Date.now()}`,
        customerInfo: {
          email: '', // You might want to get this from user context
          name: '' // You might want to get this from user context
        },
        productId,
        walletAddress: wallet.address,
        privateKey: wallet.privateKey,
        userId
      };

      const result = await processAgroContractPayment(paymentRequest);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to buy product';
      setError(error);
      return { success: false, error, status: 'failed' };
    } finally {
      setIsBuyingProduct(false);
    }
  }, [wallet]);

  const addProduct = useCallback(async (price: string, amount: number, userId: string) => {
    if (!wallet) {
      return { success: false, error: 'No wallet connected' };
    }

    setIsAddingProduct(true);
    setError(null);

    try {
      const response = await fetch('/api/agro/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: price,
          amount: amount,
          walletAddress: wallet.address,
          privateKey: wallet.privateKey,
          userId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        await getFarmerProducts(); // Refresh farmer products
      }
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to add product';
      setError(error);
      return { success: false, error };
    } finally {
      setIsAddingProduct(false);
    }
  }, [wallet, getFarmerProducts]);

  const updateStock = useCallback(async (productId: string, stock: number, userId: string) => {
    if (!wallet) {
      return { success: false, error: 'No wallet connected' };
    }

    setIsUpdatingStock(true);
    setError(null);

    try {
      const response = await fetch(`/api/agro/products/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stock: stock,
          walletAddress: wallet.address,
          privateKey: wallet.privateKey,
          userId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        await getFarmerProducts(); // Refresh farmer products
      }
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update stock';
      setError(error);
      return { success: false, error };
    } finally {
      setIsUpdatingStock(false);
    }
  }, [wallet, getFarmerProducts]);

  const increasePrice = useCallback(async (productId: string, price: string, userId: string) => {
    if (!wallet) {
      return { success: false, error: 'No wallet connected' };
    }

    setIsIncreasingPrice(true);
    setError(null);

    try {
      const response = await fetch(`/api/agro/products/${productId}/price`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: price,
          walletAddress: wallet.address,
          privateKey: wallet.privateKey,
          userId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        await getFarmerProducts(); // Refresh farmer products
      }
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to increase price';
      setError(error);
      return { success: false, error };
    } finally {
      setIsIncreasingPrice(false);
    }
  }, [wallet, getFarmerProducts]);

  const withdrawBalance = useCallback(async (userId: string) => {
    if (!wallet) {
      return { success: false, error: 'No wallet connected' };
    }

    setIsWithdrawing(true);
    setError(null);

    try {
      const response = await fetch('/api/agro/purchase/withdraw', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: wallet.address,
          privateKey: wallet.privateKey,
          userId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        await getFarmerInfo(); // Refresh farmer info
      }
      
      return data;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to withdraw balance';
      setError(error);
      return { success: false, error };
    } finally {
      setIsWithdrawing(false);
    }
  }, [wallet, getFarmerInfo]);

  return {
    // Wallet state
    wallet,
    isConnected,
    isConnecting,
    error,

    // Wallet actions
    connectWallet,
    connectWithPrivateKey,
    disconnectWallet,

    // Farmer actions
    isFarmer,
    farmerInfo,
    farmerProducts,
    createFarmerAccount,
    checkFarmerStatus,
    getFarmerInfo,
    getFarmerProducts,

    // Product actions
    buyProduct,
    addProduct,
    updateStock,
    increasePrice,
    withdrawBalance,

    // Loading states
    isCreatingFarmer,
    isBuyingProduct,
    isAddingProduct,
    isUpdatingStock,
    isIncreasingPrice,
    isWithdrawing
  };
};