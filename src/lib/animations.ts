
import { ButtonStyle } from "@/types/buttonTypes";

export type EasingFunction = 
  'linear' | 
  'ease' | 
  'ease-in' | 
  'ease-out' | 
  'ease-in-out' | 
  'cubic-bezier';

export type AnimationProperty = 
  'transform' | 
  'opacity' | 
  'color' | 
  'background-color' | 
  'border-color' | 
  'shadow' | 
  'all';

export interface KeyframeStep {
  percent: number;
  properties: {
    transform?: string;
    opacity?: number;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    boxShadow?: string;
    backgroundPosition?: string; // Added this property to fix the error
  };
}

export interface CustomAnimation {
  name: string;
  duration: number;
  easing: EasingFunction;
  iterationCount: number | 'infinite';
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  keyframes: KeyframeStep[];
  cubicBezier?: [number, number, number, number]; // Only used when easing is cubic-bezier
}

export interface AnimationPreset {
  name: string;
  category: string;
  animation: CustomAnimation;
}

export const defaultCustomAnimation: CustomAnimation = {
  name: 'custom',
  duration: 1000,
  easing: 'ease',
  iterationCount: 1,
  direction: 'normal',
  keyframes: [
    {
      percent: 0,
      properties: {
        transform: 'scale(1)',
        opacity: 1
      }
    },
    {
      percent: 100,
      properties: {
        transform: 'scale(1.1)',
        opacity: 1
      }
    }
  ]
};

export const animationPresets: AnimationPreset[] = [
  {
    name: 'Pulse',
    category: 'Basic',
    animation: {
      name: 'pulse',
      duration: 2000,
      easing: 'ease-in-out',
      iterationCount: 'infinite',
      direction: 'alternate',
      keyframes: [
        {
          percent: 0,
          properties: {
            transform: 'scale(1)',
            opacity: 1
          }
        },
        {
          percent: 100,
          properties: {
            transform: 'scale(1.05)',
            opacity: 0.8
          }
        }
      ]
    }
  },
  {
    name: 'Bounce',
    category: 'Basic',
    animation: {
      name: 'bounce',
      duration: 1000,
      easing: 'cubic-bezier',
      cubicBezier: [0.68, -0.55, 0.265, 1.55],
      iterationCount: 'infinite',
      direction: 'alternate',
      keyframes: [
        {
          percent: 0,
          properties: {
            transform: 'translateY(0)'
          }
        },
        {
          percent: 100,
          properties: {
            transform: 'translateY(-10px)'
          }
        }
      ]
    }
  },
  {
    name: 'Shine',
    category: 'Effects',
    animation: {
      name: 'shine',
      duration: 1500,
      easing: 'ease-in-out',
      iterationCount: 'infinite',
      direction: 'normal',
      keyframes: [
        {
          percent: 0,
          properties: {
            backgroundPosition: '-100% 0'
          }
        },
        {
          percent: 100,
          properties: {
            backgroundPosition: '200% 0'
          }
        }
      ]
    }
  },
  {
    name: 'Color Shift',
    category: 'Effects',
    animation: {
      name: 'color-shift',
      duration: 3000,
      easing: 'ease',
      iterationCount: 'infinite',
      direction: 'alternate',
      keyframes: [
        {
          percent: 0,
          properties: {
            backgroundColor: '#3b82f6',
            borderColor: '#2563eb'
          }
        },
        {
          percent: 50,
          properties: {
            backgroundColor: '#8b5cf6',
            borderColor: '#7c3aed'
          }
        },
        {
          percent: 100,
          properties: {
            backgroundColor: '#ec4899',
            borderColor: '#db2777'
          }
        }
      ]
    }
  }
];

// Generate CSS for custom animations
export const generateAnimationCSS = (animation: CustomAnimation): string => {
  const easingFunction = animation.easing === 'cubic-bezier' && animation.cubicBezier
    ? `cubic-bezier(${animation.cubicBezier.join(', ')})`
    : animation.easing;

  let css = `@keyframes ${animation.name} {\n`;
  
  animation.keyframes.forEach(keyframe => {
    css += `  ${keyframe.percent}% {\n`;
    
    Object.entries(keyframe.properties).forEach(([key, value]) => {
      // Convert camelCase to kebab-case for CSS properties
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      css += `    ${cssKey}: ${value};\n`;
    });
    
    css += `  }\n`;
  });
  
  css += `}\n\n`;
  css += `.animation-${animation.name} {\n`;
  css += `  animation: ${animation.name} ${animation.duration}ms ${easingFunction} ${animation.iterationCount} ${animation.direction};\n`;
  css += `}\n`;
  
  return css;
};
