"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      themes={["light", "dark", "white", "mocha", "system"]}
      disableTransitionOnChange
      storageKey="urpe-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
