"use client";

import Link from 'next/link';
import { Button } from '@heroui/react';
import { useSelectedItems } from './selected-items-context';
import React from 'react';

export default function CheckoutButtonClient({
  label,
  lines
}: {
  label: string;
  lines?: Array<{ id: string; linePriceWithTax: number }>;
}) {
  const { selectedLineIds } = useSelectedItems();

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

  return (
    <div className="flex flex-col gap-2 w-full">
      <Button className="w-full" size="lg" isDisabled={isDisabled}>
        <Link className="w-full" href={isDisabled ? "#" : "/checkout"}>
          {label}
        </Link>
      </Button>
      {isBelowMinimum && (
        <span className="text-xs text-blue-900 text-center font-medium">
          Haz tu pedido desde $30.000 COP y disfruta de nuestro servicio.
        </span>
      )}
    </div>
  );
}
