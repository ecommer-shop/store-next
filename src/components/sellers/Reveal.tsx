'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
  duration?: number;
  scale?: number;
}

const offset: Record<string, Record<string, number>> = {
  up: { y: 40 },
  left: { x: -40 },
  right: { x: 40 },
  none: {},
};

export function Reveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 0.6,
  scale,
}: RevealProps) {
  return (
    <motion.div
      data-pdf-reveal
      initial={{
        opacity: 0,
        ...offset[direction],
        ...(scale !== undefined ? { scale } : {}),
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        ...(scale !== undefined ? { scale: 1 } : {}),
      }}
      viewport={{ margin: '-60px' }}
      transition={{
        duration,
        ease: [0.25, 0.1, 0.25, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
