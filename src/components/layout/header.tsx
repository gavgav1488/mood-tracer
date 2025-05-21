'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b relative z-10">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            Дневник настроения
          </Link>
          {!loading && user && (
            <nav className="hidden md:flex gap-6">
              <Link
                href="/diary"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === '/diary' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Мой дневник
              </Link>
              <Link
                href="/profile"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === '/profile' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Мой профиль
              </Link>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4">
          {!loading && !user ? (
            <Button asChild variant="default">
              <Link href="/login">Войти</Link>
            </Button>
          ) : (
            !loading && (
              <>
                <Button variant="outline" onClick={signOut} className="hidden md:flex">
                  Выйти
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={toggleMobileMenu}
                  aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </>
            )
          )}
        </div>
      </div>

      {/* Мобильное меню */}
      {!loading && user && (
        <div
          className={`md:hidden absolute w-full bg-background border-b shadow-lg transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <nav className="container py-4 flex flex-col gap-4">
            <Link
              href="/diary"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/diary' ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={closeMobileMenu}
            >
              Мой дневник
            </Link>
            <Link
              href="/profile"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === '/profile' ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={closeMobileMenu}
            >
              Мой профиль
            </Link>
            <Button variant="outline" onClick={signOut} className="w-full mt-2">
              Выйти
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
