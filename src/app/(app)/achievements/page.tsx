'use client';

import { useAppStore } from '@/store/useAppStore';
import { ACHIEVEMENTS } from '@/lib/achievements';
import { AchievementBadge } from '@/components/AchievementBadge';
import { motion } from 'framer-motion';
import { AchievementId } from '@/types';

function getAchievementProgress(id: AchievementId, streak: number, totalCheckins: number, totalQuickwins: number) {
  switch (id) {
    case 'first_spark': return { current: Math.min(totalCheckins, 1), max: 1 };
    case 'week_one':    return { current: Math.min(streak, 7), max: 7 };
    case 'iron_will':   return { current: Math.min(streak, 30), max: 30 };
    case 'summit':      return { current: Math.min(streak, 100), max: 100 };
    case 'first_win':   return { current: Math.min(totalQuickwins, 1), max: 1 };
    case 'on_a_roll':   return { current: Math.min(totalQuickwins, 2), max: 2 };
    case 'both_worlds': return null; // tagesbasiert, kein linearer Progress
    case 'deep_diver':  return null;
    default:            return null;
  }
}

export default function AchievementsPage() {
  const { unlockedAchievements, newlyUnlocked, profile } = useAppStore();

  // Nächstes freischaltbares Achievement
  const nextGoal = ACHIEVEMENTS.find((a) => !unlockedAchievements.includes(a.id));

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex flex-col gap-6">

        <div>
          <h1 className="text-2xl font-bold">Achievements</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unlockedAchievements.length} von {ACHIEVEMENTS.length} freigeschaltet
          </p>
        </div>

        {/* Fortschrittsbalken gesamt */}
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        {/* Nächstes Ziel */}
        {nextGoal && (
          <div className="bg-card rounded-2xl border p-4 flex items-center gap-3">
            <span className="text-2xl grayscale opacity-60">{nextGoal.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Nächstes Ziel</p>
              <p className="text-sm font-semibold">{nextGoal.label}</p>
              <p className="text-xs text-muted-foreground">{nextGoal.description}</p>
              {(() => {
                const p = getAchievementProgress(nextGoal.id, profile.streak, profile.total_checkins, profile.total_quickwins);
                if (!p) return null;
                const pct = Math.min((p.current / p.max) * 100, 100);
                return (
                  <div className="mt-2">
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{p.current} / {p.max}</p>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Badge Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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

        {/* Statistiken */}
        <div className="bg-card rounded-2xl border p-4">
          <h2 className="text-sm font-semibold mb-3">Deine Statistiken</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Längster Streak</p>
              <p className="font-bold text-lg">{profile.longest_streak} Tage</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Gesamt Check-ins</p>
              <p className="font-bold text-lg">{profile.total_checkins}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Quick Wins gesamt</p>
              <p className="font-bold text-lg">{profile.total_quickwins}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Badges</p>
              <p className="font-bold text-lg">{unlockedAchievements.length}/{ACHIEVEMENTS.length}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
