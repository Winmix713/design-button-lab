
import { ButtonStyle } from "@/types/buttonTypes";

export const initialButtonStyles: ButtonStyle = {
  text: "Button",
  variant: "solid",
  size: "md",
  shape: "rounded",
  animation: "none",
  textColor: "#ffffff",
  backgroundColor: "#3b82f6",
  hoverBackgroundColor: "#2563eb",
  textHoverColor: "#ffffff",
  useGradient: false,
  gradient: [
    { color: "#3b82f6", position: 0 },
    { color: "#2563eb", position: 100 }
  ],
  gradientDirection: 90,
  fontWeight: "medium",
  textAlign: "center",
  iconName: "",
  iconPosition: "none",
  iconSize: 16,
  paddingX: 16,
  paddingY: 8,
  useShadow: false,
  shadow: {
    offsetX: 0,
    offsetY: 4,
    blur: 6,
    spread: 0,
    color: "rgba(0, 0, 0, 0.1)",
    inset: false
  },
  border: {
    width: 0,
    style: "solid",
    color: "#e2e8f0"
  },
  hoverScale: 1,
  opacity: 1,
  useTransition: true,
  transitionDuration: 300,
  disabled: false
};

export const presets: { name: string; category: string; style: ButtonStyle }[] = [
  {
    name: "Primary",
    category: "Basic",
    style: {
      ...initialButtonStyles,
      text: "Primary",
      backgroundColor: "#3b82f6",
      hoverBackgroundColor: "#2563eb"
    }
  },
  {
    name: "Secondary",
    category: "Basic",
    style: {
      ...initialButtonStyles,
      text: "Secondary",
      backgroundColor: "#6b7280",
      hoverBackgroundColor: "#4b5563"
    }
  },
  {
    name: "Danger",
    category: "Basic",
    style: {
      ...initialButtonStyles,
      text: "Danger",
      backgroundColor: "#ef4444",
      hoverBackgroundColor: "#dc2626"
    }
  },
  {
    name: "Success",
    category: "Basic",
    style: {
      ...initialButtonStyles,
      text: "Success",
      backgroundColor: "#10b981",
      hoverBackgroundColor: "#059669"
    }
  },
  {
    name: "Warning",
    category: "Basic",
    style: {
      ...initialButtonStyles,
      text: "Warning",
      backgroundColor: "#f59e0b",
      hoverBackgroundColor: "#d97706",
    }
  },
  {
    name: "Glass",
    category: "Special",
    style: {
      ...initialButtonStyles,
      text: "Glass Button",
      variant: "glass",
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      textColor: "#ffffff",
      hoverBackgroundColor: "rgba(255, 255, 255, 0.25)",
      useShadow: true,
      shadow: {
        offsetX: 0,
        offsetY: 4,
        blur: 12,
        spread: 0,
        color: "rgba(0, 0, 0, 0.05)",
        inset: false
      },
      border: {
        width: 1,
        style: "solid",
        color: "rgba(255, 255, 255, 0.3)"
      }
    }
  },
  {
    name: "Gradient Blue",
    category: "Gradient",
    style: {
      ...initialButtonStyles,
      text: "Gradient",
      useGradient: true,
      backgroundColor: "#transparent",
      gradient: [
        { color: "#3b82f6", position: 0 },
        { color: "#2563eb", position: 100 }
      ]
    }
  },
  {
    name: "Gradient Purple",
    category: "Gradient",
    style: {
      ...initialButtonStyles,
      text: "Gradient",
      useGradient: true,
      backgroundColor: "transparent",
      gradient: [
        { color: "#8b5cf6", position: 0 },
        { color: "#6d28d9", position: 100 }
      ]
    }
  },
  {
    name: "Ghost",
    category: "Special",
    style: {
      ...initialButtonStyles,
      text: "Ghost",
      variant: "ghost",
      textColor: "#3b82f6",
      backgroundColor: "transparent",
      hoverBackgroundColor: "rgba(59, 130, 246, 0.08)",
      border: {
        width: 0,
        style: "solid",
        color: "transparent"
      }
    }
  },
  {
    name: "Outline",
    category: "Special",
    style: {
      ...initialButtonStyles,
      text: "Outline",
      variant: "outline",
      textColor: "#3b82f6",
      backgroundColor: "transparent",
      hoverBackgroundColor: "rgba(59, 130, 246, 0.08)",
      border: {
        width: 1,
        style: "solid",
        color: "#3b82f6"
      }
    }
  },
  {
    name: "Rounded Pill",
    category: "Shape",
    style: {
      ...initialButtonStyles,
      text: "Rounded Pill",
      shape: "pill"
    }
  },
  {
    name: "Square",
    category: "Shape",
    style: {
      ...initialButtonStyles,
      text: "Square",
      shape: "square"
    }
  },
  {
    name: "Mini",
    category: "Size",
    style: {
      ...initialButtonStyles,
      text: "Mini",
      size: "xs",
      paddingX: 10,
      paddingY: 4
    }
  },
  {
    name: "Large",
    category: "Size",
    style: {
      ...initialButtonStyles,
      text: "Large",
      size: "xl",
      paddingX: 24,
      paddingY: 12
    }
  },
  {
    name: "Scale Animation",
    category: "Animation",
    style: {
      ...initialButtonStyles,
      text: "Hover Scale",
      animation: "scale",
      hoverScale: 1.05
    }
  },
  {
    name: "Pulse Animation",
    category: "Animation",
    style: {
      ...initialButtonStyles,
      text: "Pulse",
      animation: "pulse"
    }
  },
  {
    name: "Shadowed",
    category: "Effects",
    style: {
      ...initialButtonStyles,
      text: "With Shadow",
      useShadow: true
    }
  }
];
