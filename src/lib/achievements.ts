import { Achievement, AchievementId, UserProfile, DailyEntry } from '@/types';
import { getWeeklyQuickWins } from '@/lib/storage';

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_spark', label: 'First Spark', emoji: '🔥', description: 'Erster Check-in abgeschlossen' },
  { id: 'week_one', label: 'Week One', emoji: '🗓️', description: '7 Tage Streak erreicht' },
  { id: 'iron_will', label: 'Iron Will', emoji: '💪', description: '30 Tage Streak erreicht' },
  { id: 'summit', label: 'Summit', emoji: '🏔️', description: '100 Tage Streak erreicht' },
  { id: 'first_win', label: 'First Win', emoji: '⚡', description: 'Ersten Quick Win erfasst' },
  { id: 'on_a_roll', label: 'On a Roll', emoji: '🎯', description: `Wöchentliches Quick Win Ziel erreicht` },
  { id: 'both_worlds', label: 'Both Worlds', emoji: '☯️', description: 'Morgen & Abend am selben Tag' },
  { id: 'deep_diver', label: 'Deep Diver', emoji: '📖', description: 'Prompt aus der Bibliothek genutzt' },
  { id: 'goal_setter', label: 'Goal Setter', emoji: '🎯', description: 'Onboarding abgeschlossen & Ziel gesetzt' },
];

export function checkAchievements(
  profile: UserProfile,
  entry: DailyEntry | null,
  unlockedIds: AchievementId[],
  usedPromptLibrary = false,
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
  if (!has('on_a_roll')) {
    const weeklyTarget = profile.weekly_quickwin_target ?? 2;
    const weeklyQW = getWeeklyQuickWins();
    if (weeklyQW >= weeklyTarget) {
      newUnlocks.push('on_a_roll');
    }
  }
  if (!has('both_worlds') && entry && entry.morning_done && entry.evening_done) {
    newUnlocks.push('both_worlds');
  }
  if (!has('deep_diver') && usedPromptLibrary) {
    newUnlocks.push('deep_diver');
  }
  if (!has('goal_setter') && profile.onboarding_complete) {
    newUnlocks.push('goal_setter');
  }

  return newUnlocks;
}

