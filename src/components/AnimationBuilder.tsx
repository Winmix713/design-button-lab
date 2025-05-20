
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  CustomAnimation, 
  KeyframeStep, 
  EasingFunction,
  animationPresets,
  defaultCustomAnimation
} from "@/lib/animations";
import { ButtonStyle } from "@/types/buttonTypes";

interface AnimationBuilderProps {
  buttonStyle: ButtonStyle;
  onSaveAnimation: (animation: CustomAnimation) => void;
  onClose: () => void;
}

export function AnimationBuilder({ buttonStyle, onSaveAnimation, onClose }: AnimationBuilderProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("keyframes");
  const [currentAnimation, setCurrentAnimation] = useState<CustomAnimation>({...defaultCustomAnimation});
  const [selectedKeyframeIndex, setSelectedKeyframeIndex] = useState<number>(0);
  
  // Handle animation name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentAnimation(prev => ({
      ...prev,
      name: e.target.value
    }));
  };
  
  // Handle animation duration change
  const handleDurationChange = (value: number[]) => {
    setCurrentAnimation(prev => ({
      ...prev,
      duration: value[0]
    }));
  };
  
  // Handle easing function change
  const handleEasingChange = (value: string) => {
    setCurrentAnimation(prev => ({
      ...prev,
      easing: value as EasingFunction
    }));
  };
  
  // Handle iteration count change
  const handleIterationCountChange = (value: string) => {
    setCurrentAnimation(prev => ({
      ...prev,
      iterationCount: value === 'infinite' ? 'infinite' : parseInt(value)
    }));
  };
  
  // Handle direction change
  const handleDirectionChange = (value: string) => {
    setCurrentAnimation(prev => ({
      ...prev,
      direction: value as 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
    }));
  };
  
  // Handle cubic bezier change
  const handleCubicBezierChange = (index: number, value: number) => {
    setCurrentAnimation(prev => {
      const newBezier = [...(prev.cubicBezier || [0.42, 0, 0.58, 1])];
      newBezier[index] = value;
      return {
        ...prev,
        cubicBezier: newBezier as [number, number, number, number]
      };
    });
  };
  
  // Handle adding a new keyframe
  const handleAddKeyframe = () => {
    const lastKeyframe = currentAnimation.keyframes[currentAnimation.keyframes.length - 1];
    const newPercent = lastKeyframe ? Math.min(100, lastKeyframe.percent + 25) : 50;
    
    const newKeyframe: KeyframeStep = {
      percent: newPercent,
      properties: { ...lastKeyframe.properties }
    };
    
    setCurrentAnimation(prev => ({
      ...prev,
      keyframes: [...prev.keyframes, newKeyframe]
    }));
    
    setSelectedKeyframeIndex(currentAnimation.keyframes.length);
  };
  
  // Handle deleting a keyframe
  const handleDeleteKeyframe = (index: number) => {
    if (currentAnimation.keyframes.length <= 2) {
      toast({
        title: "Cannot delete keyframe",
        description: "Animations must have at least two keyframes",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentAnimation(prev => ({
      ...prev,
      keyframes: prev.keyframes.filter((_, i) => i !== index)
    }));
    
    if (selectedKeyframeIndex >= index && selectedKeyframeIndex > 0) {
      setSelectedKeyframeIndex(selectedKeyframeIndex - 1);
    }
  };
  
  // Handle keyframe percent change
  const handleKeyframePercentChange = (index: number, value: number) => {
    setCurrentAnimation(prev => {
      const newKeyframes = [...prev.keyframes];
      newKeyframes[index] = {
        ...newKeyframes[index],
        percent: Math.max(0, Math.min(100, value))
      };
      
      // Sort keyframes by percent
      return {
        ...prev,
        keyframes: newKeyframes.sort((a, b) => a.percent - b.percent)
      };
    });
  };
  
  // Handle keyframe property change
  const handleKeyframePropertyChange = (
    index: number, 
    property: string, 
    value: string | number
  ) => {
    setCurrentAnimation(prev => {
      const newKeyframes = [...prev.keyframes];
      newKeyframes[index] = {
        ...newKeyframes[index],
        properties: {
          ...newKeyframes[index].properties,
          [property]: value
        }
      };
      
      return {
        ...prev,
        keyframes: newKeyframes
      };
    });
  };
  
  // Apply a preset animation
  const handleApplyPreset = (preset: CustomAnimation) => {
    setCurrentAnimation({
      ...preset,
      name: `${preset.name}-custom`
    });
    
    toast({
      title: "Preset applied",
      description: `Applied "${preset.name}" animation preset`
    });
  };
  
  // Save the animation and close the builder
  const handleSave = () => {
    // Validate animation
    if (currentAnimation.name.trim() === '') {
      toast({
        title: "Invalid animation name",
        description: "Please provide a valid animation name",
        variant: "destructive"
      });
      return;
    }
    
    if (currentAnimation.keyframes.length < 2) {
      toast({
        title: "Not enough keyframes",
        description: "Animations must have at least two keyframes",
        variant: "destructive"
      });
      return;
    }
    
    onSaveAnimation(currentAnimation);
    toast({
      title: "Animation saved",
      description: `Custom animation "${currentAnimation.name}" has been saved`
    });
    onClose();
  };
  
  // Get the selected keyframe
  const selectedKeyframe = currentAnimation.keyframes[selectedKeyframeIndex] || currentAnimation.keyframes[0];
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-slate-950 shadow-lg rounded-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
              Animation Builder
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Animation
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left side - Animation preview */}
            <div className="w-full md:w-1/3 space-y-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg flex flex-col items-center justify-center h-60">
                <button
                  className={`px-4 py-2 rounded-md bg-blue-500 text-white`}
                  style={{
                    animation: `${currentAnimation.name} ${currentAnimation.duration}ms ${currentAnimation.easing} ${currentAnimation.iterationCount} ${currentAnimation.direction}`
                  }}
                >
                  {buttonStyle.text || 'Button'}
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="animation-name">Animation Name</Label>
                  <Input
                    id="animation-name"
                    value={currentAnimation.name}
                    onChange={handleNameChange}
                    placeholder="Enter animation name"
                  />
                </div>
                
                <div className="space-y-1">
                  <Label>Duration: {currentAnimation.duration}ms</Label>
                  <Slider
                    value={[currentAnimation.duration]}
                    min={100}
                    max={5000}
                    step={100}
                    onValueChange={handleDurationChange}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="easing">Easing</Label>
                    <Select
                      value={currentAnimation.easing}
                      onValueChange={handleEasingChange}
                    >
                      <SelectTrigger id="easing">
                        <SelectValue placeholder="Select easing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="ease">Ease</SelectItem>
                        <SelectItem value="ease-in">Ease In</SelectItem>
                        <SelectItem value="ease-out">Ease Out</SelectItem>
                        <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                        <SelectItem value="cubic-bezier">Cubic Bezier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="iterations">Iterations</Label>
                    <Select
                      value={String(currentAnimation.iterationCount)}
                      onValueChange={handleIterationCountChange}
                    >
                      <SelectTrigger id="iterations">
                        <SelectValue placeholder="Iterations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="infinite">Infinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="direction">Direction</Label>
                  <Select
                    value={currentAnimation.direction}
                    onValueChange={handleDirectionChange}
                  >
                    <SelectTrigger id="direction">
                      <SelectValue placeholder="Direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="reverse">Reverse</SelectItem>
                      <SelectItem value="alternate">Alternate</SelectItem>
                      <SelectItem value="alternate-reverse">Alternate Reverse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {currentAnimation.easing === 'cubic-bezier' && (
                  <div className="space-y-3">
                    <Label>Cubic Bezier Control Points</Label>
                    {(currentAnimation.cubicBezier || [0.42, 0, 0.58, 1]).map((value, index) => (
                      <div key={index} className="space-y-1">
                        <Label>P{index + 1}: {value.toFixed(2)}</Label>
                        <Slider
                          value={[value]}
                          min={0}
                          max={1}
                          step={0.01}
                          onValueChange={(newValue) => handleCubicBezierChange(index, newValue[0])}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Right side - Animation editor */}
            <div className="w-full md:w-2/3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="keyframes">Keyframes</TabsTrigger>
                  <TabsTrigger value="presets">Animation Presets</TabsTrigger>
                </TabsList>
                
                <TabsContent value="keyframes" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Keyframes</h3>
                    <Button size="sm" onClick={handleAddKeyframe}>
                      Add Keyframe
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Keyframe list */}
                    <div className="col-span-1 md:col-span-2 border rounded-lg p-2">
                      <ScrollArea className="h-80">
                        {currentAnimation.keyframes.map((keyframe, index) => (
                          <div 
                            key={index}
                            className={`p-2 mb-2 rounded-md cursor-pointer ${selectedKeyframeIndex === index ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'}`}
                            onClick={() => setSelectedKeyframeIndex(index)}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{keyframe.percent}%</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteKeyframe(index);
                                }}
                              >
                                ✕
                              </Button>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {Object.entries(keyframe.properties).map(([key, value]) => (
                                <div key={key}>{key}: {value}</div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                    
                    {/* Keyframe editor */}
                    <div className="col-span-1 md:col-span-3 border rounded-lg p-4">
                      {selectedKeyframe && (
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <Label>Keyframe at {selectedKeyframe.percent}%</Label>
                            <Slider
                              value={[selectedKeyframe.percent]}
                              min={0}
                              max={100}
                              step={1}
                              onValueChange={(value) => handleKeyframePercentChange(selectedKeyframeIndex, value[0])}
                            />
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-medium">Properties</h4>
                            
                            <div className="space-y-1">
                              <Label htmlFor="transform">Transform</Label>
                              <Input
                                id="transform"
                                value={selectedKeyframe.properties.transform || ''}
                                onChange={(e) => handleKeyframePropertyChange(selectedKeyframeIndex, 'transform', e.target.value)}
                                placeholder="e.g., scale(1.1) rotate(10deg)"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <Label htmlFor="opacity">Opacity</Label>
                              <div className="flex items-center space-x-2">
                                <Slider
                                  value={[selectedKeyframe.properties.opacity !== undefined ? selectedKeyframe.properties.opacity : 1]}
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  onValueChange={(value) => handleKeyframePropertyChange(selectedKeyframeIndex, 'opacity', value[0])}
                                />
                                <span className="w-12 text-center">
                                  {selectedKeyframe.properties.opacity !== undefined ? selectedKeyframe.properties.opacity : 1}
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <Label htmlFor="bgcolor">Background Color</Label>
                              <div className="flex items-center space-x-2">
                                <Input
                                  id="bgcolor"
                                  type="color"
                                  value={selectedKeyframe.properties.backgroundColor || '#3b82f6'}
                                  onChange={(e) => handleKeyframePropertyChange(selectedKeyframeIndex, 'backgroundColor', e.target.value)}
                                  className="w-12 h-8 p-0"
                                />
                                <Input
                                  value={selectedKeyframe.properties.backgroundColor || ''}
                                  onChange={(e) => handleKeyframePropertyChange(selectedKeyframeIndex, 'backgroundColor', e.target.value)}
                                  placeholder="e.g., #3b82f6 or rgba(59, 130, 246, 1)"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <Label htmlFor="color">Text Color</Label>
                              <div className="flex items-center space-x-2">
                                <Input
                                  id="color"
                                  type="color"
                                  value={selectedKeyframe.properties.color || '#ffffff'}
                                  onChange={(e) => handleKeyframePropertyChange(selectedKeyframeIndex, 'color', e.target.value)}
                                  className="w-12 h-8 p-0"
                                />
                                <Input
                                  value={selectedKeyframe.properties.color || ''}
                                  onChange={(e) => handleKeyframePropertyChange(selectedKeyframeIndex, 'color', e.target.value)}
                                  placeholder="e.g., #ffffff or rgba(255, 255, 255, 1)"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <Label htmlFor="borderColor">Border Color</Label>
                              <div className="flex items-center space-x-2">
                                <Input
                                  id="borderColor"
                                  type="color"
                                  value={selectedKeyframe.properties.borderColor || '#3b82f6'}
                                  onChange={(e) => handleKeyframePropertyChange(selectedKeyframeIndex, 'borderColor', e.target.value)}
                                  className="w-12 h-8 p-0"
                                />
                                <Input
                                  value={selectedKeyframe.properties.borderColor || ''}
                                  onChange={(e) => handleKeyframePropertyChange(selectedKeyframeIndex, 'borderColor', e.target.value)}
                                  placeholder="e.g., #3b82f6 or rgba(59, 130, 246, 1)"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <Label htmlFor="boxShadow">Box Shadow</Label>
                              <Input
                                id="boxShadow"
                                value={selectedKeyframe.properties.boxShadow || ''}
                                onChange={(e) => handleKeyframePropertyChange(selectedKeyframeIndex, 'boxShadow', e.target.value)}
                                placeholder="e.g., 0 4px 6px rgba(0, 0, 0, 0.1)"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="presets">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Animation Presets</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {animationPresets.map((preset, index) => (
                        <Card key={index} className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => handleApplyPreset(preset.animation)}>
                          <div className="flex flex-col h-full">
                            <div className="font-medium mb-2">{preset.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                              {preset.category}
                            </div>
                            <div className="flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md p-4">
                              <div
                                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                style={{
                                  animation: `${preset.animation.name} ${preset.animation.duration}ms ${preset.animation.easing} ${preset.animation.iterationCount} ${preset.animation.direction}`
                                }}
                              >
                                Button
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
