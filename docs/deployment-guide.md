# Руководство по развертыванию

Это руководство описывает процесс развертывания приложения на Vercel и настройки CI/CD с использованием GitHub Actions.

## Предварительные требования

1. Аккаунт на [Vercel](https://vercel.com)
2. Аккаунт на [GitHub](https://github.com)
3. Аккаунт на [Sentry](https://sentry.io) (для мониторинга ошибок)
4. Проект в [Supabase](https://supabase.com)

## Шаг 1: Настройка проекта на Vercel

1. Войдите в свой аккаунт Vercel
2. Нажмите "Add New" > "Project"
3. Импортируйте репозиторий из GitHub
4. Настройте переменные окружения:
   - `NEXT_PUBLIC_SUPABASE_URL` - URL вашего проекта Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Анонимный ключ вашего проекта Supabase
   - `NEXT_PUBLIC_SENTRY_DSN` - DSN вашего проекта Sentry
5. Нажмите "Deploy"

## Шаг 2: Настройка GitHub Actions

Для автоматизации тестирования и деплоя мы используем GitHub Actions. Файлы конфигурации уже созданы в репозитории:

- `.github/workflows/test.yml` - запускает тесты при каждом пуше и PR
- `.github/workflows/deploy.yml` - автоматически деплоит на Vercel при пуше в ветку main

Для настройки автоматического деплоя на Vercel через GitHub Actions:

1. Создайте токен Vercel:
   - Перейдите в [настройки аккаунта Vercel](https://vercel.com/account/tokens)
   - Создайте новый токен
   - Скопируйте токен

2. Получите ID организации и проекта:
   - Выполните команду `vercel whoami` для получения ID организации
   - Выполните команду `vercel projects list` для получения ID проекта

3. Добавьте секреты в репозиторий GitHub:
   - Перейдите в настройки репозитория > Secrets > Actions
   - Добавьте следующие секреты:
     - `VERCEL_TOKEN` - токен Vercel
     - `VERCEL_ORG_ID` - ID организации Vercel
     - `VERCEL_PROJECT_ID` - ID проекта Vercel
     - `NEXT_PUBLIC_SUPABASE_URL` - URL вашего проекта Supabase
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Анонимный ключ вашего проекта Supabase
     - `NEXT_PUBLIC_SENTRY_DSN` - DSN вашего проекта Sentry

## Шаг 3: Настройка Sentry

1. Создайте проект в Sentry:
   - Войдите в свой аккаунт Sentry
   - Создайте новый проект для Next.js
   - Скопируйте DSN проекта

2. Добавьте DSN в переменные окружения:
   - Добавьте `NEXT_PUBLIC_SENTRY_DSN` в переменные окружения Vercel
   - Добавьте `NEXT_PUBLIC_SENTRY_DSN` в секреты GitHub Actions

## Шаг 4: Настройка домена (опционально)

1. В панели управления Vercel перейдите в настройки проекта > Domains
2. Добавьте свой домен и следуйте инструкциям для настройки DNS

## Шаг 5: Мониторинг и аналитика

1. Настройте аналитику в Vercel:
   - Перейдите в настройки проекта > Analytics
   - Включите аналитику и выберите провайдера

2. Мониторинг ошибок в Sentry:
   - Перейдите в панель управления Sentry
   - Настройте оповещения для критических ошибок

## Шаг 6: Проверка развертывания

После настройки CI/CD и деплоя:

1. Внесите изменение в код и создайте коммит
2. Отправьте изменения в ветку main
3. Проверьте, что GitHub Actions запустил тесты и деплой
4. Убедитесь, что приложение успешно развернуто на Vercel

## Дополнительные ресурсы

- [Документация Vercel](https://vercel.com/docs)
- [Документация GitHub Actions](https://docs.github.com/en/actions)
- [Документация Sentry для Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Документация Supabase](https://supabase.com/docs)
