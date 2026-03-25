import { AuthUser, UserRole } from '@/types';

const AUTH_KEY = 'dailyecho_auth';

export interface DemoAccount {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
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

// Admin overrides: allow editing demo account display data at runtime.
const ADMIN_OVERRIDES_KEY = 'dailyecho_admin_overrides';

export interface AccountOverride {
  id: string;
  name?: string;
  pin?: string;
  tagline?: string;
  role?: UserRole;
}

export function getAdminOverrides(): AccountOverride[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ADMIN_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAdminOverrides(overrides: AccountOverride[]): void {
  localStorage.setItem(ADMIN_OVERRIDES_KEY, JSON.stringify(overrides));
}

export function getEffectiveDemoAccounts(): DemoAccount[] {
  const overrides = getAdminOverrides();
  return DEMO_ACCOUNTS.map((acc) => {
    const ov = overrides.find((o) => o.id === acc.id);
    if (!ov) return acc;
    return {
      ...acc,
      ...(ov.name !== undefined && { name: ov.name }),
      ...(ov.pin !== undefined && { pin: ov.pin }),
      ...(ov.tagline !== undefined && { tagline: ov.tagline }),
      ...(ov.role !== undefined && { role: ov.role }),
    };
  });
}

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

const REGISTERED_USERS_KEY = 'dailyecho_registered_users';

interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

function getRegisteredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function registerUser(name: string, email: string): AuthUser {
  const user: AuthUser = {
    id: `user-${Date.now()}`,
    name,
    role: 'user',
    created_at: new Date().toISOString(),
  };
  // Store in registered list for future logins
  const users = getRegisteredUsers();
  users.push({ ...user, email: email.toLowerCase().trim() });
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export function loginByEmail(email: string): AuthUser | null {
  const users = getRegisteredUsers();
  const found = users.find((u) => u.email === email.toLowerCase().trim());
  if (!found) return null;
  const user: AuthUser = { id: found.id, name: found.name, role: found.role, created_at: found.created_at };
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
