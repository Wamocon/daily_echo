'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const init = useAppStore((s) => s.init);
  useEffect(() => {
    init();
  }, [init]);
  return <>{children}</>;
}
