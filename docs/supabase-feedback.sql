-- Создание таблицы feedback
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT check_user_or_email CHECK (user_id IS NOT NULL OR email IS NOT NULL)
);

-- Настройка RLS (Row Level Security)
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Политика для создания обратной связи (любой пользователь может создать)
CREATE POLICY "Anyone can create feedback" ON public.feedback
  FOR INSERT WITH CHECK (true);

-- Политика для чтения обратной связи (только администраторы)
CREATE POLICY "Only admins can read feedback" ON public.feedback
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM public.user_settings WHERE is_admin = true
  ));

-- Комментарии к таблице и полям
COMMENT ON TABLE public.feedback IS 'Обратная связь от пользователей';
COMMENT ON COLUMN public.feedback.id IS 'Уникальный идентификатор записи обратной связи';
COMMENT ON COLUMN public.feedback.user_id IS 'Идентификатор пользователя из auth.users (может быть NULL для анонимной обратной связи)';
COMMENT ON COLUMN public.feedback.email IS 'Email пользователя (для анонимной обратной связи)';
COMMENT ON COLUMN public.feedback.rating IS 'Оценка от 1 до 5';
COMMENT ON COLUMN public.feedback.comment IS 'Комментарий пользователя';
COMMENT ON COLUMN public.feedback.created_at IS 'Дата и время создания записи';
