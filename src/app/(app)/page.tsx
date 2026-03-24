'use client';

import { useAppStore } from '@/store/useAppStore';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { StreakDisplay } from '@/components/StreakDisplay';
import { WeeklyGoalRing } from '@/components/WeeklyGoalRing';
import { Button } from '@/components/ui/button';
import { GradientText } from '@/components/ui/gradient-text';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PenLine, Sun, Moon } from 'lucide-react';

export default function DashboardPage() {
  const { profile, todayEntry, isInitialized } = useAppStore();
  const router = useRouter();

  const morningDone = todayEntry?.morning_done ?? false;
  const eveningDone = todayEntry?.evening_done ?? false;
  const hour = new Date().getHours();
  const isEvening = hour >= 17;

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Laden...</p>
      </div>
    );
  }

  return (
    <AuroraBackground className="min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-8 px-4 pt-16 pb-8 w-full max-w-lg mx-auto"
      >
        {/* Begrüßung */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Hallo{profile.display_name ? `, ${profile.display_name}` : ''}! 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* Streak */}
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl border p-6 w-full shadow-sm">
          <StreakDisplay />
        </div>

        {/* Check-in Karten */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={() => router.push('/checkin?mode=morning')}
            className={`rounded-2xl border p-4 flex flex-col items-center gap-2 transition-all shadow-sm ${
              morningDone
                ? 'bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700'
                : 'bg-card/80 backdrop-blur-sm hover:border-primary/50'
            }`}
          >
            <Sun className={`w-7 h-7 ${morningDone ? 'text-green-500' : 'text-yellow-500'}`} />
            <span className="text-sm font-medium">Morgen</span>
            <span className="text-xs text-muted-foreground">
              {morningDone ? '✓ Erledigt' : 'Noch offen'}
            </span>
          </button>
          <button
            onClick={() => router.push('/checkin?mode=evening')}
            className={`rounded-2xl border p-4 flex flex-col items-center gap-2 transition-all shadow-sm ${
              eveningDone
                ? 'bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700'
                : 'bg-card/80 backdrop-blur-sm hover:border-primary/50'
            }`}
          >
            <Moon className={`w-7 h-7 ${eveningDone ? 'text-green-500' : 'text-indigo-500'}`} />
            <span className="text-sm font-medium">Abend</span>
            <span className="text-xs text-muted-foreground">
              {eveningDone ? '✓ Erledigt' : 'Noch offen'}
            </span>
          </button>
        </div>

        {/* CTA Button */}
        {(!morningDone || !eveningDone) && (
          <Button
            size="lg"
            className="w-full rounded-2xl gap-2"
            onClick={() => router.push(`/checkin?mode=${!morningDone ? 'morning' : 'evening'}`)}
          >
            <PenLine className="w-5 h-5" />
            {!morningDone ? 'Morgen-Check-in starten' : 'Abend-Check-in starten'}
          </Button>
        )}

        {/* Wochenziel */}
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl border p-6 w-full shadow-sm">
          <WeeklyGoalRing />
        </div>

        {/* Gesamtstatistiken */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl border p-4 text-center shadow-sm">
            <p className="text-2xl font-bold">
              <GradientText>{profile.total_checkins}</GradientText>
            </p>
            <p className="text-xs text-muted-foreground mt-1">Gesamt Check-ins</p>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl border p-4 text-center shadow-sm">
            <p className="text-2xl font-bold">
              <GradientText>{profile.total_quickwins}</GradientText>
            </p>
            <p className="text-xs text-muted-foreground mt-1">Quick Wins</p>
          </div>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
