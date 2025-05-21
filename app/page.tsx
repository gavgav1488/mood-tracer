import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero секция */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Дневник настроения
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Простой способ отслеживать свои эмоции и настроение без лишней аналитики и давления статистики
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/login">Начать вести дневник</Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Link href="#features">Узнать больше</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 md:gap-8">
                <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-secondary/50">
                  <div className="text-4xl">😊</div>
                  <div className="text-center text-sm font-medium">Радость</div>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-secondary/50">
                  <div className="text-4xl">😢</div>
                  <div className="text-center text-sm font-medium">Грусть</div>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-secondary/50">
                  <div className="text-4xl">🥳</div>
                  <div className="text-center text-sm font-medium">Восторг</div>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-secondary/50">
                  <div className="text-4xl">😤</div>
                  <div className="text-center text-sm font-medium">Злость</div>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-secondary/50">
                  <div className="text-4xl">😐</div>
                  <div className="text-center text-sm font-medium">Нейтрально</div>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-secondary/50">
                  <div className="text-4xl">😰</div>
                  <div className="text-center text-sm font-medium">Тревога</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Секция с особенностями */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Особенности дневника
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Наш дневник настроения создан специально для подростков, которые хотят отслеживать свои эмоции без давления статистики
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary/10 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Безлимитные заметки</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Пишите столько, сколько хотите, без ограничений по объему текста
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary/10 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Выбор эмодзи</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Выражайте свои эмоции с помощью простых и понятных эмодзи
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
              <div className="rounded-full bg-primary/10 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M12 2v8L7 5" />
                  <circle cx="12" cy="14" r="8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Креативная визуализация</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Уникальная арт-визуализация, которая меняется в зависимости от вашего настроения
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
