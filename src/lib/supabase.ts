// Этот файл содержит только типы и утилиты для работы с Supabase
// Клиент Supabase создается в компонентах с помощью createBrowserClient или createServerClient

export type MoodEntry = {
  id: string;
  user_id: string;
  date: string;
  emoji: string;
  note: string;
  created_at: string;
  tags?: string[];
  intensity?: number;
  x_position?: number;
  y_position?: number;
};

export type Reminder = {
  id: string;
  user_id: string;
  time: string;
  days: string[];
  enabled: boolean;
  message: string;
  created_at: string;
  updated_at: string;
};

export type Achievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
};

export type Tag = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type EntryTag = {
  id: string;
  entry_id: string;
  tag_id: string;
  created_at: string;
};
