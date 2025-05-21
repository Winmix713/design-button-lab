
import React from "react";
import { Preset } from "../types/preset-types";
import { buttonPresets, cardPresets } from "../data/presets";
import { useComponentState } from "./component-state-context";

interface PresetContextType {
  presets: Preset[];
  customPresets: Preset[];
  saveCustomPreset: (preset: Preset) => void;
  deleteCustomPreset: (presetName: string) => void;
  applyPreset: (preset: Preset) => void;
}

const PresetContext = React.createContext<PresetContextType | undefined>(undefined);

export const PresetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { componentType, componentState, setComponentType } = useComponentState();
  
  // Add state for custom presets
  const [customPresets, setCustomPresets] = React.useState<Preset[]>(() => {
    // Load custom presets from localStorage if available
    const savedPresets = localStorage.getItem('customPresets');
    return savedPresets ? JSON.parse(savedPresets) : [];
  });
  
  // Get presets based on component type
  const allPresets = React.useMemo(() => {
    return [...buttonPresets, ...cardPresets, ...customPresets];
  }, [customPresets]);
  
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

  // Apply preset
  const applyPreset = (preset: Preset) => {
    if (preset.componentType !== componentType) {
      // Switch component type if preset is for a different component
      setComponentType(preset.componentType);
    }
    
    // Apply the preset state through update operations
    // Note: The actual state updates will be handled in the component state context
  };
  
  const value = {
    presets: allPresets,
    customPresets,
    saveCustomPreset,
    deleteCustomPreset,
    applyPreset
  };

  return (
    <PresetContext.Provider value={value}>
      {children}
    </PresetContext.Provider>
  );
};

export const usePresets = () => {
  const context = React.useContext(PresetContext);
  if (context === undefined) {
    throw new Error("usePresets must be used within a PresetProvider");
  }
  return context;
};
