'use client';

import { UseVendedoresText } from './UseVendedoresText';
import { Reveal } from './Reveal';
import { AgendarDemoButton } from './AgendarDemoButton';

const ADMIN_URL = process.env.NEXT_PUBLIC_VENDEDORES_ADMIN_URL || '#';

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(153,105,248,0.06)_0%,_transparent_70%)]" />
      <Reveal direction="none">
        <div className="container mx-auto px-4 text-center relative">
          <Reveal direction="none" scale={0.95}>
            <div className="bg-white/80 dark:bg-[#12123F]/60 backdrop-blur-md border border-black/10 dark:border-[#F1F1F1]/10 rounded-3xl p-12 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[#12123F] dark:text-[#F1F1F1] mb-4 leading-tight">
                <UseVendedoresText path={['cta', 'title']} />
              </h2>
              <p className="text-[#12123F]/70 dark:text-[#F1F1F1]/70 text-lg mb-8">
                <UseVendedoresText path={['cta', 'subtitle']} />
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <AgendarDemoButton />
                <a
                  href={ADMIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-black/[0.12] dark:border-[#F1F1F1]/20 text-[#12123F] dark:text-[#F1F1F1] px-8 py-3 rounded-xl font-semibold hover:bg-black/5 dark:hover:bg-[#F1F1F1]/10 transition-all"
                >
                  <UseVendedoresText path={['cta', 'storeButton']} />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </Reveal>
    </section>
  );
}
