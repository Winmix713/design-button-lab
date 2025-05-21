import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Kbd } from "@heroui/react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  const shortcuts = [
    { keys: ["Ctrl", "Z"], description: "Undo last action" },
    { keys: ["Ctrl", "Y"], description: "Redo last action" },
    { keys: ["Ctrl", "S"], description: "Save current preset" },
    { keys: ["Ctrl", "P"], description: "Preview animation" },
    { keys: ["Ctrl", "D"], description: "Toggle dark mode" },
    { keys: ["Ctrl", "1"], description: "Switch to Preview tab" },
    { keys: ["Ctrl", "2"], description: "Switch to Code tab" },
    { keys: ["Ctrl", "3"], description: "Switch to Accessibility tab" },
    { keys: ["Ctrl", "4"], description: "Switch to Animation tab" },
    { keys: ["Ctrl", "B"], description: "Switch to Button component" },
    { keys: ["Ctrl", "C"], description: "Switch to Card component" },
    { keys: ["Ctrl", "H"], description: "Toggle layout mode" },
    { keys: ["Esc"], description: "Close any open modal" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Keyboard Shortcuts
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-2">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-divider last:border-0">
                    <span>{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          <Kbd>{key}</Kbd>
                          {keyIndex < shortcut.keys.length - 1 && <span>+</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};