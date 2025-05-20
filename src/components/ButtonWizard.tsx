
import { ButtonPreview } from "./ButtonPreview";
import { StylePanel } from "./StylePanel";
import { CodePanel } from "./CodePanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useButtonWizard } from "@/contexts/ButtonWizardContext";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useToast } from "@/hooks/use-toast";
import { Undo2, Redo2 } from "lucide-react";

export function ButtonWizard() {
  const { 
    state: { buttonStyle, activeTab },
    setActiveTab,
    updateStyle,
    resetStyle,
    applyPreset,
    undo,
    redo,
    canUndo,
    canRedo
  } = useButtonWizard();
  const { toast } = useToast();

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="col-span-1 lg:col-span-2 p-6 bg-white dark:bg-slate-950 shadow-md rounded-xl">
        <Tabs defaultValue="style" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                Button Configuration
              </h2>
              <div className="flex space-x-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  disabled={!canUndo}
                  onClick={() => {
                    undo();
                    toast({
                      title: "Undo",
                      description: "Previous button style restored",
                    });
                  }}
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  disabled={!canRedo}
                  onClick={() => {
                    redo();
                    toast({
                      title: "Redo",
                      description: "Button style change reapplied",
                    });
                  }}
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <TabsList className="grid w-full sm:w-auto grid-cols-2 mt-4 sm:mt-0">
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="style" className="space-y-6">
            <StylePanel 
              buttonStyle={buttonStyle} 
              onStyleChange={updateStyle} 
              onReset={resetStyle}
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
              onClick={resetStyle}
              title="Reset (Alt+R)"
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
