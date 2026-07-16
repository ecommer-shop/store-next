'use client';

import { AnimatePresence } from 'framer-motion';
import { CreditCard, Plus } from 'lucide-react';
import { Button, Spinner } from '@heroui/react';
import { SavedCardItem } from './saved-card-item';
import type { SavedPaymentMethod } from '@/types/saved-payment';

interface SavedCardListProps {
    cards: SavedPaymentMethod[];
    isLoading?: boolean;
    onDelete: (id: string) => void;
    onSetDefault: (id: string) => void;
    deletingId?: string | null;
    onAddNew?: () => void;
}

export function SavedCardList({
    cards,
    isLoading,
    onDelete,
    onSetDefault,
    deletingId,
    onAddNew,
}: SavedCardListProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner size="lg" color="current" />
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No tienes métodos de pago guardados
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                    Puedes guardar una tarjeta durante el checkout para usarla en futuras compras.
                </p>
                {onAddNew && (
                    <Button
                        variant="primary"
                        onPress={onAddNew}
                    >
                        <Plus className="w-4 h-4" />
                        Ir al checkout
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <AnimatePresence mode="popLayout">
                {cards.map((card) => (
                    <SavedCardItem
                        key={card.id}
                        card={card}
                        onDelete={onDelete}
                        onSetDefault={onSetDefault}
                        isDeleting={deletingId === card.id}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
