'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { StreakDisplay } from '@/components/StreakDisplay';
import { WeeklyGoalRing } from '@/components/WeeklyGoalRing';
import XPBar from '@/components/XPBar';
import LevelUpModal from '@/components/LevelUpModal';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PenLine, Sun, Moon, ChevronRight, CheckCircle2, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { QuickActionsSidebar } from '@/components/QuickActionsSidebar';
import { DashboardMoodChart } from '@/components/DashboardMoodChart';
import { DashboardCalendar } from '@/components/DashboardCalendar';
import { motion, AnimatePresence } from 'framer-motion';

const MOOD_EMOJI: Record<number, string> = { 1: '😔', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' };

export default function DashboardPage() {
  const { profile, todayEntry, isInitialized } = useAppStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
          
          <h2 className="text-xl font-bold mb-2 z-10">Tägliche Reflexion</h2>
          <p className="text-sm text-muted-foreground mb-6 z-10 max-w-sm">
            Nimm dir einen kurzen Moment für dich. Checke ein und sammle kleine Erfolge für deinen Tag.
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

        {/* --- 2. Streak --- */}
        <div className="col-span-1 md:col-span-6 lg:col-span-2 bg-card rounded-[2rem] p-6 shadow-sm border border-border/40 flex flex-col items-center justify-center hover:border-primary/20 transition-all">
          <StreakDisplay />
        </div>

        {/* --- 3. Wochenziel --- */}
        <div className="col-span-1 md:col-span-6 lg:col-span-3 bg-card rounded-[2rem] py-6 px-4 shadow-sm border border-border/40 flex flex-col items-center justify-center hover:border-primary/20 transition-all">
          <div className="scale-90 origin-center">
            <WeeklyGoalRing />
          </div>
        </div>

        {/* --- 4. Level & XP --- */}
        <div className="col-span-1 md:col-span-12 lg:col-span-4 bg-card rounded-[2rem] p-6 shadow-sm border border-border/40 flex flex-col justify-center hover:border-primary/20 transition-all">
          <h3 className="text-sm font-semibold mb-3">Dein Fortschritt</h3>
          <div className="bg-accent/30 rounded-2xl p-4">
            <XPBar xp={profile.xp ?? 0} level={profile.level ?? 1} />
          </div>
        </div>

        {/* --- 5. Status Kombi (Morgen & Abend) --- */}
        <div className="col-span-1 md:col-span-12 lg:col-span-8 bg-card rounded-[2rem] p-6 shadow-sm border border-border/40 flex flex-col justify-center">
          <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-widest pl-1">Dein Rhythmus</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => !morningDone && router.push('/checkin?mode=morning')}
              className={`rounded-2xl p-5 border flex items-center gap-4 transition-all text-left group ${
                morningDone
                  ? 'bg-green-50/50 dark:bg-green-950/20 border-border/40 cursor-default'
                  : 'bg-background hover:bg-muted/50 border-border/40 hover:border-primary/40 cursor-pointer shadow-sm hover:shadow-md'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${morningDone ? 'bg-green-100 dark:bg-green-900/50' : 'bg-yellow-100 dark:bg-yellow-900/40 group-hover:scale-110'}`}>
                <Sun className={`w-6 h-6 ${morningDone ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
              </div>
              <div>
                <h3 className="text-base font-bold group-hover:text-primary transition-colors">Morgen</h3>
                <p className="text-sm text-muted-foreground mt-0.5 font-medium">
                  {morningDone ? 'Erledigt ✓' : 'Jetzt starten'}
                </p>
              </div>
            </button>

            <button
              onClick={() => !eveningDone && router.push('/checkin?mode=evening')}
              className={`rounded-2xl p-5 border flex items-center gap-4 transition-all text-left group ${
                eveningDone
                  ? 'bg-green-50/50 dark:bg-green-950/20 border-border/40 cursor-default'
                  : 'bg-background hover:bg-muted/50 border-border/40 hover:border-primary/40 cursor-pointer shadow-sm hover:shadow-md'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${eveningDone ? 'bg-green-100 dark:bg-green-900/50' : 'bg-indigo-100 dark:bg-indigo-900/40 group-hover:scale-110'}`}>
                <Moon className={`w-6 h-6 ${eveningDone ? 'text-green-600 dark:text-green-400' : 'text-indigo-600 dark:text-indigo-400'}`} />
              </div>
              <div>
                <h3 className="text-base font-bold group-hover:text-primary transition-colors">Abend</h3>
                <p className="text-sm text-muted-foreground mt-0.5 font-medium">
                  {eveningDone ? 'Erledigt ✓' : 'Jetzt starten'}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* --- 5. Dashboard Calendar --- */}
        <div className="col-span-1 md:col-span-6 lg:col-span-4 bg-card rounded-[2rem] p-6 lg:p-7 shadow-sm border border-border/40 hover:border-primary/20 transition-all flex flex-col justify-center">
          <DashboardCalendar />
        </div>

        {/* --- 6. Dashboard Chart Widget --- */}
        <div className="col-span-1 md:col-span-12 lg:col-span-8 bg-card rounded-[2rem] p-6 lg:p-7 shadow-sm border border-border/40 hover:border-primary/20 transition-all flex flex-col justify-center min-h-[300px]">
          <DashboardMoodChart />
        </div>

        </div>

        {/* --- RIGHT SIDEBAR (Quick Actions) collapsible --- */}
        {/* Floating toggle tab (desktop only) */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 z-30 flex-col items-center justify-center gap-1 bg-card border border-border/60 border-r-0 rounded-l-2xl px-2 py-4 shadow-md hover:bg-accent transition-all group"
          title={sidebarOpen ? 'Panel schließen' : 'Panel öffnen'}
        >
          {sidebarOpen
            ? <PanelRightClose className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            : <PanelRightOpen className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />}
          <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest writing-mode-vertical" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            Für dich
          </span>
        </button>

        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              key="sidebar"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 320 }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="shrink-0 overflow-hidden hidden lg:block"
            >
              <div className="w-80">
                <QuickActionsSidebar />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile: always shown, no toggle */}
        <aside className="w-full lg:hidden">
          <QuickActionsSidebar />
        </aside>

      </div>
    </div>
  );
}
