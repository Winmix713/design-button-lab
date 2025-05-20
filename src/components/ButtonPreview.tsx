
import React from "react";
import { ArrowRight } from "lucide-react";
import { ButtonStyle } from "@/types/buttonTypes";
import { cn } from "@/lib/utils";

interface ButtonPreviewProps {
  buttonStyle: ButtonStyle;
}

export function ButtonPreview({ buttonStyle }: ButtonPreviewProps) {
  const {
    text,
    variant,
    shape,
    animation,
    textColor,
    backgroundColor,
    useGradient,
    gradient,
    gradientDirection,
    fontWeight,
    textAlign,
    iconName,
    iconPosition,
    iconSize,
    paddingX,
    paddingY,
    useShadow,
    shadow,
    border,
    opacity,
    useTransition,
    transitionDuration,
    disabled
  } = buttonStyle;

  const getGradientStyle = () => {
    if (!useGradient) return {};
    
    const gradientStops = gradient
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(", ");
    
    return {
      background: `linear-gradient(${gradientDirection}deg, ${gradientStops})`,
    };
  };

  const getShadowStyle = () => {
    if (!useShadow) return {};
    
    const { offsetX, offsetY, blur, spread, color, inset } = shadow;
    return {
      boxShadow: `${inset ? "inset " : ""}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`,
    };
  };

  const getAnimationStyle = () => {
    switch (animation) {
      case "pulse":
        return "animate-pulse";
      case "bounce":
        return "animate-bounce";
      case "shake":
        return "animate-shake";
      case "scale":
        return "";
      case "slideFade":
        return "hover:translate-x-1 transition-transform";
      default:
        return "";
    }
  };

  const getHoverScaleStyle = () => {
    if (buttonStyle.animation === "scale" && buttonStyle.hoverScale !== 1) {
      return `hover:scale-[${buttonStyle.hoverScale}]`;
    }
    return "";
  };

  const getTransitionStyle = () => {
    if (!useTransition) return "";
    return `transition-all duration-${transitionDuration}`;
  };
  
  const getBorderStyle = () => {
    const { width, style, color } = border;
    if (width === 0) return {};
    
    return {
      borderWidth: `${width}px`,
      borderStyle: style,
      borderColor: color
    };
  };

  const getShapeClass = () => {
    switch (shape) {
      case "square":
        return "rounded-none";
      case "rounded":
        return "rounded-md";
      case "pill":
        return "rounded-full";
      default:
        return "rounded-md";
    }
  };

  const getFontWeightClass = () => {
    switch (fontWeight) {
      case "normal":
        return "font-normal";
      case "medium":
        return "font-medium";
      case "semibold":
        return "font-semibold";
      case "bold":
        return "font-bold";
      default:
        return "font-medium";
    }
  };
  
  const getTextAlignClass = () => {
    switch (textAlign) {
      case "left":
        return "text-left";
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-center";
    }
  };

  const baseStyle = {
    color: textColor,
    backgroundColor: variant !== "glass" && !useGradient ? backgroundColor : undefined,
    opacity: opacity,
    padding: `${paddingY}px ${paddingX}px`,
    ...getBorderStyle(),
    ...getShadowStyle(),
    ...getGradientStyle(),
  };

  // Glass effect specific styles
  const getGlassStyles = () => {
    if (variant !== "glass") return {};
    
    return {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
    };
  };

  return (
    <div className="flex flex-col space-y-8">
      <div className="p-8 flex flex-col items-center justify-center gap-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <button
          className={cn(
            getShapeClass(),
            getFontWeightClass(),
            getTextAlignClass(),
            getAnimationStyle(),
            getHoverScaleStyle(),
            getTransitionStyle(),
            "inline-flex items-center justify-center",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{
            ...baseStyle,
            ...getGlassStyles(),
          }}
          disabled={disabled}
        >
          {iconPosition === "left" && iconName && (
            <ArrowRight size={iconSize} className="mr-2" />
          )}
          
          {text}
          
          {iconPosition === "right" && iconName && (
            <ArrowRight size={iconSize} className="ml-2" />
          )}
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Light Background</p>
            <div className="flex justify-center">
              <button
                className={cn(
                  getShapeClass(),
                  getFontWeightClass(),
                  getTextAlignClass(),
                  getAnimationStyle(),
                  getHoverScaleStyle(),
                  getTransitionStyle(),
                  "inline-flex items-center justify-center"
                )}
                style={baseStyle}
              >
                {iconPosition === "left" && iconName && (
                  <ArrowRight size={iconSize} className="mr-2" />
                )}
                
                {text}
                
                {iconPosition === "right" && iconName && (
                  <ArrowRight size={iconSize} className="ml-2" />
                )}
              </button>
            </div>
          </div>
          
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">Dark Background</p>
            <div className="flex justify-center">
              <button
                className={cn(
                  getShapeClass(),
                  getFontWeightClass(),
                  getTextAlignClass(),
                  getAnimationStyle(),
                  getHoverScaleStyle(),
                  getTransitionStyle(),
                  "inline-flex items-center justify-center"
                )}
                style={baseStyle}
              >
                {iconPosition === "left" && iconName && (
                  <ArrowRight size={iconSize} className="mr-2" />
                )}
                
                {text}
                
                {iconPosition === "right" && iconName && (
                  <ArrowRight size={iconSize} className="ml-2" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p>Hover over the button to see hover effects. Animation: {animation}</p>
        </div>
      </div>
    </div>
  );
}
