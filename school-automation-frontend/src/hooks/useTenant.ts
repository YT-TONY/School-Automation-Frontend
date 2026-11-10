// src/hooks/useTenant.ts
'use client';

import { useSyncExternalStore } from 'react';
import { resolveTenantSlug } from '@/services/apiClient';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('storage', callback);
  };
}

export function useTenant() {
  const tenantSlug = useSyncExternalStore(
    subscribe,
    resolveTenantSlug,
    () => process.env.NEXT_PUBLIC_DEFAULT_TENANT || 'default'
  );

  return { tenantSlug, isResolved: true };
}