import React from "react";
import { produce } from "immer";
import { ButtonState } from "../types/button-types";
import { Preset, presets } from "../data/presets";

// Create the context
interface ButtonWizardContextType {
  buttonState: ButtonState;
  updateButtonState: (key: string, value: any) => void;
  updateButtonStyle: (key: string, value: any) => void;
  resetToDefault: () => void;
  applyPreset: (preset: Preset) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  presets: Preset[];
}

const ButtonWizardContext = React.createContext<ButtonWizardContextType | undefined>(undefined);

// Default button state
const defaultButtonState: ButtonState = {
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

// Provider component
export const ButtonWizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for history management
  const [history, setHistory] = React.useState<ButtonState[]>([defaultButtonState]);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  
  // Current button state is always the current point in history
  const buttonState = history[currentIndex];
  
  // Determine if undo/redo are available
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  // Update button state (for non-style properties)
  const updateButtonState = (key: string, value: any) => {
    const newState = produce(buttonState, (draft) => {
      draft[key] = value;
    });
    
    // Truncate future history if we're not at the end
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);
    
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  // Update button style (for style properties)
  const updateButtonStyle = (key: string, value: any) => {
    const newState = produce(buttonState, (draft) => {
      draft.style[key] = value;
    });
    
    // Truncate future history if we're not at the end
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);
    
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  // Reset to default
  const resetToDefault = () => {
    setHistory([defaultButtonState]);
    setCurrentIndex(0);
  };

  // Apply preset
  const applyPreset = (preset: Preset) => {
    const newState = {
      ...buttonState,
      ...preset.state,
    };
    
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);
    
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  // Undo action
  const undo = () => {
    if (!canUndo) return;
    setCurrentIndex(currentIndex - 1);
  };

  // Redo action
  const redo = () => {
    if (!canRedo) return;
    setCurrentIndex(currentIndex + 1);
  };

  const value = {
    buttonState,
    updateButtonState,
    updateButtonStyle,
    resetToDefault,
    applyPreset,
    undo,
    redo,
    canUndo,
    canRedo,
    presets,
  };

  return (
    <ButtonWizardContext.Provider value={value}>
      {children}
    </ButtonWizardContext.Provider>
  );
};

// Custom hook to use the context
export const useButtonWizard = () => {
  const context = React.useContext(ButtonWizardContext);
  if (context === undefined) {
    throw new Error("useButtonWizard must be used within a ButtonWizardProvider");
  }
  return context;
};