import React from "react";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  Tabs, 
  Tab, 
  Textarea,
  Input
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { ComponentState } from "../types/component-types";

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  componentState: ComponentState;
  importSettings: (settings: ComponentState) => void;
  mode: "export" | "import";
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  componentState,
  importSettings,
  mode
}) => {
  const [activeTab, setActiveTab] = React.useState<string>("json");
  const [importData, setImportData] = React.useState<string>("");
  const [importError, setImportError] = React.useState<string>("");
  const [copied, setCopied] = React.useState<boolean>(false);
  const [importFile, setImportFile] = React.useState<File | null>(null);

  // Generate export data in different formats
  const getExportData = () => {
    switch (activeTab) {
      case "json":
        return JSON.stringify(componentState, null, 2);
      case "url":
        return `${window.location.origin}${window.location.pathname}?settings=${encodeURIComponent(btoa(JSON.stringify(componentState)))}`;
      default:
        return JSON.stringify(componentState, null, 2);
    }
  };

  // Handle import from text
  const handleImport = () => {
    try {
      const parsedData = JSON.parse(importData);
      
      // Validate the imported data
      if (!parsedData.componentType || !parsedData.style) {
        throw new Error("Invalid component data format");
      }
      
      importSettings(parsedData);
      onClose();
      setImportData("");
      setImportError("");
    } catch (error) {
      setImportError("Invalid JSON format. Please check your data.");
    }
  };

  // Handle import from file
  const handleFileImport = async () => {
    if (!importFile) return;
    
    try {
      const text = await importFile.text();
      const parsedData = JSON.parse(text);
      
      // Validate the imported data
      if (!parsedData.componentType || !parsedData.style) {
        throw new Error("Invalid component data format");
      }
      
      importSettings(parsedData);
      onClose();
      setImportFile(null);
      setImportError("");
    } catch (error) {
      setImportError("Invalid file format. Please check your file.");
    }
  };

  // Copy export data to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(getExportData());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download export data as file
  const downloadFile = () => {
    const blob = new Blob([getExportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${componentState.componentType}-settings.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {mode === "export" ? "Export Settings" : "Import Settings"}
            </ModalHeader>
            <ModalBody>
              {mode === "export" ? (
                <>
                  <Tabs selectedKey={activeTab} onSelectionChange={setActiveTab as any}>
                    <Tab key="json" title="JSON">
                      <div className="mt-2">
                        <Textarea
                          value={getExportData()}
                          readOnly
                          rows={10}
                          className="font-mono text-sm"
                        />
                      </div>
                    </Tab>
                    <Tab key="url" title="Share URL">
                      <div className="mt-2">
                        <Textarea
                          value={getExportData()}
                          readOnly
                          rows={3}
                          className="font-mono text-sm"
                        />
                        <p className="text-small text-default-500 mt-2">
                          Share this URL to let others see your exact component configuration.
                        </p>
                      </div>
                    </Tab>
                  </Tabs>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="flat"
                      startContent={<Icon icon={copied ? "lucide:check" : "lucide:clipboard"} />}
                      onPress={copyToClipboard}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      color="primary"
                      startContent={<Icon icon="lucide:download" />}
                      onPress={downloadFile}
                    >
                      Download
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Tabs>
                    <Tab key="text" title="Paste JSON">
                      <div className="mt-2">
                        <Textarea
                          value={importData}
                          onChange={(e) => setImportData(e.target.value)}
                          placeholder="Paste your component settings JSON here..."
                          rows={10}
                          className="font-mono text-sm"
                        />
                      </div>
                    </Tab>
                    <Tab key="file" title="Upload File">
                      <div className="mt-4 flex flex-col items-center justify-center p-6 border-2 border-dashed border-default-300 rounded-lg">
                        <Icon icon="lucide:upload" className="text-4xl text-default-400 mb-2" />
                        <p className="mb-2">Drag and drop a JSON file or click to browse</p>
                        <Input
                          type="file"
                          accept=".json"
                          onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                        />
                      </div>
                    </Tab>
                  </Tabs>
                  
                  {importError && (
                    <div className="mt-2 p-2 text-danger text-small bg-danger-50 rounded">
                      {importError}
                    </div>
                  )}
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              {mode === "import" && (
                <Button 
                  color="primary" 
                  onPress={importFile ? handleFileImport : handleImport}
                  isDisabled={!importData && !importFile}
                >
                  Import
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};