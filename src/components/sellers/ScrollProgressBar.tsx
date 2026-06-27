'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useTheme } from 'next-themes';

export function ScrollProgressBar() {
  const { resolvedTheme } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
      style={{
        scaleX,
        background: resolvedTheme === 'light'
          ? 'linear-gradient(90deg, #6BB8FF, #9969F8)'
          : 'linear-gradient(90deg, #9969F8, #6BB8FF)',
      }}
    />
  );
}
