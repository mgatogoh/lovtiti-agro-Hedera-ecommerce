'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useCart } from './useCart';

interface CartSyncOptions {
  syncInterval?: number; // Sync interval in milliseconds (default: 30000 = 30 seconds)
  syncOnAuth?: boolean; // Sync when user authentication state changes
  syncOnVisibility?: boolean; // Sync when page becomes visible
}

export function useCartSync(options: CartSyncOptions = {}) {
  const {
    syncInterval = 30000,
    syncOnAuth = true,
    syncOnVisibility = true,
  } = options;

  const { user, isSignedIn } = useUser();
  const cart = useCart();
  const syncTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSyncRef = useRef<Date>();

  const syncToServer = useCallback(async () => {
    if (!isSignedIn || !user || cart.isLoading) {
      return;
    }

    try {
      const cartData = {
        items: cart.items,
        sessionId: cart.sessionId,
        cartVersion: cart.cartVersion,
        lastUpdated: cart.lastUpdated.toISOString(),
      };

      const response = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartData),
      });

      if (response.ok) {
        const result = await response.json();
        lastSyncRef.current = new Date();
        console.log('Cart synced to server:', result);
      } else {
        console.error('Failed to sync cart to server:', response.statusText);
      }
    } catch (error) {
      console.error('Error syncing cart to server:', error);
    }
  }, [isSignedIn, user, cart]);

  const syncFromServer = useCallback(async () => {
    if (!isSignedIn || !user) {
      return;
    }

    try {
      const response = await fetch('/api/cart/sync');
      
      if (response.ok) {
        const serverCart = await response.json();
        // In a full implementation, you would merge server cart with local cart
        // For now, we'll just log the server cart data
        console.log('Retrieved cart from server:', serverCart);
      } else {
        console.error('Failed to retrieve cart from server:', response.statusText);
      }
    } catch (error) {
      console.error('Error retrieving cart from server:', error);
    }
  }, [isSignedIn, user]);

  // Sync to server periodically
  useEffect(() => {
    if (isSignedIn && cart.items.length > 0) {
      const scheduleSync = () => {
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }

        syncTimeoutRef.current = setTimeout(() => {
          syncToServer();
          scheduleSync(); // Schedule next sync
        }, syncInterval);
      };

      scheduleSync();

      return () => {
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }
      };
    }
  }, [isSignedIn, cart.items.length, syncInterval, syncToServer]);

  // Sync when authentication state changes
  useEffect(() => {
    if (syncOnAuth && isSignedIn && user) {
      // Sync from server when user logs in
      syncFromServer();
    }
  }, [isSignedIn, user, syncOnAuth, syncFromServer]);

  // Sync when page becomes visible (user returns to tab)
  useEffect(() => {
    if (!syncOnVisibility) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isSignedIn) {
        const now = new Date();
        const lastSync = lastSyncRef.current;
        
        // Only sync if it's been more than 5 minutes since last sync
        if (!lastSync || (now.getTime() - lastSync.getTime()) > 5 * 60 * 1000) {
          syncFromServer();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [syncOnVisibility, isSignedIn, syncFromServer]);

  // Sync before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isSignedIn && cart.items.length > 0) {
        // Use sendBeacon for reliable data sending before page unload
        const cartData = {
          items: cart.items,
          sessionId: cart.sessionId,
          cartVersion: cart.cartVersion,
          lastUpdated: cart.lastUpdated.toISOString(),
        };

        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            '/api/cart/sync',
            JSON.stringify(cartData)
          );
        } else {
          // Fallback for browsers that don't support sendBeacon
          fetch('/api/cart/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cartData),
            keepalive: true,
          }).catch(console.error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isSignedIn, cart.items, cart.sessionId, cart.cartVersion, cart.lastUpdated]);

  return {
    syncToServer,
    syncFromServer,
    lastSync: lastSyncRef.current,
  };
}




