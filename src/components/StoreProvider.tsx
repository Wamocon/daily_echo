'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { scheduleNotifications } from '@/lib/notifications';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const init = useAppStore((s) => s.init);
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
    init();
    scheduleNotifications();
  }, [init, initAuth]);

  return <>{children}</>;
}
