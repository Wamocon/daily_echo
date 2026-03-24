import { AuthUser, UserRole } from '@/types';

const AUTH_KEY = 'dailyecho_auth';

export interface DemoAccount {
  id: string;
  name: string;
  role: UserRole;
  pin?: string;
  emoji: string;
  tagline: string;
  permissions: string[];
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: 'admin-1',
    name: 'Admin',
    role: 'admin',
    pin: '1234',
    emoji: '👑',
    tagline: 'Vollzugriff & Verwaltung',
    permissions: ['check-in', 'history', 'achievements', 'admin-panel'],
  },
  {
    id: 'user-1',
    name: 'Alex',
    role: 'user',
    pin: '1234',
    emoji: '🙋',
    tagline: 'Persönliches Tagebuch & Check-ins',
    permissions: ['check-in', 'history', 'achievements'],
  },
  {
    id: 'guest-1',
    name: 'Gast',
    role: 'guest',
    pin: undefined,
    emoji: '👀',
    tagline: 'Dashboard ansehen ohne Konto',
    permissions: [],
  },
];

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  user: 'Nutzer',
  guest: 'Gast',
};

export const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  user: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  guest: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function loginUser(account: DemoAccount): AuthUser {
  const user: AuthUser = {
    id: account.id,
    name: account.name,
    role: account.role,
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export function registerUser(name: string): AuthUser {
  const user: AuthUser = {
    id: `user-${Date.now()}`,
    name,
    role: 'user',
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export function logoutUser(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function canAccess(role: UserRole | undefined, feature: string): boolean {
  if (!role) return false;
  const account = DEMO_ACCOUNTS.find((a) => a.role === role);
  return account?.permissions.includes(feature) ?? false;
}
