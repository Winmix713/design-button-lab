
import React from "react";
import { componentRegistry } from "../registry/component-registry";

interface ComponentSelectionContextType {
  isSelectingComponent: boolean;
  setIsSelectingComponent: (isSelecting: boolean) => void;
  recentlyUsedComponents: string[];
  addToRecentlyUsed: (componentType: string) => void;
}

const ComponentSelectionContext = React.createContext<ComponentSelectionContextType | undefined>(undefined);

export const ComponentSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for component selection mode
  const [isSelectingComponent, setIsSelectingComponent] = React.useState<boolean>(true);
  
  // State for recently used components
  const [recentlyUsedComponents, setRecentlyUsedComponents] = React.useState<string[]>(() => {
    // Try to get from localStorage
    const savedRecentlyUsed = localStorage.getItem("recentlyUsedComponents");
    return savedRecentlyUsed ? JSON.parse(savedRecentlyUsed) : [];
  });
  
  // Save recently used components to localStorage
  React.useEffect(() => {
    localStorage.setItem("recentlyUsedComponents", JSON.stringify(recentlyUsedComponents));
  }, [recentlyUsedComponents]);
  
  // Add component to recently used list
  const addToRecentlyUsed = (type: string) => {
    setRecentlyUsedComponents(prev => {
      // Remove if already exists
      const filtered = prev.filter(t => t !== type);
      // Add to beginning
      return [type, ...filtered].slice(0, 5); // Keep only 5 most recent
    });
  };
  
  const value = {
    isSelectingComponent,
    setIsSelectingComponent,
    recentlyUsedComponents,
    addToRecentlyUsed
  };
  
  return (
    <ComponentSelectionContext.Provider value={value}>
      {children}
    </ComponentSelectionContext.Provider>
  );
};

export const useComponentSelection = () => {
  const context = React.useContext(ComponentSelectionContext);
  if (context === undefined) {
    throw new Error("useComponentSelection must be used within a ComponentSelectionProvider");
  }
  return context;
};
