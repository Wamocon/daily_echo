'use client';

import { useAppStore } from '@/store/useAppStore';
import { ACHIEVEMENTS } from '@/lib/achievements';
import { AchievementBadge } from '@/components/AchievementBadge';
import { motion } from 'framer-motion';

export default function AchievementsPage() {
  const { unlockedAchievements, newlyUnlocked, profile } = useAppStore();

  return (
    <div className="min-h-screen px-4 pt-12 pb-32 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold">Achievements</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unlockedAchievements.length}/{ACHIEVEMENTS.length} freigeschaltet
          </p>
        </div>

        {/* Fortschrittsbalken */}
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ACHIEVEMENTS.map((a) => (
            <AchievementBadge
              key={a.id}
              achievement={a}
              unlocked={unlockedAchievements.includes(a.id)}
              newlyUnlocked={newlyUnlocked.includes(a.id)}
            />
          ))}
        </div>

        {/* Statistiken */}
        <div className="bg-card rounded-2xl border p-4 mt-2">
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
      </motion.div>
    </div>
  );
}
