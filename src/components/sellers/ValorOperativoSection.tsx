'use client';

import { FileText, CreditCard, Truck, BarChart3 } from 'lucide-react';
import { UseVendedoresText } from './UseVendedoresText';
import { Reveal } from './Reveal';
import { StaggerGrid, StaggerItem } from './StaggerGrid';

export function ValorOperativoSection() {
  return (
    <section className="py-24">
      <Reveal>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#12123F] dark:text-[#F1F1F1] mb-4">
              <UseVendedoresText path={['valorOperativo', 'title']} />
            </h2>
            <p className="text-[#12123F]/70 dark:text-[#F1F1F1]/70 text-lg max-w-2xl mx-auto">
              <UseVendedoresText path={['valorOperativo', 'subtitle']} />
            </p>
          </div>
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {([
              { key: 'dian', icon: FileText, color: '#9969F8' },
              { key: 'wompi', icon: CreditCard, color: '#6BB8FF' },
              { key: 'logistica', icon: Truck, color: '#9969F8' },
              { key: 'panel', icon: BarChart3, color: '#6BB8FF' },
            ] as const).map(({ key, icon: Icon, color }) => (
              <StaggerItem
                key={key}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-black/[0.03] to-transparent backdrop-blur-md border border-black/[0.06] dark:border-white/[0.05] p-6 group dark:from-white/[0.05]"
              >
                <div
                  className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#6BB8FF]/40 to-transparent group-hover:via-[#9969F8]/80 transition-all"
                />
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${color}1A` }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="text-lg font-semibold text-[#12123F] dark:text-[#F1F1F1] mb-2">
                  <UseVendedoresText path={['valorOperativo', 'cards', key, 'title']} />
                </h3>
                <p className="text-sm text-[#12123F]/70 dark:text-[#F1F1F1]/70 leading-relaxed">
                  <UseVendedoresText path={['valorOperativo', 'cards', key, 'description']} />
                </p>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </Reveal>
    </section>
  );
}
