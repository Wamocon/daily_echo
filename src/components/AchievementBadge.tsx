'use client';

import { Achievement } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  newlyUnlocked?: boolean;
}

export function AchievementBadge({ achievement, unlocked, newlyUnlocked }: AchievementBadgeProps) {
  return (
    <motion.div
      initial={newlyUnlocked ? { scale: 0.5, opacity: 0 } : false}
      animate={newlyUnlocked ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className={cn(
        'flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all',
        unlocked
          ? 'border-primary/40 bg-primary/5'
          : 'border-muted bg-muted/30 opacity-40'
      )}
    >
      <span className={cn('text-3xl', !unlocked && 'grayscale')}>{achievement.emoji}</span>
      <span className="text-xs font-semibold text-center leading-tight">{achievement.label}</span>
      <span className="text-[10px] text-muted-foreground text-center leading-tight">
        {achievement.description}
      </span>
    </motion.div>
  );
}
