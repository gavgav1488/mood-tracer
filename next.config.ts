import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Настройка оптимизации изображений
  images: {
    domains: ['lh3.googleusercontent.com', 'sun9-*.userapi.com'], // Домены для Google и VK аватаров
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Настройка заголовков безопасности
  headers: async () => {
    return [
      {
        // Применяем эти заголовки ко всем маршрутам
        source: '/:path*',
        headers: [
          // Защита от XSS
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Защита от кликджекинга
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // Защита от MIME-снифинга
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Настройка Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://*.supabase.co; frame-src 'self' https://accounts.google.com https://oauth.vk.com;",
          },
          // Настройка Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Настройка Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
