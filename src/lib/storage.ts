import { DailyEntry, UserProfile, UserAchievement, AchievementId, QuickWin, NotificationPrefs } from '@/types';

const KEYS = {
  profile: 'dailyecho_profile',
  entries: 'dailyecho_entries',
  achievements: 'dailyecho_achievements',
  quickwins: 'dailyecho_quickwins',
  notifPrefs: 'dailyecho_notif_prefs',
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
    journal_text: null,
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

// ─── Journal ──────────────────────────────────────────────────────────────────

export function saveJournal(date: string, text: string): void {
  const entry = getEntryByDate(date) ?? createEmptyEntry(date);
  saveEntry({ ...entry, journal_text: text });
}

// ─── Quick Wins (eigenständige Liste) ────────────────────────────────────────

export function getAllQuickWins(): QuickWin[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEYS.quickwins);
  return raw ? JSON.parse(raw) : [];
}

function getISOWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

export function addQuickWin(text: string, date: string): QuickWin {
  const wins = getAllQuickWins();
  const win: QuickWin = {
    id: crypto.randomUUID(),
    user_id: 'local-user',
    text,
    date,
    week: getISOWeek(new Date(date)),
    created_at: new Date().toISOString(),
  };
  wins.push(win);
  localStorage.setItem(KEYS.quickwins, JSON.stringify(wins));
  return win;
}

export function deleteQuickWin(id: string): void {
  const wins = getAllQuickWins().filter((w) => w.id !== id);
  localStorage.setItem(KEYS.quickwins, JSON.stringify(wins));
}

export function getQuickWinsForWeek(week?: string): QuickWin[] {
  const targetWeek = week ?? getISOWeek(new Date());
  return getAllQuickWins().filter((w) => w.week === targetWeek);
}

export function getQuickWinsForDate(date: string): QuickWin[] {
  return getAllQuickWins().filter((w) => w.date === date);
}

// ─── Notification Preferences ────────────────────────────────────────────────

const defaultNotifPrefs = (): NotificationPrefs => ({
  enabled: false,
  morningTime: '08:00',
  eveningTime: '19:00',
  quickwinReminder: true,
});

export function getNotifPrefs(): NotificationPrefs {
  if (typeof window === 'undefined') return defaultNotifPrefs();
  const raw = localStorage.getItem(KEYS.notifPrefs);
  return raw ? { ...defaultNotifPrefs(), ...JSON.parse(raw) } : defaultNotifPrefs();
}

export function saveNotifPrefs(prefs: NotificationPrefs): void {
  localStorage.setItem(KEYS.notifPrefs, JSON.stringify(prefs));
}
