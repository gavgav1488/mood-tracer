'use client';

import { Heart, Github, Twitter, Mail } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto glass border-t border-white/10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
                <span className="text-white font-bold text-sm">MT</span>
              </div>
              <span className="heading-gradient text-xl font-bold">mood-tracer</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Vibrant Creative Project Management Platform для эффективного управления проектами с красивым интерфейсом.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              Навигация
            </h3>
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-white/70 text-sm hover:text-white transition-colors duration-300"
              >
                Главная
              </Link>
              <Link
                href="/projects"
                className="text-white/70 text-sm hover:text-white transition-colors duration-300"
              >
                Проекты
              </Link>
              <Link
                href="/analytics"
                className="text-white/70 text-sm hover:text-white transition-colors duration-300"
              >
                Аналитика
              </Link>
              <Link
                href="/settings"
                className="text-white/70 text-sm hover:text-white transition-colors duration-300"
              >
                Настройки
              </Link>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              Связаться
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button p-3 rounded-xl hover:scale-110 transition-all duration-300"
              >
                <Github className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button p-3 rounded-xl hover:scale-110 transition-all duration-300"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="mailto:contact@mood-tracer.com"
                className="glass-button p-3 rounded-xl hover:scale-110 transition-all duration-300"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-white/70 text-sm flex items-center">
            © 2024 mood-tracer. Сделано с <Heart className="inline w-4 h-4 text-[var(--secondary)] mx-2" /> для творчества.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <Link
              href="/terms"
              className="text-white/70 hover:text-white transition-colors duration-300"
            >
              Условия
            </Link>
            <span className="text-white/30">•</span>
            <Link
              href="/privacy"
              className="text-white/70 hover:text-white transition-colors duration-300"
            >
              Конфиденциальность
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
