import React from "react";
import { ButtonState } from "../types/button-types";
import { Preset } from "../data/presets";

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

export const useButtonState = () => {
  const [buttonState, setButtonState] = React.useState<ButtonState>({ ...defaultButtonState });

  const updateButtonState = (key: string, value: any) => {
    setButtonState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateButtonStyle = (key: string, value: any) => {
    setButtonState((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        [key]: value,
      },
    }));
  };

  const resetToDefault = () => {
    setButtonState({ ...defaultButtonState });
  };

  const applyPreset = (preset: Preset) => {
    setButtonState((prev) => ({
      ...prev,
      ...preset.state,
    }));
  };

  return {
    buttonState,
    updateButtonState,
    updateButtonStyle,
    resetToDefault,
    applyPreset,
  };
};
