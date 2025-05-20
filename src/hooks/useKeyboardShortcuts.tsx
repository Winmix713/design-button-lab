
import { useEffect } from "react";
import { useButtonWizard } from "@/contexts/ButtonWizardContext";
import { useToast } from "@/hooks/use-toast";

export function useKeyboardShortcuts() {
  const { 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    resetStyle, 
    setActiveTab,
    toggleAnimationBuilder,
    toggleThemeSelector
  } = useButtonWizard();
  const { toast } = useToast();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Check if the event target is an input or textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Undo: Ctrl+Z or Cmd+Z
      if ((event.ctrlKey || event.metaKey) && event.key === "z" && !event.shiftKey) {
        event.preventDefault();
        if (canUndo) {
          undo();
          toast({
            title: "Undo",
            description: "Previous button style restored",
          });
        }
      }

      // Redo: Ctrl+Shift+Z or Cmd+Shift+Z or Ctrl+Y or Cmd+Y
      if (
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "z") ||
        ((event.ctrlKey || event.metaKey) && event.key === "y")
      ) {
        event.preventDefault();
        if (canRedo) {
          redo();
          toast({
            title: "Redo",
            description: "Button style change reapplied",
          });
        }
      }

      // Reset: Alt+R
      if (event.altKey && event.key === "r") {
        event.preventDefault();
        resetStyle();
        toast({
          title: "Reset",
          description: "Button style reset to defaults",
        });
      }
      
      // Animation Builder: Alt+A
      if (event.altKey && event.key === "a") {
        event.preventDefault();
        toggleAnimationBuilder();
        toast({
          title: "Animation Builder",
          description: "Animation Builder opened",
        });
      }
      
      // Theme Selector: Alt+T
      if (event.altKey && event.key === "t") {
        event.preventDefault();
        toggleThemeSelector();
        toast({
          title: "Theme Selector",
          description: "Theme Selector opened",
        });
      }
      
      // Switch to Code tab: Alt+C
      if (event.altKey && event.key === "c") {
        event.preventDefault();
        setActiveTab("code");
        toast({
          title: "Tab Change",
          description: "Switched to Code tab",
        });
      }
      
      // Switch to Style tab: Alt+S
      if (event.altKey && event.key === "s") {
        event.preventDefault();
        setActiveTab("style");
        toast({
          title: "Tab Change",
          description: "Switched to Style tab",
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo, canUndo, canRedo, resetStyle, setActiveTab, toggleAnimationBuilder, toggleThemeSelector, toast]);
}
