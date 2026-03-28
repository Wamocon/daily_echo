'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, CheckCircle2, Minus, Plus } from 'lucide-react';
import { UserValue } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';

const GOAL_OPTIONS = [
  { value: 'Klarheit & Fokus', emoji: '🎯', description: 'Klare Prioritäten setzen, fokussiert bleiben' },
  { value: 'Stressabbau', emoji: '🌿', description: 'Mentale Entlastung, mehr Balance im Alltag' },
  { value: 'Karriere-Tracking', emoji: '📈', description: 'Leistungen festhalten, beruflich wachsen' },
  { value: 'Persönliches Wachstum', emoji: '🌱', description: 'Sich selbst besser kennenlernen' },
];

const JOB_CHIPS = [
  'Software-Entwicklung', 'Marketing', 'Vertrieb', 'Design', 'Studium',
  'Management', 'Selbstständig', 'Gesundheitswesen', 'Anderes',
];

const VALUE_OPTIONS: { value: UserValue; emoji: string }[] = [
  { value: 'Familie', emoji: '👨\u200d👩\u200d👧' },
  { value: 'Karriere', emoji: '💼' },
  { value: 'Gesundheit', emoji: '🏃' },
  { value: 'Kreativität', emoji: '🎨' },
  { value: 'Freundschaft', emoji: '🤝' },
  { value: 'Sinn', emoji: '🌟' },
  { value: 'Wachstum', emoji: '🌱' },
  { value: 'Ruhe', emoji: '🧘' },
  { value: 'Abenteuer', emoji: '🗺️' },
  { value: 'Finanzen', emoji: '💰' },
];

export interface OnboardingData {
  name: string;
  age: number;
  job: string;
  goal: string;
  weeklyQuickWinTarget: number;
  values: UserValue[];
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

type Step = 'name' | 'age' | 'job' | 'goal' | 'quickwin' | 'values' | 'done';
const STEPS: Step[] = ['name', 'age', 'job', 'goal', 'quickwin', 'values', 'done'];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { currentUser } = useAuthStore();
  const prefillName = currentUser?.name ?? '';
  const [step, setStep] = useState<Step>(prefillName ? 'age' : 'name');
  const [name, setName] = useState(prefillName);

  // Race condition fix: auth is async — update as soon as user is available
  useEffect(() => {
    if (currentUser?.name && !name) {
      setName(currentUser.name);
      setStep('age');
    }
  }, [currentUser?.name]); // eslint-disable-line react-hooks/exhaustive-deps
  const [age, setAge] = useState('');
  const [job, setJob] = useState('');
  const [goal, setGoal] = useState('');
  const [weeklyTarget, setWeeklyTarget] = useState(2);
  const [selectedValues, setSelectedValues] = useState<UserValue[]>([]);
  const [direction, setDirection] = useState(1);

  const currentIndex = STEPS.indexOf(step);
  const progress = (currentIndex / (STEPS.length - 1)) * 100;

  const goNext = (nextStep: Step) => {
    setDirection(1);
    setStep(nextStep);
  };

  const goBack = (prevStep: Step) => {
    setDirection(-1);
    setStep(prevStep);
  };

  const handleDone = () => {
    onComplete({
      name: name.trim(),
      age: parseInt(age, 10),
      job: job.trim(),
      goal,
      weeklyQuickWinTarget: weeklyTarget,
      values: selectedValues,
    });
  };

