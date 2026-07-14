'use client';

import { useCallback } from 'react';
import { Megaphone } from 'lucide-react';
import { UseVendedoresText } from './UseVendedoresText';
import { TypewriterTitle } from './TypewriterTitle';
import { FloatingChips } from './FloatingChips';
import { AgendarDemoButton } from './AgendarDemoButton';
import { getAdminUrl } from '@/lib/sellers-landing-url';
import Image from 'next/image';

export function HeroSection() {
  const handleRedirect = useCallback(() => {
    window.open(getAdminUrl(), '_blank');
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(153,105,248,0.08)_0%,transparent_70%)]" />
      <div className="absolute inset-0 -z-10 h-full w-full bg-transparent bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(153,105,248,0.22),rgba(255,255,255,0))]" />
      <div className="relative container mx-auto px-4 py-20 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            <div className="inline-flex rounded-xl items-start gap-3 bg-white/90 dark:bg-[#12123F]/80 border border-[#9969F8]/30 rounded-[9999px] px-5 py-3">
              <Megaphone className="w-5 h-5 text-[#9969F8] mt-0.5 flex-none" />
              <span className="text-sm text-[#12123F]/80 dark:text-[#F1F1F1]/80 leading-relaxed">
                <UseVendedoresText path={['hero', 'badge']} />
              </span>
            </div>
            <TypewriterTitle />
            <p className="text-lg text-[#12123F]/70 dark:text-[#F1F1F1]/70 max-w-xl leading-relaxed">
              <UseVendedoresText path={['hero', 'description']} />
            </p>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleRedirect}
                  className="inline-flex items-center gap-2 bg-[#6BB8FF] dark:bg-[#9969F8] text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all"
                >
                  <UseVendedoresText path={['hero', 'demoButton']} />
                </button>
                <AgendarDemoButton />
              </div>
              
              <div className="flex flex-col gap-3">
                <p className="text-sm text-[#12123F]/60 dark:text-[#F1F1F1]/60 font-medium">
                  <UseVendedoresText path={['hero', 'existingStoreText']} />
                </p>
                <button
                  onClick={handleRedirect}
                  className="inline-flex items-center gap-2 w-fit border-2 border-[#6BB8FF] dark:border-[#9969F8] text-[#6BB8FF] dark:text-[#9969F8] bg-white/70 dark:bg-transparent font-semibold px-6 py-3 rounded-xl hover:bg-[#6BB8FF]/10 dark:hover:bg-[#9969F8]/10 shadow-sm transition-all cursor-pointer"
                >
                  <UseVendedoresText path={['hero', 'goToStoreButton']} />
                </button>
              </div>
            </div>
          </div>
          {/* RIGHT COLUMN */}
          <div className="relative h-[500px] mt-10 hidden lg:block">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 rounded-full bg-[#6BB8FF]/5 dark:bg-[#9969F8]/5 blur-3xl absolute" />
              <div className="w-72 h-72 rounded-full bg-[#9969F8]/5 dark:bg-[#6BB8FF]/5 blur-3xl absolute -top-10 -right-10" />
              <Image className='left-70 top-10 opacity-30 inset-0 block dark:hidden'
                src="/logo-dark.webp" alt='logo' width={600} height={30} priority />

              {/* Dark */}
              <Image
                className="left-70 top-10 opacity-30 inset-0 hidden dark:block"
                src="/logo-light.webp"
                alt="Ecommer"
                width={600}
                height={30}
                priority
              />
              <FloatingChips />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
