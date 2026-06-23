'use client';

import { Coffee, Shirt, Gem } from 'lucide-react';
import { UseVendedoresText } from './UseVendedoresText';
import { Reveal } from './Reveal';
import { StaggerGrid, StaggerItem } from './StaggerGrid';

export function EnfoqueSectorialSection() {
  return (
    <section className="py-24">
      <Reveal>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#12123F] dark:text-[#F1F1F1] mb-4">
                <UseVendedoresText path={['enfoqueSectorial', 'title']} />
              </h2>
              <p className="text-[#12123F]/70 dark:text-[#F1F1F1]/70 text-lg max-w-xl">
                <UseVendedoresText path={['enfoqueSectorial', 'subtitle']} />
              </p>
            </div>
            <button className="border border-black/[0.12] dark:border-[#F1F1F1]/20 rounded-xl px-4 py-2 text-sm text-[#12123F]/70 dark:text-[#F1F1F1]/70 hover:border-[#9969F8]/40 hover:text-[#9969F8] dark:hover:text-[#F1F1F1] transition-all flex-shrink-0">
              <UseVendedoresText path={['enfoqueSectorial', 'buttonText']} />
            </button>
          </div>
          <StaggerGrid className="grid grid-cols-12 gap-6" staggerDelay={0.12}>
            <StaggerItem className="col-span-12 md:col-span-7 rounded-2xl overflow-hidden relative min-h-[280px] group border border-black/[0.06] dark:border-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6BB8FF]/5 via-[#F1F1F1] to-[#F1F1F1] dark:from-[#12123F] dark:via-[#12123F] dark:to-[#9969F8]/20" />
              <div className="hidden dark:block absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                <div>
                  <span className="inline-block text-xs font-semibold tracking-wider text-[#6BB8FF] bg-black/5 dark:bg-black/30 px-3 py-1 rounded-full mb-3">
                    <UseVendedoresText path={['enfoqueSectorial', 'items', 'cafe', 'badge']} />
                  </span>
                  <h3 className="text-2xl font-bold text-[#12123F] dark:text-[#F1F1F1] mb-2">
                    <UseVendedoresText path={['enfoqueSectorial', 'items', 'cafe', 'title']} />
                  </h3>
                  <p className="text-[#12123F]/70 dark:text-[#F1F1F1]/70 text-sm max-w-lg">
                    <UseVendedoresText path={['enfoqueSectorial', 'items', 'cafe', 'description']} />
                  </p>
                </div>
                <div className="absolute bottom-6 right-6 opacity-20">
                  <Coffee size={80} className="text-[#6BB8FF]" />
                </div>
              </div>
            </StaggerItem>
            <StaggerItem className="col-span-12 md:col-span-5 rounded-2xl overflow-hidden relative min-h-[280px] group border border-black/[0.06] dark:border-none">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6BB8FF]/5 via-[#F1F1F1] to-[#F1F1F1] dark:from-[#12123F] dark:via-[#15152a] dark:to-[#1a2040]" />
              <div className="hidden dark:block absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                <div>
                  <span className="inline-block text-xs font-semibold tracking-wider text-[#9969F8] bg-black/5 dark:bg-black/30 px-3 py-1 rounded-full mb-3">
                    <UseVendedoresText path={['enfoqueSectorial', 'items', 'moda', 'badge']} />
                  </span>
                  <h3 className="text-2xl font-bold text-[#12123F] dark:text-[#F1F1F1] mb-2">
                    <UseVendedoresText path={['enfoqueSectorial', 'items', 'moda', 'title']} />
                  </h3>
                  <p className="text-[#12123F]/70 dark:text-[#F1F1F1]/70 text-sm max-w-md">
                    <UseVendedoresText path={['enfoqueSectorial', 'items', 'moda', 'description']} />
                  </p>
                </div>
                <div className="absolute bottom-6 right-6 opacity-20">
                  <Shirt size={80} className="text-[#9969F8]" />
                </div>
              </div>
            </StaggerItem>
            <StaggerItem className="col-span-12 rounded-2xl overflow-hidden relative min-h-[220px] group border border-black/[0.06] dark:border-none">
              <div className="absolute inset-0 bg-gradient-to-r from-[#6BB8FF]/5 via-[#F1F1F1] to-[#F1F1F1] dark:from-[#12123F] dark:via-[#9969F8]/15 dark:to-[#12123F]" />
              <div className="absolute inset-0 opacity-10 dark:opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #9969F8 1px, transparent 1px), radial-gradient(circle at 75% 50%, #6BB8FF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              <div className="hidden dark:block absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
              <div className="relative z-10 p-8 flex flex-col h-full justify-center">
                <span className="inline-block text-xs font-semibold tracking-wider text-[#6BB8FF] bg-black/5 dark:bg-black/30 px-3 py-1 rounded-full mb-3 w-fit">
                  <UseVendedoresText path={['enfoqueSectorial', 'items', 'artesanias', 'badge']} />
                </span>
                <h3 className="text-2xl font-bold text-[#12123F] dark:text-[#F1F1F1] mb-2">
                  <UseVendedoresText path={['enfoqueSectorial', 'items', 'artesanias', 'title']} />
                </h3>
                <p className="text-[#12123F]/70 dark:text-[#F1F1F1]/70 text-sm max-w-2xl mb-4">
                  <UseVendedoresText path={['enfoqueSectorial', 'items', 'artesanias', 'description']} />
                </p>
                <a className="text-[#9969F8] text-sm font-semibold hover:underline inline-flex items-center gap-1 w-fit">
                  <UseVendedoresText path={['enfoqueSectorial', 'items', 'artesanias', 'link']} />
                </a>
              </div>
              <div className="absolute bottom-6 right-6 opacity-10">
                <Gem size={100} className="text-[#9969F8]" />
              </div>
            </StaggerItem>
          </StaggerGrid>
        </div>
      </Reveal>
    </section>
  );
}
