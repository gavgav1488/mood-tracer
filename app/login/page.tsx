'use client';

import { AuthForm } from '@/components/auth/auth-form';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/animated-card';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Левая часть - декоративная с информацией */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary/90 to-purple-700 text-white p-8 flex-col justify-between relative overflow-hidden">
        {/* Декоративные элементы */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.6, 0.5]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        {/* Сетка точек */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:20px_20px] opacity-70" />

        {/* Контент */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="h-5 w-5 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold">Дневник настроения</h1>
          </div>

          <div className="space-y-8 max-w-md">
            <motion.h2
              className="text-4xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Отслеживайте эмоции, находите гармонию
            </motion.h2>
            <motion.p
              className="text-white/80 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Ведите дневник настроения, анализируйте свои эмоции и улучшайте качество жизни с помощью нашего удобного приложения.
            </motion.p>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/20 mt-0.5">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white/80">Простой и удобный интерфейс для ежедневных записей</p>
              </motion.div>

              <motion.div
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/20 mt-0.5">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white/80">Визуализация данных и статистика вашего настроения</p>
              </motion.div>

              <motion.div
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/20 mt-0.5">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white/80">Безопасное хранение данных и конфиденциальность</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="relative z-10 text-sm text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          &copy; {new Date().getFullYear()} Дневник настроения. Все права защищены.
        </motion.div>
      </div>

      {/* Правая часть - форма входа */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-background">
        <motion.div
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Мобильный заголовок (виден только на мобильных) */}
          <motion.div
            className="md:hidden text-center space-y-2 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
            <motion.h1
              className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Дневник настроения
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Отслеживайте эмоции, находите гармонию
            </motion.p>
          </motion.div>

          <AnimatedCard variant="hover" hoverEffect="glow" className="overflow-hidden">
            <AuthForm />
          </AnimatedCard>

          <motion.div
            className="text-center text-sm text-muted-foreground mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p>
              Первый раз здесь? Просто войдите через любой сервис, и мы автоматически создадим аккаунт для вас.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
