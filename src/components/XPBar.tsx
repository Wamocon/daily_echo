'use client';

import { motion } from 'framer-motion';
import { getLevelProgress, getLevelTitle, getNextLevelXP } from '@/lib/xp';

interface XPBarProps {
  xp: number;
  level: number;
}

export default function XPBar({ xp, level }: XPBarProps) {
  const progress = getLevelProgress(xp);
  const title = getLevelTitle(level);
  const nextInfo = getNextLevelXP(xp);

  return (
    <div className="w-full px-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-violet-400 tracking-wide uppercase">
          Lv.{level} · {title}
        </span>
        <span className="text-xs text-muted-foreground">
          {nextInfo ? `${nextInfo.current} / ${nextInfo.next} XP` : '✨ Max Level'}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
