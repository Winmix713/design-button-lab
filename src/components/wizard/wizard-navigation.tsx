
import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useWizardStep } from "@/contexts/wizard-step-context";

export const WizardNavigation: React.FC = () => {
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
