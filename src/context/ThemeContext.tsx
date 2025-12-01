import React, { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { saveTheme, loadTheme } from '@utils/persistence';
import type { Theme, Genre } from '@data/types';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  applyGenreTheme: (genre: Genre | null) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Try to load from localStorage, default to dark
    const saved = loadTheme();
    return saved || 'dark';
  });

  const [currentGenre, setCurrentGenre] = useState<Genre | null>(null);

  // Apply theme to document and save to localStorage
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Save to localStorage
    saveTheme(theme);

    // Apply genre-specific colors if available
    if (currentGenre?.theme) {
      const colors = currentGenre.theme[theme];
      root.style.setProperty('--color-primary', colors.primary);
      root.style.setProperty('--color-primary-hover', colors.primaryHover);
      root.style.setProperty('--color-surface', colors.surface);
      root.style.setProperty('--genre-accent', colors.accent);
    } else {
      // Reset to default colors
      root.style.removeProperty('--color-primary');
      root.style.removeProperty('--color-primary-hover');
      root.style.removeProperty('--color-surface');
      root.style.removeProperty('--genre-accent');
    }
  }, [theme, currentGenre]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const applyGenreTheme = (genre: Genre | null) => {
    setCurrentGenre(genre);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, applyGenreTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}