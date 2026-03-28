'use client';

import { create } from 'zustand';
import { UserProfile, DailyEntry, AchievementId, Mood, CheckinContext, WeeklyGoal, UserValue } from '@/types';
import {
  getProfile, saveProfile, getEntryByDate, saveEntry, createEmptyEntry,
  getUnlockedIds, unlockAchievement, getWeeklyCheckins, getWeeklyQuickWins,
} from '@/lib/storage';
import { calculateStreak, todayISO } from '@/lib/streaks';
import { checkAchievements } from '@/lib/achievements';
import { XP, calculateLevel } from '@/lib/xp';
import { createClient } from '@/lib/supabase/client';

// ─── Supabase sync helpers ────────────────────────────────────────────────────

function syncProfileToSupabase(userId: string, profile: UserProfile) {
  const supabase = createClient();
  supabase.from('profiles').upsert({
    id: userId,
    display_name: profile.display_name,
    streak: profile.streak,
    longest_streak: profile.longest_streak,
    freeze_used_this_week: profile.freeze_used_this_week,
    last_checkin_date: profile.last_checkin_date,
    total_checkins: profile.total_checkins,
    total_quickwins: profile.total_quickwins,
  }).then();
}

function syncEntryToSupabase(userId: string, entry: DailyEntry) {
  const supabase = createClient();
  supabase.from('daily_entries').upsert({
    user_id: userId,
    entry_date: entry.entry_date,
    morning_done: entry.morning_done,
    evening_done: entry.evening_done,
    morning_mood: entry.morning_mood,
    evening_mood: entry.evening_mood,
    morning_answers: entry.morning_answers,
    evening_answers: entry.evening_answers,
    has_quickwin: entry.has_quickwin,
    quickwin_text: entry.quickwin_text,
  }, { onConflict: 'user_id,entry_date' }).then();
}

function syncAchievementsToSupabase(userId: string, ids: AchievementId[]) {
  if (!ids.length) return;
  const supabase = createClient();
  supabase.from('user_achievements').upsert(
    ids.map(id => ({ user_id: userId, achievement_id: id })),
    { onConflict: 'user_id,achievement_id' }
  ).then();
}

interface OnboardingData {
  name: string;
  age: number;
  job: string;
  goal: string;
  weeklyQuickWinTarget: number;
  values: UserValue[];
}

interface AppState {
  profile: UserProfile;
  todayEntry: DailyEntry | null;
  unlockedAchievements: AchievementId[];
  newlyUnlocked: AchievementId[];
  weeklyGoal: WeeklyGoal;
  isInitialized: boolean;
  xpGained: number;
  leveledUp: number | null;
  userId: string | null;

  init: () => void;
  initWithUser: (userId: string) => Promise<void>;
  saveMood: (mood: Mood, context: CheckinContext) => void;
  saveAnswers: (answers: string[], context: CheckinContext) => void;
  saveQuickWin: (text: string) => void;
  completeCheckin: (context: CheckinContext, usedPromptLibrary?: boolean, perspectiveCompleted?: boolean) => void;
  useStreakFreeze: () => void;
  clearNewlyUnlocked: () => void;
  saveOnboardingProfile: (data: OnboardingData) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  saveIntention: (intention: string) => void;
  saveIntentionResult: (result: 'done' | 'partial' | 'missed', comment?: string) => void;
  markInterventionDone: (note?: string) => void;
  incrementValueAnswer: (value: UserValue) => void;
  clearXPFeedback: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  profile: getProfile(),
  todayEntry: null,
  unlockedAchievements: [],
  newlyUnlocked: [],
  weeklyGoal: { checkins: 0, checkinGoal: 5, quickwins: 0, quickwinGoal: 2 },
  isInitialized: false,
  xpGained: 0,
  leveledUp: null,
  userId: null,

  init: () => {
    const profile = getProfile();
    const today = todayISO();
    const entry = getEntryByDate(today) ?? createEmptyEntry(today);
    const unlockedIds = getUnlockedIds();
    const weeklyGoal: WeeklyGoal = {
      checkins: getWeeklyCheckins(),
      checkinGoal: 5,
      quickwins: getWeeklyQuickWins(),
      quickwinGoal: profile.weekly_quickwin_target ?? 2,
    };
    set({ profile, todayEntry: entry, unlockedAchievements: unlockedIds, weeklyGoal, isInitialized: true });
  },

