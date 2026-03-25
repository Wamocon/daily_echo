'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { StreakDisplay } from '@/components/StreakDisplay';
import { WeeklyGoalRing } from '@/components/WeeklyGoalRing';
import XPBar from '@/components/XPBar';
import LevelUpModal from '@/components/LevelUpModal';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PenLine, Sun, Moon, Calendar } from 'lucide-react';
import { getOnThisDay } from '@/lib/storage';
import { DailyEntry } from '@/types';

const MOOD_EMOJI: Record<number, string> = { 1: '😔', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' };

export default function DashboardPage() {
  const { profile, todayEntry, isInitialized } = useAppStore();
  const router = useRouter();
  const [onThisDay, setOnThisDay] = useState<DailyEntry[]>([]);

  const morningDone = todayEntry?.morning_done ?? false;
  const eveningDone = todayEntry?.evening_done ?? false;
  const allDone = morningDone && eveningDone;
  const hour = new Date().getHours();

  // Tageszeit-adaptiv: was ist jetzt die relevante Aktion?
  const primaryMode = !morningDone ? 'morning' : 'evening';
  const isMorningTime = hour >= 5 && hour < 12;
  const isEveningTime = hour >= 17;
  const nextCheckinLabel = primaryMode === 'morning'
    ? '🌅 Morgen-Check-in starten'
    : '🌙 Abend-Check-in starten';

  useEffect(() => {
    setOnThisDay(getOnThisDay());
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Laden...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <LevelUpModal />
      <div className="flex flex-col gap-6 px-4 pt-10 pb-32 lg:pb-10 w-full max-w-lg mx-auto">

        {/* Begrüßung */}
        <div>
          <h1 className="text-2xl font-bold">
            {isMorningTime ? 'Guten Morgen' : isEveningTime ? 'Guten Abend' : 'Hallo'}
            {profile.onboarding_name ? `, ${profile.onboarding_name}` : profile.display_name ? `, ${profile.display_name}` : ''}! 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          {profile.onboarding_goal && (
            <p className="text-xs text-primary/70 mt-1.5 font-medium">
              🎯 Dein Ziel: {profile.onboarding_goal}
            </p>
          )}
        </div>

        {/* Primärer CTA — nur wenn noch etwas zu tun ist */}
        {!allDone ? (
          <Button
            size="lg"
            className="w-full rounded-2xl gap-2 h-14 text-base shadow-md"
            onClick={() => router.push(`/checkin?mode=${primaryMode}`)}
          >
            <PenLine className="w-5 h-5" />
            {nextCheckinLabel}
          </Button>
        ) : (
          <div className="rounded-2xl border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950 px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-sm text-green-800 dark:text-green-200">Alles erledigt für heute!</p>
              <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">Bis morgen früh 👋</p>
            </div>
          </div>
        )}

        {/* Status-Karten (sekundär) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => !morningDone && router.push('/checkin?mode=morning')}
            className={`rounded-2xl border p-4 flex flex-col items-center gap-2 transition-all ${
              morningDone
                ? 'bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700 cursor-default'
                : 'bg-card hover:border-primary/50 cursor-pointer'
            }`}
          >
            <Sun className={`w-6 h-6 ${morningDone ? 'text-green-500' : 'text-yellow-500'}`} />
            <span className="text-sm font-medium">Morgen</span>
            <span className="text-xs text-muted-foreground">
              {morningDone ? '✓ Erledigt' : 'Offen'}
            </span>
          </button>
          <button
            onClick={() => !eveningDone && router.push('/checkin?mode=evening')}
            className={`rounded-2xl border p-4 flex flex-col items-center gap-2 transition-all ${
              eveningDone
                ? 'bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700 cursor-default'
                : 'bg-card hover:border-primary/50 cursor-pointer'
            }`}
          >
            <Moon className={`w-6 h-6 ${eveningDone ? 'text-green-500' : 'text-indigo-500'}`} />
            <span className="text-sm font-medium">Abend</span>
            <span className="text-xs text-muted-foreground">
              {eveningDone ? '✓ Erledigt' : 'Offen'}
            </span>
          </button>
        </div>

        {/* Streak + Wochenziel kompakt */}
        <div className="bg-card rounded-2xl border p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <StreakDisplay />
            <div className="shrink-0">
              <WeeklyGoalRing />
            </div>
          </div>
          <XPBar xp={profile.xp ?? 0} level={profile.level ?? 1} />
        </div>

        {/* Heute vor einem Jahr — nur wenn Daten vorhanden */}
        {onThisDay.length > 0 && (
          <div className="bg-card rounded-2xl border p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Heute vor einem Jahr
            </div>
            {onThisDay.slice(0, 1).map((e) => (
              <div key={e.id} className="flex items-center justify-between">
                <span className="text-sm">
                  {new Date(e.entry_date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <div className="flex gap-2 text-sm">
                  {e.morning_mood && <span>{MOOD_EMOJI[e.morning_mood]}</span>}
                  {e.evening_mood && <span>{MOOD_EMOJI[e.evening_mood]}</span>}
                </div>
              </div>
            ))}
            {onThisDay[0]?.quickwin_text && (
              <p className="text-xs text-muted-foreground bg-amber-50 dark:bg-amber-950 rounded-xl px-3 py-2">
                ⚡ {onThisDay[0].quickwin_text}
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
