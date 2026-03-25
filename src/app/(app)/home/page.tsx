'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { StreakDisplay } from '@/components/StreakDisplay';
import { WeeklyGoalRing } from '@/components/WeeklyGoalRing';
import XPBar from '@/components/XPBar';
import LevelUpModal from '@/components/LevelUpModal';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PenLine, Sun, Moon, ChevronRight, CheckCircle2, PanelRightClose, PanelRightOpen, Sparkles, X } from 'lucide-react';
import { QuickActionsSidebar } from '@/components/QuickActionsSidebar';
import { DashboardMoodChart } from '@/components/DashboardMoodChart';
import { DashboardCalendar } from '@/components/DashboardCalendar';
import { motion, AnimatePresence } from 'framer-motion';

const MOOD_EMOJI: Record<number, string> = { 1: '😔', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' };

export default function DashboardPage() {
  const { profile, todayEntry, isInitialized } = useAppStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

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

  // Red dot for FAB: show when intervention is available
  const recentMood = (hour >= 5 && hour < 12 ? todayEntry?.morning_mood : todayEntry?.evening_mood) ?? null;
  const hasIntervention = recentMood !== null && recentMood <= 3 && !todayEntry?.intervention_done;

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

        {/* --- RIGHT SIDEBAR (collapsible, desktop only) --- */}
        <div className="hidden lg:flex flex-col items-end shrink-0">
          {/* Toggle header row */}
          <div
            className={`flex items-center gap-2 mb-3 cursor-pointer select-none group ${
              sidebarOpen ? 'self-stretch justify-between' : 'justify-end'
            }`}
            onClick={() => setSidebarOpen(o => !o)}
          >
            {sidebarOpen && (
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Für dich</span>
            )}
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-card border border-border/40 shadow-sm group-hover:bg-accent group-hover:border-primary/30 transition-all">
              {sidebarOpen
                ? <PanelRightClose className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                : <PanelRightOpen className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />}
            </div>
          </div>

          <motion.aside
            animate={{ width: sidebarOpen ? 320 : 0, opacity: sidebarOpen ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="overflow-hidden flex-shrink-0"
          >
            <div className="w-80 bg-muted/60 dark:bg-muted/30 rounded-[2rem] border-2 border-border/60 shadow-sm p-5">
              <QuickActionsSidebar />
            </div>
          </motion.aside>
        </div>

        {/* Mobile FAB */}
        <button
          onClick={() => setSheetOpen(true)}
          className="lg:hidden fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          aria-label="Für dich öffnen"
        >
          <Sparkles className="w-6 h-6" />
          {hasIntervention && (
            <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-background" />
          )}
        </button>

        {/* Mobile Bottom Sheet */}
        {/* Backdrop — conditional is fine, holds no widget state */}
        <AnimatePresence>
          {sheetOpen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm"
              onClick={() => setSheetOpen(false)}
            />
          )}
        </AnimatePresence>
        {/* Sheet — always mounted so timer/video state is preserved */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: sheetOpen ? 0 : '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 38 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-background rounded-t-[2rem] shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-border/40">
            <span className="font-bold text-base">Für dich</span>
            <button
              onClick={() => setSheetOpen(false)}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          {/* Content */}
          <div className="px-5 pt-4 pb-10">
            <QuickActionsSidebar />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
