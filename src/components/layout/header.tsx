'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, MessageSquare, Settings, LogOut, LogIn, Heart, Trophy, BarChart3, Moon, Sun, Tag, Smile, TrendingUp, Users, UserPlus, ChevronDown } from 'lucide-react';
import {
  CaretDownOutlined,
  HeartFilled,
  UserOutlined as AntUserOutlined,
  SettingOutlined as AntSettingOutlined,
  GiftOutlined
} from '../icons/ant-icons';
import { ThemeToggleSimple } from '@/components/theme-toggle';

export function Header() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-border sakura-petals">
      <div className="container flex h-18 items-center justify-between py-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
          >
            <span className="text-3xl animate-gentle-bounce">🌸</span>
            <div>
              <div className="font-picnote text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                MOOD TRACER
              </div>
              <div className="text-xs font-soft text-muted-foreground">
                Дневник настроения
              </div>
            </div>
          </Link>

          {/* Navigation - всегда показываем */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { href: '/', label: 'Главная' },
              { href: '/diary', label: 'Дневник' },
              { href: '/analytics', label: 'Аналитика' },
              { href: '/achievements', label: 'Достижения' },
              { href: '/feedback', label: 'Отзывы' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-ui text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {!loading && !user ? (
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="font-ui text-primary hover:text-primary/80 transition-colors"
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="picnote-button px-6 py-2 text-sm"
              >
                Регистрация
              </Link>
            </div>
          ) : (
            !loading && (
              <div className="flex items-center gap-3">
                {/* User Menu */}
                <div className="relative group">
                  <button className="glass-button rounded-2xl font-medium px-4 py-2 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                      <AntUserOutlined className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden sm:inline text-sm">Профиль</span>
                    <CaretDownOutlined className="h-4 w-4 transition-transform group-hover:rotate-180" />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 glass-card rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="p-2">
                      <Link href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-primary/10 transition-colors">
                        <AntUserOutlined className="h-4 w-4 text-primary" />
                        <span className="text-sm">Мой профиль</span>
                      </Link>
                      <Link href="/achievements" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-primary/10 transition-colors">
                        <GiftOutlined className="h-4 w-4 text-primary" />
                        <span className="text-sm">Достижения</span>
                      </Link>
                      <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-primary/10 transition-colors">
                        <AntSettingOutlined className="h-4 w-4 text-primary" />
                        <span className="text-sm">Настройки</span>
                      </Link>
                      <hr className="my-2 border-border" />
                      <button
                        onClick={() => {
                          console.log('Нажата кнопка Выйти в хедере');
                          signOut();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-destructive/10 transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4 text-destructive" />
                        <span className="text-sm text-destructive">Выйти</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}
