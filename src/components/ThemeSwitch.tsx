'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/material-design-3-switch';

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-[52px] h-8" />;

  const isDark = theme === 'dark';

  return (
    <Switch
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      haptic="light"
      checkedIcon={<Moon className="w-3.5 h-3.5 fill-current" />}
      uncheckedIcon={<Sun className="w-3.5 h-3.5 fill-current" />}
    />
  );
}
