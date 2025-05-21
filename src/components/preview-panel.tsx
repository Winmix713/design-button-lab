import React from "react";
import { Tabs, Tab, Button, Tooltip, Select, SelectItem, Switch } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ComponentState } from "../types/component-types";
import { ThreeDButtonPreview } from "./three-d-button-preview";
import { PreviewMode } from "./preview-mode";

interface PreviewPanelProps {
  componentType: "button" | "card";
  componentState: ComponentState;
  viewMode: "standard" | "advanced";
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ componentType, componentState, viewMode }) => {
  const [background, setBackground] = React.useState<string>("light");
  const [previewState, setPreviewState] = React.useState<string>("default");
  const [previewMode, setPreviewMode] = React.useState<"standard" | "3d" | "context">("standard");
  const [isEditMode, setIsEditMode] = React.useState<boolean>(false);

  // Toggle between edit and preview modes
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Only render if we have a valid componentState
  if (!componentState) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-default-500">Loading preview...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {previewMode === "standard" ? (
        <PreviewMode
          componentType={componentType}
          componentState={componentState}
          isEditMode={isEditMode}
          onToggleMode={toggleEditMode}
        />
      ) : previewMode === "3d" ? (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">3D Preview</h2>
            <div className="flex gap-2">
              <Select
                size="sm"
                selectedKeys={[previewMode]}
                onChange={(e) => setPreviewMode(e.target.value)}
                aria-label="Select preview mode"
              >
                <SelectItem key="standard" value="standard">Standard</SelectItem>
                <SelectItem key="3d" value="3d">3D View</SelectItem>
                <SelectItem key="context" value="context">In Context</SelectItem>
              </Select>
            </div>
          </div>
          
          <div className="flex-1 rounded-lg overflow-hidden border border-divider">
            <ThreeDButtonPreview buttonState={componentState} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Context Preview</h2>
            <div className="flex gap-2">
              <Select
                size="sm"
                selectedKeys={[previewMode]}
                onChange={(e) => setPreviewMode(e.target.value)}
                aria-label="Select preview mode"
              >
                <SelectItem key="standard" value="standard">Standard</SelectItem>
                <SelectItem key="3d" value="3d">3D View</SelectItem>
                <SelectItem key="context" value="context">In Context</SelectItem>
              </Select>
            </div>
          </div>
          
          <div className="flex-1 rounded-lg overflow-hidden border border-divider bg-content1 p-4">
            <div className="w-full h-full rounded-lg overflow-hidden relative">
              <img 
                src="https://img.heroui.chat/image/dashboard?w=800&h=500&u=context-preview" 
                alt="Context preview" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 right-6">
                {/* Render button here */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};