import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { festivalThemeService } from '../services/festivalThemeService';
import { FESTIVAL_SYSTEM_CONFIG } from '../config/festivalCalendar';

export const FestivalThemeContext = createContext(null);

export function FestivalThemeProvider({ children }) {
  const [themeState, setThemeState] = useState(() => festivalThemeService.resolveThemeState());

  // Function to re-evaluate active festival (e.g. at midnight or after manual change)
  const refreshTheme = useCallback(() => {
    setThemeState(festivalThemeService.resolveThemeState());
  }, []);

  // Function to switch manual preview
  const setPreview = useCallback((festivalId) => {
    festivalThemeService.setManualPreview(festivalId);
    refreshTheme();
  }, [refreshTheme]);

  // Periodic check & visibility listeners so date transitions happen live without refresh
  useEffect(() => {
    const intervalTime = FESTIVAL_SYSTEM_CONFIG.autoCheckIntervalMs || 60000;
    const interval = setInterval(refreshTheme, intervalTime);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshTheme();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', refreshTheme);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', refreshTheme);
    };
  }, [refreshTheme]);

  // Apply or remove theme CSS variables on :root dynamically
  useEffect(() => {
    const root = document.documentElement;

    if (themeState.isFestivalMode && themeState.theme?.cssVars) {
      Object.entries(themeState.theme.cssVars).forEach(([key, val]) => {
        root.style.setProperty(key, val);
      });
      root.setAttribute('data-festival-theme', themeState.activeFestival?.id || 'active');
    } else {
      // Normal Mode: Clean up all custom festival CSS properties
      const customProps = ['--fest-primary', '--fest-secondary', '--fest-accent', '--fest-glow', '--fest-highlight'];
      customProps.forEach(prop => root.style.removeProperty(prop));
      root.removeAttribute('data-festival-theme');
    }
  }, [themeState.isFestivalMode, themeState.activeFestival, themeState.theme]);

  const toggleEmergencyDisable = useCallback((disabled) => {
    festivalThemeService.setEmergencyDisabled(disabled);
    refreshTheme();
  }, [refreshTheme]);

  const value = useMemo(() => ({
    isSystemEnabled: themeState.isSystemEnabled,
    isFestivalMode: themeState.isFestivalMode,
    activeFestival: themeState.activeFestival,
    overlappingFestivals: themeState.overlappingFestivals || [],
    isManualPreview: themeState.isManualPreview,
    currentISTDate: themeState.currentISTDate,
    theme: themeState.theme,
    previewFestival: setPreview,
    toggleEmergencyDisable,
    refreshTheme,
    allFestivals: festivalThemeService.getAllFestivals()
  }), [themeState, setPreview, toggleEmergencyDisable, refreshTheme]);

  return (
    <FestivalThemeContext.Provider value={value}>
      {children}
    </FestivalThemeContext.Provider>
  );
}

export function useFestivalTheme() {
  const context = useContext(FestivalThemeContext);
  if (!context) {
    throw new Error('useFestivalTheme must be used within a FestivalThemeProvider');
  }
  return context;
}
