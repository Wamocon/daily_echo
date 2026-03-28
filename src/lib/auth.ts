import { AuthUser, UserRole } from '@/types';

// ─── Role-based permission map ────────────────────────────────────────────────

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['check-in', 'history', 'achievements', 'admin-panel'],
  user:  ['check-in', 'history', 'achievements'],
  guest: [],
};

export function canAccess(role: UserRole | undefined, feature: string): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(feature) ?? false;
}

// ─── Display helpers (still used by SideNav / Admin page) ────────────────────

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


