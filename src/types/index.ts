export type UserRole = 'admin' | 'user' | 'guest';

export type UserValue =
  | 'Familie'
  | 'Karriere'
  | 'Gesundheit'
  | 'Kreativität'
  | 'Freundschaft'
  | 'Sinn'
  | 'Wachstum'
  | 'Ruhe'
  | 'Abenteuer'
  | 'Finanzen';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  created_at: string;
}

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
  journal_text: string | null;      // Freies Journaling
  has_quickwin: boolean;
  quickwin_text: string | null;
  // Sprint 2: Intention-Loop
  morning_intention: string | null;
  intention_result: 'done' | 'partial' | 'missed' | null;
  intention_comment: string | null;
  // Sprint 4: Micro-Interventions
  intervention_done: boolean;
  created_at: string;
}

export interface QuickWin {
  id: string;
  user_id: string;
  text: string;
  date: string;       // ISO date
  week: string;       // ISO week "2026-W12"
  created_at: string;
}

export interface NotificationPrefs {
  enabled: boolean;
  morningTime: string;  // "08:00"
  eveningTime: string;  // "19:00"
  quickwinReminder: boolean;
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
  // Onboarding
  onboarding_name: string | null;
  onboarding_age: number | null;
  onboarding_job: string | null;
  onboarding_goal: string | null;
  weekly_quickwin_target: number;
  onboarding_complete: boolean;
  loop_closed_count: number; // Sprint 2
  // Sprint 3: XP/Level
  xp: number;
  level: number;
  // Sprint 5: Values Compass
  values: UserValue[];
  value_answer_counts: Partial<Record<UserValue, number>>;
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
  | 'deep_diver'
  | 'goal_setter'
  | 'loop_closed';

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
