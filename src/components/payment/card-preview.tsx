'use client';

import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';

interface CardPreviewProps {
    number: string;
    cardHolder: string;
    expiryMonth: string;
    expiryYear: string;
    brand?: string;
}

function detectBrand(number: string): string {
    const n = number.replace(/\s/g, '');
    if (/^4/.test(n)) return 'Visa';
    if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'Mastercard';
    if (/^3[47]/.test(n)) return 'Amex';
    if (/^6(?:011|5)/.test(n)) return 'Discover';
    if (/^3(?:0[0-5]|[68])/.test(n)) return 'Diners';
    return '';
}

const brandColors: Record<string, string> = {
    Visa: '#1A1F71',
    Mastercard: '#EB001B',
    Amex: '#006FCF',
    Discover: '#FF6000',
    Diners: '#0079BE',
};

export function CardPreview({ number, cardHolder, expiryMonth, expiryYear, brand: brandProp }: CardPreviewProps) {
    const brand = brandProp || detectBrand(number);
    const bgColor = brandColors[brand] || '#12123F';
    const displayNumber = number.padEnd(19, '•').replace(/(.{4})/g, '$1 ').trim();
    const displayHolder = cardHolder || 'NOMBRE DEL TITULAR';
    const displayExpiry = (expiryMonth || 'MM') + '/' + (expiryYear || 'AA');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative w-full max-w-sm mx-auto rounded-2xl p-6 text-white shadow-2xl overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${bgColor}, ${bgColor}cc, ${bgColor}88)` }}
        >
            <div className="absolute top-4 right-4">
                <CreditCard className="w-8 h-8 opacity-50" />
            </div>
            {brand && (
                <div className="absolute top-4 left-6 text-sm font-bold opacity-70 tracking-wider">
                    {brand.toUpperCase()}
                </div>
            )}
            <div className="mt-10 mb-6">
                <p className="text-xl font-mono tracking-widest">{displayNumber}</p>
            </div>
            <div className="flex justify-between items-end">
                <div className="min-w-0 flex-1">
                    <p className="text-xs opacity-60 mb-1">Titular</p>
                    <p className="text-sm font-medium truncate uppercase">{displayHolder}</p>
                </div>
                <div className="text-right ml-4">
                    <p className="text-xs opacity-60 mb-1">Expira</p>
                    <p className="text-sm font-mono">{displayExpiry}</p>
                </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        </motion.div>
    );
}
