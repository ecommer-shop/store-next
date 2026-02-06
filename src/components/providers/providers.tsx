'use client';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { ThemeVariables } from '@/components/providers/theme-variables';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeVariables>
        {children}
      </ThemeVariables>
    </ThemeProvider>
  );
}
