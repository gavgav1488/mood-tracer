'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fade' | 'slide' | 'scale' | 'none';
}

export function PageTransition({
  children,
  className = '',
  variant = 'fade',
}: PageTransitionProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{children}</>;
  }

  // Варианты анимации
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 }
    },
    slide: {
      initial: { x: 10, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -10, opacity: 0 },
      transition: { duration: 0.3 }
    },
    scale: {
      initial: { scale: 0.98, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.98, opacity: 0 },
      transition: { duration: 0.3 }
    },
    none: {
      initial: {},
      animate: {},
      exit: {},
      transition: {}
    }
  };

  const selectedVariant = variants[variant];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={selectedVariant.initial}
        animate={selectedVariant.animate}
        exit={selectedVariant.exit}
        transition={selectedVariant.transition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
