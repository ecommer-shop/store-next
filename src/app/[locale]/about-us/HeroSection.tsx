'use client';

import { UseAboutText } from './UseAboutText';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />

      <div className="relative container mx-auto px-4 pt-32 pb-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <UseAboutText path={['title']} />
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          <UseAboutText path={['description']} />
        </p>
      </div>
    </section>
  );
}
