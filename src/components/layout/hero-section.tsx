'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { trackClickExplore } from '@/lib/analytics/events';

const SLIDES = [
  {
    src: '/hero-images/carousel-slide-1.jpg',
    alt: 'Ecommer — Slide 1',
  },
  {
    src: '/hero-images/carousel-slide-2.png',
    alt: 'Ecommer — Slide 2',
  },
];

export function HeroSection() {
  const t = useTranslations('HeroSection');

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo   = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  // Autoplay manual — 4.5 s, pausa al arrastrar
  useEffect(() => {
    if (!emblaApi) return;
    let timer: ReturnType<typeof setTimeout>;
    const play = () => { timer = setTimeout(() => { emblaApi.scrollNext(); play(); }, 4500); };
    const stop = () => clearTimeout(timer);
    emblaApi.on('pointerDown', stop);
    play();
    return () => { stop(); emblaApi.off('pointerDown', stop); };
  }, [emblaApi]);

  return (
    /*
     * El wrapper tiene overflow-visible para que las flechas puedan
     * salir a los lados (igual que MercadoLibre).
     * mt-[64px] compensa el navbar fijo.
     */
    <section className="relative mt-[64px] w-full">

      {/* ── Flechas fuera del carrusel, centradas verticalmente ── */}
      <button
        onClick={scrollPrev}
        aria-label="Imagen anterior"
        className="hidden md:flex absolute -left-0 top-1/2 -translate-y-1/2 z-30
                   w-10 h-10 items-center justify-center rounded-full
                   bg-white/90 dark:bg-[#1a1a3e]/90 shadow-md
                   border border-gray-200 dark:border-white/10
                   hover:bg-white dark:hover:bg-[#1a1a3e]
                   transition-all hover:scale-105 cursor-pointer"
        style={{ left: '4px' }}
      >
        <ChevronLeft className="size-5 text-gray-700 dark:text-white" />
      </button>

      <button
        onClick={scrollNext}
        aria-label="Siguiente imagen"
        className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-30
                   w-10 h-10 items-center justify-center rounded-full
                   bg-white/90 dark:bg-[#1a1a3e]/90 shadow-md
                   border border-gray-200 dark:border-white/10
                   hover:bg-white dark:hover:bg-[#1a1a3e]
                   transition-all hover:scale-105 cursor-pointer"
        style={{ right: '4px' }}
      >
        <ChevronRight className="size-5 text-gray-700 dark:text-white" />
      </button>

      {/* ── Carrusel: imagen a pantalla completa sin padding ── */}
      <div ref={emblaRef} className="overflow-hidden w-full">
        <div className="flex">
          {SLIDES.map((slide) => (
            <div
              key={slide.src}
              className="flex-none w-full"
              /*
               * 33/10 ≈ 20% menos alto que 21/8, todo el contenido sigue visible.
               */
              style={{ aspectRatio: '33/10' }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                width={1920}
                height={731}
                className="w-full h-full object-cover object-center"
                priority
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Overlay inferior: botón Explorar centrado + dots ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20
                   flex flex-col items-center gap-2 pb-4 pt-8"
        style={{ background: 'linear-gradient(to top, rgba(18,18,63,0.65) 0%, transparent 100%)' }}
      >
        {/* Botón Explorar — centrado y prominente */}
        <Link href="/search" onClick={() => trackClickExplore()}>
          <button
            className="inline-flex items-center px-7 py-2.5 rounded-full
                       font-bold text-sm text-white shadow-lg
                       transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{ background: 'linear-gradient(90deg, #6BB8FF, #9969F8)' }}
          >
            {t(I18N.HeroSection.shopButton)}
          </button>
        </Link>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Ir a imagen ${i + 1}`}
              className="rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width:  selectedIndex === i ? '20px' : '7px',
                height: '7px',
                background: selectedIndex === i
                  ? 'linear-gradient(90deg, #6BB8FF, #9969F8)'
                  : 'rgba(255,255,255,0.55)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
