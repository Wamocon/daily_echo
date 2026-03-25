'use client';

import { useAppStore } from '@/store/useAppStore';
import { UNLOCKABLES, LEVELS, getLevelTitle, getNextLevelXP } from '@/lib/xp';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORY_LABELS: Record<string, string> = {
  theme: '🎨 Themes',
  feature: '⚡ Features',
  cosmetic: '💎 Kosmetik',
};

export default function UnlockablesPage() {
  const profile = useAppStore((s) => s.profile);
  const currentLevel = profile.level ?? 1;
  const currentXP = profile.xp ?? 0;
  const levelTitle = getLevelTitle(currentLevel);
  const nextInfo = getNextLevelXP(currentXP);

  const categories = ['feature', 'cosmetic', 'theme'] as const;

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-6 px-4 pt-10 pb-32 lg:pb-10 w-full max-w-lg mx-auto">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Freischaltungen</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Verdiene XP und schalte neue Features frei.
          </p>
        </div>

        {/* Level summary */}
        <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-violet-200 text-xs font-semibold uppercase tracking-wide">Dein Level</p>
              <p className="text-2xl font-bold">Lv.{currentLevel} · {levelTitle}</p>
            </div>
            <span className="text-4xl">⭐</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden mb-1">
            <div
              className="h-full rounded-full bg-white transition-all duration-700"
              style={{ width: nextInfo ? `${((currentXP - (LEVELS.find(l => l.level === currentLevel)?.minXP ?? 0)) / ((nextInfo.next) - (LEVELS.find(l => l.level === currentLevel)?.minXP ?? 0))) * 100}%` : '100%' }}
            />
          </div>
          <p className="text-violet-200 text-xs">
            {nextInfo ? `${currentXP} / ${nextInfo.next} XP` : '✨ Maximales Level erreicht!'}
          </p>
        </div>

        {/* Level Roadmap */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Level-Übersicht</h2>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {LEVELS.map((def) => {
              const reached = currentLevel >= def.level;
              return (
                <div
                  key={def.level}
                  className={`flex-shrink-0 rounded-xl border px-3 py-2 text-center min-w-[72px] transition-all ${
                    reached
                      ? 'bg-violet-50 dark:bg-violet-950 border-violet-300 dark:border-violet-700'
                      : 'bg-muted/40 border-border opacity-50'
                  }`}
                >
                  <p className={`text-xs font-bold ${reached ? 'text-violet-600 dark:text-violet-300' : 'text-muted-foreground'}`}>
                    Lv.{def.level}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{def.title}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unlockables grouped by category */}
        {categories.map((cat) => {
          const items = UNLOCKABLES.filter((u) => u.category === cat);
          return (
            <div key={cat}>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {CATEGORY_LABELS[cat]}
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {items.map((item, i) => {
                  const unlocked = currentLevel >= item.requiredLevel;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-4 rounded-2xl border p-4 transition-all ${
                        unlocked
                          ? 'bg-card border-border'
                          : 'bg-muted/30 border-border/50 opacity-60'
                      }`}
                    >
                      <span className={`text-3xl ${unlocked ? '' : 'grayscale'}`}>{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm ${unlocked ? '' : 'text-muted-foreground'}`}>
                          {item.label}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                      </div>
                      {unlocked ? (
                        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2 py-1 rounded-full shrink-0">
                          Frei
                        </span>
                      ) : (
                        <div className="flex items-center gap-1 shrink-0">
                          <Lock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Lv.{item.requiredLevel}</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
