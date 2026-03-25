'use client';

import { getAllEntries, getOnThisDay } from '@/lib/storage';
import { DailyEntry } from '@/types';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Calendar, Zap, Sun, Moon } from 'lucide-react';

const MOOD_EMOJI: Record<number, string> = { 1: '😔', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' };

function EntryCard({ entry }: { entry: DailyEntry }) {
  const date = new Date(entry.entry_date);
  const formatted = date.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="bg-card rounded-2xl border p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{formatted}</span>
        <div className="flex gap-2 text-xs">
          {entry.morning_done && <span className="flex items-center gap-0.5"><Sun className="w-3 h-3 text-yellow-500" /> {entry.morning_mood ? MOOD_EMOJI[entry.morning_mood] : ''}</span>}
          {entry.evening_done && <span className="flex items-center gap-0.5"><Moon className="w-3 h-3 text-indigo-500" /> {entry.evening_mood ? MOOD_EMOJI[entry.evening_mood] : ''}</span>}
        </div>
      </div>
      {entry.has_quickwin && entry.quickwin_text && (
        <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950 rounded-xl px-3 py-2">
          <Zap className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs">{entry.quickwin_text}</p>
        </div>
      )}
      {entry.evening_answers && (
        <p className="text-xs text-muted-foreground line-clamp-2">{entry.evening_answers[2]}</p>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [onThisDay, setOnThisDay] = useState<DailyEntry[]>([]);

  useEffect(() => {
    const all = getAllEntries().sort(
      (a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
    );
    setEntries(all);
    setOnThisDay(getOnThisDay());
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Verlauf</h1>

        {onThisDay.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Heute vor einem Jahr
            </h2>
            {onThisDay.map((e) => <EntryCard key={e.id} entry={e} />)}
          </div>
        )}

        {entries.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-4xl mb-3">📓</p>
            <p>Noch keine Einträge. Starte deinen ersten Check-in!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-muted-foreground">Alle Einträge</h2>
            {entries.map((e) => <EntryCard key={e.id} entry={e} />)}
          </div>
        )}
      </div>
    </div>
  );
}
