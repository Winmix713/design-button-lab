import React from "react";
import { motion } from "framer-motion";
import { Card, Tabs, Tab, Button, ButtonGroup, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { StylePanel } from "./style-panel";
import { PreviewPanel } from "./preview-panel";
import { CodePanel } from "./code-panel";
import { useComponentWizard } from "../context/component-wizard-context";
import { AccessibilityPanel } from "./accessibility-panel";
import { HistoryControls } from "./history-controls";
import { SavePresetModal } from "./save-preset-modal";
import { useWizardStep } from "../context/wizard-step-context";
import { AnimationPanel } from "./animation-panel";

interface ButtonWizardProps {
  viewMode: "standard" | "advanced";
}

export const ButtonWizard: React.FC<ButtonWizardProps> = ({ viewMode }) => {
  const {
    componentType,
    setComponentType,
    componentState,
    updateComponentState,
    updateComponentStyle,
    resetToDefault,
    applyPreset,
    saveCustomPreset,
    presets,
  } = useComponentWizard();

  const { currentStep, steps } = useWizardStep();
  const [showSavePresetModal, setShowSavePresetModal] = React.useState<boolean>(false);
  const [layoutMode, setLayoutMode] = React.useState<"vertical" | "horizontal">("horizontal");

  const presetCategories = React.useMemo(() => {
    const categories = new Set<string>();
    presets
      .filter(p => p.componentType === componentType)
      .forEach(preset => categories.add(preset.category));
    return Array.from(categories);
  }, [presets, componentType]);

  const handleSavePreset = (preset) => {
    saveCustomPreset(preset);
    setShowSavePresetModal(false);
  };

  // Map wizard steps to tab content
  const renderStepContent = () => {
    const currentStepId = steps[currentStep].id;
    
    switch (currentStepId) {
      case "style":
        return (
          <StylePanel
            componentType={componentType}
            componentState={componentState}
            updateComponentState={updateComponentState}
            updateComponentStyle={updateComponentStyle}
            resetToDefault={resetToDefault}
            applyPreset={applyPreset}
            presets={presets.filter(p => p.componentType === componentType)}
            viewMode={viewMode}
          />
        );
      case "content":
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Content Configuration</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Button Text</label>
                <input
                  type="text"
                  className="border border-default-300 rounded-md px-3 py-2"
                  value={componentState.text || ""}
                  onChange={(e) => updateComponentState("text", e.target.value)}
                  placeholder="Enter button text"
                />
                <p className="text-xs text-default-500">
                  {!componentState.text && "Button text is required"}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Left Icon</label>
                  <input
                    type="text"
                    className="border border-default-300 rounded-md px-3 py-2"
                    value={componentState.iconLeft || ""}
                    onChange={(e) => updateComponentState("iconLeft", e.target.value)}
                    placeholder="e.g. lucide:heart"
                  />
                  {componentState.iconLeft && (
                    <div className="mt-2 flex items-center gap-2">
                      <span>Preview:</span>
                      <Icon icon={componentState.iconLeft} />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Right Icon</label>
                  <input
                    type="text"
                    className="border border-default-300 rounded-md px-3 py-2"
                    value={componentState.iconRight || ""}
                    onChange={(e) => updateComponentState("iconRight", e.target.value)}
                    placeholder="e.g. lucide:arrow-right"
                  />
                  {componentState.iconRight && (
                    <div className="mt-2 flex items-center gap-2">
                      <span>Preview:</span>
                      <Icon icon={componentState.iconRight} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
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
                  placeholder="auto, 100%, 200px"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Height</label>
                <input
                  type="text"
                  className="border border-default-300 rounded-md px-3 py-2"
                  value={componentState.style.height || ""}
                  onChange={(e) => updateComponentStyle("height", e.target.value)}
                  placeholder="auto, 40px"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Padding X</label>
                <input
                  type="range"
                  min="0"
                  max="48"
                  step="1"
                  value={parseInt(componentState.style.paddingLeft) || 0}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateComponentStyle("paddingLeft", `${value}px`);
                    updateComponentStyle("paddingRight", `${value}px`);
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-default-500">
                  <span>0px</span>
                  <span>{parseInt(componentState.style.paddingLeft) || 0}px</span>
                  <span>48px</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Padding Y</label>
                <input
                  type="range"
                  min="0"
                  max="48"
                  step="1"
                  value={parseInt(componentState.style.paddingTop) || 0}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateComponentStyle("paddingTop", `${value}px`);
                    updateComponentStyle("paddingBottom", `${value}px`);
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-default-500">
                  <span>0px</span>
                  <span>{parseInt(componentState.style.paddingTop) || 0}px</span>
                  <span>48px</span>
                </div>
              </div>
            </div>
          </div>
        );
      case "effects":
        return (
          <AnimationPanel
            componentType={componentType}
            componentState={componentState}
            updateComponentState={updateComponentState}
          />
        );
      case "preview":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <PreviewPanel 
                componentType={componentType}
                componentState={componentState} 
                viewMode={viewMode} 
              />
            </div>
            <div>
              <CodePanel 
                componentType={componentType}
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
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <ButtonGroup>
            <Button
              size="sm"
              variant={componentType === "button" ? "solid" : "flat"}
              color={componentType === "button" ? "primary" : "default"}
              onPress={() => setComponentType("button")}
            >
              Button
            </Button>
            <Button
              size="sm"
              variant={componentType === "card" ? "solid" : "flat"}
              color={componentType === "card" ? "primary" : "default"}
              onPress={() => setComponentType("card")}
            >
              Card
            </Button>
          </ButtonGroup>
          
          {viewMode === "advanced" && (
            <Button
              size="sm"
              variant="flat"
              color="primary"
              startContent={<Icon icon="lucide:save" />}
              onPress={() => setShowSavePresetModal(true)}
            >
              Save Preset
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Tooltip content={layoutMode === "horizontal" ? "Switch to vertical layout" : "Switch to horizontal layout"}>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={() => setLayoutMode(layoutMode === "horizontal" ? "vertical" : "horizontal")}
            >
              <Icon icon={layoutMode === "horizontal" ? "lucide:layout-vertical" : "lucide:layout-horizontal"} />
            </Button>
          </Tooltip>
        </div>
      </div>
      
      <div className={`flex ${layoutMode === "horizontal" ? "flex-col lg:flex-row" : "flex-col"} gap-6 h-full`}>
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
      
      <SavePresetModal 
        isOpen={showSavePresetModal}
        onClose={() => setShowSavePresetModal(false)}
        componentState={componentState}
        componentType={componentType}
        onSavePreset={handleSavePreset}
        existingCategories={presetCategories}
      />
    </>
  );
};