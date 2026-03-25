'use client';

import { useAppStore } from '@/store/useAppStore';
import { getIntervention } from '@/lib/interventions';
import { Sparkles, CheckCheck, Wind, Timer, Music, Moon, Sun, X, RotateCcw, Play, Pause, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────
// POMODORO WIDGET
// ─────────────────────────────────────────────
function PomodoroWidget({ onClose }: { onClose: () => void }) {
  const WORK_SECS = 25 * 60;
  const BREAK_SECS = 5 * 60;

  const [phase, setPhase] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(WORK_SECS);
  const [isRunning, setIsRunning] = useState(false);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t > 1) return t - 1;
        setIsRunning(false);
        const next = phaseRef.current === 'work' ? 'break' : 'work';
        setPhase(next);
        return next === 'break' ? BREAK_SECS : WORK_SECS;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const reset = () => { setIsRunning(false); setTimeLeft(phase === 'work' ? WORK_SECS : BREAK_SECS); };

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');
  const total = phase === 'work' ? WORK_SECS : BREAK_SECS;
  const circumference = 2 * Math.PI * 44;
  const dashOffset = circumference * (1 - (total - timeLeft) / total);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-3xl border border-border/40 p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold">Pomodoro</span>
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full font-semibold',
            phase === 'work' ? 'bg-primary/10 text-primary' : 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'
          )}>
            {phase === 'work' ? 'Fokus' : 'Pause'}
          </span>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-accent transition-colors">
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex items-center justify-center my-4">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 -rotate-90 absolute inset-0" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" strokeWidth="5" className="stroke-muted/40" />
            <circle
              cx="50" cy="50" r="44" fill="none" strokeWidth="5" strokeLinecap="round"
              className={phase === 'work' ? 'stroke-primary' : 'stroke-green-500'}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span className="text-3xl font-black tabular-nums leading-none">{mm}:{ss}</span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              {phase === 'work' ? 'Fokuszeit' : 'Pause'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsRunning(r => !r)}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all',
            isRunning ? 'bg-muted text-foreground hover:bg-muted/80' : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
          )}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pausieren' : 'Starten'}
        </button>
        <button onClick={reset} className="w-11 h-11 flex items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors">
          <RotateCcw className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// BOX-BREATHING WIDGET
// ─────────────────────────────────────────────
const BREATH_PHASES = ['Einatmen', 'Halten', 'Ausatmen', 'Halten'];

