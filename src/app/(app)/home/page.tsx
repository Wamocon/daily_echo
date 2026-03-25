'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { StreakDisplay } from '@/components/StreakDisplay';
import { WeeklyGoalRing } from '@/components/WeeklyGoalRing';
import XPBar from '@/components/XPBar';
import LevelUpModal from '@/components/LevelUpModal';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PenLine, Sun, Moon, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getOnThisDay } from '@/lib/storage';
import { DailyEntry } from '@/types';
import { QuickActionsSidebar } from '@/components/QuickActionsSidebar';
import { DashboardMoodChart } from '@/components/DashboardMoodChart';

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
      <div className="w-full max-w-5xl mx-auto">
        <p className="text-muted-foreground animate-pulse">Laden...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <LevelUpModal />
      
      {/* Mobile Begrüßung */}
      <div className="lg:hidden mb-6 px-1">
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

      {/* DASHBOARD LAYOUT & SIDEBAR */}
      <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
        
        {/* BENTO GRID (Main Content) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 w-full lg:flex-1">

          {/* --- 1. Haupt-CTA (Hero) --- */}
        <div className="col-span-1 md:col-span-12 lg:col-span-7 bg-card rounded-[2rem] p-6 lg:p-8 shadow-sm border border-border/40 flex flex-col justify-center relative overflow-hidden group hover:border-primary/20 transition-all">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500 pointer-events-none" />
          
          <h2 className="text-xl font-bold mb-2 z-10">Dein Journal</h2>
          <p className="text-sm text-muted-foreground mb-6 z-10 max-w-sm">
            Nimm dir einen kurzen Moment für dich. Reflektiere deinen Tag und lade neue Energie auf.
          </p>
          
          <div className="z-10 mt-auto">
            {!allDone ? (
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full gap-3 h-14 px-8 text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                onClick={() => router.push(`/checkin?mode=${primaryMode}`)}
              >
                <PenLine className="w-5 h-5" />
                {nextCheckinLabel}
                <ChevronRight className="w-4 h-4 ml-2 opacity-50" />
              </Button>
            ) : (
              <div className="rounded-2xl border border-green-300/50 dark:border-green-700/50 bg-green-50/50 dark:bg-green-950/30 px-5 py-4 flex items-center gap-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-semibold text-sm text-green-800 dark:text-green-200">Alles erledigt für heute!</p>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">Bis morgen früh 👋</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- 2. Streak & Wochenziel --- */}
        <div className="col-span-1 md:col-span-6 lg:col-span-5 bg-card rounded-[2rem] p-6 lg:p-7 shadow-sm border border-border/40 flex flex-col justify-between hover:border-primary/20 transition-all">
          <div className="flex items-start justify-between gap-4 mb-4">
            <StreakDisplay />
            <div className="shrink-0 scale-90 origin-top-right">
              <WeeklyGoalRing />
            </div>
          </div>
          <div className="bg-accent/30 rounded-2xl p-4 mt-auto">
            <XPBar xp={profile.xp ?? 0} level={profile.level ?? 1} />
          </div>
        </div>

        {/* --- 3. Status Morgen --- */}
        <button
          onClick={() => !morningDone && router.push('/checkin?mode=morning')}
          className={`col-span-1 md:col-span-6 lg:col-span-4 rounded-[2rem] p-6 shadow-sm border flex items-center gap-5 transition-all text-left group ${
            morningDone
              ? 'bg-green-50/30 dark:bg-green-950/20 border-border/40 cursor-default'
              : 'bg-card border-border/40 hover:border-primary/40 cursor-pointer hover:shadow-md'
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${morningDone ? 'bg-green-100 dark:bg-green-900/50' : 'bg-yellow-100 dark:bg-yellow-900/40 group-hover:scale-105'}`}>
            <Sun className={`w-6 h-6 ${morningDone ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
          </div>
          <div>
            <h3 className="text-base font-semibold group-hover:text-primary transition-colors">Morgen</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {morningDone ? 'Erledigt ✓' : 'Jetzt starten'}
            </p>
          </div>
        </button>

        {/* --- 4. Status Abend --- */}
        <button
          onClick={() => !eveningDone && router.push('/checkin?mode=evening')}
          className={`col-span-1 md:col-span-6 lg:col-span-4 rounded-[2rem] p-6 shadow-sm border flex items-center gap-5 transition-all text-left group ${
            eveningDone
              ? 'bg-green-50/30 dark:bg-green-950/20 border-border/40 cursor-default'
              : 'bg-card border-border/40 hover:border-primary/40 cursor-pointer hover:shadow-md'
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${eveningDone ? 'bg-green-100 dark:bg-green-900/50' : 'bg-indigo-100 dark:bg-indigo-900/40 group-hover:scale-105'}`}>
            <Moon className={`w-6 h-6 ${eveningDone ? 'text-green-600 dark:text-green-400' : 'text-indigo-600 dark:text-indigo-400'}`} />
          </div>
          <div>
            <h3 className="text-base font-semibold group-hover:text-primary transition-colors">Abend</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {eveningDone ? 'Erledigt ✓' : 'Jetzt starten'}
            </p>
          </div>
        </button>

        {/* --- 5. Heute vor einem Jahr --- */}
        {onThisDay.length > 0 ? (
          <div className="col-span-1 md:col-span-6 lg:col-span-4 bg-card rounded-[2rem] p-6 shadow-sm border border-border/40 hover:border-primary/20 transition-all flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-3">
              <Calendar className="w-4 h-4 text-primary" />
              Heute vor einem Jahr
            </div>
            {onThisDay.slice(0, 1).map((e) => (
              <div key={e.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {new Date(e.entry_date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <div className="flex gap-2 text-base bg-accent px-2 py-1 rounded-full">
                    {e.morning_mood && <span>{MOOD_EMOJI[e.morning_mood]}</span>}
                    {e.evening_mood && <span>{MOOD_EMOJI[e.evening_mood]}</span>}
                  </div>
                </div>
                {e.quickwin_text && (
                  <p className="text-sm text-muted-foreground bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-xl px-3 py-2 mt-1 font-medium">
                    ⚡ {e.quickwin_text}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-1 md:col-span-6 lg:col-span-4 bg-card rounded-[2rem] p-6 shadow-sm border border-border/40 flex flex-col items-center justify-center text-center opacity-70">
            <Calendar className="w-8 h-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">Kein Eintrag vom letzten Jahr</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Bleib dran, um deine Historie zu füllen!</p>
          </div>
        )}

          {/* --- 6. NEU: Dashboard Chart Widget --- */}
          <div className="col-span-1 md:col-span-12 bg-card rounded-[2rem] p-6 lg:p-7 shadow-sm border border-border/40 hover:border-primary/20 transition-all flex flex-col justify-center min-h-[300px]">
            <DashboardMoodChart />
          </div>

        </div>

        {/* --- RIGHT SIDEBAR (Quick Actions) --- */}
        <aside className="w-full lg:w-80 shrink-0">
          <QuickActionsSidebar />
        </aside>

      </div>
    </div>
  );
}