  initWithUser: async (userId: string) => {
    set({ userId });
    const supabase = createClient();

    // 1. Load profile from Supabase (source of truth for stats)
    const { data: dbProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (dbProfile) {
      const localProfile = getProfile();
      const merged: UserProfile = {
        ...localProfile,
        id: userId,
        display_name: dbProfile.display_name ?? localProfile.display_name,
        streak: dbProfile.streak,
        longest_streak: dbProfile.longest_streak,
        freeze_used_this_week: dbProfile.freeze_used_this_week,
        last_checkin_date: dbProfile.last_checkin_date,
        total_checkins: dbProfile.total_checkins,
        total_quickwins: dbProfile.total_quickwins,
      };
      saveProfile(merged);
      set({ profile: merged });
    } else {
      const localProfile = getProfile();
      const updated = { ...localProfile, id: userId };
      saveProfile(updated);
      set({ profile: updated });
    }

    // 2. Load today's entry from Supabase
    const today = todayISO();
    const { data: dbEntry } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('entry_date', today)
      .single();

    if (dbEntry) {
      const localEntry = getEntryByDate(today) ?? createEmptyEntry(today);
      const merged: DailyEntry = { ...localEntry, ...dbEntry };
      saveEntry(merged);
      set({ todayEntry: merged });
    }

    // 3. Load achievements from Supabase
    const { data: dbAchievements } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    if (dbAchievements && dbAchievements.length > 0) {
      const ids = dbAchievements.map(a => a.achievement_id as AchievementId);
      const localIds = getUnlockedIds();
      const merged = [...new Set([...localIds, ...ids])];
      merged.forEach(id => unlockAchievement(id));
      set({ unlockedAchievements: merged });
    }
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
    let updatedProfile = isNew
      ? { ...profile, total_quickwins: profile.total_quickwins + 1 }
      : profile;
    const { updatedProfile: profileWithXP, xpGained, leveledUp } = isNew
      ? applyXP(updatedProfile, XP.QUICK_WIN)
      : { updatedProfile, xpGained: 0, leveledUp: null };
    updatedProfile = profileWithXP;
    saveProfile(updatedProfile);
    set({
      todayEntry: updated,
      profile: updatedProfile,
      xpGained,
      leveledUp,
      weeklyGoal: {
        ...get().weeklyGoal,
        quickwins: getWeeklyQuickWins(),
      },
    });
    const { userId } = get();
    if (userId) {
      syncEntryToSupabase(userId, updated);
      syncProfileToSupabase(userId, updatedProfile);
    }
  },

  completeCheckin: (context, usedPromptLibrary = false, perspectiveCompleted = false) => {
    const { todayEntry, profile, unlockedAchievements } = get();
    if (!todayEntry) return;

    const updated: DailyEntry = context === 'morning'
      ? { ...todayEntry, morning_done: true }
      : { ...todayEntry, evening_done: true };
    saveEntry(updated);

    const { newStreak, shouldResetFreeze } = calculateStreak(profile);
    let updatedProfile: UserProfile = {
      ...profile,
      streak: newStreak,
      longest_streak: Math.max(profile.longest_streak, newStreak),
      last_checkin_date: todayISO(),
      total_checkins: profile.total_checkins + 1,
      freeze_used_this_week: shouldResetFreeze ? true : profile.freeze_used_this_week,
    };

    // Award XP for check-in
    let totalXP = context === 'morning' ? XP.MORNING_CHECKIN : XP.EVENING_CHECKIN;
    if (perspectiveCompleted) totalXP += XP.PERSPECTIVE_STEP;
    // Bonus for completing both morning + evening same day
    const bothDone = context === 'evening' && updated.morning_done;
    if (bothDone) totalXP += XP.BOTH_SAME_DAY_BONUS;
    // Streak milestone bonus
    const isStreakMilestone = [7, 14, 30, 100].includes(newStreak);
    if (isStreakMilestone) totalXP += XP.STREAK_MILESTONE;

    const { updatedProfile: profileWithXP, xpGained, leveledUp } = applyXP(updatedProfile, totalXP);
    updatedProfile = profileWithXP;
    saveProfile(updatedProfile);

    const newAchievements = checkAchievements(updatedProfile, updated, unlockedAchievements, usedPromptLibrary);
    newAchievements.forEach((id) => unlockAchievement(id));
    const allUnlocked = [...unlockedAchievements, ...newAchievements];

    set({
      todayEntry: updated,
      profile: updatedProfile,
      unlockedAchievements: allUnlocked,
      newlyUnlocked: newAchievements,
      weeklyGoal: { ...get().weeklyGoal, checkins: getWeeklyCheckins() },
      xpGained,
      leveledUp,
    });
    const { userId: uid } = get();
    if (uid) {
      syncEntryToSupabase(uid, updated);
      syncProfileToSupabase(uid, updatedProfile);
      syncAchievementsToSupabase(uid, newAchievements);
    }
  },

  useStreakFreeze: () => {
    const { profile } = get();
    if (profile.freeze_used_this_week) return;
    const updated = { ...profile, freeze_used_this_week: true };
    saveProfile(updated);
    set({ profile: updated });
  },

  clearNewlyUnlocked: () => set({ newlyUnlocked: [] }),

  saveOnboardingProfile: (data) => {
    const { profile, unlockedAchievements } = get();
    const updated: UserProfile = {
      ...profile,
      onboarding_name: data.name,
      onboarding_age: data.age,
      onboarding_job: data.job,
      onboarding_goal: data.goal,
      weekly_quickwin_target: data.weeklyQuickWinTarget,
      display_name: data.name,
      onboarding_complete: true,
      values: data.values,
      value_answer_counts: {},
    };
    saveProfile(updated);
    const newAchievements = checkAchievements(updated, get().todayEntry!, unlockedAchievements, false);
    newAchievements.forEach((id) => unlockAchievement(id));
    const allUnlocked = [...unlockedAchievements, ...newAchievements];
    set({
      profile: updated,
      weeklyGoal: { ...get().weeklyGoal, quickwinGoal: data.weeklyQuickWinTarget },
      unlockedAchievements: allUnlocked,
      newlyUnlocked: newAchievements,
    });
    const { userId } = get();
    if (userId) {
      syncProfileToSupabase(userId, updated);
      syncAchievementsToSupabase(userId, newAchievements);
    }
  },

  updateProfile: (updates) => {
    const { profile } = get();
    const updated = { ...profile, ...updates };
    saveProfile(updated);
    set({ profile: updated });
  },

  saveIntention: (intention) => {
    const { todayEntry } = get();
    if (!todayEntry) return;
    const updated: DailyEntry = { ...todayEntry, morning_intention: intention };
    saveEntry(updated);
    set({ todayEntry: updated });
  },

  saveIntentionResult: (result, comment = '') => {
    const { todayEntry, profile, unlockedAchievements } = get();
    if (!todayEntry) return;
    const updated: DailyEntry = {
      ...todayEntry,
      intention_result: result,
      intention_comment: comment || null,
    };
    saveEntry(updated);
    // Increment loop_closed_count when a loop is actually completed (any result)
    let updatedProfile: UserProfile = {
      ...profile,
      loop_closed_count: (profile.loop_closed_count ?? 0) + 1,
    };
    const { updatedProfile: profileWithXP, xpGained, leveledUp } = applyXP(updatedProfile, XP.INTENTION_LOOP_CLOSED);
    updatedProfile = profileWithXP;
    saveProfile(updatedProfile);
    const newAchievements = checkAchievements(updatedProfile, updated, unlockedAchievements);
    newAchievements.forEach((id) => unlockAchievement(id));
    const allUnlocked = [...unlockedAchievements, ...newAchievements];
    set({
      todayEntry: updated,
      profile: updatedProfile,
      unlockedAchievements: allUnlocked,
      newlyUnlocked: newAchievements,
      xpGained,
      leveledUp,
    });
  },

  clearXPFeedback: () => set({ xpGained: 0, leveledUp: null }),

  markInterventionDone: (note?: string) => {
    const { todayEntry, profile } = get();
    if (!todayEntry || todayEntry.intervention_done) return;
    const updated: DailyEntry = { ...todayEntry, intervention_done: true, intervention_note: note?.trim() || null };
    saveEntry(updated);
    const { updatedProfile, xpGained, leveledUp } = applyXP(profile, XP.INTERVENTION_DONE);
    saveProfile(updatedProfile);
    set({ todayEntry: updated, profile: updatedProfile, xpGained, leveledUp });
  },

  incrementValueAnswer: (value) => {
    const { profile } = get();
    const counts = { ...(profile.value_answer_counts ?? {}) };
    counts[value] = (counts[value] ?? 0) + 1;
    const updated = { ...profile, value_answer_counts: counts };
    saveProfile(updated);
    set({ profile: updated });
  },
}));

// ─── Internal helper ─────────────────────────────────────────────────────────

function applyXP(
  profile: UserProfile,
  amount: number,
): { updatedProfile: UserProfile; xpGained: number; leveledUp: number | null } {
  const newXP = Math.max(0, (profile.xp ?? 0) + amount);
  const oldLevel = profile.level ?? 1;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > oldLevel ? newLevel : null;
  return {
    updatedProfile: { ...profile, xp: newXP, level: newLevel },
    xpGained: amount > 0 ? amount : 0,
    leveledUp,
  };
}
