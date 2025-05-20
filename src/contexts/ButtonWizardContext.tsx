
import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { ButtonStyle } from "@/types/buttonTypes";
import { initialButtonStyles, presets } from "@/lib/buttonStyles";
import { CustomAnimation, defaultCustomAnimation } from "@/lib/animations";
import { Theme, applyThemeToButton, defaultTheme } from "@/lib/themes";

// Define the state shape
interface ButtonWizardState {
  buttonStyle: ButtonStyle;
  activeTab: string;
  undoStack: ButtonStyle[];
  redoStack: ButtonStyle[];
  customAnimations: CustomAnimation[];
  showAnimationBuilder: boolean;
  showThemeSelector: boolean;
  currentTheme: Theme | null;
  currentThemeVariant: keyof Theme | null;
}

// Initial state
const initialState: ButtonWizardState = {
  buttonStyle: initialButtonStyles,
  activeTab: "style",
  undoStack: [],
  redoStack: [],
  customAnimations: [],
  showAnimationBuilder: false,
  showThemeSelector: false,
  currentTheme: null,
  currentThemeVariant: null
};

// Define action types
type ButtonWizardAction =
  | { type: "UPDATE_STYLE"; payload: Partial<ButtonStyle> }
  | { type: "SET_ACTIVE_TAB"; payload: string }
  | { type: "RESET_STYLE" }
  | { type: "APPLY_PRESET"; payload: ButtonStyle }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "TOGGLE_ANIMATION_BUILDER" }
  | { type: "TOGGLE_THEME_SELECTOR" }
  | { type: "ADD_CUSTOM_ANIMATION"; payload: CustomAnimation }
  | { type: "APPLY_CUSTOM_ANIMATION"; payload: string }
  | { type: "APPLY_THEME"; payload: { theme: Theme; variant: keyof Theme } };

// Create the reducer
function buttonWizardReducer(
  state: ButtonWizardState,
  action: ButtonWizardAction
): ButtonWizardState {
  switch (action.type) {
    case "UPDATE_STYLE":
      return {
        ...state,
        buttonStyle: { ...state.buttonStyle, ...action.payload },
        undoStack: [state.buttonStyle, ...state.undoStack.slice(0, 9)], // Keep last 10 states
        redoStack: [],
      };
    case "SET_ACTIVE_TAB":
      return {
        ...state,
        activeTab: action.payload,
      };
    case "RESET_STYLE":
      return {
        ...state,
        buttonStyle: initialButtonStyles,
        undoStack: [state.buttonStyle, ...state.undoStack.slice(0, 9)],
        redoStack: [],
        currentTheme: null,
        currentThemeVariant: null,
      };
    case "APPLY_PRESET":
      return {
        ...state,
        buttonStyle: action.payload,
        undoStack: [state.buttonStyle, ...state.undoStack.slice(0, 9)],
        redoStack: [],
      };
    case "UNDO":
      if (state.undoStack.length === 0) return state;
      
      const [prevStyle, ...remainingUndoStack] = state.undoStack;
      return {
        ...state,
        buttonStyle: prevStyle,
        undoStack: remainingUndoStack,
        redoStack: [state.buttonStyle, ...state.redoStack],
      };
    case "REDO":
      if (state.redoStack.length === 0) return state;
      
      const [nextStyle, ...remainingRedoStack] = state.redoStack;
      return {
        ...state,
        buttonStyle: nextStyle,
        redoStack: remainingRedoStack,
        undoStack: [state.buttonStyle, ...state.undoStack],
      };
    case "TOGGLE_ANIMATION_BUILDER":
      return {
        ...state,
        showAnimationBuilder: !state.showAnimationBuilder,
      };
    case "TOGGLE_THEME_SELECTOR":
      return {
        ...state,
        showThemeSelector: !state.showThemeSelector,
      };
    case "ADD_CUSTOM_ANIMATION":
      // Check if an animation with this name already exists
      const existingIndex = state.customAnimations.findIndex(
        anim => anim.name === action.payload.name
      );
      
      let updatedAnimations: CustomAnimation[];
      
      if (existingIndex >= 0) {
        // Replace existing animation
        updatedAnimations = [...state.customAnimations];
        updatedAnimations[existingIndex] = action.payload;
      } else {
        // Add new animation
        updatedAnimations = [...state.customAnimations, action.payload];
      }
      
      return {
        ...state,
        customAnimations: updatedAnimations,
        buttonStyle: {
          ...state.buttonStyle,
          animation: "custom",
          customAnimationName: action.payload.name
        },
        undoStack: [state.buttonStyle, ...state.undoStack.slice(0, 9)],
        redoStack: [],
      };
    case "APPLY_CUSTOM_ANIMATION":
      return {
        ...state,
        buttonStyle: {
          ...state.buttonStyle,
          animation: "custom",
          customAnimationName: action.payload
        },
        undoStack: [state.buttonStyle, ...state.undoStack.slice(0, 9)],
        redoStack: [],
      };
    case "APPLY_THEME":
      const { theme, variant } = action.payload;
      const themedButtonStyle = applyThemeToButton(state.buttonStyle, theme, variant);
      
      return {
        ...state,
        buttonStyle: themedButtonStyle,
        currentTheme: theme,
        currentThemeVariant: variant,
        undoStack: [state.buttonStyle, ...state.undoStack.slice(0, 9)],
        redoStack: [],
      };
    default:
      return state;
  }
}

