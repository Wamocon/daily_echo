'use client';

import { useAppStore } from '@/store/useAppStore';
import { ACHIEVEMENTS } from '@/lib/achievements';
import { UNLOCKABLES, LEVELS, getLevelTitle, getNextLevelXP } from '@/lib/xp';
import { AchievementBadge } from '@/components/AchievementBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { AchievementId } from '@/types';
import { useState } from 'react';
import { Lock, Trophy, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORY_LABELS: Record<string, string> = {
  theme: '🎨 Themes',
  feature: '⚡ Features',
  cosmetic: '💎 Kosmetik',
};

function getAchievementProgress(id: AchievementId, streak: number, totalCheckins: number, totalQuickwins: number) {
  switch (id) {
    case 'first_spark': return { current: Math.min(totalCheckins, 1), max: 1 };
    case 'week_one':    return { current: Math.min(streak, 7), max: 7 };
    case 'iron_will':   return { current: Math.min(streak, 30), max: 30 };
    case 'summit':      return { current: Math.min(streak, 100), max: 100 };
    case 'first_win':   return { current: Math.min(totalQuickwins, 1), max: 1 };
    case 'on_a_roll':   return { current: Math.min(totalQuickwins, 2), max: 2 };
    case 'both_worlds': return null;
    case 'deep_diver':  return null;
    default:            return null;
  }
}

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'unlockables'>('achievements');
  
  const { unlockedAchievements, newlyUnlocked, profile } = useAppStore();
  const currentLevel = profile.level ?? 1;
  const currentXP = profile.xp ?? 0;
  const levelTitle = getLevelTitle(currentLevel);
  const nextInfo = getNextLevelXP(currentXP);

  const nextGoal = ACHIEVEMENTS.find((a) => !unlockedAchievements.includes(a.id));
  const categories = ['feature', 'cosmetic', 'theme'] as const;

  return (
    <div className="w-full max-w-6xl mx-auto">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-2">
        <div>
          <h1 className="text-2xl font-bold">Erfolge & Freischaltungen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sammle Abzeichen und schalte durch Levelaufstiege Belohnungen frei.
          </p>
        </div>
        
        <div className="flex bg-muted/50 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('achievements')}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
              activeTab === 'achievements' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Trophy className="w-4 h-4" />
            Erfolge
          </button>
          <button
            onClick={() => setActiveTab('unlockables')}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
              activeTab === 'unlockables' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Star className="w-4 h-4" />
            Freischaltungen
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'achievements' ? (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            {/* Fortschrittsbalken gesamt */}
            <div className="bg-card rounded-2xl border border-border/40 p-5 shadow-sm">
              <div className="flex justify-between items-end mb-2">
                <span className="font-semibold text-sm">Dein Trophäenschrank</span>
                <span className="text-xs text-muted-foreground font-medium">{unlockedAchievements.length} / {ACHIEVEMENTS.length}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-primary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Nächstes Ziel & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nextGoal ? (
                <div className="bg-card rounded-2xl border border-border/40 shadow-sm p-5 flex items-center gap-4">
                  <span className="text-4xl grayscale opacity-40">{nextGoal.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">Nächstes Ziel</p>
                    <p className="text-sm font-bold">{nextGoal.label}</p>
                    <p className="text-xs text-muted-foreground leading-snug mt-0.5">{nextGoal.description}</p>
                    {(() => {
                      const p = getAchievementProgress(nextGoal.id, profile.streak, profile.total_checkins, profile.total_quickwins);
                      if (!p) return null;
                      const pct = Math.min((p.current / p.max) * 100, 100);
                      return (
                        <div className="mt-3">
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase text-right tracking-widest">{p.current}/{p.max}</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="bg-card rounded-2xl border border-border/40 shadow-sm p-5 flex items-center justify-center text-center">
                  <p className="font-semibold text-primary">Alle Erfolge freigeschaltet! 🎉</p>
                </div>
              )}

              <div className="bg-card rounded-2xl border border-border/40 shadow-sm p-5">
                <h2 className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-3">Statistiken</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-bold text-lg">{profile.longest_streak} <span className="text-xs font-normal text-muted-foreground">Tage</span></p>
                    <p className="text-muted-foreground text-xs font-medium">Bester Streak</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{profile.total_checkins}</p>
                    <p className="text-muted-foreground text-xs font-medium">Gesamt Check-ins</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-bold text-lg">{profile.total_quickwins}</p>
                    <p className="text-muted-foreground text-xs font-medium">Quick Wins gemeistert</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Badge Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
              {ACHIEVEMENTS.map((a) => {
                const unlocked = unlockedAchievements.includes(a.id);
                const progress = unlocked ? null : getAchievementProgress(a.id, profile.streak, profile.total_checkins, profile.total_quickwins);
                return (
                  <AchievementBadge
                    key={a.id}
                    achievement={a}
                    unlocked={unlocked}
                    newlyUnlocked={newlyUnlocked.includes(a.id)}
                    progress={progress}
                  />
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="unlockables"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            {/* Level summary */}
            <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
              <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div>
                  <p className="text-violet-200 text-xs font-bold uppercase tracking-widest mb-1">XP System</p>
                  <p className="text-2xl font-black">Level {currentLevel}</p>
                  <p className="text-violet-100 font-medium">{levelTitle}</p>
                </div>
                <span className="text-5xl drop-shadow-md">✨</span>
              </div>
              
              <div className="relative z-10 mt-6">
                <div className="flex justify-between text-xs text-violet-200 font-bold mb-1.5 uppercase tracking-wider">
                  <span>{currentXP} XP</span>
                  <span>{nextInfo ? `${nextInfo.next} XP` : 'MAX'}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-black/20 overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-700"
                    style={{ width: nextInfo ? `${((currentXP - (LEVELS.find(l => l.level === currentLevel)?.minXP ?? 0)) / ((nextInfo.next) - (LEVELS.find(l => l.level === currentLevel)?.minXP ?? 0))) * 100}%` : '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Level Roadmap */}
            <div className="bg-card rounded-2xl border border-border/40 p-5 shadow-sm">
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Level-Roadmap</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {LEVELS.map((def) => {
                  const reached = currentLevel >= def.level;
                  return (
                    <div
                      key={def.level}
                      className={cn(
                        "flex-shrink-0 rounded-xl px-4 py-3 text-center min-w-[80px] transition-all",
                        reached ? "bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800" : "bg-muted/30 border border-border/30 opacity-60"
                      )}
                    >
                      <p className={cn("text-xs font-black mb-1", reached ? "text-violet-700 dark:text-violet-300" : "text-muted-foreground")}>Lv. {def.level}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight font-medium">{def.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Unlockables grouped by category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {categories.map((cat) => {
                const items = UNLOCKABLES.filter((u) => u.category === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat} className="flex flex-col gap-3">
                    <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">{CATEGORY_LABELS[cat]}</h2>
                    <div className="flex flex-col gap-2">
                      {items.map((item, i) => {
                        const unlocked = currentLevel >= item.requiredLevel;
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={cn(
                              "flex items-center gap-4 rounded-2xl border p-4 transition-all shadow-sm",
                              unlocked ? "bg-card border-border/40" : "bg-muted/30 border-dashed border-border/60"
                            )}
                          >
                            <span className={cn("text-3xl shrink-0 drop-shadow-sm", !unlocked && "grayscale opacity-50")}>{item.emoji}</span>
                            <div className="flex-1 min-w-0 pr-2">
                              <p className={cn("font-bold text-sm leading-tight", !unlocked && "text-muted-foreground")}>{item.label}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{item.description}</p>
                            </div>
                            {unlocked ? (
                              <span className="text-[10px] font-bold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 px-2.5 py-1 rounded-full shrink-0 uppercase tracking-wider">
                                Frei
                              </span>
                            ) : (
                              <div className="flex flex-col items-center gap-1 shrink-0 bg-background/50 px-2 py-1.5 rounded-lg border border-border/30">
                                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-[10px] font-bold text-muted-foreground">Lv. {item.requiredLevel}</span>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
