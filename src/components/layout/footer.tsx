import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-4 md:space-y-6">
          <p className="text-center text-sm font-medium text-muted-foreground">
            &copy; {new Date().getFullYear()} Дневник настроения. Все права защищены.
          </p>
          <div className="flex items-center justify-center space-x-6">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Политика конфиденциальности
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Условия использования
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link
              href="/feedback"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Обратная связь
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
