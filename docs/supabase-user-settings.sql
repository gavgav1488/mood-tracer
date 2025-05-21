-- Создание таблицы user_settings
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN NOT NULL DEFAULT false,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  theme_preference TEXT CHECK (theme_preference IN ('light', 'dark', 'system')) DEFAULT 'system',
  notification_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Включение расширения для триггеров
CREATE EXTENSION IF NOT EXISTS "moddatetime";

-- Создание триггера для автоматического обновления updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

-- Настройка RLS (Row Level Security)
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Политика для чтения собственных настроек
CREATE POLICY "Users can read their own settings" ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);

-- Политика для чтения публичных профилей
CREATE POLICY "Users can read public profiles" ON public.user_settings
  FOR SELECT USING (is_public = true);

-- Политика для создания собственных настроек
CREATE POLICY "Users can create their own settings" ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Политика для обновления собственных настроек
CREATE POLICY "Users can update their own settings" ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Комментарии к таблице и полям
COMMENT ON TABLE public.user_settings IS 'Настройки пользователей приложения';
COMMENT ON COLUMN public.user_settings.id IS 'Уникальный идентификатор записи настроек';
COMMENT ON COLUMN public.user_settings.user_id IS 'Идентификатор пользователя из auth.users';
COMMENT ON COLUMN public.user_settings.is_public IS 'Флаг публичности профиля пользователя';
COMMENT ON COLUMN public.user_settings.is_admin IS 'Флаг администратора';
COMMENT ON COLUMN public.user_settings.theme_preference IS 'Предпочтительная тема оформления';
COMMENT ON COLUMN public.user_settings.notification_enabled IS 'Флаг включения уведомлений';
COMMENT ON COLUMN public.user_settings.created_at IS 'Дата и время создания записи';
COMMENT ON COLUMN public.user_settings.updated_at IS 'Дата и время последнего обновления записи';
