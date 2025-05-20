
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ButtonStyle, ExportFormat } from "@/types/buttonTypes";
import { CustomAnimation, generateAnimationCSS } from "@/lib/animations";

interface EnhancedExportOptionsProps {
  buttonStyle: ButtonStyle;
  customAnimation?: CustomAnimation;
}

export function EnhancedExportOptions({ buttonStyle, customAnimation }: EnhancedExportOptionsProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>("css");
  const { toast } = useToast();

  // Common function to generate CSS for the button
  const generateBaseCssCode = (): string => {
    const {
      textColor,
      backgroundColor,
      useGradient,
      gradient,
      gradientDirection,
      fontWeight,
      textAlign,
      paddingX,
      paddingY,
      useShadow,
      shadow,
      border,
      hoverScale,
      opacity,
      shape,
      useTransition,
      transitionDuration,
      animation,
      borderRadius
    } = buttonStyle;

    let code = `.custom-button {\n`;
    code += `  display: inline-flex;\n`;
    code += `  align-items: center;\n`;
    code += `  justify-content: center;\n`;
    code += `  color: ${textColor};\n`;
    
    if (!useGradient) {
      code += `  background-color: ${backgroundColor};\n`;
    } else {
      const gradientStops = gradient
        .map(stop => `${stop.color} ${stop.position}%`)
        .join(", ");
      code += `  background: linear-gradient(${gradientDirection}deg, ${gradientStops});\n`;
    }
    
    if (opacity !== 1) {
      code += `  opacity: ${opacity};\n`;
    }
    
    if (borderRadius) {
      code += `  border-radius: ${borderRadius};\n`;
    } else {
      switch (shape) {
        case "square":
          code += `  border-radius: 0;\n`;
          break;
        case "rounded":
          code += `  border-radius: 0.375rem;\n`;
          break;
        case "pill":
          code += `  border-radius: 9999px;\n`;
          break;
      }
    }
    
    code += `  padding: ${paddingY}px ${paddingX}px;\n`;
    
    if (border.width > 0) {
      code += `  border: ${border.width}px ${border.style} ${border.color};\n`;
    }
    
    if (useShadow) {
      const { offsetX, offsetY, blur, spread, color, inset } = shadow;
      code += `  box-shadow: ${inset ? "inset " : ""}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color};\n`;
    }
    
    switch (fontWeight) {
      case "normal":
        code += `  font-weight: 400;\n`;
        break;
      case "medium":
        code += `  font-weight: 500;\n`;
        break;
      case "semibold":
        code += `  font-weight: 600;\n`;
        break;
      case "bold":
        code += `  font-weight: 700;\n`;
        break;
    }
    
    if (textAlign !== "center") {
      code += `  text-align: ${textAlign};\n`;
    }
    
    if (useTransition) {
      if (animation === "scale") {
        code += `  transition: all ${transitionDuration}ms, transform ${transitionDuration}ms;\n`;
      } else {
        code += `  transition: all ${transitionDuration}ms;\n`;
      }
    }
    
    if (animation === "custom" && customAnimation) {
      code += `  animation: ${customAnimation.name} ${customAnimation.duration}ms ${customAnimation.easing} ${customAnimation.iterationCount} ${customAnimation.direction};\n`;
    } else {
      switch (animation) {
        case "pulse":
          code += `  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n`;
          break;
        case "bounce":
          code += `  animation: bounce 1s infinite;\n`;
          break;
        case "shake":
          code += `  animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) infinite;\n`;
          break;
      }
    }
    
    code += `}\n\n`;
    
    // Hover state
    code += `.custom-button:hover {\n`;
    if (animation === "scale" && hoverScale !== 1) {
      code += `  transform: scale(${hoverScale});\n`;
    }
    if (!useGradient) {
      code += `  background-color: ${buttonStyle.hoverBackgroundColor};\n`;
    }
    if (buttonStyle.textColor !== buttonStyle.textHoverColor) {
      code += `  color: ${buttonStyle.textHoverColor};\n`;
    }
    code += `}\n\n`;
    
    // Disabled state
    code += `.custom-button:disabled {\n`;
    code += `  opacity: 0.5;\n`;
    code += `  cursor: not-allowed;\n`;
    code += `}\n\n`;
    
    // Add animations if needed
    if (animation === "custom" && customAnimation) {
      code += generateAnimationCSS(customAnimation);
    } else {
      if (animation === "pulse") {
        code += `@keyframes pulse {\n`;
        code += `  0%, 100% {\n`;
        code += `    opacity: 1;\n`;
        code += `  }\n`;
        code += `  50% {\n`;
        code += `    opacity: 0.7;\n`;
        code += `  }\n`;
        code += `}\n\n`;
      } else if (animation === "bounce") {
        code += `@keyframes bounce {\n`;
        code += `  0%, 100% {\n`;
        code += `    transform: translateY(0);\n`;
        code += `  }\n`;
        code += `  50% {\n`;
        code += `    transform: translateY(-10px);\n`;
        code += `  }\n`;
        code += `}\n\n`;
      } else if (animation === "shake") {
        code += `@keyframes shake {\n`;
        code += `  10%, 90% {\n`;
        code += `    transform: translate3d(-1px, 0, 0);\n`;
        code += `  }\n`;
        code += `  20%, 80% {\n`;
        code += `    transform: translate3d(2px, 0, 0);\n`;
        code += `  }\n`;
        code += `  30%, 50%, 70% {\n`;
        code += `    transform: translate3d(-4px, 0, 0);\n`;
        code += `  }\n`;
        code += `  40%, 60% {\n`;
        code += `    transform: translate3d(4px, 0, 0);\n`;
        code += `  }\n`;
        code += `}\n`;
      }
    }
    
    return code;
  };

  // Generate HTML code
  const generateHTMLCode = (): string => {
    const { text, iconPosition, disabled } = buttonStyle;
    
    let code = `<button class="custom-button"${disabled ? ' disabled' : ''}>\n`;
    
    if (iconPosition === "left") {
      code += `  <svg class="icon mr-2" width="${buttonStyle.iconSize}" height="${buttonStyle.iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>\n`;
    }
    
    code += `  ${text}\n`;
    
    if (iconPosition === "right") {
      code += `  <svg class="icon ml-2" width="${buttonStyle.iconSize}" height="${buttonStyle.iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>\n`;
    }
    
    code += `</button>`;
    
    // Add needed CSS
    code += `\n\n<!-- Include this CSS -->\n<style>\n${generateBaseCssCode()}</style>`;
    
    return code;
  };

  // Generate Tailwind code
  const generateTailwindCode = (): string => {
    const {
      textColor,
      backgroundColor,
      useGradient,
      shape,
      borderRadius,
      fontWeight,
      textAlign,
      paddingX,
      paddingY,
      useShadow,
      shadow,
      border,
      animation,
      useTransition,
      opacity,
      disabled
    } = buttonStyle;
    
    // Convert various styles to Tailwind classes
    const getShapeClass = () => {
      if (borderRadius) {
        return `rounded-[${borderRadius}]`;
      }
      
      switch (shape) {
        case "square": return "rounded-none";
        case "rounded": return "rounded-md";
        case "pill": return "rounded-full";
        default: return "rounded-md";
      }
    };
    
    const getFontWeightClass = () => {
      switch (fontWeight) {
        case "normal": return "font-normal";
        case "medium": return "font-medium";
        case "semibold": return "font-semibold";
        case "bold": return "font-bold";
        default: return "font-medium";
      }
    };
    
    const getTextAlignClass = () => {
      switch (textAlign) {
        case "left": return "text-left";
        case "center": return "text-center";
        case "right": return "text-right";
        default: return "text-center";
      }
    };
    
    const getPaddingClass = () => {
      // This is a rough estimation, not exact mapping
      const xClass = paddingX <= 4 ? "px-1" : 
                     paddingX <= 8 ? "px-2" : 
                     paddingX <= 12 ? "px-3" : 
                     paddingX <= 16 ? "px-4" : 
                     paddingX <= 20 ? "px-5" : 
                     paddingX <= 24 ? "px-6" : 
                     paddingX <= 32 ? "px-8" : "px-10";
      
      const yClass = paddingY <= 2 ? "py-0.5" : 
                     paddingY <= 4 ? "py-1" : 
                     paddingY <= 6 ? "py-1.5" : 
                     paddingY <= 8 ? "py-2" : 
                     paddingY <= 10 ? "py-2.5" : 
                     paddingY <= 12 ? "py-3" : 
                     paddingY <= 16 ? "py-4" : "py-5";
      
      return `${xClass} ${yClass}`;
    };
    
    const getOpacityClass = () => {
      if (opacity === 1) return "";
      const opacityValue = Math.round(opacity * 100);
      return `opacity-${opacityValue}`;
    };
    
    const getTransitionClass = () => {
      return useTransition ? "transition-all duration-300" : "";
    };
    
    const getAnimationClass = () => {
      switch (animation) {
        case "pulse": return "animate-pulse";
        case "bounce": return "animate-bounce";
        case "scale": return "hover:scale-110";
        case "custom": return "animation-custom";
        default: return "";
      }
    };
    
    let classes = [
      "inline-flex items-center justify-center",
      getFontWeightClass(),
      getTextAlignClass(),
      getShapeClass(),
      getPaddingClass(),
      getTransitionClass(),
      getAnimationClass(),
      getOpacityClass(),
    ];
    
    // Add color classes - note this is an approximation
    // For proper color, you'd need to use customized Tailwind config
    const colorClass = useGradient 
      ? "bg-gradient-to-r from-blue-500 to-blue-600" 
      : `bg-blue-500 hover:bg-blue-600 text-white`;
    
    classes.push(colorClass);
    
    // Shadow classes
    if (useShadow) {
      const shadowIntensity = shadow.blur;
      const shadowClass = shadowIntensity < 10 ? "shadow-sm" : 
                          shadowIntensity < 20 ? "shadow" : 
                          shadowIntensity < 30 ? "shadow-md" : "shadow-lg";
      classes.push(shadowClass);
    }
    
    // Border classes
    if (border.width > 0) {
      const borderWidth = border.width <= 1 ? "border" : 
                         border.width <= 2 ? "border-2" : 
                         border.width <= 4 ? "border-4" : "border-8";
      
      const borderStyle = border.style === "solid" ? "" : 
                         border.style === "dashed" ? "border-dashed" : 
                         border.style === "dotted" ? "border-dotted" : 
                         border.style === "double" ? "border-double" : "";
      
      classes.push(borderWidth, borderStyle);
    }
    
    // Focus classes
    classes.push("focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50");
    
    // Disabled classes
    if (disabled) {
      classes.push("disabled:opacity-50 disabled:cursor-not-allowed");
    }
    
    // Generate the React component with Tailwind classes
    const { text, iconPosition } = buttonStyle;
    
    let code = `<button\n`;
    code += `  className="${classes.filter(Boolean).join(' ')}"\n`;
    
    if (disabled) {
      code += `  disabled\n`;
    }
    
    code += `>\n`;
    
    if (iconPosition === "left") {
      code += `  <svg className="mr-2 h-${Math.round(buttonStyle.iconSize / 4)} w-${Math.round(buttonStyle.iconSize / 4)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>\n`;
    }
    
    code += `  ${text}\n`;
    
    if (iconPosition === "right") {
      code += `  <svg className="ml-2 h-${Math.round(buttonStyle.iconSize / 4)} w-${Math.round(buttonStyle.iconSize / 4)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>\n`;
    }
    
    code += `</button>`;
    
    // Add note about custom animation if used
    if (animation === "custom" && customAnimation) {
      code += `\n\n{/* Add this to your CSS or Tailwind config */}\n`;
      code += `{/* ${generateAnimationCSS(customAnimation).split('\n').join('\n   ')} */}`;
    }
    
    return code;
  };

  // Generate React code
  const generateReactCode = (): string => {
    const {
      text,
      backgroundColor,
      textColor,
      useGradient,
      gradient,
      gradientDirection,
      shape,
      borderRadius,
      fontWeight,
      textAlign,
      paddingX,
      paddingY,
      useShadow,
      shadow,
      border,
      opacity,
      hoverScale,
      animation,
      useTransition,
      transitionDuration,
      disabled,
      iconPosition,
      iconSize
    } = buttonStyle;
    
    let code = `import React from 'react';\n\n`;
    
    // Add custom animation if needed
    if (animation === "custom" && customAnimation) {
      code += `// Animation keyframes\n`;
      code += `const keyframes = {\n`;
      code += `  ${customAnimation.name}: {\n`;
      
      customAnimation.keyframes.forEach(keyframe => {
        code += `    "${keyframe.percent}%": {\n`;
        Object.entries(keyframe.properties).forEach(([key, value]) => {
          code += `      ${key}: "${value}",\n`;
        });
        code += `    },\n`;
      });
      
      code += `  },\n`;
      code += `};\n\n`;
    }
    
    code += `const CustomButton = ({ onClick }) => {\n`;
    
    // Generate styles
    code += `  const buttonStyle = {\n`;
    code += `    display: 'inline-flex',\n`;
    code += `    alignItems: 'center',\n`;
    code += `    justifyContent: 'center',\n`;
    code += `    color: '${textColor}',\n`;
    
    if (!useGradient) {
      code += `    backgroundColor: '${backgroundColor}',\n`;
    } else {
      const gradientStops = gradient
        .map(stop => `${stop.color} ${stop.position}%`)
        .join(", ");
      code += `    background: 'linear-gradient(${gradientDirection}deg, ${gradientStops})',\n`;
    }
    
    if (opacity !== 1) {
      code += `    opacity: ${opacity},\n`;
    }
    
    if (borderRadius) {
      code += `    borderRadius: '${borderRadius}',\n`;
    } else {
      switch (shape) {
        case "square":
          code += `    borderRadius: '0',\n`;
          break;
        case "rounded":
          code += `    borderRadius: '0.375rem',\n`;
          break;
        case "pill":
          code += `    borderRadius: '9999px',\n`;
          break;
      }
    }
    
    code += `    padding: '${paddingY}px ${paddingX}px',\n`;
    
    if (border.width > 0) {
      code += `    border: '${border.width}px ${border.style} ${border.color}',\n`;
    }
    
    if (useShadow) {
      const { offsetX, offsetY, blur, spread, color, inset } = shadow;
      code += `    boxShadow: '${inset ? "inset " : ""}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}',\n`;
    }
    
    switch (fontWeight) {
      case "normal":
        code += `    fontWeight: 400,\n`;
        break;
      case "medium":
        code += `    fontWeight: 500,\n`;
        break;
      case "semibold":
        code += `    fontWeight: 600,\n`;
        break;
      case "bold":
        code += `    fontWeight: 700,\n`;
        break;
    }
    
    code += `    textAlign: '${textAlign}',\n`;
    
    if (useTransition) {
      code += `    transition: 'all ${transitionDuration}ms',\n`;
    }
    
    if (animation === "custom" && customAnimation) {
      const easingFunction = customAnimation.easing === 'cubic-bezier' && customAnimation.cubicBezier
        ? `cubic-bezier(${customAnimation.cubicBezier.join(', ')})`
        : customAnimation.easing;
        
      code += `    animation: '${customAnimation.name} ${customAnimation.duration}ms ${easingFunction} ${customAnimation.iterationCount} ${customAnimation.direction}',\n`;
    }
    
    code += `    cursor: '${disabled ? 'not-allowed' : 'pointer'}',\n`;
    code += `  };\n\n`;
    
    // Hover style
    code += `  const hoverStyle = {\n`;
    if (animation === "scale") {
      code += `    transform: 'scale(${hoverScale})',\n`;
    }
    if (!useGradient) {
      code += `    backgroundColor: '${buttonStyle.hoverBackgroundColor}',\n`;
    }
    if (buttonStyle.textColor !== buttonStyle.textHoverColor) {
      code += `    color: '${buttonStyle.textHoverColor}',\n`;
    }
    code += `  };\n\n`;
    
    // Add animation if needed
    if (animation !== "none" && animation !== "scale" && animation !== "custom") {
      code += `  const getAnimationStyle = () => {\n`;
      code += `    switch('${animation}') {\n`;
      code += `      case 'pulse':\n`;
      code += `        return {\n`;
      code += `          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',\n`;
      code += `        };\n`;
      code += `      case 'bounce':\n`;
      code += `        return {\n`;
      code += `          animation: 'bounce 1s infinite',\n`;
      code += `        };\n`;
      code += `      case 'shake':\n`;
      code += `        return {\n`;
      code += `          animation: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) infinite',\n`;
      code += `        };\n`;
      code += `      default:\n`;
      code += `        return {};\n`;
      code += `    }\n`;
      code += `  };\n\n`;
    }
    
    // Component return
    code += `  return (\n`;
    code += `    <button\n`;
    code += `      style={buttonStyle}\n`;
    code += `      onMouseEnter={(e) => {\n`;
    code += `        Object.assign(e.target.style, hoverStyle);\n`;
    code += `      }}\n`;
    code += `      onMouseLeave={(e) => {\n`;
    code += `        Object.assign(e.target.style, buttonStyle);\n`;
    code += `      }}\n`;
    code += `      onClick={onClick}\n`;
    
    if (disabled) {
      code += `      disabled\n`;
    }
    
    code += `    >\n`;
    
    if (iconPosition === "left") {
      code += `      <svg \n`;
      code += `        style={{ marginRight: '8px' }}\n`;
      code += `        width="${iconSize}"\n`;
      code += `        height="${iconSize}"\n`;
      code += `        viewBox="0 0 24 24"\n`;
      code += `        fill="none"\n`;
      code += `        stroke="currentColor"\n`;
      code += `        strokeWidth="2"\n`;
      code += `        strokeLinecap="round"\n`;
      code += `        strokeLinejoin="round"\n`;
      code += `      >\n`;
      code += `        <path d="M5 12h14M12 5l7 7-7 7"/>\n`;
      code += `      </svg>\n`;
    }
    
    code += `      ${text}\n`;
    
    if (iconPosition === "right") {
      code += `      <svg\n`;
      code += `        style={{ marginLeft: '8px' }}\n`;
      code += `        width="${iconSize}"\n`;
      code += `        height="${iconSize}"\n`;
      code += `        viewBox="0 0 24 24"\n`;
      code += `        fill="none"\n`;
      code += `        stroke="currentColor"\n`;
      code += `        strokeWidth="2"\n`;
      code += `        strokeLinecap="round"\n`;
      code += `        strokeLinejoin="round"\n`;
      code += `      >\n`;
      code += `        <path d="M5 12h14M12 5l7 7-7 7"/>\n`;
      code += `      </svg>\n`;
    }
    
    code += `    </button>\n`;
    code += `  );\n`;
    code += `};\n\n`;
    code += `export default CustomButton;`;
    
    return code;
  };

  // Generate Vue code
  const generateVueCode = (): string => {
    const {
      text,
      backgroundColor,
      textColor,
      useGradient,
      gradient,
      gradientDirection,
      shape,
      borderRadius,
      fontWeight,
      textAlign,
      paddingX,
      paddingY,
      useShadow,
      shadow,
      border,
      opacity,
      hoverScale,
      animation,
      useTransition,
      transitionDuration,
      disabled,
      iconPosition,
      iconSize
    } = buttonStyle;
    
    let code = `<template>\n`;
    code += `  <button\n`;
    code += `    :class="['custom-button']"\n`;
    code += `    :disabled="${disabled}"\n`;
    code += `    @click="onClick"\n`;
    code += `  >\n`;
    
    if (iconPosition === "left") {
      code += `    <svg\n`;
      code += `      class="mr-2"\n`;
      code += `      :width="${iconSize}"\n`;
      code += `      :height="${iconSize}"\n`;
      code += `      viewBox="0 0 24 24"\n`;
      code += `      fill="none"\n`;
      code += `      stroke="currentColor"\n`;
      code += `      stroke-width="2"\n`;
      code += `      stroke-linecap="round"\n`;
      code += `      stroke-linejoin="round"\n`;
      code += `    >\n`;
      code += `      <path d="M5 12h14M12 5l7 7-7 7" />\n`;
      code += `    </svg>\n`;
    }
    
    code += `    ${text}\n`;
    
    if (iconPosition === "right") {
      code += `    <svg\n`;
      code += `      class="ml-2"\n`;
      code += `      :width="${iconSize}"\n`;
      code += `      :height="${iconSize}"\n`;
      code += `      viewBox="0 0 24 24"\n`;
      code += `      fill="none"\n`;
      code += `      stroke="currentColor"\n`;
      code += `      stroke-width="2"\n`;
      code += `      stroke-linecap="round"\n`;
      code += `      stroke-linejoin="round"\n`;
      code += `    >\n`;
      code += `      <path d="M5 12h14M12 5l7 7-7 7" />\n`;
      code += `    </svg>\n`;
    }
    
    code += `  </button>\n`;
    code += `</template>\n\n`;
    
    code += `<script>\n`;
    code += `export default {\n`;
    code += `  props: {\n`;
    code += `    onClick: {\n`;
    code += `      type: Function,\n`;
    code += `      default: () => {}\n`;
    code += `    }\n`;
    code += `  }\n`;
    code += `};\n`;
    code += `</script>\n\n`;
    
    code += `<style scoped>\n`;
    code += generateBaseCssCode();
    code += `</style>`;
    
    return code;
  };

  // Generate Angular code
  const generateAngularCode = (): string => {
    const { 
      text, 
      disabled, 
      iconPosition, 
      iconSize,
      animation
    } = buttonStyle;
    
    let code = `// button.component.ts\n`;
    code += `import { Component, Input, Output, EventEmitter } from '@angular/core';\n\n`;
    code += `@Component({\n`;
    code += `  selector: 'app-custom-button',\n`;
    code += `  templateUrl: './button.component.html',\n`;
    code += `  styleUrls: ['./button.component.css']\n`;
    code += `})\n`;
    code += `export class CustomButtonComponent {\n`;
    code += `  @Input() text: string = '${text}';\n`;
    code += `  @Input() disabled: boolean = ${disabled};\n`;
    code += `  @Input() iconPosition: 'left' | 'right' | 'none' = '${iconPosition}';\n`;
    code += `  @Input() iconSize: number = ${iconSize};\n`;
    code += `  @Output() buttonClick = new EventEmitter<void>();\n\n`;
    code += `  onClick(): void {\n`;
    code += `    this.buttonClick.emit();\n`;
    code += `  }\n`;
    code += `}\n\n`;
    
    code += `// button.component.html\n`;
    code += `<button\n`;
    code += `  class="custom-button"\n`;
    code += `  [disabled]="disabled"\n`;
    code += `  (click)="onClick()"\n`;
    code += `>\n`;
    
    code += `  <svg *ngIf="iconPosition === 'left'"\n`;
    code += `    class="mr-2"\n`;
    code += `    [attr.width]="iconSize"\n`;
    code += `    [attr.height]="iconSize"\n`;
    code += `    viewBox="0 0 24 24"\n`;
    code += `    fill="none"\n`;
    code += `    stroke="currentColor"\n`;
    code += `    stroke-width="2"\n`;
    code += `    stroke-linecap="round"\n`;
    code += `    stroke-linejoin="round">\n`;
    code += `    <path d="M5 12h14M12 5l7 7-7 7" />\n`;
    code += `  </svg>\n\n`;
    
    code += `  {{ text }}\n\n`;
    
    code += `  <svg *ngIf="iconPosition === 'right'"\n`;
    code += `    class="ml-2"\n`;
    code += `    [attr.width]="iconSize"\n`;
    code += `    [attr.height]="iconSize"\n`;
    code += `    viewBox="0 0 24 24"\n`;
    code += `    fill="none"\n`;
    code += `    stroke="currentColor"\n`;
    code += `    stroke-width="2"\n`;
    code += `    stroke-linecap="round"\n`;
    code += `    stroke-linejoin="round">\n`;
    code += `    <path d="M5 12h14M12 5l7 7-7 7" />\n`;
    code += `  </svg>\n`;
    code += `</button>\n\n`;
    
    code += `// button.component.css\n`;
    code += generateBaseCssCode();
    
    return code;
  };

  // Generate Styled Components code
  const generateStyledComponentsCode = (): string => {
    const {
      text,
      backgroundColor,
      textColor,
      useGradient,
      gradient,
      gradientDirection,
      shape,
      borderRadius,
      fontWeight,
      textAlign,
      paddingX,
      paddingY,
      useShadow,
      shadow,
      border,
      opacity,
      hoverScale,
      animation,
      useTransition,
      transitionDuration,
      disabled,
      iconPosition,
      iconSize
    } = buttonStyle;
    
    let code = `import React from 'react';\n`;
    code += `import styled, { keyframes } from 'styled-components';\n\n`;
    
    // Generate keyframes for animations
    if (animation !== "none") {
      if (animation === "custom" && customAnimation) {
        const { name } = customAnimation;
        code += `const ${name}Animation = keyframes\`\n`;
        
        customAnimation.keyframes.forEach(keyframe => {
          code += `  ${keyframe.percent}% {\n`;
          Object.entries(keyframe.properties).forEach(([key, value]) => {
            // Convert camelCase to kebab-case for CSS properties
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            code += `    ${cssKey}: ${value};\n`;
          });
          code += `  }\n`;
        });
        
        code += `\`;\n\n`;
      } else if (animation === "pulse") {
        code += `const pulseAnimation = keyframes\`\n`;
        code += `  0%, 100% {\n`;
        code += `    opacity: 1;\n`;
        code += `  }\n`;
        code += `  50% {\n`;
        code += `    opacity: 0.7;\n`;
        code += `  }\n`;
        code += `\`;\n\n`;
      } else if (animation === "bounce") {
        code += `const bounceAnimation = keyframes\`\n`;
        code += `  0%, 100% {\n`;
        code += `    transform: translateY(0);\n`;
        code += `  }\n`;
        code += `  50% {\n`;
        code += `    transform: translateY(-10px);\n`;
        code += `  }\n`;
        code += `\`;\n\n`;
      } else if (animation === "shake") {
        code += `const shakeAnimation = keyframes\`\n`;
        code += `  10%, 90% {\n`;
        code += `    transform: translate3d(-1px, 0, 0);\n`;
        code += `  }\n`;
        code += `  20%, 80% {\n`;
        code += `    transform: translate3d(2px, 0, 0);\n`;
        code += `  }\n`;
        code += `  30%, 50%, 70% {\n`;
        code += `    transform: translate3d(-4px, 0, 0);\n`;
        code += `  }\n`;
        code += `  40%, 60% {\n`;
        code += `    transform: translate3d(4px, 0, 0);\n`;
        code += `  }\n`;
        code += `\`;\n\n`;
      }
    }
    
    // Generate Styled Component
    code += `const StyledButton = styled.button\`\n`;
    code += `  display: inline-flex;\n`;
    code += `  align-items: center;\n`;
    code += `  justify-content: center;\n`;
    code += `  color: ${textColor};\n`;
    
    if (!useGradient) {
      code += `  background-color: ${backgroundColor};\n`;
    } else {
      const gradientStops = gradient
        .map(stop => `${stop.color} ${stop.position}%`)
        .join(", ");
      code += `  background: linear-gradient(${gradientDirection}deg, ${gradientStops});\n`;
    }
    
    if (opacity !== 1) {
      code += `  opacity: ${opacity};\n`;
    }
    
    if (borderRadius) {
      code += `  border-radius: ${borderRadius};\n`;
    } else {
      switch (shape) {
        case "square":
          code += `  border-radius: 0;\n`;
          break;
        case "rounded":
          code += `  border-radius: 0.375rem;\n`;
          break;
        case "pill":
          code += `  border-radius: 9999px;\n`;
          break;
      }
    }
    
    code += `  padding: ${paddingY}px ${paddingX}px;\n`;
    
    if (border.width > 0) {
      code += `  border: ${border.width}px ${border.style} ${border.color};\n`;
    } else {
      code += `  border: none;\n`;
    }
    
    if (useShadow) {
      const { offsetX, offsetY, blur, spread, color, inset } = shadow;
      code += `  box-shadow: ${inset ? "inset " : ""}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color};\n`;
    }
    
    switch (fontWeight) {
      case "normal":
        code += `  font-weight: 400;\n`;
        break;
      case "medium":
        code += `  font-weight: 500;\n`;
        break;
      case "semibold":
        code += `  font-weight: 600;\n`;
        break;
      case "bold":
        code += `  font-weight: 700;\n`;
        break;
    }
    
    if (textAlign !== "center") {
      code += `  text-align: ${textAlign};\n`;
    }
    
    if (useTransition) {
      code += `  transition: all ${transitionDuration}ms;\n`;
    }
    
    if (animation === "custom" && customAnimation) {
      const { name, duration, easing, iterationCount, direction } = customAnimation;
      const iterations = iterationCount === 'infinite' ? 'infinite' : iterationCount;
      const easingFunction = easing === 'cubic-bezier' && customAnimation.cubicBezier
        ? `cubic-bezier(${customAnimation.cubicBezier.join(', ')})`
        : easing;
        
      code += `  animation: ${name}Animation ${duration}ms ${easingFunction} ${iterations} ${direction};\n`;
    } else {
      switch (animation) {
        case "pulse":
          code += `  animation: pulseAnimation 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n`;
          break;
        case "bounce":
          code += `  animation: bounceAnimation 1s infinite;\n`;
          break;
        case "shake":
          code += `  animation: shakeAnimation 0.82s cubic-bezier(.36,.07,.19,.97) infinite;\n`;
          break;
      }
    }
    
    code += `  cursor: ${disabled ? 'not-allowed' : 'pointer'};\n`;
    
    // Hover styles
    code += `  &:hover {\n`;
    if (animation === "scale" && hoverScale !== 1) {
      code += `    transform: scale(${hoverScale});\n`;
    }
    if (!useGradient) {
      code += `    background-color: ${buttonStyle.hoverBackgroundColor};\n`;
    }
    if (buttonStyle.textColor !== buttonStyle.textHoverColor) {
      code += `    color: ${buttonStyle.textHoverColor};\n`;
    }
    code += `  }\n`;
    
    // Disabled styles
    code += `  &:disabled {\n`;
    code += `    opacity: 0.5;\n`;
    code += `    cursor: not-allowed;\n`;
    code += `  }\n`;
    
    code += `\`;\n\n`;
    
    // Icon components
    if (iconPosition !== "none") {
      code += `const ArrowIcon = ({ size, className }) => (\n`;
      code += `  <svg\n`;
      code += `    className={className}\n`;
      code += `    width={size}\n`;
      code += `    height={size}\n`;
      code += `    viewBox="0 0 24 24"\n`;
      code += `    fill="none"\n`;
      code += `    stroke="currentColor"\n`;
      code += `    strokeWidth="2"\n`;
      code += `    strokeLinecap="round"\n`;
      code += `    strokeLinejoin="round"\n`;
      code += `  >\n`;
      code += `    <path d="M5 12h14M12 5l7 7-7 7" />\n`;
      code += `  </svg>\n`;
      code += `);\n\n`;
    }
    
    // Button component
    code += `const CustomButton = ({ onClick }) => {\n`;
    code += `  return (\n`;
    code += `    <StyledButton onClick={onClick} disabled={${disabled}}>\n`;
    
    if (iconPosition === "left") {
      code += `      <ArrowIcon size={${iconSize}} className="mr-2" />\n`;
    }
    
    code += `      ${text}\n`;
    
    if (iconPosition === "right") {
      code += `      <ArrowIcon size={${iconSize}} className="ml-2" />\n`;
    }
    
    code += `    </StyledButton>\n`;
    code += `  );\n`;
    code += `};\n\n`;
    code += `export default CustomButton;`;
    
    return code;
  };

  // Generate Svelte code
  const generateSvelteCode = (): string => {
    const {
      text,
      disabled,
      iconPosition,
      iconSize,
      animation
    } = buttonStyle;
    
    let code = `<!-- CustomButton.svelte -->\n`;
    code += `<script>\n`;
    code += `  export let onClick = () => {};\n`;
    code += `  export let disabled = ${disabled};\n`;
    code += `</script>\n\n`;
    
    code += `<button\n`;
    code += `  class="custom-button"\n`;
    code += `  {disabled}\n`;
    code += `  on:click={onClick}\n`;
    code += `>\n`;
    
    if (iconPosition === "left") {
      code += `  <svg\n`;
      code += `    class="mr-2"\n`;
      code += `    width="${iconSize}"\n`;
      code += `    height="${iconSize}"\n`;
      code += `    viewBox="0 0 24 24"\n`;
      code += `    fill="none"\n`;
      code += `    stroke="currentColor"\n`;
      code += `    stroke-width="2"\n`;
      code += `    stroke-linecap="round"\n`;
      code += `    stroke-linejoin="round"\n`;
      code += `  >\n`;
      code += `    <path d="M5 12h14M12 5l7 7-7 7" />\n`;
      code += `  </svg>\n`;
    }
    
    code += `  ${text}\n`;
    
    if (iconPosition === "right") {
      code += `  <svg\n`;
      code += `    class="ml-2"\n`;
      code += `    width="${iconSize}"\n`;
      code += `    height="${iconSize}"\n`;
      code += `    viewBox="0 0 24 24"\n`;
      code += `    fill="none"\n`;
      code += `    stroke="currentColor"\n`;
      code += `    stroke-width="2"\n`;
      code += `    stroke-linecap="round"\n`;
      code += `    stroke-linejoin="round"\n`;
      code += `  >\n`;
      code += `    <path d="M5 12h14M12 5l7 7-7 7" />\n`;
      code += `  </svg>\n`;
    }
    
    code += `</button>\n\n`;
    
    code += `<style>\n`;
    code += generateBaseCssCode();
    code += `</style>\n`;
    
    return code;
  };

  const getCodeForFormat = (): string => {
    switch (exportFormat) {
      case "css":
        return generateBaseCssCode();
      case "html":
        return generateHTMLCode();
      case "tailwind":
        return generateTailwindCode();
      case "react":
        return generateReactCode();
      case "vue":
        return generateVueCode();
      case "angular":
        return generateAngularCode();
      case "svelte":
        return generateSvelteCode();
      case "styledComponents":
        return generateStyledComponentsCode();
      default:
        return generateBaseCssCode();
    }
  };

  const copyCodeToClipboard = () => {
    const code = getCodeForFormat();
    navigator.clipboard.writeText(code).then(() => {
      toast({
        title: "Code copied!",
        description: `The ${exportFormat.toUpperCase()} code has been copied to your clipboard.`,
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Code Export</h3>
        <Button onClick={copyCodeToClipboard} variant="outline" size="sm">
          Copy Code
        </Button>
      </div>
      
      <Tabs value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportFormat)}>
        <TabsList className="grid grid-cols-4 w-full mb-2">
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
          <TabsTrigger value="react">React</TabsTrigger>
        </TabsList>
        
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="vue">Vue</TabsTrigger>
          <TabsTrigger value="angular">Angular</TabsTrigger>
          <TabsTrigger value="svelte">Svelte</TabsTrigger>
          <TabsTrigger value="styledComponents">Styled</TabsTrigger>
        </TabsList>
        
        <TabsContent value={exportFormat} className="mt-4">
          <ScrollArea className="h-[400px] rounded-md border">
            <div className="p-4 bg-slate-950 rounded-md">
              <pre className="text-sm text-slate-50 whitespace-pre-wrap break-all">
                <code>{getCodeForFormat()}</code>
              </pre>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
