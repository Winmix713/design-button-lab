
import React from "react";
import { ComponentSelectionProvider } from "./component-selection-context";
import { ComponentStateProvider } from "./component-state-context";
import { PresetProvider } from "./preset-context";
import { WizardStepProvider } from "./wizard-step-context";

export const ComponentWizardRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ComponentSelectionProvider>
      <ComponentStateProvider>
        <PresetProvider>
          <WizardStepProvider>
            {children}
          </WizardStepProvider>
        </PresetProvider>
      </ComponentStateProvider>
    </ComponentSelectionProvider>
  );
};
