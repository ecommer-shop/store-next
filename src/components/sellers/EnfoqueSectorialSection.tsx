'use client';

import { Coffee, Shirt, Gem } from 'lucide-react';
import Link from 'next/link';
import { UseVendedoresText } from './UseVendedoresText';
import { Reveal } from './Reveal';
import { StaggerGrid, StaggerItem } from './StaggerGrid';
import Image from 'next/image';

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
            <Link href="/search" className="border border-black/[0.12] dark:border-[#F1F1F1]/20 rounded-xl px-4 py-2 text-sm text-[#12123F]/70 dark:text-[#F1F1F1]/70 hover:border-[#9969F8]/40 hover:text-[#9969F8] dark:hover:text-[#F1F1F1] transition-all flex-shrink-0 inline-flex items-center justify-center">
              <UseVendedoresText path={['enfoqueSectorial', 'buttonText']} />
            </Link>
          </div>
          <StaggerGrid className="grid grid-cols-12 gap-6" staggerDelay={0.12}>
            <StaggerItem className="col-span-12 md:col-span-7 rounded-2xl overflow-hidden relative min-h-[280px] group border border-black/6 dark:border-none transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute inset-0">
                <Image
                  src="/landingcafe.webp"
                  alt="Café"
                  fill
                  priority
                  className="object-cover object-center"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-br from-[#9969F8]/30 via-[#F1F1F1]/15 to-[#F1F1F1]/90 dark:from-[#12123F]/55 dark:via-[#12123F]/25 dark:to-[#9969F8]/30" />
              <div className="hidden dark:block absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
              <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                <div>
                  <span className="inline-block text-xs font-semibold tracking-wider text-[#6BB8FF] bg-black/5 dark:bg-black/30 px-3 py-1 rounded-full mb-3 transition-colors duration-300 group-hover:bg-[#6BB8FF]/10">
                    <UseVendedoresText path={['enfoqueSectorial', 'items', 'cafe', 'badge']} />
                  </span>
                  <h3 className="text-2xl font-bold text-[#12123F] dark:text-[#F1F1F1] mb-2">
                    <UseVendedoresText path={['enfoqueSectorial', 'items', 'cafe', 'title']} />
                  </h3>
                  <p className="text-[#12123F]/70 dark:text-[#F1F1F1]/70 text-sm max-w-lg">
                    <UseVendedoresText path={['enfoqueSectorial', 'items', 'cafe', 'description']} />
                  </p>
                </div>
                <div className="absolute bottom-6 right-6 opacity-20 transition-all duration-300 group-hover:opacity-40 group-hover:scale-110">
                  <Coffee size={80} className="text-[#6BB8FF]" />
                </div>
              </div>
            </StaggerItem>

            <StaggerItem className="col-span-12 md:col-span-5 rounded-2xl overflow-hidden relative min-h-[280px] group border border-black/6 dark:border-none transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute inset-0">
                <Image
                  src="/landingshoes.webp"
                  alt="Moda y calzado"
                  fill
                  priority
                  className="object-cover object-center"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-br from-[#6BB8FF]/18 via-[#F1F1F1]/20 to-[#6BB8FF]/72 dark:from-[#12123F]/58 dark:via-[#15152a]/58 dark:to-[#1a2040]/35" />
              <div className="hidden dark:block absolute inset-0 bg-linear-to-t from-black/55 to-transparent" />
              <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                <div>
                  <span className="inline-block text-xs font-semibold tracking-wider text-[#F1F1F1] bg-black/5 dark:bg-black/30 px-3 py-1 rounded-full mb-3 transition-colors duration-300 group-hover:bg-[#9969F8]/10">
                    <UseVendedoresText path={['enfoqueSectorial', 'items', 'moda', 'badge']} />
                  </span>
                  <h3 className="text-2xl font-bold text-[#12123F] dark:text-[#F1F1F1] mb-2">
                    <UseVendedoresText path={['enfoqueSectorial', 'items', 'moda', 'title']} />
                  </h3>
                  <p className="text-[#12123F]/70 dark:text-[#F1F1F1]/70 text-sm max-w-md">
                    <UseVendedoresText path={['enfoqueSectorial', 'items', 'moda', 'description']} />
                  </p>
                </div>
                <div className="absolute bottom-6 right-6 opacity-20 transition-all duration-300 group-hover:opacity-40 group-hover:scale-110">
                  <Shirt size={80} className="text-[#f1f1f1] dark:text-[#9969F8]" />
                </div>
              </div>
            </StaggerItem>

            <StaggerItem className="col-span-12 rounded-2xl overflow-hidden relative min-h-[220px] group border border-black/6 dark:border-none transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute inset-0">
                <Image
                  src="/landingart.webp"
                  alt="Artesanías"
                  fill
                  priority
                  className="object-cover object-[center_28%]"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-r from-[#6BB8FF]/18 via-[#6BB8FF]/1 to-[#6BB8FF]/62 dark:from-[#12123F]/58 dark:via-[#9969F8]/22 dark:to-[#12123F]/82" />
              <div className="absolute inset-0 opacity-10 dark:opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #9969F8 1px, transparent 1px), radial-gradient(circle at 75% 50%, #6BB8FF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
              <div className="hidden dark:block absolute inset-0 bg-linear-to-r from-black/40 to-transparent" />
              <div className="relative z-10 p-8 flex flex-col h-full justify-center">
                <span className="inline-block text-xs font-semibold tracking-wider text-[#9969F8] bg-black/5 dark:bg-black/30 px-3 py-1 rounded-full mb-3 w-fit transition-colors duration-300 group-hover:bg-[#6BB8FF]/10">
                  <UseVendedoresText path={['enfoqueSectorial', 'items', 'artesanias', 'badge']} />
                </span>
                <h3 className="text-2xl font-bold text-[#12123F] dark:text-[#F1F1F1] mb-2">
                  <UseVendedoresText path={['enfoqueSectorial', 'items', 'artesanias', 'title']} />
                </h3>
                <p className="text-[#12123F]/70 dark:text-[#F1F1F1]/70 text-sm max-w-2xl mb-4">
                  <UseVendedoresText path={['enfoqueSectorial', 'items', 'artesanias', 'description']} />
                </p>
                <a className="text-[#6bb8ff] text-sm font-semibold hover:underline inline-flex items-center gap-1 w-fit">
                  <UseVendedoresText path={['enfoqueSectorial', 'items', 'artesanias', 'link']} />
                </a>
              </div>
              <div className="absolute bottom-6 right-6 opacity-10 transition-all duration-300 group-hover:opacity-40 group-hover:scale-110">
                <Gem size={100} className="text-[#12123F] dark:text-[#9969F8]" />
              </div>
            </StaggerItem>
          </StaggerGrid>
        </div>
      </Reveal>
    </section>
  );
}
