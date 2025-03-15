"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Suspense } from "react";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

function ThemeProviderWithoutSuspense({
  children,
  ...props
}: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-background">{children}</div>}
    >
      <ThemeProviderWithoutSuspense {...props}>
        {children}
      </ThemeProviderWithoutSuspense>
    </Suspense>
  );
}
