'use client';

import { UseAboutText } from './UseAboutText';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Truck, ShieldCheck, TrendingUp } from 'lucide-react';

const differentiators = [
  { icon: Bot, key: 'simetria' },
  { icon: Truck, key: 'messenger' },
  { icon: ShieldCheck, key: 'compliance' },
  { icon: TrendingUp, key: 'incentives' },
];

export function DifferentiatorsSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">
          <UseAboutText path={['differentiators', 'title']} />
        </h2>
        <p className="text-muted-foreground text-lg">
          <UseAboutText path={['differentiators', 'description']} />
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {differentiators.map(({ icon: Icon, key }) => (
          <Card key={key}>
            <CardContent className="p-6 flex gap-4">
              <Icon className="size-8 shrink-0 mt-1 text-primary" />
              <p className="text-muted-foreground">
                <UseAboutText path={['differentiators', key]} />
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