  const toggleValue = (v: UserValue) => {
    setSelectedValues((prev) =>
      prev.includes(v)
        ? prev.filter((x) => x !== v)
        : prev.length < 3
        ? [...prev, v]
        : prev
    );
  };

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -40 }),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm shadow">
            🌀
          </div>
          <span className="font-bold text-lg">DailyEcho</span>
        </div>

        {/* Progress Bar */}
        {step !== 'done' && (
          <div className="mb-8">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-right">
              Schritt {currentIndex + 1} von {STEPS.length - 1}
            </p>
          </div>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          {/* ── Name ── */}
          {step === 'name' && (
            <motion.div key="name" custom={direction} variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold">Willkommen! 👋</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Lass uns dein persönliches DailyEcho einrichten. Wie heißt du?
                </p>
              </div>
              <input
                type="text"
                autoFocus
                placeholder="Dein Vorname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && name.trim() && goNext('age')}
                className="w-full rounded-xl border bg-card px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button
                onClick={() => goNext('age')}
                disabled={!name.trim()}
                className="w-full"
              >
                Weiter <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {/* ── Age ── */}
          {step === 'age' && (
            <motion.div key="age" custom={direction} variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold">Hi {name}! 🎂</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Wie alt bist du? Das hilft uns, die Fragen besser auf dich zuzuschneiden.
                </p>
              </div>

              {/* Minimal Stepper */}
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => setAge(a => a ? String(Math.max(13, parseInt(a) - 1)) : '25')}
                  className="w-12 h-12 rounded-full border border-border bg-card hover:bg-accent transition-colors flex items-center justify-center"
                  aria-label="Weniger"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="text-center min-w-[80px]">
                  <span className="text-5xl font-bold tabular-nums">{age || '—'}</span>
                  {age && <p className="text-xs text-muted-foreground mt-1">Jahre</p>}
                </div>
                <button
                  onClick={() => setAge(a => a ? String(Math.min(99, parseInt(a) + 1)) : '25')}
                  className="w-12 h-12 rounded-full border border-border bg-card hover:bg-accent transition-colors flex items-center justify-center"
                  aria-label="Mehr"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Quick picks */}
              <div className="flex gap-2 justify-center flex-wrap">
                {['20', '25', '30', '35', '40', '45'].map(v => (
                  <button
                    key={v}
                    onClick={() => setAge(v)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      age === v ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                {!currentUser?.name && (
                  <Button variant="outline" onClick={() => goBack('name')} className="w-12 shrink-0">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  onClick={() => goNext('job')}
                  disabled={!age}
                  className="flex-1"
                >
                  Weiter <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Job ── */}
          {step === 'job' && (
            <motion.div key="job" custom={direction} variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold">Was machst du beruflich?</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Wähle eine Kategorie oder gib es direkt ein.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {JOB_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setJob(chip)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      job === chip
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-border hover:border-primary/50'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Oder genauer beschreiben…"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                className="w-full rounded-xl border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => goBack('age')} className="w-12 shrink-0">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => goNext('goal')}
                  disabled={!job.trim()}
                  className="flex-1"
                >
                  Weiter <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Goal ── */}
          {step === 'goal' && (
            <motion.div key="goal" custom={direction} variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold">Was ist dein Ziel? 🌟</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Wofür nutzt du DailyEcho?
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {GOAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setGoal(opt.value)}
                    className={`w-full rounded-xl border p-4 text-left flex items-center gap-4 transition-all ${
                      goal === opt.value
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/30'
                        : 'border-border bg-card hover:border-primary/40'
                    }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <div>
                      <p className="font-medium text-sm">{opt.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => goBack('job')} className="w-12 shrink-0">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => goNext('quickwin')}
                  disabled={!goal}
                  className="flex-1"
                >
                  Weiter <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── QuickWin Target ── */}
          {step === 'quickwin' && (
            <motion.div key="quickwin" custom={direction} variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold">Quick Win Ziel ⚡</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Wie viele Quick Wins willst du pro Woche festhalten?
                  Ein Quick Win ist ein konkreter Erfolg, der echten Wert hatte.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 py-4">
                <span className="text-6xl font-bold">{weeklyTarget}</span>
                <p className="text-sm text-muted-foreground">pro Woche</p>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setWeeklyTarget(n)}
                      className={`w-10 h-10 rounded-xl border text-sm font-medium transition-all ${
                        weeklyTarget === n
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-card border-border hover:border-primary/50'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center px-4">
                  {weeklyTarget === 1 && 'Entspannt starten — jeder kleine Erfolg zählt 🌱'}
                  {weeklyTarget === 2 && 'Bewährt & realistisch — der ideale Einstieg ✨'}
                  {weeklyTarget === 3 && 'Ambitioniert — du bist motiviert! 💪'}
                  {weeklyTarget === 4 && 'High Performer-Modus aktiviert 🚀'}
                  {weeklyTarget === 5 && 'Maximale Intensität — respect! 🔥'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => goBack('goal')} className="w-12 shrink-0">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button onClick={() => goNext('values')} className="flex-1">
                  Weiter <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Values ── */}
          {step === 'values' && (
            <motion.div key="values" custom={direction} variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold">Deine Werte 🧘</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Wähle <strong>3 Werte</strong>, die dir am wichtigsten sind.
                  Sie prägen deine persönlichen Check-in-Fragen.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {VALUE_OPTIONS.map((opt) => {
                  const isSelected = selectedValues.includes(opt.value);
                  const isDisabled = !isSelected && selectedValues.length >= 3;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggleValue(opt.value)}
                      disabled={isDisabled}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/30 font-semibold'
                          : isDisabled
                          ? 'border-border bg-muted/30 opacity-40 cursor-not-allowed'
                          : 'border-border bg-card hover:border-primary/40'
                      }`}
                    >
                      <span className="text-xl">{opt.emoji}</span>
                      <span>{opt.value}</span>
                      {isSelected && <span className="ml-auto text-primary text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-center text-muted-foreground">
                {selectedValues.length}/3 gewählt
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => goBack('quickwin')} className="w-12 shrink-0">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => { handleDone(); goNext('done'); }}
                  disabled={selectedValues.length < 3}
                  className="flex-1"
                >
                  DailyEcho starten 🌀
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Done ── */}
          {step === 'done' && (
            <motion.div key="done" custom={direction} variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-6 text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              >
                <CheckCircle2 className="w-20 h-20 text-green-500" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold">Alles bereit, {name}! 🎉</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                  Dein DailyEcho ist personalisiert. Dein Ziel: <strong>{goal}</strong>.
                  Los geht&apos;s!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
