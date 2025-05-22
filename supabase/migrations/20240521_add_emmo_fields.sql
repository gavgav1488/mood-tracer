-- Добавление новых полей в таблицу mood_entries для поддержки EMMO-стиля трекера
ALTER TABLE mood_entries ADD COLUMN IF NOT EXISTS intensity INTEGER;
ALTER TABLE mood_entries ADD COLUMN IF NOT EXISTS x_position FLOAT;
ALTER TABLE mood_entries ADD COLUMN IF NOT EXISTS y_position FLOAT;

-- Комментарии к полям
COMMENT ON COLUMN mood_entries.intensity IS 'Интенсивность эмоции (от 1 до 100)';
COMMENT ON COLUMN mood_entries.x_position IS 'Координата X на карте эмоций (от 0 до 100)';
COMMENT ON COLUMN mood_entries.y_position IS 'Координата Y на карте эмоций (от 0 до 100)';
