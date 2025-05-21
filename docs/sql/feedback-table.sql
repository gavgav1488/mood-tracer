-- Создание таблицы для обратной связи
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  usability TEXT NOT NULL CHECK (usability IN ('bad', 'average', 'good', 'excellent')),
  design TEXT NOT NULL CHECK (design IN ('bad', 'average', 'good', 'excellent')),
  features TEXT NOT NULL CHECK (features IN ('bad', 'average', 'good', 'excellent')),
  comments TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Включение расширения для генерации UUID, если оно еще не включено
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Настройка RLS (Row Level Security)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Политика для администраторов (могут видеть все отзывы)
CREATE POLICY admin_feedback_policy ON feedback
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users
    WHERE auth.email() = 'admin@example.com' -- Замените на email администратора
  ));

-- Политика для пользователей (могут видеть только свои отзывы)
CREATE POLICY user_feedback_policy ON feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Политика для создания отзывов (любой пользователь может создать отзыв)
CREATE POLICY insert_feedback_policy ON feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Политика для анонимных пользователей (могут создавать отзывы без привязки к пользователю)
CREATE POLICY anon_insert_feedback_policy ON feedback
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- Создание триггера для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_feedback_updated_at
BEFORE UPDATE ON feedback
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
