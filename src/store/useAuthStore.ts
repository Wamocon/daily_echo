'use client';

import { create } from 'zustand';
import { AuthUser } from '@/types';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

function mapSupabaseUser(user: User): AuthUser {
  return {
    id: user.id,
    name: user.user_metadata?.display_name ?? user.email?.split('@')[0] ?? 'Nutzer',
    role: user.user_metadata?.role ?? 'user',
    created_at: user.created_at,
  };
}

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

    // Subscribe to auth state changes (handles session restore + sign-in/out)
    supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      set({
        currentUser: user ? mapSupabaseUser(user) : null,
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
