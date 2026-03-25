'use client';

import { getAllEntries, getOnThisDay, getAllQuickWins, deleteQuickWin, addQuickWin } from '@/lib/storage';
import { DailyEntry, QuickWin } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Calendar, Zap, Sun, Moon, Trash2, Trophy, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const MOOD_EMOJI: Record<number, string> = { 1: '😔', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' };

function getISOWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function getWeekLabel(week: string): string {
  const [year, w] = week.split('-W').map(Number);
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = (jan4.getDay() + 6) % 7;
  const weekStart = new Date(jan4);
  weekStart.setDate(jan4.getDate() - dayOfWeek + (w - 1) * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
  return `KW ${w} · ${fmt(weekStart)} – ${fmt(weekEnd)}`;
}

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
  const today = new Date();
  const { profile, init } = useAppStore();
  const GOAL = profile.weekly_quickwin_target ?? 2;
  const todayWeek = getISOWeek(today);

  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [onThisDay, setOnThisDay] = useState<DailyEntry[]>([]);
  const [currentWeek, setCurrentWeek] = useState(todayWeek);
  const [allByWeek, setAllByWeek] = useState<Record<string, QuickWin[]>>({});
  const [weekWins, setWeekWins] = useState<QuickWin[]>([]);
  const [newText, setNewText] = useState('');

  const loadData = () => {
    const all = getAllEntries().sort(
      (a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
    );
    setEntries(all);
    setOnThisDay(getOnThisDay());
    const wins = getAllQuickWins();
    const byWeek: Record<string, QuickWin[]> = {};
    wins.forEach((w) => {
      if (!byWeek[w.week]) byWeek[w.week] = [];
      byWeek[w.week].push(w);
    });
    setAllByWeek(byWeek);
    setWeekWins(byWeek[currentWeek] ?? []);
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { setWeekWins(allByWeek[currentWeek] ?? []); }, [currentWeek, allByWeek]);

  const handleAdd = () => {
    if (!newText.trim()) return;
    addQuickWin(newText.trim(), today.toISOString().split('T')[0]);
    setNewText('');
    loadData();
    init();
  };

  const handleDelete = (id: string) => {
    deleteQuickWin(id);
    loadData();
    init();
  };

  const navigateWeek = (direction: -1 | 1) => {
    const [year, w] = currentWeek.split('-W').map(Number);
    const jan4 = new Date(year, 0, 4);
    const dayOfWeek = (jan4.getDay() + 6) % 7;
    const weekStart = new Date(jan4);
    weekStart.setDate(jan4.getDate() - dayOfWeek + (w - 1) * 7);
    weekStart.setDate(weekStart.getDate() + direction * 7);
    setCurrentWeek(getISOWeek(weekStart));
  };

  const progress = Math.min(weekWins.length, GOAL);
  const progressPct = GOAL > 0 ? (progress / GOAL) * 100 : 0;
  const sortedWeeks = Object.keys(allByWeek).sort((a, b) => b.localeCompare(a));

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col gap-8">

        {/* ── Quick Wins Sektion ── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-none">Quick Wins</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{GOAL} pro Woche — halte deine Erfolge fest</p>
            </div>
          </div>

          {/* Week Nav */}
          <div className="bg-card rounded-[2rem] border border-border/40 p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <button onClick={() => navigateWeek(-1)} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-center">
                <p className="text-sm font-semibold">{getWeekLabel(currentWeek)}</p>
                {currentWeek === todayWeek && (
                  <span className="text-[10px] text-primary font-medium">Aktuelle Woche</span>
                )}
              </div>
              <button
                onClick={() => navigateWeek(1)}
                disabled={currentWeek === todayWeek}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{weekWins.length} von {GOAL} Quick Wins</span>
                {weekWins.length >= GOAL && (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> Wochenziel erreicht!
                  </span>
                )}
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Add input (current week only) */}
          {currentWeek === todayWeek && (
            <div className="bg-card rounded-[2rem] border border-border/40 p-4 shadow-sm flex gap-2">
              <input
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Quick Win beschreiben…"
                className="flex-1 bg-muted/50 rounded-xl border border-border px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
              <button
                onClick={handleAdd}
                disabled={!newText.trim()}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 shrink-0"
              >
                <Plus className="w-4 h-4" /> Hinzufügen
              </button>
            </div>
          )}

          {/* Wins list */}
          <AnimatePresence>
            {weekWins.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                <p className="text-2xl mb-2">⚡</p>
                Noch keine Quick Wins diese Woche.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {weekWins.map((win, i) => (
                  <motion.div
                    key={win.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-card border rounded-2xl px-4 py-3 flex items-start gap-3 shadow-sm group"
                  >
                    <Zap className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{win.text}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {new Date(win.date + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(win.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Older weeks */}
          {sortedWeeks.filter(w => w !== currentWeek).slice(0, 6).length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Frühere Wochen</h3>
              <div className="flex flex-col gap-2">
                {sortedWeeks.filter(w => w !== currentWeek).slice(0, 6).map((week) => (
                  <button
                    key={week}
                    onClick={() => setCurrentWeek(week)}
                    className="bg-card border rounded-xl px-4 py-2.5 flex items-center justify-between text-sm hover:bg-accent transition-colors text-left"
                  >
                    <span className="text-muted-foreground">{getWeekLabel(week)}</span>
                    <span className={cn(
                      'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                      allByWeek[week].length >= GOAL
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-muted text-muted-foreground'
                    )}>
                      <Zap className="w-3 h-3" />
                      {allByWeek[week].length}/{GOAL}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Einträge Sektion ── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold">Verlauf</h2>
          </div>

          {onThisDay.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                Heute vor einem Jahr
              </h3>
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
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Alle Einträge</h3>
              {entries.map((e) => <EntryCard key={e.id} entry={e} />)}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
