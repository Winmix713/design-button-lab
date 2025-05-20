
import { ButtonStyle } from "@/types/buttonTypes";

export interface Theme {
  name: string;
  description: string;
  primary: {
    base: string;
    hover: string;
    text: string;
  };
  secondary: {
    base: string;
    hover: string;
    text: string;
  };
  danger: {
    base: string;
    hover: string;
    text: string;
  };
  success: {
    base: string;
    hover: string;
    text: string;
  };
  warning: {
    base: string;
    hover: string;
    text: string;
  };
  info: {
    base: string;
    hover: string;
    text: string;
  };
  neutral: {
    base: string;
    hover: string;
    text: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    pill: string;
  };
  fontFamily: string;
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}

export const defaultTheme: Theme = {
  name: "Default",
  description: "Default theme with blue primary color",
  primary: {
    base: "#3b82f6",
    hover: "#2563eb",
    text: "#ffffff"
  },
  secondary: {
    base: "#6b7280",
    hover: "#4b5563",
    text: "#ffffff"
  },
  danger: {
    base: "#ef4444",
    hover: "#dc2626",
    text: "#ffffff"
  },
  success: {
    base: "#10b981",
    hover: "#059669",
    text: "#ffffff"
  },
  warning: {
    base: "#f59e0b",
    hover: "#d97706",
    text: "#ffffff"
  },
  info: {
    base: "#3b82f6",
    hover: "#2563eb",
    text: "#ffffff"
  },
  neutral: {
    base: "#9ca3af",
    hover: "#6b7280",
    text: "#ffffff"
  },
  borderRadius: {
    small: "0.25rem",
    medium: "0.375rem",
    large: "0.5rem",
    pill: "9999px"
  },
  fontFamily: "'Inter', system-ui, sans-serif",
  shadows: {
    small: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    medium: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    large: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
  }
};

export const availableThemes: Theme[] = [
  defaultTheme,
  {
    name: "Dark Mode",
    description: "Dark theme with purple accents",
    primary: {
      base: "#8b5cf6",
      hover: "#7c3aed",
      text: "#ffffff"
    },
    secondary: {
      base: "#4b5563",
      hover: "#374151",
      text: "#ffffff"
    },
    danger: {
      base: "#f87171",
      hover: "#ef4444",
      text: "#ffffff"
    },
    success: {
      base: "#34d399",
      hover: "#10b981",
      text: "#ffffff"
    },
    warning: {
      base: "#fbbf24",
      hover: "#f59e0b",
      text: "#000000"
    },
    info: {
      base: "#60a5fa",
      hover: "#3b82f6",
      text: "#ffffff"
    },
    neutral: {
      base: "#6b7280",
      hover: "#4b5563",
      text: "#ffffff"
    },
    borderRadius: {
      small: "0.25rem",
      medium: "0.375rem",
      large: "0.5rem",
      pill: "9999px"
    },
    fontFamily: "'Inter', system-ui, sans-serif",
    shadows: {
      small: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
      medium: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
      large: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)"
    }
  },
  {
    name: "Soft UI",
    description: "Soft UI design system with rounded elements",
    primary: {
      base: "#6366f1",
      hover: "#4f46e5",
      text: "#ffffff"
    },
    secondary: {
      base: "#e2e8f0",
      hover: "#cbd5e1",
      text: "#1e293b"
    },
    danger: {
      base: "#fb7185",
      hover: "#f43f5e",
      text: "#ffffff"
    },
    success: {
      base: "#4ade80",
      hover: "#22c55e",
      text: "#ffffff"
    },
    warning: {
      base: "#fdba74",
      hover: "#fb923c",
      text: "#000000"
    },
    info: {
      base: "#93c5fd",
      hover: "#60a5fa",
      text: "#000000"
    },
    neutral: {
      base: "#e2e8f0",
      hover: "#cbd5e1",
      text: "#1e293b"
    },
    borderRadius: {
      small: "0.5rem",
      medium: "0.75rem",
      large: "1rem",
      pill: "9999px"
    },
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    shadows: {
      small: "0 2px 4px rgba(0, 0, 0, 0.04), 0 0 10px rgba(0, 0, 0, 0.03)",
      medium: "0 4px 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.03)",
      large: "0 8px 30px rgba(0, 0, 0, 0.04), 0 0 30px rgba(0, 0, 0, 0.03)"
    }
  }
];

// Apply theme to button style
export const applyThemeToButton = (buttonStyle: ButtonStyle, theme: Theme, variant: keyof Theme): ButtonStyle => {
  // Ensure variant is a valid key in the theme
  if (!(variant in theme)) {
    variant = 'primary' as keyof Theme;
  }

  const themeVariant = theme[variant as keyof Theme] as any;
  
  if (!themeVariant || typeof themeVariant !== 'object') {
    return buttonStyle;
  }

  // Apply theme properties to button style
  return {
    ...buttonStyle,
    textColor: themeVariant.text,
    backgroundColor: themeVariant.base,
    hoverBackgroundColor: themeVariant.hover,
    textHoverColor: themeVariant.text,
    // For rounded buttons, use the theme's border radius
    ...(buttonStyle.shape === 'rounded' ? {
      borderRadius: theme.borderRadius.medium
    } : {}),
    // For pill buttons, use the theme's pill radius
    ...(buttonStyle.shape === 'pill' ? {
      borderRadius: theme.borderRadius.pill
    } : {})
  };
};
