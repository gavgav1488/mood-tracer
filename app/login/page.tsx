'use client';

import { AuthForm } from '@/components/auth/auth-form';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/diary';

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Дневник настроения</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Войдите, чтобы получить доступ к вашему дневнику
          </p>
        </div>
        <AuthForm redirectUrl={redirect} />
      </div>
    </div>
  );
}
