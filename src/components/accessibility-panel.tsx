import React from "react";
import { Card, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ComponentState } from "../types/component-types";

interface AccessibilityPanelProps {
  componentType: "button" | "card";
  componentState: ComponentState;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ componentType, componentState }) => {
  const issues = React.useMemo(() => {
    const result = [];
    
    // Common checks
    const bgColor = componentState.style.backgroundColor || "#ffffff";
    const textColor = componentState.style.color || "#000000";
    
    // Simplified contrast check
    if (bgColor === "#ffffff" && (textColor === "#ffffff" || textColor === "#f8f8f8")) {
      result.push({
        severity: "high",
        message: "Low contrast between text and background colors",
        suggestion: "Use a darker text color for better readability"
      });
    }
    
    // Component-specific checks
    if (componentType === "button") {
      // Check text size
      const fontSize = parseInt(componentState.style.fontSize || "16");
      if (fontSize < 14) {
        result.push({
          severity: "medium",
          message: "Text size may be too small for some users",
          suggestion: "Consider using at least 14px font size for better readability"
        });
      }
      
      // Check if button has text
      if (!componentState.text && !componentState.iconLeft && !componentState.iconRight) {
        result.push({
          severity: "high",
          message: "Button has no content (text or icon)",
          suggestion: "Add text or an icon to make the button's purpose clear"
        });
      }
    } else if (componentType === "card") {
      // Check for alt text on images
      if (componentState.showImage && !componentState.imageAltText) {
        result.push({
          severity: "high",
          message: "Image missing alternative text",
          suggestion: "Add descriptive alt text for screen readers"
        });
      }
      
      // Check for heading structure
      if (componentState.showHeader && !componentState.headerTitle) {
        result.push({
          severity: "medium",
          message: "Card has a header section but no title",
          suggestion: "Add a descriptive title to the card header"
        });
      }
      
      // Check for interactive elements
      if (componentState.isPressable && !componentState.ariaLabel) {
        result.push({
          severity: "medium",
          message: "Clickable card missing accessible label",
          suggestion: "Add an aria-label to describe the card's action"
        });
      }
    }
    
    return result;
  }, [componentType, componentState]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Accessibility Analysis</h2>
        <Button 
          size="sm" 
          color="primary"
          startContent={<Icon icon="lucide:wand-2" />}
        >
          Auto-fix Issues
        </Button>
      </div>
      
      {issues.length === 0 ? (
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <Icon icon="lucide:check-circle" className="text-success text-4xl mb-2" />
          <p className="text-lg font-medium">No accessibility issues detected!</p>
          <p className="text-default-500">Your {componentType} meets basic accessibility standards</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {issues.map((issue, index) => (
            <Card key={index} className="p-3 border-l-4 border-l-warning">
              <div className="flex gap-3">
                <div className="text-warning">
                  <Icon icon="lucide:alert-triangle" size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{issue.message}</p>
                  <p className="text-small text-default-500">{issue.suggestion}</p>
                </div>
                <Button size="sm" variant="flat" color="warning">Fix</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-4">
        <h3 className="text-medium font-medium mb-2">Recommendations</h3>
        <ul className="list-disc list-inside space-y-2 text-default-600">
          {componentType === "button" ? (
            <>
              <li>Consider adding an aria-label if the button only contains an icon</li>
              <li>Ensure the button is keyboard accessible and has a visible focus state</li>
              <li>Use descriptive text that clearly indicates the button's action</li>
              <li>Maintain a minimum touch target size of 44x44 pixels for mobile users</li>
            </>
          ) : (
            <>
              <li>Ensure all images have descriptive alt text</li>
              <li>Maintain proper heading hierarchy within cards</li>
              <li>Provide sufficient color contrast for all text content</li>
              <li>If the card is clickable, ensure it has proper keyboard focus handling</li>
              <li>Consider adding ARIA roles and attributes for complex card layouts</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};