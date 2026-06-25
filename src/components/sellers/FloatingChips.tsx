'use client';

import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { UseVendedoresText } from './UseVendedoresText';

interface ChipConfig {
  positionClass: string;
  rotation: number;
}

const chipConfigs: ChipConfig[] = [
  { positionClass: 'top-12 right-12', rotation: -6 },
  { positionClass: 'top-36 right-28', rotation: 4 },
  { positionClass: 'bottom-20 right-6', rotation: -3 },
];

const INFLUENCE_RADIUS = 150;
const MAX_DISPLACEMENT = 45;
const LERP_FACTOR = 0.08;
const SPRING_RETURN = 0.04;
const LEVITATE_AMPLITUDE = 10;
const LEVITATE_SPEED = 0.7;

export function FloatingChips() {
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, smoothX: -1000, smoothY: -1000 });
  const timeRef = useRef(0);
  const rafRef = useRef(0);
  const stateRef = useRef(
    chipConfigs.map(() => ({ dx: 0, dy: 0, seed: Math.random() * Math.PI * 2 }))
  );

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    }

    function animate() {
      timeRef.current += 0.016;
      const time = timeRef.current;
      const mouse = mouseRef.current;
      const chips = chipRefs.current;
      const state = stateRef.current;

      mouse.smoothX += (mouse.x - mouse.smoothX) * LERP_FACTOR;
      mouse.smoothY += (mouse.y - mouse.smoothY) * LERP_FACTOR;

      for (let i = 0; i < chips.length; i++) {
        const el = chips[i];
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mouse.smoothX - cx;
        const dy = mouse.smoothY - cy;
        const dist = Math.hypot(dx, dy);
        const s = state[i];

        if (dist < INFLUENCE_RADIUS && dist > 0) {
          const force = (1 - dist / INFLUENCE_RADIUS) * MAX_DISPLACEMENT;
          s.dx += (-(dx / dist) * force - s.dx) * LERP_FACTOR;
          s.dy += (-(dy / dist) * force - s.dy) * LERP_FACTOR;
        } else {
          s.dx += (0 - s.dx) * SPRING_RETURN;
          s.dy += (0 - s.dy) * SPRING_RETURN;
        }

        const levitateY = Math.sin(time * LEVITATE_SPEED + s.seed) * LEVITATE_AMPLITUDE;
        const config = chipConfigs[i];
        el.style.transform = `translate(${s.dx}px, ${s.dy + levitateY}px) rotate(${config.rotation}deg)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', onMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      {chipConfigs.map((config, i) => (
        <div
          key={i}
          ref={(el) => { chipRefs.current[i] = el; }}
          className={`absolute ${config.positionClass}`}
          data-pdf-chip
          data-pdf-rotation={config.rotation}
          style={{
            transform: `rotate(${config.rotation}deg) translate(0px, 0px)`,
            '--pdf-rot': `${config.rotation}`,
          } as React.CSSProperties}
        >
          <div className="flex items-center gap-3 backdrop-blur-xl bg-white/80 dark:bg-[#12123F]/60 border border-black/[0.08] dark:border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-full px-5 py-3">
            <div className="w-6 h-6 rounded-full  flex items-center justify-center">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.75 18.25L19.5625 9.4375L17.8125 7.6875L10.75 14.75L7.1875 11.1875L5.4375 12.9375L10.75 18.25ZM12.5 25C10.7708 25 9.14583 24.6719 7.625 24.0156C6.10417 23.3594 4.78125 22.4688 3.65625 21.3438C2.53125 20.2188 1.64062 18.8958 0.984375 17.375C0.328125 15.8542 0 14.2292 0 12.5C0 10.7708 0.328125 9.14583 0.984375 7.625C1.64062 6.10417 2.53125 4.78125 3.65625 3.65625C4.78125 2.53125 6.10417 1.64062 7.625 0.984375C9.14583 0.328125 10.7708 0 12.5 0C14.2292 0 15.8542 0.328125 17.375 0.984375C18.8958 1.64062 20.2188 2.53125 21.3438 3.65625C22.4688 4.78125 23.3594 6.10417 24.0156 7.625C24.6719 9.14583 25 10.7708 25 12.5C25 14.2292 24.6719 15.8542 24.0156 17.375C23.3594 18.8958 22.4688 20.2188 21.3438 21.3438C20.2188 22.4688 18.8958 23.3594 17.375 24.0156C15.8542 24.6719 14.2292 25 12.5 25ZM12.5 22.5C15.2917 22.5 17.6562 21.5312 19.5938 19.5938C21.5312 17.6562 22.5 15.2917 22.5 12.5C22.5 9.70833 21.5312 7.34375 19.5938 5.40625C17.6562 3.46875 15.2917 2.5 12.5 2.5C9.70833 2.5 7.34375 3.46875 5.40625 5.40625C3.46875 7.34375 2.5 9.70833 2.5 12.5C2.5 15.2917 3.46875 17.6562 5.40625 19.5938C7.34375 21.5312 9.70833 22.5 12.5 22.5Z" fill="#4ADE80" />
              </svg>

            </div>
            <span className="text-sm font-medium text-[#12123F] dark:text-[#F1F1F1] whitespace-nowrap">
              <UseVendedoresText path={['hero', 'floatingCard']} />
            </span>
          </div>
        </div>
      ))}
    </>
  );
}
