import React from "react";
import { motion } from "framer-motion";
import { Card, Tabs, Tab } from "@heroui/react";
import { CardStylePanel } from "./card-style-panel";
import { CardPreviewPanel } from "./card-preview-panel";
import { CodePanel } from "./code-panel";
import { useComponentWizard } from "../context/component-wizard-context";
import { AccessibilityPanel } from "./accessibility-panel";
import { LayoutPanel } from "./layout-panel";
import { useWizardStep } from "../context/wizard-step-context";
import { AnimationPanel } from "./animation-panel";

interface CardWizardProps {
  viewMode: "standard" | "advanced";
}

export const CardWizard: React.FC<CardWizardProps> = ({ viewMode }) => {
  const {
    componentState,
    updateComponentState,
    updateComponentStyle,
    updateNestedComponentState,
    resetToDefault,
    applyPreset,
    presets,
  } = useComponentWizard();

  const { currentStep, steps } = useWizardStep();

  // Map wizard steps to tab content
  const renderStepContent = () => {
    const currentStepId = steps[currentStep].id;
    
    switch (currentStepId) {
      case "style":
        return (
          <CardStylePanel
            componentState={componentState}
            updateComponentState={updateComponentState}
            updateComponentStyle={updateComponentStyle}
            resetToDefault={resetToDefault}
            applyPreset={applyPreset}
            presets={presets.filter(p => p.componentType === "card")}
            viewMode={viewMode}
          />
        );
      case "content":
        return (
          <LayoutPanel
            componentState={componentState}
            updateComponentState={updateComponentState}
            updateNestedComponentState={updateNestedComponentState}
            viewMode={viewMode}
          />
        );
      case "dimensions":
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Size & Dimensions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Width</label>
                <input
                  type="text"
                  className="border border-default-300 rounded-md px-3 py-2"
                  value={componentState.style.width || ""}
                  onChange={(e) => updateComponentStyle("width", e.target.value)}
                  placeholder="auto, 100%, 400px"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Height</label>
                <input
                  type="text"
                  className="border border-default-300 rounded-md px-3 py-2"
                  value={componentState.style.height || ""}
                  onChange={(e) => updateComponentStyle("height", e.target.value)}
                  placeholder="auto, 300px"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Max Width</label>
                <input
                  type="text"
                  className="border border-default-300 rounded-md px-3 py-2"
                  value={componentState.style.maxWidth || ""}
                  onChange={(e) => updateComponentStyle("maxWidth", e.target.value)}
                  placeholder="none, 100%, 500px"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Aspect Ratio</label>
                <select
                  className="border border-default-300 rounded-md px-3 py-2"
                  value={componentState.aspectRatio || "auto"}
                  onChange={(e) => updateComponentState("aspectRatio", e.target.value)}
                >
                  <option value="auto">Auto</option>
                  <option value="1/1">Square (1:1)</option>
                  <option value="16/9">Video (16:9)</option>
                  <option value="3/4">Portrait (3:4)</option>
                  <option value="4/3">Landscape (4:3)</option>
                </select>
              </div>
            </div>
          </div>
        );
      case "effects":
        return (
          <AnimationPanel
            componentType="card"
            componentState={componentState}
            updateComponentState={updateComponentState}
          />
        );
      case "preview":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <CardPreviewPanel 
                componentState={componentState} 
                viewMode={viewMode} 
              />
            </div>
            <div>
              <CodePanel 
                componentType="card"
                componentState={componentState} 
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4 text-center">
            <p>Unknown step: {currentStepId}</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1"
      >
        <Card className="h-full">
          <div className="h-full flex flex-col">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{steps[currentStep].title}</h2>
              <p className="text-default-500">{steps[currentStep].description}</p>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              {renderStepContent()}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};