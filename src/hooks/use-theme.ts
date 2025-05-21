
import { useState, useCallback, useEffect } from 'react';
import { Theme, defaultTheme, availableThemes } from '../lib/themes';
import { ButtonStyle } from '@/types/buttonTypes';

export interface UseThemeResult {
  currentTheme: Theme | null;
  availableThemes: Theme[];
  selectTheme: (themeName: string) => void;
  applyThemeToStyle: (style: ButtonStyle, variant: string) => ButtonStyle;
}

export function useTheme(): UseThemeResult {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      try {
        return JSON.parse(savedTheme);
      } catch (e) {
        console.error('Error parsing saved theme:', e);
        return null;
      }
    }
    return null;
  });

  // Select a theme by name
  const selectTheme = useCallback((themeName: string) => {
    const theme = availableThemes.find(t => t.name === themeName) || null;
    setCurrentTheme(theme);
    
    if (theme) {
      localStorage.setItem('selectedTheme', JSON.stringify(theme));
    } else {
      localStorage.removeItem('selectedTheme');
    }
  }, []);

  // Apply theme to a button style
  const applyThemeToStyle = useCallback((style: ButtonStyle, variantKey: string): ButtonStyle => {
    if (!currentTheme) return style;
    
    // Safely check if the variant exists on the theme
    const themeKey = variantKey as keyof Theme;
    
    if (themeKey in currentTheme) {
      const variant = currentTheme[themeKey];
      
      // Only proceed if the variant has the expected structure
      if (typeof variant === 'object' && variant !== null && 'base' in variant) {
        return {
          ...style,
          backgroundColor: (variant as any).base,
          hoverBackgroundColor: (variant as any).hover,
          textColor: (variant as any).text,
          textHoverColor: (variant as any).text,
        };
      }
    }
    
    return style;
  }, [currentTheme]);

  return {
    currentTheme,
    availableThemes,
    selectTheme,
    applyThemeToStyle
  };
}
