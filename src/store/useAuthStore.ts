'use client';

import { create } from 'zustand';
import { AuthUser } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface AuthState {
  currentUser: AuthUser | null;
  isAuthInitialized: boolean;

  initAuth: () => void;
  logout: () => Promise<void>;
  // Kept for backward compatibility (admin page)
  login: (account: { id: string; name: string; role: 'admin' | 'user' | 'guest' }) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthInitialized: false,

  initAuth: () => {
    const supabase = createClient();

    // Immediately resolve current session so AuthGuard doesn't hang
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user ?? null;
      if (!user) {
        set({ currentUser: null, isAuthInitialized: true });
        return;
      }
      try {
        const { data: profile } = await supabase
          .from('profiles').select('role').eq('id', user.id).single();
        set({
          currentUser: {
            id: user.id,
            name: user.user_metadata?.display_name ?? user.email?.split('@')[0] ?? 'Nutzer',
            role: (profile?.role as AuthUser['role']) ?? 'user',
            created_at: user.created_at,
          },
          isAuthInitialized: true,
        });
      } catch {
        // profiles query failed (e.g. role column missing) — still initialize
        set({
          currentUser: {
            id: user.id,
            name: user.user_metadata?.display_name ?? user.email?.split('@')[0] ?? 'Nutzer',
            role: 'user',
            created_at: user.created_at,
          },
          isAuthInitialized: true,
        });
      }
    });

    // Subscribe to future auth changes (sign-in / sign-out)
    supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      if (!user) {
        set({ currentUser: null, isAuthInitialized: true });
        return;
      }
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).single();
      set({
        currentUser: {
          id: user.id,
          name: user.user_metadata?.display_name ?? user.email?.split('@')[0] ?? 'Nutzer',
          role: (profile?.role as AuthUser['role']) ?? 'user',
          created_at: user.created_at,
        },
        isAuthInitialized: true,
      });
    });
  },

  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ currentUser: null });
  },

  // No-op kept for admin page compatibility
  login: () => {},
}));