function BreathingWidget({ onClose }: { onClose: () => void }) {
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setCountdown(c => {
        if (c > 1) return c - 1;
        setPhaseIdx(i => (i + 1) % 4);
        return 4;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  const isExpanded = phaseIdx === 0 || phaseIdx === 1;

  const stop = () => { setIsRunning(false); setPhaseIdx(0); setCountdown(4); };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-3xl border border-border/40 p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-teal-500" />
          <span className="text-sm font-bold">Box-Atmung</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400">4-4-4-4</span>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-accent transition-colors">
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex flex-col items-center py-4 gap-3">
        <div className="relative flex items-center justify-center w-32 h-32">
          {/* Glow ring */}
          {isRunning && (
            <div className={cn(
              'absolute inset-0 rounded-full blur-xl transition-all duration-1000',
              isExpanded ? 'bg-teal-400/30 scale-110' : 'bg-teal-400/10 scale-90'
            )} />
          )}
          <motion.div
            animate={{ scale: isRunning ? (isExpanded ? 1.35 : 1.0) : 1 }}
            transition={{ duration: 3.8, ease: 'easeInOut' }}
            className="w-24 h-24 rounded-full border-4 border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center shadow-inner relative z-10"
          >
            <span className="text-2xl font-black tabular-nums text-teal-600 dark:text-teal-400">
              {isRunning ? countdown : '🌬'}
            </span>
          </motion.div>
        </div>
        <p className="text-sm font-bold text-center text-foreground/80 h-5">
          {isRunning ? BREATH_PHASES[phaseIdx] : '4 Sekunden pro Phase'}
        </p>
        {isRunning && (
          <div className="flex gap-1.5 justify-center">
            {BREATH_PHASES.map((_, i) => (
              <div key={i} className={cn('w-2 h-2 rounded-full transition-colors', i === phaseIdx ? 'bg-teal-500' : 'bg-muted')} />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => isRunning ? stop() : setIsRunning(true)}
        className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-all"
      >
        {isRunning ? <><X className="w-4 h-4" /> Beenden</> : <><Play className="w-4 h-4" /> Übung starten</>}
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// YOUTUBE LO-FI WIDGET
// ─────────────────────────────────────────────
function LofiWidget({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-3xl border border-border/40 shadow-sm overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-bold">Lo-Fi Radio</span>
          <span className="flex gap-1 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Live</span>
          </span>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-accent transition-colors">
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&loop=1"
          title="Lofi Girl – beats to study/relax to"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="px-4 py-3 text-xs text-muted-foreground">
        Lofi Girl · beats to relax/study to
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// SUGGESTION CARD
// ─────────────────────────────────────────────
type SuggestionCardProps = {
  icon: React.ElementType;
  iconBg: string;
  title: string;
  desc: string;
  cta: string;
  external?: boolean;
  onClick: () => void;
};

function SuggestionCard({ icon: Icon, iconBg, title, desc, cta, external, onClick }: SuggestionCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full bg-card rounded-3xl border border-border/40 p-4 shadow-sm hover:border-primary/30 hover:shadow-md transition-all text-left flex items-center gap-4"
    >
      <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform', iconBg)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold leading-tight">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <div className={cn(
        'flex items-center gap-0.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0',
      )}>
        {external && <ExternalLink className="w-3 h-3" />}
        <span>{cta}</span>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────
// MAIN SIDEBAR
// ─────────────────────────────────────────────
type WidgetId = 'pomodoro' | 'breathe' | 'lofi' | null;

export function QuickActionsSidebar() {
  const { todayEntry, markInterventionDone } = useAppStore();
  const [activeWidget, setActiveWidget] = useState<WidgetId>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const hour = new Date().getHours();
  const timeContext: 'morning' | 'evening' = hour >= 5 && hour < 12 ? 'morning' : 'evening';

  const recentMood = timeContext === 'morning' ? todayEntry?.morning_mood : todayEntry?.evening_mood;
  const isLowMood = recentMood !== undefined && recentMood !== null && recentMood <= 3;
  const showIntervention = isLowMood && !todayEntry?.intervention_done;
  const intervention = recentMood && showIntervention ? getIntervention(recentMood, timeContext) : null;

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-4">

      <AnimatePresence mode="wait">
        {/* Active widget takeover */}
        {activeWidget === 'pomodoro' && (
          <PomodoroWidget key="pomodoro" onClose={() => setActiveWidget(null)} />
        )}
        {activeWidget === 'breathe' && (
          <BreathingWidget key="breathe" onClose={() => setActiveWidget(null)} />
        )}

        {activeWidget === 'lofi' && (
          <LofiWidget key="lofi" onClose={() => setActiveWidget(null)} />
        )}

        {!activeWidget && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-3"
          >
            {/* SOS-Intervention bei schlechter Stimmung */}
            {intervention && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 rounded-3xl border border-violet-200 dark:border-violet-800/60 p-5 shadow-sm"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Jetzt empfohlen
                </div>
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl">{intervention.emoji}</span>
                  <div>
                    <h4 className="font-bold text-sm">{intervention.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{intervention.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => markInterventionDone()}
                  className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium py-2.5 rounded-xl transition-all"
                >
                  <CheckCheck className="w-4 h-4" />
                  Erledigt — +5 XP
                </button>
              </motion.div>
            )}

            {/* Pomodoro — öffnet Timer im Widget */}
            <SuggestionCard
              icon={Timer}
              iconBg="bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
              title="Fokus-Timer"
              desc="25 Min. Pomodoro · 5 Min. Pause"
              cta="Timer starten"
              onClick={() => setActiveWidget('pomodoro')}
            />

            {/* Atemübung — öffnet interaktive Übung */}
            <SuggestionCard
              icon={Wind}
              iconBg="bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400"
              title="Atemübung"
              desc="Box-Atmung · 4 Sekunden Rhythmus"
              cta="Starten"
              onClick={() => setActiveWidget('breathe')}
            />

            {/* Lo-Fi — öffnet YouTube-Embed */}
            <SuggestionCard
              icon={Music}
              iconBg="bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
              title="Lo-Fi Musik"
              desc="Lofi Girl Radio · direkt hier"
              cta="Abspielen"
              onClick={() => setActiveWidget('lofi')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
