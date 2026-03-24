export type Mood = 1 | 2 | 3 | 4 | 5;
export type CheckinContext = 'morning' | 'evening';

export interface DailyEntry {
  id: string;
  user_id: string;
  entry_date: string; // ISO date "2026-03-24"
  morning_done: boolean;
  evening_done: boolean;
  morning_mood: Mood | null;
  evening_mood: Mood | null;
  morning_answers: string[] | null; // 3 Antworten
  evening_answers: string[] | null;
  has_quickwin: boolean;
  quickwin_text: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string | null;
  created_at: string;
  streak: number;
  longest_streak: number;
  freeze_used_this_week: boolean;
  last_checkin_date: string | null;
  total_checkins: number;
  total_quickwins: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: AchievementId;
  unlocked_at: string;
}

export type AchievementId =
  | 'first_spark'
  | 'week_one'
  | 'iron_will'
  | 'summit'
  | 'first_win'
  | 'on_a_roll'
  | 'both_worlds'
  | 'deep_diver';

export interface Achievement {
  id: AchievementId;
  label: string;
  emoji: string;
  description: string;
}

export interface MoodSuggestion {
  title: string;
  description: string;
}

export interface WeeklyGoal {
  checkins: number;     // aktuell
  checkinGoal: number;  // Ziel: 5
  quickwins: number;    // aktuell
  quickwinGoal: number; // Ziel: 2
}
