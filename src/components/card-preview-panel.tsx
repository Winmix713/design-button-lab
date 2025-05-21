import React from "react";
import { Button, Tooltip, Select, SelectItem, Card as HeroCard, CardBody, CardHeader, CardFooter } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ComponentState } from "../types/component-types";

interface CardPreviewPanelProps {
  componentState: ComponentState;
  viewMode: "standard" | "advanced";
}

export const CardPreviewPanel: React.FC<CardPreviewPanelProps> = ({ componentState, viewMode }) => {
  const [background, setBackground] = React.useState<string>("light");
  const [previewState, setPreviewState] = React.useState<string>("default");
  const [previewMode, setPreviewMode] = React.useState<"standard" | "3d" | "context">("standard");

  const getCardStyle = () => {
    const baseStyle = { ...componentState.style };
    
    if (previewState === "hover" && componentState.isHoverable) {
      return { ...baseStyle, ...componentState.hoverStyle };
    }
    
    if (previewState === "active" && componentState.isPressable) {
      return { 
        ...baseStyle, 
        transform: "scale(0.98)",
        ...componentState.activeStyle 
      };
    }
    
    return baseStyle;
  };

  const renderCardPreview = () => {
    const style = getCardStyle();
    
    // Handle special background types
    if (componentState.backgroundType === "gradient" && componentState.gradientFrom && componentState.gradientTo) {
      style.background = `linear-gradient(${componentState.gradientDirection === "to-r" ? "to right" : 
                                           componentState.gradientDirection === "to-l" ? "to left" : 
                                           componentState.gradientDirection === "to-b" ? "to bottom" : 
                                           componentState.gradientDirection === "to-t" ? "to top" : 
                                           componentState.gradientDirection === "to-tr" ? "to top right" : 
                                           "to bottom left"}, ${componentState.gradientFrom}, ${componentState.gradientTo})`;
    } else if (componentState.backgroundType === "image" && componentState.backgroundImage) {
      style.backgroundImage = `url(${componentState.backgroundImage})`;
      style.backgroundSize = componentState.backgroundSize || "cover";
      style.backgroundPosition = "center";
      style.position = "relative";
    }
    
    // Apply aspect ratio if specified
    if (componentState.aspectRatio && componentState.aspectRatio !== "auto") {
      style.aspectRatio = componentState.aspectRatio;
    }
    
    // Apply custom CSS filters
    if (componentState.filter && componentState.filter !== "none") {
      style.filter = componentState.filter;
    }
    
    return (
      <div className="relative" style={style}>
        {/* Overlay for image backgrounds */}
        {componentState.backgroundType === "image" && componentState.backgroundOverlay && (
          <div 
            className="absolute inset-0" 
            style={{ backgroundColor: componentState.backgroundOverlay }}
          ></div>
        )}
        
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
          
          {componentState.showImage && componentState.imagePosition === "bottom" && (
            <div className={`w-full ${componentState.imageHeight || "h-48"} overflow-hidden`}>
              <img 
                src={componentState.imageUrl || "https://img.heroui.chat/image/landscape?w=600&h=400&u=card-image"} 
                alt="Card image" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
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
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Card Preview</h2>
        <div className="flex gap-2">
          <Select
            size="sm"
            selectedKeys={[background]}
            onChange={(e) => setBackground(e.target.value)}
            aria-label="Select background"
          >
            <SelectItem key="light" value="light">Light Background</SelectItem>
            <SelectItem key="dark" value="dark">Dark Background</SelectItem>
            <SelectItem key="gradient" value="gradient">Gradient Background</SelectItem>
            <SelectItem key="image" value="image">Image Background</SelectItem>
          </Select>
          
          {viewMode === "advanced" && (
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
          )}
          
          <Tooltip content="View side by side comparison">
            <Button isIconOnly size="sm" variant="flat">
              <Icon icon="lucide:columns" />
            </Button>
          </Tooltip>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className={`flex-1 flex items-center justify-center rounded-lg transition-colors duration-300 ${
          background === "light" ? "bg-content1" : 
          background === "dark" ? "bg-content4" : 
          background === "gradient" ? "bg-gradient-to-r from-blue-500 to-purple-500" :
          "bg-[url('https://img.heroui.chat/image/landscape?w=800&h=400&u=preview-background')]"
        }`}>
          <div className="p-8 max-w-md w-full">
            {renderCardPreview()}
          </div>
        </div>
        
        {(componentState.isHoverable || componentState.isPressable) && (
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
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Responsive Preview</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Tooltip content="Mobile view">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => {}}
              >
                <Icon icon="lucide:smartphone" />
              </Button>
            </Tooltip>
            <Tooltip content="Tablet view">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => {}}
              >
                <Icon icon="lucide:tablet" />
              </Button>
            </Tooltip>
            <Tooltip content="Desktop view">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                onPress={() => {}}
              >
                <Icon icon="lucide:monitor" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};