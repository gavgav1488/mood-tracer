import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AuthProvider } from '@/context/auth-context';
import { KeyboardFocusManager } from '@/components/a11y/keyboard-focus';
import { SkipLink } from '@/components/a11y/skip-link';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Дневник настроения',
  description: 'Веб-дневник настроения для подростков',
  applicationName: 'Дневник настроения',
  authors: [{ name: 'Команда разработки' }],
  keywords: ['дневник', 'настроение', 'эмоции', 'психология', 'подростки'],
  creator: 'Команда разработки',
  publisher: 'Команда разработки',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <KeyboardFocusManager />
          <SkipLink />
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main id="main-content" tabIndex={-1} className="flex-1 bg-background outline-none">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
