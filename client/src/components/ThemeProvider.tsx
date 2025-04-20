import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // This wrapper is needed because next-themes won't work properly with SSR
  // and we need to make sure the code only runs in the browser
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same structure to avoid layout shift
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

export const ThemeContext = createContext({
  theme: "",
  setTheme: (_theme: string) => {},
});

export const useTheme = () => useContext(ThemeContext);