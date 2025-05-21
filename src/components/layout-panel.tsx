import React from "react";
import { 
  Accordion, 
  AccordionItem, 
  Button, 
  Input, 
  Select, 
  SelectItem, 
  Switch,
  Divider,
  Tabs,
  Tab
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { ComponentState } from "../types/component-types";

interface LayoutPanelProps {
  componentState: ComponentState;
  updateComponentState: (key: string, value: any) => void;
  updateNestedComponentState: (section: string, key: string, value: any) => void;
  viewMode: "standard" | "advanced";
}

export const LayoutPanel: React.FC<LayoutPanelProps> = ({
  componentState,
  updateComponentState,
  updateNestedComponentState,
  viewMode
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Card Layout</h2>
      
      <Accordion isCompact selectionMode="multiple" defaultExpandedKeys={["structure", "content"]}>
        <AccordionItem key="structure" title="Structure" startContent={<Icon icon="lucide:layout" className="text-default-500" />}>
          <div className="flex flex-col gap-3 py-2">
            <div className="flex justify-between items-center">
              <p className="text-small">Header</p>
              <Switch 
                size="sm" 
                isSelected={componentState.showHeader}
                onValueChange={(isSelected) => updateComponentState("showHeader", isSelected)}
              />
            </div>
            
            {componentState.showHeader && (
              <div className="pl-4 border-l-2 border-divider">
                <div className="flex flex-col gap-2">
                  <Input
                    size="sm"
                    label="Title"
                    placeholder="Card Title"
                    value={componentState.headerTitle || ""}
                    onChange={(e) => updateComponentState("headerTitle", e.target.value)}
                  />
                  <Input
                    size="sm"
                    label="Subtitle"
                    placeholder="Card Subtitle (optional)"
                    value={componentState.headerSubtitle || ""}
                    onChange={(e) => updateComponentState("headerSubtitle", e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <Divider />
            
            <div className="flex justify-between items-center">
              <p className="text-small">Image</p>
              <Switch 
                size="sm" 
                isSelected={componentState.showImage}
                onValueChange={(isSelected) => updateComponentState("showImage", isSelected)}
              />
            </div>
            
            {componentState.showImage && (
              <div className="pl-4 border-l-2 border-divider">
                <div className="flex flex-col gap-2">
                  <Select
                    size="sm"
                    label="Position"
                    selectedKeys={[componentState.imagePosition || "top"]}
                    onChange={(e) => updateComponentState("imagePosition", e.target.value)}
                  >
                    <SelectItem key="top" value="top">Top</SelectItem>
                    <SelectItem key="bottom" value="bottom">Bottom</SelectItem>
                  </Select>
                  
                  <Select
                    size="sm"
                    label="Height"
                    selectedKeys={[componentState.imageHeight || "h-48"]}
                    onChange={(e) => updateComponentState("imageHeight", e.target.value)}
                  >
                    <SelectItem key="h-32" value="h-32">Small (128px)</SelectItem>
                    <SelectItem key="h-48" value="h-48">Medium (192px)</SelectItem>
                    <SelectItem key="h-64" value="h-64">Large (256px)</SelectItem>
                    <SelectItem key="h-80" value="h-80">Extra Large (320px)</SelectItem>
                  </Select>
                  
                  <Input
                    size="sm"
                    label="Image URL"
                    placeholder="https://example.com/image.jpg"
                    value={componentState.imageUrl || ""}
                    onChange={(e) => updateComponentState("imageUrl", e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <Divider />
            
            <div className="flex justify-between items-center">
              <p className="text-small">Footer</p>
              <Switch 
                size="sm" 
                isSelected={componentState.showFooter}
                onValueChange={(isSelected) => updateComponentState("showFooter", isSelected)}
              />
            </div>
            
            {viewMode === "advanced" && (
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-small">Layout Type</p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={componentState.layoutType === "standard" ? "solid" : "flat"}
                    color={componentState.layoutType === "standard" ? "primary" : "default"}
                    onPress={() => updateComponentState("layoutType", "standard")}
                  >
                    Standard
                  </Button>
                  <Button 
                    size="sm" 
                    variant={componentState.layoutType === "flex" ? "solid" : "flat"}
                    color={componentState.layoutType === "flex" ? "primary" : "default"}
                    onPress={() => updateComponentState("layoutType", "flex")}
                  >
                    Flex
                  </Button>
                  <Button 
                    size="sm" 
                    variant={componentState.layoutType === "grid" ? "solid" : "flat"}
                    color={componentState.layoutType === "grid" ? "primary" : "default"}
                    onPress={() => updateComponentState("layoutType", "grid")}
                  >
                    Grid
                  </Button>
                </div>
                
                {componentState.layoutType === "flex" && (
                  <div className="flex flex-col gap-2 mt-2">
                    <Select
                      size="sm"
                      label="Direction"
                      selectedKeys={[componentState.flexDirection || "column"]}
                      onChange={(e) => updateComponentState("flexDirection", e.target.value)}
                    >
                      <SelectItem key="row" value="row">Row</SelectItem>
                      <SelectItem key="column" value="column">Column</SelectItem>
                      <SelectItem key="row-reverse" value="row-reverse">Row Reverse</SelectItem>
                      <SelectItem key="column-reverse" value="column-reverse">Column Reverse</SelectItem>
                    </Select>
                    
                    <Select
                      size="sm"
                      label="Align Items"
                      selectedKeys={[componentState.alignItems || "stretch"]}
                      onChange={(e) => updateComponentState("alignItems", e.target.value)}
                    >
                      <SelectItem key="stretch" value="stretch">Stretch</SelectItem>
                      <SelectItem key="flex-start" value="flex-start">Start</SelectItem>
                      <SelectItem key="center" value="center">Center</SelectItem>
                      <SelectItem key="flex-end" value="flex-end">End</SelectItem>
                    </Select>
                    
                    <Select
                      size="sm"
                      label="Justify Content"
                      selectedKeys={[componentState.justifyContent || "flex-start"]}
                      onChange={(e) => updateComponentState("justifyContent", e.target.value)}
                    >
                      <SelectItem key="flex-start" value="flex-start">Start</SelectItem>
                      <SelectItem key="center" value="center">Center</SelectItem>
                      <SelectItem key="flex-end" value="flex-end">End</SelectItem>
                      <SelectItem key="space-between" value="space-between">Space Between</SelectItem>
                      <SelectItem key="space-around" value="space-around">Space Around</SelectItem>
                    </Select>
                  </div>
                )}
                
                {componentState.layoutType === "grid" && (
                  <div className="flex flex-col gap-2 mt-2">
                    <Select
                      size="sm"
                      label="Columns"
                      selectedKeys={[componentState.gridColumns || "1"]}
                      onChange={(e) => updateComponentState("gridColumns", e.target.value)}
                    >
                      <SelectItem key="1" value="1">1 Column</SelectItem>
                      <SelectItem key="2" value="2">2 Columns</SelectItem>
                      <SelectItem key="3" value="3">3 Columns</SelectItem>
                      <SelectItem key="4" value="4">4 Columns</SelectItem>
                    </Select>
                    
                    <Input
                      size="sm"
                      label="Gap"
                      placeholder="16px"
                      value={componentState.gridGap || ""}
                      onChange={(e) => updateComponentState("gridGap", e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </AccordionItem>
        
        <AccordionItem key="content" title="Content" startContent={<Icon icon="lucide:file-text" className="text-default-500" />}>
          <div className="flex flex-col gap-3 py-2">
            <div className="flex flex-col gap-2">
              <p className="text-small">Body Content</p>
              <Input
                size="sm"
                type="text"
                value={componentState.bodyContent || ""}
                onChange={(e) => updateComponentState("bodyContent", e.target.value)}
                placeholder="Card body content"
              />
            </div>
            
            {componentState.showFooter && (
              <div className="flex flex-col gap-2">
                <p className="text-small">Footer Content</p>
                <Input
                  size="sm"
                  type="text"
                  value={componentState.footerContent || ""}
                  onChange={(e) => updateComponentState("footerContent", e.target.value)}
                  placeholder="Card footer content"
                />
              </div>
            )}
            
            {viewMode === "advanced" && (
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-small">Add Component</p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="flat"
                    startContent={<Icon icon="lucide:type" />}
                    onPress={() => {
                      // Add text component logic
                    }}
                  >
                    Text
                  </Button>
                  <Button 
                    size="sm" 
                    variant="flat"
                    startContent={<Icon icon="lucide:image" />}
                    onPress={() => {
                      // Add image component logic
                    }}
                  >
                    Image
                  </Button>
                  <Button 
                    size="sm" 
                    variant="flat"
                    startContent={<Icon icon="lucide:square" />}
                    onPress={() => {
                      // Add button component logic
                    }}
                  >
                    Button
                  </Button>
                </div>
              </div>
            )}
          </div>
        </AccordionItem>
        
        {viewMode === "advanced" && (
          <AccordionItem key="responsive" title="Responsive Behavior" startContent={<Icon icon="lucide:smartphone" className="text-default-500" />}>
            <div className="flex flex-col gap-3 py-2">
              <div className="flex justify-between items-center">
                <p className="text-small">Enable Responsive Layout</p>
                <Switch 
                  size="sm" 
                  isSelected={componentState.isResponsive}
                  onValueChange={(isSelected) => updateComponentState("isResponsive", isSelected)}
                />
              </div>
              
              {componentState.isResponsive && (
                <div className="flex flex-col gap-2">
                  <Tabs aria-label="Responsive Breakpoints">
                    <Tab key="mobile" title="Mobile">
                      <div className="py-2 flex flex-col gap-2">
                        <Input
                          size="sm"
                          label="Width"
                          placeholder="100%"
                          value={componentState.mobileWidth || ""}
                          onChange={(e) => updateComponentState("mobileWidth", e.target.value)}
                        />
                        <Input
                          size="sm"
                          label="Padding"
                          placeholder="16px"
                          value={componentState.mobilePadding || ""}
                          onChange={(e) => updateComponentState("mobilePadding", e.target.value)}
                        />
                      </div>
                    </Tab>
                    <Tab key="tablet" title="Tablet">
                      <div className="py-2 flex flex-col gap-2">
                        <Input
                          size="sm"
                          label="Width"
                          placeholder="80%"
                          value={componentState.tabletWidth || ""}
                          onChange={(e) => updateComponentState("tabletWidth", e.target.value)}
                        />
                        <Input
                          size="sm"
                          label="Padding"
                          placeholder="24px"
                          value={componentState.tabletPadding || ""}
                          onChange={(e) => updateComponentState("tabletPadding", e.target.value)}
                        />
                      </div>
                    </Tab>
                    <Tab key="desktop" title="Desktop">
                      <div className="py-2 flex flex-col gap-2">
                        <Input
                          size="sm"
                          label="Max Width"
                          placeholder="1200px"
                          value={componentState.desktopMaxWidth || ""}
                          onChange={(e) => updateComponentState("desktopMaxWidth", e.target.value)}
                        />
                        <Input
                          size="sm"
                          label="Padding"
                          placeholder="32px"
                          value={componentState.desktopPadding || ""}
                          onChange={(e) => updateComponentState("desktopPadding", e.target.value)}
                        />
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              )}
            </div>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};