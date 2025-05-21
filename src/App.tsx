
import { ComponentWizardRoot } from "@/components/wizard/component-wizard-root";
import { ComponentWizardRoot as ComponentWizardProvider } from "@/contexts/component-wizard-root";

export default function App() {
  return (
    <ComponentWizardProvider>
      <div className="container mx-auto px-4 py-8">
        <ComponentWizardRoot />
      </div>
    </ComponentWizardProvider>
  );
}
