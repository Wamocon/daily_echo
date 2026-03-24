'use client';

import { Mood } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: 1, emoji: '😔', label: 'Sehr niedrig' },
  { value: 2, emoji: '😕', label: 'Niedrig' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '🙂', label: 'Gut' },
  { value: 5, emoji: '😄', label: 'Sehr gut' },
];

interface MoodPickerProps {
  selected: Mood | null;
  onChange: (mood: Mood) => void;
}

export function MoodPicker({ selected, onChange }: MoodPickerProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-muted-foreground">Wie fühlst du dich gerade?</p>
      <div className="flex gap-3 sm:gap-4">
        {MOODS.map((m) => (
          <motion.button
            key={m.value}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(m.value)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-2xl p-3 transition-colors border-2',
              selected === m.value
                ? 'border-primary bg-primary/10'
                : 'border-transparent hover:border-muted hover:bg-muted/50'
            )}
          >
            <span className="text-3xl sm:text-4xl">{m.emoji}</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
              {m.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
