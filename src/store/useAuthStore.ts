'use client';

import { create } from 'zustand';
import { AuthUser } from '@/types';
import { getCurrentUser, loginUser, logoutUser, DemoAccount } from '@/lib/auth';

interface AuthState {
  currentUser: AuthUser | null;
  isAuthInitialized: boolean;

  initAuth: () => void;
  login: (account: DemoAccount) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthInitialized: false,

  initAuth: () => {
    const user = getCurrentUser();
    set({ currentUser: user, isAuthInitialized: true });
  },

  login: (account) => {
    const user = loginUser(account);
    set({ currentUser: user });
  },

  logout: () => {
    logoutUser();
    set({ currentUser: null });
  },
}));
