'use client';

import { useCartSync } from '@/hooks/useCartSync';

export default function CartSync() {
  // Initialize cart synchronization
  useCartSync({
    syncInterval: 30000, // Sync every 30 seconds
    syncOnAuth: true,    // Sync when user logs in/out
    syncOnVisibility: true, // Sync when user returns to tab
  });

  // This component doesn't render anything, it just handles cart synchronization
  return null;
}




