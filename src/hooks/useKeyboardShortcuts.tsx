
import { useEffect } from "react";
import { useButtonWizard } from "@/contexts/ButtonWizardContext";
import { useToast } from "@/hooks/use-toast";

export function useKeyboardShortcuts() {
  const { undo, redo, canUndo, canRedo, resetStyle } = useButtonWizard();
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
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo, canUndo, canRedo, resetStyle, toast]);
}
