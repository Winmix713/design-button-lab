import React from "react";
import { 
  Slider, 
  Select, 
  SelectItem, 
  Input, 
  Checkbox, 
  Button,
  Card
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { ComponentState } from "../types/component-types";

interface AnimationPanelProps {
  componentType: "button" | "card";
  componentState: ComponentState;
  updateComponentState: (key: string, value: any) => void;
}

export const AnimationPanel: React.FC<AnimationPanelProps> = ({
  componentType,
  componentState,
  updateComponentState
}) => {
  const [animationType, setAnimationType] = React.useState<string>(componentState.animationType || "none");
  const [animationDuration, setAnimationDuration] = React.useState<number>(
    parseInt(componentState.style.transitionDuration) || 150
  );
  const [animationEasing, setAnimationEasing] = React.useState<string>(
    componentState.style.transitionTimingFunction || "cubic-bezier(0.4, 0, 0.2, 1)"
  );
  const [animationDelay, setAnimationDelay] = React.useState<number>(
    componentState.animationDelay || 0
  );
  const [animationDirection, setAnimationDirection] = React.useState<string>(
    componentState.animationDirection || "normal"
  );
  const [animationIterationCount, setAnimationIterationCount] = React.useState<string>(
    componentState.animationIterationCount || "1"
  );
  const [animationFillMode, setAnimationFillMode] = React.useState<string>(
    componentState.animationFillMode || "none"
  );
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  // Apply animation settings to component state
  const applyAnimationSettings = () => {
    updateComponentState("animationType", animationType);
    updateComponentState("animationDelay", animationDelay);
    updateComponentState("animationDirection", animationDirection);
    updateComponentState("animationIterationCount", animationIterationCount);
    updateComponentState("animationFillMode", animationFillMode);
    
    // Update style properties
    updateComponentState("style", {
      ...componentState.style,
      transitionDuration: `${animationDuration}ms`,
      transitionTimingFunction: animationEasing
    });
    
    // Generate custom CSS for animations
    let customCSS = componentState.customCSS || "";
    
    if (animationType !== "none") {
      const keyframesName = `${animationType}Animation`;
      
      // Remove any existing animation CSS
      customCSS = customCSS.replace(/\s*@keyframes\s+\w+Animation\s*\{[\s\S]*?\}\s*/g, "");
      customCSS = customCSS.replace(/\s*animation:[\s\S]*?;\s*/g, "");
      
      // Add new animation CSS
      let keyframes = "";
      let animationProperty = "";
      
      switch (animationType) {
        case "fade":
          keyframes = `@keyframes ${keyframesName} {
  from { opacity: 0; }
  to { opacity: 1; }
}`;
          animationProperty = `animation: ${keyframesName} ${animationDuration}ms ${animationEasing} ${animationDelay}ms ${animationIterationCount} ${animationDirection} ${animationFillMode};`;
          break;
        case "scale":
          keyframes = `@keyframes ${keyframesName} {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}`;
          animationProperty = `animation: ${keyframesName} ${animationDuration}ms ${animationEasing} ${animationDelay}ms ${animationIterationCount} ${animationDirection} ${animationFillMode};`;
          break;
        case "slide-up":
          keyframes = `@keyframes ${keyframesName} {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}`;
          animationProperty = `animation: ${keyframesName} ${animationDuration}ms ${animationEasing} ${animationDelay}ms ${animationIterationCount} ${animationDirection} ${animationFillMode};`;
          break;
        case "slide-down":
          keyframes = `@keyframes ${keyframesName} {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}`;
          animationProperty = `animation: ${keyframesName} ${animationDuration}ms ${animationEasing} ${animationDelay}ms ${animationIterationCount} ${animationDirection} ${animationFillMode};`;
          break;
        case "slide-left":
          keyframes = `@keyframes ${keyframesName} {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}`;
          animationProperty = `animation: ${keyframesName} ${animationDuration}ms ${animationEasing} ${animationDelay}ms ${animationIterationCount} ${animationDirection} ${animationFillMode};`;
          break;
        case "slide-right":
          keyframes = `@keyframes ${keyframesName} {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}`;
          animationProperty = `animation: ${keyframesName} ${animationDuration}ms ${animationEasing} ${animationDelay}ms ${animationIterationCount} ${animationDirection} ${animationFillMode};`;
          break;
        case "rotate":
          keyframes = `@keyframes ${keyframesName} {
  from { transform: rotate(-90deg); opacity: 0; }
  to { transform: rotate(0); opacity: 1; }
}`;
          animationProperty = `animation: ${keyframesName} ${animationDuration}ms ${animationEasing} ${animationDelay}ms ${animationIterationCount} ${animationDirection} ${animationFillMode};`;
          break;
        case "bounce":
          keyframes = `@keyframes ${keyframesName} {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
}`;
          animationProperty = `animation: ${keyframesName} ${animationDuration}ms ${animationEasing} ${animationDelay}ms ${animationIterationCount} ${animationDirection} ${animationFillMode};`;
          break;
        case "pulse":
          keyframes = `@keyframes ${keyframesName} {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}`;
          animationProperty = `animation: ${keyframesName} ${animationDuration}ms ${animationEasing} ${animationDelay}ms ${animationIterationCount} ${animationDirection} ${animationFillMode};`;
          break;
        case "shake":
          keyframes = `@keyframes ${keyframesName} {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}`;
          animationProperty = `animation: ${keyframesName} ${animationDuration}ms ${animationEasing} ${animationDelay}ms ${animationIterationCount} ${animationDirection} ${animationFillMode};`;
          break;
      }
      
      customCSS = `${keyframes}\n${animationProperty}\n${customCSS}`;
    }
    
    updateComponentState("customCSS", customCSS);
  };

  // Preview animation
  const previewAnimation = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), animationDuration + animationDelay + 100);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Animation Settings</h2>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="flat"
            color="primary"
            startContent={<Icon icon="lucide:play" />}
            onPress={previewAnimation}
          >
            Preview
          </Button>
          <Button
            size="sm"
            color="primary"
            onPress={applyAnimationSettings}
          >
            Apply
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-small mb-1">Animation Type</p>
            <Select
              selectedKeys={[animationType]}
              onChange={(e) => setAnimationType(e.target.value)}
              size="sm"
            >
              <SelectItem key="none" value="none">None</SelectItem>
              <SelectItem key="fade" value="fade">Fade In</SelectItem>
              <SelectItem key="scale" value="scale">Scale</SelectItem>
              <SelectItem key="slide-up" value="slide-up">Slide Up</SelectItem>
              <SelectItem key="slide-down" value="slide-down">Slide Down</SelectItem>
              <SelectItem key="slide-left" value="slide-left">Slide Left</SelectItem>
              <SelectItem key="slide-right" value="slide-right">Slide Right</SelectItem>
              <SelectItem key="rotate" value="rotate">Rotate</SelectItem>
              <SelectItem key="bounce" value="bounce">Bounce</SelectItem>
              <SelectItem key="pulse" value="pulse">Pulse</SelectItem>
              <SelectItem key="shake" value="shake">Shake</SelectItem>
            </Select>
          </div>
          
          <div>
            <p className="text-small mb-1">Duration: {animationDuration}ms</p>
            <Slider
              size="sm"
              step={50}
              minValue={0}
              maxValue={2000}
              value={animationDuration}
              onChange={(value) => setAnimationDuration(value)}
              className="max-w-md"
            />
          </div>
          
          <div>
            <p className="text-small mb-1">Delay: {animationDelay}ms</p>
            <Slider
              size="sm"
              step={50}
              minValue={0}
              maxValue={1000}
              value={animationDelay}
              onChange={(value) => setAnimationDelay(value)}
              className="max-w-md"
            />
          </div>
          
          <div>
            <p className="text-small mb-1">Easing Function</p>
            <Select
              selectedKeys={[animationEasing]}
              onChange={(e) => setAnimationEasing(e.target.value)}
              size="sm"
            >
              <SelectItem key="linear" value="linear">Linear</SelectItem>
              <SelectItem key="ease" value="ease">Ease</SelectItem>
              <SelectItem key="ease-in" value="ease-in">Ease In</SelectItem>
              <SelectItem key="ease-out" value="ease-out">Ease Out</SelectItem>
              <SelectItem key="ease-in-out" value="ease-in-out">Ease In Out</SelectItem>
              <SelectItem key="cubic-bezier(0.4, 0, 0.2, 1)" value="cubic-bezier(0.4, 0, 0.2, 1)">Default</SelectItem>
              <SelectItem key="cubic-bezier(0.16, 1, 0.3, 1)" value="cubic-bezier(0.16, 1, 0.3, 1)">Expo Out</SelectItem>
              <SelectItem key="cubic-bezier(0.34, 1.56, 0.64, 1)" value="cubic-bezier(0.34, 1.56, 0.64, 1)">Back Out</SelectItem>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-small mb-1">Direction</p>
            <Select
              selectedKeys={[animationDirection]}
              onChange={(e) => setAnimationDirection(e.target.value)}
              size="sm"
            >
              <SelectItem key="normal" value="normal">Normal</SelectItem>
              <SelectItem key="reverse" value="reverse">Reverse</SelectItem>
              <SelectItem key="alternate" value="alternate">Alternate</SelectItem>
              <SelectItem key="alternate-reverse" value="alternate-reverse">Alternate Reverse</SelectItem>
            </Select>
          </div>
          
          <div>
            <p className="text-small mb-1">Iteration Count</p>
            <Select
              selectedKeys={[animationIterationCount]}
              onChange={(e) => setAnimationIterationCount(e.target.value)}
              size="sm"
            >
              <SelectItem key="1" value="1">1</SelectItem>
              <SelectItem key="2" value="2">2</SelectItem>
              <SelectItem key="3" value="3">3</SelectItem>
              <SelectItem key="infinite" value="infinite">Infinite</SelectItem>
            </Select>
          </div>
          
          <div>
            <p className="text-small mb-1">Fill Mode</p>
            <Select
              selectedKeys={[animationFillMode]}
              onChange={(e) => setAnimationFillMode(e.target.value)}
              size="sm"
            >
              <SelectItem key="none" value="none">None</SelectItem>
              <SelectItem key="forwards" value="forwards">Forwards</SelectItem>
              <SelectItem key="backwards" value="backwards">Backwards</SelectItem>
              <SelectItem key="both" value="both">Both</SelectItem>
            </Select>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Checkbox
              isSelected={componentState.reduceMotion}
              onValueChange={(isSelected) => updateComponentState("reduceMotion", isSelected)}
              size="sm"
            >
              Respect reduced motion settings
            </Checkbox>
            <Tooltip content="Disables animations for users who prefer reduced motion">
              <span className="text-default-400 cursor-help">
                <Icon icon="lucide:info" size={16} />
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-medium font-medium mb-2">Animation Preview</h3>
        <div className="border border-divider rounded-lg p-8 flex items-center justify-center bg-content1 min-h-[200px]">
          <div className={isPlaying ? "animate-preview" : ""}>
            {componentType === "button" ? (
              <button
                style={{
                  ...componentState.style,
                  animation: isPlaying ? `${animationType}Animation ${animationDuration}ms ${animationEasing} ${animationDelay}ms ${animationIterationCount} ${animationDirection} ${animationFillMode}` : "none"
                }}
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
            ) : (
              <Card
                style={{
                  ...componentState.style,
                  animation: isPlaying ? `${animationType}Animation ${animationDuration}ms ${animationEasing} ${animationDelay}ms ${animationIterationCount} ${animationDirection} ${animationFillMode}` : "none"
                }}
              >
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{componentState.headerTitle || "Card Title"}</h3>
                  <p>{componentState.bodyContent || "Card content"}</p>
                </div>
              </Card>
            )}
          </div>
        </div>
        
        <style jsx>{`
          @keyframes fadeAnimation {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes scaleAnimation {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          
          @keyframes slide-upAnimation {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes slide-downAnimation {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes slide-leftAnimation {
            from { transform: translateX(20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes slide-rightAnimation {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes rotateAnimation {
            from { transform: rotate(-90deg); opacity: 0; }
            to { transform: rotate(0); opacity: 1; }
          }
          
          @keyframes bounceAnimation {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
          }
          
          @keyframes pulseAnimation {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          @keyframes shakeAnimation {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
        `}</style>
      </div>
    </div>
  );
};