'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Truck,
  FileText,
  Headphones,
  ChevronDown,
  ArrowRight,
  ShoppingBag,
  Store,
  Package,
  CreditCard,
  Bot,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { getSellersLandingUrl } from '@/lib/sellers-landing-url';

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
  const t = useTranslations('Users');

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

        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
          {t('hero.title')}{' '}
          <span
            className="block md:inline"
            style={{
              background: 'linear-gradient(90deg, #6BB8FF, #9969F8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t('hero.highlight')}
          </span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {t('hero.description')}
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all hover:scale-105 hover:shadow-2xl"
          style={{ background: 'linear-gradient(90deg, #6BB8FF, #9969F8)' }}
        >
          <ShoppingBag className="size-5" />
          {t('cta.shopButton')}
        </Link>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Welcome ─────────────────────────────── */
function WelcomeSection() {
  const t = useTranslations('Users');
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
            {t('welcome.title')}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            {t('welcome.description')}
          </p>
          <div
            className="p-6 rounded-2xl"
            style={{ background: 'rgba(107,184,255,0.1)', border: '1px solid rgba(107,184,255,0.3)' }}
          >
            <p className="text-sm text-foreground leading-relaxed">
              {t('welcome.free')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Payments (Wompi) ─────────────────────────────── */
function PaymentsSection() {
  const t = useTranslations('Users');
  const { ref, isVisible } = useScrollReveal();

  const methods = [
    'cards',
    'debit',
    'nequi',
    'bancolombia',
    'button',
    'pse',
    'others',
  ] as const;

  return (
    <section
      id="payments"
      ref={ref}
      className="py-20 dark:bg-muted/20 transition-opacity duration-1000"
      style={{ background: '#F1F1F1', opacity: isVisible ? 1 : 0 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CreditCard className="size-8" style={{ color: '#9969F8' }} />
            <h2 className="text-3xl md:text-4xl font-extrabold dark:text-white" style={{ color: '#12123F' }}>
              {t('payments.title')}
            </h2>
          </div>

          <p className="text-center text-muted-foreground mb-6 max-w-3xl mx-auto">
            {t('payments.description')}
          </p>

          <p className="text-center text-sm text-muted-foreground mb-8">
            {t('payments.intro')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {methods.map((method, i) => (
              <div
                key={method}
                className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-background shadow-sm"
                style={{
                  border: `1px solid ${i % 2 === 0 ? 'rgba(107,184,255,0.3)' : 'rgba(153,105,248,0.3)'}`,
                }}
              >
                <CheckCircle2 className="size-5 shrink-0" style={{ color: i % 2 === 0 ? '#6BB8FF' : '#9969F8' }} />
                <span className="text-sm text-foreground">{t(`payments.methods.${method}`)}</span>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-background shadow-sm">
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              {t('payments.security')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Shipping ─────────────────────────────── */
function ShippingSection() {
  const t = useTranslations('Users');
  const { ref, isVisible } = useScrollReveal();

  const factors = ['origin', 'destination', 'weight', 'carrier', 'rates'] as const;

  return (
    <section
      id="shipping"
      ref={ref}
      className="py-20 bg-background transition-opacity duration-1000"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Truck className="size-8" style={{ color: '#6BB8FF' }} />
            <h2 className="text-3xl md:text-4xl font-extrabold dark:text-white" style={{ color: '#12123F' }}>
              {t('shipping.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Local */}
            <div
              className="p-8 rounded-2xl"
              style={{ background: 'rgba(107,184,255,0.1)', border: '1px solid rgba(107,184,255,0.3)' }}
            >
              <h3 className="text-xl font-bold mb-3 dark:text-white" style={{ color: '#12123F' }}>
                {t('shipping.local.title')}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {t('shipping.local.description')}
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {t('shipping.local.benefit')}
              </p>
            </div>

            {/* National */}
            <div
              className="p-8 rounded-2xl"
              style={{ background: 'rgba(153,105,248,0.1)', border: '1px solid rgba(153,105,248,0.3)' }}
            >
              <h3 className="text-xl font-bold mb-3 dark:text-white" style={{ color: '#12123F' }}>
                {t('shipping.national.title')}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {t('shipping.national.description')}
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {t('shipping.national.benefit')}
              </p>
            </div>
          </div>

          {/* Factors */}
          <div className="p-6 rounded-2xl bg-muted/30">
            <p className="font-semibold mb-4 text-foreground">{t('shipping.factors.title')}</p>
            <ul className="space-y-2">
              {factors.map((factor, i) => (
                <li key={factor} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="size-4 mt-0.5 shrink-0" style={{ color: i % 2 === 0 ? '#6BB8FF' : '#9969F8' }} />
                  {t(`shipping.factors.${factor}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Tracking ─────────────────────────────── */
function TrackingSection() {
  const t = useTranslations('Users');
  const { ref, isVisible } = useScrollReveal();

  const statuses = ['received', 'confirmed', 'preparing', 'dispatched', 'transit', 'delivered'] as const;

  return (
    <section
      id="tracking"
      ref={ref}
      className="py-20 dark:bg-muted/20 transition-opacity duration-1000"
      style={{ background: '#F1F1F1', opacity: isVisible ? 1 : 0 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Package className="size-8" style={{ color: '#9969F8' }} />
            <h2 className="text-3xl md:text-4xl font-extrabold dark:text-white" style={{ color: '#12123F' }}>
              {t('tracking.title')}
            </h2>
          </div>

          <p className="text-center text-muted-foreground mb-6 max-w-3xl mx-auto">
            {t('tracking.description')}
          </p>

          <p className="text-center text-sm text-muted-foreground mb-8">
            {t('tracking.intro')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {statuses.map((status, i) => (
              <div
                key={status}
                className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-background shadow-sm"
                style={{
                  border: `1px solid ${i % 2 === 0 ? 'rgba(107,184,255,0.3)' : 'rgba(153,105,248,0.3)'}`,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: i % 2 === 0 ? '#6BB8FF' : '#9969F8' }}
                />
                <span className="text-sm text-foreground">{t(`tracking.statuses.${status}`)}</span>
              </div>
            ))}
          </div>

          {/* Envia.com tracking info */}
          <div 
            className="p-8 rounded-2xl bg-white dark:bg-background shadow-md"
            style={{ border: '2px solid rgba(153,105,248,0.2)' }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(153,105,248,0.15)' }}
              >
                <Truck className="size-6" style={{ color: '#9969F8' }} />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 dark:text-white" style={{ color: '#12123F' }}>
                  Seguimiento con Número de Guía (Envíos Nacionales)
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('tracking.national')}
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 mt-0.5 shrink-0" style={{ color: '#6BB8FF' }} />
                  <div>
                    <p className="text-xs font-semibold mb-1 text-foreground">Rastreo en tiempo real</p>
                    <p className="text-xs text-muted-foreground">Conoce la ubicación exacta de tu paquete</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 mt-0.5 shrink-0" style={{ color: '#9969F8' }} />
                  <div>
                    <p className="text-xs font-semibold mb-1 text-foreground">Múltiples transportadoras</p>
                    <p className="text-xs text-muted-foreground">Integración con principales operadores logísticos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 mt-0.5 shrink-0" style={{ color: '#6BB8FF' }} />
                  <div>
                    <p className="text-xs font-semibold mb-1 text-foreground">Historial completo</p>
                    <p className="text-xs text-muted-foreground">Visualiza todos los eventos de tu envío</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Support (SimetrIA) ─────────────────────────────── */
function SupportSection() {
  const t = useTranslations('Users');
  const { ref, isVisible } = useScrollReveal();

  const topics = ['orders', 'products', 'payments', 'shipping', 'purchases', 'platform', 'faq', 'support'] as const;

  const openChat = () => {
    window.dispatchEvent(new Event('open-simetria-chat'));
  };

  return (
    <section
      id="support"
      ref={ref}
      className="py-20 bg-background transition-opacity duration-1000"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Bot className="size-8" style={{ color: '#6BB8FF' }} />
            <h2 className="text-3xl md:text-4xl font-extrabold dark:text-white" style={{ color: '#12123F' }}>
              {t('support.title')}
            </h2>
          </div>

          <p className="text-center text-muted-foreground mb-6 max-w-3xl mx-auto">
            {t('support.description')}
          </p>

          <p className="text-center text-sm text-muted-foreground mb-8">
            {t('support.intro')}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {topics.map((topic, i) => (
              <div
                key={topic}
                className="flex items-center justify-center p-3 rounded-lg text-center bg-white dark:bg-muted/20 shadow-sm"
                style={{
                  border: `1px solid ${i % 2 === 0 ? 'rgba(107,184,255,0.3)' : 'rgba(153,105,248,0.3)'}`,
                }}
              >
                <span className="text-xs text-foreground">{t(`support.topics.${topic}`)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-8">
            <div
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(107,184,255,0.1)', border: '1px solid rgba(107,184,255,0.3)' }}
            >
              <p className="text-sm text-foreground leading-relaxed">
                {t('support.human')}
              </p>
            </div>

            <div
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(153,105,248,0.1)', border: '1px solid rgba(153,105,248,0.3)' }}
            >
              <p className="text-sm text-foreground leading-relaxed">
                {t('support.combination')}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={openChat}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all hover:scale-105 hover:shadow-lg cursor-pointer"
              style={{ background: 'linear-gradient(90deg, #6BB8FF, #9969F8)' }}
            >
              <Bot className="size-5" />
              Habla con nuestro agente
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Security ─────────────────────────────── */
function SecuritySection() {
  const t = useTranslations('Users');
  const { ref, isVisible } = useScrollReveal();

  const features = ['https', 'wompi', 'privacy', 'tracking', 'confirmation', 'processes'] as const;

  return (
    <section
      id="security"
      ref={ref}
      className="py-20 dark:bg-muted/20 transition-opacity duration-1000"
      style={{ background: '#F1F1F1', opacity: isVisible ? 1 : 0 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Lock className="size-8" style={{ color: '#9969F8' }} />
            <h2 className="text-3xl md:text-4xl font-extrabold dark:text-white" style={{ color: '#12123F' }}>
              {t('security.title')}
            </h2>
          </div>

          <p className="text-center text-muted-foreground mb-6">
            {t('security.description')}
          </p>

          <p className="text-center text-sm text-muted-foreground mb-8">
            {t('security.intro')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <div
                key={feature}
                className="flex items-start gap-3 p-5 rounded-xl bg-white dark:bg-background shadow-sm"
                style={{
                  border: `1px solid ${i % 2 === 0 ? 'rgba(107,184,255,0.3)' : 'rgba(153,105,248,0.3)'}`,
                }}
              >
                <ShieldCheck className="size-5 mt-0.5 shrink-0" style={{ color: i % 2 === 0 ? '#6BB8FF' : '#9969F8' }} />
                <span className="text-sm text-foreground">{t(`security.features.${feature}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── How to Buy ─────────────────────────────── */
function HowToBuySection() {
  const t = useTranslations('Users');
  const { ref, isVisible } = useScrollReveal();

  const steps = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7', 'step8'] as const;

  return (
    <section
      id="how-to-buy"
      ref={ref}
      className="py-20 bg-background transition-opacity duration-1000"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-center dark:text-white" style={{ color: '#12123F' }}>
            {t('howToBuy.title')}
          </h2>

          <p className="text-center text-muted-foreground mb-10">
            {t('howToBuy.description')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step, i) => (
              <div
                key={step}
                className="flex items-start gap-4 p-5 rounded-xl bg-muted/20 hover:bg-muted/30 transition-all"
                style={{
                  border: `1px solid ${i % 2 === 0 ? 'rgba(107,184,255,0.2)' : 'rgba(153,105,248,0.2)'}`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm"
                  style={{ background: i % 2 === 0 ? '#6BB8FF' : '#9969F8' }}
                >
                  {i + 1}
                </div>
                <p className="text-sm text-foreground leading-relaxed">{t(`howToBuy.steps.${step}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Commitment ─────────────────────────────── */
function CommitmentSection() {
  const t = useTranslations('Users');
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      id="commitment"
      ref={ref}
      className="py-20 dark:bg-muted/20 transition-opacity duration-1000"
      style={{ background: '#F1F1F1', opacity: isVisible ? 1 : 0 }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 dark:text-white" style={{ color: '#12123F' }}>
            {t('commitment.title')}
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            {t('commitment.description')}
          </p>

          <div
            className="p-6 rounded-2xl"
            style={{ background: 'rgba(153,105,248,0.1)', border: '1px solid rgba(153,105,248,0.3)' }}
          >
            <p className="text-sm text-foreground leading-relaxed">
              {t('commitment.goal')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── FAQ ─────────────────────────────── */
const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'] as const;

function FaqSection() {
  const t = useTranslations('Users');
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
          <p className="text-muted-foreground">{t('faq.subtitle')}</p>
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

/* ─────────────────────────────── CTA ─────────────────────────────── */
function CtaSection() {
  const t = useTranslations('Users');
  const sellersLandingUrl = getSellersLandingUrl();

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
        <p className="mb-10 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {t('cta.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(90deg, #6BB8FF, #9969F8)' }}
          >
            <ShoppingBag className="size-5" />
            {t('cta.shopButton')}
            <ArrowRight className="size-4" />
          </Link>

          <button
            onClick={() => window.location.assign(sellersLandingUrl)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            <Store className="size-5" />
            {t('cta.sellButton')}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Page ─────────────────────────────── */
export default function UsersPage() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <WelcomeSection />
      <PaymentsSection />
      <ShippingSection />
      <TrackingSection />
      <SupportSection />
      <SecuritySection />
      <HowToBuySection />
      <CommitmentSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
