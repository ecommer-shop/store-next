'use client';

import { Reveal } from './Reveal';
import { FaqItem } from './FaqItem';
import { UseVendedoresText } from './UseVendedoresText';

const faqKeys = [
  'gratis',
  'tecnicos',
  'cobro',
  'envios',
  'facturacion',
  'contabilidad',
  'proteccion',
  'atencion',
] as const;

export function FaqSection() {
  return (
    <section className="py-24">
      <Reveal direction="none">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#12123F] dark:text-[#F1F1F1] mb-4">
              <UseVendedoresText path={['faq', 'title']} />
            </h2>
            <p className="text-[#12123F]/70 dark:text-[#F1F1F1]/70 text-lg max-w-2xl mx-auto">
              <UseVendedoresText path={['faq', 'subtitle']} />
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqKeys.map((key, i) => (
              <FaqItem
                key={key}
                question={<UseVendedoresText path={['faq', 'questions', key, 'question']} /> as unknown as string}
                answer={<UseVendedoresText path={['faq', 'questions', key, 'answer']} /> as unknown as string}
                defaultOpen={i === 0}
              />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
