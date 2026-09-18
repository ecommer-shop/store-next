'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {
  ShieldCheck,
  Truck,
  Clock,
  Users,
  User,
  MapPin,
  Bot,
  TrendingUp,
  FileText,
  Phone,
  Store,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

/* ─────────────────────────────── Scroll Reveal Hook ─────────────────────────────── */
function useScrollReveal() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isVisible };
}

/* ─────────────────────────────── Hero ─────────────────────────────── */
function HeroSection() {
  const t = useTranslations('About');

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #12123F 0%, #1a1a5e 60%, #2a1a6e 100%)' }}
    >
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: '#9969F8', transform: 'translate(30%, -30%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: '#6BB8FF', transform: 'translate(-30%, 30%)' }}
      />

      <div className="relative container mx-auto px-4 pt-32 pb-24 text-center">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest mb-6 uppercase"
          style={{ background: 'rgba(153,105,248,0.25)', color: '#9969F8', border: '1px solid rgba(153,105,248,0.4)' }}
        >
          {t('hero.badge')}
        </span>

        <h1
          className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4"
          style={{
            background: 'linear-gradient(90deg, #6BB8FF, #9969F8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {t('title')}
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {t('description')}
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────── History ─────────────────────────────── */
function HistorySection() {
  const t = useTranslations('About');
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className="py-20 bg-background transition-opacity duration-1000"
      style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(30px)' }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 dark:text-white" style={{ color: '#12123F' }}>
            {t('historyTitle')}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('history')}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Mission & Vision ─────────────────────────────── */
function MissionVisionSection() {
  const t = useTranslations('About');
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className="py-20 dark:bg-muted/20 transition-opacity duration-1000"
      style={{ background: '#F1F1F1', opacity: isVisible ? 1 : 0 }}
    >
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {/* Mission */}
          <div
            className="p-8 rounded-2xl"
            style={{ background: 'rgba(107,184,255,0.1)', border: '1px solid rgba(107,184,255,0.3)' }}
          >
            <h3 className="text-2xl font-bold mb-4 dark:text-white" style={{ color: '#12123F' }}>
              Misión
            </h3>
            <blockquote className="text-muted-foreground text-lg italic leading-relaxed">
              &ldquo;{t('mission')}&rdquo;
            </blockquote>
          </div>

          {/* Vision */}
          <div
            className="p-8 rounded-2xl"
            style={{ background: 'rgba(153,105,248,0.1)', border: '1px solid rgba(153,105,248,0.3)' }}
          >
            <h3 className="text-2xl font-bold mb-4 dark:text-white" style={{ color: '#12123F' }}>
              Visión
            </h3>
            <blockquote className="text-muted-foreground text-lg italic leading-relaxed">
              &ldquo;{t('vision')}&rdquo;
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Audience ─────────────────────────────── */
function AudienceSection() {
  const t = useTranslations('About');
  const { ref, isVisible } = useScrollReveal();

  const benefits = ['securePayments', 'localDelivery', 'alwaysOpen'] as const;
  const icons = [ShieldCheck, Truck, Clock];

  return (
    <section
      ref={ref}
      className="py-20 bg-background transition-opacity duration-1000"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="size-8" style={{ color: '#6BB8FF' }} />
            <h2 className="text-3xl md:text-4xl font-extrabold dark:text-white" style={{ color: '#12123F' }}>
              {t('audience.title')}
            </h2>
          </div>

          <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            {t('audience.description')}
          </p>

          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto mb-10">
            {benefits.map((benefit, i) => {
              const Icon = icons[i];
              const accent = i % 2 === 0 ? '#6BB8FF' : '#9969F8';
              return (
                <div
                  key={benefit}
                  className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-white dark:bg-background shadow-sm"
                  style={{ border: `1px solid ${i % 2 === 0 ? 'rgba(107,184,255,0.3)' : 'rgba(153,105,248,0.3)'}` }}
                >
                  <Icon className="size-10" style={{ color: accent }} />
                  <p className="font-medium text-sm text-foreground leading-relaxed">
                    {t(`audience.${benefit}`)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center">
            <Link
              href="https://admin.ecommer.shop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all hover:scale-105 hover:shadow-2xl"
              style={{ background: 'linear-gradient(90deg, #6BB8FF, #9969F8)' }}
            >
              {t('audience.cta')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Team ─────────────────────────────── */
function TeamSection() {
  const t = useTranslations('About');
  const { ref, isVisible } = useScrollReveal();

  const leadership = ['ceo', 'accountant', 'serverLead', 'eiaLead', 'lawyer'] as const;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  return (
    <section
      ref={ref}
      className="py-20 dark:bg-muted/20 transition-opacity duration-1000"
      style={{ background: '#F1F1F1', opacity: isVisible ? 1 : 0 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Users className="size-8" style={{ color: '#9969F8' }} />
            <h2 className="text-3xl md:text-4xl font-extrabold dark:text-white" style={{ color: '#12123F' }}>
              {t('team.title')}
            </h2>
          </div>

          {/* ── Carrusel ── */}
          <div className="relative">
            {/* Flechas (solo desktop) */}
            <button
              onClick={scrollPrev}
              aria-label="Persona anterior"
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
              aria-label="Siguiente persona"
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

            {/* Slides */}
            <div ref={emblaRef} className="overflow-hidden w-full px-1">
              <div className="flex">
                {leadership.map((member) => {
                  const raw = t(`team.leadership.${member}`);
                  const [name, role] = raw.split(' — ');
                  return (
                    <div
                      key={member}
                      className="flex-none w-full md:basis-1/3 px-2"
                    >
                      <div
                        className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-white dark:bg-background shadow-sm"
                        style={{ border: '1px solid rgba(107,184,255,0.3)' }}
                      >
                        {/* Avatar placeholder (icon — reemplazable por <Image>) */}
                        <div
                          className="w-20 h-20 rounded-full flex items-center justify-center"
                          style={{
                            background: 'rgba(107,184,255,0.1)',
                            border: '2px solid rgba(107,184,255,0.3)',
                          }}
                        >
                          <User className="size-10" style={{ color: '#6BB8FF' }} />
                        </div>

                        {/* Nombre */}
                        <p className="text-lg font-bold leading-tight" style={{ color: '#12123F' }}>
                          {name}
                        </p>

                        {/* Rol */}
                        <p className="text-sm text-muted-foreground">
                          {role}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-8">
            {leadership.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Ir a la persona ${i + 1}`}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: selectedIndex === i ? '20px' : '7px',
                  height: '7px',
                  background: selectedIndex === i
                    ? 'linear-gradient(90deg, #6BB8FF, #9969F8)'
                    : 'rgba(107,184,255,0.4)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Location ─────────────────────────────── */
function LocationSection() {
  const t = useTranslations('About');
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className="py-20 bg-background transition-opacity duration-1000"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <MapPin className="size-8" style={{ color: '#6BB8FF' }} />
            <h2 className="text-3xl md:text-4xl font-extrabold dark:text-white" style={{ color: '#12123F' }}>
              {t('location.title')}
            </h2>
          </div>

          <p className="text-center text-muted-foreground mb-10">
            {t('location.text')}
          </p>

          <div
            className="rounded-2xl overflow-hidden shadow-sm"
            style={{ border: '1px solid rgba(107,184,255,0.3)' }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.189556446958!2d-76.60487745967019!3d2.4438432570915687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3003521ed20da5%3A0x2fbc3a807e59afa5!2sEmprendelab%20Aut%C3%B3noma!5e0!3m2!1ses!2sco!4v1781467550944!5m2!1ses!2sco"
              width="100%"
              height="350"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ecommer — Ubicación en Popayán, Cauca"
              style={{ border: 0 }}
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Differentiators ─────────────────────────────── */
function DifferentiatorsSection() {
  const t = useTranslations('About');
  const { ref, isVisible } = useScrollReveal();

  const items = [
    { key: 'simetria', icon: Bot },
    { key: 'messenger', icon: Truck },
    { key: 'compliance', icon: ShieldCheck },
    { key: 'incentives', icon: TrendingUp },
  ] as const;

  return (
    <section
      ref={ref}
      className="py-20 dark:bg-muted/20 transition-opacity duration-1000"
      style={{ background: '#F1F1F1', opacity: isVisible ? 1 : 0 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <TrendingUp className="size-8" style={{ color: '#9969F8' }} />
            <h2 className="text-3xl md:text-4xl font-extrabold dark:text-white" style={{ color: '#12123F' }}>
              {t('differentiators.title')}
            </h2>
          </div>

          <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            {t('differentiators.description')}
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {items.map(({ key, icon: Icon }, i) => {
              const accent = i % 2 === 0 ? '#6BB8FF' : '#9969F8';
              return (
                <div
                  key={key}
                  className="flex items-start gap-3 p-5 rounded-xl bg-white dark:bg-background shadow-sm"
                  style={{ border: `1px solid ${i % 2 === 0 ? 'rgba(107,184,255,0.3)' : 'rgba(153,105,248,0.3)'}` }}
                >
                  <Icon className="size-6 mt-0.5 shrink-0" style={{ color: accent }} />
                  <span className="text-sm text-foreground leading-relaxed">
                    {t(`differentiators.${key}`)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── FAQ ─────────────────────────────── */
const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5'] as const;

function FaqSection() {
  const t = useTranslations('About');
  const [open, setOpen] = useState<string | null>(null);
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className="py-20 bg-background transition-opacity duration-1000"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-extrabold mb-3"
            style={{ color: '#12123F' }}
          >
            <span className="dark:text-white">{t('faq.title')}</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqKeys.map((key) => {
            const isOpen = open === key;
            return (
              <div
                key={key}
                className="rounded-2xl overflow-hidden border transition-all duration-200"
                style={{
                  borderColor: isOpen ? '#9969F8' : 'rgba(18,18,63,0.12)',
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : key)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-foreground hover:bg-muted/30 transition-colors"
                >
                  <span>{t(`faq.${key}.q`)}</span>
                  <ChevronDown
                    className="size-4 shrink-0 transition-transform duration-200"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: isOpen ? '#9969F8' : undefined,
                    }}
                  />
                </button>
                {isOpen && (
                  <div
                    className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground"
                    style={{ borderTop: '1px solid rgba(153,105,248,0.2)' }}
                  >
                    <p className="pt-4">{t(`faq.${key}.a`)}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Legal Info Cards ─────────────────────────────── */
function LegalInfoSection() {
  const t = useTranslations('About');
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className="py-20 dark:bg-muted/20 transition-opacity duration-1000"
      style={{ background: '#F1F1F1', opacity: isVisible ? 1 : 0 }}
    >
      <div className="container mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {/* Legal */}
          <div
            className="p-6 rounded-2xl space-y-3 bg-white dark:bg-background shadow-sm"
            style={{ border: '1px solid rgba(107,184,255,0.3)' }}
          >
            <ShieldCheck className="size-8" style={{ color: '#6BB8FF' }} />
            <h3 className="text-lg font-semibold" style={{ color: '#12123F' }}>
              {t('legal.label')}
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                <strong>{t('legal.rs')}</strong> Ecommer SAS
              </p>
              <p><strong>NIT:</strong> 902008723</p>
              <p>
                <strong>{t('legal.address')}</strong> Carrera 2a 3N 23, Antiguo Liceo Popayán Cauca, CO
              </p>
            </div>
          </div>

          {/* Contact */}
          <div
            className="p-6 rounded-2xl space-y-3 bg-white dark:bg-background shadow-sm"
            style={{ border: '1px solid rgba(153,105,248,0.3)' }}
          >
            <Phone className="size-8" style={{ color: '#9969F8' }} />
            <h3 className="text-lg font-semibold" style={{ color: '#12123F' }}>
              {t('contact.label')}
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><strong>{t('contact.phone')}</strong> 3223647362</p>
              <p><strong>WhatsApp:</strong> 3223647362</p>
              <p><strong>Email:</strong> legal@ecommer.shop</p>
            </div>
          </div>

          {/* Hours */}
          <div
            className="p-6 rounded-2xl space-y-3 bg-white dark:bg-background shadow-sm"
            style={{ border: '1px solid rgba(107,184,255,0.3)' }}
          >
            <Clock className="size-8" style={{ color: '#6BB8FF' }} />
            <h3 className="text-lg font-semibold" style={{ color: '#12123F' }}>
              {t('hours.label')}
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>{t('hours.days')}</p>
              <p>8:00 – 12:00</p>
              <p>14:00 – 17:00</p>
            </div>
          </div>

          {/* Documents */}
          <div
            className="p-6 rounded-2xl space-y-3 bg-white dark:bg-background shadow-sm"
            style={{ border: '1px solid rgba(153,105,248,0.3)' }}
          >
            <FileText className="size-8" style={{ color: '#9969F8' }} />
            <h3 className="text-lg font-semibold" style={{ color: '#12123F' }}>
              {t('documents.label')}
            </h3>
            <div className="space-y-1 text-sm">
              <a
                href="https://ecommer-stg-product-images.s3.us-east-2.amazonaws.com/TemsAndConds.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="block underline"
                style={{ color: '#6BB8FF' }}
              >
                {t('documents.terms')}
              </a>
              <a
                href="https://ecommer-stg-product-images.s3.us-east-2.amazonaws.com/TemsAndConds.pdf#page=5"
                target="_blank"
                rel="noopener noreferrer"
                className="block underline"
                style={{ color: '#6BB8FF' }}
              >
                {t('documents.warranty')}
              </a>
              <a
                href="https://ecommer-stg-product-images.s3.us-east-2.amazonaws.com/TemsAndConds.pdf#page=9"
                target="_blank"
                rel="noopener noreferrer"
                className="block underline"
                style={{ color: '#6BB8FF' }}
              >
                {t('documents.withdrawal')}
              </a>
              <a
                href="https://ecommer-stg-product-images.s3.us-east-2.amazonaws.com/TemsAndConds.pdf#page=10"
                target="_blank"
                rel="noopener noreferrer"
                className="block underline"
                style={{ color: '#6BB8FF' }}
              >
                {t('documents.paymentReversal')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── CTA ─────────────────────────────── */
function CtaSection() {
  const t = useTranslations('About');

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #12123F 0%, #1a1a5e 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, #6BB8FF 0%, transparent 50%), radial-gradient(circle at 80% 50%, #9969F8 0%, transparent 50%)',
        }}
      />

      <div className="relative container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
          {t('cta.title')}
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link
            href="https://admin.ecommer.shop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg, #6BB8FF, #9969F8)' }}
          >
            <Store className="size-5" />
            {t('cta.register')}
          </Link>

          <Link
            href="https://ecommer.shop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            <Search className="size-5" />
            {t('cta.discover')}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Page ─────────────────────────────── */
export default function QuienesSomosPage() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <HistorySection />
      <MissionVisionSection />
      <AudienceSection />
      <TeamSection />
      <LocationSection />
      <DifferentiatorsSection />
      <FaqSection />
      <LegalInfoSection />
      <CtaSection />
    </main>
  );
}
