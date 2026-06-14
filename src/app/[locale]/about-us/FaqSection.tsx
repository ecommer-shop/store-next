'use client';

import { Accordion } from '@heroui/react';
import { ChevronDownIcon } from 'lucide-react';
import { UseAboutText } from './UseAboutText';

const faqItems = ['q1', 'q2', 'q3', 'q4', 'q5'] as const;

export function FaqSection() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            <UseAboutText path={['faq', 'title']} />
          </h2>

          <Accordion className="w-full">
            {faqItems.map((item) => (
              <Accordion.Item key={item} className="border-b last:border-b-0">
                <Accordion.Heading>
                  <Accordion.Trigger className="flex flex-1 items-center justify-between gap-4 py-4 text-left text-sm font-medium hover:underline [&[data-state=open]>svg]:rotate-180">
                    <UseAboutText path={['faq', item, 'q']} />
                    <ChevronDownIcon className="text-muted-foreground size-4 shrink-0 transition-transform duration-200" />
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                  <Accordion.Body>
                    <div className="pb-4 text-sm text-muted-foreground">
                      <UseAboutText path={['faq', item, 'a']} />
                    </div>
                  </Accordion.Body>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
