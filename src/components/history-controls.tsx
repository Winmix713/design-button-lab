import React from "react";
import { Button, Tooltip, ButtonGroup } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useComponentWizard } from "../context/component-wizard-context";

export const HistoryControls: React.FC = () => {
  const { undo, redo, canUndo, canRedo } = useComponentWizard();

  return (
    <ButtonGroup size="sm">
      <Tooltip content="Undo (Ctrl+Z)">
        <Button
          isIconOnly
          variant="flat"
          isDisabled={!canUndo}
          onPress={undo}
          aria-label="Undo"
        >
          <Icon icon="lucide:undo-2" />
        </Button>
      </Tooltip>
      <Tooltip content="Redo (Ctrl+Y)">
        <Button
          isIconOnly
          variant="flat"
          isDisabled={!canRedo}
          onPress={redo}
          aria-label="Redo"
        >
          <Icon icon="lucide:redo-2" />
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
};