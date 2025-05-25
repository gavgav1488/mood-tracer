'use client';

import { useState } from 'react';
import { Moon, Sun, Menu, X, Home, FolderOpen, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center glow-primary">
              <span className="text-white font-bold text-lg">MT</span>
            </div>
            <span className="heading-gradient text-2xl font-bold">mood-tracer</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Главная</span>
            </Link>
            <Link
              href="/projects"
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
            >
              <FolderOpen className="w-5 h-5" />
              <span className="font-medium">Проекты</span>
            </Link>
            <Link
              href="/analytics"
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Аналитика</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Настройки</span>
            </Link>
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="glass-button p-3 rounded-xl hover:scale-110 transition-all duration-300"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-[var(--accent)]" />
              ) : (
                <Moon className="h-5 w-5 text-[var(--primary)]" />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="glass-button p-3 rounded-xl md:hidden hover:scale-110 transition-all duration-300"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-white" />
              ) : (
                <Menu className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-6 pt-6 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors duration-300 py-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Главная</span>
              </Link>
              <Link
                href="/projects"
                className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors duration-300 py-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FolderOpen className="w-5 h-5" />
                <span className="font-medium">Проекты</span>
              </Link>
              <Link
                href="/analytics"
                className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors duration-300 py-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Аналитика</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors duration-300 py-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Настройки</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
