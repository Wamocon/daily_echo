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

    const applyUser = (user: import('@supabase/supabase-js').User | null) => {
      if (!user) {
        set({ currentUser: null, isAuthInitialized: true });
        return;
      }
      // Initialize immediately with default role — no DB round-trip blocking the UI
      set({
        currentUser: {
          id: user.id,
          name: user.user_metadata?.display_name ?? user.email?.split('@')[0] ?? 'Nutzer',
          role: 'user',
          created_at: user.created_at,
        },
        isAuthInitialized: true,
      });
      // Load role from profiles table in background
      supabase.from('profiles').select('role').eq('id', user.id).single()
        .then(({ data: profile }) => {
          if (profile?.role) {
            set((state) => ({
              currentUser: state.currentUser
                ? { ...state.currentUser, role: profile.role as AuthUser['role'] }
                : null,
            }));
          }
        });
    };

    // Resolve existing session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      applyUser(session?.user ?? null);
    });

    // React to future sign-in / sign-out events
    supabase.auth.onAuthStateChange((_event, session) => {
      applyUser(session?.user ?? null);
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
