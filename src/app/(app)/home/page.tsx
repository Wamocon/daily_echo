'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import XPBar from '@/components/XPBar';
import LevelUpModal from '@/components/LevelUpModal';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PenLine, Sun, Moon, ChevronRight, CheckCircle2, PanelRightClose, PanelRightOpen, Sparkles, X, Zap, Plus, HelpCircle } from 'lucide-react';
import { QuickActionsSidebar } from '@/components/QuickActionsSidebar';
import { DashboardMoodChart } from '@/components/DashboardMoodChart';
import { DashboardCalendar } from '@/components/DashboardCalendar';
import { motion, AnimatePresence } from 'framer-motion';
import { addQuickWin } from '@/lib/storage';

const MOOD_EMOJI: Record<number, string> = { 1: '😔', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' };

export default function DashboardPage() {
  const { profile, todayEntry, isInitialized, weeklyGoal, init } = useAppStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [qwInput, setQwInput] = useState('');
  const [qwExpanded, setQwExpanded] = useState(false);
  const [qwGuided, setQwGuided] = useState(false);
  const [qwQuestionIdx, setQwQuestionIdx] = useState(0);

  const QW_QUESTIONS = [
    { q: 'Hast du heute eine Aufgabe abgeschlossen, die du schon länger vor dir hergeschoben hast?', icon: '📋' },
    { q: 'Hast du heute jemandem geholfen oder etwas für andere getan?', icon: '🤝' },
    { q: 'Hast du heute etwas Neues gelernt oder eine neue Idee gehabt?', icon: '💡' },
    { q: 'Hast du heute etwas für deine Gesundheit, Energie oder dein Wohlbefinden getan?', icon: '💪' },
    { q: 'Gab es heute einen Moment, auf den du stolz sein kannst – egal wie klein?', icon: '🌟' },
  ];

  const morningDone = todayEntry?.morning_done ?? false;
  const eveningDone = todayEntry?.evening_done ?? false;
  const allDone = morningDone && eveningDone;
  const hour = new Date().getHours();

  // Tageszeit-adaptiv: was ist jetzt die relevante Aktion?
  const primaryMode = !morningDone ? 'morning' : 'evening';
  const isMorningTime = hour >= 5 && hour < 12;
  const isEveningTime = hour >= 17;
  const nextCheckinLabel = primaryMode === 'morning'
    ? '🌅 Morgen-Check-in starten'
    : '🌙 Abend-Check-in starten';

  // Red dot for FAB: show when intervention is available
  const recentMood = (hour >= 5 && hour < 12 ? todayEntry?.morning_mood : todayEntry?.evening_mood) ?? null;
  const hasIntervention = recentMood !== null && recentMood <= 3 && !todayEntry?.intervention_done;

  if (!isInitialized) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <p className="text-muted-foreground animate-pulse">Laden...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <LevelUpModal />
      
      {/* Mobile Begrüßung */}
      <div className="lg:hidden mb-6 px-1">
        <h1 className="text-2xl font-bold">
          {isMorningTime ? 'Guten Morgen' : isEveningTime ? 'Guten Abend' : 'Hallo'}
          {profile.onboarding_name ? `, ${profile.onboarding_name}` : profile.display_name ? `, ${profile.display_name}` : ''}! 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        {profile.onboarding_goal && (
          <p className="text-xs text-primary/70 mt-1.5 font-medium">
            🎯 Dein Ziel: {profile.onboarding_goal}
          </p>
        )}
      </div>

      {/* DASHBOARD LAYOUT & SIDEBAR */}
      <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
        
        {/* BENTO GRID (Main Content) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 w-full lg:flex-1">

          {/* --- 1. Haupt-CTA (Hero) --- */}
        <div className="col-span-1 md:col-span-12 lg:col-span-7 bg-card rounded-[2rem] p-6 lg:p-8 shadow-sm border border-border/40 flex flex-col justify-center relative overflow-hidden group hover:border-primary/20 transition-all">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500 pointer-events-none" />
          
          <h2 className="text-xl font-bold mb-2 z-10">Tägliche Reflexion</h2>
          <p className="text-sm text-muted-foreground mb-6 z-10 max-w-sm">
            Nimm dir einen kurzen Moment für dich. Checke ein und sammle kleine Erfolge für deinen Tag.
          </p>
          
          <div className="z-10 mt-auto">
            {!allDone ? (
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full gap-3 h-14 px-8 text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                onClick={() => router.push(`/checkin?mode=${primaryMode}`)}
              >
                <PenLine className="w-5 h-5" />
                {nextCheckinLabel}
                <ChevronRight className="w-4 h-4 ml-2 opacity-50" />
              </Button>
            ) : (
              <div className="rounded-2xl border border-green-300/50 dark:border-green-700/50 bg-green-50/50 dark:bg-green-950/30 px-5 py-4 flex items-center gap-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <div>
                  <p className="font-semibold text-sm text-green-800 dark:text-green-200">Alles erledigt für heute!</p>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">Bis morgen früh 👋</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- 2. Fortschritt (XP + Tages-Goals + Quick Wins) --- */}
        <div className="col-span-1 md:col-span-12 lg:col-span-5 bg-card rounded-[2rem] p-6 shadow-sm border border-border/40 flex flex-col justify-center gap-4 hover:border-primary/20 transition-all">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Dein Fortschritt</h3>

          {/* XP Bar */}
          <div className="bg-accent/30 rounded-2xl p-4">
            <XPBar xp={profile.xp ?? 0} level={profile.level ?? 1} />
          </div>

          {/* Daily goal rows */}
          <div className="flex flex-col gap-2">
            {/* Morgen Check-in */}
            <div className="flex items-center gap-3">
              <Sun className={`w-4 h-4 shrink-0 ${morningDone ? 'text-green-500' : 'text-muted-foreground/50'}`} />
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full transition-all ${morningDone ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.7)]' : 'bg-muted-foreground/20'}`}
                  animate={{ width: morningDone ? '100%' : '0%' }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-16 text-right">Morgen</span>
              <motion.span
                animate={morningDone ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0.4 }}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${
                  morningDone
                    ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40'
                    : 'text-muted-foreground bg-muted'
                }`}
              >
                +20 XP
              </motion.span>
            </div>

            {/* Abend Check-in */}
            <div className="flex items-center gap-3">
              <Moon className={`w-4 h-4 shrink-0 ${eveningDone ? 'text-indigo-400' : 'text-muted-foreground/50'}`} />
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full transition-all ${eveningDone ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.7)]' : 'bg-muted-foreground/20'}`}
                  animate={{ width: eveningDone ? '100%' : '0%' }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-16 text-right">Abend</span>
              <motion.span
                animate={eveningDone ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0.4 }}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${
                  eveningDone
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40'
                    : 'text-muted-foreground bg-muted'
                }`}
              >
                +20 XP
              </motion.span>
            </div>

            {/* Bonus: Beide am selben Tag */}
            {allDone && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <span className="text-sm">☯️</span>
                <div className="flex-1 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]" />
                <span className="text-xs text-muted-foreground w-16 text-right">Bonus</span>
                <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-1.5 py-0.5 rounded-full">
                  +{15}
                </span>
              </motion.div>
            )}

            {/* Quick Win Wochenziel */}
            <div className="flex items-center gap-3 pt-2 border-t border-border/40">
              <Zap className={`w-4 h-4 shrink-0 ${weeklyGoal.quickwins >= weeklyGoal.quickwinGoal ? 'text-amber-500' : 'text-muted-foreground/50'}`} />
              <div className="flex-1 flex items-center gap-1">
                {Array.from({ length: Math.max(weeklyGoal.quickwinGoal, 1) }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      i < weeklyGoal.quickwins
                        ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground w-16 text-right">Quick Wins</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                weeklyGoal.quickwins >= weeklyGoal.quickwinGoal
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40'
                  : 'text-muted-foreground bg-muted'
              }`}>
                {weeklyGoal.quickwins}/{weeklyGoal.quickwinGoal}
              </span>
            </div>

            {/* Inline Quick Win erfassen — jetzt in Rhythmus-Kachel */}
          </div>
        </div>

        {/* --- 5. Rhythmus-Kachel: MorningEcho/NightEcho + Intention + Quick Win --- */}
        <div className="col-span-1 md:col-span-12 lg:col-span-8 bg-card rounded-[2rem] p-6 shadow-sm border border-border/40 flex flex-col gap-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Dein Rhythmus</h3>

          {/* Check-in Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => !morningDone && router.push('/checkin?mode=morning')}
              className={`rounded-2xl p-5 border flex items-center gap-4 transition-all text-left group ${
                morningDone
                  ? 'bg-green-50/50 dark:bg-green-950/20 border-border/40 cursor-default'
                  : 'bg-background hover:bg-muted/50 border-border/40 hover:border-primary/40 cursor-pointer shadow-sm hover:shadow-md'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all text-xl ${morningDone ? 'bg-green-100 dark:bg-green-900/50' : 'bg-yellow-100 dark:bg-yellow-900/40 group-hover:scale-110'}`}>
                {morningDone && todayEntry?.morning_mood
                  ? MOOD_EMOJI[todayEntry.morning_mood]
                  : <Sun className={`w-6 h-6 ${morningDone ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold">MorningEcho</h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                  {morningDone ? 'Erledigt ✓' : 'Morgen-Reflexion'}
                </p>
              </div>
            </button>

            <button
              onClick={() => !eveningDone && router.push('/checkin?mode=evening')}
              className={`rounded-2xl p-5 border flex items-center gap-4 transition-all text-left group ${
                eveningDone
                  ? 'bg-green-50/50 dark:bg-green-950/20 border-border/40 cursor-default'
                  : morningDone
                    ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200/50 dark:border-indigo-800/40 hover:border-indigo-400/60 cursor-pointer shadow-sm hover:shadow-md'
                    : 'bg-background hover:bg-muted/50 border-border/40 hover:border-primary/40 cursor-pointer shadow-sm hover:shadow-md'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${eveningDone ? 'bg-green-100 dark:bg-green-900/50' : 'bg-indigo-100 dark:bg-indigo-900/40 group-hover:scale-110'}`}>
                <Moon className={`w-6 h-6 ${eveningDone ? 'text-green-600 dark:text-green-400' : 'text-indigo-600 dark:text-indigo-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold">NightEcho</h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                  {eveningDone ? 'Erledigt ✓' : morningDone ? 'Jetzt starten →' : 'Abend-Reflexion'}
                </p>
              </div>
              {morningDone && !eveningDone && (
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 px-2 py-1 rounded-full shrink-0">
                  Bereit
                </span>
              )}
            </button>
          </div>

          {/* Heute Intention (falls vorhanden) */}
          {todayEntry?.morning_intention && (
            <div className="rounded-2xl bg-primary/5 border border-primary/15 px-4 py-3 flex items-start gap-3">
              <span className="text-base mt-0.5">🎯</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Deine heutige Intention</p>
                <p className="text-sm text-foreground/90 line-clamp-2">{todayEntry.morning_intention}</p>
              </div>
              {!eveningDone && (
                <button
                  onClick={() => router.push('/checkin?mode=evening')}
                  className="text-[10px] text-primary font-semibold whitespace-nowrap bg-primary/10 px-2 py-1 rounded-lg hover:bg-primary/20 transition-colors shrink-0"
                >
                  Wie lief&apos;s?
                </button>
              )}
            </div>
          )}

          {/* Quick Win — eigenständige Kachel */}
          <div className="rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 p-4">
            <AnimatePresence mode="wait">
              {/* Geführter Modus */}
              {qwExpanded && qwGuided ? (
                <motion.div key="qw-guided" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-semibold">Lass uns gemeinsam suchen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{qwQuestionIdx + 1} / {QW_QUESTIONS.length}</span>
                      <button onClick={() => { setQwGuided(false); setQwExpanded(false); setQwQuestionIdx(0); }} className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-amber-100 dark:bg-amber-900/40 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-amber-400 rounded-full" animate={{ width: `${((qwQuestionIdx + 1) / QW_QUESTIONS.length) * 100}%` }} transition={{ duration: 0.3 }} />
                  </div>
                  <div className="rounded-xl bg-white dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 p-4">
                    <span className="text-2xl block mb-2">{QW_QUESTIONS[qwQuestionIdx].icon}</span>
                    <p className="text-sm font-medium leading-relaxed">{QW_QUESTIONS[qwQuestionIdx].q}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const starters = ['Aufgabe endlich erledigt: ', 'Jemanden unterstützt: ', 'Neues gelernt: ', 'Für mich gesorgt: ', 'Kleiner Stolz-Moment: '];
                        setQwInput(starters[qwQuestionIdx]);
                        setQwGuided(false);
                        setQwQuestionIdx(0);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
                    >
                      Ja, das war&apos;s! ✓
                    </button>
                    <button
                      onClick={() => {
                        if (qwQuestionIdx < QW_QUESTIONS.length - 1) {
                          setQwQuestionIdx(i => i + 1);
                        } else {
                          setQwGuided(false);
                          setQwQuestionIdx(0);
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                    >
                      {qwQuestionIdx < QW_QUESTIONS.length - 1 ? 'Nächste →' : 'Selbst schreiben'}
                    </button>
                  </div>
                </motion.div>
              ) : qwExpanded ? (
                <motion.div
                  key="qw-input"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-semibold">Quick Win erfassen</span>
                    <span className="ml-auto text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full">+25 XP</span>
                  </div>
                  {/* Schnellauswahl-Prompts */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: '✅ Aufgabe erledigt', prompt: 'Aufgabe erfolgreich abgeschlossen: ' },
                      { label: '🤝 Jemanden unterstützt', prompt: 'Jemanden unterstützt: ' },
                      { label: '💪 Für mich gesorgt', prompt: 'Für mich gesorgt: ' },
                      { label: '💡 Problem gelöst', prompt: 'Problem gelöst: ' },
                    ].map(({ label, prompt }) => (
                      <button
                        key={label}
                        onClick={() => setQwInput(prev => prev ? prev : prompt)}
                        className="text-xs px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-800 bg-white dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      value={qwInput}
                      onChange={e => setQwInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && qwInput.trim()) {
                          addQuickWin(qwInput.trim(), new Date().toISOString().split('T')[0]);
                          init();
                          setQwInput('');
                          setQwExpanded(false);
                        }
                        if (e.key === 'Escape') setQwExpanded(false);
                      }}
                      placeholder="Beschreib deinen Erfolg kurz..."
                      className="flex-1 text-sm bg-background border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                    <button
                      onClick={() => {
                        if (qwInput.trim()) {
                          addQuickWin(qwInput.trim(), new Date().toISOString().split('T')[0]);
                          init();
                          setQwInput('');
                        }
                        setQwExpanded(false);
                      }}
                      className="text-sm bg-amber-500 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-amber-600 transition-colors"
                    >
                      ✓
                    </button>
                  </div>
                  {/* Geführter Modus Trigger */}
                  <button
                    onClick={() => { setQwGuided(true); setQwQuestionIdx(0); }}
                    className="text-xs text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-center flex items-center justify-center gap-1 w-full pt-1"
                  >
                    <HelpCircle className="w-3 h-3" />
                    Ich weiß nicht was ich erfassen soll – hilf mir
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="qw-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setQwExpanded(true)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-semibold text-foreground">Quick Win erfassen</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full">+25 XP</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    Was hast du heute erreicht? Selbst kleine Erfolge zählen.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {['✅ Aufgabe', '🤝 Geholfen', '💪 Für mich gesorgt', '💡 Idee'].map(chip => (
                      <span key={chip} className="text-[11px] px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 bg-white dark:bg-amber-950/40">
                        {chip}
                      </span>
                    ))}
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- 5. Dashboard Calendar --- */}
        <div className="col-span-1 md:col-span-6 lg:col-span-4 bg-card rounded-[2rem] p-6 lg:p-7 shadow-sm border border-border/40 hover:border-primary/20 transition-all flex flex-col justify-center">
          <DashboardCalendar />
        </div>

        {/* --- 5. Dashboard Chart Widget --- */}
        <div className="col-span-1 md:col-span-12 lg:col-span-12 bg-card rounded-[2rem] p-6 lg:p-7 shadow-sm border border-border/40 hover:border-primary/20 transition-all flex flex-col justify-center min-h-[300px]">
          <DashboardMoodChart />
        </div>

        </div>

        {/* Mobile FAB */}
        <button
          onClick={() => setSheetOpen(true)}
          className="lg:hidden fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          aria-label="Für dich öffnen"
        >
          <Sparkles className="w-6 h-6" />
          {hasIntervention && (
            <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-background" />
          )}
        </button>

        {/* Mobile Bottom Sheet */}
        {/* Backdrop — conditional is fine, holds no widget state */}
        <AnimatePresence>
          {sheetOpen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm"
              onClick={() => setSheetOpen(false)}
            />
          )}
        </AnimatePresence>
        {/* Sheet — always mounted so timer/video state is preserved */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: sheetOpen ? 0 : '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 38 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-background rounded-t-[2rem] shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-border/40">
            <span className="font-bold text-base">Für dich</span>
            <button
              onClick={() => setSheetOpen(false)}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          {/* Content */}
          <div className="px-5 pt-4 pb-10">
            <QuickActionsSidebar />
          </div>
        </motion.div>

      </div>

      {/* Desktop Fixed Right Panel — Tab Button */}
      <motion.button
        className="hidden lg:flex fixed top-[calc(50vh-2rem)] right-0 z-[41] w-9 h-16 rounded-l-xl bg-card border border-r-0 border-border/40 shadow-md items-center justify-center hover:bg-accent transition-colors"
        animate={{ x: sidebarOpen ? -320 : 0 }}
        initial={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
        onClick={() => setSidebarOpen(o => !o)}
        aria-label="Für dich öffnen"
      >
        {sidebarOpen
          ? <PanelRightClose className="w-4 h-4 text-muted-foreground" />
          : <PanelRightOpen className="w-4 h-4 text-muted-foreground" />}
      </motion.button>

      {/* Desktop Fixed Right Panel */}
      <motion.aside
        animate={{ x: sidebarOpen ? 0 : 320 }}
        initial={{ x: 320 }}
        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
        className="hidden lg:flex fixed right-0 top-20 h-[calc(100vh-5rem)] w-80 z-40 flex-col bg-card border-l border-border/60 shadow-xl"
      >
        <div className="flex items-center px-5 py-5 border-b border-border/40 shrink-0">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Für dich</span>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <QuickActionsSidebar />
        </div>
      </motion.aside>
    </div>
  );
}
