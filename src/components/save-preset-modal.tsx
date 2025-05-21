import React from "react";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  Input, 
  Select, 
  SelectItem 
} from "@heroui/react";
import { ComponentState } from "../types/component-types";
import { Preset } from "../types/preset-types";

interface SavePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  componentState: ComponentState;
  componentType: "button" | "card";
  onSavePreset: (preset: Preset) => void;
  existingCategories: string[];
}

export const SavePresetModal: React.FC<SavePresetModalProps> = ({
  isOpen,
  onClose,
  componentState,
  componentType,
  onSavePreset,
  existingCategories
}) => {
  const [presetName, setPresetName] = React.useState("");
  const [presetCategory, setPresetCategory] = React.useState(existingCategories[0] || "custom");
  const [newCategory, setNewCategory] = React.useState("");
  const [isCustomCategory, setIsCustomCategory] = React.useState(false);
  
  const handleSave = () => {
    const category = isCustomCategory ? newCategory.toLowerCase() : presetCategory;
    
    if (!presetName) {
      // Handle validation error
      return;
    }
    
    const newPreset: Preset = {
      name: presetName,
      category,
      componentType,
      state: {
        ...componentState,
        componentType
      }
    };
    
    onSavePreset(newPreset);
    onClose();
    
    // Reset form
    setPresetName("");
    setPresetCategory(existingCategories[0] || "custom");
    setNewCategory("");
    setIsCustomCategory(false);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Save as Preset
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  label="Preset Name"
                  placeholder="Enter a name for your preset"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  autoFocus
                />
                
                <div className="flex flex-col gap-2">
                  <p className="text-small">Category</p>
                  <div className="flex gap-2">
                    {!isCustomCategory ? (
                      <Select
                        selectedKeys={[presetCategory]}
                        onChange={(e) => setPresetCategory(e.target.value)}
                        className="flex-1"
                      >
                        {existingCategories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </Select>
                    ) : (
                      <Input
                        placeholder="New category name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="flex-1"
                      />
                    )}
                    
                    <Button
                      variant="flat"
                      onPress={() => setIsCustomCategory(!isCustomCategory)}
                    >
                      {isCustomCategory ? "Use Existing" : "New Category"}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-2 rounded-md bg-default-50">
                  <div className="text-default-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-small text-default-600">
                    Saved presets are stored in your browser's local storage and will be available the next time you visit.
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSave} isDisabled={!presetName}>
                Save Preset
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};