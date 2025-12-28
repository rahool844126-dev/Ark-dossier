
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { ArkEdition } from './types';

interface EditionContextType {
  edition: ArkEdition;
  setEdition: (edition: ArkEdition) => void;
  toggleEdition: () => void;
}

const EditionContext = createContext<EditionContextType | undefined>(undefined);

const getInitialEdition = (): ArkEdition => {
  try {
    const savedEdition = localStorage.getItem('ark_edition');
    if (savedEdition === ArkEdition.MOBILE || savedEdition === ArkEdition.ULTIMATE) {
      return savedEdition;
    }
  } catch (error) {
    console.error("Failed to read edition from localStorage", error);
  }
  return ArkEdition.ULTIMATE; // Default to Ultimate
};


export const EditionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [edition, setEditionState] = useState<ArkEdition>(getInitialEdition);

  useEffect(() => {
    try {
      localStorage.setItem('ark_edition', edition);
      document.documentElement.setAttribute('data-edition', edition);
    } catch (error) {
      console.error("Failed to save edition to localStorage", error);
    }
  }, [edition]);

  const setEdition = (newEdition: ArkEdition) => {
    setEditionState(newEdition);
  };
  
  const toggleEdition = () => {
    setEditionState(prev => prev === ArkEdition.ULTIMATE ? ArkEdition.MOBILE : ArkEdition.ULTIMATE);
  };
  
  const contextValue = useMemo(() => ({ edition, setEdition, toggleEdition }), [edition]);

  return (
    <EditionContext.Provider value={contextValue}>
      {children}
    </EditionContext.Provider>
  );
};

export const useEdition = (): EditionContextType => {
  const context = useContext(EditionContext);
  if (!context) {
    throw new Error('useEdition must be used within an EditionProvider');
  }
  return context;
};
