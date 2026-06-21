'use client';

import { Users } from 'lucide-react';
import { UseAboutText } from './UseAboutText';

const teamMembers = ['ceo', 'accountant', 'serverLead', 'eiaLead', 'lawyer'] as const;

export function TeamSection() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <Users className="size-10 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold">
            <UseAboutText path={['team', 'title']} />
          </h2>
        </div>

        <div className="max-w-xl mx-auto divide-y border rounded-lg bg-background">
          {teamMembers.map((member, i) => (
            <div key={member} className="flex items-center gap-4 px-6 py-4">
              <span className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-medium">
                <UseAboutText path={['team', 'members', member]} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
