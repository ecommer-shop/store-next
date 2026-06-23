'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface Particle {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  seed: number;
  color: string;
  baseAlpha: number;
  angle: number;
  scale: number;
}

const THEME_COLORS = {
  dark: ['#9969F8', '#6BB8FF', '#F1F1F1'],
  light: ['#6BB8FF', '#9969F8', '#12123F'],
};

const GRID_SPACING = 42;
const DASH_LENGTH = 4;
const DASH_WIDTH = 1.0;

const INFLUENCE_RADIUS = 130;
const MOUSE_ACCEL = 0.35;
const DAMPING_FACTOR = 0.94;
const SPRING_STIFFNESS = 0.006;
const SWIRL_FACTOR = 0.15;

export function InteractiveBackground() {
  const { resolvedTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -2000, y: -2000, smoothX: -2000, smoothY: -2000 });
  const timeRef = useRef(0);
  const rafRef = useRef(0);
  const dimsRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;

    const currentTheme = (resolvedTheme as 'light' | 'dark') || 'dark';
    const activeColors = THEME_COLORS[currentTheme];

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dimsRef.current = { w, h };
      initParticles(w, h);
    }

    function initParticles(w: number, h: number) {
      const particles: Particle[] = [];
      const cols = Math.ceil(w / GRID_SPACING) + 1;
      const rows = Math.ceil(h / GRID_SPACING) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * GRID_SPACING;
          const y = r * GRID_SPACING;
          const colorIndex = Math.floor(Math.random() * activeColors.length);

          let baseAlpha = 0.18;
          if (currentTheme === 'light' && colorIndex === 2) baseAlpha = 0.45;
          else if (currentTheme === 'light') baseAlpha = 0.35;
          else if (currentTheme === 'dark' && colorIndex === 2) baseAlpha = 0.08;

          particles.push({
            originX: x, originY: y, x, y,
            vx: 0, vy: 0,
            seed: Math.random() * Math.PI * 2,
            color: activeColors[colorIndex],
            baseAlpha,
            angle: 0, scale: 1,
          });
        }
      }
      particlesRef.current = particles;
    }

    function animate() {
      timeRef.current += 0.003;
      const time = timeRef.current;
      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      const { w, h } = dimsRef.current;

      mouse.smoothX += (mouse.x - mouse.smoothX) * 0.08;
      mouse.smoothY += (mouse.y - mouse.smoothY) * 0.08;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const breath = Math.sin(time + p.seed);
        let currentOpacity = p.baseAlpha + 0.04 * breath;
        p.scale = 0.9 + 0.1 * Math.abs(breath);

        const dxMouse = mouse.smoothX - p.x;
        const dyMouse = mouse.smoothY - p.y;
        const distMouse = Math.hypot(dxMouse, dyMouse);

        if (distMouse < INFLUENCE_RADIUS && distMouse > 0) {
          const proximity = 1 - distMouse / INFLUENCE_RADIUS;
          const force = proximity * MOUSE_ACCEL;

          const dirX = dxMouse / distMouse;
          const dirY = dyMouse / distMouse;
          p.vx -= dirX * force;
          p.vy -= dirY * force;

          p.vx += (-dyMouse / distMouse) * force * SWIRL_FACTOR;
          p.vy += (dxMouse / distMouse) * force * SWIRL_FACTOR;

          currentOpacity += proximity * (currentTheme === 'light' ? 1.5 : 0.58);
        }

        const dxHome = p.originX - p.x;
        const dyHome = p.originY - p.y;
        p.vx += dxHome * SPRING_STIFFNESS;
        p.vy += dyHome * SPRING_STIFFNESS;

        p.vx *= DAMPING_FACTOR;
        p.vy *= DAMPING_FACTOR;
        p.x += p.vx;
        p.y += p.vy;

        const angleToCursor = Math.atan2(mouse.smoothY - p.y, mouse.smoothX - p.x);
        p.angle = angleToCursor + Math.PI / 2;

        const finalOpacity = Math.min(currentOpacity, 0.85);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.scale(p.scale, 1);
        ctx.globalAlpha = finalOpacity;
        ctx.strokeStyle = p.color;
        const dashLen = currentTheme === 'light' ? 5 : 4;
        ctx.lineWidth = DASH_WIDTH;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-dashLen / 2, 0);
        ctx.lineTo(dashLen / 2, 0);
        ctx.stroke();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    function onMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 bg-[#F1F1F1] dark:bg-[#121414] transition-colors duration-500"
      aria-hidden="true"
    />
  );
}
