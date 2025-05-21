import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AuthProvider } from '@/context/auth-context';
import { Toaster } from '@/components/ui/toaster';
import { ReminderHandler } from '@/components/reminder-handler';
import { ThemeProvider } from '@/components/theme-provider';
import { PageTransition } from '@/components/ui/page-transition';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Дневник настроения',
  description: 'Веб-дневник настроения для подростков',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 bg-background">
                <PageTransition variant="fade">
                  {children}
                </PageTransition>
              </main>
              <Footer />
            </div>
            <Toaster />
            <ReminderHandler />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
