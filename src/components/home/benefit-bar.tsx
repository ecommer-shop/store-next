'use client';

import { useRef } from 'react';
import { BenefitItem } from './benefit-item';
import { benefits } from './benefits-config';

export function BenefitBar() {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <section className="bg-white dark:bg-[#1a1a3e] border-b border-gray-100 dark:border-white/10 shadow-sm">
            {/* Mobile: horizontal scroll carousel */}
            <div
                ref={scrollRef}
                className="flex lg:hidden overflow-x-auto scrollbar-hide snap-x snap-mandatory px-3 py-3 gap-3"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {benefits.map((benefit) => (
                    <BenefitItem key={benefit.title} benefit={benefit} variant="mobile" />
                ))}
            </div>

            {/* Desktop: grid layout */}
            <div className="hidden lg:block container mx-auto px-4">
                <div className="grid grid-cols-5 divide-x divide-gray-100 dark:divide-white/10">
                    {benefits.map((benefit) => (
                        <BenefitItem key={benefit.title} benefit={benefit} variant="desktop" />
                    ))}
                </div>
            </div>
        </section>
    );
}
