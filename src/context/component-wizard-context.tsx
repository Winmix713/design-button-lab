import React from "react";
import { produce } from "immer";
import { ComponentState } from "../types/component-types";
import { Preset } from "../types/preset-types";
import { buttonPresets, cardPresets } from "../data/presets";

// Create the context
interface ComponentWizardContextType {
  componentType: string;
  setComponentType: (type: string) => void;
  componentState: ComponentState;
  updateComponentState: (key: string, value: any) => void;
  updateComponentStyle: (key: string, value: any) => void;
  updateNestedComponentState: (section: string, key: string, value: any) => void;
  resetToDefault: () => void;
  applyPreset: (preset: Preset) => void;
  saveCustomPreset: (preset: Preset) => void;
  deleteCustomPreset: (presetName: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  presets: Preset[];
  customPresets: Preset[];
  recentlyUsedComponents: string[];
  addToRecentlyUsed: (componentType: string) => void;
  isSelectingComponent: boolean;
  setIsSelectingComponent: (isSelecting: boolean) => void;
}

const ComponentWizardContext = React.createContext<ComponentWizardContextType | undefined>(undefined);

// Default button state
const defaultButtonState: ComponentState = {
  componentType: "button",
  text: "Button",
  iconLeft: "",
  iconRight: "",
  customCSS: "",
  style: {
    color: "#ffffff",
    backgroundColor: "#006FEE",
    borderColor: "#006FEE",
    borderWidth: "1px",
    borderRadius: "8px",
    fontWeight: "500",
    fontSize: "16px",
    paddingTop: "8px",
    paddingRight: "16px",
    paddingBottom: "8px",
    paddingLeft: "16px",
    textAlign: "center",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transitionProperty: "all",
    transitionDuration: "150ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  hoverStyle: {
    backgroundColor: "#0057b7",
    borderColor: "#0057b7",
    transform: "scale(1.02)",
  },
  activeStyle: {
    backgroundColor: "#004494",
    borderColor: "#004494",
  },
};

// Default card state
const defaultCardState: ComponentState = {
  componentType: "card",
  showHeader: true,
  headerTitle: "Card Title",
  headerSubtitle: "Card Subtitle",
  showImage: true,
  imagePosition: "top",
  imageHeight: "h-48",
  imageUrl: "",
  imageAltText: "",
  bodyContent: "This is a sample card content. You can customize this text and add more elements.",
  showFooter: true,
  footerContent: "",
  backgroundType: "solid",
  isHoverable: false,
  isPressable: false,
  isBlurred: false,
  layoutType: "standard",
  style: {
    backgroundColor: "#ffffff",
    borderColor: "#e4e4e7",
    borderWidth: "1px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
    width: "100%",
    maxWidth: "400px",
    overflow: "hidden",
    paddingTop: "0px",
    paddingRight: "0px",
    paddingBottom: "0px",
    paddingLeft: "0px",
    transitionProperty: "all",
    transitionDuration: "150ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  hoverStyle: {
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
    transform: "translateY(-4px)",
  },
  activeStyle: {},
};

// Provider component
export const ComponentWizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for component type
  const [componentType, setComponentTypeInternal] = React.useState<string>(() => {
    // Try to get from localStorage
    const savedComponentType = localStorage.getItem("lastComponentType");
    return savedComponentType || "button";
  });
  
  // State for component selection mode
  const [isSelectingComponent, setIsSelectingComponent] = React.useState<boolean>(true);
  
  // State for recently used components
  const [recentlyUsedComponents, setRecentlyUsedComponents] = React.useState<string[]>(() => {
    // Try to get from localStorage
    const savedRecentlyUsed = localStorage.getItem("recentlyUsedComponents");
    return savedRecentlyUsed ? JSON.parse(savedRecentlyUsed) : [];
  });
  
