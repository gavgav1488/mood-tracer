import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  // Публичные маршруты, которые не требуют аутентификации
  const publicRoutes = ['/', '/login', '/auth/callback', '/privacy', '/feedback'];
  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname === route ||
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.startsWith('/_next/')
  );

  // Если это публичный маршрут, пропускаем проверку аутентификации
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Создаем клиент Supabase для проверки аутентификации
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
          // Это не будет вызвано в middleware
        },
        remove(name: string, options: any) {
          // Это не будет вызвано в middleware
        },
      },
    }
  );

  // Проверяем, аутентифицирован ли пользователь
  const { data: { session } } = await supabase.auth.getSession();

  // Если пользователь не аутентифицирован, перенаправляем на страницу входа
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
