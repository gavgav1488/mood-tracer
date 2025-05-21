// Этот файл содержит только типы и утилиты для работы с Supabase
// Клиент Supabase создается в компонентах с помощью createBrowserClient или createServerClient

export type MoodEntry = {
  id: string;
  user_id: string;
  date: string;
  emoji: string;
  note: string;
  created_at: string;
};

export type UserSettings = {
  id: string;
  user_id: string;
  is_public: boolean;
  theme_preference?: 'light' | 'dark' | 'system';
  notification_enabled?: boolean;
  created_at: string;
  updated_at: string;
};

export type Feedback = {
  id: string;
  user_id?: string;
  email?: string;
  rating: number;
  comment?: string;
  created_at: string;
};
