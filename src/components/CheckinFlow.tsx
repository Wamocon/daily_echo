'use client';

import { useState } from 'react';
import { Mood, CheckinContext } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { MoodPicker } from '@/components/MoodPicker';
import { MoodSuggestions } from '@/components/MoodSuggestions';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

const MORNING_QUESTIONS = [
  'Was ist deine Intention für heute?',
  'Was ist das Erste, worauf du dich heute freust?',
  'Was könnte heute herausfordernd werden — und wie gehst du damit um?',
];

const EVENING_QUESTIONS = [
  'Was war heute dein schönster Moment?',
  'Was hat dich heute belastet oder Energie gekostet?',
  'Was nimmst du dir aus dem heutigen Tag mit?',
];

interface CheckinFlowProps {
  context: CheckinContext;
  onComplete: () => void;
}

type Step = 'mood' | 'questions' | 'quickwin' | 'done';

export function CheckinFlow({ context, onComplete }: CheckinFlowProps) {
  const [step, setStep] = useState<Step>('mood');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quickWin, setQuickWin] = useState('');
  const [hasQuickWin, setHasQuickWin] = useState<boolean | null>(null);

  const { saveMood, saveAnswers, saveQuickWin, completeCheckin } = useAppStore();
  const questions = context === 'morning' ? MORNING_QUESTIONS : EVENING_QUESTIONS;

  const handleMoodNext = () => {
    if (!selectedMood) return;
    saveMood(selectedMood, context);
    setStep('questions');
  };

  const handleAnswerNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
    } else {
      saveAnswers(answers, context);
      if (context === 'evening') {
        setStep('quickwin');
      } else {
        completeCheckin(context);
        setStep('done');
        setTimeout(onComplete, 1500);
      }
    }
  };

  const handleQuickWinSubmit = () => {
    if (hasQuickWin && quickWin.trim()) {
      saveQuickWin(quickWin.trim());
    }
    completeCheckin(context);
    setStep('done');
    setTimeout(onComplete, 1500);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto px-4">
      <AnimatePresence mode="wait">
        {/* Schritt 1: Mood */}
        {step === 'mood' && (
          <motion.div
            key="mood"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-6"
          >
            <div className="text-center">
              <h2 className="text-xl font-semibold">
                {context === 'morning' ? '🌅 Guten Morgen' : '🌙 Guten Abend'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {context === 'morning' ? 'Starte deinen Tag bewusst' : 'Reflektiere deinen Tag'}
              </p>
            </div>
            <MoodPicker selected={selectedMood} onChange={setSelectedMood} />
            {selectedMood && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <MoodSuggestions mood={selectedMood} context={context} />
              </motion.div>
            )}
            <Button
              onClick={handleMoodNext}
              disabled={!selectedMood}
              className="w-full mt-2"
            >
              Weiter <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {/* Schritt 2: Fragen */}
        {step === 'questions' && (
          <motion.div
            key={`q-${currentQuestion}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-1 justify-center">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= currentQuestion ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <p className="text-base font-medium text-center mt-2">
              {questions[currentQuestion]}
            </p>
            <textarea
              className="w-full rounded-xl border bg-card p-4 text-sm resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Schreib einfach drauflos..."
              value={answers[currentQuestion]}
              onChange={(e) => {
                const next = [...answers];
                next[currentQuestion] = e.target.value;
                setAnswers(next);
              }}
            />
            <Button
              onClick={handleAnswerNext}
              disabled={!answers[currentQuestion].trim()}
              className="w-full"
            >
              {currentQuestion < questions.length - 1 ? (
                <>Weiter <ChevronRight className="ml-1 w-4 h-4" /></>
              ) : (
                'Abschließen'
              )}
            </Button>
          </motion.div>
        )}

        {/* Schritt 3: Quick Win (nur Abend) */}
        {step === 'quickwin' && (
          <motion.div
            key="quickwin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-4"
          >
            <div className="text-center">
              <h2 className="text-xl font-semibold">⚡ Quick Win</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Hattest du heute einen schnellen Erfolg, der echten Wert hatte?
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant={hasQuickWin === true ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setHasQuickWin(true)}
              >
                Ja! ⚡
              </Button>
              <Button
                variant={hasQuickWin === false ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setHasQuickWin(false)}
              >
                Heute nicht
              </Button>
            </div>
            {hasQuickWin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <textarea
                  className="w-full rounded-xl border bg-card p-4 text-sm resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Beschreib deinen Quick Win kurz..."
                  value={quickWin}
                  onChange={(e) => setQuickWin(e.target.value)}
                />
              </motion.div>
            )}
            {hasQuickWin !== null && (
              <Button
                onClick={handleQuickWinSubmit}
                disabled={hasQuickWin === true && !quickWin.trim()}
                className="w-full"
              >
                Check-in abschließen
              </Button>
            )}
          </motion.div>
        )}

        {/* Schritt 4: Done */}
        {step === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 py-8 text-center"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <h2 className="text-xl font-semibold">Check-in abgeschlossen! 🎉</h2>
            <p className="text-sm text-muted-foreground">
              {context === 'morning'
                ? 'Du hast deinen Tag bewusst gestartet.'
                : 'Gut gemacht — du hast reflektiert!'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
