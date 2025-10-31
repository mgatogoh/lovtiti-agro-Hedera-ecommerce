'use client';

import { useUserSync } from '@/hooks/useUserSync';

export default function UserSync() {
  useUserSync();
  return null;
}