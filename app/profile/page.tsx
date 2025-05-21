'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Ленивая загрузка компонента профиля
const UserProfile = dynamic(() => import('@/components/profile/user-profile').then(mod => ({ default: mod.UserProfile })), {
  loading: () => <div className="animate-pulse bg-card h-[400px] rounded-lg"></div>,
  ssr: false
});

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Доступ запрещен</h1>
        <p className="mb-6">Для доступа к этой странице необходимо войти в систему.</p>
        <Button asChild>
          <Link href="/login">Войти</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Мой профиль</h1>
        <Button variant="outline" asChild>
          <Link href="/diary">Вернуться к дневнику</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
          <UserProfile />
        </div>
      </div>
    </div>
  );
}