  // State for history management
  const [componentStates, setComponentStates] = React.useState<Record<string, ComponentState[]>>(() => {
    // Try to get from localStorage
    const savedStates = localStorage.getItem("componentStates");
    const defaultStates = {
      button: [defaultButtonState],
      card: [defaultCardState]
    };
    
    if (savedStates) {
      try {
        return JSON.parse(savedStates);
      } catch (e) {
        console.error("Error parsing saved component states:", e);
        return defaultStates;
      }
    }
    
    return defaultStates;
  });
  
  const [currentIndices, setCurrentIndices] = React.useState<Record<string, number>>(() => {
    // Try to get from localStorage
    const savedIndices = localStorage.getItem("currentIndices");
    const defaultIndices = {
      button: 0,
      card: 0
    };
    
    if (savedIndices) {
      try {
        return JSON.parse(savedIndices);
      } catch (e) {
        console.error("Error parsing saved indices:", e);
        return defaultIndices;
      }
    }
    
    return defaultIndices;
  });
  
  // Add state for custom presets
  const [customPresets, setCustomPresets] = React.useState<Preset[]>(() => {
    // Load custom presets from localStorage if available
    const savedPresets = localStorage.getItem('customPresets');
    return savedPresets ? JSON.parse(savedPresets) : [];
  });
  
  // Function to get default state for a component type
  function getDefaultStateForType(type: string): ComponentState {
    switch (type) {
      case "button":
        return defaultButtonState;
      case "card":
        return defaultCardState;
      default:
        // For unknown types, return a basic state
        return {
          componentType: type,
          style: {}
        };
    }
  }
  
  // Get current history and index based on component type
  const history = componentStates[componentType] || [getDefaultStateForType(componentType)];
  const currentIndex = currentIndices[componentType] || 0;
  
  // Current component state is always the current point in history
  const componentState = history[currentIndex];
  
  // Determine if undo/redo are available
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;
  
  // Get presets based on component type
  const allPresets = React.useMemo(() => {
    return [...buttonPresets, ...cardPresets, ...customPresets];
  }, [customPresets]);
  
  // Save component states to localStorage
  React.useEffect(() => {
    localStorage.setItem("componentStates", JSON.stringify(componentStates));
  }, [componentStates]);
  
  // Save current indices to localStorage
  React.useEffect(() => {
    localStorage.setItem("currentIndices", JSON.stringify(currentIndices));
  }, [currentIndices]);
  
  // Save recently used components to localStorage
  React.useEffect(() => {
    localStorage.setItem("recentlyUsedComponents", JSON.stringify(recentlyUsedComponents));
  }, [recentlyUsedComponents]);
  
  // Save last used component type to localStorage
  React.useEffect(() => {
    localStorage.setItem("lastComponentType", componentType);
  }, [componentType]);
  
  // Add component to recently used list
  const addToRecentlyUsed = (type: string) => {
    setRecentlyUsedComponents(prev => {
      // Remove if already exists
      const filtered = prev.filter(t => t !== type);
      // Add to beginning
      return [type, ...filtered].slice(0, 5); // Keep only 5 most recent
    });
  };
  
  // Set component type with side effects
  const setComponentType = (type: string) => {
    setComponentTypeInternal(type);
    
    // Initialize state for this component type if it doesn't exist
    setComponentStates(prev => {
      if (!prev[type]) {
        return {
          ...prev,
          [type]: [getDefaultStateForType(type)]
        };
      }
      return prev;
    });
    
    // Initialize current index for this component type if it doesn't exist
    setCurrentIndices(prev => {
      if (prev[type] === undefined) {
        return {
          ...prev,
          [type]: 0
        };
      }
      return prev;
    });
  };
  
  // Save a new custom preset
  const saveCustomPreset = (preset: Preset) => {
    const newCustomPresets = [...customPresets, preset];
    setCustomPresets(newCustomPresets);
    
    // Save to localStorage
    localStorage.setItem('customPresets', JSON.stringify(newCustomPresets));
  };
  
  // Delete a custom preset
  const deleteCustomPreset = (presetName: string) => {
    const newCustomPresets = customPresets.filter(preset => preset.name !== presetName);
    setCustomPresets(newCustomPresets);
    
    // Save to localStorage
    localStorage.setItem('customPresets', JSON.stringify(newCustomPresets));
  };
  
