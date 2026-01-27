// components/theme-variables.tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeVariables({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // 🔑 Esto evita el mismatch
    return <>{children}</>;
  }
  const vars =
    resolvedTheme === 'dark'
      ? {
           "--accent": "#F1F1F1",
            "--accent-foreground": "#12123F",
             "--accent-hover": "#6BB8FF",
              "--border-width": "2px",
               "--border-width-field": "2px",
                "--focus": "#9969F8",
        }
      : {
          "--accent": "#12123F",
            "--accent-foreground": "#F1F1F1",
             "--accent-hover": "#6BB8FF",
              "--border-width": "2px",
               "--border-width-field": "2px",
                "--focus": "#006FEE",
        };

  return (
    <div style={vars as React.CSSProperties}>
      {children}
    </div>
  );
}
