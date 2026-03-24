'use client';

import { create } from 'zustand';
import { UserProfile, DailyEntry, AchievementId, Mood, CheckinContext, WeeklyGoal } from '@/types';
import {
  getProfile, saveProfile, getEntryByDate, saveEntry, createEmptyEntry,
  getUnlockedIds, unlockAchievement, getWeeklyCheckins, getWeeklyQuickWins,
} from '@/lib/storage';
import { calculateStreak, todayISO } from '@/lib/streaks';
import { checkAchievements } from '@/lib/achievements';

interface AppState {
  profile: UserProfile;
  todayEntry: DailyEntry | null;
  unlockedAchievements: AchievementId[];
  newlyUnlocked: AchievementId[];
  weeklyGoal: WeeklyGoal;
  isInitialized: boolean;

  init: () => void;
  saveMood: (mood: Mood, context: CheckinContext) => void;
  saveAnswers: (answers: string[], context: CheckinContext) => void;
  saveQuickWin: (text: string) => void;
  completeCheckin: (context: CheckinContext) => void;
  useStreakFreeze: () => void;
  clearNewlyUnlocked: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  profile: getProfile(),
  todayEntry: null,
  unlockedAchievements: [],
  newlyUnlocked: [],
  weeklyGoal: { checkins: 0, checkinGoal: 5, quickwins: 0, quickwinGoal: 2 },
  isInitialized: false,

  init: () => {
    const profile = getProfile();
    const today = todayISO();
    const entry = getEntryByDate(today) ?? createEmptyEntry(today);
    const unlockedIds = getUnlockedIds();
    const weeklyGoal: WeeklyGoal = {
      checkins: getWeeklyCheckins(),
      checkinGoal: 5,
      quickwins: getWeeklyQuickWins(),
      quickwinGoal: 2,
    };
    set({ profile, todayEntry: entry, unlockedAchievements: unlockedIds, weeklyGoal, isInitialized: true });
  },

  saveMood: (mood, context) => {
    const { todayEntry } = get();
    if (!todayEntry) return;
    const updated: DailyEntry = context === 'morning'
      ? { ...todayEntry, morning_mood: mood }
      : { ...todayEntry, evening_mood: mood };
    saveEntry(updated);
    set({ todayEntry: updated });
  },

  saveAnswers: (answers, context) => {
    const { todayEntry } = get();
    if (!todayEntry) return;
    const updated: DailyEntry = context === 'morning'
      ? { ...todayEntry, morning_answers: answers }
      : { ...todayEntry, evening_answers: answers };
    saveEntry(updated);
    set({ todayEntry: updated });
  },

  saveQuickWin: (text) => {
    const { todayEntry, profile } = get();
    if (!todayEntry) return;
    const isNew = !todayEntry.has_quickwin;
    const updated: DailyEntry = { ...todayEntry, has_quickwin: true, quickwin_text: text };
    saveEntry(updated);
    const updatedProfile = isNew
      ? { ...profile, total_quickwins: profile.total_quickwins + 1 }
      : profile;
    saveProfile(updatedProfile);
    set({
      todayEntry: updated,
      profile: updatedProfile,
      weeklyGoal: {
        ...get().weeklyGoal,
        quickwins: getWeeklyQuickWins(),
      },
    });
  },

  completeCheckin: (context) => {
    const { todayEntry, profile, unlockedAchievements } = get();
    if (!todayEntry) return;

    const updated: DailyEntry = context === 'morning'
      ? { ...todayEntry, morning_done: true }
      : { ...todayEntry, evening_done: true };
    saveEntry(updated);

    const { newStreak, shouldResetFreeze } = calculateStreak(profile);
    const updatedProfile: UserProfile = {
      ...profile,
      streak: newStreak,
      longest_streak: Math.max(profile.longest_streak, newStreak),
      last_checkin_date: todayISO(),
      total_checkins: profile.total_checkins + 1,
      freeze_used_this_week: shouldResetFreeze ? true : profile.freeze_used_this_week,
    };
    saveProfile(updatedProfile);

    const newAchievements = checkAchievements(updatedProfile, updated, unlockedAchievements);
    newAchievements.forEach((id) => unlockAchievement(id));
    const allUnlocked = [...unlockedAchievements, ...newAchievements];

    set({
      todayEntry: updated,
      profile: updatedProfile,
      unlockedAchievements: allUnlocked,
      newlyUnlocked: newAchievements,
      weeklyGoal: { ...get().weeklyGoal, checkins: getWeeklyCheckins() },
    });
  },

  useStreakFreeze: () => {
    const { profile } = get();
    if (profile.freeze_used_this_week) return;
    const updated = { ...profile, freeze_used_this_week: true };
    saveProfile(updated);
    set({ profile: updated });
  },

  clearNewlyUnlocked: () => set({ newlyUnlocked: [] }),
}));
