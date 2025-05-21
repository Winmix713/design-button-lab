import React from "react";
import { Icon } from "@iconify/react";

interface ValidationFeedbackProps {
  isValid: boolean;
  message: string;
  showWhenValid?: boolean;
}

export const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({ 
  isValid, 
  message, 
  showWhenValid = false 
}) => {
  if (isValid && !showWhenValid) {
    return null;
  }
  
  return (
    <div className={`flex items-center gap-1 text-xs mt-1 ${isValid ? "text-success" : "text-danger"}`}>
      <Icon 
        icon={isValid ? "lucide:check-circle" : "lucide:alert-circle"} 
        className="text-sm"
      />
      <span>{message}</span>
    </div>
  );
};