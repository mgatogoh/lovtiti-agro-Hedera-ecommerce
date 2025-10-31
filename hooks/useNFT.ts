// React hooks for NFT operations
import { useState, useEffect, useCallback } from 'react';
import { useWallet } from './useWallet';
import { nftService, defaultNFTServiceConfig } from '../utils/nftService';
import {
  BaseNFT,
  NFTListing,
  NFTTransaction,
  EscrowTransaction,
  ServiceBooking,
  EquipmentLease,
  NFTMetadata,
  ProductAttributes,
  ServiceAttributes,
  EquipmentAttributes,
  MintNFTRequest,
  ListNFTRequest,
  BuyNFTRequest
} from '../types/nft';

// Hook for NFT minting operations
export function useNFTMinting() {
  const { wallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mintProductNFT = useCallback(async (
    name: string,
    description: string,
    attributes: ProductAttributes,
    royalties: { percentage: number; recipient: string; perpetual: boolean },
    imageUrl?: string
  ) => {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      // service.setWalletAccount(wallet);

      const metadata = service.createProductMetadata(name, description, attributes, imageUrl);
      const result = await service.mintProductNFT(metadata, royalties);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to mint product NFT";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  const mintServiceNFT = useCallback(async (
    name: string,
    description: string,
    attributes: ServiceAttributes,
    royalties: { percentage: number; recipient: string; perpetual: boolean },
    imageUrl?: string
  ) => {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      // service.setWalletAccount(wallet);

      const metadata = service.createServiceMetadata(name, description, attributes, imageUrl);
      const result = await service.mintServiceNFT(metadata, royalties);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to mint service NFT";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  const mintEquipmentNFT = useCallback(async (
    name: string,
    description: string,
    attributes: EquipmentAttributes,
    royalties: { percentage: number; recipient: string; perpetual: boolean },
    imageUrl?: string
  ) => {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      // service.setWalletAccount(wallet);

      const metadata = service.createEquipmentMetadata(name, description, attributes, imageUrl);
      const result = await service.mintEquipmentNFT(metadata, royalties);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to mint equipment NFT";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  return {
    mintProductNFT,
    mintServiceNFT,
    mintEquipmentNFT,
    isLoading,
    error,
  };
}

// Hook for NFT marketplace operations
export function useNFTMarketplace() {
  const { wallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listNFT = useCallback(async (request: ListNFTRequest) => {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      // service.setWalletAccount(wallet);

      const result = await service.listNFT(request);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to list NFT";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  const buyNFT = useCallback(async (request: BuyNFTRequest) => {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      // service.setWalletAccount(wallet);

      const result = await service.buyNFT(request);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to buy NFT";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  const cancelListing = useCallback(async (listingId: string) => {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      // service.setWalletAccount(wallet);

      await service.cancelListing(listingId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to cancel listing";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  return {
    listNFT,
    buyNFT,
    cancelListing,
    isLoading,
    error,
  };
}

// Hook for fetching NFT data
export function useNFT(tokenId?: string) {
  const [nft, setNFT] = useState<BaseNFT | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNFT = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      const result = await service.getNFT(id);
      setNFT(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch NFT";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tokenId) {
      fetchNFT(tokenId);
    }
  }, [tokenId, fetchNFT]);

  return {
    nft,
    isLoading,
    error,
    refetch: () => tokenId && fetchNFT(tokenId),
  };
}

// Hook for fetching NFT listings
export function useNFTListings(filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const [listings, setListings] = useState<NFTListing[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      const result = await service.getListings(filters);
      setListings(result.listings);
      setPagination(result.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch listings";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return {
    listings,
    pagination,
    isLoading,
    error,
    refetch: fetchListings,
  };
}

// Hook for user's NFTs
export function useUserNFTs(userAddress?: string) {
  const { wallet } = useWallet();
  const [nfts, setNFTs] = useState<BaseNFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserNFTs = useCallback(async () => {
    const address = userAddress || wallet?.address;
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      const result = await service.getUserNFTs(address);
      setNFTs(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch user NFTs";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userAddress, wallet]);

  useEffect(() => {
    fetchUserNFTs();
  }, [fetchUserNFTs]);

  return {
    nfts,
    isLoading,
    error,
    refetch: fetchUserNFTs,
  };
}

// Hook for supply chain operations
export function useSupplyChain(tokenId?: string) {
  const { wallet } = useWallet();
  const [supplyChain, setSupplyChain] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSupplyChain = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      const result = await service.getSupplyChainHistory(id);
      setSupplyChain(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch supply chain";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addSupplyChainStep = useCallback(async (
    id: string,
    action: string,
    location: string,
    metadata?: Record<string, any>
  ) => {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      // service.setWalletAccount(wallet);

      await service.addSupplyChainStep(id, action, location, metadata);
      await fetchSupplyChain(id); // Refresh data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add supply chain step";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [wallet, fetchSupplyChain]);

  const verifySupplyChainStep = useCallback(async (
    id: string,
    stepIndex: number,
    verified: boolean,
    notes?: string
  ) => {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      // service.setWalletAccount(wallet);

      await service.verifySupplyChainStep(id, stepIndex, verified, notes);
      await fetchSupplyChain(id); // Refresh data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to verify supply chain step";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [wallet, fetchSupplyChain]);

  useEffect(() => {
    if (tokenId) {
      fetchSupplyChain(tokenId);
    }
  }, [tokenId, fetchSupplyChain]);

  return {
    supplyChain,
    isLoading,
    error,
    addSupplyChainStep,
    verifySupplyChainStep,
    refetch: () => tokenId && fetchSupplyChain(tokenId),
  };
}

// Hook for service bookings
export function useServiceBooking(serviceTokenId?: string) {
  const { wallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookService = useCallback(async (
    tokenId: string,
    startTime: Date,
    endTime: Date,
    location?: string,
    requirements?: string
  ) => {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      // service.setWalletAccount(wallet);

      const result = await service.bookService(tokenId, startTime, endTime, location, requirements);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to book service";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  const completeService = useCallback(async (
    tokenId: string,
    bookingId: string,
    completionNotes: string,
    evidence?: string[]
  ) => {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      // service.setWalletAccount(wallet);

      await service.completeService(tokenId, bookingId, completionNotes, evidence);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to complete service";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  return {
    bookService,
    completeService,
    isLoading,
    error,
  };
}

// Hook for equipment leasing
export function useEquipmentLeasing() {
  const { wallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const leaseEquipment = useCallback(async (
    equipmentTokenId: string,
    startDate: Date,
    endDate: Date,
    deliveryAddress: string,
    pickupAddress: string,
    insurance: boolean = true,
    training: boolean = false
  ) => {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      // service.setWalletAccount(wallet);

      const result = await service.leaseEquipment(
        equipmentTokenId,
        startDate,
        endDate,
        deliveryAddress,
        pickupAddress,
        insurance,
        training
      );
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to lease equipment";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  return {
    leaseEquipment,
    isLoading,
    error,
  };
}

// Hook for escrow operations
export function useEscrow(transactionId?: string) {
  const { wallet } = useWallet();
  const [escrow, setEscrow] = useState<EscrowTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEscrow = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      const result = await service.getEscrowStatus(id);
      setEscrow(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch escrow";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateDeliveryStatus = useCallback(async (
    id: string,
    status: string,
    trackiHBARumber?: string,
    carrier?: string
  ) => {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      // service.setWalletAccount(wallet);

      await service.updateDeliveryStatus(id, status, trackiHBARumber, carrier);
      await fetchEscrow(id); // Refresh data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update delivery status";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [wallet, fetchEscrow]);

  const confirmDelivery = useCallback(async (id: string) => {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      // service.setWalletAccount(wallet);

      await service.confirmDelivery(id);
      await fetchEscrow(id); // Refresh data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to confirm delivery";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [wallet, fetchEscrow]);

  const releaseEscrow = useCallback(async (
    id: string,
    rating?: number,
    feedback?: string
  ) => {
    if (!wallet) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      // service.setWalletAccount(wallet);

      await service.releaseEscrow(id, rating, feedback);
      await fetchEscrow(id); // Refresh data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to release escrow";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [wallet, fetchEscrow]);

  useEffect(() => {
    if (transactionId) {
      fetchEscrow(transactionId);
    }
  }, [transactionId, fetchEscrow]);

  return {
    escrow,
    isLoading,
    error,
    updateDeliveryStatus,
    confirmDelivery,
    releaseEscrow,
    refetch: () => transactionId && fetchEscrow(transactionId),
  };
}

// Hook for marketplace analytics
export function useMarketplaceAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      const result = await service.getMarketplaceAnalytics();
      setAnalytics(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch analytics";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    refetch: fetchAnalytics,
  };
}

// Hook for user portfolio analytics
export function useUserPortfolio(userAddress?: string) {
  const { wallet } = useWallet();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = useCallback(async () => {
    const address = userAddress || wallet?.address;
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      const service = nftService;
      const result = await service.getUserPortfolio(address);
      setPortfolio(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch portfolio";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userAddress, wallet]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return {
    portfolio,
    isLoading,
    error,
    refetch: fetchPortfolio,
  };
}
