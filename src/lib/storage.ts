import { DailyEntry, UserProfile, UserAchievement, AchievementId } from '@/types';

const KEYS = {
  profile: 'dailyecho_profile',
  entries: 'dailyecho_entries',
  achievements: 'dailyecho_achievements',
};

// ─── Profile ─────────────────────────────────────────────────────────────────

export function getProfile(): UserProfile {
  if (typeof window === 'undefined') return defaultProfile();
  const raw = localStorage.getItem(KEYS.profile);
  return raw ? JSON.parse(raw) : defaultProfile();
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

function defaultProfile(): UserProfile {
  return {
    id: 'local-user',
    display_name: null,
    created_at: new Date().toISOString(),
    streak: 0,
    longest_streak: 0,
    freeze_used_this_week: false,
    last_checkin_date: null,
    total_checkins: 0,
    total_quickwins: 0,
  };
}

// ─── Daily Entries ────────────────────────────────────────────────────────────

export function getAllEntries(): DailyEntry[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEYS.entries);
  return raw ? JSON.parse(raw) : [];
}

export function getEntryByDate(date: string): DailyEntry | null {
  return getAllEntries().find((e) => e.entry_date === date) ?? null;
}

export function saveEntry(entry: DailyEntry): void {
  const entries = getAllEntries();
  const idx = entries.findIndex((e) => e.entry_date === entry.entry_date);
  if (idx >= 0) {
    entries[idx] = entry;
  } else {
    entries.push(entry);
  }
  localStorage.setItem(KEYS.entries, JSON.stringify(entries));
}

export function createEmptyEntry(date: string): DailyEntry {
  return {
    id: crypto.randomUUID(),
    user_id: 'local-user',
    entry_date: date,
    morning_done: false,
    evening_done: false,
    morning_mood: null,
    evening_mood: null,
    morning_answers: null,
    evening_answers: null,
    has_quickwin: false,
    quickwin_text: null,
    created_at: new Date().toISOString(),
  };
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export function getUnlockedAchievements(): UserAchievement[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEYS.achievements);
  return raw ? JSON.parse(raw) : [];
}

export function getUnlockedIds(): AchievementId[] {
  return getUnlockedAchievements().map((a) => a.achievement_id);
}

export function unlockAchievement(id: AchievementId): void {
  const achievements = getUnlockedAchievements();
  if (achievements.some((a) => a.achievement_id === id)) return;
  achievements.push({
    id: crypto.randomUUID(),
    user_id: 'local-user',
    achievement_id: id,
    unlocked_at: new Date().toISOString(),
  });
  localStorage.setItem(KEYS.achievements, JSON.stringify(achievements));
}

// ─── Weekly Stats ─────────────────────────────────────────────────────────────

export function getWeeklyQuickWins(): number {
  const entries = getAllEntries();
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sonntag
  startOfWeek.setHours(0, 0, 0, 0);
  return entries.filter(
    (e) => e.has_quickwin && new Date(e.entry_date) >= startOfWeek
  ).length;
}

export function getWeeklyCheckins(): number {
  const entries = getAllEntries();
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return entries.filter(
    (e) =>
      (e.morning_done || e.evening_done) &&
      new Date(e.entry_date) >= startOfWeek
  ).length;
}

// ─── "On this Day" ────────────────────────────────────────────────────────────

export function getOnThisDay(): DailyEntry[] {
  const entries = getAllEntries();
  const today = new Date();
  const mmdd = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const todayISO = today.toISOString().split('T')[0];
  return entries.filter((e) => {
    const entryMMDD = e.entry_date.slice(5);
    return entryMMDD === mmdd && e.entry_date !== todayISO;
  });
}
