'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, PenLine, Trophy, BookOpen } from 'lucide-react';
import { NavBar } from '@/components/ui/tubelight-navbar';

const navItems = [
  { name: 'Home', url: '/', icon: Home },
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
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-4">
      <NavBar items={items} />
    </div>
  );
}
