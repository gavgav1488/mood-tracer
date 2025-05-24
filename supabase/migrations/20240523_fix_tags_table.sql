-- Проверка существования таблицы tags
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'tags') THEN
        -- Создание таблицы для тегов
        CREATE TABLE IF NOT EXISTS tags (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );

        -- Создание индекса для быстрого поиска тегов по пользователю
        CREATE INDEX IF NOT EXISTS tags_user_id_idx ON tags(user_id);

        -- Создание уникального индекса для предотвращения дублирования тегов для одного пользователя
        CREATE UNIQUE INDEX IF NOT EXISTS tags_user_id_name_idx ON tags(user_id, name);

        -- Создание политик безопасности для таблицы тегов
        ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can view their own tags"
          ON tags FOR SELECT
          USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own tags"
          ON tags FOR INSERT
          WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own tags"
          ON tags FOR UPDATE
          USING (auth.uid() = user_id);

        CREATE POLICY "Users can delete their own tags"
          ON tags FOR DELETE
          USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Проверка существования таблицы entry_tags
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'entry_tags') THEN
        -- Создание таблицы для связи записей с тегами
        CREATE TABLE IF NOT EXISTS entry_tags (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          entry_id UUID NOT NULL REFERENCES mood_entries(id) ON DELETE CASCADE,
          tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );

        -- Создание индексов для быстрого поиска связей
        CREATE INDEX IF NOT EXISTS entry_tags_entry_id_idx ON entry_tags(entry_id);
        CREATE INDEX IF NOT EXISTS entry_tags_tag_id_idx ON entry_tags(tag_id);

        -- Создание уникального индекса для предотвращения дублирования связей
        CREATE UNIQUE INDEX IF NOT EXISTS entry_tags_entry_id_tag_id_idx ON entry_tags(entry_id, tag_id);

        -- Создание политик безопасности для таблицы связей
        ALTER TABLE entry_tags ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can view their own entry tags"
          ON entry_tags FOR SELECT
          USING (
            EXISTS (
              SELECT 1 FROM mood_entries
              WHERE mood_entries.id = entry_id
              AND mood_entries.user_id = auth.uid()
            )
          );

        CREATE POLICY "Users can insert their own entry tags"
          ON entry_tags FOR INSERT
          WITH CHECK (
            EXISTS (
              SELECT 1 FROM mood_entries
              WHERE mood_entries.id = entry_id
              AND mood_entries.user_id = auth.uid()
            )
          );

        CREATE POLICY "Users can delete their own entry tags"
          ON entry_tags FOR DELETE
          USING (
            EXISTS (
              SELECT 1 FROM mood_entries
              WHERE mood_entries.id = entry_id
              AND mood_entries.user_id = auth.uid()
            )
          );
    END IF;
END
$$;

-- Проверка наличия колонки tags в таблице mood_entries
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'mood_entries' 
        AND column_name = 'tags'
    ) THEN
        -- Добавление колонки tags в таблицу mood_entries для хранения массива тегов
        ALTER TABLE mood_entries ADD COLUMN tags TEXT[] DEFAULT '{}'::TEXT[];
    END IF;
END
$$;
