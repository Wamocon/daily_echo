'use client';

import { Achievement } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  newlyUnlocked?: boolean;
  progress?: { current: number; max: number } | null;
}

export function AchievementBadge({ achievement, unlocked, newlyUnlocked, progress }: AchievementBadgeProps) {
  const showProgress = !unlocked && progress && progress.max > 0;
  const pct = showProgress ? Math.min((progress.current / progress.max) * 100, 100) : 0;

  return (
    <motion.div
      initial={newlyUnlocked ? { scale: 0.5, opacity: 0 } : false}
      animate={newlyUnlocked ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className={cn(
        'flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all',
        unlocked
          ? 'border-primary/40 bg-primary/5'
          : 'border-muted bg-muted/30'
      )}
    >
      <span className={cn('text-3xl', !unlocked && 'grayscale opacity-50')}>{achievement.emoji}</span>
      <span className={cn('text-xs font-semibold text-center leading-tight', !unlocked && 'text-muted-foreground')}>
        {achievement.label}
      </span>
      <span className="text-[10px] text-muted-foreground text-center leading-tight">
        {achievement.description}
      </span>
      {/* Fortschrittsbalken für locked Badges */}
      {showProgress && (
        <div className="w-full mt-1">
          <div className="w-full bg-muted rounded-full h-1">
            <div
              className="bg-primary h-1 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[9px] text-muted-foreground text-center mt-0.5">
            {progress.current}/{progress.max}
          </p>
        </div>
      )}
    </motion.div>
  );
}
