"use client";

import { useEffect } from 'react';
import { Price } from '@/components/commerce/price';
import { useSelectedItems } from './selected-items-context';

type OrderSummaryClientProps = {
    lines: Array<{
        id: string;
        linePriceWithTax: number;
    }>;
    subTotalWithTax: number;
    shippingWithTax: number;
    currencyCode: string;
    discounts?: Array<{
        description: string;
        amountWithTax: number;
    }> | null;
};

// ...existing code...

export function OrderSummaryClient({
  lines,
  subTotalWithTax,
  shippingWithTax,
  currencyCode,
  discounts,
}: OrderSummaryClientProps) {
  const { selectedLineIds, initializeDefaultSelection } = useSelectedItems();

  // Ask the provider to initialize default selection only once (won't overwrite persisted selection)
  useEffect(() => {
    if (lines.length > 0) {
      initializeDefaultSelection(lines.map((l) => l.id));
    }
  }, [lines, initializeDefaultSelection]);

  // Calculate selected items total
  const selectedLinesTotal = lines
    .filter((line) => selectedLineIds.includes(line.id))
    .reduce((sum, line) => sum + line.linePriceWithTax, 0);

  const discountTotal = discounts?.reduce((sum, d) => sum + d.amountWithTax, 0) ?? 0;
  const finalTotal = selectedLinesTotal + shippingWithTax - discountTotal;

  return (
    <>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal (items seleccionados)</span>
        <span>
          <Price value={selectedLinesTotal} currencyCode={currencyCode} />
        </span>
      </div>
      {discounts && discounts.length > 0 && (
        <>
          {discounts.map((discount, index) => (
            <div key={index} className="flex justify-between text-sm text-green-600">
              <span>{discount.description}</span>
              <span>
                <Price value={discount.amountWithTax} currencyCode={currencyCode} />
              </span>
            </div>
          ))}
        </>
      )}
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Envío</span>
        <span>
          {shippingWithTax > 0 ? (
            <Price value={shippingWithTax} currencyCode={currencyCode} />
          ) : (
            'Por calcular'
          )}
        </span>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>
            <Price value={finalTotal} currencyCode={currencyCode} />
          </span>
        </div>
        {selectedLineIds.length !== lines.length && (
          <p className="text-xs text-muted-foreground mt-2">
            ({selectedLineIds.length} / {lines.length})
          </p>
        )}
      </div>
    </>
  );
}
