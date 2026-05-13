import React, { createContext, useContext, useEffect, useState } from 'react';

export type TimeOfDay = 'auto' | 'pre-dawn' | 'sunrise' | 'daytime' | 'sunset' | 'dusk' | 'night';

export interface ThemePalette {
  primary: string;
  secondary: string;
  isDark: boolean;
  ambientIntensity: number;
}

// Refined "Premium Corporate" palettes for Finance Dashboard
export const palettes: Record<Exclude<TimeOfDay, 'auto'>, ThemePalette> = {
  'pre-dawn': { primary: '#1e293b', secondary: '#334155', isDark: true, ambientIntensity: 0.2 }, // Deep Slate & Steel
  'sunrise': { primary: '#1e3a8a', secondary: '#b45309', isDark: false, ambientIntensity: 0.5 }, // Navy & Corporate Gold
  'daytime': { primary: '#0369a1', secondary: '#0ea5e9', isDark: false, ambientIntensity: 0.9 }, // Crisp Professional Blue
  'sunset': { primary: '#312e81', secondary: '#7c2d12', isDark: true, ambientIntensity: 0.6 }, // Deep Indigo & Copper
  'dusk': { primary: '#1e1b4b', secondary: '#475569', isDark: true, ambientIntensity: 0.4 }, // Midnight Violet & Slate
  'night': { primary: '#020617', secondary: '#064e3b', isDark: true, ambientIntensity: 0.1 }, // Obsidian & Deep Emerald (Money/Trust)
};

export const getTimeOfDayFromDate = (date: Date): Exclude<TimeOfDay, 'auto'> => {
  const hour = date.getHours();
  if (hour >= 0 && hour < 6) return 'pre-dawn';
  if (hour >= 6 && hour < 9) return 'sunrise';
  if (hour >= 9 && hour < 16) return 'daytime';
  if (hour >= 16 && hour < 19) return 'sunset';
  if (hour >= 19 && hour < 21) return 'dusk';
  return 'night'; // 21 to 24
};

export const getTimeDisplayName = (time: TimeOfDay): string => {
  switch (time) {
    case 'auto': return 'Auto (Real-time)';
    case 'pre-dawn': return 'Pre-Dawn';
    case 'sunrise': return 'Sunrise';
    case 'daytime': return 'Daytime';
    case 'sunset': return 'Sunset';
    case 'dusk': return 'Dusk';
    case 'night': return 'Night';
  }
};

interface ThemeContextType {
  mode: TimeOfDay;
  setMode: (mode: TimeOfDay) => void;
  activeTimeOfDay: Exclude<TimeOfDay, 'auto'>;
  palette: ThemePalette;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<TimeOfDay>(() => {
    return (localStorage.getItem('finance_theme_mode') as TimeOfDay) || 'auto';
  });

  const [activeTimeOfDay, setActiveTimeOfDay] = useState<Exclude<TimeOfDay, 'auto'>>(() => {
    if (mode === 'auto') return getTimeOfDayFromDate(new Date());
    return mode as Exclude<TimeOfDay, 'auto'>;
  });

  // Automatically check the time every 60 seconds if in auto mode
  useEffect(() => {
    if (mode !== 'auto') return;
    
    const calculateTime = () => {
      setActiveTimeOfDay(getTimeOfDayFromDate(new Date()));
    };
    
    calculateTime();
    const interval = setInterval(calculateTime, 60000); 
    return () => clearInterval(interval);
  }, [mode]);

  // Handle manual override
  const setMode = (newMode: TimeOfDay) => {
    setModeState(newMode);
    localStorage.setItem('finance_theme_mode', newMode);
    if (newMode !== 'auto') {
      setActiveTimeOfDay(newMode as Exclude<TimeOfDay, 'auto'>);
    } else {
      setActiveTimeOfDay(getTimeOfDayFromDate(new Date()));
    }
  };

  const palette = palettes[activeTimeOfDay];

  // Apply base CSS variables and light/dark class
  useEffect(() => {
    const root = document.documentElement;
    
    // Inject dynamic brand colors
    root.style.setProperty('--brand-500', palette.primary);
    root.style.setProperty('--brand-600', palette.secondary);
    
    // Apply background color to body for smooth transition if not using mesh
    // Or let the layout mesh handle the background, we'll just set it on root
    
    // Handle light/dark mode root class
    if (palette.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [palette]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, activeTimeOfDay, palette }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
