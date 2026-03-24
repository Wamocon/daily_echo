'use client';

import { Mood, CheckinContext, MoodSuggestion } from '@/types';
import { getSuggestions } from '@/lib/suggestions';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface MoodSuggestionsProps {
  mood: Mood;
  context: CheckinContext;
}

export function MoodSuggestions({ mood, context }: MoodSuggestionsProps) {
  const suggestions: MoodSuggestion[] = getSuggestions(mood, context);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${mood}-${context}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-2 w-full"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          Vorschläge für dich
        </div>
        {suggestions.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border bg-card px-4 py-3 shadow-sm"
          >
            <p className="text-sm font-semibold">{s.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
