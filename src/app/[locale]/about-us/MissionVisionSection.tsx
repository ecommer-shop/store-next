'use client';

import { UseAboutText } from './UseAboutText';
import { Card } from '@/components/ui/card';

export function MissionVisionSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
        <Card className="p-8 border-l-4 border-l-primary">
          <h3 className="text-2xl font-bold mb-4">Misión</h3>
          <blockquote className="text-muted-foreground text-lg italic">
            &ldquo;<UseAboutText path={['mission']} />&rdquo;
          </blockquote>
        </Card>

        <Card className="p-8 border-l-4 border-l-secondary">
          <h3 className="text-2xl font-bold mb-4">Visión</h3>
          <blockquote className="text-muted-foreground text-lg italic">
            &ldquo;<UseAboutText path={['vision']} />&rdquo;
          </blockquote>
        </Card>
      </div>
    </section>
  );
}
