-- Проверка существования таблицы user_settings
DO $$
BEGIN
    -- Проверяем, существует ли таблица user_settings
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_settings'
    ) THEN
        -- Проверяем, существует ли колонка is_admin
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'user_settings' 
            AND column_name = 'is_admin'
        ) THEN
            -- Добавляем колонку is_admin, если она не существует
            ALTER TABLE public.user_settings ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;
            
            -- Добавляем комментарий к колонке
            COMMENT ON COLUMN public.user_settings.is_admin IS 'Флаг администратора';
            
            RAISE NOTICE 'Колонка is_admin успешно добавлена в таблицу user_settings';
        ELSE
            RAISE NOTICE 'Колонка is_admin уже существует в таблице user_settings';
        END IF;
    ELSE
        RAISE NOTICE 'Таблица user_settings не существует. Сначала создайте таблицу.';
    END IF;
END $$;
