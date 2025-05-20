
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link' | 'glass';
export type ButtonShape = 'square' | 'rounded' | 'pill';
export type ButtonAnimation = 'none' | 'pulse' | 'bounce' | 'shake' | 'scale' | 'slideFade' | 'custom';
export type TextAlign = 'left' | 'center' | 'right';
export type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type IconPosition = 'left' | 'right' | 'none';
export type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
export type ExportFormat = 'css' | 'html' | 'tailwind' | 'react' | 'vue' | 'angular' | 'svelte' | 'styledComponents';

export interface GradientStop {
  color: string;
  position: number;
}

export interface Shadow {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
}

export interface Border {
  width: number;
  style: BorderStyle;
  color: string;
}

export interface ButtonStyle {
  text: string;
  variant: ButtonVariant;
  size: ButtonSize;
  shape: ButtonShape;
  animation: ButtonAnimation;
  textColor: string;
  backgroundColor: string;
  hoverBackgroundColor: string;
  textHoverColor: string;
  useGradient: boolean;
  gradient: GradientStop[];
  gradientDirection: number;
  fontWeight: FontWeight;
  textAlign: TextAlign;
  iconName: string;
  iconPosition: IconPosition;
  iconSize: number;
  paddingX: number;
  paddingY: number;
  useShadow: boolean;
  shadow: Shadow;
  border: Border;
  hoverScale: number;
  opacity: number;
  useTransition: boolean;
  transitionDuration: number;
  disabled: boolean;
  // New properties
  customAnimationName?: string; // Reference to a custom animation
  themeName?: string; // Reference to a theme
  borderRadius?: string; // Optional border radius override from theme
}
