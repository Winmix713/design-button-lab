import React from "react";
import { Card, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface ResponsiveLayoutHelperProps {
  children: React.ReactNode;
  showControls?: boolean;
}

export const ResponsiveLayoutHelper: React.FC<ResponsiveLayoutHelperProps> = ({ 
  children, 
  showControls = true 
}) => {
  const [viewportSize, setViewportSize] = React.useState<"mobile" | "tablet" | "desktop" | "auto">("auto");
  
  const getMaxWidth = () => {
    switch (viewportSize) {
      case "mobile": return "max-w-[375px]";
      case "tablet": return "max-w-[768px]";
      case "desktop": return "max-w-[1280px]";
      default: return "";
    }
  };
  
  return (
    <div className="flex flex-col gap-4">
      {showControls && (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant={viewportSize === "mobile" ? "solid" : "flat"}
            color={viewportSize === "mobile" ? "primary" : "default"}
            isIconOnly
            onPress={() => setViewportSize("mobile")}
          >
            <Icon icon="lucide:smartphone" />
          </Button>
          <Button
            size="sm"
            variant={viewportSize === "tablet" ? "solid" : "flat"}
            color={viewportSize === "tablet" ? "primary" : "default"}
            isIconOnly
            onPress={() => setViewportSize("tablet")}
          >
            <Icon icon="lucide:tablet" />
          </Button>
          <Button
            size="sm"
            variant={viewportSize === "desktop" ? "solid" : "flat"}
            color={viewportSize === "desktop" ? "primary" : "default"}
            isIconOnly
            onPress={() => setViewportSize("desktop")}
          >
            <Icon icon="lucide:monitor" />
          </Button>
          <Button
            size="sm"
            variant={viewportSize === "auto" ? "solid" : "flat"}
            color={viewportSize === "auto" ? "primary" : "default"}
            isIconOnly
            onPress={() => setViewportSize("auto")}
          >
            <Icon icon="lucide:maximize" />
          </Button>
        </div>
      )}
      
      <div className={`mx-auto w-full transition-all duration-300 ${getMaxWidth()}`}>
        <Card className="border border-dashed border-default-300">
          <div className="p-4">
            {children}
          </div>
        </Card>
      </div>
      
      {viewportSize !== "auto" && showControls && (
        <div className="text-center text-xs text-default-500">
          Viewing at {viewportSize === "mobile" ? "375px" : viewportSize === "tablet" ? "768px" : "1280px"} width
        </div>
      )}
    </div>
  );
};