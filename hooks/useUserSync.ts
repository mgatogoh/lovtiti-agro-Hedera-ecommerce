'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export function useUserSync() {
  const { user, isLoaded } = useUser();
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user || isSynced) return;

      try {
        await fetch('/api/auth/sync-user', { method: 'POST' });
        setIsSynced(true);
      } catch (error) {
        console.error('User sync failed:', error);
      }
    };

    if (isLoaded && user) {
      setTimeout(syncUser, 1000);
    }
  }, [user, isLoaded, isSynced]);

  return { isSynced, user };
}