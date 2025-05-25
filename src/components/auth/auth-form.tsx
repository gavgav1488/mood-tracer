import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, Mail, Lock, ArrowRight, Home, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { IconInput } from '@/components/ui/icon-input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/hooks/use-supabase';

export function AuthForm() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { supabase, user } = useSupabase();
  const router = useRouter();

  // Перенаправление при успешной авторизации
  useEffect(() => {
    if (user) {
      console.log('Пользователь авторизован, перенаправление на /diary');
      router.push('/diary');
    }
  }, [user, router]);

  const handleOAuthSignIn = async (provider: 'google' | 'vk' | 'telegram') => {
    try {
      setError(null);
      setSuccessMessage(null);
      setIsLoading(provider);

      console.log(`Начало процесса входа через ${provider}`);
      console.log('Проверка supabase клиента:', !!supabase);

      // Преобразуем строковый тип провайдера в тип Provider из Supabase
      const supabaseProvider = provider as 'google';

      console.log(`Вызов signInWithOAuth для провайдера ${provider}`);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: supabaseProvider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: provider === 'google' ? {
            // Запрашиваем доступ к профилю и email пользователя
            access_type: 'offline',
            prompt: 'consent',
          } : undefined,
        },
      });

      console.log(`Результат входа через ${provider}:`, { data, error });

      if (error) {
        throw error;
      }

      console.log(`Успешное начало процесса входа через ${provider}, ожидается редирект`);
    } catch (error: any) {
      console.error(`Ошибка при входе через ${provider}:`, error);

      if (error.message && error.message.includes('provider is not enabled')) {
        if (provider === 'google') {
          setError('Вход через Google временно недоступен. Пожалуйста, используйте вход через Email.');
        } else if (provider === 'vk') {
          setError('Вход через VK временно недоступен. Пожалуйста, используйте вход через Google или Email.');
        } else if (provider === 'telegram') {
          setError('Вход через Telegram временно недоступен. Пожалуйста, используйте вход через Google или Email.');
        } else {
          setError(`Провайдер ${provider} не настроен. Пожалуйста, используйте другой способ входа.`);
        }
      } else {
        setError(`Не удалось выполнить вход через ${provider}. Пожалуйста, попробуйте позже. Ошибка: ${error.message || 'Неизвестная ошибка'}`);
      }
    } finally {
      setIsLoading(null);
      console.log(`Завершение процесса входа через ${provider}`);
    }
  };

  const handleGoogleSignIn = () => handleOAuthSignIn('google');
  const handleVKSignIn = () => handleOAuthSignIn('vk');
  const handleTelegramSignIn = () => handleOAuthSignIn('telegram');

  // Валидация email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Валидация пароля
  const validatePassword = (password: string): boolean => {
    // Минимум 8 символов, содержит хотя бы одну букву и одну цифру
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
  };

  // Функция для входа через email/password
  const handleEmailSignIn = async () => {
    // Сбрасываем предыдущие сообщения
    setError(null);
    setSuccessMessage(null);

    console.log('Начало процесса входа через email');

    // Валидация полей
    if (!email) {
      setError('Пожалуйста, введите email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Пожалуйста, введите корректный email');
      return;
    }

    if (!password) {
      setError('Пожалуйста, введите пароль');
      return;
    }

    if (isSignUp && !validatePassword(password)) {
      setError('Пароль должен содержать минимум 8 символов, включая буквы и цифры');
      return;
    }

    try {
      setIsLoading('email');
      console.log('Проверка supabase клиента:', !!supabase);

      if (isSignUp) {
        console.log('Начало процесса регистрации');
        // Регистрация нового пользователя
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        });

        console.log('Результат регистрации:', { data, error });

        if (error) throw error;

        // Проверяем, требуется ли подтверждение email
        if (data?.user?.identities?.length === 0) {
          setError('Пользователь с таким email уже зарегистрирован. Попробуйте войти.');
        } else {
          setSuccessMessage('Письмо с подтверждением отправлено на ваш email. Пожалуйста, проверьте почту и следуйте инструкциям.');
        }
      } else {
        console.log('Начало процесса входа');
        // Вход существующего пользователя
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        console.log('Результат входа:', { data, error });

        if (error) throw error;

        console.log('Успешный вход, сессия:', data.session);
      }
    } catch (error: any) {
      console.error('Ошибка при входе через email:', error);

      // Обработка различных типов ошибок
      if (error.message && error.message.includes('Email not confirmed')) {
        setError('Email не подтвержден. Пожалуйста, проверьте вашу почту и следуйте инструкциям в письме.');
      } else if (error.message && error.message.includes('Invalid login credentials')) {
        setError('Неверный email или пароль.');
      } else if (error.message && error.message.includes('User already registered')) {
        setError('Пользователь с таким email уже зарегистрирован. Попробуйте войти.');
      } else if (error.message && error.message.includes('rate limit')) {
        setError('Слишком много попыток входа. Пожалуйста, попробуйте позже.');
      } else if (error.message && error.message.includes('network')) {
        setError('Проблема с подключением к сети. Пожалуйста, проверьте ваше интернет-соединение.');
      } else {
        setError(`Ошибка: ${error.message || 'Неизвестная ошибка'}`);
      }
    } finally {
      setIsLoading(null);
      console.log('Завершение процесса входа/регистрации');
    }
  };

  // Функция для сброса пароля
  const handlePasswordReset = async () => {
    if (!email) {
      setError('Пожалуйста, введите email для сброса пароля');
      return;
    }

    try {
      setError(null);
      setSuccessMessage(null);
      setIsLoading('reset');

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?reset=true`,
      });

      if (error) throw error;

      setSuccessMessage('Инструкции по сбросу пароля отправлены на ваш email.');
    } catch (error: any) {
      console.error('Ошибка при сбросе пароля:', error);
      setError(`Не удалось отправить инструкции по сбросу пароля: ${error.message}`);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div>
      {/* Кнопка возврата на главную */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Вернуться на главную
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 border border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="mb-6 border border-primary/20 bg-primary/10">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertTitle>Успешно</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Вход в аккаунт</h2>
        <p className="text-muted-foreground">Выберите удобный способ входа в систему</p>
      </div>

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="email" className="rounded-full">Email</TabsTrigger>
          <TabsTrigger value="social" className="rounded-full">Соцсети</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-5">
          <div className="space-y-5">
            <div className="space-y-3">
              <IconInput
                id="email"
                type="email"
                placeholder="Email"
                icon={<Mail className="h-5 w-5 text-primary/70" />}
                className="border-border/50 bg-white/5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading !== null}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                    disabled={isLoading !== null}
                  >
                    Забыли пароль?
                  </button>
                )}
              </div>
              <IconInput
                id="password"
                type="password"
                placeholder={isSignUp ? "Создайте пароль" : "Пароль"}
                icon={<Lock className="h-5 w-5 text-primary/70" />}
                className="border-border/50 bg-white/5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading !== null}
              />
            </div>

            <Button
              className="w-full h-12 rounded-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all"
              onClick={handleEmailSignIn}
              disabled={isLoading !== null}
            >
              {isLoading === 'email' ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isSignUp ? 'Регистрация...' : 'Вход...'}
                </>
              ) : (
                <>
                  {isSignUp ? 'Зарегистрироваться' : 'Войти'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
                disabled={isLoading !== null}
              >
                {isSignUp ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
              </button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-5">
          <div className="space-y-5">
            <Button
              variant="outline"
              className="w-full h-12 rounded-lg border border-border/50 bg-background/50 hover:bg-primary/5 transition-all"
              onClick={handleGoogleSignIn}
              disabled={isLoading !== null}
            >
              {isLoading === 'google' ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <svg
                  className="mr-3 h-5 w-5 text-[#4285F4]"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
              )}
              <span className="font-medium">Войти через Google</span>
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/30"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground">Другие способы</span>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Временное ограничение</p>
                  <p className="text-sm text-muted-foreground">Вход через VK и Telegram временно недоступен. Пожалуйста, используйте вход через Google или Email.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-12 rounded-lg border border-border/50 bg-background/50 opacity-50"
                disabled={true}
              >
                <svg
                  className="mr-2 h-5 w-5 text-[#4C75A3]"
                  aria-hidden="true"
                  focusable="false"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path
                    fill="currentColor"
                    d="M545 117.7c3.7-12.5 0-21.7-17.8-21.7h-58.9c-15 0-21.9 7.9-25.6 16.7 0 0-30 73.1-72.4 120.5-13.7 13.7-20 18.1-27.5 18.1-3.7 0-9.4-4.4-9.4-16.9V117.7c0-15-4.2-21.7-16.6-21.7h-92.6c-9.4 0-15 7-15 13.5 0 14.2 21.2 17.5 23.4 57.5v86.8c0 19-3.4 22.5-10.9 22.5-20 0-68.6-73.4-97.4-157.4-5.8-16.3-11.5-22.9-26.6-22.9H38.8c-16.8 0-20.2 7.9-20.2 16.7 0 15.6 20 93.1 93.1 195.5C160.4 378.1 229 416 291.4 416c37.5 0 42.1-8.4 42.1-22.9 0-66.8-3.4-73.1 15.4-73.1 8.7 0 23.7 4.4 58.7 38.1 40 40 46.6 57.9 69 57.9h58.9c16.8 0 25.3-8.4 20.4-25-11.2-34.9-86.9-106.7-90.3-111.5-8.7-11.2-6.2-16.2 0-26.2.1-.1 72-101.3 79.4-135.6z"
                  ></path>
                </svg>
                <span className="font-medium">VK</span>
              </Button>

              <Button
                variant="outline"
                className="h-12 rounded-lg border border-border/50 bg-background/50 opacity-50"
                disabled={true}
              >
                <svg
                  className="mr-2 h-5 w-5 text-[#0088cc]"
                  aria-hidden="true"
                  focusable="false"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 496 512"
                >
                  <path
                    fill="currentColor"
                    d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z"
                  ></path>
                </svg>
                <span className="font-medium">Telegram</span>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 pt-6 border-t border-border/30">
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-2.5 w-2.5 text-primary"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">
            Ваши данные надежно защищены
          </p>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          При входе вы соглашаетесь с <a href="/privacy" className="text-primary hover:text-primary/80 transition-all">политикой конфиденциальности</a>
        </p>
      </div>
    </div>
  );
}