  // Update component state (for non-style properties)
  const updateComponentState = (key: string, value: any) => {
    const newState = produce(componentState, (draft) => {
      draft[key] = value;
    });
    
    // Truncate future history if we're not at the end
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);
    
    setComponentStates(prev => ({
      ...prev,
      [componentType]: newHistory
    }));
    
    setCurrentIndices(prev => ({
      ...prev,
      [componentType]: newHistory.length - 1
    }));
  };

  // Update component style (for style properties)
  const updateComponentStyle = (key: string, value: any) => {
    const newState = produce(componentState, (draft) => {
      if (!draft.style) {
        draft.style = {};
      }
      draft.style[key] = value;
    });
    
    // Truncate future history if we're not at the end
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);
    
    setComponentStates(prev => ({
      ...prev,
      [componentType]: newHistory
    }));
    
    setCurrentIndices(prev => ({
      ...prev,
      [componentType]: newHistory.length - 1
    }));
  };
  
  // Update nested component state (for complex properties)
  const updateNestedComponentState = (section: string, key: string, value: any) => {
    const newState = produce(componentState, (draft) => {
      if (!draft[section]) {
        draft[section] = {};
      }
      draft[section][key] = value;
    });
    
    // Truncate future history if we're not at the end
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);
    
    setComponentStates(prev => ({
      ...prev,
      [componentType]: newHistory
    }));
    
    setCurrentIndices(prev => ({
      ...prev,
      [componentType]: newHistory.length - 1
    }));
  };

  // Reset to default
  const resetToDefault = () => {
    const defaultState = getDefaultStateForType(componentType);
    
    setComponentStates(prev => ({
      ...prev,
      [componentType]: [defaultState]
    }));
    
    setCurrentIndices(prev => ({
      ...prev,
      [componentType]: 0
    }));
  };

  // Apply preset
  const applyPreset = (preset: Preset) => {
    if (preset.componentType !== componentType) {
      // Switch component type if preset is for a different component
      setComponentType(preset.componentType);
      
      // Apply preset to the appropriate history
      const newState = {
        ...getDefaultStateForType(preset.componentType),
        ...preset.state,
      };
      
      setComponentStates(prev => ({
        ...prev,
        [preset.componentType]: [newState]
      }));
      
      setCurrentIndices(prev => ({
        ...prev,
        [preset.componentType]: 0
      }));
      
      return;
    }
    
    const newState = {
      ...componentState,
      ...preset.state,
    };
    
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);
    
    setComponentStates(prev => ({
      ...prev,
      [componentType]: newHistory
    }));
    
    setCurrentIndices(prev => ({
      ...prev,
      [componentType]: newHistory.length - 1
    }));
  };

  // Undo action
  const undo = () => {
    if (!canUndo) return;
    
    setCurrentIndices(prev => ({
      ...prev,
      [componentType]: currentIndex - 1
    }));
  };

  // Redo action
  const redo = () => {
    if (!canRedo) return;
    
    setCurrentIndices(prev => ({
      ...prev,
      [componentType]: currentIndex + 1
    }));
  };
  
  const value = {
    componentType,
    setComponentType,
    componentState,
    updateComponentState,
    updateComponentStyle,
    updateNestedComponentState,
    resetToDefault,
    applyPreset,
    saveCustomPreset,
    deleteCustomPreset,
    undo,
    redo,
    canUndo,
    canRedo,
    presets: allPresets,
    customPresets,
    recentlyUsedComponents,
    addToRecentlyUsed,
    isSelectingComponent,
    setIsSelectingComponent,
  };

  return (
    <ComponentWizardContext.Provider value={value}>
      {children}
    </ComponentWizardContext.Provider>
  );
};

// Custom hook to use the context
export const useComponentWizard = () => {
  const context = React.useContext(ComponentWizardContext);
  if (context === undefined) {
    throw new Error("useComponentWizard must be used within a ComponentWizardProvider");
  }
  return context;
};