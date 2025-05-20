
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function KeyboardShortcuts() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 text-xs"
        >
          Keyboard Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts for faster workflow
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="font-medium">Ctrl+Z</div>
            <div className="text-sm text-gray-500">Undo last change</div>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="font-medium">Ctrl+Y or Ctrl+Shift+Z</div>
            <div className="text-sm text-gray-500">Redo last change</div>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="font-medium">Alt+R</div>
            <div className="text-sm text-gray-500">Reset button style</div>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="font-medium">Alt+A</div>
            <div className="text-sm text-gray-500">Open Animation Builder</div>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="font-medium">Alt+T</div>
            <div className="text-sm text-gray-500">Open Theme Selector</div>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="font-medium">Alt+C</div>
            <div className="text-sm text-gray-500">Switch to Code tab</div>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="font-medium">Alt+S</div>
            <div className="text-sm text-gray-500">Switch to Style tab</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
