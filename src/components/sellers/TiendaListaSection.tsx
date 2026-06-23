'use client';

import { Check } from 'lucide-react';
import { UseVendedoresText } from './UseVendedoresText';
import { Reveal } from './Reveal';
import { LoginCardPreview } from './LoginCardPreview';

const ADMIN_URL = process.env.NEXT_PUBLIC_VENDEDORES_ADMIN_URL || '#';

export function TiendaListaSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal direction="left">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-[#9969F8]">
                Simplicidad
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#12123F] dark:text-[#F1F1F1] mt-2 mb-6">
                <UseVendedoresText path={['tienda', 'title']} />
              </h2>
              <p className="text-[#12123F]/70 dark:text-[#F1F1F1]/70 text-lg mb-6">
                <UseVendedoresText path={['tienda', 'subtitle']} />
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#6BB8FF] to-[#9969F8] dark:from-[#9969F8] dark:to-[#6BB8FF] flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#12123F] dark:text-[#F1F1F1]" />
                  </div>
                  <span className="text-[#12123F]/80 dark:text-[#F1F1F1]/80 font-medium">
                    <UseVendedoresText path={['tienda', 'checklist', 'sinCodigo']} />
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#6BB8FF] to-[#9969F8] dark:from-[#9969F8] dark:to-[#6BB8FF] flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#12123F] dark:text-[#F1F1F1]" />
                  </div>
                  <span className="text-[#12123F]/80 dark:text-[#F1F1F1]/80 font-medium">
                    <UseVendedoresText path={['tienda', 'checklist', 'posicionamiento']} />
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#6BB8FF] to-[#9969F8] dark:from-[#9969F8] dark:to-[#6BB8FF] flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#12123F] dark:text-[#F1F1F1]" />
                  </div>
                  <span className="text-[#12123F]/80 dark:text-[#F1F1F1]/80 font-medium">
                    <UseVendedoresText path={['tienda', 'checklist', 'panel']} />
                  </span>
                </li>
              </ul>
              <a
                href={ADMIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6BB8FF] to-[#9969F8] dark:from-[#9969F8] dark:to-[#6BB8FF] text-[#12123F] dark:text-[#F1F1F1] px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
              >
                <UseVendedoresText path={['tienda', 'buttonText']} />
              </a>
            </div>
          </Reveal>
          <Reveal direction="right">
            <div className="bg-white/80 dark:bg-[#12123F]/60 backdrop-blur-md border border-black/10 dark:border-[#F1F1F1]/10 rounded-2xl p-8">
              <LoginCardPreview />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
