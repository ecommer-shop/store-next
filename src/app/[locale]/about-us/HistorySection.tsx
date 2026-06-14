'use client';

import { UseAboutText } from './UseAboutText';

export function HistorySection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Nuestra historia</h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          <UseAboutText path={['history']} />
        </p>
      </div>
    </section>
  );
}
