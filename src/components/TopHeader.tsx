'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { Calendar } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/home': 'Dashboard',
  '/checkin': 'Check-in',
  '/history': 'Dein Verlauf',
  '/calendar': 'Kalender',
  '/quickwins': 'Quick Wins & Aktionen',
  '/achievements': 'Erfolge',
  '/unlockables': 'Freischaltungen',
  '/notifications': 'Erinnerungen',
  '/profile': 'Dein Profil',
  '/admin': 'Admin Panel',
};

export function TopHeader() {
  const pathname = usePathname();
  const { currentUser } = useAuthStore();
  const { profile } = useAppStore();
  
  if (!currentUser) return null;

  let pageTitle = PAGE_TITLES[pathname] || 'DailyEcho';
  
  const hour = new Date().getHours();
  const isMorningTime = hour >= 5 && hour < 12;
  const isEveningTime = hour >= 17;
  
  if (pathname === '/home') {
    const greeting = isMorningTime ? 'Guten Morgen' : isEveningTime ? 'Guten Abend' : 'Hallo';
    const name = profile?.onboarding_name || profile?.display_name || currentUser.name.split(' ')[0] || '';
    pageTitle = `${greeting}${name ? `, ${name}` : ''} 👋`;
  }

  const today = new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

  return (
    <header className="hidden lg:flex items-center justify-between px-8 xl:px-12 py-6 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{pageTitle}</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/50 px-3 py-1.5 rounded-lg border border-border/50">
          <Calendar className="w-4 h-4" />
          <span className="font-medium">{today}</span>
        </div>
      </div>
    </header>
  );
}