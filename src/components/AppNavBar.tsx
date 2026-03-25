'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, BookOpen, User, Trophy } from 'lucide-react';
import { NavBar } from '@/components/ui/tubelight-navbar';

const navItems = [
  { name: 'Home', url: '/home', icon: Home },
  { name: 'Verlauf', url: '/history', icon: BookOpen },
  { name: 'Erfolge', url: '/achievements', icon: Trophy },
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
    <div className="lg:hidden w-full">
      <NavBar items={items} />
    </div>
  );
}
