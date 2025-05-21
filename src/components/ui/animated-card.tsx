'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'hover' | 'interactive';
  gradientFrom?: string;
  gradientTo?: string;
  hoverEffect?: 'lift' | 'glow' | 'border' | 'scale' | 'none';
}

export function AnimatedCard({
  children,
  className,
  variant = 'default',
  gradientFrom = 'from-primary/20',
  gradientTo = 'to-purple-600/20',
  hoverEffect = 'lift',
  ...props
}: AnimatedCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || variant !== 'interactive') return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Определяем классы для разных вариантов карточек
  const variantClasses = {
    default: '',
    gradient: `relative overflow-hidden before:absolute before:-inset-1 before:rounded-xl before:bg-gradient-to-r ${gradientFrom} ${gradientTo} before:opacity-20 before:blur-md`,
    hover: cn(
      'transition-all duration-300',
      hoverEffect === 'lift' && 'hover:-translate-y-1',
      hoverEffect === 'glow' && 'hover:shadow-lg hover:shadow-primary/20',
      hoverEffect === 'border' && 'hover:border-primary/50',
      hoverEffect === 'scale' && 'hover:scale-[1.02]'
    ),
    interactive: 'relative overflow-hidden transition-all duration-300',
  };

  // Стили для интерактивной карточки
  const interactiveStyles = variant === 'interactive' && isHovered ? {
    background: `radial-gradient(circle at ${position.x}px ${position.y}px, var(--primary-50) 0%, transparent 60%)`,
  } : {};

  if (!isMounted) {
    return (
      <Card 
        className={cn('relative', className)} 
        {...props}
      >
        {children}
      </Card>
    );
  }

  return (
    <Card 
      ref={cardRef}
      className={cn('relative', variantClasses[variant], className)} 
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={interactiveStyles}
      {...props}
    >
      {variant === 'gradient' && (
        <div className="absolute inset-0 opacity-0"></div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </Card>
  );
}

export const AnimatedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CardHeader>
>(({ className, ...props }, ref) => (
  <CardHeader ref={ref} className={cn('relative z-10', className)} {...props} />
));
AnimatedCardHeader.displayName = 'AnimatedCardHeader';

export const AnimatedCardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CardContent>
>(({ className, ...props }, ref) => (
  <CardContent ref={ref} className={cn('relative z-10', className)} {...props} />
));
AnimatedCardContent.displayName = 'AnimatedCardContent';

export const AnimatedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CardFooter>
>(({ className, ...props }, ref) => (
  <CardFooter ref={ref} className={cn('relative z-10', className)} {...props} />
));
AnimatedCardFooter.displayName = 'AnimatedCardFooter';

export const AnimatedCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof CardTitle>
>(({ className, ...props }, ref) => (
  <CardTitle ref={ref} className={cn('relative z-10', className)} {...props} />
));
AnimatedCardTitle.displayName = 'AnimatedCardTitle';

export const AnimatedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof CardDescription>
>(({ className, ...props }, ref) => (
  <CardDescription ref={ref} className={cn('relative z-10', className)} {...props} />
));
AnimatedCardDescription.displayName = 'AnimatedCardDescription';
