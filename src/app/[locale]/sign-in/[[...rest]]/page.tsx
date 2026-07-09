'use client';

import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Shield, Truck, Headphones } from 'lucide-react';

const perks = [
  { icon: ShoppingBag, label: 'Miles de productos' },
  { icon: Truck,       label: 'Envíos a todo Colombia' },
  { icon: Shield,      label: 'Pagos 100% seguros' },
  { icon: Headphones,  label: 'Soporte con IA 24/7' },
];

export default function SignInPage() {
  const { resolvedTheme } = useTheme();
  const locale = useLocale();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel (branding) — hidden on mobile ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d0d2b 0%, #12123F 50%, #1e0a4e 100%)' }}
      >
        {/* blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
             style={{ background: 'radial-gradient(circle, #9969F8, transparent 70%)' }} />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
             style={{ background: 'radial-gradient(circle, #6BB8FF, transparent 70%)' }} />

        {/* Logo */}
        <Link href={`/${locale}`} className="relative z-10">
          <Image
            src="/logo-light.webp"
            alt="Ecommer"
            width={140}
            height={40}
            className="object-contain"
            priority
          />
        </Link>

        {/* Center copy */}
        <div className="relative z-10 space-y-6">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: '#6BB8FF' }}>
              BIENVENIDO DE VUELTA
            </p>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Tu tienda digital,{' '}
              <span style={{
                background: 'linear-gradient(90deg, #6BB8FF, #9969F8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                siempre contigo
              </span>
            </h1>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Inicia sesión para continuar con tu compra, revisar tus pedidos y gestionar tu cuenta.
            </p>
          </div>

          {/* Perks */}
          <ul className="space-y-3">
            {perks.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                     style={{ background: 'rgba(153,105,248,0.2)', border: '1px solid rgba(153,105,248,0.4)' }}>
                  <Icon className="w-4 h-4" style={{ color: '#9969F8' }} />
                </div>
                <span className="text-sm font-medium text-white/80">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom tagline */}
        <p className="relative z-10 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          © {new Date().getFullYear()} Ecommer Shop — Colombia
        </p>
      </div>

      {/* ── Right panel (Clerk SignIn) ── */}
      <div className={`flex-1 flex flex-col items-center justify-center p-6 sm:p-12 ${
        isDark ? 'bg-[#07070f]' : 'bg-gradient-to-br from-[#f3f0ff] via-[#eef2ff] to-[#f8f7ff]'
      }`}>

        {/* Mobile logo */}
        <Link href={`/${locale}`} className="lg:hidden mb-8">
          <Image
            src={isDark ? '/logo-light.webp' : '/logo-dark.webp'}
            alt="Ecommer"
            width={120}
            height={36}
            className="object-contain"
            priority
          />
        </Link>

        <SignIn
          routing="path"
          path={`/${locale}/sign-in`}
          appearance={{
            baseTheme: isDark ? dark : undefined,
            variables: {
              borderRadius: '10px',
              colorBackground:  isDark ? '#0f0f2e' : '#ffffff',
              colorText:        isDark ? '#F1F1F1' : '#12123F',
              colorTextSecondary: '#9969F8',
              colorPrimary:     '#9969F8',
              colorNeutral:     isDark ? '#9969F8' : '#12123F',
              colorInputBackground: isDark ? '#1a1a45' : '#f5f3ff',
              colorInputText:   isDark ? '#F1F1F1' : '#12123F',
              colorShadow:      isDark
                ? '0 8px 40px rgba(153,105,248,0.25), 0 2px 12px rgba(0,0,0,0.5)'
                : '0 8px 40px rgba(153,105,248,0.12), 0 2px 12px rgba(18,18,63,0.08)',
              fontFamily: 'inherit',
              fontWeight: { normal: 400, medium: 500, bold: 700 },
            },
            elements: {
              card: {
                boxShadow: isDark
                  ? '0 8px 40px rgba(153,105,248,0.2)'
                  : '0 8px 40px rgba(153,105,248,0.1)',
                border: isDark
                  ? '1px solid rgba(153,105,248,0.2)'
                  : '1px solid rgba(153,105,248,0.15)',
              },
              formButtonPrimary: {
                background: 'linear-gradient(90deg, #9969F8, #6BB8FF)',
                color: '#ffffff',
              },
              socialButtonsBlockButton: {
                border: isDark
                  ? '1px solid rgba(153,105,248,0.25)'
                  : '1px solid rgba(18,18,63,0.15)',
              },
              footer: { display: 'none' },
            },
          }}
        />

        <p className="mt-6 text-xs text-muted-foreground text-center">
          ¿Problemas para ingresar?{' '}
          <a href="mailto:soporte@ecommer.shop" className="underline hover:text-[#9969F8] transition-colors">
            Contáctanos
          </a>
        </p>
      </div>
    </div>
  );
}
