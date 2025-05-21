import React from "react";
import { Switch, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTheme } from "@heroui/use-theme";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  
  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
    
    // Save preference to localStorage
    localStorage.setItem("theme-preference", isDark ? "light" : "dark");
  };
  
  // Initialize theme from localStorage on mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme-preference");
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      setTheme(savedTheme);
    }
  }, [setTheme]);
  
  return (
    <Tooltip 
      content={`Switch to ${isDark ? "light" : "dark"} mode`}
      placement="bottom"
    >
      <div className="flex items-center gap-2">
        <Icon icon="lucide:sun" className={`text-default-500 ${!isDark && "text-primary-500"}`} />
        <Switch 
          isSelected={isDark}
          onValueChange={handleToggle}
          size="sm"
          color="primary"
          className="mx-1"
        />
        <Icon icon="lucide:moon" className={`text-default-500 ${isDark && "text-primary-500"}`} />
      </div>
    </Tooltip>
  );
};