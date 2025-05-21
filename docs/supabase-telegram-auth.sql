-- Создание таблицы для хранения данных пользователей Telegram
CREATE TABLE IF NOT EXISTS public.telegram_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  telegram_id BIGINT NOT NULL UNIQUE,
  username TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT,
  photo_url TEXT,
  auth_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Включение расширения для триггеров
CREATE EXTENSION IF NOT EXISTS "moddatetime";

-- Создание триггера для автоматического обновления updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.telegram_users
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-- Настройка RLS (Row Level Security)
ALTER TABLE public.telegram_users ENABLE ROW LEVEL SECURITY;

-- Политика для чтения собственных данных
CREATE POLICY "Users can read their own telegram data" ON public.telegram_users
  FOR SELECT USING (auth.uid() = user_id);

-- Политика для создания собственных данных (через API)
CREATE POLICY "Service can create telegram data" ON public.telegram_users
  FOR INSERT WITH CHECK (true);

-- Политика для обновления собственных данных
CREATE POLICY "Users can update their own telegram data" ON public.telegram_users
  FOR UPDATE USING (auth.uid() = user_id);

-- Комментарии к таблице и полям
COMMENT ON TABLE public.telegram_users IS 'Данные пользователей, аутентифицированных через Telegram';
COMMENT ON COLUMN public.telegram_users.id IS 'Уникальный идентификатор записи';
COMMENT ON COLUMN public.telegram_users.user_id IS 'Идентификатор пользователя из auth.users';
COMMENT ON COLUMN public.telegram_users.telegram_id IS 'Идентификатор пользователя в Telegram';
COMMENT ON COLUMN public.telegram_users.username IS 'Имя пользователя в Telegram';
COMMENT ON COLUMN public.telegram_users.first_name IS 'Имя пользователя';
COMMENT ON COLUMN public.telegram_users.last_name IS 'Фамилия пользователя';
COMMENT ON COLUMN public.telegram_users.photo_url IS 'URL фотографии профиля';
COMMENT ON COLUMN public.telegram_users.auth_date IS 'Дата аутентификации в Telegram';
COMMENT ON COLUMN public.telegram_users.created_at IS 'Дата и время создания записи';
COMMENT ON COLUMN public.telegram_users.updated_at IS 'Дата и время последнего обновления записи';
