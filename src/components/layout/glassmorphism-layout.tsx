'use client';

import { useState, useEffect } from 'react';
import { GlassmorphismHeader } from './glassmorphism-header';
import { GlassmorphismFooter } from './glassmorphism-footer';

interface GlassmorphismLayoutProps {
  children: React.ReactNode;
}

export function GlassmorphismLayout({ children }: GlassmorphismLayoutProps) {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <GlassmorphismHeader darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Main Content */}
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      
      <GlassmorphismFooter />
    </div>
  );
}
