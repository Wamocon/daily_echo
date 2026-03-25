'use client';

import { Mood } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const MOODS: { value: Mood; emoji: string; label: string; color: string }[] = [
  { value: 1, emoji: '😔', label: 'Erschöpft', color: 'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-900/50' },
  { value: 2, emoji: '😕', label: 'Gestresst', color: 'bg-orange-100 hover:bg-orange-200 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border-orange-200 dark:border-orange-900/50' },
  { value: 3, emoji: '😐', label: 'Okay', color: 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300 border-slate-200 dark:border-slate-800/50' },
  { value: 4, emoji: '🙂', label: 'Gut', color: 'bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-900/50' },
  { value: 5, emoji: '😄', label: 'Klasse', color: 'bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200 dark:border-green-900/50' },
];

interface MoodPickerProps {
  selected: Mood | null;
  onChange: (mood: Mood) => void;
}

export function MoodPicker({ selected, onChange }: MoodPickerProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-base text-muted-foreground font-medium">Dein Energielevel heute?</p>
      <div className="flex gap-2 sm:gap-3">
        {MOODS.map((m) => {
          const isSelected = selected === m.value;
          return (
            <motion.button
              key={m.value}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(m.value)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-3xl p-3 sm:p-4 transition-all duration-300 border-2 w-[72px] sm:w-[84px] shadow-sm',
                isSelected 
                  ? `${m.color} ring-4 ring-primary/20 scale-105 shadow-md` 
                  : 'bg-card border-border/40 hover:border-border hover:shadow'
              )}
            >
              <span className={cn("text-3xl sm:text-4xl transition-transform duration-300", isSelected && "scale-110 drop-shadow-sm")}>
                {m.emoji}
              </span>
              <span className={cn(
                "text-[10px] sm:text-[11px] font-semibold tracking-wide",
                isSelected ? "opacity-100" : "text-muted-foreground opacity-70"
              )}>
                {m.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  );
}
