import { useEffect } from "react";
import { useThemeStore, ThemeMode } from "@/store/theme.store";

export function useTheme() {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = (currentTheme: ThemeMode) => {
      if (currentTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.remove("light", "dark");
        root.classList.add(systemTheme);
      } else {
        root.classList.remove("light", "dark");
        root.classList.add(currentTheme);
      }
    };

    // Apply active selection
    applyTheme(theme);

    // If system mode is selected, listen for media query changes
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleSystemThemeChange = () => {
        applyTheme("system");
      };

      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () => {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      };
    }
  }, [theme]);

  return { theme, setTheme };
}

export default useTheme;
