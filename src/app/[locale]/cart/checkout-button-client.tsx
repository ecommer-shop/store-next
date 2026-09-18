"use client";

import { Button } from '@heroui/react';
import { Link } from '@/i18n/navigation';
import { useSelectedItems } from './selected-items-context';
import { useUser } from '@clerk/nextjs';
import { useLocale } from 'next-intl';
import React from 'react';

export default function CheckoutButtonClient({
  label,
  lines
}: {
  label: string;
  lines?: Array<{ id: string; linePriceWithTax: number }>;
}) {
  const { selectedLineIds } = useSelectedItems();
  const { isSignedIn, isLoaded } = useUser();
  const locale = useLocale() || 'es';

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

  const handleCheckout = (e: React.MouseEvent) => {
    if (!isSignedIn || !isLoaded) {
      e.preventDefault();
      const signInUrl = new URL(`/${locale}/sign-in`, window.location.origin);
      signInUrl.searchParams.set('redirect_url', `${window.location.origin}/${locale}/checkout`);
      window.location.assign(signInUrl.toString());
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
