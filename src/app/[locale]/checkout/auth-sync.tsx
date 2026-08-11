'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { syncCustomerWithVendure } from '@/lib/vendure/server/actions/sync-customer';

const syncedOrderIds = new Set<string>();

/**
 * Asegura que la sesión de Vendure quede autenticada (y el carrito anónimo
 * fusionado) al entrar a checkout tras iniciar sesión con Clerk, recargando
 * el checkout para que se sirva con la sesión autenticada.
 */
export function CheckoutAuthSync({ orderId }: { orderId: string }) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const ranRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (ranRef.current || syncedOrderIds.has(orderId)) return;

    ranRef.current = true;
    syncedOrderIds.add(orderId);

    const run = async () => {
      try {
        await syncCustomerWithVendure();
      } catch (error) {
        console.error('[CheckoutAuthSync] Failed to sync Vendure session:', error);
      }
      router.refresh();
    };
    void run();
  }, [isLoaded, isSignedIn, orderId, router]);

  return null;
}