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
import { ComponentState } from "../types/component-types";
import { Preset } from "../types/preset-types";
import { ColorPicker } from "./color-picker";

interface CardStylePanelProps {
  componentState: ComponentState;
  updateComponentState: (key: string, value: any) => void;
  updateComponentStyle: (key: string, value: any) => void;
  resetToDefault: () => void;
  applyPreset: (preset: Preset) => void;
  presets: Preset[];
  viewMode: "standard" | "advanced";
}

export const CardStylePanel: React.FC<CardStylePanelProps> = ({
  componentState,
  updateComponentState,
  updateComponentStyle,
  resetToDefault,
  applyPreset,
  presets,
  viewMode
}) => {
  const [selectedPresetCategory, setSelectedPresetCategory] = React.useState<string>("all");
  
  const filteredPresets = React.useMemo(() => {
    if (selectedPresetCategory === "all") return presets;
    return presets.filter(preset => preset.category === selectedPresetCategory);
  }, [presets, selectedPresetCategory]);

  const presetCategories = React.useMemo(() => {
    const categories = new Set<string>();
    presets.forEach(preset => categories.add(preset.category));
    return Array.from(categories);
  }, [presets]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Card Presets</h2>
        <div className="flex gap-2 mb-2">
          <Select
            size="sm"
            placeholder="Filter by category"
            selectedKeys={[selectedPresetCategory]}
            onChange={(e) => setSelectedPresetCategory(e.target.value)}
            className="flex-1"
          >
            <SelectItem key="all" value="all">All Presets</SelectItem>
            {presetCategories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </Select>
          
          {viewMode === "advanced" && (
            <Button 
              size="sm" 
              variant="flat" 
              startContent={<Icon icon="lucide:save" />}
            >
              Save
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto p-1">
          {filteredPresets.map((preset, index) => (
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
          ))}
        </div>
      </div>
      
      <Divider />
      
      <Accordion isCompact selectionMode="multiple" defaultExpandedKeys={["appearance", "dimensions"]}>
        <AccordionItem key="appearance" title="Appearance" startContent={<Icon icon="lucide:palette" className="text-default-500" />}>
          <div className="flex flex-col gap-3 py-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-small mb-1">Background</p>
                <ColorPicker
                  color={componentState.style.backgroundColor}
                  onChange={(color) => updateComponentStyle("backgroundColor", color)}
                />
              </div>
              <div>
                <p className="text-small mb-1">Border Color</p>
                <ColorPicker
                  color={componentState.style.borderColor}
                  onChange={(color) => updateComponentStyle("borderColor", color)}
                />
              </div>
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
            
            {viewMode === "advanced" && (
              <div className="flex flex-col gap-2">
                <p className="text-small">Background Type</p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={componentState.backgroundType === "solid" ? "solid" : "flat"}
                    color={componentState.backgroundType === "solid" ? "primary" : "default"}
                    onPress={() => updateComponentState("backgroundType", "solid")}
                  >
                    Solid
                  </Button>
                  <Button 
                    size="sm" 
                    variant={componentState.backgroundType === "gradient" ? "solid" : "flat"}
                    color={componentState.backgroundType === "gradient" ? "primary" : "default"}
                    onPress={() => updateComponentState("backgroundType", "gradient")}
                  >
                    Gradient
                  </Button>
                  <Button 
                    size="sm" 
                    variant={componentState.backgroundType === "image" ? "solid" : "flat"}
                    color={componentState.backgroundType === "image" ? "primary" : "default"}
                    onPress={() => updateComponentState("backgroundType", "image")}
                  >
                    Image
                  </Button>
                </div>
                
                {componentState.backgroundType === "gradient" && (
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-tiny text-default-500">From</p>
                        <ColorPicker
                          color={componentState.gradientFrom || "#3b82f6"}
                          onChange={(color) => updateComponentState("gradientFrom", color)}
                        />
                      </div>
                      <div>
                        <p className="text-tiny text-default-500">To</p>
                        <ColorPicker
                          color={componentState.gradientTo || "#8b5cf6"}
                          onChange={(color) => updateComponentState("gradientTo", color)}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-tiny text-default-500">Direction</p>
                      <Select
                        size="sm"
                        selectedKeys={[componentState.gradientDirection || "to-r"]}
                        onChange={(e) => updateComponentState("gradientDirection", e.target.value)}
                      >
                        <SelectItem key="to-r" value="to-r">Left to Right</SelectItem>
                        <SelectItem key="to-l" value="to-l">Right to Left</SelectItem>
                        <SelectItem key="to-b" value="to-b">Top to Bottom</SelectItem>
                        <SelectItem key="to-t" value="to-t">Bottom to Top</SelectItem>
                        <SelectItem key="to-tr" value="to-tr">Top Left to Bottom Right</SelectItem>
                        <SelectItem key="to-bl" value="to-bl">Top Right to Bottom Left</SelectItem>
                      </Select>
                    </div>
                  </div>
                )}
                
                {componentState.backgroundType === "image" && (
                  <div className="flex flex-col gap-2 mt-2">
                    <Input
                      size="sm"
                      label="Image URL"
                      placeholder="https://example.com/image.jpg"
                      value={componentState.backgroundImage || ""}
                      onChange={(e) => updateComponentState("backgroundImage", e.target.value)}
                    />
                    <div>
                      <p className="text-tiny text-default-500">Overlay Color</p>
                      <ColorPicker
                        color={componentState.backgroundOverlay || "rgba(0,0,0,0.5)"}
                        onChange={(color) => updateComponentState("backgroundOverlay", color)}
                      />
                    </div>
                    <div>
                      <p className="text-tiny text-default-500">Background Size</p>
                      <Select
                        size="sm"
                        selectedKeys={[componentState.backgroundSize || "cover"]}
                        onChange={(e) => updateComponentState("backgroundSize", e.target.value)}
                      >
                        <SelectItem key="cover" value="cover">Cover</SelectItem>
                        <SelectItem key="contain" value="contain">Contain</SelectItem>
                        <SelectItem key="auto" value="auto">Auto</SelectItem>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            )}
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
                  placeholder="auto, 100%, 400px"
                />
              </div>
              <div>
                <p className="text-small mb-1">Height</p>
                <Input
                  size="sm"
                  type="text"
                  value={componentState.style.height || ""}
                  onChange={(e) => updateComponentStyle("height", e.target.value)}
                  placeholder="auto, 100%, 300px"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-small mb-1">Min Width</p>
                <Input
                  size="sm"
                  type="text"
                  value={componentState.style.minWidth || ""}
                  onChange={(e) => updateComponentStyle("minWidth", e.target.value)}
                  placeholder="auto, 200px"
                />
              </div>
              <div>
                <p className="text-small mb-1">Max Width</p>
                <Input
                  size="sm"
                  type="text"
                  value={componentState.style.maxWidth || ""}
                  onChange={(e) => updateComponentStyle("maxWidth", e.target.value)}
                  placeholder="none, 100%, 500px"
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
            
            {viewMode === "advanced" && (
              <div className="flex flex-col gap-2">
                <p className="text-small">Aspect Ratio</p>
                <Select
                  size="sm"
                  selectedKeys={[componentState.aspectRatio || "auto"]}
                  onChange={(e) => updateComponentState("aspectRatio", e.target.value)}
                >
                  <SelectItem key="auto" value="auto">Auto</SelectItem>
                  <SelectItem key="square" value="1/1">Square (1:1)</SelectItem>
                  <SelectItem key="video" value="16/9">Video (16:9)</SelectItem>
                  <SelectItem key="portrait" value="3/4">Portrait (3:4)</SelectItem>
                  <SelectItem key="landscape" value="4/3">Landscape (4:3)</SelectItem>
                  <SelectItem key="ultrawide" value="21/9">Ultrawide (21:9)</SelectItem>
                </Select>
              </div>
            )}
          </div>
        </AccordionItem>
        
        {viewMode === "advanced" && (
          <AccordionItem key="effects" title="Effects & Animation" startContent={<Icon icon="lucide:sparkles" className="text-default-500" />}>
            <div className="flex flex-col gap-3 py-2">
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
                    value={parseFloat(componentState.hoverStyle?.transform?.replace("scale(", "").replace(")", "")) || 1}
                    onChange={(value) => updateComponentState("hoverStyle", {
                      ...componentState.hoverStyle,
                      transform: `scale(${value})`
                    })}
                    className="flex-1"
                  />
                  <span className="text-small w-16 text-right">
                    {parseFloat(componentState.hoverStyle?.transform?.replace("scale(", "").replace(")", ""))?.toFixed(2) || "1.00"}x
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-small mb-1">Hover Background</p>
                  <ColorPicker
                    color={componentState.hoverStyle?.backgroundColor}
                    onChange={(color) => updateComponentState("hoverStyle", {
                      ...componentState.hoverStyle,
                      backgroundColor: color
                    })}
                  />
                </div>
                <div>
                  <p className="text-small mb-1">Hover Shadow</p>
                  <Select
                    size="sm"
                    selectedKeys={[componentState.hoverStyle?.boxShadow || "none"]}
                    onChange={(e) => updateComponentState("hoverStyle", {
                      ...componentState.hoverStyle,
                      boxShadow: e.target.value
                    })}
                  >
                    <SelectItem key="none" value="none">None</SelectItem>
                    <SelectItem key="sm" value="0 1px 2px rgba(0,0,0,0.05)">Small</SelectItem>
                    <SelectItem key="md" value="0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)">Medium</SelectItem>
                    <SelectItem key="lg" value="0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)">Large</SelectItem>
                    <SelectItem key="xl" value="0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)">Extra Large</SelectItem>
                  </Select>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <p className="text-small">Special Effects</p>
                <div className="flex flex-wrap gap-2">
                  <Checkbox
                    isSelected={componentState.isHoverable}
                    onValueChange={(isSelected) => updateComponentState("isHoverable", isSelected)}
                    size="sm"
                  >
                    Hoverable
                  </Checkbox>
                  
                  <Checkbox
                    isSelected={componentState.isPressable}
                    onValueChange={(isSelected) => updateComponentState("isPressable", isSelected)}
                    size="sm"
                  >
                    Pressable
                  </Checkbox>
                  
                  <Checkbox
                    isSelected={componentState.isBlurred}
                    onValueChange={(isSelected) => updateComponentState("isBlurred", isSelected)}
                    size="sm"
                  >
                    Blur Background
                  </Checkbox>
                </div>
              </div>
            </div>
          </AccordionItem>
        )}
        
        {viewMode === "advanced" && (
          <AccordionItem key="advanced" title="Advanced" startContent={<Icon icon="lucide:settings" className="text-default-500" />}>
            <div className="flex flex-col gap-3 py-2">
              <div className="flex flex-col gap-1">
                <p className="text-small">CSS Filters</p>
                <Select
                  size="sm"
                  selectedKeys={[componentState.filter || "none"]}
                  onChange={(e) => updateComponentState("filter", e.target.value)}
                >
                  <SelectItem key="none" value="none">None</SelectItem>
                  <SelectItem key="blur" value="blur(4px)">Blur</SelectItem>
                  <SelectItem key="grayscale" value="grayscale(100%)">Grayscale</SelectItem>
                  <SelectItem key="sepia" value="sepia(100%)">Sepia</SelectItem>
                  <SelectItem key="invert" value="invert(100%)">Invert</SelectItem>
                </Select>
              </div>
              
              <div className="flex flex-col gap-1">
                <p className="text-small">Custom CSS</p>
                <Input
                  size="sm"
                  type="text"
                  value={componentState.customCSS || ""}
                  onChange={(e) => updateComponentState("customCSS", e.target.value)}
                  placeholder="e.g. transform: rotate(5deg);"
                />
              </div>
              
              <div className="flex flex-col gap-1">
                <p className="text-small">Z-Index</p>
                <Input
                  size="sm"
                  type="number"
                  value={componentState.style.zIndex || ""}
                  onChange={(e) => updateComponentStyle("zIndex", e.target.value)}
                  placeholder="auto, 10, 100"
                />
              </div>
              
              <div className="flex flex-col gap-1">
                <p className="text-small">Overflow</p>
                <Select
                  size="sm"
                  selectedKeys={[componentState.style.overflow || "visible"]}
                  onChange={(e) => updateComponentStyle("overflow", e.target.value)}
                >
                  <SelectItem key="visible" value="visible">Visible</SelectItem>
                  <SelectItem key="hidden" value="hidden">Hidden</SelectItem>
                  <SelectItem key="scroll" value="scroll">Scroll</SelectItem>
                  <SelectItem key="auto" value="auto">Auto</SelectItem>
                </Select>
              </div>
            </div>
          </AccordionItem>
        )}
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