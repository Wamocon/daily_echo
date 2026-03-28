-- DailyEcho Datenbankschema
-- Migration: 001_initial_schema

-- Benutzerprofile (erweitert Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  streak INT DEFAULT 0 NOT NULL,
  longest_streak INT DEFAULT 0 NOT NULL,
  freeze_used_this_week BOOLEAN DEFAULT FALSE NOT NULL,
  last_checkin_date DATE,
  total_checkins INT DEFAULT 0 NOT NULL,
  total_quickwins INT DEFAULT 0 NOT NULL
);

-- Tageseinträge
CREATE TABLE IF NOT EXISTS daily_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  entry_date DATE NOT NULL,
  morning_done BOOLEAN DEFAULT FALSE NOT NULL,
  evening_done BOOLEAN DEFAULT FALSE NOT NULL,
  morning_mood INT CHECK (morning_mood BETWEEN 1 AND 5),
  evening_mood INT CHECK (evening_mood BETWEEN 1 AND 5),
  morning_answers JSONB,
  evening_answers JSONB,
  has_quickwin BOOLEAN DEFAULT FALSE NOT NULL,
  quickwin_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, entry_date)
);

-- Freigeschaltete Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, achievement_id)
);

-- Row Level Security aktivieren
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Jeder User sieht nur seine eigenen Daten
CREATE POLICY "profiles: eigene Daten lesen" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles: eigene Daten schreiben" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "daily_entries: eigene Einträge lesen" ON daily_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "daily_entries: eigene Einträge schreiben" ON daily_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "achievements: eigene Achievements lesen" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "achievements: eigene Achievements schreiben" ON user_achievements
  FOR ALL USING (auth.uid() = user_id);

-- Trigger: Profil automatisch bei Registrierung anlegen
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
