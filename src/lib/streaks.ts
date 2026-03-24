import { UserProfile } from '@/types';

/** Prüft ob heute bereits eingecheckt wurde */
export function hasCheckedInToday(profile: UserProfile): boolean {
  if (!profile.last_checkin_date) return false;
  const today = new Date().toISOString().split('T')[0];
  return profile.last_checkin_date === today;
}

/** Berechnet ob der Streak weiterläuft, resettet oder eingefroren wurde */
export function calculateStreak(profile: UserProfile): {
  newStreak: number;
  shouldResetFreeze: boolean;
} {
  const today = new Date().toISOString().split('T')[0];
  const last = profile.last_checkin_date;

  if (!last) {
    return { newStreak: 1, shouldResetFreeze: false };
  }

  const lastDate = new Date(last);
  const todayDate = new Date(today);
  const diffDays = Math.floor(
    (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    // Bereits heute eingecheckt — kein Change
    return { newStreak: profile.streak, shouldResetFreeze: false };
  }

  if (diffDays === 1) {
    // Gestern eingecheckt — Streak verlängern
    return { newStreak: profile.streak + 1, shouldResetFreeze: false };
  }

  if (diffDays === 2 && !profile.freeze_used_this_week) {
    // 1 Tag verpasst, Freeze verfügbar → Streak gerettet, Freeze verbraucht
    return { newStreak: profile.streak + 1, shouldResetFreeze: true };
  }

  // Mehr als 1 Tag (oder Freeze verbraucht) → Reset
  return { newStreak: 1, shouldResetFreeze: false };
}

/** Prüft ob Freeze diese Woche bereits genutzt wurde */
export function canUseFreeze(profile: UserProfile): boolean {
  return !profile.freeze_used_this_week;
}

/** ISO-Datum für heute */
export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}
