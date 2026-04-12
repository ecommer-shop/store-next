'use client';

import Link from 'next/link';
import { Button } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { I18N } from '@/i18n/keys';

interface Props {
    className?: string;
    size?: "sm" | "md" | "lg";
}

export function ContinueShoppingButton({ className, size }: Props) {
    const t = useTranslations('Cart');
    return (
        <Link className={className || 'w-full'} href="/">
            <Button variant="ghost" size={size} className="w-full rounded-md">
                {t(I18N.Cart.summary.continueShopping)}
            </Button>
        </Link>
    );
}
