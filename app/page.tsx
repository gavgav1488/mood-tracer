import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-hero">

      {/* Hero Section - как на picnote.ru */}
      <section className="relative py-20 lg:py-32 sakura-petals bg-white">
        <div className="floating-petals"></div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-picnote leading-tight hero-title">
                  Ваш личный дневник
                </h1>
                <p className="text-xl lg:text-2xl font-soft leading-relaxed hero-subtitle">
                  для ярких воспоминаний,<br />
                  сильных чувств и интересных идей
                </p>
                <p className="text-lg font-soft max-w-lg hero-description">
                  Сохраните самые ценные впечатления, приведите в порядок свои мысли
                  и помогите себе вырасти над собой. Напишите свою историю с Mood Tracer!
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <Button className="picnote-button text-lg px-8 py-4">
                  🌸 Начать писать дневник
                </Button>
                <div className="text-4xl animate-gentle-bounce">💕</div>
              </div>
            </div>

            {/* Right Content - Sakura Tree */}
            <div className="relative">
              <div className="sakura-card bg-gradient-pink p-8">
                <div className="w-full h-80 bg-white/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Sakura Tree Illustration */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 relative">
                      {/* Tree trunk */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-32 bg-gradient-to-t from-amber-800 to-amber-600 rounded-t-lg"></div>

                      {/* Tree crown with petals */}
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-48 h-48 rounded-full bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 opacity-80"></div>
                      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 -translate-y-2 w-40 h-40 rounded-full bg-gradient-to-br from-pink-300 via-pink-400 to-pink-500 opacity-70"></div>
                      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 -translate-y-4 w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 opacity-60"></div>

                      {/* Falling petals */}
                      <div className="absolute top-20 left-8 text-pink-400 text-2xl animate-sakura-float">🌸</div>
                      <div className="absolute top-32 right-12 text-pink-500 text-xl animate-sakura-float" style={{animationDelay: '1s'}}>🌸</div>
                      <div className="absolute top-40 left-16 text-pink-300 text-lg animate-sakura-float" style={{animationDelay: '2s'}}>🌸</div>
                      <div className="absolute top-28 right-8 text-pink-400 text-sm animate-sakura-float" style={{animationDelay: '0.5s'}}>🌸</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form - positioned absolutely */}
        <div className="absolute top-8 right-8 hidden lg:block">
          <div className="sakura-card max-w-sm w-full">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-ui font-medium text-gray-800 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="picnote-input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-ui font-medium text-gray-800 mb-2">
                  Пароль
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="picnote-input w-full"
                />
              </div>

              <Button className="picnote-button w-full">
                Войти
              </Button>

              <div className="text-center">
                <Link href="/forgot" className="text-sm text-primary hover:text-primary/80 font-ui">
                  Забыли пароль?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-picnote font-bold text-gray-900">
                Добро пожаловать в Mood Tracer
              </h2>
              <p className="text-xl font-picnote font-medium text-primary">
                Ваш дневник на каждый день!
              </p>
              <p className="text-lg font-soft text-gray-700 leading-relaxed">
                Мы сделали для вас простой и удобный сервис, в котором легко вести личные записи
                на любую тему. Эмоции, идеи, переживания и впечатления – сохраняйте всё, что с вами
                происходит, и делитесь записями с друзьями. Или оставьте их только для себя,
                как собственную маленькую тайну 😉
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="sakura-card bg-gradient-pink">
                  <div className="w-full h-32 bg-white/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <span className="text-4xl animate-gentle-bounce">📝</span>
                    <div className="absolute top-2 right-2 text-pink-400 text-sm animate-sakura-float">🌸</div>
                  </div>
                </div>
                <div className="sakura-card bg-gradient-purple">
                  <div className="w-full h-32 bg-white/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <span className="text-4xl animate-gentle-bounce" style={{animationDelay: '0.5s'}}>🎨</span>
                    <div className="absolute top-2 left-2 text-purple-400 text-sm animate-sakura-float" style={{animationDelay: '1s'}}>🌸</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="sakura-card bg-gradient-lavender">
                  <div className="w-full h-32 bg-white/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <span className="text-4xl animate-gentle-bounce" style={{animationDelay: '1s'}}>💭</span>
                    <div className="absolute bottom-2 right-2 text-purple-300 text-sm animate-sakura-float" style={{animationDelay: '1.5s'}}>🌸</div>
                  </div>
                </div>
                <div className="sakura-card bg-gradient-sakura">
                  <div className="w-full h-32 bg-white/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <span className="text-4xl animate-gentle-bounce" style={{animationDelay: '1.5s'}}>🌸</span>
                    <div className="absolute bottom-2 left-2 text-pink-400 text-sm animate-sakura-float" style={{animationDelay: '2s'}}>💕</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional text like on picnote.ru */}
          <div className="mt-16 text-center">
            <p className="text-lg font-soft text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Лень писать? Сделайте коллаж! В Mood Tracer вы можете оформлять странички своего дневника
              разными цветами, рисунками, стикерами – попробуйте себя в виртуальном скрапбукинге.
              Чем креативнее запись, тем лучше: мы за полную свободу самовыражения!
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-sakura sakura-petals">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-picnote font-bold text-gray-900 mb-6 flex items-center justify-center gap-4">
              <span className="text-3xl animate-gentle-bounce">🌸</span>
              Сохраняйте всё, что для вас важно!
              <span className="text-3xl animate-gentle-bounce" style={{animationDelay: '1s'}}>💕</span>
            </h2>
            <p className="text-xl font-soft text-gray-700">
              Для каждого дня Mood Tracer позволяет создать несколько страниц с разными записями.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '📖', title: 'Личные заметки', desc: 'Записывайте свои мысли и переживания' },
              { icon: '📅', title: 'Планы на неделю', desc: 'Организуйте свое время и цели' },
              { icon: '💝', title: 'Впечатления и эмоции', desc: 'Сохраняйте яркие моменты жизни' },
              { icon: '🍎', title: 'Дневник питания', desc: 'Отслеживайте свои пищевые привычки' },
              { icon: '💪', title: 'Наблюдение за самочувствием', desc: 'Следите за своим здоровьем' },
            ].map((feature, index) => (
              <div key={index} className="feature-card group">
                <div className="text-6xl mb-6 animate-sakura-float">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-picnote font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-700 font-soft">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-picnote font-bold text-gray-900 mb-6">
              Ваш дневник – ваши правила
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🎨', title: 'Креативное оформление', desc: 'Выбирайте свой фон и шрифты для каждой записи, пусть каждый день будет уникальным!' },
              { icon: '📅', title: 'Удобный календарь', desc: 'Просматривайте уже сделанные записи, перемещаясь между ними в один-два клика.' },
              { icon: '🌸', title: 'Милые стикеры', desc: 'Сотни прикольных стикеров для ваших заметок – раскрасьте свои записи яркими картинками!' },
              { icon: '📷', title: 'Загрузка изображений', desc: 'Добавляйте свои картинки или ищите готовые по ключевым словам' },
              { icon: '🔍', title: 'Поиск по записям', desc: 'Находите записи различными способами. С помощью текстового поиска или с помощью меток.' },
              { icon: '🔗', title: 'Делитесь записями', desc: 'Вы можете открыть доступ к записи, получив публичную ссылку. Все у кого будет ссылка смогут видеть вашу запись' },
            ].map((benefit, index) => (
              <div key={index} className="sakura-card text-center group">
                <div className="text-5xl mb-6 animate-gentle-bounce">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-picnote font-semibold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-700 font-soft leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Keep Diary Section */}
      <section className="py-20 bg-gradient-sakura">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-picnote font-bold text-gray-900 mb-6">
              Зачем вести дневник
            </h2>
            <p className="text-xl font-soft text-gray-700 max-w-3xl mx-auto">
              Завести дневник - это один из самых эффективных способов
              саморазвития и личностного роста
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                icon: '🧠',
                title: 'Самопознание и саморефлексия',
                desc: 'Дневник помогает лучше понять свои мысли, чувства, эмоции и переживания. Он позволяет проанализировать события, произошедшие за день, и сделать выводы о том, как они влияют на вашу жизнь.'
              },
              {
                icon: '⏰',
                title: 'Управление временем',
                desc: 'Записывая свои планы и цели на день, вы можете отслеживать свой прогресс и видеть, где можно улучшить свое время и эффективность.'
              },
              {
                icon: '😌',
                title: 'Разрядка и снятие стресса',
                desc: 'Когда вы записываете свои мысли и чувства, это помогает вам выразить свои эмоции, что в свою очередь снижает уровень стресса и тревоги.'
              },
              {
                icon: '🧠',
                title: 'Развитие памяти',
                desc: 'Регулярное ведение дневника улучшает память, так как вы учитесь вспоминать и записывать свои мысли и события.'
              },
            ].map((reason, index) => (
              <div key={index} className="sakura-card group">
                <div className="flex items-start space-x-6">
                  <div className="text-5xl animate-gentle-bounce">
                    {reason.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-picnote font-semibold text-gray-900 mb-4">
                      {reason.title}
                    </h3>
                    <p className="text-gray-700 font-soft leading-relaxed">
                      {reason.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Start Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-picnote font-bold text-gray-900">
                Начните вести свой дневник в Mood Tracer уже сегодня
              </h2>

              <div className="space-y-8">
                {[
                  {
                    number: '1',
                    title: 'Зарегистрируйтесь',
                    desc: 'на сайте. Всё, что нужно, это ввести почту, придумать никнейм и пароль.'
                  },
                  {
                    number: '2',
                    title: 'Создайте',
                    desc: 'новую запись. На сегодняшний день или на любой другой, прошедший или будущий.'
                  },
                  {
                    number: '3',
                    title: 'Запишите',
                    desc: 'свои мысли. Или зарисуйте. Или оформите стикерами. Mood Tracer даёт вам полную творческую свободу!'
                  },
                ].map((step, index) => (
                  <div key={index} className="flex items-start space-x-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-picnote font-bold text-xl">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-picnote font-semibold text-gray-900 mb-2">
                        <span className="font-bold">{step.title}</span> {step.desc}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="picnote-button text-lg px-8 py-4">
                Создать дневник
              </Button>
            </div>

            <div className="relative">
              <div className="sakura-card bg-gradient-pink p-8">
                <div className="w-full h-80 bg-white/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Sakura Tree Illustration */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 relative">
                      {/* Tree trunk */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-32 bg-gradient-to-t from-amber-800 to-amber-600 rounded-t-lg"></div>

                      {/* Tree crown with petals */}
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-48 h-48 rounded-full bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 opacity-80"></div>
                      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 -translate-y-2 w-40 h-40 rounded-full bg-gradient-to-br from-pink-300 via-pink-400 to-pink-500 opacity-70"></div>
                      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 -translate-y-4 w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 opacity-60"></div>

                      {/* Falling petals */}
                      <div className="absolute top-20 left-8 text-pink-400 text-2xl animate-sakura-float">🌸</div>
                      <div className="absolute top-32 right-12 text-pink-500 text-xl animate-sakura-float" style={{animationDelay: '1s'}}>🌸</div>
                      <div className="absolute top-40 left-16 text-pink-300 text-lg animate-sakura-float" style={{animationDelay: '2s'}}>🌸</div>
                      <div className="absolute top-28 right-8 text-pink-400 text-sm animate-sakura-float" style={{animationDelay: '0.5s'}}>🌸</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Final CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-8">
            <h2 className="text-4xl lg:text-5xl font-picnote font-bold text-gray-900">
              Пишите. Читайте. Перечитывайте.
            </h2>
            <p className="text-xl font-soft text-gray-700 max-w-3xl mx-auto">
              Пусть Mood Tracer станет вашим надёжным другом, который поможет привести мысли в порядок
              и сохранить самые ценные воспоминания.
            </p>
            <p className="text-2xl font-picnote font-semibold text-primary">
              Присоединяйтесь!
            </p>

            {/* Registration Form */}
            <div className="max-w-md mx-auto">
              <div className="sakura-card">
                <h3 className="text-2xl font-picnote font-semibold text-gray-900 mb-6">
                  Регистрация
                </h3>
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Никнейм"
                    className="picnote-input w-full"
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    className="picnote-input w-full"
                  />
                  <Input
                    type="password"
                    placeholder="Пароль"
                    className="picnote-input w-full"
                  />
                  <p className="text-xs text-gray-600 font-soft">
                    Создавая аккаунт, вы даете согласие на{' '}
                    <Link href="/agreement" className="text-primary hover:text-primary/80">
                      обработку персональных данных
                    </Link>
                  </p>
                  <Button className="picnote-button w-full">
                    Зарегистрироваться
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
