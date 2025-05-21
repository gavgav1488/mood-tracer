import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import crypto from 'crypto';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export async function POST(request: NextRequest) {
  try {
    const telegramUser: TelegramUser = await request.json();
    
    // Проверяем данные от Telegram
    if (!validateTelegramData(telegramUser)) {
      return NextResponse.json(
        { error: 'Недействительные данные аутентификации' },
        { status: 401 }
      );
    }

    // Создаем клиент Supabase
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    // Проверяем, существует ли пользователь
    const { data: existingUser } = await supabase
      .from('telegram_users')
      .select('user_id')
      .eq('telegram_id', telegramUser.id)
      .single();

    let userId: string;

    if (existingUser) {
      // Если пользователь существует, используем его ID
      userId = existingUser.user_id;
    } else {
      // Если пользователь не существует, создаем нового
      const email = `telegram-${telegramUser.id}@telegram.auth`;
      const password = crypto.randomBytes(20).toString('hex');

      // Создаем пользователя в Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name: telegramUser.first_name + (telegramUser.last_name ? ` ${telegramUser.last_name}` : ''),
          avatar_url: telegramUser.photo_url,
          provider: 'telegram',
          telegram_username: telegramUser.username,
        },
      });

      if (authError || !authData.user) {
        console.error('Ошибка при создании пользователя:', authError);
        return NextResponse.json(
          { error: 'Ошибка при создании пользователя' },
          { status: 500 }
        );
      }

      userId = authData.user.id;

      // Сохраняем данные Telegram в отдельной таблице
      await supabase.from('telegram_users').insert({
        user_id: userId,
        telegram_id: telegramUser.id,
        username: telegramUser.username,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        photo_url: telegramUser.photo_url,
        auth_date: new Date(telegramUser.auth_date * 1000).toISOString(),
      });
    }

    // Генерируем временный токен для аутентификации
    const token = crypto.randomBytes(32).toString('hex');

    // Возвращаем токен клиенту
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Ошибка при обработке аутентификации Telegram:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

function validateTelegramData(user: TelegramUser): boolean {
  // Проверяем, что данные не старше 24 часов
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime - user.auth_date > 86400) {
    return false;
  }

  // Получаем токен бота из переменных окружения
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN не найден в переменных окружения');
    return false;
  }

  // Создаем строку данных для проверки
  const { hash, ...userData } = user;
  const dataCheckString = Object.entries(userData)
    .sort()
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  // Создаем секретный ключ
  const secretKey = crypto
    .createHash('sha256')
    .update(botToken)
    .digest();

  // Вычисляем хеш
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  // Сравниваем хеши
  return calculatedHash === hash;
}
