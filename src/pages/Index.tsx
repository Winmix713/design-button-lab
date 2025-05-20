
import { ButtonWizard } from "@/components/ButtonWizard";
import { ButtonWizardProvider } from "@/contexts/ButtonWizardContext";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-10 px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">
            Button Wizard
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Create, customize, and export beautiful buttons with our all-in-one button generator
          </p>
        </header>
        <ButtonWizardProvider>
          <ButtonWizard />
          <KeyboardShortcuts />
        </ButtonWizardProvider>
      </div>
    </div>
  );
};

export default Index;
