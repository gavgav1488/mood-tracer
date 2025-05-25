import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t border-border sakura-petals">
      <div className="container mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl animate-gentle-bounce">🌸</span>
              <div>
                <div className="font-picnote text-xl font-bold text-foreground">
                  MOOD TRACER
                </div>
                <div className="text-sm font-soft text-muted-foreground">
                  Дневник настроения
                </div>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed max-w-md font-soft">
              Сервис для ведения личных онлайн-дневников и заметок.
              Сохраните самые ценные впечатления и приведите в порядок свои мысли.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-picnote font-semibold text-foreground">Навигация</h3>
            <div className="space-y-2">
              {[
                { href: '/', label: 'Главная' },
                { href: '/diary', label: 'Дневник' },
                { href: '/analytics', label: 'Аналитика' },
                { href: '/achievements', label: 'Достижения' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-sm font-soft text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-picnote font-semibold text-foreground">Информация</h3>
            <div className="space-y-2">
              {[
                { href: '/privacy', label: 'Конфиденциальность' },
                { href: '/terms', label: 'Условия' },
                { href: '/feedback', label: 'Обратная связь' },
                { href: '/help', label: 'Помощь' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-sm font-soft text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-picnote font-semibold text-foreground">Обратная связь</h3>
            <div className="space-y-2">
              <p className="text-sm font-soft text-muted-foreground">
                Вопросы и предложения
              </p>
              <Link
                href="mailto:hello@moodtracer.ru"
                className="text-sm font-soft text-primary hover:text-primary/80 transition-colors"
              >
                hello@moodtracer.ru
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm font-soft text-muted-foreground">
              &copy; {new Date().getFullYear()} Mood Tracer. Все права защищены.
            </p>
            <div className="flex items-center space-x-4 text-sm font-soft text-muted-foreground">
              <Link href="/oferta" className="hover:text-primary transition-colors">
                Оферта
              </Link>
              <Link href="/agreement" className="hover:text-primary transition-colors">
                Согласие на обработку персональных данных
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
