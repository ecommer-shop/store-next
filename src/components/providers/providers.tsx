'use client';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { ThemeVariables } from '@/components/providers/theme-variables';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ThemeVariables>
          {children}
        </ThemeVariables>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
