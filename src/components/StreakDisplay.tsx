'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { GradientText } from '@/components/ui/gradient-text';
import { canUseFreeze } from '@/lib/streaks';
import { Flame, Snowflake, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export function StreakDisplay() {
  const { profile, useStreakFreeze } = useAppStore();
  const [showFreeze, setShowFreeze] = useState(false);
  const canFreeze = canUseFreeze(profile);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Flame className="w-6 h-6 text-orange-500 shrink-0" />
        <motion.span
          key={profile.streak}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="text-4xl font-bold leading-none"
        >
          <GradientText>{profile.streak}</GradientText>
        </motion.span>
        <div className="flex flex-col">
          <span className="text-sm font-medium leading-none">Tage Streak</span>
          <span className="text-xs text-muted-foreground mt-0.5">Längster: {profile.longest_streak}</span>
        </div>
        {/* Freeze-Info versteckt hinter Info-Icon */}
        <button
          onClick={() => setShowFreeze((v) => !v)}
          className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Streak Freeze Info"
        >
          <Snowflake className={`w-4 h-4 ${canFreeze ? 'text-blue-400' : 'text-muted-foreground/40'}`} />
        </button>
      </div>

      {/* Freeze-Panel — nur wenn aufgeklappt */}
      {showFreeze && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-1 rounded-xl border bg-muted/40 px-3 py-2 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="w-3 h-3 shrink-0" />
            {canFreeze
              ? 'Streak Freeze schützt deinen Streak für einen verpassten Tag.'
              : 'Freeze diese Woche bereits verwendet.'}
          </div>
          {canFreeze && (
            <button
              onClick={() => { useStreakFreeze(); setShowFreeze(false); }}
              className="text-xs text-blue-500 hover:text-blue-600 font-medium whitespace-nowrap"
            >
              Aktivieren
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
