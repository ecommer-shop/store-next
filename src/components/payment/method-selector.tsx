'use client';

import { Landmark, QrCode, Banknote, ShoppingBag, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { CardBrandIcon } from './card-brand-icon';

interface PaymentMethodOption {
    code: string;
    name: string;
    description: string;
    logo: React.ReactNode | null;
    color: string;
    bgColor: string;
}

const METHODS: PaymentMethodOption[] = [
    {
        code: 'CARD',
        name: 'Tarjeta',
        description: 'Crédito o débito',
        logo: <CardBrandIcon brand="Visa" />,
        color: 'text-[#1A1F71]',
        bgColor: 'bg-blue-50 dark:bg-blue-900/10',
    },
    {
        code: 'NEQUI',
        name: 'Nequi',
        description: 'Pago desde app Nequi',
        logo: <CardBrandIcon brand="Nequi" />,
        color: 'text-pink-500',
        bgColor: 'bg-pink-50 dark:bg-pink-900/10',
    },
    {
        code: 'DAVIPLATA',
        name: 'Daviplata',
        description: 'Pago desde app Daviplata',
        logo: <CardBrandIcon brand="Daviplata" />,
        color: 'text-red-500',
        bgColor: 'bg-red-50 dark:bg-red-900/10',
    },
    {
        code: 'PSE',
        name: 'PSE',
        description: 'Transferencia bancaria',
        logo: <CardBrandIcon brand="PSE" />,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/10',
    },
    {
        code: 'BANCOLOMBIA_QR',
        name: 'Bancolombia QR',
        description: 'Escanea con Bancolombia',
        logo: <CardBrandIcon brand="Bancolombia QR" />,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/10',
    },
    {
        code: 'BANCOLOMBIA_COLLECT',
        name: 'Bancolombia Recaudo',
        description: 'Pago con código de barras',
        logo: <CardBrandIcon brand="Bancolombia Recaudo" />,
        color: 'text-orange-500',
        bgColor: 'bg-orange-50 dark:bg-orange-900/10',
    },
    {
        code: 'BANCOLOMBIA_BNPL',
        name: 'Bancolombia Cuotas',
        description: 'Compra a cuotas',
        logo: <CardBrandIcon brand="Bancolombia Cuotas" />,
        color: 'text-cyan-500',
        bgColor: 'bg-cyan-50 dark:bg-cyan-900/10',
    },
    {
        code: 'SU_PLUS',
        name: 'Su Plus',
        description: 'Pago con Su Plus',
        logo: <CardBrandIcon brand="Su Plus" />,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50 dark:bg-purple-900/10',
    },
];

interface MethodSelectorProps {
    selectedCode: string | null;
    onSelect: (code: string) => void;
    excludedMethods?: string[];
}

export function MethodSelector({ selectedCode, onSelect, excludedMethods = [] }: MethodSelectorProps) {
    const available = METHODS.filter(m => !excludedMethods.includes(m.code));

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {available.map((method) => {
                const isSelected = selectedCode === method.code;

                return (
                    <motion.button
                        key={method.code}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(method.code)}
                        className={`
                            relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                            ${isSelected
                                ? 'border-[#9969F8] bg-[#9969F8]/5 shadow-md'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#9969F8]/40 hover:shadow-sm'
                            }
                        `}
                    >
                        <div className={`p-1 rounded-lg ${method.bgColor}`}>
                            {method.logo || (
                                <div className="w-10 h-7 flex items-center justify-center">
                                    <span className="text-[10px] font-semibold uppercase text-gray-400">{method.code.substring(0, 4)}</span>
                                </div>
                            )}
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {method.name}
                        </span>
                        <span className="text-xs text-muted-foreground text-center leading-tight">
                            {method.description}
                        </span>
                    </motion.button>
                );
            })}
        </div>
    );
}
