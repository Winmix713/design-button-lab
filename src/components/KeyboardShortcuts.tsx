
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Keyboard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ShortcutProps {
  keys: string[];
  description: string;
}

const Shortcut = ({ keys, description }: ShortcutProps) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-sm text-slate-700 dark:text-slate-300">{description}</span>
    <div className="flex gap-1">
      {keys.map((key, index) => (
        <kbd
          key={index}
          className="px-2 py-1 text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200 rounded dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
        >
          {key}
        </kbd>
      ))}
    </div>
  </div>
);

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-white dark:bg-slate-800 shadow-md"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Keyboard Shortcuts</DialogTitle>
          </DialogHeader>
          <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-800">
            <Shortcut keys={["Ctrl", "Z"]} description="Undo last change" />
            <Shortcut keys={["Ctrl", "Y"]} description="Redo last undone change" />
            <Shortcut keys={["Alt", "R"]} description="Reset to default styles" />
            <Shortcut keys={["Ctrl", "S"]} description="Save current preset" />
            <Shortcut keys={["Ctrl", "C"]} description="Copy generated code" />
            <Shortcut keys={["?"]} description="Show keyboard shortcuts" />
          </div>
          <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
            Note: On Mac, use Command (⌘) instead of Ctrl
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
