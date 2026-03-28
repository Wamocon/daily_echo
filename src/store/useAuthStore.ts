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

    // Subscribe to auth state changes (handles session restore + sign-in/out)
    supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      if (!user) {
        set({ currentUser: null, isAuthInitialized: true });
        return;
      }
      // Load role from profiles table (editable via Supabase Table Editor)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      const mapped: AuthUser = {
        id: user.id,
        name: user.user_metadata?.display_name ?? user.email?.split('@')[0] ?? 'Nutzer',
        role: (profile?.role as AuthUser['role']) ?? 'user',
        created_at: user.created_at,
      };
      set({ currentUser: mapped, isAuthInitialized: true });
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
