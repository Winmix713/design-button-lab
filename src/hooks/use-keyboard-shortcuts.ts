
import { useEffect, useCallback } from 'react';
import { useComponentState } from '../contexts/component-state-context';
import { useToast } from './use-toast';

interface KeyboardShortcut {
  key: string;
  modifier?: 'ctrl' | 'alt' | 'shift' | 'meta';
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts() {
  const { undo, redo, resetToDefault, canUndo, canRedo } = useComponentState();
  const { toast } = useToast();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Define shortcuts
    const shortcuts: KeyboardShortcut[] = [
      {
        key: 'z',
        modifier: 'ctrl',
        action: () => {
          if (canUndo) {
            undo();
            toast({
              title: 'Undo',
              description: 'Previous state restored',
            });
          }
        },
        description: 'Undo last change',
      },
      {
        key: 'y',
        modifier: 'ctrl',
        action: () => {
          if (canRedo) {
            redo();
            toast({
              title: 'Redo',
              description: 'Change reapplied',
            });
          }
        },
        description: 'Redo last undone change',
      },
      {
        key: 'r',
        modifier: 'alt',
        action: () => {
          resetToDefault();
          toast({
            title: 'Reset',
            description: 'Component reset to default state',
          });
        },
        description: 'Reset component to default state',
      },
    ];

    // Check if an input, textarea or select is focused
    const activeElement = document.activeElement;
    const isInputFocused = 
      activeElement instanceof HTMLInputElement || 
      activeElement instanceof HTMLTextAreaElement || 
      activeElement instanceof HTMLSelectElement;
    
    // Don't handle shortcuts if user is typing in a form element
    if (isInputFocused) return;

    // Check each shortcut
    for (const shortcut of shortcuts) {
      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
      let modifierMatches = true;

      if (shortcut.modifier) {
        switch (shortcut.modifier) {
          case 'ctrl':
            modifierMatches = event.ctrlKey || event.metaKey;
            break;
          case 'alt':
            modifierMatches = event.altKey;
            break;
          case 'shift':
            modifierMatches = event.shiftKey;
            break;
          case 'meta':
            modifierMatches = event.metaKey;
            break;
        }
      }

      if (keyMatches && modifierMatches) {
        event.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, [undo, redo, resetToDefault, canUndo, canRedo, toast]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Return a list of available shortcuts for display purposes
  return [
    { keys: ['Ctrl', 'Z'], description: 'Undo' },
    { keys: ['Ctrl', 'Y'], description: 'Redo' },
    { keys: ['Alt', 'R'], description: 'Reset' },
  ];
}
