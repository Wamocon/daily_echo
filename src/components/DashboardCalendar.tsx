'use client';

import { useEffect, useState } from 'react';
import { getAllEntries } from '@/lib/storage';
import { DailyEntry } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const MOOD_COLOR: Record<number, string> = {
  1: 'bg-red-400 dark:bg-red-500',
  2: 'bg-orange-400 dark:bg-orange-500',
  3: 'bg-yellow-400 dark:bg-yellow-500',
  4: 'bg-green-400 dark:bg-green-500',
  5: 'bg-emerald-400 dark:bg-emerald-500',
};

function toISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = (first.getDay() + 6) % 7; // 0=Mon
  for (let i = 0; i < startDay; i++) days.push(null as unknown as Date);
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  return days;
}

export function DashboardCalendar() {
  const today = new Date();
  const { profile } = useAppStore();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [entries, setEntries] = useState<Record<string, DailyEntry>>({});

  useEffect(() => {
    const all = getAllEntries();
    const map: Record<string, DailyEntry> = {};
    all.forEach((e) => { map[e.entry_date] = e; });
    setEntries(map);
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const days = getDaysInMonth(viewYear, viewMonth);
  const monthName = new Date(viewYear, viewMonth).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  const todayISO = toISO(today);

  return (
    <div className="flex flex-col h-full">
      {/* Streak header */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500 shrink-0" />
          <span className="text-2xl font-bold leading-none">{profile.streak}</span>
          <span className="text-xs text-muted-foreground">Tage am Stück</span>
        </div>
        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">Längster: {profile.longest_streak}</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <CalendarIcon className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-sm capitalize">{monthName}</span>
        </div>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground" disabled={viewMonth === today.getMonth() && viewYear === today.getFullYear()}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-muted-foreground uppercase">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const iso = toISO(day);
          const entry = entries[iso];
          const isToday = iso === todayISO;
          
          // Wir nehmen Abend-Stimmung gepriorisiert, da dies den Tagesabschluss darstellt. Ansonsten Morgen-Stimmung.
          const mood = entry?.evening_mood ?? entry?.morning_mood;
          const hasEntry = entry?.morning_done || entry?.evening_done;

          return (
            <motion.div
              key={iso}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.01 }}
              className="aspect-square flex items-center justify-center relative"
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex flex-col items-center justify-center text-xs font-medium cursor-default transition-all',
                  isToday && !mood && 'ring-2 ring-primary ring-offset-2 ring-offset-background font-bold',
                  mood ? MOOD_COLOR[mood] : 'bg-muted/40 text-muted-foreground',
                  mood && 'text-white dark:text-white shadow-sm',
                )}
                title={hasEntry ? `Eintrag vorhanden am ${day.toLocaleDateString('de-DE')}` : undefined}
              >
                {day.getDate()}
              </div>
              {hasEntry && !mood && (
                <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}