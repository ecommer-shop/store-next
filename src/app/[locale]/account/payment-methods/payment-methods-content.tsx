'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { SavedCardList } from '@/components/payment/saved-card-list';
import type { SavedPaymentMethod } from '@/types/saved-payment';
import { getSavedPaymentMethods, deleteSavedPaymentMethod, setDefaultPaymentMethod } from './actions';

export function PaymentMethodsContent() {
    const [cards, setCards] = useState<SavedPaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        loadCards();
    }, []);

    async function loadCards() {
        try {
            setIsLoading(true);
            const data = await getSavedPaymentMethods() as SavedPaymentMethod[];
            setCards(data);
        } catch (error) {
            toast.error('Error al cargar los métodos de pago');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('¿Estás seguro de que quieres eliminar este método de pago?')) {
            return;
        }

        try {
            setDeletingId(id);
            const success = await deleteSavedPaymentMethod(id);
            
            if (success) {
                setCards(cards.filter(c => c.id !== id));
                toast.success('Método de pago eliminado');
            } else {
                toast.error('No se pudo eliminar el método de pago');
            }
        } catch (error) {
            toast.error('Error al eliminar el método de pago');
        } finally {
            setDeletingId(null);
        }
    }

    async function handleSetDefault(id: string) {
        try {
            const updated = await setDefaultPaymentMethod(id);
            
            if (updated) {
                setCards(cards.map(c => ({
                    ...c,
                    isDefault: c.id === id,
                })));
                toast.success('Método de pago actualizado');
            }
        } catch (error) {
            toast.error('Error al actualizar el método de pago');
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Métodos de pago
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Gestiona tus tarjetas guardadas para compras más rápidas.
                </p>
            </div>

            <SavedCardList
                cards={cards}
                isLoading={isLoading}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
                deletingId={deletingId}
            />
        </div>
    );
}
