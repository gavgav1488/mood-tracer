import Link from 'next/link';
import { BookOpen, MessageSquare, Settings, Home, FileText, Shield, Sparkles, Heart, Trophy, BarChart3 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t py-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4 max-w-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="font-bold text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Дневник настроения
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Отслеживайте свои эмоции, анализируйте настроение и находите гармонию с помощью современного и удобного дневника
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Навигация</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <Home className="h-3.5 w-3.5" />
                    <span>Главная</span>
                  </Link>
                </li>
                <li>
                  <Link href="/diary" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Мой дневник</span>
                  </Link>
                </li>
                <li>
                  <Link href="/tips" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <Heart className="h-3.5 w-3.5" />
                    <span>Советы</span>
                  </Link>
                </li>
                <li>
                  <Link href="/achievements" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <Trophy className="h-3.5 w-3.5" />
                    <span>Достижения</span>
                  </Link>
                </li>
                <li>
                  <Link href="/analytics" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>Аналитика</span>
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <Settings className="h-3.5 w-3.5" />
                    <span>Настройки</span>
                  </Link>
                </li>
                <li>
                  <Link href="/feedback" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Обратная связь</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Правовая информация</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Политика конфиденциальности</span>
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5" />
                    <span>Условия использования</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Дневник настроения. Все права защищены.
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/5 hover:bg-primary/10 transition-colors">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </a>
            </div>

            <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/5 hover:bg-primary/10 transition-colors">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </a>
            </div>

            <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/5 hover:bg-primary/10 transition-colors">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
