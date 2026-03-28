'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { scheduleNotifications } from '@/lib/notifications';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const init = useAppStore((s) => s.init);
  const initWithUser = useAppStore((s) => s.initWithUser);
  const initAuth = useAuthStore((s) => s.initAuth);
  const currentUser = useAuthStore((s) => s.currentUser);
  const isAuthInitialized = useAuthStore((s) => s.isAuthInitialized);

  useEffect(() => {
    initAuth();
    init();
    scheduleNotifications();
  }, [init, initAuth]);

  // Once auth resolves with a real user, sync data from Supabase
  useEffect(() => {
    if (isAuthInitialized && currentUser) {
      initWithUser(currentUser.id);
    }
  }, [isAuthInitialized, currentUser, initWithUser]);

  return <>{children}</>;
}
