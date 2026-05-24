/**
 * CAEOS Wizard Page | صفحة المعالج التفاعلي
 *
 * L15 — Interactive Wizard Layer
 * Route: /wizard
 */

import WizardContainer from "@/components/wizard/WizardContainer";

export default function WizardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <WizardContainer />
    </main>
  );
}
