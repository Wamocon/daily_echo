'use client';

import { useAppStore } from '@/store/useAppStore';
import { GradientText } from '@/components/ui/gradient-text';
import { canUseFreeze } from '@/lib/streaks';
import { Button } from '@/components/ui/button';
import { Flame, Snowflake } from 'lucide-react';
import { motion } from 'framer-motion';

export function StreakDisplay() {
  const { profile, useStreakFreeze } = useAppStore();

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <Flame className="w-6 h-6 text-orange-500" />
        <motion.span
          key={profile.streak}
          initial={{ scale: 1.4 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="text-4xl font-bold"
        >
          <GradientText>{profile.streak}</GradientText>
        </motion.span>
        <span className="text-sm text-muted-foreground">Tage</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Längster Streak: {profile.longest_streak} Tage
      </p>
      {canUseFreeze(profile) ? (
        <Button
          variant="outline"
          size="sm"
          className="mt-1 text-xs gap-1"
          onClick={useStreakFreeze}
        >
          <Snowflake className="w-3 h-3 text-blue-400" />
          Streak Freeze nutzen
        </Button>
      ) : (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Snowflake className="w-3 h-3 text-blue-300" />
          Freeze diese Woche genutzt
        </p>
      )}
    </div>
  );
}
