'use client';

import { CreditCard } from 'lucide-react';

interface CardBrandIconProps {
    brand: string;
    className?: string;
}

export function CardBrandIcon({ brand, className = '' }: CardBrandIconProps) {
    const brandLower = brand.toLowerCase();

    const brandColors: Record<string, string> = {
        visa: '#1A1F71',
        mastercard: '#EB001B',
        amex: '#006FCF',
        diners: '#0079BE',
        discover: '#FF6000',
        nequi: '#E91E63',
        daviplata: '#D32F2F',
    };

    const color = brandColors[brandLower] || '#6B7280';

    if (brandColors[brandLower]) {
        return (
            <div
                className={`flex items-center justify-center w-12 h-8 rounded-md font-bold text-white text-xs ${className}`}
                style={{ backgroundColor: color }}
            >
                {brand.substring(0, 4).toUpperCase()}
            </div>
        );
    }

    return <CreditCard className={`w-8 h-8 ${className}`} style={{ color }} />;
}
