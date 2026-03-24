'use client';

import { useState } from 'react';
import { Mood, CheckinContext } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { MoodPicker } from '@/components/MoodPicker';
import { MoodSuggestions } from '@/components/MoodSuggestions';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle2, Flame, Plus, Heart, RefreshCw } from 'lucide-react';
import { getCoreQuestions, pickRandomOptional, Question } from '@/lib/questions';

interface CheckinFlowProps {
  context: CheckinContext;
  onComplete: () => void;
}

type MoodDuration = 'just-today' | 'few-days' | 'a-while';
type Step = 'mood' | 'mood-context' | 'questions' | 'perspective' | 'reframing' | 'quickwin' | 'done';

export function CheckinFlow({ context, onComplete }: CheckinFlowProps) {
  const [step, setStep] = useState<Step>('mood');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quickWin, setQuickWin] = useState('');
  const [hasQuickWin, setHasQuickWin] = useState<boolean | null>(null);
  const [extraQuestions, setExtraQuestions] = useState<Question[]>([]);
  const [usedOptionalIds, setUsedOptionalIds] = useState<string[]>([]);
  const [usedPromptLibrary, setUsedPromptLibrary] = useState(false);
  const [moodDuration, setMoodDuration] = useState<MoodDuration | null>(null);
  const [perspectiveAnswer, setPerspectiveAnswer] = useState('');
  const [reframingAnswer, setReframingAnswer] = useState('');

  const { saveMood, saveAnswers, saveQuickWin, completeCheckin, profile } = useAppStore();
  const coreQuestions = getCoreQuestions(context);
  const allQuestions = [...coreQuestions, ...extraQuestions];
  const MAX_OPTIONAL = 2;
  const isLowMood = selectedMood !== null && selectedMood <= 2;

  const handleMoodNext = () => {
    if (!selectedMood) return;
    saveMood(selectedMood, context);
    // Low mood → Kontext-Klärung zuerst
    if (isLowMood) {
      setStep('mood-context');
    } else {
      setStep('questions');
    }
  };

  const handleMoodContextNext = () => {
    setStep('questions');
  };

  // Nach letzter Frage: low mood → Perspektivwechsel, sonst weiter
  const proceedAfterQuestions = () => {
    saveAnswers(answers, context);
    if (isLowMood) {
      setStep('perspective');
    } else if (context === 'evening') {
      setStep('quickwin');
    } else {
      completeCheckin(context, usedPromptLibrary);
      setStep('done');
      setTimeout(onComplete, 2500);
    }
  };

  const handlePerspectiveNext = () => {
    setStep('reframing');
  };

  const handleReframingNext = () => {
    if (context === 'evening') {
      setStep('quickwin');
    } else {
      completeCheckin(context, usedPromptLibrary);
      setStep('done');
      setTimeout(onComplete, 2500);
    }
  };

  const handleAddOptionalQuestion = () => {
    const next = pickRandomOptional(context, usedOptionalIds);
    if (!next) return;
    setExtraQuestions((prev) => [...prev, next]);
    setUsedOptionalIds((prev) => [...prev, next.id]);
    setAnswers((prev) => [...prev, '']);
    setUsedPromptLibrary(true);
  };

  const handleAnswerNext = () => {
    if (currentQuestion < allQuestions.length - 1) {
      setCurrentQuestion((q) => q + 1);
    } else {
      proceedAfterQuestions();
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestion < allQuestions.length - 1) {
      setCurrentQuestion((q) => q + 1);
    } else {
      proceedAfterQuestions();
    }
  };

  const handleQuickWinSubmit = () => {
    if (hasQuickWin && quickWin.trim()) {
      saveQuickWin(quickWin.trim());
    }
    completeCheckin(context, usedPromptLibrary);
    setStep('done');
    setTimeout(onComplete, 2500);
  };

  const isLastCoreQuestion = currentQuestion === coreQuestions.length - 1;
  const isLastQuestion = currentQuestion === allQuestions.length - 1;
  const availableOptionalCount = (context === 'morning' ? 6 : 6) - usedOptionalIds.length;
  const canAddMore = extraQuestions.length < MAX_OPTIONAL && availableOptionalCount > 0;

  void isLastCoreQuestion; // used for future styling

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto px-4">
      <AnimatePresence mode="wait">
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
                {context === 'morning' ? 'Guten Morgen' : 'Guten Abend'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {context === 'morning' ? 'Starte deinen Tag bewusst' : 'Reflektiere deinen Tag'}
              </p>
            </div>
            <MoodPicker selected={selectedMood} onChange={setSelectedMood} />
            <Button
              onClick={handleMoodNext}
              disabled={!selectedMood}
              className="w-full mt-2"
            >
              Weiter <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {/* ── Mood-Kontext (nur bei Mood ≤ 2) ── */}
        {step === 'mood-context' && (
          <motion.div
            key="mood-context"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-6"
          >
            <div className="text-center">
              <h2 className="text-xl font-semibold">Danke, dass du ehrlich bist 🙏</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Wie lange fühlst du dich schon so?
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {([
                { value: 'just-today', label: 'Nur heute', emoji: '🌥️', desc: 'Ein temporäres Gefühl' },
                { value: 'few-days', label: 'Seit ein paar Tagen', emoji: '🌧️', desc: 'Schon eine Weile merkbar' },
                { value: 'a-while', label: 'Schon länger', emoji: '⛈️', desc: 'Hält sich hartnäckig' },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMoodDuration(opt.value)}
                  className={`w-full rounded-xl border p-4 flex items-center gap-4 text-left transition-all ${
                    moodDuration === opt.value
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'bg-card border-border hover:border-primary/40'
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <div>
                    <p className="font-medium text-sm">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            {moodDuration === 'a-while' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 text-sm text-blue-800 dark:text-blue-200"
              >
                💙 Wenn sich das schon länger so anfühlt — es kann helfen, mit jemandem zu sprechen.
                DailyEcho begleitet dich, kann aber keine professionelle Unterstützung ersetzen.
              </motion.div>
            )}
            <Button onClick={handleMoodContextNext} disabled={!moodDuration} className="w-full">
              Weiter <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {/* ── Perspektivwechsel (nur bei Mood ≤ 2, nach Fragen) ── */}
        {step === 'perspective' && (
          <motion.div
            key="perspective"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-pink-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold leading-tight">Ein Perspektivwechsel</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Self-Compassion Übung</p>
              </div>
            </div>
            <div className="rounded-xl bg-pink-50 dark:bg-pink-950 border border-pink-200 dark:border-pink-800 p-4">
              <p className="text-sm leading-relaxed text-pink-900 dark:text-pink-100">
                Stell dir vor, dein bester Freund hätte heute genau das erlebt, was du beschrieben hast.
                <strong className="block mt-2">Was würdest du ihm sagen?</strong>
              </p>
            </div>
            <textarea
              className="w-full rounded-xl border bg-card p-4 text-sm resize-none min-h-[110px] focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Ich würde ihm sagen..."
              value={perspectiveAnswer}
              onChange={(e) => setPerspectiveAnswer(e.target.value)}
            />
            {perspectiveAnswer.trim().length > 10 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-3 text-sm text-green-800 dark:text-green-200 text-center"
              >
                💚 Das gilt auch für dich.
              </motion.div>
            )}
            <Button onClick={handlePerspectiveNext} disabled={!perspectiveAnswer.trim()} className="w-full">
              Weiter <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
            <button
              onClick={handlePerspectiveNext}
              className="text-xs text-muted-foreground hover:text-foreground text-center transition-colors"
            >
              Überspringen
            </button>
          </motion.div>
        )}

        {/* ── Reframing (nach Perspektivwechsel) ── */}
        {step === 'reframing' && (
          <motion.div
            key="reframing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold leading-tight">Reframing</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Andere Sichtweise einnehmen</p>
              </div>
            </div>
            <div className="rounded-xl bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 p-4">
              <p className="text-sm leading-relaxed text-violet-900 dark:text-violet-100">
                Gibt es eine andere Sichtweise auf das, was du heute beschrieben hast?
                <span className="block mt-1 text-xs opacity-70">
                  Nicht &quot;positiv denken&quot; — sondern ehrlich: Welcher andere Blickwinkel wäre möglich?
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                'Das ist vorübergehend',
                'Ich bin stärker als es sich anfühlt',
                'Das lehrt mich etwas',
                'Andere hatten das auch',
                'Eigene Antwort…',
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setReframingAnswer(chip === 'Eigene Antwort…' ? '' : chip)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                    reframingAnswer === chip
                      ? 'bg-violet-500 text-white border-violet-500'
                      : 'bg-card border-border hover:border-violet-400'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
            <textarea
              className="w-full rounded-xl border bg-card p-4 text-sm resize-none min-h-[90px] focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Meine andere Sichtweise..."
              value={reframingAnswer}
              onChange={(e) => setReframingAnswer(e.target.value)}
            />
            <Button onClick={handleReframingNext} disabled={!reframingAnswer.trim()} className="w-full">
              {context === 'evening' ? 'Weiter zum Quick Win' : 'Abschließen'}
              <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
            <button
              onClick={handleReframingNext}
              className="text-xs text-muted-foreground hover:text-foreground text-center transition-colors"
            >
              Überspringen
            </button>
          </motion.div>
        )}

        {step === 'questions' && (
          <motion.div
            key={`q-${currentQuestion}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-1 justify-center">
              {allQuestions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= currentQuestion ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            {currentQuestion >= coreQuestions.length && (
              <span className="text-[10px] text-primary font-medium uppercase tracking-wide text-center">
                📖 Aus der Fragebibliothek
              </span>
            )}
            <p className="text-base font-medium text-center mt-2">
              {allQuestions[currentQuestion].text}
            </p>
            <textarea
              className="w-full rounded-xl border bg-card p-4 text-sm resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Schreib einfach drauflos..."
              value={answers[currentQuestion] ?? ''}
              onChange={(e) => {
                const next = [...answers];
                next[currentQuestion] = e.target.value;
                setAnswers(next);
              }}
            />
            {/* "Weitere Frage" — erscheint nach letzter Pflichtfrage */}
            {isLastQuestion && canAddMore && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleAddOptionalQuestion}
                className="flex items-center justify-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors border border-primary/30 rounded-xl py-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Weitere Frage aus der Bibliothek
              </motion.button>
            )}
            <Button
              onClick={handleAnswerNext}
              disabled={!answers[currentQuestion]?.trim()}
              className="w-full"
            >
              {!isLastQuestion ? (
                <span className="flex items-center gap-1">Weiter <ChevronRight className="w-4 h-4" /></span>
              ) : (
                'Abschließen'
              )}
            </Button>
            <button
              onClick={handleSkipQuestion}
              className="text-xs text-muted-foreground hover:text-foreground text-center transition-colors py-1"
            >
              Überspringen
            </button>
          </motion.div>
        )}

        {step === 'quickwin' && (
          <motion.div
            key="quickwin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-4"
          >
            <div className="text-center">
              <h2 className="text-xl font-semibold">Quick Win</h2>
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
                Ja!
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

        {step === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex flex-col items-center gap-5 py-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 15 }}
            >
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </motion.div>
            <div>
              <h2 className="text-xl font-semibold">
                {context === 'morning' ? 'Top! Tag bewusst gestartet.' : 'Gut gemacht! Tag reflektiert.'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {context === 'morning'
                  ? 'Du hast eine starke Grundlage für heute gelegt.'
                  : 'Regelmäßige Reflexion macht einen echten Unterschied.'}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950 rounded-2xl px-5 py-3">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-lg">{profile.streak}</span>
              <span className="text-sm text-muted-foreground">Tage Streak</span>
            </div>
            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full"
              >
                <MoodSuggestions mood={selectedMood} context={context} />
              </motion.div>
            )}
            <Button onClick={onComplete} className="w-full mt-2">
              Fertig
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
