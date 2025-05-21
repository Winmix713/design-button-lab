import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  Button, 
  ButtonGroup, 
  Tooltip, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
  Divider
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { ComponentState } from "../types/component-types";
import { ResponsiveLayoutHelper } from "./responsive-layout-helper";

interface PreviewModeProps {
  componentType: "button" | "card";
  componentState: ComponentState;
  isEditMode: boolean;
  onToggleMode: () => void;
}

export const PreviewMode: React.FC<PreviewModeProps> = ({ 
  componentType, 
  componentState, 
  isEditMode,
  onToggleMode
}) => {
  const [viewportSize, setViewportSize] = React.useState<"mobile" | "tablet" | "desktop" | "auto">("auto");
  const [background, setBackground] = React.useState<"light" | "dark" | "gradient" | "image">("light");
  const [previewState, setPreviewState] = React.useState<"default" | "hover" | "active">("default");
  const [showGrid, setShowGrid] = React.useState<boolean>(false);
  const [showRulers, setShowRulers] = React.useState<boolean>(false);
  const [showAnnotations, setShowAnnotations] = React.useState<boolean>(false);
  
  // Get component style based on current preview state
  const getComponentStyle = () => {
    const baseStyle = { ...componentState.style };
    
    if (previewState === "hover" && componentState.hoverStyle) {
      return { ...baseStyle, ...componentState.hoverStyle };
    }
    
    if (previewState === "active" && componentState.activeStyle) {
      return { 
        ...baseStyle, 
        transform: "scale(0.98)",
        ...componentState.activeStyle 
      };
    }
    
    return baseStyle;
  };

  // Render the component based on its type
  const renderComponent = () => {
    const style = getComponentStyle();
    
    if (componentType === "button") {
      return (
        <button
          className="relative"
          style={style}
        >
          {componentState.iconLeft && (
            <span className="inline-flex items-center mr-2">
              <Icon icon={componentState.iconLeft} />
            </span>
          )}
          {componentState.text || "Button"}
          {componentState.iconRight && (
            <span className="inline-flex items-center ml-2">
              <Icon icon={componentState.iconRight} />
            </span>
          )}
        </button>
      );
    } else if (componentType === "card") {
      return (
        <div className="relative" style={style}>
          {/* Card content based on layout */}
          <div className="relative z-10">
            {componentState.showHeader && (
              <div className="p-4 border-b border-divider">
                <h3 className="text-lg font-semibold">{componentState.headerTitle || "Card Title"}</h3>
                {componentState.headerSubtitle && (
                  <p className="text-small text-default-500">{componentState.headerSubtitle}</p>
                )}
              </div>
            )}
            
            {componentState.showImage && componentState.imagePosition === "top" && (
              <div className={`w-full ${componentState.imageHeight || "h-48"} overflow-hidden`}>
                <img 
                  src={componentState.imageUrl || "https://img.heroui.chat/image/landscape?w=600&h=400&u=card-image"} 
                  alt="Card image" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-4">
              {componentState.bodyContent || (
                <>
                  <p>This is a sample card body content. You can customize this text in the layout panel.</p>
                  <p className="mt-2">Add images, buttons, and other elements to create a complete card design.</p>
                </>
              )}
            </div>
            
            {componentState.showFooter && (
              <div className="p-4 border-t border-divider flex justify-between items-center">
                {componentState.footerContent || (
                  <>
                    <span className="text-small text-default-500">Last updated 3 mins ago</span>
                    <Button size="sm">Learn More</Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Get background class based on selected background
  const getBackgroundClass = () => {
    switch (background) {
      case "light": return "bg-content1";
      case "dark": return "bg-content4";
      case "gradient": return "bg-gradient-to-r from-blue-500 to-purple-500";
      case "image": return "bg-[url('https://img.heroui.chat/image/landscape?w=800&h=400&u=preview-background')]";
      default: return "bg-content1";
    }
  };

  // Get viewport size class
  const getViewportSizeClass = () => {
    switch (viewportSize) {
      case "mobile": return "max-w-[375px]";
      case "tablet": return "max-w-[768px]";
      case "desktop": return "max-w-[1280px]";
      default: return "";
    }
  };

  // Render grid overlay for design guidance
  const renderGrid = () => {
    if (!showGrid) return null;
    
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full grid grid-cols-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-full border-l border-r border-primary/10 first:border-l-0 last:border-r-0" />
          ))}
        </div>
      </div>
    );
  };

  // Render rulers for measurements
  const renderRulers = () => {
    if (!showRulers) return null;
    
    return (
      <>
        <div className="absolute top-0 left-0 w-full h-6 bg-default-100 border-b border-default-200 flex">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex-1 border-r border-default-200 text-[8px] text-default-500 flex items-end justify-center pb-0.5">
              {i * 50}
            </div>
          ))}
        </div>
        <div className="absolute top-0 left-0 h-full w-6 bg-default-100 border-r border-default-200 flex flex-col">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex-1 border-b border-default-200 text-[8px] text-default-500 flex items-center justify-end pr-0.5 writing-vertical">
              {i * 50}
            </div>
          ))}
        </div>
      </>
    );
  };

  // Render annotations for component details
  const renderAnnotations = () => {
    if (!showAnnotations) return null;
    
    const style = getComponentStyle();
    const annotations = [];
    
    // Push key style properties to annotations
    if (style.width) annotations.push(`Width: ${style.width}`);
    if (style.height) annotations.push(`Height: ${style.height}`);
    if (style.borderRadius) annotations.push(`Radius: ${style.borderRadius}`);
    if (style.backgroundColor) annotations.push(`BG: ${style.backgroundColor}`);
    if (style.color) annotations.push(`Color: ${style.color}`);
    
    return (
      <div className="absolute -top-12 left-0 flex flex-wrap gap-2">
        {annotations.map((annotation, i) => (
          <div key={i} className="bg-default-100 text-default-800 text-xs px-2 py-1 rounded-md">
            {annotation}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            {isEditMode ? "Edit Mode" : "Preview Mode"}
          </h2>
          <Tooltip content={isEditMode ? "Switch to Preview Mode" : "Switch to Edit Mode"}>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              color={isEditMode ? "default" : "primary"}
              onPress={onToggleMode}
              aria-label="Toggle edit mode"
            >
              <Icon icon={isEditMode ? "lucide:eye" : "lucide:edit-3"} />
            </Button>
          </Tooltip>
        </div>
        
        <div className="flex gap-2">
          <ButtonGroup size="sm">
            <Tooltip content="Mobile view">
              <Button
                isIconOnly
                variant={viewportSize === "mobile" ? "solid" : "flat"}
                color={viewportSize === "mobile" ? "primary" : "default"}
                onPress={() => setViewportSize("mobile")}
              >
                <Icon icon="lucide:smartphone" />
              </Button>
            </Tooltip>
            <Tooltip content="Tablet view">
              <Button
                isIconOnly
                variant={viewportSize === "tablet" ? "solid" : "flat"}
                color={viewportSize === "tablet" ? "primary" : "default"}
                onPress={() => setViewportSize("tablet")}
              >
                <Icon icon="lucide:tablet" />
              </Button>
            </Tooltip>
            <Tooltip content="Desktop view">
              <Button
                isIconOnly
                variant={viewportSize === "desktop" ? "solid" : "flat"}
                color={viewportSize === "desktop" ? "primary" : "default"}
                onPress={() => setViewportSize("desktop")}
              >
                <Icon icon="lucide:monitor" />
              </Button>
            </Tooltip>
            <Tooltip content="Auto/Full width">
              <Button
                isIconOnly
                variant={viewportSize === "auto" ? "solid" : "flat"}
                color={viewportSize === "auto" ? "primary" : "default"}
                onPress={() => setViewportSize("auto")}
              >
                <Icon icon="lucide:maximize" />
              </Button>
            </Tooltip>
          </ButtonGroup>
          
          <ButtonGroup size="sm">
            <Tooltip content="Light background">
              <Button
                isIconOnly
                variant={background === "light" ? "solid" : "flat"}
                color={background === "light" ? "primary" : "default"}
                onPress={() => setBackground("light")}
              >
                <Icon icon="lucide:sun" />
              </Button>
            </Tooltip>
            <Tooltip content="Dark background">
              <Button
                isIconOnly
                variant={background === "dark" ? "solid" : "flat"}
                color={background === "dark" ? "primary" : "default"}
                onPress={() => setBackground("dark")}
              >
                <Icon icon="lucide:moon" />
              </Button>
            </Tooltip>
            <Tooltip content="Gradient background">
              <Button
                isIconOnly
                variant={background === "gradient" ? "solid" : "flat"}
                color={background === "gradient" ? "primary" : "default"}
                onPress={() => setBackground("gradient")}
              >
                <Icon icon="lucide:palette" />
              </Button>
            </Tooltip>
            <Tooltip content="Image background">
              <Button
                isIconOnly
                variant={background === "image" ? "solid" : "flat"}
                color={background === "image" ? "primary" : "default"}
                onPress={() => setBackground("image")}
              >
                <Icon icon="lucide:image" />
              </Button>
            </Tooltip>
          </ButtonGroup>
          
          <Dropdown>
            <DropdownTrigger>
              <Button size="sm" variant="flat" startContent={<Icon icon="lucide:settings" />}>
                Options
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Preview options">
              <DropdownItem 
                key="grid" 
                startContent={<Icon icon={showGrid ? "lucide:check-square" : "lucide:square"} />}
                onPress={() => setShowGrid(!showGrid)}
              >
                Show Grid
              </DropdownItem>
              <DropdownItem 
                key="rulers" 
                startContent={<Icon icon={showRulers ? "lucide:check-square" : "lucide:square"} />}
                onPress={() => setShowRulers(!showRulers)}
              >
                Show Rulers
              </DropdownItem>
              <DropdownItem 
                key="annotations" 
                startContent={<Icon icon={showAnnotations ? "lucide:check-square" : "lucide:square"} />}
                onPress={() => setShowAnnotations(!showAnnotations)}
              >
                Show Annotations
              </DropdownItem>
              <DropdownItem key="divider">
                <Divider />
              </DropdownItem>
              <DropdownItem key="export" startContent={<Icon icon="lucide:download" />}>
                Export as Image
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${isEditMode ? "edit" : "preview"}-${background}-${viewportSize}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 relative"
          >
            {isEditMode ? (
              <div className="h-full flex flex-col">
                <div className="p-4 bg-default-50 border border-default-200 rounded-t-lg">
                  <h3 className="text-sm font-medium">Edit Component</h3>
                  <p className="text-xs text-default-500">Make changes to your component properties</p>
                </div>
                <div className="flex-1 border border-t-0 border-default-200 rounded-b-lg p-4 overflow-auto">
                  {/* This would be replaced with the actual edit form */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Component Text</label>
                      <input 
                        type="text" 
                        className="border border-default-300 rounded-md px-3 py-2"
                        value={componentState.text || ""}
                        onChange={(e) => {/* Update logic would go here */}}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Background Color</label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-md border border-default-300"
                          style={{ backgroundColor: componentState.style.backgroundColor }}
                        />
                        <input 
                          type="text" 
                          className="border border-default-300 rounded-md px-3 py-2 flex-1"
                          value={componentState.style.backgroundColor || ""}
                          onChange={(e) => {/* Update logic would go here */}}
                        />
                      </div>
                    </div>
                    
                    {/* More form fields would go here */}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`h-full relative ${showRulers ? "pt-6 pl-6" : ""}`}>
                {renderRulers()}
                
                <div className={`h-full flex items-center justify-center transition-colors duration-300 ${getBackgroundClass()} rounded-lg relative overflow-hidden`}>
                  {renderGrid()}
                  
                  <div className={`p-8 ${getViewportSizeClass()} relative`}>
                    {renderAnnotations()}
                    <div className="relative">
                      {renderComponent()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {!isEditMode && (componentState.isHoverable || componentState.isPressable) && (
          <div className="mt-4 flex justify-center">
            <div className="inline-flex rounded-md overflow-hidden">
              <Button
                className="rounded-r-none"
                variant={previewState === "default" ? "solid" : "flat"}
                color={previewState === "default" ? "primary" : "default"}
                onPress={() => setPreviewState("default")}
                size="sm"
              >
                Default
              </Button>
              {componentState.isHoverable && (
                <Button
                  className={componentState.isPressable ? "rounded-none border-x-0" : "rounded-l-none"}
                  variant={previewState === "hover" ? "solid" : "flat"}
                  color={previewState === "hover" ? "primary" : "default"}
                  onPress={() => setPreviewState("hover")}
                  size="sm"
                >
                  Hover
                </Button>
              )}
              {componentState.isPressable && (
                <Button
                  className="rounded-l-none"
                  variant={previewState === "active" ? "solid" : "flat"}
                  color={previewState === "active" ? "primary" : "default"}
                  onPress={() => setPreviewState("active")}
                  size="sm"
                >
                  Active
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .writing-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  );
};