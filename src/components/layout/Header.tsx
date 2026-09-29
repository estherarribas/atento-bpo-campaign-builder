import React from 'react';
import { useCampaign } from '../../context/CampaignContext';
import { getCountryById } from '../../data/countries';
import {
  Eye,
  EyeOff,
  Download,
  Building,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    clientName,
    setClientName,
    campaignName,
    financial,
    isClientPresentationMode,
    setIsClientPresentationMode,
    setCurrentStep,
  } = useCampaign();

  const country = getCountryById(financial.deliveryCountryId);

  return (
    <header className="bg-atento-navy text-white sticky top-0 z-50 shadow-md border-b border-atento-navy-dark no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Campaign Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-atento-cyan flex items-center justify-center shadow-glow">
              <span className="font-extrabold text-atento-navy text-xl tracking-tighter">A</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">ATENTO</span>
                <span className="text-xs bg-atento-navy-light text-atento-cyan font-semibold px-2 py-0.5 rounded border border-atento-cyan/30">
                  CPQ BUILDER
                </span>
              </div>
              <p className="text-xs text-slate-300 hidden sm:block">BPO Workforce & Financial Modeler</p>
            </div>
          </div>

          <div className="h-6 w-px bg-white/20 hidden md:block" />

          {/* Client & Campaign Name Input */}
          <div className="hidden lg:flex items-center gap-2 bg-atento-navy-light/60 px-3 py-1.5 rounded-lg border border-white/10">
            <Building className="w-4 h-4 text-atento-cyan" />
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="bg-transparent text-sm font-semibold text-white focus:outline-none border-b border-transparent focus:border-atento-cyan w-36 transition-colors"
              title="Nombre del cliente"
            />
            <span className="text-white/40">|</span>
            <span className="text-xs text-slate-300 truncate max-w-xs">{campaignName}</span>
          </div>
        </div>

        {/* Right Controls: Country badge, Client Mode Switch, Export Action */}
        <div className="flex items-center gap-3">
          {/* Delivery country badge */}
          <div className="flex items-center gap-1.5 bg-atento-navy-light/80 text-xs px-2.5 py-1.5 rounded-lg border border-white/10">
            <span className="text-base">{country.flag}</span>
            <span className="text-slate-200 font-medium hidden sm:inline">{country.name.split(' ')[0]}</span>
            {financial.nearshoreSharePct > 0 && (
              <span className="bg-atento-cyan/20 text-atento-cyan font-bold px-1.5 py-0.2 rounded text-[10px]">
                +{financial.nearshoreSharePct}% Nearshore
              </span>
            )}
          </div>

          {/* Client Presentation Mode Toggle */}
          <button
            onClick={() => setIsClientPresentationMode(!isClientPresentationMode)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
              isClientPresentationMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-sm'
                : 'bg-white/10 text-slate-200 border-white/20 hover:bg-white/15'
            }`}
            title="Activa el Modo Cliente para ocultar márgenes internos y costes salariales durante presentaciones en vivo"
          >
            {isClientPresentationMode ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-amber-300" />
                <span>Modo Cliente ACTIVO</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-300" />
                <span>Modo Interno (Márgenes ON)</span>
              </>
            )}
          </button>

          {/* Quick PDF Proposal Button */}
          <button
            onClick={() => setCurrentStep(6)}
            className="flex items-center gap-1.5 bg-atento-cyan hover:bg-atento-cyan-light text-atento-navy font-bold text-xs px-3.5 py-2 rounded-lg shadow-glow transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Propuesta Ejecutiva</span>
          </button>
        </div>
      </div>
    </header>
  );
};
