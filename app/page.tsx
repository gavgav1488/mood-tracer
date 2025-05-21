import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  Calendar,
  BarChart3,
  Palette,
  Trophy,
  Bell,
  Heart,
  Share2
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero секция с градиентным фоном */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden bg-gradient-to-b from-primary/10 to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2 items-center">
            <div className="flex flex-col justify-center space-y-6">
              <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Версия 3.0 уже доступна</span>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Дневник настроения
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Отслеживайте свои эмоции, анализируйте настроение и находите гармонию с помощью современного и удобного дневника
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Button asChild size="lg" className="rounded-full font-medium">
                  <Link href="/login" className="inline-flex items-center">
                    Начать вести дневник
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full font-medium">
                  <Link href="#features">Узнать больше</Link>
                </Button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="mr-1 h-4 w-4 text-primary" />
                  <span>Бесплатно</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-1 h-4 w-4 text-primary" />
                  <span>Без рекламы</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-1 h-4 w-4 text-primary" />
                  <span>Конфиденциально</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary to-purple-600 opacity-20 blur-md"></div>
                <div className="relative bg-card rounded-xl shadow-xl overflow-hidden border border-border">
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Сегодня</h3>
                      <div className="text-sm text-muted-foreground">12 мая</div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { emoji: '😊', label: 'Радость', active: true },
                        { emoji: '😐', label: 'Нейтрально', active: false },
                        { emoji: '😢', label: 'Грусть', active: false },
                        { emoji: '🥳', label: 'Восторг', active: false },
                        { emoji: '😤', label: 'Злость', active: false },
                        { emoji: '😰', label: 'Тревога', active: false },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-all ${
                            item.active
                              ? 'bg-primary text-primary-foreground scale-105 shadow-md'
                              : 'bg-secondary/50 hover:bg-secondary/80'
                          }`}
                        >
                          <div className="text-3xl">{item.emoji}</div>
                          <div className="text-center text-xs font-medium">{item.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Заметка</div>
                      <div className="p-3 rounded-lg bg-muted text-sm">
                        Сегодня был отличный день! Встретился с друзьями и хорошо провел время.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Секция с особенностями */}
      <section id="features" className="w-full py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Почему выбирают нас</span>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Особенности дневника
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed">
                Современный дневник настроения с интуитивным интерфейсом и полезными функциями
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            {[
              {
                icon: <Calendar className="h-10 w-10 text-primary" />,
                title: "Ежедневные записи",
                description: "Создавайте записи о своем настроении каждый день с помощью простого и удобного интерфейса"
              },
              {
                icon: <BarChart3 className="h-10 w-10 text-primary" />,
                title: "Аналитика настроения",
                description: "Отслеживайте динамику своего настроения с помощью наглядных графиков и диаграмм"
              },
              {
                icon: <Palette className="h-10 w-10 text-primary" />,
                title: "Креативная визуализация",
                description: "Уникальная арт-визуализация, которая меняется в зависимости от вашего настроения"
              },
              {
                icon: <Trophy className="h-10 w-10 text-primary" />,
                title: "Система достижений",
                description: "Получайте достижения за регулярное ведение дневника и отслеживайте свой прогресс"
              },
              {
                icon: <Bell className="h-10 w-10 text-primary" />,
                title: "Умные напоминания",
                description: "Настраивайте персональные напоминания, чтобы не забывать записывать свои эмоции"
              },
              {
                icon: <Share2 className="h-10 w-10 text-primary" />,
                title: "Делитесь записями",
                description: "Делитесь своими записями с близкими или сохраняйте их в различных форматах"
              },
            ].map((feature, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl border bg-background p-6 shadow-sm transition-all hover:shadow-md">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-600/10 opacity-0 transition-opacity group-hover:opacity-100"></div>
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Секция с преимуществами */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-primary/5">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Преимущества</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Почему стоит вести дневник настроения
              </h2>
              <p className="text-muted-foreground md:text-xl">
                Регулярное ведение дневника настроения помогает лучше понимать себя и свои эмоции
              </p>
              <div className="space-y-4">
                {[
                  "Улучшение эмоционального интеллекта",
                  "Отслеживание триггеров стресса и тревоги",
                  "Развитие навыков самоанализа",
                  "Поиск закономерностей в настроении",
                  "Снижение эмоционального напряжения",
                  "Получение практических советов по управлению эмоциями",
                  "Мотивация через систему достижений",
                  "Удобный экспорт данных в различных форматах"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Button asChild size="lg" className="rounded-full font-medium">
                <Link href="/login">
                  Начать вести дневник
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary to-purple-600 opacity-10 blur-md"></div>
              <div className="relative aspect-video overflow-hidden rounded-xl bg-background shadow-xl">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <div className="relative h-full w-full p-6 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      <Sparkles className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Новые возможности</h3>
                    <p className="text-muted-foreground">
                      Система достижений, умные напоминания, советы по управлению эмоциями и возможность делиться записями
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-purple-600 p-8 md:p-12">
            <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
            <div className="relative z-10 flex flex-col items-center justify-center space-y-6 text-center text-white">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Начните вести дневник настроения сегодня
              </h2>
              <p className="max-w-[800px] md:text-xl/relaxed">
                Присоединяйтесь к тысячам пользователей, которые уже улучшили свое эмоциональное благополучие с помощью нашего дневника настроения с расширенными возможностями
              </p>
              <Button asChild size="lg" variant="secondary" className="rounded-full font-medium">
                <Link href="/login">
                  Создать аккаунт
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
