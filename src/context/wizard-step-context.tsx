import React from "react";

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  isValid: boolean;
  validate: () => boolean;
}

interface WizardStepContextType {
  currentStep: number;
  steps: WizardStep[];
  setCurrentStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  validateCurrentStep: () => boolean;
  setStepValidity: (stepId: string, isValid: boolean) => void;
  updateStepValidation: (stepId: string, validationFn: () => boolean) => void;
}

const WizardStepContext = React.createContext<WizardStepContextType | undefined>(undefined);

export const WizardStepProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default steps for component wizards
  const [steps, setSteps] = React.useState<WizardStep[]>([
    {
      id: "style",
      title: "Basic Style",
      description: "Set the basic appearance of your component",
      isValid: true,
      validate: () => true
    },
    {
      id: "content",
      title: "Content",
      description: "Add text and icons to your component",
      isValid: true,
      validate: () => true
    },
    {
      id: "dimensions",
      title: "Dimensions",
      description: "Set the size and spacing of your component",
      isValid: true,
      validate: () => true
    },
    {
      id: "effects",
      title: "Effects",
      description: "Add animations and interactive effects",
      isValid: true,
      validate: () => true
    },
    {
      id: "preview",
      title: "Preview & Export",
      description: "Review and export your component",
      isValid: true,
      validate: () => true
    }
  ]);
  
  const [currentStep, setCurrentStep] = React.useState(0);
  
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  
  const goToNextStep = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const validateCurrentStep = () => {
    const step = steps[currentStep];
    const isValid = step.validate();
    
    // Update step validity
    setSteps(prevSteps => 
      prevSteps.map((s, i) => 
        i === currentStep ? { ...s, isValid } : s
      )
    );
    
    return isValid;
  };
  
  const setStepValidity = (stepId: string, isValid: boolean) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, isValid } : step
      )
    );
  };
  
  const updateStepValidation = (stepId: string, validationFn: () => boolean) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, validate: validationFn } : step
      )
    );
  };
  
  const value = {
    currentStep,
    steps,
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    isFirstStep,
    isLastStep,
    validateCurrentStep,
    setStepValidity,
    updateStepValidation
  };
  
  return (
    <WizardStepContext.Provider value={value}>
      {children}
    </WizardStepContext.Provider>
  );
};

export const useWizardStep = () => {
  const context = React.useContext(WizardStepContext);
  if (context === undefined) {
    throw new Error("useWizardStep must be used within a WizardStepProvider");
  }
  return context;
};