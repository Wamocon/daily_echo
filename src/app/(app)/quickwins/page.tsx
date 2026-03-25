'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Plus, Trash2, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { QuickWin } from '@/types';
import { getAllQuickWins, addQuickWin, deleteQuickWin, getQuickWinsForWeek } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

function getISOWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function getWeekLabel(week: string): string {
  const [year, w] = week.split('-W').map(Number);
  // First thursday of year method → week start
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = (jan4.getDay() + 6) % 7;
  const weekStart = new Date(jan4);
  weekStart.setDate(jan4.getDate() - dayOfWeek + (w - 1) * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
  return `KW ${w} · ${fmt(weekStart)} – ${fmt(weekEnd)}`;
}

function toISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function QuickWinsPage() {
  const today = new Date();
  const { profile } = useAppStore();
  const [currentWeek, setCurrentWeek] = useState(getISOWeek(today));
  const [weekWins, setWeekWins] = useState<QuickWin[]>([]);
  const [allByWeek, setAllByWeek] = useState<Record<string, QuickWin[]>>({});
  const [newText, setNewText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const GOAL = profile.weekly_quickwin_target ?? 2;

  const loadData = () => {
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

  const handleAdd = async () => {
    if (!newText.trim()) return;
    setIsAdding(true);
    addQuickWin(newText.trim(), toISO(today));
    setNewText('');
    loadData();
    await new Promise((r) => setTimeout(r, 300));
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    deleteQuickWin(id);
    loadData();
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

  const todayWeek = getISOWeek(today);
  const progress = Math.min(weekWins.length, GOAL);
  const progressPct = (progress / GOAL) * 100;
  const sortedWeeks = Object.keys(allByWeek).sort((a, b) => b.localeCompare(a));

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-none">Quick Wins</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{GOAL} pro Woche — halte deine Erfolge fest</p>
          </div>
        </div>

        {/* Week Navigator */}
        <div className="bg-card border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
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
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{weekWins.length} von {GOAL} Quick Wins</span>
              {weekWins.length >= GOAL && (
                <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> Wochenziel erreicht!
                </span>
              )}
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Add new (only current week) */}
        {currentWeek === todayWeek && (
          <div className="bg-card border rounded-2xl p-4 shadow-sm flex gap-2">
            <input
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Quick Win beschreiben…"
              className="flex-1 bg-muted/50 rounded-xl border border-border px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
            <Button
              onClick={handleAdd}
              disabled={!newText.trim() || isAdding}
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Hinzufügen
            </Button>
          </div>
        )}

        {/* Wins List */}
        <AnimatePresence>
          {weekWins.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 text-muted-foreground"
            >
              <p className="text-3xl mb-2">⚡</p>
              <p className="text-sm">Noch keine Quick Wins diese Woche.</p>
              {currentWeek === todayWeek && (
                <p className="text-xs mt-1">Was hast du heute erreicht?</p>
              )}
            </motion.div>
          ) : (
            <div className="flex flex-col gap-2">
              {weekWins.map((win, i) => (
                <motion.div
                  key={win.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
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

        {/* History by week */}
        {sortedWeeks.filter(w => w !== currentWeek).slice(0, 8).length > 0 && (
          <div className="mt-2">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">Frühere Wochen</h2>
            <div className="flex flex-col gap-2">
              {sortedWeeks.filter(w => w !== currentWeek).slice(0, 8).map((week) => {
                const wins = allByWeek[week];
                return (
                  <button
                    key={week}
                    onClick={() => setCurrentWeek(week)}
                    className="bg-card border rounded-xl px-4 py-2.5 flex items-center justify-between text-sm hover:bg-accent transition-colors text-left"
                  >
                    <span className="text-muted-foreground">{getWeekLabel(week)}</span>
                    <span className={cn(
                      'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                      wins.length >= GOAL
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-muted text-muted-foreground'
                    )}>
                      <Zap className="w-3 h-3" />
                      {wins.length}/{GOAL}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
