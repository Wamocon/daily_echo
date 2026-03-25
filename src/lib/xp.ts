// ─── XP Award Table ───────────────────────────────────────────────────────────

export const XP = {
  MORNING_CHECKIN: 20,
  EVENING_CHECKIN: 20,
  BOTH_SAME_DAY_BONUS: 15,
  QUICK_WIN: 25,
  INTENTION_LOOP_CLOSED: 20,
  PERSPECTIVE_STEP: 15,
  STREAK_MILESTONE: 100,
  DAY_MISSED: -5,
  DAYS_MISSED_LONG: -20, // 3+ days missed
} as const;

// ─── Level Thresholds ─────────────────────────────────────────────────────────

export interface LevelDef {
  level: number;
  title: string;
  minXP: number;
}

export const LEVELS: LevelDef[] = [
  { level: 1, title: 'Beginner',   minXP: 0 },
  { level: 2, title: 'Reflector',  minXP: 100 },
  { level: 3, title: 'Seeker',     minXP: 250 },
  { level: 4, title: 'Explorer',   minXP: 500 },
  { level: 5, title: 'Journaler',  minXP: 900 },
  { level: 6, title: 'Mindful',    minXP: 1500 },
  { level: 7, title: 'Achiever',   minXP: 2500 },
  { level: 8, title: 'Master',     minXP: 4000 },
  { level: 9, title: 'Sage',       minXP: 6500 },
  { level: 10, title: 'Echo Legend', minXP: 10000 },
];

export function calculateLevel(xp: number): number {
  let level = 1;
  for (const def of LEVELS) {
    if (xp >= def.minXP) level = def.level;
  }
  return level;
}

export function getLevelTitle(level: number): string {
  return LEVELS.find((l) => l.level === level)?.title ?? 'Beginner';
}

/** XP needed to reach next level. Returns null at max level. */
export function getNextLevelXP(currentXP: number): { next: number; current: number; total: number } | null {
  const currentLevel = calculateLevel(currentXP);
  const nextDef = LEVELS.find((l) => l.level === currentLevel + 1);
  if (!nextDef) return null;
  const currentDef = LEVELS.find((l) => l.level === currentLevel)!;
  return {
    next: nextDef.minXP,
    current: currentXP,
    total: nextDef.minXP - currentDef.minXP,
  };
}

/** XP progress within the current level (0–1). */
export function getLevelProgress(xp: number): number {
  const level = calculateLevel(xp);
  const currentDef = LEVELS.find((l) => l.level === level)!;
  const nextDef = LEVELS.find((l) => l.level === level + 1);
  if (!nextDef) return 1; // max level
  const range = nextDef.minXP - currentDef.minXP;
  const earned = xp - currentDef.minXP;
  return Math.min(earned / range, 1);
}

// ─── Unlockables ─────────────────────────────────────────────────────────────

export interface Unlockable {
  id: string;
  label: string;
  description: string;
  emoji: string;
  requiredLevel: number;
  category: 'theme' | 'feature' | 'cosmetic';
}

export const UNLOCKABLES: Unlockable[] = [
  { id: 'dark_mode',        label: 'Dark Mode',            description: 'Dunkles Theme für die App',             emoji: '🌙', requiredLevel: 2,  category: 'theme' },
  { id: 'frame_silver',     label: 'Silber-Rahmen',        description: 'Silberner Avatar-Rahmen',               emoji: '🥈', requiredLevel: 3,  category: 'cosmetic' },
  { id: 'prompt_tiefgang',  label: 'Tiefgang-Bibliothek',  description: 'Erweiterte Reflexionsfragen',           emoji: '📚', requiredLevel: 3,  category: 'feature' },
  { id: 'streak_emoji',     label: 'Streak-Emoji',         description: 'Eigenes Emoji für deinen Streak',       emoji: '✨', requiredLevel: 4,  category: 'cosmetic' },
  { id: 'heatmap',          label: 'Mood Heatmap',         description: 'Jahresübersicht aller Check-ins',       emoji: '🗓️', requiredLevel: 4,  category: 'feature' },
  { id: 'psycho_brief',     label: 'Wochen-Brief',         description: 'Persönliche Auswertung jede Woche',     emoji: '📬', requiredLevel: 5,  category: 'feature' },
  { id: 'frame_gold',       label: 'Gold-Rahmen',          description: 'Goldener Avatar-Rahmen',                emoji: '🥇', requiredLevel: 6,  category: 'cosmetic' },
  { id: 'extended_stats',   label: 'Erweiterte Stats',     description: 'Detaillierte Mood-Auswertungen',        emoji: '📊', requiredLevel: 6,  category: 'feature' },
  { id: 'frame_legendary',  label: 'Legendärer Rahmen',    description: 'Exklusiver Rahmen für Echo Legends',    emoji: '👑', requiredLevel: 10, category: 'cosmetic' },
];
