'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, PenLine, Trophy, BookOpen } from 'lucide-react';
import { NavBar } from '@/components/ui/tubelight-navbar';
import { ThemeSwitch } from '@/components/ThemeSwitch';

const navItems = [
  { name: 'Home', url: '/home', icon: Home },
  { name: 'Check-in', url: '/checkin', icon: PenLine },
  { name: 'Erfolge', url: '/achievements', icon: Trophy },
  { name: 'Verlauf', url: '/history', icon: BookOpen },
];

export function AppNavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const items = navItems.map((item) => ({
    ...item,
    onClick: () => router.push(item.url),
    active: pathname === item.url,
  }));

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center pb-4 px-4 gap-3">
      <NavBar items={items} />
      <div className="bg-card/80 backdrop-blur-md border border-border rounded-full flex items-center justify-center shadow-lg">
        <ThemeSwitch />
      </div>
    </div>
  );
}
