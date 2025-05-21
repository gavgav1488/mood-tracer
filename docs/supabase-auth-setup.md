# Настройка аутентификации в Supabase

## 1. Создание проекта в Supabase

1. Перейдите на [app.supabase.com](https://app.supabase.com/)
2. Войдите или зарегистрируйтесь
3. Нажмите "New Project"
4. Введите название проекта (например, "mood-tracer")
5. Выберите регион, ближайший к вашим пользователям
6. Установите надежный пароль для базы данных
7. Нажмите "Create new project"

## 2. Настройка таблиц

1. В панели управления Supabase перейдите в раздел "SQL Editor"
2. Создайте новый запрос
3. Вставьте содержимое файла `supabase-schema.sql`
4. Выполните запрос

## 3. Настройка аутентификации через Google

1. В панели управления Supabase перейдите в раздел "Authentication" -> "Providers"
2. Включите провайдер "Google"
3. Создайте проект в [Google Cloud Console](https://console.cloud.google.com/)
4. Настройте OAuth 2.0 для веб-приложения
5. Добавьте разрешенные URI перенаправления из Supabase
6. Скопируйте Client ID и Client Secret в настройки Supabase

## 4. Настройка аутентификации через VK

1. В панели управления Supabase перейдите в раздел "Authentication" -> "Providers"
2. Включите провайдер "Custom OAuth"
3. Создайте приложение в [VK Developers](https://vk.com/dev)
4. Настройте OAuth для веб-приложения
5. Добавьте разрешенные URI перенаправления из Supabase
6. Настройте Custom OAuth Provider в Supabase:
   - Имя провайдера: VK
   - Client ID: [ID вашего приложения VK]
   - Client Secret: [Защищенный ключ вашего приложения VK]
   - URL авторизации: https://oauth.vk.com/authorize
   - URL токена: https://oauth.vk.com/access_token
   - URL пользовательской информации: https://api.vk.com/method/users.get
   - Параметры запроса пользовательской информации: v=5.131&fields=photo_200
   - Атрибут ID пользователя: response.0.id
   - Атрибут имени пользователя: response.0.first_name
   - Атрибут email пользователя: email

## 5. Настройка аутентификации через Telegram

1. В панели управления Supabase перейдите в раздел "Authentication" -> "URL Configuration"
2. Скопируйте Site URL
3. Создайте бота в [BotFather](https://t.me/botfather)
4. Получите токен бота
5. Настройте Telegram Login Widget на вашем сайте
6. Интегрируйте виджет с Supabase Auth

## 6. Настройка переменных окружения

Обновите файл `.env.local` с вашими данными Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 7. Настройка политик безопасности

1. В панели управления Supabase перейдите в раздел "Authentication" -> "Policies"
2. Убедитесь, что политики для таблицы `mood_entries` настроены правильно
3. При необходимости добавьте дополнительные политики для других таблиц
