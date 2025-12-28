
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

// Define the shape of our settings
interface ServerRates {
  maturation: number;
  incubation: number;
  mating: number;
}

interface Settings {
  allowImageEditing: boolean;
  serverRates: ServerRates;
}

// Define the context type
interface SettingsContextType {
  settings: Settings;
  setAllowImageEditing: (enabled: boolean) => void;
  setServerRates: (rates: Partial<ServerRates>) => void;
}

// Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Helper to get initial values from localStorage
const getInitialSettings = (): Settings => {
  const defaultSettings: Settings = {
    allowImageEditing: true,
    serverRates: {
      maturation: 1,
      incubation: 1,
      mating: 1,
    },
  };
  try {
    const saved = localStorage.getItem('ark_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge saved settings with defaults to handle new settings being added
      return { ...defaultSettings, ...parsed, serverRates: { ...defaultSettings.serverRates, ...(parsed.serverRates || {}) } };
    }
  } catch (error) {
    console.error("Failed to parse settings from localStorage", error);
  }
  return defaultSettings;
};

// Create the provider component
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(getInitialSettings);

  useEffect(() => {
    try {
      localStorage.setItem('ark_settings', JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }
  }, [settings]);

  const setAllowImageEditing = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, allowImageEditing: enabled }));
  };

  const setServerRates = (rates: Partial<ServerRates>) => {
    setSettings(prev => ({
      ...prev,
      serverRates: { ...prev.serverRates, ...rates },
    }));
  };

  const contextValue = useMemo(() => ({
    settings,
    setAllowImageEditing,
    setServerRates,
  }), [settings]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

// Create the custom hook
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
