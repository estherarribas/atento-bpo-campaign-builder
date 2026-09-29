import React from 'react';
import { useCampaign } from '../../context/CampaignContext';
import {
  SlidersHorizontal,
  Headphones,
  Bot,
  Coins,
  GitCompare,
  FileSpreadsheet,
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { currentStep, setCurrentStep } = useCampaign();

  const steps = [
    { id: 1, label: 'Contexto & Sector', icon: SlidersHorizontal },
    { id: 2, label: 'Canales Omnicanal', icon: Headphones },
    { id: 3, label: 'IA & Automatización', icon: Bot },
    { id: 4, label: 'Costes & Pricing', icon: Coins },
    { id: 5, label: 'Comparativa What-If', icon: GitCompare },
    { id: 6, label: 'Propuesta Ejecutiva', icon: FileSpreadsheet },
  ];

  return (
    <nav className="bg-white border-b border-atento-border shadow-sm sticky top-[61px] z-40 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-atento-navy text-white shadow-sm'
                    : isCompleted
                    ? 'text-atento-navy hover:bg-slate-100'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isActive
                      ? 'bg-atento-cyan text-atento-navy'
                      : isCompleted
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {step.id}
                </span>
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-atento-cyan' : 'text-slate-400'}`} />
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
