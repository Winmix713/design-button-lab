
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { presets } from "@/lib/buttonStyles";
import { ButtonStyle } from "@/types/buttonTypes";
import { cn } from "@/lib/utils";

interface StylePanelProps {
  buttonStyle: ButtonStyle;
  onStyleChange: (newStyles: Partial<ButtonStyle>) => void;
  onReset: () => void;
  onApplyPreset: (preset: ButtonStyle) => void;
}

export function StylePanel({ buttonStyle, onStyleChange, onReset, onApplyPreset }: StylePanelProps) {
  const [stylesTab, setStylesTab] = useState("basic");
  
  // Group presets by category
  const presetsByCategory = presets.reduce((acc, preset) => {
    if (!acc[preset.category]) {
      acc[preset.category] = [];
    }
    acc[preset.category].push(preset);
    return acc;
  }, {} as Record<string, typeof presets>);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Style Settings</h3>
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-2">
          <h4 className="text-sm font-medium mb-2">Presets</h4>
          <ScrollArea className="h-[200px] rounded-md border">
            <div className="p-4">
              {Object.entries(presetsByCategory).map(([category, categoryPresets]) => (
                <div key={category} className="mb-4">
                  <h5 className="text-sm font-semibold mb-2">{category}</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryPresets.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        className="justify-start text-xs"
                        onClick={() => onApplyPreset(preset.style)}
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <div className="md:col-span-3">
          <Tabs value={stylesTab} onValueChange={setStylesTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="effects">Effects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buttonText">Button Text</Label>
                    <Input 
                      id="buttonText" 
                      value={buttonStyle.text} 
                      onChange={(e) => onStyleChange({ text: e.target.value })} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="buttonVariant">Variant</Label>
                    <Select 
                      value={buttonStyle.variant} 
                      onValueChange={(value) => onStyleChange({ variant: value as ButtonStyle['variant'] })}
                    >
                      <SelectTrigger id="buttonVariant">
                        <SelectValue placeholder="Select a variant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                        <SelectItem value="ghost">Ghost</SelectItem>
                        <SelectItem value="link">Link</SelectItem>
                        <SelectItem value="glass">Glass</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buttonSize">Size</Label>
                    <Select 
                      value={buttonStyle.size} 
                      onValueChange={(value) => onStyleChange({ size: value as ButtonStyle['size'] })}
                    >
                      <SelectTrigger id="buttonSize">
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xs">Extra Small</SelectItem>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                        <SelectItem value="xl">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="buttonShape">Shape</Label>
                    <Select 
                      value={buttonStyle.shape} 
                      onValueChange={(value) => onStyleChange({ shape: value as ButtonStyle['shape'] })}
                    >
                      <SelectTrigger id="buttonShape">
                        <SelectValue placeholder="Select a shape" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="rounded">Rounded</SelectItem>
                        <SelectItem value="pill">Pill</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={buttonStyle.textColor}
                        onChange={(e) => onStyleChange({ textColor: e.target.value })}
                        className="h-9 w-16 rounded cursor-pointer"
                      />
                      <Input 
                        value={buttonStyle.textColor}
                        onChange={(e) => onStyleChange({ textColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={buttonStyle.backgroundColor}
                        onChange={(e) => onStyleChange({ backgroundColor: e.target.value })}
                        disabled={buttonStyle.useGradient}
                        className={cn(
                          "h-9 w-16 rounded cursor-pointer",
                          buttonStyle.useGradient && "opacity-50"
                        )}
                      />
                      <Input 
                        value={buttonStyle.backgroundColor}
                        onChange={(e) => onStyleChange({ backgroundColor: e.target.value })}
                        disabled={buttonStyle.useGradient}
                        className={cn(
                          "flex-1",
                          buttonStyle.useGradient && "opacity-50"
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="buttonDisabled"
                    checked={buttonStyle.disabled}
                    onCheckedChange={(checked) => onStyleChange({ disabled: checked })}
                  />
                  <Label htmlFor="buttonDisabled">Disabled State</Label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4 pt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="padding">
                  <AccordionTrigger>Padding</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="paddingX">Horizontal Padding: {buttonStyle.paddingX}px</Label>
                        </div>
                        <Slider
                          id="paddingX"
                          value={[buttonStyle.paddingX]}
                          min={0}
                          max={40}
                          step={1}
                          onValueChange={(values) => onStyleChange({ paddingX: values[0] })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="paddingY">Vertical Padding: {buttonStyle.paddingY}px</Label>
                        </div>
                        <Slider
                          id="paddingY"
                          value={[buttonStyle.paddingY]}
                          min={0}
                          max={30}
                          step={1}
                          onValueChange={(values) => onStyleChange({ paddingY: values[0] })}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="text">
                  <AccordionTrigger>Text Style</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="fontWeight">Font Weight</Label>
                        <Select 
                          value={buttonStyle.fontWeight} 
                          onValueChange={(value) => onStyleChange({ fontWeight: value as ButtonStyle['fontWeight'] })}
                        >
                          <SelectTrigger id="fontWeight">
                            <SelectValue placeholder="Select a font weight" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="semibold">Semibold</SelectItem>
                            <SelectItem value="bold">Bold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="textAlign">Text Align</Label>
                        <Select 
                          value={buttonStyle.textAlign} 
                          onValueChange={(value) => onStyleChange({ textAlign: value as ButtonStyle['textAlign'] })}
                        >
                          <SelectTrigger id="textAlign">
                            <SelectValue placeholder="Select text alignment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="icon">
                  <AccordionTrigger>Icon</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="iconPosition">Icon Position</Label>
                        <Select 
                          value={buttonStyle.iconPosition} 
                          onValueChange={(value) => onStyleChange({ iconPosition: value as ButtonStyle['iconPosition'] })}
                        >
                          <SelectTrigger id="iconPosition">
                            <SelectValue placeholder="Select icon position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Icon</SelectItem>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {buttonStyle.iconPosition !== "none" && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="iconSize">Icon Size: {buttonStyle.iconSize}px</Label>
                          </div>
                          <Slider
                            id="iconSize"
                            value={[buttonStyle.iconSize]}
                            min={12}
                            max={32}
                            step={1}
                            onValueChange={(values) => onStyleChange({ iconSize: values[0] })}
                          />
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="border">
                  <AccordionTrigger>Border</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="borderWidth">Border Width: {buttonStyle.border.width}px</Label>
                        </div>
                        <Slider
                          id="borderWidth"
                          value={[buttonStyle.border.width]}
                          min={0}
                          max={10}
                          step={1}
                          onValueChange={(values) => onStyleChange({ 
                            border: { ...buttonStyle.border, width: values[0] } 
                          })}
                        />
                      </div>
                      
                      {buttonStyle.border.width > 0 && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="borderStyle">Border Style</Label>
                            <Select 
                              value={buttonStyle.border.style} 
                              onValueChange={(value) => onStyleChange({ 
                                border: { ...buttonStyle.border, style: value as ButtonStyle['border']['style'] } 
                              })}
                            >
                              <SelectTrigger id="borderStyle">
                                <SelectValue placeholder="Select border style" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="solid">Solid</SelectItem>
                                <SelectItem value="dashed">Dashed</SelectItem>
                                <SelectItem value="dotted">Dotted</SelectItem>
                                <SelectItem value="double">Double</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Border Color</Label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                value={buttonStyle.border.color}
                                onChange={(e) => onStyleChange({ 
                                  border: { ...buttonStyle.border, color: e.target.value } 
                                })}
                                className="h-9 w-16 rounded cursor-pointer"
                              />
                              <Input 
                                value={buttonStyle.border.color}
                                onChange={(e) => onStyleChange({ 
                                  border: { ...buttonStyle.border, color: e.target.value } 
                                })}
                                className="flex-1"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            
            <TabsContent value="effects" className="space-y-4 pt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="gradient">
                  <AccordionTrigger>Gradient</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="useGradient"
                          checked={buttonStyle.useGradient}
                          onCheckedChange={(checked) => onStyleChange({ useGradient: checked })}
                        />
                        <Label htmlFor="useGradient">Use Gradient Background</Label>
                      </div>
                      
                      {buttonStyle.useGradient && (
                        <>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Start Color</Label>
                              <div className="flex space-x-2">
                                <input
                                  type="color"
                                  value={buttonStyle.gradient[0].color}
                                  onChange={(e) => {
                                    const newGradient = [...buttonStyle.gradient];
                                    newGradient[0] = { ...newGradient[0], color: e.target.value };
                                    onStyleChange({ gradient: newGradient });
                                  }}
                                  className="h-9 w-16 rounded cursor-pointer"
                                />
                                <Input 
                                  value={buttonStyle.gradient[0].color}
                                  onChange={(e) => {
                                    const newGradient = [...buttonStyle.gradient];
                                    newGradient[0] = { ...newGradient[0], color: e.target.value };
                                    onStyleChange({ gradient: newGradient });
                                  }}
                                  className="flex-1"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>End Color</Label>
                              <div className="flex space-x-2">
                                <input
                                  type="color"
                                  value={buttonStyle.gradient[1].color}
                                  onChange={(e) => {
                                    const newGradient = [...buttonStyle.gradient];
                                    newGradient[1] = { ...newGradient[1], color: e.target.value };
                                    onStyleChange({ gradient: newGradient });
                                  }}
                                  className="h-9 w-16 rounded cursor-pointer"
                                />
                                <Input 
                                  value={buttonStyle.gradient[1].color}
                                  onChange={(e) => {
                                    const newGradient = [...buttonStyle.gradient];
                                    newGradient[1] = { ...newGradient[1], color: e.target.value };
                                    onStyleChange({ gradient: newGradient });
                                  }}
                                  className="flex-1"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label htmlFor="gradientDirection">Direction: {buttonStyle.gradientDirection}°</Label>
                              </div>
                              <Slider
                                id="gradientDirection"
                                value={[buttonStyle.gradientDirection]}
                                min={0}
                                max={360}
                                step={1}
                                onValueChange={(values) => onStyleChange({ gradientDirection: values[0] })}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="shadow">
                  <AccordionTrigger>Shadow</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="useShadow"
                          checked={buttonStyle.useShadow}
                          onCheckedChange={(checked) => onStyleChange({ useShadow: checked })}
                        />
                        <Label htmlFor="useShadow">Use Shadow</Label>
                      </div>
                      
                      {buttonStyle.useShadow && (
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="shadowOffsetX">Horizontal Offset: {buttonStyle.shadow.offsetX}px</Label>
                            </div>
                            <Slider
                              id="shadowOffsetX"
                              value={[buttonStyle.shadow.offsetX]}
                              min={-20}
                              max={20}
                              step={1}
                              onValueChange={(values) => onStyleChange({ 
                                shadow: { ...buttonStyle.shadow, offsetX: values[0] } 
                              })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="shadowOffsetY">Vertical Offset: {buttonStyle.shadow.offsetY}px</Label>
                            </div>
                            <Slider
                              id="shadowOffsetY"
                              value={[buttonStyle.shadow.offsetY]}
                              min={-20}
                              max={20}
                              step={1}
                              onValueChange={(values) => onStyleChange({ 
                                shadow: { ...buttonStyle.shadow, offsetY: values[0] } 
                              })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="shadowBlur">Blur Radius: {buttonStyle.shadow.blur}px</Label>
                            </div>
                            <Slider
                              id="shadowBlur"
                              value={[buttonStyle.shadow.blur]}
                              min={0}
                              max={50}
                              step={1}
                              onValueChange={(values) => onStyleChange({ 
                                shadow: { ...buttonStyle.shadow, blur: values[0] } 
                              })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="shadowSpread">Spread Radius: {buttonStyle.shadow.spread}px</Label>
                            </div>
                            <Slider
                              id="shadowSpread"
                              value={[buttonStyle.shadow.spread]}
                              min={-20}
                              max={20}
                              step={1}
                              onValueChange={(values) => onStyleChange({ 
                                shadow: { ...buttonStyle.shadow, spread: values[0] } 
                              })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Shadow Color</Label>
                            <div className="flex space-x-2">
                              <input
                                type="color"
                                value={buttonStyle.shadow.color.startsWith("rgba") 
                                  ? "#000000" 
                                  : buttonStyle.shadow.color}
                                onChange={(e) => onStyleChange({ 
                                  shadow: { ...buttonStyle.shadow, color: e.target.value } 
                                })}
                                className="h-9 w-16 rounded cursor-pointer"
                              />
                              <Input 
                                value={buttonStyle.shadow.color}
                                onChange={(e) => onStyleChange({ 
                                  shadow: { ...buttonStyle.shadow, color: e.target.value } 
                                })}
                                className="flex-1"
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 pt-2">
                            <Switch 
                              id="shadowInset"
                              checked={buttonStyle.shadow.inset}
                              onCheckedChange={(checked) => onStyleChange({ 
                                shadow: { ...buttonStyle.shadow, inset: checked } 
                              })}
                            />
                            <Label htmlFor="shadowInset">Inset Shadow</Label>
                          </div>
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="animations">
                  <AccordionTrigger>Animations</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="buttonAnimation">Animation</Label>
                        <Select 
                          value={buttonStyle.animation} 
                          onValueChange={(value) => onStyleChange({ animation: value as ButtonStyle['animation'] })}
                        >
                          <SelectTrigger id="buttonAnimation">
                            <SelectValue placeholder="Select an animation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="pulse">Pulse</SelectItem>
                            <SelectItem value="bounce">Bounce</SelectItem>
                            <SelectItem value="shake">Shake</SelectItem>
                            <SelectItem value="scale">Scale on Hover</SelectItem>
                            <SelectItem value="slideFade">Slide Fade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {buttonStyle.animation === "scale" && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="hoverScale">Hover Scale: {buttonStyle.hoverScale.toFixed(2)}</Label>
                          </div>
                          <Slider
                            id="hoverScale"
                            value={[buttonStyle.hoverScale * 100]}
                            min={100}
                            max={150}
                            step={1}
                            onValueChange={(values) => onStyleChange({ hoverScale: values[0] / 100 })}
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="opacity">Opacity: {buttonStyle.opacity.toFixed(2)}</Label>
                        </div>
                        <Slider
                          id="opacity"
                          value={[buttonStyle.opacity * 100]}
                          min={10}
                          max={100}
                          step={1}
                          onValueChange={(values) => onStyleChange({ opacity: values[0] / 100 })}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="useTransition"
                          checked={buttonStyle.useTransition}
                          onCheckedChange={(checked) => onStyleChange({ useTransition: checked })}
                        />
                        <Label htmlFor="useTransition">Use Transition Effects</Label>
                      </div>
                      
                      {buttonStyle.useTransition && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="transitionDuration">Duration: {buttonStyle.transitionDuration}ms</Label>
                          </div>
                          <Slider
                            id="transitionDuration"
                            value={[buttonStyle.transitionDuration]}
                            min={100}
                            max={1000}
                            step={50}
                            onValueChange={(values) => onStyleChange({ transitionDuration: values[0] })}
                          />
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="hover">
                  <AccordionTrigger>Hover State</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label>Hover Text Color</Label>
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={buttonStyle.textHoverColor}
                            onChange={(e) => onStyleChange({ textHoverColor: e.target.value })}
                            className="h-9 w-16 rounded cursor-pointer"
                          />
                          <Input 
                            value={buttonStyle.textHoverColor}
                            onChange={(e) => onStyleChange({ textHoverColor: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Hover Background Color</Label>
                        <div className="flex space-x-2">
                          <input
                            type="color"
                            value={buttonStyle.hoverBackgroundColor}
                            onChange={(e) => onStyleChange({ hoverBackgroundColor: e.target.value })}
                            disabled={buttonStyle.useGradient}
                            className={cn(
                              "h-9 w-16 rounded cursor-pointer",
                              buttonStyle.useGradient && "opacity-50"
                            )}
                          />
                          <Input 
                            value={buttonStyle.hoverBackgroundColor}
                            onChange={(e) => onStyleChange({ hoverBackgroundColor: e.target.value })}
                            disabled={buttonStyle.useGradient}
                            className={cn(
                              "flex-1",
                              buttonStyle.useGradient && "opacity-50"
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
