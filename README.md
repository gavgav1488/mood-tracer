# Дневник настроения для подростков

Веб-приложение для ведения дневника настроения с креативной визуализацией эмоций.

## Технологии

- **Фронтенд**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Визуализация**: p5.js
- **Бэкенд и аутентификация**: Supabase
- **Хостинг**: Vercel
- **Тестирование**: Jest, React Testing Library, Cypress
- **CI/CD**: GitHub Actions
- **Мониторинг ошибок**: Sentry
- **Пакетный менеджер**: pnpm

## Начало работы

1. Клонируйте репозиторий:

```bash
git clone https://github.com/your-username/mood-tracer.git
cd mood-tracer
```

2. Установите зависимости:

```bash
pnpm install
```

3. Настройте переменные окружения:

Создайте файл `.env.local` и добавьте следующие переменные:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

4. Запустите сервер разработки:

```bash
pnpm dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере, чтобы увидеть результат.

## Настройка аутентификации

Для настройки аутентификации через социальные сети (Google, VK, Telegram) следуйте инструкциям в файле [docs/supabase-auth-setup.md](docs/supabase-auth-setup.md).

## Структура проекта

- `app/` - Страницы и маршруты приложения (Next.js App Router)
- `src/components/` - Компоненты React
- `src/hooks/` - Пользовательские хуки React
- `src/context/` - Контексты React
- `src/lib/` - Утилиты и типы
- `docs/` - Документация проекта

## План разработки

Подробный план разработки проекта находится в файле [docs/development_plan.md](docs/development_plan.md).

## Тестирование

### Модульное тестирование

Для запуска модульных тестов используйте:

```bash
pnpm test
```

Для запуска тестов в режиме отслеживания изменений:

```bash
pnpm test:watch
```

### Интеграционное тестирование

Для запуска интеграционных тестов с использованием Cypress:

```bash
pnpm test:e2e
```

Для запуска тестов в режиме без интерфейса:

```bash
pnpm test:e2e:headless
```

## CI/CD и развертывание

Проект настроен для автоматического тестирования и развертывания с использованием GitHub Actions и Vercel.

### Ручное развертывание

Для ручного развертывания приложения используйте:

```bash
vercel
```

Подробные инструкции по настройке CI/CD и развертыванию находятся в файле [docs/deployment-guide.md](docs/deployment-guide.md).

## Лицензия

MIT
