import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Tabs, Tab, Button, Divider, Progress, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useComponentWizard } from "../context/component-wizard-context";
import { ComponentSelector } from "./component-selector";
import { ButtonWizard } from "./button-wizard";
import { CardWizard } from "./card-wizard";
import { HistoryControls } from "./history-controls";
import { ErrorBoundary } from "./error-boundary";
import { componentRegistry } from "../registry/component-registry";
import { WizardStepProvider, useWizardStep } from "../context/wizard-step-context";

export const ComponentWizard: React.FC = () => {
  const { 
    componentType, 
    setComponentType,
    addToRecentlyUsed,
    isSelectingComponent,
    setIsSelectingComponent
  } = useComponentWizard();
  const [viewMode, setViewMode] = React.useState<"standard" | "advanced">("standard");

  // Handle component selection
  const handleSelectComponent = (type: string) => {
    setComponentType(type);
    addToRecentlyUsed(type);
    setIsSelectingComponent(false);
  };

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
          <ComponentSelector onSelectComponent={handleSelectComponent} />
        </motion.div>
      </AnimatePresence>
    );
  }

  // Get the current component info from registry
  const currentComponent = componentRegistry[componentType];

  return (
    <WizardStepProvider>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex gap-2 items-center">
            <Button
              size="sm"
              variant="flat"
              color="primary"
              startContent={<Icon icon="lucide:chevron-left" />}
              onPress={() => setIsSelectingComponent(true)}
            >
              Back to Components
            </Button>
            
            <Divider orientation="vertical" className="h-8" />
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary">
                <Icon icon={currentComponent.icon} />
              </div>
              <h2 className="text-xl font-semibold">{currentComponent.name} Wizard</h2>
            </div>
          </div>
          
          <div className="flex gap-2 items-center">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={viewMode === "standard" ? "solid" : "flat"}
                color={viewMode === "standard" ? "primary" : "default"}
                onPress={() => setViewMode("standard")}
              >
                Standard
              </Button>
              <Button 
                size="sm" 
                variant={viewMode === "advanced" ? "solid" : "flat"}
                color={viewMode === "advanced" ? "primary" : "default"}
                onPress={() => setViewMode("advanced")}
              >
                Advanced
              </Button>
            </div>
            <Divider orientation="vertical" className="h-8" />
            <HistoryControls />
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
    </WizardStepProvider>
  );
};

const WizardStepIndicator: React.FC = () => {
  const { currentStep, steps, setCurrentStep } = useWizardStep();
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}</h3>
        <span className="text-sm text-default-500">{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
      </div>
      
      <Progress 
        aria-label="Wizard progress" 
        value={((currentStep + 1) / steps.length) * 100} 
        className="h-2"
        color="primary"
      />
      
      <div className="flex justify-between mt-2 overflow-x-auto pb-2 hide-scrollbar">
        {steps.map((step, index) => (
          <Tooltip key={index} content={step.title}>
            <Button
              isIconOnly
              size="sm"
              variant={index === currentStep ? "solid" : index < currentStep ? "flat" : "light"}
              color={index <= currentStep ? "primary" : "default"}
              onPress={() => step.isValid && setCurrentStep(index)}
              isDisabled={!step.isValid && index > currentStep}
              className={`rounded-full min-w-8 w-8 h-8 ${index <= currentStep ? "" : "opacity-60"}`}
            >
              {index < currentStep ? (
                <Icon icon="lucide:check" />
              ) : (
                index + 1
              )}
            </Button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

const WizardNavigation: React.FC = () => {
  const { currentStep, steps, goToNextStep, goToPreviousStep, isFirstStep, isLastStep, validateCurrentStep } = useWizardStep();
  
  return (
    <div className="flex justify-between mt-4">
      <Button
        variant="flat"
        onPress={goToPreviousStep}
        isDisabled={isFirstStep}
        startContent={<Icon icon="lucide:arrow-left" />}
      >
        Previous
      </Button>
      
      <div className="flex gap-2">
        {!isLastStep ? (
          <Button
            color="primary"
            onPress={() => {
              if (validateCurrentStep()) {
                goToNextStep();
              }
            }}
            endContent={<Icon icon="lucide:arrow-right" />}
          >
            Next
          </Button>
        ) : (
          <Button
            color="success"
            onPress={() => {
              if (validateCurrentStep()) {
                // Handle completion logic
                alert("Component created successfully!");
              }
            }}
            endContent={<Icon icon="lucide:check" />}
          >
            Finish
          </Button>
        )}
      </div>
    </div>
  );
};