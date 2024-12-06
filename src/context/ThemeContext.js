import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const themes = {
  dark: {
    background: '#1a1a1a',
    surface: '#2a2a2a',
    text: '#ffffff',
    textSecondary: '#999999',
    border: '#444444',
    accent: '#ff8000',
    colors: {
      mythicPlus: '#ff8000',
      raidProgress: '#a335ee'
    }
  },
  light: {
    background: '#f8f9fa',
    surface: '#ffffff',
    text: '#000000',
    textSecondary: '#666666',
    border: '#dee2e6',
    accent: '#ff8000',
    colors: {
      mythicPlus: '#ff8000',
      raidProgress: '#a335ee'
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? themes.dark : themes.light;

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
