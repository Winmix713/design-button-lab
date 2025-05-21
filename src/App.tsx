import React from "react";
import { Navbar, NavbarContent, NavbarBrand, Button, Tooltip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ComponentWizardProvider } from "./context/component-wizard-context";
import { ComponentWizard } from "./components/component-wizard";
import { ThemeToggle } from "./components/theme-toggle";
import { KeyboardShortcutsModal } from "./components/keyboard-shortcuts-modal";
import { ExportImportModal } from "./components/export-import-modal";
import { useComponentRegistry } from "./hooks/use-component-registry";

function App() {
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = React.useState(false);
  const [exportImportMode, setExportImportMode] = React.useState<"export" | "import" | null>(null);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard shortcuts when ctrl/cmd is pressed
      if (!(e.ctrlKey || e.metaKey)) return;
      
      switch (e.key) {
        case 'k':
          e.preventDefault();
          setShowKeyboardShortcuts(true);
          break;
        case 'e':
          e.preventDefault();
          setExportImportMode("export");
          break;
        case 'i':
          e.preventDefault();
          setExportImportMode("import");
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ComponentWizardProvider>
      <AppContent 
        showKeyboardShortcuts={showKeyboardShortcuts}
        setShowKeyboardShortcuts={setShowKeyboardShortcuts}
        exportImportMode={exportImportMode}
        setExportImportMode={setExportImportMode}
      />
    </ComponentWizardProvider>
  );
}

// Separate component to use context hooks safely inside the provider
interface AppContentProps {
  showKeyboardShortcuts: boolean;
  setShowKeyboardShortcuts: (show: boolean) => void;
  exportImportMode: "export" | "import" | null;
  setExportImportMode: (mode: "export" | "import" | null) => void;
}

const AppContent: React.FC<AppContentProps> = ({
  showKeyboardShortcuts,
  setShowKeyboardShortcuts,
  exportImportMode,
  setExportImportMode
}) => {
  // Now this hook is safely used within the ComponentWizardProvider
  const { componentState, importSettings } = useComponentRegistry();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar className="border-b border-divider">
        <NavbarBrand>
          <h1 className="text-xl font-semibold">Component Wizard</h1>
        </NavbarBrand>
        <NavbarContent justify="end" className="gap-3">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="flat" size="sm">
                <Icon icon="lucide:settings" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Settings">
              <DropdownItem 
                key="export" 
                startContent={<Icon icon="lucide:download" />}
                onPress={() => setExportImportMode("export")}
              >
                Export Settings
              </DropdownItem>
              <DropdownItem 
                key="import" 
                startContent={<Icon icon="lucide:upload" />}
                onPress={() => setExportImportMode("import")}
              >
                Import Settings
              </DropdownItem>
              <DropdownItem 
                key="keyboard" 
                startContent={<Icon icon="lucide:keyboard" />}
                onPress={() => setShowKeyboardShortcuts(true)}
              >
                Keyboard Shortcuts
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          
          <ThemeToggle />
          
          <Tooltip content="Help">
            <Button isIconOnly variant="flat" size="sm">
              <Icon icon="lucide:help-circle" />
            </Button>
          </Tooltip>
        </NavbarContent>
      </Navbar>
      
      <main className="flex-1 p-4 md:p-6">
        <ComponentWizard />
      </main>
      
      <KeyboardShortcutsModal 
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
      
      {exportImportMode && (
        <ExportImportModal
          isOpen={!!exportImportMode}
          onClose={() => setExportImportMode(null)}
          componentState={componentState}
          importSettings={importSettings}
          mode={exportImportMode}
        />
      )}
    </div>
  );
};

export default App;