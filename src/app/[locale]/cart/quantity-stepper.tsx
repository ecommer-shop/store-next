'use client';

import { useState, useTransition } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@heroui/react';
import { adjustQuantity } from './actions';

interface QuantityStepperProps {
  lineId: string;
  quantity: number;
}

export function QuantityStepper({ lineId, quantity }: QuantityStepperProps) {
  const [current, setCurrent] = useState(quantity);
  const [maxReached, setMaxReached] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDecrease = () => {
    if (current <= 1) return;
    setMaxReached(false);
    startTransition(async () => {
      const next = Math.max(1, current - 1);
      await adjustQuantity(lineId, next);
      setCurrent(next);
    });
  };

  const handleIncrease = () => {
    startTransition(async () => {
      const requested = current + 1;
      const { actualQuantity } = await adjustQuantity(lineId, requested);
      if (actualQuantity < requested) {
        // Vendure capped the quantity — stock limit reached
        setMaxReached(true);
        setCurrent(actualQuantity);
      } else {
        setMaxReached(false);
        setCurrent(actualQuantity);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Stepper pill */}
      <div className="flex items-center bg-muted/60 dark:bg-white/5 border border-border rounded-full overflow-hidden">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-[#9969F8] hover:bg-[#9969F8]/10 transition-colors"
          isDisabled={current <= 1 || isPending}
          onPress={handleDecrease}
          aria-label="Disminuir cantidad"
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>

        <span className="min-w-[2rem] text-center text-sm font-bold px-1 text-foreground">
          {current}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 rounded-full transition-colors ${
            maxReached
              ? 'text-orange-400 cursor-not-allowed'
              : 'text-muted-foreground hover:text-[#9969F8] hover:bg-[#9969F8]/10'
          }`}
          isDisabled={isPending}
          onPress={handleIncrease}
          aria-label="Aumentar cantidad"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Stock warning — appears right after the + button */}
      {maxReached && (
        <span className="text-xs text-orange-500 font-medium flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-200">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
          Sin más unidades disponibles
        </span>
      )}
    </div>
  );
}