// Create the context
interface ButtonWizardContextType {
  state: ButtonWizardState;
  updateStyle: (newStyles: Partial<ButtonStyle>) => void;
  setActiveTab: (tab: string) => void;
  resetStyle: () => void;
  applyPreset: (preset: ButtonStyle) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  availablePresets: typeof presets;
  toggleAnimationBuilder: () => void;
  toggleThemeSelector: () => void;
  saveCustomAnimation: (animation: CustomAnimation) => void;
  applyCustomAnimation: (animationName: string) => void;
  getCustomAnimation: (name: string | undefined) => CustomAnimation | undefined;
  applyTheme: (theme: Theme, variant: keyof Theme) => void;
}

const ButtonWizardContext = createContext<ButtonWizardContextType | undefined>(undefined);

// Create the provider component
interface ButtonWizardProviderProps {
  children: ReactNode;
}

export function ButtonWizardProvider({ children }: ButtonWizardProviderProps) {
  const [state, dispatch] = useReducer(buttonWizardReducer, initialState);

  const updateStyle = (newStyles: Partial<ButtonStyle>) => {
    dispatch({ type: "UPDATE_STYLE", payload: newStyles });
  };

  const setActiveTab = (tab: string) => {
    dispatch({ type: "SET_ACTIVE_TAB", payload: tab });
  };

  const resetStyle = () => {
    dispatch({ type: "RESET_STYLE" });
  };

  const applyPreset = (preset: ButtonStyle) => {
    dispatch({ type: "APPLY_PRESET", payload: preset });
  };

  const undo = () => {
    dispatch({ type: "UNDO" });
  };

  const redo = () => {
    dispatch({ type: "REDO" });
  };
  
  const toggleAnimationBuilder = () => {
    dispatch({ type: "TOGGLE_ANIMATION_BUILDER" });
  };
  
  const toggleThemeSelector = () => {
    dispatch({ type: "TOGGLE_THEME_SELECTOR" });
  };
  
  const saveCustomAnimation = (animation: CustomAnimation) => {
    dispatch({ type: "ADD_CUSTOM_ANIMATION", payload: animation });
  };
  
  const applyCustomAnimation = (animationName: string) => {
    dispatch({ type: "APPLY_CUSTOM_ANIMATION", payload: animationName });
  };
  
  const getCustomAnimation = (name: string | undefined): CustomAnimation | undefined => {
    if (!name) return undefined;
    return state.customAnimations.find(anim => anim.name === name);
  };
  
  const applyTheme = (theme: Theme, variant: keyof Theme) => {
    dispatch({ 
      type: "APPLY_THEME", 
      payload: { theme, variant } 
    });
  };

  const value = {
    state,
    updateStyle,
    setActiveTab,
    resetStyle,
    applyPreset,
    undo,
    redo,
    canUndo: state.undoStack.length > 0,
    canRedo: state.redoStack.length > 0,
    availablePresets: presets,
    toggleAnimationBuilder,
    toggleThemeSelector,
    saveCustomAnimation,
    applyCustomAnimation,
    getCustomAnimation,
    applyTheme
  };

  return (
    <ButtonWizardContext.Provider value={value}>
      {children}
    </ButtonWizardContext.Provider>
  );
}

// Custom hook for using the context
export function useButtonWizard() {
  const context = useContext(ButtonWizardContext);
  if (context === undefined) {
    throw new Error("useButtonWizard must be used within a ButtonWizardProvider");
  }
  return context;
}
