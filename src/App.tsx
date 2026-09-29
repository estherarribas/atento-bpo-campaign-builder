import React from 'react';
import { CampaignProvider, useCampaign } from './context/CampaignContext';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { LiveQuotationSidebar } from './components/sidebar/LiveQuotationSidebar';
import { Step1Context } from './components/steps/Step1Context';
import { Step2Channels } from './components/steps/Step2Channels';
import { Step3Automation } from './components/steps/Step3Automation';
import { Step4Financials } from './components/steps/Step4Financials';
import { Step5Scenarios } from './components/steps/Step5Scenarios';
import { Step6Proposal } from './components/steps/Step6Proposal';

const MainContent: React.FC = () => {
  const { currentStep } = useCampaign();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Context />;
      case 2:
        return <Step2Channels />;
      case 3:
        return <Step3Automation />;
      case 4:
        return <Step4Financials />;
      case 5:
        return <Step5Scenarios />;
      case 6:
        return <Step6Proposal />;
      default:
        return <Step1Context />;
    }
  };

  // En el paso 6 (Propuesta Ejecutiva), se muestra a ancho completo para facilitar la lectura e impresión
  const isProposalStep = currentStep === 6;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {isProposalStep ? (
        <div className="w-full">{renderCurrentStep()}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main 8-column workspace */}
          <div className="lg:col-span-8">{renderCurrentStep()}</div>

          {/* Sticky 4-column Live Quotation Sidebar (from Stitch Design) */}
          <div className="lg:col-span-4">
            <LiveQuotationSidebar />
          </div>
        </div>
      )}
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <CampaignProvider>
      <div className="min-h-screen bg-atento-surface text-slate-800 flex flex-col font-sans">
        <Header />
        <Navigation />
        <div className="flex-1">
          <MainContent />
        </div>
        <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400 no-print">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
            <span>© {new Date().getFullYear()} ATENTO. Todos los derechos reservados. Confidencial - Uso Interno.</span>
            <span className="font-semibold text-slate-500">BPO Campaign Builder v1.0.0 | Powered by Stitch Design System</span>
          </div>
        </footer>
      </div>
    </CampaignProvider>
  );
};

export default App;
