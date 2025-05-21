import React from "react";
import { 
  Accordion, 
  AccordionItem, 
  Button, 
  Input, 
  Select, 
  SelectItem, 
  Slider, 
  Tooltip,
  Checkbox,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tabs,
  Tab,
  Divider,
  Switch
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { HexColorPicker } from "react-colorful";
import { ButtonState } from "../types/button-types";
import { Preset } from "../data/presets";

interface StylePanelProps {
  componentType: "button" | "card";
  componentState: any; // Changed from ButtonState to any to match the component-wizard context
  updateComponentState: (key: string, value: any) => void;
  updateComponentStyle: (key: string, value: any) => void;
  resetToDefault: () => void;
  applyPreset: (preset: Preset) => void;
  presets: Preset[];
  viewMode: "standard" | "advanced";
}

export const StylePanel: React.FC<StylePanelProps> = ({
  componentType,
  componentState,
  updateComponentState,
  updateComponentStyle,
  resetToDefault,
  applyPreset,
  presets,
  viewMode
}) => {
  const [selectedPresetCategory, setSelectedPresetCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [showSavePresetModal, setShowSavePresetModal] = React.useState<boolean>(false);
  
  // Filter presets by component type
  const componentPresets = React.useMemo(() => {
    return presets.filter(preset => preset.componentType === componentType);
  }, [presets, componentType]);
  
  // Filter presets by category and search query
  const filteredPresets = React.useMemo(() => {
    let filtered = componentPresets;
    
    if (selectedPresetCategory !== "all") {
      filtered = filtered.filter(preset => preset.category === selectedPresetCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(preset => 
        preset.name.toLowerCase().includes(query) || 
        preset.category.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [componentPresets, selectedPresetCategory, searchQuery]);

  const presetCategories = React.useMemo(() => {
    const categories = new Set<string>();
    componentPresets.forEach(preset => categories.add(preset.category));
    return Array.from(categories);
  }, [componentPresets]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{componentType === "button" ? "Button" : "Card"} Presets</h2>
          {viewMode === "advanced" && (
            <Button 
              size="sm" 
              variant="flat" 
              color="primary"
              startContent={<Icon icon="lucide:save" />}
              onPress={() => setShowSavePresetModal(true)}
            >
              Save
            </Button>
          )}
        </div>
        
        <div className="flex gap-2 mb-2">
          <Input
            size="sm"
            placeholder="Search presets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<Icon icon="lucide:search" className="text-default-400" />}
            className="flex-1"
            clearable
          />
          <Select
            size="sm"
            placeholder="Filter by category"
            selectedKeys={[selectedPresetCategory]}
            onChange={(e) => setSelectedPresetCategory(e.target.value)}
            className="w-40"
          >
            <SelectItem key="all" value="all">All Categories</SelectItem>
            {presetCategories.map(category => (
              <SelectItem key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</SelectItem>
            ))}
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto p-1">
          {filteredPresets.length > 0 ? (
            filteredPresets.map((preset, index) => (
              <Button
                key={index}
                size="sm"
                color={preset.category === "primary" ? "primary" : "default"}
                variant={preset.category === "primary" ? "solid" : "flat"}
                className="h-auto py-2 justify-start"
                onPress={() => applyPreset(preset)}
              >
                <div className="flex flex-col items-start">
                  <span>{preset.name}</span>
                  <span className="text-tiny text-default-500">{preset.category}</span>
                </div>
              </Button>
            ))
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center py-4 text-center text-default-500">
              <Icon icon="lucide:search-x" className="mb-2 text-2xl" />
              <p>No presets found</p>
              <p className="text-tiny">Try a different search term or category</p>
            </div>
          )}
        </div>
      </div>
      
      <Divider />
      
      <Accordion isCompact selectionMode="multiple" defaultExpandedKeys={["text", "appearance"]}>
        <AccordionItem key="text" title="Text & Content" startContent={<Icon icon="lucide:type" className="text-default-500" />}>
          <div className="flex flex-col gap-3 py-2">
            <Input
              label="Button Text"
              value={componentState.text}
              onChange={(e) => updateComponentState("text", e.target.value)}
              size="sm"
            />
            
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  label="Icon (Left)"
                  placeholder="lucide:heart"
                  value={componentState.iconLeft}
                  onChange={(e) => updateComponentState("iconLeft", e.target.value)}
                  size="sm"
                  startContent={componentState.iconLeft && <Icon icon={componentState.iconLeft} />}
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Icon (Right)"
                  placeholder="lucide:arrow-right"
                  value={componentState.iconRight}
                  onChange={(e) => updateComponentState("iconRight", e.target.value)}
                  size="sm"
                  startContent={componentState.iconRight && <Icon icon={componentState.iconRight} />}
                />
              </div>
            </div>
          </div>
        </AccordionItem>
        
        <AccordionItem key="appearance" title="Appearance" startContent={<Icon icon="lucide:palette" className="text-default-500" />}>
          <div className="flex flex-col gap-3 py-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-small mb-1">Text Color</p>
                <ColorPicker
                  color={componentState.style.color}
                  onChange={(color) => updateComponentStyle("color", color)}
                />
              </div>
              <div>
                <p className="text-small mb-1">Background</p>
                <ColorPicker
                  color={componentState.style.backgroundColor}
                  onChange={(color) => updateComponentStyle("backgroundColor", color)}
                />
              </div>
            </div>
            
            <div>
              <p className="text-small mb-1">Border Color</p>
              <ColorPicker
                color={componentState.style.borderColor}
                onChange={(color) => updateComponentStyle("borderColor", color)}
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <p className="text-small">Border Width</p>
              <div className="flex items-center gap-2">
                <Slider
                  size="sm"
                  step={1}
                  minValue={0}
                  maxValue={10}
                  value={parseInt(componentState.style.borderWidth) || 0}
                  onChange={(value) => updateComponentStyle("borderWidth", `${value}px`)}
                  className="flex-1"
                />
                <span className="text-small w-8 text-right">{parseInt(componentState.style.borderWidth) || 0}px</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <p className="text-small">Border Radius</p>
              <div className="flex items-center gap-2">
                <Slider
                  size="sm"
                  step={1}
                  minValue={0}
                  maxValue={32}
                  value={parseInt(componentState.style.borderRadius) || 0}
                  onChange={(value) => updateComponentStyle("borderRadius", `${value}px`)}
                  className="flex-1"
                />
                <span className="text-small w-8 text-right">{parseInt(componentState.style.borderRadius) || 0}px</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  label="Font Weight"
                  size="sm"
                  selectedKeys={[componentState.style.fontWeight || "normal"]}
                  onChange={(e) => updateComponentStyle("fontWeight", e.target.value)}
                >
                  <SelectItem key="normal" value="normal">Normal</SelectItem>
                  <SelectItem key="medium" value="500">Medium</SelectItem>
                  <SelectItem key="semibold" value="600">Semibold</SelectItem>
                  <SelectItem key="bold" value="bold">Bold</SelectItem>
                </Select>
              </div>
              <div className="flex-1">
                <Select
                  label="Font Size"
                  size="sm"
                  selectedKeys={[componentState.style.fontSize || "16px"]}
                  onChange={(e) => updateComponentStyle("fontSize", e.target.value)}
                >
                  <SelectItem key="12px" value="12px">12px</SelectItem>
                  <SelectItem key="14px" value="14px">14px</SelectItem>
                  <SelectItem key="16px" value="16px">16px</SelectItem>
                  <SelectItem key="18px" value="18px">18px</SelectItem>
                  <SelectItem key="20px" value="20px">20px</SelectItem>
                </Select>
              </div>
            </div>
          </div>
        </AccordionItem>
        
        <AccordionItem key="dimensions" title="Dimensions" startContent={<Icon icon="lucide:ruler" className="text-default-500" />}>
          <div className="flex flex-col gap-3 py-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-small mb-1">Width</p>
                <Input
                  size="sm"
                  type="text"
                  value={componentState.style.width || ""}
                  onChange={(e) => updateComponentStyle("width", e.target.value)}
                  placeholder="auto, 100px, 50%"
                />
              </div>
              <div>
                <p className="text-small mb-1">Height</p>
                <Input
                  size="sm"
                  type="text"
                  value={componentState.style.height || ""}
                  onChange={(e) => updateComponentStyle("height", e.target.value)}
                  placeholder="auto, 40px"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-small mb-1">Padding X</p>
                <div className="flex items-center gap-2">
                  <Slider
                    size="sm"
                    step={1}
                    minValue={0}
                    maxValue={48}
                    value={parseInt(componentState.style.paddingLeft) || 0}
                    onChange={(value) => {
                      updateComponentStyle("paddingLeft", `${value}px`);
                      updateComponentStyle("paddingRight", `${value}px`);
                    }}
                    className="flex-1"
                  />
                  <span className="text-small w-8 text-right">{parseInt(componentState.style.paddingLeft) || 0}px</span>
                </div>
              </div>
              <div>
                <p className="text-small mb-1">Padding Y</p>
                <div className="flex items-center gap-2">
                  <Slider
                    size="sm"
                    step={1}
                    minValue={0}
                    maxValue={48}
                    value={parseInt(componentState.style.paddingTop) || 0}
                    onChange={(value) => {
                      updateComponentStyle("paddingTop", `${value}px`);
                      updateComponentStyle("paddingBottom", `${value}px`);
                    }}
                    className="flex-1"
                  />
                  <span className="text-small w-8 text-right">{parseInt(componentState.style.paddingTop) || 0}px</span>
                </div>
              </div>
            </div>
          </div>
        </AccordionItem>
        
        <AccordionItem key="effects" title="Effects & Animation" startContent={<Icon icon="lucide:sparkles" className="text-default-500" />}>
          <div className="flex flex-col gap-3 py-2">
            <div className="flex flex-col gap-1">
              <p className="text-small">Box Shadow</p>
              <Select
                size="sm"
                selectedKeys={[componentState.style.boxShadow || "none"]}
                onChange={(e) => updateComponentStyle("boxShadow", e.target.value)}
              >
                <SelectItem key="none" value="none">None</SelectItem>
                <SelectItem key="sm" value="0 1px 2px rgba(0,0,0,0.05)">Small</SelectItem>
                <SelectItem key="md" value="0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)">Medium</SelectItem>
                <SelectItem key="lg" value="0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)">Large</SelectItem>
                <SelectItem key="xl" value="0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)">Extra Large</SelectItem>
              </Select>
            </div>
            
            <div className="flex flex-col gap-1">
              <p className="text-small">Transition Duration</p>
              <div className="flex items-center gap-2">
                <Slider
                  size="sm"
                  step={50}
                  minValue={0}
                  maxValue={1000}
                  value={parseInt(componentState.style.transitionDuration) || 0}
                  onChange={(value) => updateComponentStyle("transitionDuration", `${value}ms`)}
                  className="flex-1"
                />
                <span className="text-small w-16 text-right">{parseInt(componentState.style.transitionDuration) || 0}ms</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <p className="text-small">Hover Scale</p>
              <div className="flex items-center gap-2">
                <Slider
                  size="sm"
                  step={0.01}
                  minValue={0.9}
                  maxValue={1.2}
                  value={parseFloat(componentState.hoverStyle.transform?.replace("scale(", "").replace(")", "")) || 1}
                  onChange={(value) => updateComponentState("hoverStyle", {
                    ...componentState.hoverStyle,
                    transform: `scale(${value})`
                  })}
                  className="flex-1"
                />
                <span className="text-small w-16 text-right">
                  {parseFloat(componentState.hoverStyle.transform?.replace("scale(", "").replace(")", "")).toFixed(2) || "1.00"}x
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-small mb-1">Hover Background</p>
                <ColorPicker
                  color={componentState.hoverStyle.backgroundColor}
                  onChange={(color) => updateComponentState("hoverStyle", {
                    ...componentState.hoverStyle,
                    backgroundColor: color
                  })}
                />
              </div>
              <div>
                <p className="text-small mb-1">Hover Text Color</p>
                <ColorPicker
                  color={componentState.hoverStyle.color}
                  onChange={(color) => updateComponentState("hoverStyle", {
                    ...componentState.hoverStyle,
                    color: color
                  })}
                />
              </div>
            </div>
          </div>
        </AccordionItem>
        
        {viewMode === "advanced" && (
          <AccordionItem key="constraints" title="Design Constraints" startContent={<Icon icon="lucide:link" className="text-default-500" />}>
            <div className="flex flex-col gap-3 py-2">
              <div className="flex justify-between items-center">
                <p className="text-small">Enable Constraints</p>
                <Switch size="sm" />
              </div>
              
              <div className="flex flex-col gap-2 border border-divider rounded-md p-3">
                <p className="text-small font-medium">Padding Ratio Constraint</p>
                <div className="flex items-center gap-2">
                  <p className="text-tiny text-default-500">If width &gt;</p>
                  <Input size="sm" placeholder="200px" className="w-20" />
                  <p className="text-tiny text-default-500">then padding</p>
                  <Select size="sm" className="w-24">
                    <SelectItem key="x" value="x">X-axis</SelectItem>
                    <SelectItem key="y" value="y">Y-axis</SelectItem>
                  </Select>
                  <Select size="sm" className="w-24">
                    <SelectItem key="increase" value="increase">Increase by</SelectItem>
                    <SelectItem key="decrease" value="decrease">Decrease by</SelectItem>
                    <SelectItem key="set" value="set">Set to</SelectItem>
                  </Select>
                  <Input size="sm" placeholder="4px" className="w-16" />
                </div>
                <div className="flex justify-end">
                  <Button size="sm" variant="flat" color="danger">
                    <Icon icon="lucide:trash-2" />
                  </Button>
                </div>
              </div>
              
              <Button size="sm" variant="flat" startContent={<Icon icon="lucide:plus" />}>
                Add Constraint
              </Button>
            </div>
          </AccordionItem>
        )}
        
        {viewMode === "advanced" && (
          <AccordionItem key="tokens" title="Design Tokens" startContent={<Icon icon="lucide:palette" className="text-default-500" />}>
            <div className="flex flex-col gap-3 py-2">
              <div className="flex justify-between items-center">
                <p className="text-small">Use Design Tokens</p>
                <Switch size="sm" />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-small mb-1">Primary Color</p>
                  <Select size="sm">
                    <SelectItem key="primary" value="primary">primary</SelectItem>
                    <SelectItem key="primary-500" value="primary-500">primary-500</SelectItem>
                    <SelectItem key="brand-blue" value="brand-blue">brand-blue</SelectItem>
                  </Select>
                </div>
                <div>
                  <p className="text-small mb-1">Border Radius</p>
                  <Select size="sm">
                    <SelectItem key="radius-sm" value="radius-sm">radius-sm</SelectItem>
                    <SelectItem key="radius-md" value="radius-md">radius-md</SelectItem>
                    <SelectItem key="radius-lg" value="radius-lg">radius-lg</SelectItem>
                  </Select>
                </div>
              </div>
              
              <Button size="sm" variant="flat" startContent={<Icon icon="lucide:upload" />}>
                Import Tokens
              </Button>
            </div>
          </AccordionItem>
        )}
        
        {viewMode === "advanced" && (
          <AccordionItem key="responsive" title="Responsive Behavior" startContent={<Icon icon="lucide:smartphone" className="text-default-500" />}>
            <div className="flex flex-col gap-3 py-2">
              <div className="flex justify-between items-center">
                <p className="text-small">Enable Responsive Styles</p>
                <Switch size="sm" />
              </div>
              
              <div className="flex flex-col gap-2">
                <p className="text-small font-medium">Breakpoints</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <Button size="sm" variant="flat">Mobile</Button>
                  <Button size="sm" variant="solid" color="primary">Tablet</Button>
                  <Button size="sm" variant="flat">Desktop</Button>
                  <Button size="sm" variant="flat">Large</Button>
                </div>
              </div>
              
              <div className="border border-divider rounded-md p-3">
                <p className="text-small font-medium mb-2">Tablet Styles</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-tiny text-default-500">Font Size</p>
                    <Input size="sm" placeholder="18px" />
                  </div>
                  <div>
                    <p className="text-tiny text-default-500">Padding X</p>
                    <Input size="sm" placeholder="24px" />
                  </div>
                </div>
              </div>
            </div>
          </AccordionItem>
        )}
        
        <AccordionItem key="advanced" title="Advanced" startContent={<Icon icon="lucide:settings" className="text-default-500" />}>
          <div className="flex flex-col gap-3 py-2">
            <div className="flex flex-col gap-1">
              <p className="text-small">Text Transform</p>
              <Select
                size="sm"
                selectedKeys={[componentState.style.textTransform || "none"]}
                onChange={(e) => updateComponentStyle("textTransform", e.target.value)}
              >
                <SelectItem key="none" value="none">None</SelectItem>
                <SelectItem key="uppercase" value="uppercase">UPPERCASE</SelectItem>
                <SelectItem key="lowercase" value="lowercase">lowercase</SelectItem>
                <SelectItem key="capitalize" value="capitalize">Capitalize</SelectItem>
              </Select>
            </div>
            
            <div className="flex flex-col gap-1">
              <p className="text-small">Letter Spacing</p>
              <div className="flex items-center gap-2">
                <Slider
                  size="sm"
                  step={0.1}
                  minValue={-1}
                  maxValue={5}
                  value={parseFloat(componentState.style.letterSpacing) || 0}
                  onChange={(value) => updateComponentStyle("letterSpacing", `${value}px`)}
                  className="flex-1"
                />
                <span className="text-small w-16 text-right">{parseFloat(componentState.style.letterSpacing) || 0}px</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Checkbox
                isSelected={componentState.style.textDecoration === "underline"}
                onValueChange={(isSelected) => updateComponentStyle("textDecoration", isSelected ? "underline" : "none")}
                size="sm"
              >
                Underline
              </Checkbox>
              
              <Checkbox
                isSelected={componentState.style.fontStyle === "italic"}
                onValueChange={(isSelected) => updateComponentStyle("fontStyle", isSelected ? "italic" : "normal")}
                size="sm"
              >
                Italic
              </Checkbox>
            </div>
            
            <div className="flex flex-col gap-1">
              <p className="text-small">Custom CSS</p>
              <Input
                size="sm"
                type="text"
                value={componentState.customCSS || ""}
                onChange={(e) => updateComponentState("customCSS", e.target.value)}
                placeholder="e.g. text-shadow: 0 0 2px #000;"
              />
            </div>
          </div>
        </AccordionItem>
      </Accordion>
      
      <div className="mt-2">
        <Button
          color="danger"
          variant="light"
          size="sm"
          startContent={<Icon icon="lucide:refresh-ccw" />}
          onPress={resetToDefault}
          className="w-full"
        >
          Reset to Default
        </Button>
      </div>
    </div>
  );
};

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
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