'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, PenLine, Trophy, BookOpen, ShieldCheck, LogOut, User, Moon, Sun, CalendarDays, Zap, Bell, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { ROLE_LABELS, ROLE_COLORS, canAccess } from '@/lib/auth';
import { ThemeSwitch } from '@/components/ThemeSwitch';

const NAV_ITEMS = [
  { name: 'Dashboard', url: '/home', icon: Home, permission: null },
  { name: 'Check-in', url: '/checkin', icon: PenLine, permission: 'check-in' },
  { name: 'Verlauf', url: '/history', icon: BookOpen, permission: 'history' },
  { name: 'Kalender', url: '/calendar', icon: CalendarDays, permission: 'history' },
  { name: 'Quick Wins', url: '/quickwins', icon: Zap, permission: 'check-in' },
  { name: 'Erfolge', url: '/achievements', icon: Trophy, permission: 'achievements' },
  { name: 'Freischaltungen', url: '/unlockables', icon: Star, permission: null },
  { name: 'Erinnerungen', url: '/notifications', icon: Bell, permission: 'check-in' },
  { name: 'Profil', url: '/profile', icon: User, permission: null },
  { name: 'Admin', url: '/admin', icon: ShieldCheck, permission: 'admin-panel' },
];

export function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAuthStore();

  if (!currentUser) return null;

  const visibleItems = NAV_ITEMS.filter(
    (item) => item.permission === null || canAccess(currentUser.role, item.permission)
  );

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
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
      </nav>

      {/* User info + Logout */}
      <div className="px-3 py-4 border-t border-border space-y-2">
        {/* User card */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-accent/50">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shrink-0">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{currentUser.name}</p>
            <span
              className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                ROLE_COLORS[currentUser.role]
              )}
            >
              {ROLE_LABELS[currentUser.role]}
            </span>
          </div>
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
