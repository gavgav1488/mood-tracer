'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary hover:text-primary/80 transition-colors',
        gradient: 'bg-gradient-to-r from-primary to-purple-600 text-primary-foreground hover:opacity-90',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  animateOnHover?: boolean;
  animationType?: 'scale' | 'pulse' | 'bounce' | 'none';
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant, size, asChild = false, animateOnHover = true, animationType = 'scale', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const [isHovered, setIsHovered] = React.useState(false);

    // Анимации для разных типов
    const animations = {
      scale: {
        scale: isHovered && animateOnHover ? 1.05 : 1,
        transition: { duration: 0.2 }
      },
      pulse: {
        scale: isHovered && animateOnHover ? [1, 1.05, 1] : 1,
        transition: { duration: 0.5, repeat: isHovered && animateOnHover ? Infinity : 0 }
      },
      bounce: {
        y: isHovered && animateOnHover ? [0, -3, 0] : 0,
        transition: { duration: 0.5, repeat: isHovered && animateOnHover ? Infinity : 0 }
      },
      none: {}
    };

    return (
      <motion.div
        animate={animations[animationType]}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="inline-block"
      >
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  }
);
AnimatedButton.displayName = 'AnimatedButton';

export { AnimatedButton, buttonVariants };
