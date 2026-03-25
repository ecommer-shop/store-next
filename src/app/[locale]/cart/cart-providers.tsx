'use client';

import { SelectedItemsProvider } from './selected-items-context';
import { ReactNode } from 'react';

export function CartProviders({ children }: { children: ReactNode }) {
  return (
    <SelectedItemsProvider>
      {children}
    </SelectedItemsProvider>
  );
}
