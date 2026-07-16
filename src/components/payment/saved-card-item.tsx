'use client';

import { Button } from '@heroui/react';
import { Trash2, Star, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { CardBrandIcon } from './card-brand-icon';
import type { SavedPaymentMethod } from '@/types/saved-payment';

interface SavedCardItemProps {
    card: SavedPaymentMethod;
    onDelete: (id: string) => void;
    onSetDefault: (id: string) => void;
    isDeleting?: boolean;
}

export function SavedCardItem({ card, onDelete, onSetDefault, isDeleting }: SavedCardItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="group relative"
        >
            <div className={`
                relative overflow-hidden rounded-2xl border-2 transition-all duration-300
                ${card.isDefault
                    ? 'border-[#9969F8] bg-gradient-to-br from-[#9969F8]/5 to-[#6BB8FF]/5 dark:from-[#9969F8]/10 dark:to-[#6BB8FF]/10 shadow-lg shadow-[#9969F8]/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#9969F8]/50 hover:shadow-md'
                }
            `}>
                {card.isDefault && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-[#9969F8] text-white text-xs font-medium">
                        <Check className="w-3 h-3" />
                        Predeterminada
                    </div>
                )}

                <div className="p-5">
                    <div className="flex items-start gap-4">
                        <CardBrandIcon brand={card.brand} />

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {card.brand}
                                </span>
                            </div>

                            <div className="font-mono text-base text-gray-600 dark:text-gray-300 mb-2">
                                •••• •••• •••• {card.lastFour}
                            </div>

                            {card.cardHolderName && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {card.cardHolderName}
                                </div>
                            )}

                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                Expira {card.expiryMonth}/{card.expiryYear}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        {!card.isDefault && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onPress={() => onSetDefault(card.id)}
                                className="text-gray-600 dark:text-gray-300 hover:text-[#9969F8]"
                            >
                                <Star className="w-4 h-4" />
                                Marcar como predeterminada
                            </Button>
                        )}
                        
                        <Button
                            size="sm"
                            variant="danger-soft"
                            onPress={() => onDelete(card.id)}
                            isDisabled={isDeleting}
                            className="ml-auto"
                        >
                            <Trash2 className="w-4 h-4" />
                            {isDeleting ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
