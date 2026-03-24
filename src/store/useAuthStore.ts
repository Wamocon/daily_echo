'use client';

import { create } from 'zustand';
import { AuthUser } from '@/types';
import { getCurrentUser, loginUser, loginByEmail, logoutUser, DemoAccount } from '@/lib/auth';

interface AuthState {
  currentUser: AuthUser | null;
  isAuthInitialized: boolean;

  initAuth: () => void;
  login: (account: DemoAccount) => void;
  loginWithEmail: (email: string) => AuthUser | null;
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

  loginWithEmail: (email) => {
    const user = loginByEmail(email);
    if (user) set({ currentUser: user });
    return user;
  },

  logout: () => {
    logoutUser();
    set({ currentUser: null });
  },
}));
