'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from 'next-themes';

export function ParallaxOverlay() {
  const { resolvedTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <motion.div
      className="fixed inset-0 -z-10"
      style={{
        y,
        background:
          resolvedTheme === 'light'
            ? 'radial-gradient(ellipse at top, rgba(107,184,255,0.1) 0%, transparent 100%)'
            : 'radial-gradient(ellipse at top, rgba(33,0,81,0.4) 0%, transparent 100%)',
      }}
    />
  );
}
