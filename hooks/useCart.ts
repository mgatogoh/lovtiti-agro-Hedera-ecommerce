'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { logCartActivity } from '@/utils/userActivityLogger';
import { Contract, ethers } from 'ethers';

export interface CartItem {
  id: string;
  productId: string;
  listingId: string;
  sellerId: string;
  sellerType: 'FARMER' | 'DISTRIBUTOR' | 'AGROEXPERT';
  name: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  unit: string;
  images: string[];
  category: string;
  location: string;
  harvestDate?: Date;
  expiryDate?: Date;
  certifications: string[];
  addedAt: Date;
  updatedAt: Date;
  maxQuantity?: number;
  availableQuantity?: number;
  isAvailable?: boolean;
  priceHistory?: { date: Date; price: number }[];
  discountApplied?: { type: string; amount: number; description: string };
}

export interface LikedItem {
  id: string;
  productId: string;
  listingId: string;
  likedAt: Date;
  category?: string;
  price?: number;
  sellerType?: string;
}

interface CartState {
  items: CartItem[];
  likedItems: LikedItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  lastUpdated: Date;
  sessionId: string;
  cartVersion: number;
  abandonedCartTime?: Date;
  estimatedDelivery?: Date;
  shippingCost?: number;
  taxAmount?: number;
  discounts?: { type: string; amount: number; description: string }[];
  isProcessingHedera: boolean;
  hederaError: string | null;
  hederaTxId: string | null;
}

const CART_STORAGE_KEY = 'lovtiti-agro-cart-v2';
const LIKED_STORAGE_KEY = 'lovtiti-agro-liked-v2';
const CART_SESSION_KEY = 'lovtiti-agro-cart-session';

