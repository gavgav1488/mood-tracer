'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, MessageSquare, Settings, LogOut, LogIn, Heart, Trophy, BarChart3, Moon, Sun } from 'lucide-react';
import { ThemeToggleSimple } from '@/components/theme-toggle';

export function Header() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
          >
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-primary"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M12 18v-6" />
                <path d="M8 15h8" />
              </svg>
            </div>
            Дневник настроения
          </Link>

          {!loading && user && (
            <nav className="hidden md:flex gap-6">
              <Link
                href="/diary"
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === '/diary' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Мой дневник
              </Link>
              <Link
                href="/tips"
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === '/tips' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Heart className="h-4 w-4" />
                Советы
              </Link>
              <Link
                href="/achievements"
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === '/achievements' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Trophy className="h-4 w-4" />
                Достижения
              </Link>
              <Link
                href="/analytics"
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === '/analytics' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Аналитика
              </Link>
              <Link
                href="/feedback"
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === '/feedback' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                Обратная связь
              </Link>
              <Link
                href="/settings"
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === '/settings' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Settings className="h-4 w-4" />
                Настройки
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggleSimple />
          {!loading && !user ? (
            <Button asChild variant="default" className="rounded-full">
              <Link href="/login" className="flex items-center gap-1">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Войти</span>
              </Link>
            </Button>
          ) : (
            !loading && (
              <Button variant="outline" onClick={signOut} className="rounded-full">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Выйти</span>
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
