import { Achievement, AchievementId, UserProfile, DailyEntry } from '@/types';

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_spark', label: 'First Spark', emoji: '🔥', description: 'Erster Check-in abgeschlossen' },
  { id: 'week_one', label: 'Week One', emoji: '🗓️', description: '7 Tage Streak erreicht' },
  { id: 'iron_will', label: 'Iron Will', emoji: '💪', description: '30 Tage Streak erreicht' },
  { id: 'summit', label: 'Summit', emoji: '🏔️', description: '100 Tage Streak erreicht' },
  { id: 'first_win', label: 'First Win', emoji: '⚡', description: 'Ersten Quick Win erfasst' },
  { id: 'on_a_roll', label: 'On a Roll', emoji: '🎯', description: '2 Quick Wins in einer Woche' },
  { id: 'both_worlds', label: 'Both Worlds', emoji: '☯️', description: 'Morgen & Abend am selben Tag' },
  { id: 'deep_diver', label: 'Deep Diver', emoji: '📖', description: 'Prompt aus der Bibliothek genutzt' },
];

export function checkAchievements(
  profile: UserProfile,
  entry: DailyEntry,
  unlockedIds: AchievementId[]
): AchievementId[] {
  const newUnlocks: AchievementId[] = [];
  const has = (id: AchievementId) => unlockedIds.includes(id);

  if (!has('first_spark') && profile.total_checkins >= 1) {
    newUnlocks.push('first_spark');
  }
  if (!has('week_one') && profile.streak >= 7) {
    newUnlocks.push('week_one');
  }
  if (!has('iron_will') && profile.streak >= 30) {
    newUnlocks.push('iron_will');
  }
  if (!has('summit') && profile.streak >= 100) {
    newUnlocks.push('summit');
  }
  if (!has('first_win') && profile.total_quickwins >= 1) {
    newUnlocks.push('first_win');
  }
  if (!has('both_worlds') && entry.morning_done && entry.evening_done) {
    newUnlocks.push('both_worlds');
  }

  return newUnlocks;
}
