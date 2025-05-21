-- Создание таблицы для записей настроения
CREATE TABLE mood_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  emoji TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Внешний ключ для связи с таблицей пользователей Supabase Auth
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users (id)
    ON DELETE CASCADE
);

-- Настройка RLS (Row Level Security) для таблицы mood_entries
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

-- Политика для чтения: пользователи могут видеть только свои записи
CREATE POLICY "Users can view their own entries" 
  ON mood_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Политика для вставки: пользователи могут создавать записи только для себя
CREATE POLICY "Users can insert their own entries" 
  ON mood_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Политика для обновления: пользователи могут обновлять только свои записи
CREATE POLICY "Users can update their own entries" 
  ON mood_entries 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Политика для удаления: пользователи могут удалять только свои записи
CREATE POLICY "Users can delete their own entries" 
  ON mood_entries 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Создание индекса для ускорения поиска по user_id
CREATE INDEX idx_mood_entries_user_id ON mood_entries(user_id);

-- Создание индекса для ускорения поиска по дате
CREATE INDEX idx_mood_entries_date ON mood_entries(date);
