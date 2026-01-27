// components/theme-variables.tsx
'use client';

import { useTheme } from 'next-themes';

export function ThemeVariables({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  const vars =
    resolvedTheme === 'dark'
      ? {
           "--accent": "#F1F1F1",
            "--accent-foreground": "#12123F",
             "--accent-hover": "#6BB8FF",
              "--border-width": "2px",
               "--border-width-field": "2px",
                "--focus": "#006FEE",
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
