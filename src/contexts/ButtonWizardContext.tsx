
import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { ButtonStyle } from "@/types/buttonTypes";
import { initialButtonStyles, presets } from "@/lib/buttonStyles";

// Define the state shape
interface ButtonWizardState {
  buttonStyle: ButtonStyle;
  activeTab: string;
  undoStack: ButtonStyle[];
  redoStack: ButtonStyle[];
}

// Initial state
const initialState: ButtonWizardState = {
  buttonStyle: initialButtonStyles,
  activeTab: "style",
  undoStack: [],
  redoStack: [],
};

// Define action types
type ButtonWizardAction =
  | { type: "UPDATE_STYLE"; payload: Partial<ButtonStyle> }
  | { type: "SET_ACTIVE_TAB"; payload: string }
  | { type: "RESET_STYLE" }
  | { type: "APPLY_PRESET"; payload: ButtonStyle }
  | { type: "UNDO" }
  | { type: "REDO" };

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
