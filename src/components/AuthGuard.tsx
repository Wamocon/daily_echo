'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { canAccess } from '@/lib/auth';

const ROUTE_PERMISSIONS: Record<string, string> = {
  '/checkin': 'check-in',
  '/achievements': 'achievements',
  '/history': 'history',
  '/calendar': 'history',
  '/quickwins': 'check-in',
  '/notifications': 'check-in',
  '/admin': 'admin-panel',
};

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { currentUser, isAuthInitialized, initAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthInitialized) {
      initAuth();
    }
  }, [isAuthInitialized, initAuth]);

  useEffect(() => {
    if (!isAuthInitialized) return;

    if (!currentUser) {
      router.replace('/login');
      return;
    }

    // Check feature-level permissions
    const requiredPermission = ROUTE_PERMISSIONS[pathname];
    if (requiredPermission && !canAccess(currentUser.role, requiredPermission)) {
      router.replace('/');
    }
  }, [isAuthInitialized, currentUser, pathname, router]);

  if (!isAuthInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse text-sm">Laden...</p>
      </div>
    );
  }

  if (!currentUser) return null;

  return <>{children}</>;
}
