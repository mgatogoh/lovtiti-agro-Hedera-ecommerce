'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { logCartActivity } from '@/utils/userActivityLogger';

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
  // Big tech cart features
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
  // Additional metadata for recommendations
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
  // Big tech cart features
  sessionId: string;
  cartVersion: number;
  abandonedCartTime?: Date;
  estimatedDelivery?: Date;
  shippingCost?: number;
  taxAmount?: number;
  discounts?: { type: string; amount: number; description: string }[];
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
  });

  // Generate or retrieve session ID
  const getSessionId = useCallback(() => {
    if (typeof window === 'undefined') return '';

    let sessionId = sessionStorage.getItem(CART_SESSION_KEY);
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(CART_SESSION_KEY, sessionId);
    }
    return sessionId;
  }, []);

  // Enhanced date parsing for localStorage
  const parseStoredDate = (dateStr: any): Date => {
    if (!dateStr) return new Date();
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  // Load cart from localStorage on mount - ONLY ONCE
  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized.current) {
      return;
    }

    console.log('🔄 Loading cart from localStorage...');

    try {
      const sessionId = getSessionId();
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const savedLiked = localStorage.getItem(LIKED_STORAGE_KEY);

      console.log('📦 Saved cart data:', savedCart ? 'Found' : 'Not found');
      console.log('❤️ Saved liked data:', savedLiked ? 'Found' : 'Not found');

      let items: CartItem[] = [];
      let likedItems: LikedItem[] = [];

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        items = (parsedCart.items || []).map((item: any) => ({
          ...item,
          addedAt: parseStoredDate(item.addedAt),
          updatedAt: parseStoredDate(item.updatedAt),
          harvestDate: item.harvestDate ? parseStoredDate(item.harvestDate) : undefined,
          expiryDate: item.expiryDate ? parseStoredDate(item.expiryDate) : undefined,
          priceHistory: (item.priceHistory || []).map((ph: any) => ({
            date: parseStoredDate(ph.date),
            price: ph.price
          })),
        }));
        console.log('✅ Loaded', items.length, 'cart items');
      }

      if (savedLiked) {
        const parsedLiked = JSON.parse(savedLiked);
        likedItems = (parsedLiked || []).map((item: any) => ({
          ...item,
          likedAt: parseStoredDate(item.likedAt),
        }));
        console.log('✅ Loaded', likedItems.length, 'liked items');
      }

      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      setCartState({
        items,
        likedItems,
        totalItems,
        totalPrice,
        isLoading: false,
        lastUpdated: new Date(),
        sessionId,
        cartVersion: 1,
        shippingCost: 0,
        taxAmount: 0,
        discounts: [],
      });

      isInitialized.current = true;
      console.log('✅ Cart initialization complete');
    } catch (error) {
      console.error('❌ Error loading cart from localStorage:', error);
      setCartState(prev => ({
        ...prev,
        isLoading: false,
        sessionId: getSessionId(),
      }));
      isInitialized.current = true;
    }
  }, [getSessionId]);

  // Save cart to localStorage whenever it changes (with debouncing)
  useEffect(() => {
    if (!isInitialized.current || cartState.isLoading || typeof window === 'undefined') {
      return;
    }

    const timeoutId = setTimeout(() => {
      try {
        const cartData = {
          items: cartState.items,
          totalItems: cartState.totalItems,
          totalPrice: cartState.totalPrice,
          lastUpdated: cartState.lastUpdated,
          sessionId: cartState.sessionId,
          cartVersion: cartState.cartVersion,
          shippingCost: cartState.shippingCost,
          taxAmount: cartState.taxAmount,
          discounts: cartState.discounts,
        };
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
        console.log('💾 Cart saved to localStorage:', cartState.items.length, 'items');
      } catch (error) {
        console.error('❌ Error saving cart to localStorage:', error);
        // Try to clear and retry if storage is full
        try {
          localStorage.removeItem(CART_STORAGE_KEY);
          const cartData = {
            items: cartState.items,
            totalItems: cartState.totalItems,
            totalPrice: cartState.totalPrice,
          };
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
        } catch (retryError) {
          console.error('❌ Failed to save cart after retry:', retryError);
        }
      }
    }, 300); // Debounce by 300ms

    return () => clearTimeout(timeoutId);
  }, [cartState.items, cartState.totalItems, cartState.totalPrice, cartState.isLoading]);

  // Save liked items to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized.current || cartState.isLoading || typeof window === 'undefined') {
      return;
    }

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(cartState.likedItems));
        console.log('💾 Liked items saved to localStorage:', cartState.likedItems.length, 'items');
      } catch (error) {
        console.error('❌ Error saving liked items to localStorage:', error);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [cartState.likedItems, cartState.isLoading]);

  // Add item to cart with enhanced big tech features
  const addToCart = useCallback((item: Omit<CartItem, 'id' | 'addedAt' | 'updatedAt'>) => {
    console.log('🛒 Adding to cart:', item.name);

    // Log cart activity
    const mockUserId = 'user-' + Date.now();
    const mockUserRole = 'BUYER';
    const mockUserEmail = 'user@example.com';

    logCartActivity(mockUserId, mockUserRole, mockUserEmail, 'CART_ADD', {
      productId: item.productId,
      listingId: item.listingId,
      sellerId: item.sellerId,
      sellerType: item.sellerType,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
      currency: item.currency,
      category: item.category,
      timestamp: new Date().toISOString()
    });

    setCartState(prev => {
      const existingItem = prev.items.find(cartItem =>
        cartItem.productId === item.productId && cartItem.listingId === item.listingId
      );

      const now = new Date();
      let updatedItems: CartItem[];

      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = Math.min(
          existingItem.quantity + item.quantity,
          item.maxQuantity || 100,
          item.availableQuantity || 100
        );

        updatedItems = prev.items.map(cartItem =>
          cartItem.id === existingItem.id
            ? {
              ...cartItem,
              quantity: newQuantity,
              updatedAt: now,
              priceHistory: [
                ...(cartItem.priceHistory || []),
                { date: now, price: item.price }
              ].slice(-5),
              isAvailable: item.isAvailable !== false,
            }
            : cartItem
        );
        console.log('✅ Updated existing item, new quantity:', newQuantity);
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          ...item,
          id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          addedAt: now,
          updatedAt: now,
          isAvailable: item.isAvailable !== false,
          priceHistory: [{ date: now, price: item.price }],
          maxQuantity: item.maxQuantity || 100,
          availableQuantity: item.availableQuantity || 100,
        };

        updatedItems = [...prev.items, newItem];
        console.log('✅ Added new item to cart');
      }

      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const baseTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discountAmount = updatedItems.reduce((sum, item) => {
        return sum + (item.discountApplied?.amount || 0);
      }, 0);
      const totalPrice = baseTotal - discountAmount;

      console.log('📊 Cart totals - Items:', totalItems, 'Price:', totalPrice);

      return {
        ...prev,
        items: updatedItems,
        totalItems,
        totalPrice,
        lastUpdated: now,
        cartVersion: prev.cartVersion + 1,
        abandonedCartTime: undefined,
      };
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((itemId: string) => {
    console.log('🗑️ Removing from cart:', itemId);

    setCartState(prev => {
      const removedItem = prev.items.find(item => item.id === itemId);

      if (removedItem) {
        const mockUserId = 'user-' + Date.now();
        const mockUserRole = 'BUYER';
        const mockUserEmail = 'user@example.com';

        logCartActivity(mockUserId, mockUserRole, mockUserEmail, 'CART_REMOVE', {
          productId: removedItem.productId,
          listingId: removedItem.listingId,
          sellerId: removedItem.sellerId,
          sellerType: removedItem.sellerType,
          productName: removedItem.name,
          quantity: removedItem.quantity,
          price: removedItem.price,
          currency: removedItem.currency,
          category: removedItem.category,
          timestamp: new Date().toISOString()
        });
      }

      const updatedItems = prev.items.filter(item => item.id !== itemId);
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...prev,
        items: updatedItems,
        totalItems,
        totalPrice,
        lastUpdated: new Date(),
      };
    });
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    console.log('🔢 Updating quantity:', itemId, quantity);

    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartState(prev => {
      const updatedItems = prev.items.map(item =>
        item.id === itemId
          ? { ...item, quantity, updatedAt: new Date() }
          : item
      );

      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...prev,
        items: updatedItems,
        totalItems,
        totalPrice,
        lastUpdated: new Date(),
      };
    });
  }, [removeFromCart]);

  // Clear entire cart
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

  // Toggle like status with enhanced metadata
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

  // Check if item is in cart
  const isInCart = useCallback((productId: string, listingId: string) => {
    return cartState.items.some(item =>
      item.productId === productId && item.listingId === listingId
    );
  }, [cartState.items]);

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

  // Big tech cart features
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

  const applyDiscount = useCallback((discount: { type: string; amount: number; description: string }) => {
    console.log('🏷️ Applying discount:', discount.description);
    setCartState(prev => ({
      ...prev,
      discounts: [...(prev.discounts || []), discount],
      lastUpdated: new Date(),
    }));
  }, []);

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

  return {
    // State
    items: cartState.items,
    likedItems: cartState.likedItems,
    totalItems: cartState.totalItems,
    totalPrice: cartState.totalPrice,
    isLoading: cartState.isLoading,
    lastUpdated: cartState.lastUpdated,
    sessionId: cartState.sessionId,
    cartVersion: cartState.cartVersion,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleLike,
    applyDiscount,

    // Helpers
    isInCart,
    isLiked,
    getCartItem,
    getCartRecommendations,
    getAbandonedCartTime,
    getCartSummary,

    // Enhanced state
    shippingCost: cartState.shippingCost,
    taxAmount: cartState.taxAmount,
    discounts: cartState.discounts,
  };
}
