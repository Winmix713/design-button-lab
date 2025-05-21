import React from "react";
import { useComponentWizard } from "../context/component-wizard-context";
import { ComponentState } from "../types/component-types";

export const useComponentRegistry = () => {
  const { 
    componentType, 
    componentState, 
    updateComponentState, 
    updateComponentStyle,
    setComponentType
  } = useComponentWizard();
  
  // Import settings from external source
  const importSettings = (settings: ComponentState) => {
    if (!settings || !settings.componentType) {
      console.error("Invalid settings object");
      return;
    }
    
    // Switch to the component type from settings
    setComponentType(settings.componentType);
    
    // Apply all settings
    Object.entries(settings).forEach(([key, value]) => {
      if (key === 'style') {
        // Handle style properties separately
        Object.entries(value).forEach(([styleKey, styleValue]) => {
          updateComponentStyle(styleKey, styleValue);
        });
      } else if (key !== 'componentType') {
        // Update other properties
        updateComponentState(key, value);
      }
    });
  };
  
  return {
    componentType,
    componentState,
    importSettings
  };
};