'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, PenLine, BookOpen, User, CalendarDays } from 'lucide-react';
import { NavBar } from '@/components/ui/tubelight-navbar';

const navItems = [
  { name: 'Home', url: '/home', icon: Home },
  { name: 'Check-in', url: '/checkin', icon: PenLine },
  { name: 'Verlauf', url: '/history', icon: BookOpen },
  { name: 'Kalender', url: '/calendar', icon: CalendarDays },
  { name: 'Profil', url: '/profile', icon: User },
];

export function AppNavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const items = navItems.map((item) => ({
    ...item,
    onClick: () => router.push(item.url),
    active: pathname === item.url || pathname.startsWith(item.url + '/'),
  }));

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center pb-4 px-4">
      <NavBar items={items} />
    </div>
  );
}
