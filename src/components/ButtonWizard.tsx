
import { useState, useEffect, useCallback } from "react";
import { ButtonPreview } from "./ButtonPreview";
import { StylePanel } from "./StylePanel";
import { CodePanel } from "./CodePanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { initialButtonStyles } from "@/lib/buttonStyles";
import { ButtonStyle } from "@/types/buttonTypes";

export function ButtonWizard() {
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>(initialButtonStyles);
  const [activeTab, setActiveTab] = useState<string>("style");
  const { toast } = useToast();

  const handleStyleChange = useCallback((newStyles: Partial<ButtonStyle>) => {
    setButtonStyle((prev) => ({ ...prev, ...newStyles }));
  }, []);

  const resetStyles = useCallback(() => {
    setButtonStyle(initialButtonStyles);
    toast({
      title: "Styles reset",
      description: "Button styles have been reset to default",
    });
  }, [toast]);

  const applyPreset = useCallback((preset: ButtonStyle) => {
    setButtonStyle(preset);
    toast({
      title: "Preset applied",
      description: "The selected preset has been applied to your button",
    });
  }, [toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="col-span-1 lg:col-span-2 p-6 bg-white dark:bg-slate-950 shadow-md rounded-xl">
        <Tabs defaultValue="style" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 sm:mb-0">
              Button Configuration
            </h2>
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="style" className="space-y-6">
            <StylePanel 
              buttonStyle={buttonStyle} 
              onStyleChange={handleStyleChange} 
              onReset={resetStyles}
              onApplyPreset={applyPreset}
            />
          </TabsContent>
          
          <TabsContent value="code">
            <CodePanel buttonStyle={buttonStyle} />
          </TabsContent>
        </Tabs>
      </Card>

      <Card className="col-span-1 p-6 bg-white dark:bg-slate-950 shadow-md rounded-xl">
        <div className="sticky top-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
            Button Preview
          </h2>
          <ButtonPreview buttonStyle={buttonStyle} />
          
          <div className="flex gap-2 mt-6">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={resetStyles}
            >
              Reset
            </Button>
            <Button 
              className="flex-1" 
              onClick={() => setActiveTab("code")}
            >
              Get Code
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
