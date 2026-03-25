'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, PenLine, Trophy, BookOpen, ShieldCheck, LogOut, User, CalendarDays, Zap, Star, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { calculateLevel, getLevelTitle, getLevelProgress } from '@/lib/xp';
import { ACHIEVEMENTS } from '@/lib/achievements';
import { ROLE_LABELS, ROLE_COLORS, canAccess } from '@/lib/auth';
import { ThemeSwitch } from '@/components/ThemeSwitch';

const NAV_GROUPS = [
  {
    label: 'Täglich',
    items: [
      { name: 'Dashboard', url: '/home', icon: Home, permission: null },
    ]
  },
  {
    label: 'Rückblick',
    items: [
      { name: 'Verlauf', url: '/history', icon: BookOpen, permission: 'history' },
      { name: 'Erfolge', url: '/achievements', icon: Trophy, permission: 'achievements' },
    ]
  },
  {
    label: 'Einstellungen',
    items: [
      { name: 'Profil', url: '/profile', icon: User, permission: null },
      { name: 'Hilfe', url: '/help', icon: HelpCircle, permission: null },
      { name: 'Admin', url: '/admin', icon: ShieldCheck, permission: 'admin-panel' },
    ]
  }
];

export function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAuthStore();
  const { profile, unlockedAchievements } = useAppStore();

  if (!currentUser || !profile) return null;

  const currentLevel = calculateLevel(profile.xp || 0);
  const currentTitle = getLevelTitle(currentLevel);
  const progressPercent = getLevelProgress(profile.xp || 0);

  // Last 3 unlocked achievements as emoji
  const recentAchievements = ACHIEVEMENTS
    .filter(a => unlockedAchievements.includes(a.id as never))
    .slice(-3);

  // Name initials for avatar
  const initials = (currentUser.name || '?')
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Avatar ring color based on level
  const avatarRingClass =
    currentLevel >= 10 ? 'ring-2 ring-offset-2 ring-offset-background ring-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.5)]' :
    currentLevel >= 7  ? 'ring-2 ring-offset-2 ring-offset-background ring-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]' :
    currentLevel >= 4  ? 'ring-2 ring-offset-2 ring-offset-background ring-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.4)]' :
                         'ring-2 ring-offset-2 ring-offset-background ring-purple-400';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm shadow">
            🌀
          </div>
          <div>
            <h1 className="font-bold text-sm leading-none">DailyEcho</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">Tägliche Reflexion</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter(
            (item) => item.permission === null || canAccess(currentUser.role, item.permission)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label} className="space-y-1">
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {group.label}
              </h3>
              {visibleItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <motion.button
                    key={item.url}
                    onClick={() => router.push(item.url)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.name}
                    {item.name === 'Admin' && (
                      <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full font-semibold">
                        Admin
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div className="px-3 py-4 border-t border-border space-y-2">
        {/* User card — expanded */}
        <div className="px-3 py-3 rounded-2xl bg-accent/50 flex flex-col gap-3">
          {/* Avatar + name row */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0 text-white font-bold text-sm ${avatarRingClass}`}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate leading-tight">{currentUser.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded-full whitespace-nowrap">
                  Lv. {currentLevel}
                </span>
                <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded-full whitespace-nowrap">
                  🔥 {profile.streak ?? 0}
                </span>
                <span className="text-[10px] text-muted-foreground w-full">{currentTitle}</span>
              </div>
            </div>
          </div>

          {/* XP Progress bar */}
          <div className="w-full">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
              <span>{profile.xp ?? 0} XP</span>
              <span>Nächstes Level</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
              />
            </div>
          </div>

          {/* Recent achievements */}
          {recentAchievements.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">Erfolge:</span>
              <div className="flex gap-1">
                {recentAchievements.map(a => (
                  <span
                    key={a.id}
                    title={a.label}
                    className="text-base leading-none"
                  >
                    {a.emoji}
                  </span>
                ))}
              </div>
              {unlockedAchievements.length > 3 && (
                <span className="text-[10px] text-muted-foreground ml-auto">+{unlockedAchievements.length - 3} mehr</span>
              )}
            </div>
          )}
        </div>

        <motion.button
          onClick={handleLogout}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Abmelden
        </motion.button>

        {/* Theme Switch */}
        <div className="flex items-center justify-between px-3 py-1">
          <span className="text-xs text-muted-foreground font-medium">Darstellung</span>
          <ThemeSwitch />
        </div>
      </div>
    </aside>
  );
}
