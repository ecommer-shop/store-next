'use client';

import { CreditCard, Smartphone, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SavedMethod {
    id: string;
    type: string;
    lastFour: string;
    brand: string;
    expiryMonth?: string;
    expiryYear?: string;
    cardHolderName?: string;
    isDefault: boolean;
}

interface SavedMethodSelectorProps {
    methods: SavedMethod[];
    selectedId: string | null;
    onSelect: (method: SavedMethod) => void;
    onUseNewCard: () => void;
}

function BrandIcon({ type, brand }: { type: string; brand: string }) {
    if (type === 'NEQUI' || type === 'DAVIPLATA') {
        return <Smartphone className="w-5 h-5" />;
    }
    return <CreditCard className="w-5 h-5" />;
}

export function SavedMethodSelector({ methods, selectedId, onSelect, onUseNewCard }: SavedMethodSelectorProps) {
    if (methods.length === 0) return null;

    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tus métodos guardados
            </p>

            <AnimatePresence mode="popLayout">
                {methods.map((method) => {
                    const isSelected = selectedId === method.id;

                    let displayName = '';
                    if (method.type === 'CARD') {
                        displayName = `${method.brand} •••• ${method.lastFour}`;
                    } else if (method.type === 'NEQUI' || method.type === 'DAVIPLATA') {
                        displayName = `${method.brand} •••• ${method.lastFour}`;
                    }

                    return (
                        <motion.button
                            key={method.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onClick={() => onSelect(method)}
                            className={`
                                w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all
                                ${isSelected
                                    ? 'border-[#9969F8] bg-[#9969F8]/5'
                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#9969F8]/40'
                                }
                            `}
                        >
                            <div className={`
                                flex items-center justify-center w-10 h-10 rounded-full
                                ${method.type === 'CARD'
                                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-500'
                                    : 'bg-green-100 dark:bg-green-900/20 text-green-500'
                                }
                            `}>
                                <BrandIcon type={method.type} brand={method.brand} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {displayName}
                                </p>
                                {method.type === 'CARD' && method.expiryMonth && method.expiryYear && (
                                    <p className="text-xs text-muted-foreground">
                                        Expira {method.expiryMonth}/{method.expiryYear}
                                    </p>
                                )}
                            </div>

                            {isSelected && (
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#9969F8]">
                                    <Check className="w-3.5 h-3.5 text-white" />
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </AnimatePresence>

            <button
                onClick={onUseNewCard}
                className={`
                    w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed transition-all
                    ${selectedId === null
                        ? 'border-[#9969F8] bg-[#9969F8]/5 text-[#9969F8] font-semibold'
                        : 'border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-[#9969F8]/40'
                    }
                `}
            >
                Usar otro método de pago
            </button>
        </div>
    );
}
