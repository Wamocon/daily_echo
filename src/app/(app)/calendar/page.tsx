'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sun, Moon, Zap, BookOpen, Save } from 'lucide-react';
import { DailyEntry } from '@/types';
import { getAllEntries, getEntryByDate, saveJournal, createEmptyEntry } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MOOD_EMOJI: Record<number, string> = { 1: '😔', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' };
const MOOD_COLOR: Record<number, string> = {
  1: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  2: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  3: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  4: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  5: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
};

function toISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  // Fill leading empty days (Mon-aligned)
  const startDay = (first.getDay() + 6) % 7; // 0=Mon
  for (let i = 0; i < startDay; i++) days.push(null as unknown as Date);
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  return days;
}

export default function CalendarPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [entries, setEntries] = useState<Record<string, DailyEntry>>({});
  const [selectedDate, setSelectedDate] = useState<string>(toISO(today));
  const [selectedEntry, setSelectedEntry] = useState<DailyEntry | null>(null);
  const [journalText, setJournalText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const all = getAllEntries();
    const map: Record<string, DailyEntry> = {};
    all.forEach((e) => { map[e.entry_date] = e; });
    setEntries(map);
  }, [selectedDate]);

  useEffect(() => {
    const entry = entries[selectedDate] ?? null;
    setSelectedEntry(entry);
    setJournalText(entry?.journal_text ?? '');
    setSaved(false);
  }, [selectedDate, entries]);

  const handleSaveJournal = useCallback(async () => {
    setIsSaving(true);
    saveJournal(selectedDate, journalText);
    // Refresh entry
    const updated = getEntryByDate(selectedDate) ?? createEmptyEntry(selectedDate);
    updated.journal_text = journalText;
    setEntries((prev) => ({ ...prev, [selectedDate]: updated }));
    setSelectedEntry(updated);
    await new Promise((r) => setTimeout(r, 400));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [selectedDate, journalText]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const days = getDaysInMonth(viewYear, viewMonth);
  const monthName = new Date(viewYear, viewMonth).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  const todayISO = toISO(today);
  const selectedFormatted = new Date(selectedDate + 'T12:00:00').toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="min-h-screen px-4 pt-8 pb-32 lg:pb-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold">Kalender & Journal</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ─── Calendar ─── */}
          <div className="lg:w-96 shrink-0">
            <div className="bg-card border rounded-2xl p-4 shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-sm capitalize">{monthName}</span>
                <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((d) => (
                  <div key={d} className="text-center text-[11px] font-medium text-muted-foreground py-1">{d}</div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-y-1">
                {days.map((day, i) => {
                  if (!day) return <div key={`empty-${i}`} />;
                  const iso = toISO(day);
                  const entry = entries[iso];
                  const isToday = iso === todayISO;
                  const isSelected = iso === selectedDate;
                  const mood = entry?.evening_mood ?? entry?.morning_mood;

                  return (
                    <button
                      key={iso}
                      onClick={() => setSelectedDate(iso)}
                      className={cn(
                        'relative flex flex-col items-center justify-center h-9 w-full rounded-lg text-sm transition-all duration-150',
                        isSelected && 'ring-2 ring-primary ring-offset-1 ring-offset-background',
                        isToday && !isSelected && 'font-bold text-primary',
                        !isSelected && !isToday && 'hover:bg-accent',
                        mood && !isSelected ? MOOD_COLOR[mood] : '',
                        isSelected ? 'bg-primary text-primary-foreground' : ''
                      )}
                    >
                      <span>{day.getDate()}</span>
                      {entry && (entry.morning_done || entry.evening_done) && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current opacity-60" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border">
                {[1, 2, 3, 4, 5].map((m) => (
                  <span key={m} className={cn('text-xs px-2 py-0.5 rounded-full font-medium', MOOD_COLOR[m])}>
                    {MOOD_EMOJI[m]} {m === 1 ? 'Schlecht' : m === 3 ? 'Neutral' : m === 5 ? 'Super' : ''}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Detail + Journal ─── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDate}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col gap-4"
            >
              <h2 className="text-sm font-semibold text-muted-foreground capitalize">{selectedFormatted}</h2>

              {/* Mood Summary */}
              {selectedEntry && (selectedEntry.morning_done || selectedEntry.evening_done) ? (
                <div className="bg-card border rounded-2xl p-4 flex gap-4 shadow-sm">
                  {selectedEntry.morning_mood && (
                    <div className="flex items-center gap-2 text-sm">
                      <Sun className="w-4 h-4 text-yellow-500" />
                      <span className="text-lg">{MOOD_EMOJI[selectedEntry.morning_mood]}</span>
                      <span className="text-muted-foreground text-xs">Morgen</span>
                    </div>
                  )}
                  {selectedEntry.evening_mood && (
                    <div className="flex items-center gap-2 text-sm">
                      <Moon className="w-4 h-4 text-indigo-500" />
                      <span className="text-lg">{MOOD_EMOJI[selectedEntry.evening_mood]}</span>
                      <span className="text-muted-foreground text-xs">Abend</span>
                    </div>
                  )}
                  {selectedEntry.has_quickwin && (
                    <div className="ml-auto flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                      <Zap className="w-3.5 h-3.5" />
                      Quick Win
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-muted/50 border border-dashed rounded-2xl p-4 text-center text-sm text-muted-foreground">
                  Kein Check-in für diesen Tag
                </div>
              )}

              {/* Quick Win Text */}
              {selectedEntry?.quickwin_text && (
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Quick Win</span>
                  </div>
                  <p className="text-sm">{selectedEntry.quickwin_text}</p>
                </div>
              )}

              {/* Journal */}
              <div className="bg-card border rounded-2xl p-4 shadow-sm flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">Journal</span>
                </div>
                <textarea
                  value={journalText}
                  onChange={(e) => { setJournalText(e.target.value); setSaved(false); }}
                  placeholder="Schreibe hier deine Gedanken, Reflexionen oder Notizen für diesen Tag…"
                  className="flex-1 min-h-[200px] lg:min-h-[300px] w-full resize-none bg-muted/40 rounded-xl border border-border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
                <Button
                  onClick={handleSaveJournal}
                  disabled={isSaving}
                  size="sm"
                  className="self-end gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSaving ? 'Speichern…' : saved ? '✓ Gespeichert' : 'Speichern'}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
