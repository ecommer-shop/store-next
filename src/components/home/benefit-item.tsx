'use client';

import {
    Button,
    Popover,
    PopoverArrow,
    PopoverContent,
    PopoverDialog,
    PopoverHeading,
    PopoverTrigger,
} from '@heroui/react';
import { memo, useCallback } from 'react';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/vendure/shared/utils';
import type { BenefitConfig } from './benefits-config';


type BenefitItemVariant = 'mobile' | 'desktop';

interface BenefitItemProps {
    benefit: BenefitConfig;
    variant: BenefitItemVariant;
}

// Popover now uses native click-to-open behavior from HeroUI.
// The previous hover/timer logic was removed to rely on default Popover behavior.

const cardVariantClasses: Record<BenefitItemVariant, string> = {
    mobile:
        'flex-none snap-start flex flex-row items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 min-w-[160px]',
    desktop: 'flex flex-row items-center gap-3 px-4 py-5 w-full h-full',
};

export const BenefitItem = memo(function BenefitItem({ benefit, variant }: BenefitItemProps) {
    // Rely on Popover's internal state (opens on click, closes on outside click).
    const router = useRouter();
    const Icon = benefit.icon;

    const handleAction = useCallback(() => {
        // Check if href is external (starts with http/https)
        if (benefit.href.startsWith('http')) {
            window.location.assign(benefit.href);
        } else {
            router.push(benefit.href);
        }
    }, [router, benefit.href]);

    return (
        <Popover>
            <PopoverTrigger
                aria-label={`${benefit.title}: ${benefit.subtitle}`}
                className={cn(
                    cardVariantClasses[variant],
                    'group cursor-pointer outline-none transition-all duration-300',
                    'hover:bg-default-100 dark:hover:bg-white/5 hover:shadow-md hover:scale-[1.02]',
                )}
            >
                <div
                    className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ background: `${benefit.color}22` }}
                >
                    <Icon
                        size={22}
                        style={{ color: benefit.color }}
                        className={cn(
                            variant === 'desktop' &&
                                'transition-transform duration-200 group-hover:scale-110',
                        )}
                        aria-hidden
                    />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight whitespace-nowrap lg:whitespace-normal">
                        {benefit.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight whitespace-nowrap lg:whitespace-normal">
                        {benefit.subtitle}
                    </p>
                </div>
            </PopoverTrigger>

            <PopoverContent placement="bottom" offset={8} className="w-[320px] max-w-[calc(100vw-2rem)]">
                <PopoverDialog className="flex flex-col gap-3 p-4">
                    <PopoverArrow />

                    <div className="flex items-start gap-3">
                        <div
                            className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full"
                            style={{ background: `${benefit.color}22` }}
                        >
                            <Icon size={20} style={{ color: benefit.color }} aria-hidden />
                        </div>
                        <div className="min-w-0 flex-1">
                            <PopoverHeading className="text-base font-semibold text-foreground">
                                {benefit.popoverTitle}
                            </PopoverHeading>
                            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={handleAction}
                        size="sm"
                        variant="primary"
                        className="w-full"
                    >
                        {benefit.action}
                    </Button>
                </PopoverDialog>
            </PopoverContent>
        </Popover>
    );
});
