'use client';

import { useCallback } from 'react';
import { Check } from 'lucide-react';
import { UseVendedoresText } from './UseVendedoresText';
import { Reveal } from './Reveal';
import { StaggerGrid, StaggerItem } from './StaggerGrid';
import { getBillingAdminUrl } from '@/lib/sellers-landing-url';

export function PlanesSection() {
  const billingUrl = getBillingAdminUrl();

  const handleRedirect = useCallback(() => {
    window.open(billingUrl, '_blank');
  }, [billingUrl]);

  return (
    <section className="py-24">
      <Reveal>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#12123F] dark:text-[#F1F1F1] mb-4">
              <UseVendedoresText path={['planes', 'title']} />
            </h2>
            <p className="text-[#12123F]/70 dark:text-[#F1F1F1]/70 text-lg max-w-2xl mx-auto">
              <UseVendedoresText path={['planes', 'subtitle']} />
            </p>
          </div>
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch" staggerDelay={0.12}>
            {/* Free */}
            <StaggerItem className="bg-white/60 dark:bg-[#12123F]/40 backdrop-blur-md border border-black/10 dark:border-[#F1F1F1]/10 rounded-2xl p-8 flex flex-col transition-all hover:border-black/[0.12] dark:hover:border-[#F1F1F1]/20">
              <h3 className="text-xl font-bold text-[#12123F] dark:text-[#F1F1F1] mb-2">
                <UseVendedoresText path={['planes', 'cards', 'free', 'name']} />
              </h3>
              <p className="text-3xl font-extrabold text-[#12123F] dark:text-[#F1F1F1] mb-2">
                <UseVendedoresText path={['planes', 'cards', 'free', 'price']} />
              </p>
              <p className="text-sm text-[#12123F]/50 dark:text-[#F1F1F1]/50 mb-6">
                <UseVendedoresText path={['planes', 'cards', 'free', 'description']} />
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-[#12123F]/70 dark:text-[#F1F1F1]/70">
                  <Check className="w-4 h-4 text-[#6BB8FF] flex-shrink-0" />
                  <UseVendedoresText path={['planes', 'cards', 'free', 'features', 'products']} />
                </li>
                <li className="flex items-center gap-3 text-sm text-[#12123F]/70 dark:text-[#F1F1F1]/70">
                  <Check className="w-4 h-4 text-[#6BB8FF] flex-shrink-0" />
                  <UseVendedoresText path={['planes', 'cards', 'free', 'features', 'variations']} />
                </li>
              </ul>
              <button
                onClick={handleRedirect}
                className="w-full text-center border border-black/[0.12] dark:border-[#F1F1F1]/20 text-[#12123F] dark:text-[#F1F1F1] px-6 py-3 rounded-xl font-semibold hover:bg-black/5 dark:hover:bg-[#F1F1F1]/10 transition-all"
              >
                <UseVendedoresText path={['planes', 'cards', 'free', 'buttonText']} />
              </button>
            </StaggerItem>
            {/* Tienda - Destacado */}
            <StaggerItem className="relative bg-gradient-to-b from-[#6BB8FF]/10 via-white to-white dark:from-[#9969F8]/15 dark:via-[#12123F]/90 dark:to-[#12123F] border-2 border-[#6BB8FF]/70 dark:border-[#9969F8]/70 rounded-2xl p-8 flex flex-col shadow-[0_0_50px_-12px_rgba(107,184,255,0.15)] dark:shadow-[0_0_50px_-12px_rgba(153,105,248,0.3)] transition-all hover:shadow-[0_0_40px_rgba(107,184,255,0.2)] dark:hover:shadow-[0_0_40px_rgba(153,105,248,0.3)] scale-[1.02]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#6BB8FF] dark:bg-[#9969F8] text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                <UseVendedoresText path={['planes', 'popular']} />
              </div>
              <h3 className="text-xl font-bold text-[#12123F] dark:text-[#F1F1F1] mb-2">
                <UseVendedoresText path={['planes', 'cards', 'tienda', 'name']} />
              </h3>
              <p className="text-3xl font-extrabold text-[#12123F] dark:text-[#F1F1F1] mb-2">
                <UseVendedoresText path={['planes', 'cards', 'tienda', 'price']} />
              </p>
              <p className="text-sm text-[#12123F]/50 dark:text-[#F1F1F1]/50 mb-6">
                <UseVendedoresText path={['planes', 'cards', 'tienda', 'description']} />
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-[#12123F]/70 dark:text-[#F1F1F1]/70">
                  <Check className="w-4 h-4 text-[#6BB8FF] flex-shrink-0" />
                  <UseVendedoresText path={['planes', 'cards', 'tienda', 'features', 'products']} />
                </li>
                <li className="flex items-center gap-3 text-sm text-[#12123F]/70 dark:text-[#F1F1F1]/70">
                  <Check className="w-4 h-4 text-[#6BB8FF] flex-shrink-0" />
                  <UseVendedoresText path={['planes', 'cards', 'tienda', 'features', 'variations']} />
                </li>
                <li className="flex items-center gap-3 text-sm text-[#12123F]/70 dark:text-[#F1F1F1]/70">
                  <Check className="w-4 h-4 text-[#6BB8FF] flex-shrink-0" />
                  <UseVendedoresText path={['planes', 'cards', 'tienda', 'features', 'simetria']} />
                </li>
              </ul>
              <button
                onClick={handleRedirect}
                className="w-full text-center bg-gradient-to-r from-[#6BB8FF] to-[#9969F8] dark:from-[#9969F8] dark:to-[#7E42E5] text-white dark:text-[#F1F1F1] px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-[0_0_20px_rgba(107,184,255,0.3)] dark:shadow-[0_0_20px_rgba(153,105,248,0.4)]"
              >
                <UseVendedoresText path={['planes', 'cards', 'tienda', 'buttonText']} />
              </button>
            </StaggerItem>
            {/* Omnichannel */}
            <StaggerItem className="bg-white/60 dark:bg-[#12123F]/40 backdrop-blur-md border border-black/10 dark:border-[#F1F1F1]/10 rounded-2xl p-8 flex flex-col transition-all hover:border-black/[0.12] dark:hover:border-[#F1F1F1]/20">
              <h3 className="text-xl font-bold text-[#12123F] dark:text-[#F1F1F1] mb-2">
                <UseVendedoresText path={['planes', 'cards', 'omnichannel', 'name']} />
              </h3>
              <p className="text-3xl font-extrabold text-[#12123F] dark:text-[#F1F1F1] mb-2">
                <UseVendedoresText path={['planes', 'cards', 'omnichannel', 'price']} />
              </p>
              <p className="text-sm text-[#12123F]/50 dark:text-[#F1F1F1]/50 mb-6">
                <UseVendedoresText path={['planes', 'cards', 'omnichannel', 'description']} />
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-[#12123F]/70 dark:text-[#F1F1F1]/70">
                  <Check className="w-4 h-4 text-[#6BB8FF] flex-shrink-0" />
                  <UseVendedoresText path={['planes', 'cards', 'omnichannel', 'features', 'products']} />
                </li>
                <li className="flex items-center gap-3 text-sm text-[#12123F]/70 dark:text-[#F1F1F1]/70">
                  <Check className="w-4 h-4 text-[#6BB8FF] flex-shrink-0" />
                  <UseVendedoresText path={['planes', 'cards', 'omnichannel', 'features', 'variations']} />
                </li>
                <li className="flex items-center gap-3 text-sm text-[#12123F]/70 dark:text-[#F1F1F1]/70">
                  <Check className="w-4 h-4 text-[#6BB8FF] flex-shrink-0" />
                  <UseVendedoresText path={['planes', 'cards', 'omnichannel', 'features', 'simetria']} />
                </li>
              </ul>
              <button
                onClick={handleRedirect}
                className="w-full text-center border border-black/[0.12] dark:border-[#F1F1F1]/20 text-[#12123F] dark:text-[#F1F1F1] px-6 py-3 rounded-xl font-semibold hover:bg-black/5 dark:hover:bg-[#F1F1F1]/10 transition-all"
              >
                <UseVendedoresText path={['planes', 'cards', 'omnichannel', 'buttonText']} />
              </button>
            </StaggerItem>
          </StaggerGrid>
        </div>
      </Reveal>
    </section>
  );
}
