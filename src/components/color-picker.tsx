import React from "react";
import { Button, Popover, PopoverTrigger, PopoverContent, Input } from "@heroui/react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom">
      <PopoverTrigger>
        <Button
          className="w-full justify-start h-9"
          variant="flat"
          size="sm"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-full border border-default-300"
              style={{ backgroundColor: color || "transparent" }}
            />
            <span>{color || "Select color"}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="p-2">
          <HexColorPicker color={color} onChange={onChange} />
          <div className="mt-2">
            <Input
              size="sm"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              startContent={
                <div
                  className="w-4 h-4 rounded-full border border-default-300"
                  style={{ backgroundColor: color || "transparent" }}
                />
              }
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};