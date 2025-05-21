-- Создание таблицы для напоминаний
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  time TIME NOT NULL,
  days TEXT[] NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Создание индекса для быстрого поиска напоминаний по пользователю
CREATE INDEX IF NOT EXISTS reminders_user_id_idx ON reminders(user_id);

-- Создание таблицы для достижений
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Создание индекса для быстрого поиска достижений по пользователю
CREATE INDEX IF NOT EXISTS achievements_user_id_idx ON achievements(user_id);

-- Создание уникального индекса для предотвращения дублирования достижений
CREATE UNIQUE INDEX IF NOT EXISTS achievements_user_achievement_idx ON achievements(user_id, achievement_id);

-- Создание политик безопасности для таблицы напоминаний
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reminders"
  ON reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders"
  ON reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
  ON reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
  ON reminders FOR DELETE
  USING (auth.uid() = user_id);

-- Создание политик безопасности для таблицы достижений
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
  ON achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
  ON achievements FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own achievements"
  ON achievements FOR DELETE
  USING (auth.uid() = user_id);
