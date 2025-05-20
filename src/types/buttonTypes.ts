
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link' | 'glass';
export type ButtonShape = 'square' | 'rounded' | 'pill';
export type ButtonAnimation = 'none' | 'pulse' | 'bounce' | 'shake' | 'scale' | 'slideFade';
export type TextAlign = 'left' | 'center' | 'right';
export type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type IconPosition = 'left' | 'right' | 'none';
export type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'none';

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
}
