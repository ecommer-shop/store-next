"use client";

import { Button } from '@heroui/react';
import { Link } from '@/i18n/navigation';
import { useSelectedItems } from './selected-items-context';
import { useUser, useClerk } from '@clerk/nextjs';
import React, { useEffect, useRef } from 'react';
import { useRouter } from '@/i18n/navigation';

export default function CheckoutButtonClient({
  label,
  lines
}: {
  label: string;
  lines?: Array<{ id: string; linePriceWithTax: number }>;
}) {
  const { selectedLineIds } = useSelectedItems();
  const { isSignedIn, isLoaded } = useUser();
  const { openSignUp } = useClerk();
  const router = useRouter();
  const hasAuthenticatedRef = useRef(false);

  let isDisabled = selectedLineIds.length === 0;
  let isBelowMinimum = false;

  if (!isDisabled && lines) {
    const selectedLinesTotal = lines
      .filter((line) => selectedLineIds.includes(line.id))
      .reduce((sum, line) => sum + line.linePriceWithTax, 0);

    // Requiere un mínimo de $30000 COP (valor en centavos)
    if (selectedLinesTotal <= 2999999) {
      isDisabled = true;
      isBelowMinimum = true;
    }
  }

  // Detectar cuando el usuario se autentica y sincronizar con Vendure
  useEffect(() => {
    if (isLoaded && isSignedIn && !hasAuthenticatedRef.current) {
      hasAuthenticatedRef.current = true;
      
      // Autenticar con Vendure para fusionar el carrito anónimo
      fetch('/api/authenticate-vendure', {
        method: 'POST',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            // Recargar la página para mostrar el carrito fusionado
            router.refresh();
          } else {
            console.error('[Cart] Vendure authentication failed:', data.error);
          }
        })
        .catch((error) => {
          console.error('[Cart] Error authenticating with Vendure:', error);
        });
    }
  }, [isLoaded, isSignedIn, router]);

  const handleCheckout = (e: React.MouseEvent) => {
    if (!isSignedIn) {
      e.preventDefault();
      openSignUp();
    }
  };

  return (
    <div className="flex flex-col gap-1.5 lg:gap-2 w-full">
      {isDisabled ? (
        <Button className="w-full h-10 lg:h-11 text-sm lg:text-base" size="lg" isDisabled>
          {label}
        </Button>
      ) : (
        <Link 
          href="/checkout" 
          className="w-full"
          onClick={handleCheckout}
        >
          <Button className="w-full h-10 lg:h-11 text-sm lg:text-base" size="lg">
            {label}
          </Button>
        </Link>
      )}
      {isBelowMinimum && (
        <span className="text-[10px] lg:text-xs text-[color:var(--warning-text)] text-center font-medium leading-tight">
          Haz tu pedido desde $30.000 COP y disfruta de nuestro servicio.
        </span>
      )}
    </div>
  );
}
