
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ErrorBoundary } from "../error-boundary";
import { ComponentSelector } from "./component-selector";
import { ButtonWizard } from "./button-wizard";
import { CardWizard } from "./card-wizard";
import { WizardNavigation } from "./wizard-navigation";
import { WizardStepIndicator } from "./wizard-step-indicator";
import { useComponentSelection } from "@/contexts/component-selection-context";
import { useComponentState } from "@/contexts/component-state-context";

export const ComponentWizardRoot: React.FC = () => {
  const { isSelectingComponent, setIsSelectingComponent } = useComponentSelection();
  const { componentType } = useComponentState();
  const [viewMode, setViewMode] = React.useState<"standard" | "advanced">("standard");
  
  // If we're in component selection mode, show the selector
  if (isSelectingComponent) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="component-selector"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ComponentSelector />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex gap-2 items-center">
          <button
            className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
            onClick={() => setIsSelectingComponent(true)}
          >
            <Icon icon="lucide:chevron-left" className="mr-2 h-4 w-4" />
            Back to Components
          </button>
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="flex gap-2">
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                viewMode === "standard"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
              onClick={() => setViewMode("standard")}
            >
              Standard
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                viewMode === "advanced"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
              onClick={() => setViewMode("advanced")}
            >
              Advanced
            </button>
          </div>
        </div>
      </div>
        
      <WizardStepIndicator />
      
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          <motion.div
            key={componentType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {componentType === "button" ? (
              <ButtonWizard viewMode={viewMode} />
            ) : componentType === "card" ? (
              <CardWizard viewMode={viewMode} />
            ) : (
              <div className="p-8 text-center">
                <p>Component wizard for {componentType} is not implemented yet.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </ErrorBoundary>
      
      <WizardNavigation />
    </div>
  );
};
