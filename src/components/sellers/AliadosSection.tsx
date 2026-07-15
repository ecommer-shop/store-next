'use client';

import { UseVendedoresText } from './UseVendedoresText';
import { Reveal } from './Reveal';

export function AliadosSection() {
  return (
    <section className="py-16">
      <Reveal direction="none">
        <div className="container mx-auto px-4 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#12123F]/50 dark:text-[#F1F1F1]/50">
            <UseVendedoresText path={['aliados', 'title']} />
          </span>
          <div className="flex flex-wrap justify-center gap-14 mt-8">
            {(['dian', 'wompi', 'servientrega'] as const).map((key) => (
              <span key={key} className="text-xl font-bold text-[#12123F]/40 dark:text-[#F1F1F1]/40">
                <UseVendedoresText path={['aliados', key]} />
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