export function useCart() {
  const isInitialized = useRef(false);
  const [cartState, setCartState] = useState<CartState>({
    items: [],
    likedItems: [],
    totalItems: 0,
    totalPrice: 0,
    isLoading: true,
    lastUpdated: new Date(),
    sessionId: '',
    cartVersion: 1,
    shippingCost: 0,
    taxAmount: 0,
    discounts: [],
    isProcessingHedera: false,
    hederaError: null,
    hederaTxId: null,
  });

  // -----------------------------
  // Helper functions
  // -----------------------------
  const clearCart = useCallback(() => {
    console.log('🧹 Clearing cart');
    setCartState(prev => ({
      ...prev,
      items: [],
      totalItems: 0,
      totalPrice: 0,
      lastUpdated: new Date(),
    }));
  }, []);

  const getContract = useCallback(async () => {
    if (typeof window === 'undefined') return null;
    if (!(window as any).ethereum) throw new Error('MetaMask not found');

    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();

    const contractAddress = process.env.NEXT_PUBLIC_AGRO_CONTRACT_ADDRESS || '';
    const agroABI = [
      "function buyproduct(uint256 pid, uint256 amount) public payable",
      "event productBought(uint256 indexed productId, address buyer, address farmer, uint256 amount, uint256 txid)"
    ];

    return new Contract(contractAddress, agroABI, signer);

  }, []);

  // -----------------------------
  // Checkout
  // -----------------------------
  const checkoutWithHedera = useCallback(async () => {
    setCartState(prev => ({ ...prev, isProcessingHedera: true, hederaError: null }));

    try {
      const contract = await getContract();
      if (!contract) throw new Error('Contract not initialized');

      const txPromises = cartState.items.map(item =>
        contract.buyproduct(
          BigInt(item.productId),
          BigInt(item.quantity),
          { value: ethers.parseEther((item.price * item.quantity).toString()) }
        ).then((tx: any) => tx.wait())
      );

      const receipts = await Promise.all(txPromises);
      const txIds = receipts.map((r: any) => r.transactionHash);

      if (txIds.length === cartState.items.length) clearCart();

      setCartState(prev => ({
        ...prev,
        isProcessingHedera: false,
        hederaTxId: txIds[0]
      }));

      return { success: true, txIds, message: 'Purchase completed successfully!' };
    } catch (error) {
      console.error('Hedera Checkout Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process Hedera payment';
      setCartState(prev => ({
        ...prev,
        isProcessingHedera: false,
        hederaError: errorMessage
      }));
      return { success: false, message: errorMessage };
    }

  }, [cartState.items, clearCart, getContract]);

  // -----------------------------
  // The rest of cart actions
  // -----------------------------
  const addToCart = useCallback((item: Omit<CartItem, 'id' | 'addedAt' | 'updatedAt'>) => {
    const now = new Date();
    setCartState(prev => {
      const existingItem = prev.items.find(ci => ci.productId === item.productId && ci.listingId === item.listingId);
      let updatedItems: CartItem[];

      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + item.quantity, item.maxQuantity || 100, item.availableQuantity || 100);
        updatedItems = prev.items.map(ci => ci.id === existingItem.id ? { ...ci, quantity: newQuantity, updatedAt: now } : ci);
      } else {
        const newItem: CartItem = { ...item, id: `cart-${Date.now()}`, addedAt: now, updatedAt: now, priceHistory: [{ date: now, price: item.price }], isAvailable: item.isAvailable ?? true };
        updatedItems = [...prev.items, newItem];
      }

      const totalItems = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

      return { ...prev, items: updatedItems, totalItems, totalPrice, lastUpdated: now, cartVersion: prev.cartVersion + 1 };
    });

  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartState(prev => {
      const updatedItems = prev.items.filter(item => item.id !== itemId);
      const totalItems = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return { ...prev, items: updatedItems, totalItems, totalPrice, lastUpdated: new Date() };
    });
  }, []);

  const toggleLike = useCallback((productId: string, listingId: string, additionalData?: { category?: string; price?: number; sellerType?: string }) => {
    console.log('❤️ Toggling like:', productId);

    setCartState(prev => {
      const existingLike = prev.likedItems.find(like =>
        like.productId === productId && like.listingId === listingId
      );

      if (existingLike) {
        console.log('💔 Removing like');
        return {
          ...prev,
          likedItems: prev.likedItems.filter(like => like.id !== existingLike.id),
          lastUpdated: new Date(),
        };
      } else {
        console.log('💚 Adding like');
        const newLike: LikedItem = {
          id: `like-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          productId,
          listingId,
          likedAt: new Date(),
          category: additionalData?.category,
          price: additionalData?.price,
          sellerType: additionalData?.sellerType,
        };

        return {
          ...prev,
          likedItems: [...prev.likedItems, newLike],
          lastUpdated: new Date(),
        };
      }
    });
  }, []);


  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(itemId);
    setCartState(prev => {
      const updatedItems = prev.items.map(i => i.id === itemId ? { ...i, quantity, updatedAt: new Date() } : i);
      const totalItems = updatedItems.reduce((sum, i) => sum + i.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return { ...prev, items: updatedItems, totalItems, totalPrice, lastUpdated: new Date() };
    });
  }, [removeFromCart]);
  const isInCart = useCallback((productId: string, listingId: string) => {
    return cartState.items.some(item =>
      item.productId === productId && item.listingId === listingId
    );
  }, [cartState.items]);
  const getCartRecommendations = useCallback(() => {
    const likedCategories = cartState.likedItems.reduce((acc, item) => {
      if (item.category) {
        acc[item.category] = (acc[item.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const cartCategories = cartState.items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { likedCategories, cartCategories };
  }, [cartState.likedItems, cartState.items]);

  const getAbandonedCartTime = useCallback(() => {
    if (cartState.items.length === 0) return null;

    const lastActivity = cartState.lastUpdated;
    const now = new Date();
    const diffMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60);

    if (diffMinutes > 30) {
      return diffMinutes;
    }
    return null;
  }, [cartState.items.length, cartState.lastUpdated]);

  // Check if item is liked
  const isLiked = useCallback((productId: string, listingId: string) => {
    return cartState.likedItems.some(like =>
      like.productId === productId && like.listingId === listingId
    );
  }, [cartState.likedItems]);

  // Get cart item by product and listing ID
  const getCartItem = useCallback((productId: string, listingId: string) => {
    return cartState.items.find(item =>
      item.productId === productId && item.listingId === listingId
    );
  }, [cartState.items]);

  const getCartSummary = useCallback(() => {
    const subtotal = cartState.totalPrice;
    const shipping = cartState.shippingCost || 0;
    const tax = cartState.taxAmount || 0;
    const discountTotal = (cartState.discounts || []).reduce((sum, d) => sum + d.amount, 0);
    const total = subtotal + shipping + tax - discountTotal;

    return {
      subtotal,
      shipping,
      tax,
      discountTotal,
      total,
      itemCount: cartState.totalItems,
      discountCount: (cartState.discounts || []).length,
    };
  }, [cartState]);


  // -----------------------------
  // Return state and actions
  // -----------------------------
  return {
    items: cartState.items,
    likedItems: cartState.likedItems,
    totalItems: cartState.totalItems,
    totalPrice: cartState.totalPrice,
    isLoading: cartState.isLoading,
    lastUpdated: cartState.lastUpdated,
    sessionId: cartState.sessionId,
    cartVersion: cartState.cartVersion,

    cartState,
    addToCart,
    toggleLike,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartRecommendations,
    getAbandonedCartTime,
    getCartSummary,
    checkoutWithHedera,
    isLiked,
    getCartItem,

  };
}
