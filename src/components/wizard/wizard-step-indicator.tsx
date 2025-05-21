
import React from "react";
import { Progress, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useWizardStep } from "@/contexts/wizard-step-context";

export const WizardStepIndicator: React.FC = () => {
  const { currentStep, steps, setCurrentStep } = useWizardStep();
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
        </h3>
        <span className="text-sm text-default-500">
          {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
        </span>
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
            <button
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors
                ${
                  index === currentStep
                    ? "bg-primary-600 text-white"
                    : index < currentStep
                    ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                }
                ${index <= currentStep ? "" : "opacity-60"}
                ${!step.isValid && index > currentStep ? "cursor-not-allowed" : "cursor-pointer"}
              `}
              onClick={() => step.isValid && setCurrentStep(index)}
              disabled={!step.isValid && index > currentStep}
              aria-disabled={!step.isValid && index > currentStep}
            >
              {index < currentStep ? (
                <Icon icon="lucide:check" className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
