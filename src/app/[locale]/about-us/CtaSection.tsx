'use client';

import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import { UseAboutText } from './UseAboutText';

export function CtaSection() {
  return (
    <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">
          <UseAboutText path={['cta', 'title']} />
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="https://admin.ecommer.shop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <UseAboutText path={['cta', 'register']} />
            <ArrowRight className="size-4" />
          </Link>

          <Link
            href="https://ecommer.shop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <Search className="size-4" />
            <UseAboutText path={['cta', 'discover']} />
          </Link>
        </div>
      </div>
    </section>
  );
}
